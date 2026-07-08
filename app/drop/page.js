import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'

export const metadata = {
  title: 'The Faded Capsule — Faithfully Faded™',
  description: 'A limited three-piece drop. Just be Blunt.',
}

const CAPSULE_IDS = ['hooded-baseball-jersey-dress', 'signature-crop-hoodie', 'butterfly-varsity-tee']

export default function Drop() {
  const order = new Map(CAPSULE_IDS.map((id, i) => [id, i]))
  const capsule = PRODUCTS.filter(p => order.has(p.id)).sort((a, b) => order.get(a.id) - order.get(b.id))

  return (
    <main style={{ background: '#080808', color: '#fdf8fc', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '22px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to bottom, rgba(8,8,8,0.96) 0%, rgba(8,8,8,0.6) 100%)', borderBottom: '1px solid rgba(255,173,237,0.08)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: '#fdf8fc' }}>
          <img src="/images/butterfly-maroon.png" alt="FF" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Faithfully <span style={{ color: '#FFADED' }}>Faded</span>™</span>
        </Link>
        <div style={{ display: 'flex', gap: 32 }}>
          <Link href="/#shop" style={{ color: '#9a7a8e', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>Shop</Link>
          <Link href="/lookbook" style={{ color: '#9a7a8e', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>Lookbook</Link>
          <span style={{ color: '#FFADED', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Drop</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '110px 24px 84px', textAlign: 'center', overflow: 'hidden', borderBottom: '1px solid rgba(255,173,237,0.1)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 90% at 50% 40%, rgba(66,4,32,0.55) 0%, #080808 65%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 820, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FFADED', marginBottom: 20 }}>Limited Drop · 2025</div>
          <h1 style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 'clamp(60px,11vw,140px)', lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: 14 }}>
            The Faded<br /><span style={{ color: 'transparent', WebkitTextStroke: '1px #FFADED' }}>Capsule</span>
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: '#9a7a8e', marginBottom: 34, letterSpacing: '0.05em' }}>
            Three pieces. One statement. Just be Blunt.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, border: '1px solid #FFADED', padding: '13px 24px' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9a7a8e' }}>Launch code</span>
            <span style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 26, letterSpacing: '0.1em', color: '#FFADED' }}>FADED15</span>
            <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9a7a8e' }}>15% off</span>
          </div>
          <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5c4a54', marginTop: 14 }}>Free shipping over $75 · Limited launch window</p>
        </div>
      </section>

      {/* CAPSULE */}
      <section style={{ padding: '84px 56px 110px', background: '#150b0b', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, borderBottom: '1px solid rgba(255,173,237,0.1)', paddingBottom: 28, flexWrap: 'wrap', gap: 20 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300 }}>Shop the <em style={{ color: '#FFADED' }}>Capsule</em></h2>
          <Link href="/#shop" style={{ color: '#9a7a8e', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(255,173,237,0.15)', paddingBottom: 4 }}>Shop All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
          {capsule.map(p => (
            <Link key={p.id} href={`/shop/${p.id}`} style={{ position: 'relative', background: '#0f0b0e', overflow: 'hidden', display: 'block', textDecoration: 'none', color: '#fdf8fc' }}>
              <div style={{ aspectRatio: '3/4', background: 'linear-gradient(160deg, rgba(66,4,32,0.25) 0%, #0d0808 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: 60, opacity: 0.25 }}>{p.emoji}</span>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#FFADED', color: '#420420', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 12px', fontWeight: 500 }}>Capsule</div>
              </div>
              <div style={{ padding: '20px 24px 28px', borderTop: '1px solid rgba(255,173,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 19, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a8e', marginBottom: 8 }}>{p.category}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.colors.map(c => <div key={c.hex} style={{ width: 14, height: 14, borderRadius: '50%', background: c.hex, border: '1px solid rgba(255,255,255,0.15)' }} />)}
                  </div>
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 22, color: '#FFADED' }}>${p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
