# Meta website checkout bridge

## Purpose and public contract

Configure Meta's checkout URL as `https://www.faithfully-faded.com/checkout`.
Meta supplies `products=ID:quantity,ID:quantity` and optional `coupon=CODE`.
RFC3986-encoded commas and colons are decoded once through URLSearchParams.
The four accepted retailer IDs are FF-JERSEY-DRESS-S, FF-JERSEY-DRESS-M,
FF-JERSEY-DRESS-L and FF-JERSEY-DRESS-XL. They map to Snipcart product
hooded-baseball-jersey-dress with Color=Maroon and the corresponding Size.
No other storefront product or historical dropshipping item is accepted.

`/api/meta-checkout` is a read-only resolver. It derives metadata and price
from the current product source and availability from a complete, validated
snapshot of the existing inventory ledger. Query values cannot override price,
validation URL, images, metadata or inventory. Malformed quantities, duplicate
IDs, unknown IDs, duplicate known query fields and excessive input are rejected.
The maximum permitted URL quantity is 999 per variant and live stock is always
the tighter limit. Sold-out/insufficient stock returns 409. Inventory failures
and timeouts return 503, never an estimated or fabricated balance.

The page and API require `FF_META_CHECKOUT_ENABLED=true` and
`VERCEL_ENV=production`. They are disabled by default, including all preview
and development environments. The existing live Snipcart public key and
canonical `/api/catalog/hooded-baseball-jersey-dress` validation endpoint remain
unchanged. No credential is added to this implementation.

## Shopper behavior

1. Await the actual Snipcart SDK and saved bag restoration.
2. Fetch current canonical product data and stock immediately before mutation.
3. If the bag has other items, ask the shopper before replacing them. Choosing
   to keep the existing bag does not apply the incoming selection.
4. Add/update exact selected variant quantities. Existing matching lines are
   updated, not incremented. Keep the original unrelated items until the new
   lines have been added successfully, then remove them only after consent.
5. Apply an optional coupon through Snipcart's own discount API. Invalid,
   expired or unavailable discounts produce an explicit warning. No discount
   is invented, created or assumed from the incoming URL.
6. Verify final SDK items, quantities, base prices and currency before opening
   the normal Snipcart bag. Display the item subtotal as **before discounts,
   shipping and tax**. Snipcart shows the final payable total and owns checkout.

The original URL stays in place; fbclid, cart_origin and UTM parameters are not
stripped or sent to the resolver. This does not add any new analytics or pixel.
The page is mobile-responsive, has status/error announcements, a no-JavaScript
notice and links to shipping, returns and contact policies.

No order confirmation, payment authorization, customer-data entry, inventory
write, webhook change or legal agreement is performed by this bridge. The
shopper must review the bag and explicitly place their own order. Existing
Snipcart product validation and stock checks remain in force. The read is not
an inventory reservation; simultaneous purchases and the ledger's existing
webhook consistency model remain outside this bridge's scope.

## Interrupted and repeated flows

- The mutation service permits only one in-flight flow per SDK. Double clicks
  do not create overlapping reconciliation.
- Reload/retry reconciles to the requested quantities from current cart state,
  so a partial successful add is not intentionally added again.
- New checkout query parameters cancel subsequent old operations and wait for
  any already submitted SDK operation to settle before proceeding.
- Navigating away cancels reads and all later mutations. An SDK request already
  submitted cannot be canceled; the implementation does not claim otherwise.
- An unresolved SDK operation triggers a visible review/reload warning after
  20 seconds, without releasing the lock or automatically replaying it.
- Ambiguous duplicate lines and unexpected final cart changes fail safely and
  ask the shopper to inspect the bag. No automatic rollback risks deleting
  changes made by the shopper in another view.

## Validation and rollout

Run `node --test tests/*.test.cjs` and `NEXT_TELEMETRY_DISABLED=1 npm run build`.
Tests isolate their synthetic inventory/SDK fixtures from production. No live
order, customer, coupon or stock record is created by tests. Local browser
harnesses must block all external network requests and never be deployed.

Release gate: review the final code and exact remote commit, verify successful
Vercel build/CI, enable the nonsecret flag only for production, then inspect
this unlinked checkout route with actual catalog products before configuring
Meta. No test Snipcart public key is currently configured. Local browser
launch/loopback access is restricted in this execution environment; local
unit and build evidence alone is not actual Snipcart integration verification.

Required real-cart-only checks (stop before payment or order submission):
- Real available variant with quantity 1; correct base price and size.
- Repeat the same link; no quantity inflation or duplicate variant.
- Multiple sizes; exact requested quantities and item subtotal.
- Sold-out and excessive quantities; no incoming-cart mutation.
- Invalid coupon; visible warning and normal cart total preserved.
- Existing unrelated bag; no silent deletion and explicit replacement choice.
- Actual saved-item SDK update, including custom-field options.
- Mobile-sized layout and Meta's checkout validator.
A valid coupon test requires an already-existing, verified coupon; do not create
one or claim a discount works when no valid coupon is available.

Do not submit the Meta URL or publish the shop until production cart-only checks
pass. Use Meta's preview mode and its validation tool before the public shop
cutover. Capture whether each stage was passed, failed or not run.

Rollback: disable FF_META_CHECKOUT_ENABLED and redeploy, or restore the last
known-good Vercel production deployment. Remove/replace the Meta checkout URL
if it was activated. Do not alter stock, existing product data or keys.

## Sources

- https://developers.facebook.com/documentation/ads-commerce/commerce-platform/setup-checkout-url
- https://docs.snipcart.com/v3/sdk/api
- https://docs.snipcart.com/v3/sdk/reference
