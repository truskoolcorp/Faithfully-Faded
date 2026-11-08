# Faithfully Faded Meta product feed

## Status and scope

This implementation was prepared and reviewed against production commit
`fad3f9feb497576082de5da66833d55823b04161`. The authorized rollout is limited
to publishing this read-only feed and enabling its production feature flag.
It does not change checkout, inventory, product metadata, secrets, or Meta assets.
Meta catalog configuration is a separate activation step.

The endpoint is `https://www.faithfully-faded.com/api/meta-catalog`. It returns **404 by default**.
It requires both `FF_META_CATALOG_FEED_ENABLED=true` and
`VERCEL_ENV=production`. Preview, development and unknown environments return
404 even if the enable flag is present. Set the nonsecret enable flag only for
production, then deploy and verify the intended Git SHA. `/feed.xml` remains the existing blog
RSS feed and must not be used as a product feed.

## Source of truth

- Product metadata is read from the existing `lib/products.js` record.
- Only `hooded-baseball-jersey-dress` is allowed. Its four reviewed size SKUs
  are `FF-JERSEY-DRESS-S`, `FF-JERSEY-DRESS-M`, `FF-JERSEY-DRESS-L`, and
  `FF-JERSEY-DRESS-XL`; the only reviewed color is Maroon.
- The current price is $69 USD, but the feed uses the current source price
  instead of copying that price into another configuration.
- A single parameterized **SELECT** reads `sku`, `on_hand`, and `reserved`
  from the existing `commerce.inventory` ledger using the existing
  `COMMERCE_DATABASE_URL` server setting. No inventory writes are made.
- Availability is in stock only when a complete, valid snapshot establishes
  that on-hand minus reserved is positive. Each variant exports the exact
  validated sellable balance, clamped at zero, as
  `g:quantity_to_sell_on_facebook`. The existing Meta commerce catalog requires
  this field. Quantities are transmitted publicly to Meta, consistently with
  the existing public inventory endpoint; on-hand and reserved are not exported.
  Availability and quantity are derived from the same snapshot and the same
  eligibility check. No quantity is fabricated, rounded, or manually copied.
- The other five storefront designs are excluded. Adding a product to the
  storefront cannot silently add it to this feed.
- The feed uses the existing product photograph and canonical product page,
  not the Snipcart validation API. It does not claim variant preselection on
  the product page. The shopper still chooses a size there.
- Items use retail condition `new`. Confirm that condition, the source price,
  current photograph and physical inventory before enabling the feed. No
  GTIN, material, gender, shipping timeframe or preorder fulfillment promise
  is invented.

## Failure behavior

Inventory failures, missing or duplicate rows, invalid values, unexpected
SKUs, and a five-second timeout return HTTP 200 with **all four stable IDs
marked out of stock with quantity zero**. Keeping the rows avoids an empty replacement feed.
The `X-FF-Inventory-Status` header reports `verified` or `unavailable`.
Provider details and credentials are never included in feed responses or
diagnostic messages. The database fetch receives an abort signal on timeout.

If product metadata no longer fits the reviewed shape, the endpoint returns
503 rather than a successful empty catalog. A change from owned in-stock to
preorder status suppresses all variants and exports zero quantities even if the
ledger still has stock.
All responses disable browser and CDN caching.

**This is not an immediate Meta kill switch.** Meta must fetch and accept a
successful out-of-stock response before its catalog changes. A network failure,
503, disabled endpoint, rejected feed, paused schedule, or Meta import delay
can leave previous remote availability intact. Monitoring and a manual pause
procedure are activation prerequisites. Database freshness and correctness
remain the responsibility of the existing inventory ledger.

## Activation checklist

1. Confirm the old catalog's exact ID, owning business, connected Page/shop,
   all active data sources, last import result and any ads depending on it.
   The screenshot's 85-product legacy catalog does not identify its source.
2. Verify the current product and variant inventory against the production
   storefront, its images and physical inventory. Tests use synthetic counts;
   production availability must be rechecked at activation time. The public
   inventory endpoint reported S=0, M=3, L=4, XL=2 on 2026-11-08 during rollout
   preparation; this is a point-in-time ledger snapshot, not a physical count.
3. Obtain authorization to deploy/enable the endpoint and for the specific
   Meta catalog/source changes. Production deployment and the nonsecret flag
   were authorized on 2026-11-08. Confirm HTTP 200, valid XML, four expected
   variant IDs, exact current sellable quantities, consistent availability,
   and `X-FF-Inventory-Status: verified`
   before supplying the endpoint to Meta.
4. Validate the actual endpoint in Meta before promoting it. Verify supported
   catalog fields, item approval, destination links and any required business
   or shop settings. Initial Meta validation required
   `quantity_to_sell_on_facebook`; confirm the updated field is recognized
   before completing import. Meta ingestion and item approval remain separate
   from successful feed deployment.
5. Reconcile the original source before changing it. A new feed does not
   automatically remove 85 products owned by another feed. A legacy partner
   integration may re-add removed products until its sync is addressed.
   Replacement behavior must be scoped to the intended source and a reviewed
   complete snapshot; never replace unrelated source products accidentally.
6. Check existing product IDs before cutover. The proposed IDs match the
   current stock SKUs, not any unverified legacy Meta IDs. Any later Meta
   pixel/CAPI content IDs must match the selected catalog strategy. The Café
   pixel is a separate asset and does not perform product synchronization.
7. Inspect the accepted import and a sample of all sizes. Establish failure
   alerts and a manual ad/shop suppression plan before relying on the feed.

## Verification and rollback

- `node --test tests/*.test.cjs`: repository regression tests plus feed tests.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: full Next.js production build.
- Built-server HTTP smoke checks (loopback only, database environment removed):
  disabled production returns 404; enabled production with missing inventory
  returns valid XML with four out-of-stock variants and zero quantities; enabled preview returns
  404. XML is parsed with Python's ElementTree, not just string matching.
- Every inventory query in tests is mocked. No live database or Meta request
  is needed or made. Local evidence is not a feed to upload.

No separate lint or type-check script is configured in this repository; the
Next.js build performs its configured lint/type validation. No new dependency
is required by this patch.

To withdraw the feed, first pause or suppress the affected Meta shop/ad items
using the approved catalog procedure. Setting `FF_META_CATALOG_FEED_ENABLED`
to `false` and redeploying returns 404 but does **not** clear Meta's cached
availability. For an application regression, restore the last known-good
production deployment through Vercel; do not mutate the inventory ledger.
