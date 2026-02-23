'use client'
import Image from 'next/image'

export function Marquee() {
  const items = ['Faithfully Faded™', 'Just Be Blunt', 'Distinctive Apparel', 'Culture First', 'Free Shipping Over $75']
  const doubled = [...items, ...items]

  return (
    <div style={{ background: '#420420', padding: '13px 0', overflow: 'hidden' }}>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { display: flex; animation: marquee 22s linear infinite; white-space: nowrap; }
      `}</style>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 13, letterSpacing: '0.25em',
            color: '#fdf8fc', padding: '0 36px',
            display: 'inline-flex', alignItems: 'center', gap: 36
          }}>
            {item}
            <span style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: '50%', display: 'inline-block' }} />
          </span>
        ))}
      </div>
    </div>
  )
}

export function BrandMark() {
  return (
    <section style={{
      padding: '80px',
      background: '#0a0808',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80,
      borderBottom: '1px solid rgba(255,173,237,0.1)'
    }}>
      {[
        { src: '/butterfly-maroon.png', label: 'Signature Mark', glow: 'rgba(255,173,237,0.35)', hoverGlow: 'rgba(255,173,237,0.7)' },
        { src: '/butterfly-green.png', label: 'Verde Edition', glow: 'rgba(34,120,34,0.4)', hoverGlow: 'rgba(34,160,34,0.7)' }
      ].map((b, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
            <Image src={b.src} alt={b.label} fill
              style={{
                objectFit: 'contain',
                filter: `drop-shadow(0 0 28px ${b.glow})`,
                transition: 'filter 0.4s'
              }}
              onMouseEnter={e => e.target.style.filter = `drop-shadow(0 0 50px ${b.hoverGlow})`}
              onMouseLeave={e => e.target.style.filter = `drop-shadow(0 0 28px ${b.glow})`}
            />
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9a7a8e', marginTop: 14 }}>{b.label}</div>
        </div>
      ))}

      <div style={{ textAlign: 'center', fontFamily: "'Cormorant Garamond', serif" }}>
        <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FFADED', marginBottom: 12 }}>Faithfully Faded™</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 60, lineHeight: 0.9, color: '#fdf8fc', letterSpacing: '0.04em' }}>
          The<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1px #420420' }}>Mark</span>
        </div>
        <p style={{ fontSize: 13, color: '#9a7a8e', marginTop: 16, fontStyle: 'italic', maxWidth: 260, lineHeight: 1.7 }}>
          Wings of the cannabis leaf.<br />Body of the pineapple.<br />Born from culture, built for the street.
        </p>
        <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,173,237,0.35)', marginTop: 12 }}>#420420 · #FFADED</div>
      </div>
    </section>
  )
}
