import './globals.css'
import CartButton from './CartButton'

export const metadata = {
  title: 'Faithfully Faded™ — Distinctive Apparel',
  description: 'Culture-first fashion for the unapologetically distinctive. Just be Blunt.',
  keywords: 'streetwear, fashion, apparel, Dallas, Faithfully Faded',
  openGraph: {
    title: 'Faithfully Faded™',
    description: 'Just be Blunt.',
    images: ['https://www.faithfully-faded.com/images/billboard.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faithfully Faded™',
    description: 'Just be Blunt.',
    images: ['https://www.faithfully-faded.com/images/billboard.png'],
  },
}

export default function RootLayout({ children }) {
  // Preview checkouts are disabled until a dedicated Snipcart TEST public key is set.
  // Production retains the existing LIVE public key.
  const snipcartKey = process.env.VERCEL_ENV === 'production'
    ? 'NTU5OGE4OTgtNmEyOS00NWI0LWIzMTUtMjBkMjQ2NDFjN2MxNjM5MTMzMjIwODc1MTU2Njcz'
    : process.env.NEXT_PUBLIC_SNIPCART_TEST_API_KEY || ''
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
        <link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.7.5/default/snipcart.css" />
      </head>
      <body>
        {children}
        <CartButton />
        {snipcartKey && <div
          hidden
          id="snipcart"
          data-api-key={snipcartKey}
          data-currency="usd"
          data-config-modal-style="side"
        />}
        {snipcartKey && <script async src="https://cdn.snipcart.com/themes/v3.7.5/default/snipcart.js" />}
      </body>
    </html>
  )
}
