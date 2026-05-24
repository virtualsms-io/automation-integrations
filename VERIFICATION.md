# Live API verification — 2026-05-24

Every endpoint used by the three integrations was tested end-to-end against `https://virtualsms.io` with a real X-API-Key on the date above.

## Read endpoints

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1/customer/balance` | ✅ 200 | `{balance: 49.39, success: true}` |
| `GET /api/v1/customer/services` | ✅ 200 | 719 services, shape `{services: [{service_id, service_name, base_price}]}` |
| `GET /api/v1/customer/countries` | ✅ 200 | 59 countries, shape `{countries: [{country_id, country_name, min_price, services[]}]}` |
| `GET /api/v1/customer/orders?limit=N` | ✅ 200 | `{count, orders[]}` — list items use `service_id`/`country_id` (different from purchase/status responses) |
| `GET /api/v1/customer/order/{uuid}` | ✅ 200 | Adds `sms_received: bool` to the purchase shape |
| `GET /api/v1/price?service=&country=` | ✅ 200 | Unauthenticated. Returns `{success, price, service_name, country_name, error?}` |

## Write path round-trip

Real money in, real money out:

1. `POST /api/v1/customer/purchase` body `{service: "wa", country: "AR"}` → 200, `order_id` `7e44ebb5-9a55-4bd8-a4e9-7f226f9d5ebd`, phone `541127399874`, $0.80 charged.
2. `GET /api/v1/customer/order/{id}` → status `waiting`, `sms_received: false`.
3. `POST /api/v1/customer/cancel/{id}` (within 120s) → **HTTP 425 Too Early**, body `"Cannot cancel within 120 seconds of purchase. Please wait 118 seconds."`
4. `POST /api/v1/customer/cancel/{id}` (after cooldown) → 200, `{success: true, status: "cancelled", refund_amount: 0.80}`
5. Balance restored to original value.
6. `POST /api/v1/customer/cancel/{id}` (after already cancelled) → 400, `"Cannot cancel order with status: cancelled"`.

## Endpoints I originally wired that don't exist

| What I wrongly wired | Returns | Correct path |
|---|---|---|
| `POST /api/v1/numbers/rent` | 404 | `POST /api/v1/customer/purchase` |
| `GET /api/v1/numbers/{id}/status` | 404 | `GET /api/v1/customer/order/{uuid}` |
| `POST /api/v1/numbers/{id}/cancel` | 404 | `POST /api/v1/customer/cancel/{uuid}` |
| `POST /api/v1/numbers/{id}/done` | 404 | **dropped — no customer "done" action exists** |
| `POST /api/v1/webhooks` | 404 | **dropped — no customer webhook-sub endpoint exists; triggers became polling** |

Root cause: the OpenAPI spec at `virtualsms.io/openapi.yaml` documents both surfaces (`/api/v1/numbers/*` and `/api/v1/customer/*`) as if they're interchangeable. They're not — only the `customer/*` paths are deployed for X-API-Key clients. The OpenAPI spec needs a fix separately.

## Behavioral oddities the integrations should handle

- **Status state machine.** Live values observed in `/api/v1/customer/orders`: `waiting` (initial), `completed` (SMS arrived — terminal success), `expired` (timeout — terminal failure), `cancelled` (user cancel + refund — terminal). **There is no `received` status.** Triggers and types must filter on `completed`, not `received`.
- **SMS content shape.** `GET /api/v1/customer/order/{id}` returns `messages: [{sender, content, received_at}]`, NOT top-level `sms_code` / `sms_text` / `sms_sender` / `sms_received_at`. The top-level `sms_received: boolean` is informational only — observed live, it can read `false` even when the order is `status=completed` with a non-empty `messages` array.
- **Response field naming inconsistency.** `customer/purchase` and `customer/order/{id}` return `service` + `country`; `customer/orders` returns `service_id` + `country_id`. The types in `@virtualsms/api-client` reflect both shapes.
- **Service codes are not slugs.** WhatsApp is `wa`, Telegram is `tg`, 7-Eleven is `aws`. Customers WILL try `whatsapp` and get 400. Mitigation: `list_services` action surfaces both `service_id` and `service_name` for discovery.
- **HTTP 425 Too Early** on premature cancel — uncommon status, but the right one. The `cancel_available_at` field in the purchase response tells the workflow when to retry.
- **`/api/v1/balance` and `/api/v1/customer/balance` both work with X-API-Key** but return slightly different shapes (the customer one is `{balance, success}`; the bare one adds `total_credits`, `total_spent`). Integrations use the customer one for consistency.

## Codex review (post-rewrite)

Independent review by OpenAI Codex CLI on commit `7cc5ca2` flagged two findings, both validated against live API:

1. **[P1] Polling triggers checked the wrong status value.** Codex said the value was `sms_received`; live API showed `completed`. Either way, my original `received` check would never fire. Fixed in commit `<next>`.
2. **[P2] `OrderStatusResponse` type had wrong shape.** Codex correctly identified the response uses a `messages` array, not top-level `sms_*` fields. Fixed.

The verification-after-AI-suggestion pattern caught a wrinkle: codex was directionally right but specifically wrong on the value. Always verify against live data before applying AI review suggestions.
