# VirtualSMS — Zapier Integration

Zapier integration for [VirtualSMS](https://virtualsms.io). Built with [`zapier-platform-core`](https://github.com/zapier/zapier-platform), deployed via `zapier-platform-cli`.

## Triggers (all polling)

| Key | Description |
|---|---|
| `order_received_sms` | Fires once per order newly transitioning to `received` |
| `order_expired` | Fires once per order newly transitioning to `expired` |
| `low_balance` | Debounced — fires once per crossing of a configurable USD threshold |

> VirtualSMS does not currently expose a customer-facing outbound webhook subscription endpoint, so triggers are polling-only. Zapier dedupes by `id` field automatically.

## Actions (Creates)

- `buy_number` — purchase a number (`service` code + ISO `country`)
- `cancel_order` — cancel an order (HTTP 425 inside 120s cooldown)

## Searches

- `get_order_status` — current state + any received SMS for an order UUID
- `list_services` — full service catalog
- `list_countries` — country catalog with supported services
- `check_price` — unauthenticated price lookup for a service/country combo
- `get_balance` — current account balance

## Auth

Custom auth with `api_key` (required) + `base_url` (optional, defaults to `https://virtualsms.io`). Header `X-API-Key` is added on every request via the `beforeRequest` hook.

## Service codes

Services use **short codes**, not slugs: `wa` (WhatsApp), `tg` (Telegram), `aws` (7-Eleven), `bqo` (Caffe Nero), …

## Local dev

```bash
npm install
npm run build
npm install -g zapier-platform-cli
zapier login
zapier register "VirtualSMS — SMS Verification"
zapier validate
zapier push
```

See the repo-root [`PUBLISHING.md`](../../PUBLISHING.md) for the full submission flow.

## License

MIT
