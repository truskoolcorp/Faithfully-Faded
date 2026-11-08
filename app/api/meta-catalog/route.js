import { getProduct } from '@/lib/products'
import { readMetaInventory } from '@/lib/meta-inventory'
import { createMetaFeedHandler } from '@/lib/meta-product-feed.mjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

export const GET = createMetaFeedHandler({
  getProduct,
  readInventory: readMetaInventory,
  enabled: () => process.env.FF_META_CATALOG_FEED_ENABLED === 'true',
  environment: () => process.env.VERCEL_ENV,
  warn: message => console.warn(message),
})
