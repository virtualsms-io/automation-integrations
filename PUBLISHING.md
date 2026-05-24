# Publishing checklist

The three integrations are built and verified end-to-end against the live `https://virtualsms.io` API (see `VERIFICATION.md` for the test transcript).

## 1. Push the monorepo to GitHub

```bash
gh repo create virtualsms-io/automation-integrations --public --license=MIT
git remote add origin git@github.com:virtualsms-io/automation-integrations.git
git push -u origin main
```

## 2. n8n community node — `n8n-nodes-virtualsms`

**Prereq decisions (brief §5):** npm account → use the `virtualsms-io` org account (enable 2FA first). For the verified-node badge (n8n requirement from May 2026), publish via GitHub Actions with `--provenance`.

**Publish from CI (recommended):**

1. Create npm automation token under the `virtualsms-io` npm org → store as `NPM_TOKEN` repo secret in `virtualsms-io/automation-integrations`.
2. Add `.github/workflows/publish-n8n-node.yml` (TODO — not in initial commit) that:
   - triggers on tag `n8n-v*`
   - runs `npm ci && npm run build --workspace=n8n-nodes-virtualsms`
   - calls `npm publish --provenance --access public` from `packages/n8n-node/`
3. Tag and push: `git tag n8n-v0.1.0 && git push --tags`.

**Or publish manually (no provenance — verified-node badge unavailable):**

```bash
cd packages/n8n-node
npm login
npm publish --access public
```

**Then submit to n8n Creator Portal:** https://creators.n8n.io → New Node → paste npm package name. Verification review takes ~1–2 weeks.

**Verify:**
- `npmjs.com/package/n8n-nodes-virtualsms` returns 200
- Searching "virtualsms" in the n8n UI Community Nodes panel finds it

## 3. Activepieces piece — upstream PR

```bash
# 1. Fork on GitHub: activepieces/activepieces  →  virtualsms-io/activepieces
gh repo fork activepieces/activepieces --clone=true --remote=true
cd activepieces
git checkout -b feat/piece-virtualsms

# 2. Generate the piece scaffold using their Nx generator
npx nx g @activepieces/pieces:new-piece --name=virtualsms --displayName="VirtualSMS"

# 3. Copy our src/ into the generated piece dir
cp -R ../automation-integrations/packages/activepieces-piece/src/* \
      packages/pieces/community/virtualsms/src/

# 4. Reconcile package.json with the scaffold's conventions (peerDeps, exports, etc.)
#    Merge our `description` and `keywords` into the scaffold's package.json.

# 5. Build & lint per their conventions
npx nx build pieces-virtualsms
npx nx lint  pieces-virtualsms

# 6. Open PR upstream
gh pr create \
  --repo activepieces/activepieces \
  --title "feat(pieces): add VirtualSMS — real-SIM SMS verification" \
  --body  "$(cat ../automation-integrations/packages/activepieces-piece/README.md)"
```

**Verify:** PR merged into `activepieces/activepieces` `main`. Once merged it appears in the next Activepieces Cloud release and any self-hosted instance that updates.

## 4. Zapier integration — CLI deploy

**Prereq decisions:** Use a dedicated Zapier developer account (recommended) or your existing one. Branded display name: "VirtualSMS — SMS Verification".

```bash
cd packages/zapier-app

npm install -g zapier-platform-cli
zapier login
zapier register "VirtualSMS — SMS Verification"
# creates an integration record on Zapier and writes .zapierapprc (git-ignored)

npm run build
zapier push

zapier validate

# (later) promote 0.1.0 to production after Zapier QA review passes
zapier promote 0.1.0
```

**Listing copy:** clone positioning from MobileSMS.io (per brief §4.1 and §9):

> Disposable phone numbers for SMS verification — short-term temporary use and long-term rentals. Real-SIM mobile numbers across 145+ countries. Buy a number, receive OTP codes via API.

**Verify:** `zapier.com/apps/virtualsms/integrations` returns 200 (not 404) after Zapier promotes to public.

## 5. Post-launch verification

After each integration goes live, search engines should pick them up within 7-30 days:

- `site:zapier.com virtualsms`
- `site:n8n.io virtualsms`
- `site:activepieces.com virtualsms`

## 6. Known limitations to disclose in listings

These are real product gaps that affect the integration UX. Disclose in the listing description so users aren't surprised:

- **Triggers are polling-based** (typical 1–5 min lag depending on platform poll cadence). No outbound webhook subscription is supported on the VirtualSMS side today.
- **No "mark done" action** — orders terminate as `received`, `expired`, or `cancelled`. No customer-callable "done".
- **Cancel cooldown** — `cancel_order` returns HTTP 425 inside the 120-second window after purchase. Workflow authors should `Wait > 2 min` before cancel, or check `cancel_available_at` from the purchase response.
- **Service codes are short codes, not slugs** — `wa` (WhatsApp), `tg` (Telegram), `aws` (7-Eleven). Use `list_services` to discover.

## 7. Backend follow-up (optional, unblocks better trigger UX)

To convert the polling triggers back to webhook (REST hook), build a customer-facing outbound webhook subscription API in `ws-gateway`:

- `POST /api/v1/customer/webhooks` — body `{url, events?: ["sms.received"|"order.expired"|"balance.low"]}`, returns `{id, url, active}`
- `GET /api/v1/customer/webhooks` — list
- `DELETE /api/v1/customer/webhooks/{id}` — unsubscribe
- Wire into the existing inbound SMS-ingestion path so registered webhooks get fired

Estimated 4-6h on the gateway, then a v0.2 release of all three integrations swaps triggers back to webhook with no other behavior changes.
