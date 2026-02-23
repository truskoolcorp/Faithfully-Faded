'use client'
import Image from 'next/image'

export function Lookbook() {
  const items = [
    { span: true, icon: '🦋', caption: 'The Rebel Collection' },
    { icon: '✦', caption: 'Street Ritual' },
    { icon: '◈', caption: 'Midnight Edit' },
    { span: true, icon: '🌿', caption: 'Culture & Grace' },
    { icon: '❋', caption: 'The 420 Series' },
    { icon: '◉', caption: 'Elevated Basics' },
  ]

  return (
    <section id="lookbook" style={{ padding: '120px 80px', background: '#080808' }}>
      <style>{`
        .lb-item { position: relative; overflow: hidden; background: #120a0a; cursor: pointer; }
        .lb-item .lb-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, rgba(8,8,8,0.9), transparent); font-family: 'Cormorant Garamond', serif; font-size: 14px; font-style: italic; color: #fff0fb; opacity: 0; transform: translateY(10px); transition: all 0.4s; }
        .lb-item:hover .lb-caption { opacity: 1; transform: translateY(0); }
        .lb-item::after { content: ''; position: absolute; inset: 0; background: #420420; opacity: 0; transition: opacity 0.4s; mix-blend-mode: multiply; }
        .lb-item:hover::after { opacity: 0.25; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'center', marginBottom: 100 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FFADED', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ width: 28, height: 1, background: '#FFADED', display: 'block' }} />
            Spring / Summer '25
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
            Where <em style={{ fontStyle: 'italic', color: '#FFADED' }}>Faith</em><br />Meets the Fade
          </h2>
          <p style={{ color: '#9a7a8e', fontSize: 15, lineHeight: 1.8, marginBottom: 32, maxWidth: 400 }}>
            Each piece tells a story of duality — the sacred and the street, the elevated and the raw. Designed for those who live unapologetically.
          </p>
          <a href="#" style={{ background: '#420420', color: '#fdf8fc', padding: '15px 36px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'background 0.3s' }}
            onMouseEnter={e => e.target.style.background = '#FFADED'}
            onMouseLeave={e => e.target.style.background = '#420420'}
          >Full Lookbook →</a>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11vw', color: 'rgba(66,4,32,0.08)', lineHeight: 0.8, position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }}>FADED</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: 4, position: 'relative', zIndex: 1 }}>
            {items.map((item, i) => (
              <div key={i} className="lb-item" style={{ gridRow: item.span ? '1 / 3' : undefined }}>
                <div style={{ width: '100%', minHeight: item.span ? 420 : 196, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, opacity: 0.1, background: 'linear-gradient(135deg, rgba(66,4,32,0.2), transparent)' }}>
                  {item.icon}
                </div>
                <div className="lb-caption">{item.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Story() {
  return (
    <section id="our-story" style={{ padding: '120px 80px', background: '#420420', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '38vw', color: 'rgba(0,0,0,0.08)', position: 'absolute', right: '-6vw', top: '50%', transform: 'translateY(-50%)', lineHeight: 1, pointerEvents: 'none' }}>FF</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,173,237,0.7)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: 'rgba(255,173,237,0.7)', display: 'block' }} />
            Our Story
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.2, color: '#fff0fb' }}>
            "Just be Blunt. Be who you are, always."
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(240,232,220,0.75)', fontSize: 15, lineHeight: 1.9 }}>
            <p>Faithfully Faded™ was born from the intersection of culture, identity, and uncompromising self-expression. We don't design clothes — we design permission. Permission to be exactly who you are, in exactly the room you walk into.</p>
            <p style={{ marginTop: 20 }}>Rooted in the creative vision of Tru Skool Entertainment, every stitch carries intention. The butterfly isn't decoration — it's transformation. The fade isn't absence — it's evolution.</p>
            <p style={{ marginTop: 20 }}>Distinctive apparel for distinctive people.</p>
          </div>
          <div style={{ marginTop: 40, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', color: '#ffc8f0' }}>
            — Faithfully Faded™, Dallas TX
          </div>
        </div>
      </div>
    </section>
  )
}

export function Ahnika() {
  return (
    <section id="ahnika" style={{ padding: '120px 80px', background: '#150b0b', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5;} 50%{transform:translate(-50%,-50%) scale(1.15);opacity:0.9;} }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
        @keyframes scan { from{top:0;} to{top:100%;} }
      `}</style>
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(66,4,32,0.45) 0%, transparent 70%)', top: '50%', left: '50%', animation: 'pulse 4s ease-in-out infinite', pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Avatar */}
        <div style={{ aspectRatio: '3/4', background: 'linear-gradient(160deg, #200a0a, #0f0808)', border: '1px solid rgba(255,173,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, rgba(66,4,32,0.3) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #FFADED, transparent)', animation: 'scan 3s linear infinite', opacity: 0.3 }} />
          <div style={{ animation: 'float 3s ease-in-out infinite', position: 'relative' }}>
            <Image src="/butterfly-green.png" alt="Ahnika Merlot" width={160} height={160}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(34,150,34,0.4))' }} />
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontStyle: 'italic', color: '#FFADED', letterSpacing: '0.08em', position: 'relative' }}>Ahnika Merlot</div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9a7a8e', position: 'relative' }}>AI Style Curator</div>
        </div>

        {/* Content */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FFADED', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ width: 28, height: 1, background: '#FFADED', display: 'block' }} />
            Coming Soon
          </div>
          <div style={{ display: 'inline-block', background: 'rgba(255,173,237,0.08)', border: '1px solid rgba(255,173,237,0.3)', color: '#FFADED', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '7px 18px', marginBottom: 24 }}>Powered by AI</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}>
            Meet <em style={{ fontStyle: 'italic', color: '#FFADED' }}>Ahnika</em>,<br />Your Personal<br />Style Guide
          </h2>
          <p style={{ color: '#9a7a8e', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
            Ahnika Merlot is Faithfully Faded's AI style curator — always on, always on-brand. She greets you, knows the collection, and helps you find your perfect look.
          </p>
          <ul style={{ listStyle: 'none', marginBottom: 40 }}>
            {[
              'Personalized outfit recommendations based on your vibe',
              'Live chat style consultations, 24/7',
              'Look-building from current inventory in real-time',
              'Cultural context behind each collection',
              'Exclusive early access drops for Ahnika members',
            ].map((item, i) => (
              <li key={i} style={{ padding: '11px 0', borderBottom: '1px solid rgba(255,173,237,0.08)', fontSize: 13, color: '#fff0fb', display: 'flex', alignItems: 'flex-start', gap: 12, lineHeight: 1.5 }}>
                <span style={{ color: '#FFADED', fontSize: 8, flexShrink: 0, marginTop: 4 }}>◆</span>
                {item}
              </li>
            ))}
          </ul>
          <button style={{ background: '#420420', color: '#fdf8fc', border: 'none', padding: '15px 36px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'background 0.3s' }}
            onMouseEnter={e => e.target.style.background = '#FFADED'}
            onMouseLeave={e => e.target.style.background = '#420420'}
          >Join the Waitlist →</button>
        </div>
      </div>
    </section>
  )
}

export function ARTeaser() {
  const features = [
    { icon: '📱', label: 'Mobile AR' },
    { icon: '🪞', label: 'Virtual Mirror' },
    { icon: '🎨', label: 'Color Swap' },
    { icon: '📐', label: 'Size Fit Guide' },
  ]
  return (
    <section style={{ padding: '100px 80px', background: '#080808', textAlign: 'center', borderTop: '1px solid rgba(255,173,237,0.1)' }}>
      <style>{`
        @keyframes shimmer { from{background-position:0% center;} to{background-position:200% center;} }
      `}</style>
      <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FFADED', marginBottom: 20, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 28, height: 1, background: '#FFADED', display: 'block' }} />
        Coming Phase 2
        <span style={{ width: 28, height: 1, background: '#FFADED', display: 'block' }} />
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 110px)', letterSpacing: '0.04em', background: 'linear-gradient(to right, #420420, #FFADED, #420420)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite', marginBottom: 16 }}>SEE IT ON YOU</div>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: 'italic', color: '#9a7a8e', marginBottom: 48 }}>3D Augmented Reality Try-On — point your camera, wear the collection.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginBottom: 56, flexWrap: 'wrap' }}>
        {features.map(f => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, border: '1px solid rgba(255,173,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, background: 'rgba(66,4,32,0.08)', transition: 'all 0.4s' }}
              onMouseEnter={e => { e.target.style.borderColor = '#FFADED'; e.target.style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,173,237,0.15)'; e.target.style.transform = 'scale(1)'; }}
            >{f.icon}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a8e' }}>{f.label}</div>
          </div>
        ))}
      </div>
      <button style={{ background: '#420420', color: '#fdf8fc', border: 'none', padding: '15px 40px', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'background 0.3s' }}
        onMouseEnter={e => e.target.style.background = '#FFADED'}
        onMouseLeave={e => e.target.style.background = '#420420'}
      >Notify Me When It's Live</button>
    </section>
  )
}

export function Newsletter() {
  return (
    <section style={{ padding: '100px 80px', background: '#420420', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,173,237,0.7)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ width: 28, height: 1, background: 'rgba(255,173,237,0.7)', display: 'block' }} />
          Stay Connected
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.2, color: '#fff0fb' }}>
          First to the Drop,<br /><em style={{ fontStyle: 'italic', color: '#ffc8f0' }}>First to the Culture</em>
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input type="email" placeholder="Your email address" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.2)', color: '#fdf8fc', padding: '15px 22px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', width: '100%' }} />
        <input type="text" placeholder="First name (optional)" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.2)', color: '#fdf8fc', padding: '15px 22px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', width: '100%' }} />
        <button style={{ alignSelf: 'flex-start', background: '#080808', color: '#FFADED', border: 'none', padding: '15px 32px', fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'all 0.3s' }}
          onMouseEnter={e => { e.target.style.background = '#FFADED'; e.target.style.color = '#080808'; }}
          onMouseLeave={e => { e.target.style.background = '#080808'; e.target.style.color = '#FFADED'; }}
        >Subscribe & Get 15% Off →</button>
      </div>
    </section>
  )
}

