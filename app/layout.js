import './globals.css'

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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
