import { getProduct } from '@/lib/products'
import { readMetaInventory } from '@/lib/meta-inventory'
import { createCheckoutHandler } from '@/lib/meta-checkout.mjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = createCheckoutHandler({
  getProduct,
  readInventory: readMetaInventory,
  enabled: () => process.env.FF_META_CHECKOUT_ENABLED === 'true',
  environment: () => process.env.VERCEL_ENV,
})
