import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Faithfully Faded™ — Distinctive Apparel',
  description: 'Culture-first fashion for the unapologetically distinctive. Just be Blunt.',
  keywords: 'streetwear, fashion, apparel, Dallas, Faithfully Faded',
  openGraph: {
    title: 'Faithfully Faded™',
    description: 'Just be Blunt.',
    images: ['/images/ff-billboard.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
