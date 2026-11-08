import CheckoutBridge from './CheckoutBridge'

export const metadata = {
  title: 'Checkout | Faithfully Faded',
  robots: { index: false, follow: false },
  referrer: 'strict-origin',
}
export const dynamic = 'force-dynamic'

export default function CheckoutPage() {
  return <CheckoutBridge enabled={process.env.FF_META_CHECKOUT_ENABLED === 'true' && process.env.VERCEL_ENV === 'production'} />
}
