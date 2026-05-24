# @activepieces/piece-virtualsms

[Activepieces](https://activepieces.com) piece for [VirtualSMS](https://virtualsms.io) — real-SIM SMS verification across 145+ countries and 2,500+ services.

## Actions

- **Buy Number** — purchase a phone for a service code + ISO country code
- **Get Order Status** — current status and received SMS for an order UUID
- **Cancel Order** — cancel + refund (returns HTTP 425 inside 120-second cooldown)
- **List Services** — full service catalog (codes + base prices)
- **List Countries** — country catalog (ISO codes, min prices, supported services)
- **Check Price** — look up cost for a service/country combo before purchase
- **Get Balance** — account balance

## Triggers

All polling-based (VirtualSMS does not yet expose a customer-facing outbound webhook):

- **Order Received SMS** — fires once per order newly transitioning to `received`
- **Order Expired** — fires once per order newly transitioning to `expired`
- **Low Balance** — fires once when balance crosses below threshold

## Auth

`X-API-Key` from https://virtualsms.io → Settings → API Keys.

## Service codes

Services use short codes (`wa`, `tg`, `aws`), not slugs. Use **List Services** to discover.

## Submission to upstream Activepieces

This package is built to be merged into the [activepieces/activepieces](https://github.com/activepieces/activepieces) monorepo at `packages/pieces/community/virtualsms/`. Source-of-truth lives in [virtualsms-io/automation-integrations](https://github.com/virtualsms-io/automation-integrations).

See the repo-root [`PUBLISHING.md`](../../PUBLISHING.md) for the upstream PR flow.

## License

MIT
