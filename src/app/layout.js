import './globals.css'

export const metadata = {
  title: "Faithfully Faded™ — Distinctive Apparel",
  description: "Just be Blunt. Distinctive apparel for distinctive people. Dallas, TX.",
  keywords: "faithfully faded, distinctive apparel, streetwear, dallas fashion, tru skool",
  openGraph: {
    title: "Faithfully Faded™",
    description: "Just be Blunt. Distinctive apparel for distinctive people.",
    images: ['/billboard.png'],
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
