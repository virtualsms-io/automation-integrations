# VirtualSMS — Automation Integrations

Official integrations for the [VirtualSMS](https://virtualsms.io) SMS verification API across no-code automation platforms.

## Packages

| Package | Platform | Status |
|---|---|---|
| [`@virtualsms/api-client`](./packages/api-client) | Shared TypeScript REST client (internal) | scaffolded |
| [`n8n-nodes-virtualsms`](./packages/n8n-node) | [n8n](https://n8n.io) community node | scaffolded |
| [`@virtualsms/activepieces-piece`](./packages/activepieces-piece) | [Activepieces](https://activepieces.com) piece (for upstream PR) | scaffolded |
| [`@virtualsms/zapier-app`](./packages/zapier-app) | [Zapier](https://zapier.com) public integration (CLI-built) | scaffolded |

## What VirtualSMS does

VirtualSMS provides real-SIM phone numbers for SMS verification (OTP) across 2,500+ services and 145+ countries. REST API + webhook delivery + MCP server. See [virtualsms.io](https://virtualsms.io).

## Common surface across all three platforms

**Triggers**
- `new_sms_received` — webhook-driven (Activepieces, Zapier, n8n trigger node)
- `rental_expired` — polling-driven
- `low_balance` — polling-driven

**Actions**
- `buy_number` — rent a phone for a service + country
- `list_services` — list available services (optionally filtered by country)
- `list_countries` — list available countries (optionally filtered by service)
- `cancel_order` — cancel a rental & refund
- `get_rental_status` — get current status / received SMS code
- `get_balance` — account balance

## Build

```bash
npm install
npm run build
```

Per-package build/publish instructions live in each package's README.

## License

MIT
