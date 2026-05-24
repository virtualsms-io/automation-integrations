# @virtualsms/api-client

Shared TypeScript REST client used by the VirtualSMS [n8n](../n8n-node), [Activepieces](../activepieces-piece), and [Zapier](../zapier-app) integrations. Wraps the live `customer_api` surface at `https://virtualsms.io/api/v1/customer/*` plus the `/api/v1/price` lookup.

This package is **internal to this monorepo** — it is not published to npm. Each integration calls the API through its framework's own HTTP layer (n8n `httpRequestWithAuthentication`, Activepieces `httpClient`, Zapier `z.request`); this package is the canonical source for path + type definitions.

## Verified live surface (2026-05-24)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/customer/balance` | X-API-Key | account balance |
| GET | `/api/v1/customer/services` | X-API-Key | service catalog |
| GET | `/api/v1/customer/countries` | X-API-Key | country catalog |
| GET | `/api/v1/price` | none | price lookup for a service/country combo |
| POST | `/api/v1/customer/purchase` | X-API-Key | buy number, body `{country, service}` |
| GET | `/api/v1/customer/order/{uuid}` | X-API-Key | status + received SMS |
| POST | `/api/v1/customer/cancel/{uuid}` | X-API-Key | cancel (returns 425 inside 120s cooldown) |
| GET | `/api/v1/customer/orders` | X-API-Key | list orders |

## Surface

```ts
import { VirtualSmsClient } from "@virtualsms/api-client";

const client = new VirtualSmsClient({ apiKey: process.env.VIRTUALSMS_API_KEY! });

await client.getBalance();
await client.listServices();
await client.listCountries();
await client.checkPrice("wa", "GB");
const order = await client.buyNumber({ service: "wa", country: "AR" });
await client.getOrderStatus(order.order_id);
await client.cancelOrder(order.order_id);   // returns 425 inside 120s cooldown
await client.listOrders({ limit: 50 });
```

## Auth

`X-API-Key` header. Get keys at https://virtualsms.io → Settings → API Keys.

## Errors

Non-2xx → `VirtualSmsApiError` with `status` and `body`. Notable:
- **425 Too Early** on cancel within the 120-second cooldown window
- **402 Payment Required** on purchase with insufficient balance — body includes `required` and `current` amounts
- **400** on purchase missing `country` or `service`, or with an unknown combo

## Notes

- `service` is the **short code** (`wa`, `tg`, `aws`) — not a slug (`whatsapp`). Use `listServices()` to discover codes.
- `country` is the **ISO 2-letter code** (`US`, `GB`, `AR`).
- The `purchase` response uses `country`/`service` keys; the `orders` list uses `country_id`/`service_id`. Both are documented in the types.
- There is **no customer-callable "mark done" action** — orders terminate as `received`, `expired`, or `cancelled`.
- There is **no customer-facing webhook subscription endpoint** today. Triggers in the three integrations are all polling-based.
