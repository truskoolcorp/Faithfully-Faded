'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Nav({ cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '20px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(8,8,8,0.97)' : 'linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, transparent 100%)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,173,237,0.08)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <Image src="/butterfly-maroon.png" alt="FF" width={34} height={34}
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,173,237,0.4))' }} />
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 17, fontWeight: 400, letterSpacing: '0.12em',
          color: '#fdf8fc', textTransform: 'uppercase'
        }}>
          Faithfully <span style={{ color: '#FFADED' }}>Faded</span>™
        </span>
      </a>

      <ul style={{ display: 'flex', gap: 36, listStyle: 'none' }}>
        {['Shop', 'Lookbook', 'Our Story', 'Ahnika'].map(item => (
          <li key={item}>
            <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
              color: '#9a7a8e', textDecoration: 'none',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.target.style.color = '#FFADED'}
              onMouseLeave={e => e.target.style.color = '#9a7a8e'}
            >{item}</a>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="mailto:info@faithfully-faded.com" style={{
          color: '#9a7a8e', fontSize: 11, letterSpacing: '0.16em',
          textTransform: 'uppercase', textDecoration: 'none',
          transition: 'color 0.3s'
        }}
          onMouseEnter={e => e.target.style.color = '#FFADED'}
          onMouseLeave={e => e.target.style.color = '#9a7a8e'}
        >Contact</a>
        <button onClick={onCartOpen} style={{
          background: 'none',
          border: '1px solid rgba(255,173,237,0.2)',
          color: '#fdf8fc', padding: '10px 22px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11, letterSpacing: '0.16em',
          textTransform: 'uppercase',
          transition: 'all 0.3s',
        }}
          onMouseEnter={e => { e.target.style.background = '#FFADED'; e.target.style.color = '#080808'; }}
          onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = '#fdf8fc'; }}
        >
          Cart ({cartCount})
        </button>
      </div>
    </nav>
  )
}
