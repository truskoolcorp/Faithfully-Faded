import 'server-only'
import { neon } from '@neondatabase/serverless'
import { META_VARIANTS } from './meta-product-feed.mjs'

// One read-only statement obtains a consistent snapshot of the reviewed SKUs.
// It does not reuse getOwnedBalance, whose missing-row fallback is zero and
// cannot distinguish a missing record from verified, exhausted stock.
export async function readMetaInventory({ signal }) {
  const url = process.env.COMMERCE_DATABASE_URL
  if (!url) throw new Error('Commerce inventory unavailable')
  const sql = neon(url)
  return sql.query(
    'SELECT sku, on_hand, reserved FROM commerce.inventory WHERE sku = ANY($1::text[])',
    [META_VARIANTS.map(v => v.sku)],
    { fetchOptions: { signal, cache: 'no-store' } },
  )
}