export function Footer() {
  const shop = ['New Arrivals', 'Signature Collection', 'Essentials', 'Sale', 'Gift Cards']
  const info = ['Our Story', 'Ahnika', 'AR Try-On', 'Lookbook', 'Blog']
  const support = ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQ']
  const socials = [
    { label: 'fb', href: 'https://facebook.com/faithfullyfaded23' },
    { label: 'ig', href: 'https://instagram.com/faithfullyfaded23' },
    { label: 'tt', href: 'https://tiktok.com/@faithfullyfaded23' },
    { label: '𝕏', href: 'https://twitter.com/FadedFaithfully' },
  ]

  const linkStyle = { color: '#9a7a8e', textDecoration: 'none', fontSize: 13, transition: 'color 0.3s', display: 'block' }

  return (
    <footer style={{ padding: '80px 80px 40px', background: '#150b0b', borderTop: '1px solid rgba(255,173,237,0.1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 60, marginBottom: 60, paddingBottom: 60, borderBottom: '1px solid rgba(255,173,237,0.1)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Image src="/butterfly-maroon.png" alt="FF" width={44} height={44} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255,173,237,0.3))' }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Faithfully <span style={{ color: '#FFADED' }}>Faded</span>™
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#9a7a8e', lineHeight: 1.7, marginBottom: 24 }}>Distinctive apparel for distinctive people.<br />Dallas, TX. Culture first, always.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ width: 34, height: 34, border: '1px solid rgba(255,173,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a7a8e', textDecoration: 'none', fontSize: 12, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFADED'; e.currentTarget.style.color = '#FFADED'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,173,237,0.15)'; e.currentTarget.style.color = '#9a7a8e'; }}
              >{s.label}</a>
            ))}
          </div>
        </div>
        {[{ title: 'Shop', links: shop }, { title: 'Info', links: info }, { title: 'Support', links: support }].map(col => (
          <div key={col.title}>
            <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#FFADED', marginBottom: 22 }}>{col.title}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(l => (
                <li key={l}><a href="#" style={linkStyle}
                  onMouseEnter={e => e.target.style.color = '#fff0fb'}
                  onMouseLeave={e => e.target.style.color = '#9a7a8e'}
                >{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#9a7a8e' }}>© 2025 Faithfully Faded™ · A Tru Skool Entertainment Brand</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
            <a key={l} href="#" style={{ fontSize: 11, color: '#9a7a8e', textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = '#fff0fb'}
              onMouseLeave={e => e.target.style.color = '#9a7a8e'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
