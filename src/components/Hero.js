'use client'
import Image from 'next/image'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden'
    }}>
      {/* BG */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 100% at 65% 50%, #1a0415 0%, #0d0210 40%, #080808 100%)'
      }} />

      {/* Billboard image right side */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%',
        overflow: 'hidden'
      }}>
        <Image src="/billboard.png" alt="Faithfully Faded" fill
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.85 }} priority />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(8,8,8,0.85) 0%, transparent 50%), linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 40%)'
        }} />
      </div>

      {/* Vertical deco line */}
      <div style={{
        position: 'absolute', right: '50%', top: '15%', bottom: '10%',
        width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(255,173,237,0.2) 30%, rgba(255,173,237,0.2) 70%, transparent)',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '0 80px 100px',
        width: '52%',
        animation: 'heroReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}>
        <style>{`
          @keyframes heroReveal {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{
          fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
          color: '#FFADED', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14
        }}>
          <span style={{ display: 'block', width: 40, height: 1, background: '#FFADED' }} />
          New Collection · Spring '25
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(72px, 10vw, 140px)',
          lineHeight: 0.9, letterSpacing: '0.02em',
          color: '#fdf8fc', marginBottom: 8
        }}>
          Faithfully
          <span style={{
            display: 'block',
            color: 'transparent',
            WebkitTextStroke: '1px #420420',
          }}>Faded</span>
        </h1>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, fontStyle: 'italic',
          color: '#9a7a8e', marginBottom: 48, letterSpacing: '0.06em'
        }}>Just be Blunt.</p>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="#shop" style={{
            background: '#420420', color: '#fdf8fc',
            padding: '16px 40px', fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            textDecoration: 'none', display: 'inline-block',
            transition: 'background 0.3s',
          }}
            onMouseEnter={e => e.target.style.background = '#FFADED'}
            onMouseLeave={e => e.target.style.background = '#420420'}
          >Shop Now</a>
          <a href="#lookbook" style={{
            color: '#9a7a8e', fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            textDecoration: 'none', paddingBottom: 4,
            borderBottom: '1px solid transparent',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.target.style.color = '#FFADED'; e.target.style.borderColor = '#FFADED'; }}
            onMouseLeave={e => { e.target.style.color = '#9a7a8e'; e.target.style.borderColor = 'transparent'; }}
          >View Lookbook</a>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        position: 'absolute', bottom: 80, right: 80,
        display: 'flex', gap: 40, zIndex: 2
      }}>
        {[{ n: '420', l: 'Styles' }, { n: '∞', l: 'Attitude' }].map(s => (
          <div key={s.l} style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: '#FFADED', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a8e', marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
