import { GET as resolveMetaCheckout } from '@/app/api/meta-checkout/route'
import CheckoutBridge from './CheckoutBridge'

export const metadata = {
  title: 'Checkout | Faithfully Faded',
  robots: { index: false, follow: false },
  referrer: 'strict-origin',
}
export const dynamic = 'force-dynamic'

export default async function CheckoutPage({ searchParams }) {
  const enabled = process.env.FF_META_CHECKOUT_ENABLED === 'true' && process.env.VERCEL_ENV === 'production'
  const query = new URLSearchParams()
  const params = await searchParams
  for (const key of ['products', 'coupon']) {
    const value = params?.[key]
    for (const entry of Array.isArray(value) ? value : value === undefined ? [] : [value]) query.append(key, entry)
  }
  let initialItems = []
  if (enabled && query.has('products')) {
    try {
      // Reuse the same read-only stock and price checks as the browser cart.
      const response = await resolveMetaCheckout(new Request('https://www.faithfully-faded.com/api/meta-checkout?' + query))
      if (response.ok) initialItems = (await response.json()).items || []
    } catch { /* The client retains its normal retry/error path. */ }
  }
  return <CheckoutBridge enabled={enabled} initialItems={initialItems} />
}
