'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'

function useCart() {
  const [items, setItems] = useState([])
  const add = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.color === product.color && i.size === product.size)
      if (existing) return prev.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }
  const remove = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)
  return { items, add, remove, total, count }
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll('.reveal')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

export default function Home() {
  const cart = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hey love! I'm Ahnika Merlot, your personal style curator at Faithfully Faded. What are you looking for today? 🦋" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [nlEmail, setNlEmail] = useState('')
  const [nlName, setNlName] = useState('')
  const [nlSubmitted, setNlSubmitted] = useState(false)
  const [nlLoading, setNlLoading] = useState(false)
  const containerRef = useReveal()
  const chatEndRef = useRef(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMessages(p => [...p, { role: 'user', text: msg }])
    setChatLoading(true)
    try {
      const res = await fetch('/api/ahnika', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: chatMessages.slice(-6) }),
      })
      const data = await res.json()
      setChatMessages(p => [...p, { role: 'assistant', text: data.response }])
    } catch (err) {
      console.error('Chat error:', err)
      setChatMessages(p => [...p, { role: 'assistant', text: "Sorry love, I'm having a moment. Try again? 💕" }])
    } finally { setChatLoading(false) }
  }

  const submitNewsletter = async (e) => {
    e.preventDefault()
    if (!nlEmail.trim()) return
    setNlLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nlEmail, name: nlName }),
      })
      setNlSubmitted(true)
    } catch {} finally { setNlLoading(false) }
  }

  const featuredProducts = PRODUCTS.slice(0, 3)

  return (
    <div ref={containerRef}>
      {/* CART DRAWER */}
      <div style={{
        position: 'fixed', top: 0, right: drawerOpen ? 0 : -520, bottom: 0, width: 480, maxWidth: '92vw',
        background: '#150b0b', borderLeft: '1px solid rgba(255,173,237,0.15)', zIndex: 200,
        transition: 'right 0.5s cubic-bezier(.16,1,.3,1)', padding: '48px 40px',
        display: 'flex', flexDirection: 'column',
      }}>
        {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position:'fixed', inset:0, zIndex:-1 }} />}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40, paddingBottom:24, borderBottom:'1px solid rgba(255,173,237,0.12)' }}>
          <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontWeight:300 }}>Your Cart</span>
          <button onClick={() => setDrawerOpen(false)} style={{ background:'none', border:'none', color:'#9a7a8e', fontSize:22, cursor:'pointer' }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {cart.items.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:200, gap:16, color:'#9a7a8e', fontSize:14 }}>
              <span style={{ fontSize:48, opacity:0.25 }}>🛍</span>Your cart is empty
            </div>
          ) : cart.items.map((item, i) => (
            <div key={i} style={{ display:'flex', gap:16, padding:'16px 0', borderBottom:'1px solid rgba(255,173,237,0.08)' }}>
              <div style={{ width:64, height:80, background:'linear-gradient(160deg,rgba(66,4,32,0.3),#0d0808)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, marginBottom:4 }}>{item.name}</div>
                <div style={{ fontSize:11, color:'#9a7a8e', marginBottom:4 }}>{item.selectedColor && `${item.selectedColor} · `}{item.selectedSize && `Size ${item.selectedSize} · `}Qty {item.qty}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, color:'#FFADED' }}>${item.price * item.qty}</span>
                  <button onClick={() => cart.remove(i)} style={{ background:'none', border:'none', color:'#9a7a8e', fontSize:11, cursor:'pointer', textDecoration:'underline' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,173,237,0.12)', paddingTop:24, marginTop:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20, fontFamily:'Cormorant Garamond,serif', fontSize:20 }}>
            <span>Total</span><span style={{ color:'#FFADED' }}>${cart.total.toFixed(2)}</span>
          </div>
          <button style={{ width:'100%', background:'#420420', color:'#fdf8fc', border:'none', padding:18, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', transition:'background 0.3s' }}>Proceed to Checkout</button>
        </div>
      </div>

      {/* AHNIKA CHAT */}
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:190, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:12 }}>
        {chatOpen && (
          <div style={{
            width:380, maxWidth:'90vw', height:520, background:'#150b0b', border:'1px solid rgba(255,173,237,0.2)',
            borderRadius:16, display:'flex', flexDirection:'column', overflow:'hidden',
            animation:'fadeUp 0.3s ease', boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,173,237,0.12)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#420420' }}>
              <div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic', color:'#FFADED' }}>Ahnika Merlot</div>
                <div style={{ fontSize:10, letterSpacing:'0.2em', color:'rgba(255,240,251,0.5)', textTransform:'uppercase' }}>AI Style Curator · Online</div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background:'none', border:'none', color:'#fdf8fc', fontSize:18, cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ flex:1, overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#420420' : 'rgba(255,173,237,0.08)',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(255,173,237,0.12)',
                  padding: '12px 16px', borderRadius: 12, maxWidth: '85%',
                  fontSize: 13, lineHeight: 1.7, color: m.role === 'user' ? '#fdf8fc' : '#cfc0cb',
                }}>{m.text}</div>
              ))}
              {chatLoading && (
                <div style={{ alignSelf:'flex-start', padding:'12px 16px', background:'rgba(255,173,237,0.08)', border:'1px solid rgba(255,173,237,0.12)', borderRadius:12, fontSize:13, color:'#9a7a8e' }}>
                  Ahnika is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,173,237,0.12)', display:'flex', gap:10 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Ask Ahnika anything..."
                style={{ flex:1, background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,173,237,0.15)', color:'#fdf8fc', padding:'12px 16px', borderRadius:24, fontSize:13, outline:'none' }}
              />
              <button onClick={sendChat} disabled={chatLoading}
                style={{ background:'#420420', color:'#fdf8fc', border:'none', width:42, height:42, borderRadius:'50%', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
              >➤</button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(!chatOpen)}
          style={{ width:64, height:64, borderRadius:'50%', background:'#420420', border:'2px solid rgba(255,173,237,0.3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(66,4,32,0.6)', transition:'all 0.3s', animation:'float 3s ease-in-out infinite', overflow:'hidden' }}>
          <img src="/images/butterfly-green.png" alt="Chat" style={{ width:38, height:38, objectFit:'contain' }} />
        </button>
      </div>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'24px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to bottom, rgba(8,8,8,0.95) 0%, transparent 100%)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:14 }}>
          <img src="/images/butterfly-maroon.png" alt="FF" style={{ width:36, height:36, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(255,173,237,0.4))', animation:'flutter 3s ease-in-out infinite' }} />
          <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:17, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            Faithfully <span style={{ color:'#FFADED' }}>Faded</span>™
          </span>
        </Link>
        <div style={{ display:'flex', gap:36 }}>
          {[
            { label: 'Shop', href: '#shop' },
            { label: 'Lookbook', href: '/lookbook' },
            { label: 'Our Story', href: '#story' },
            { label: 'Ahnika', href: '#ahnika' },
            { label: 'Contact', href: '/contact' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ color:'#9a7a8e', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', transition:'color 0.3s' }}>{l.label}</Link>
          ))}
        </div>
        <button onClick={() => setDrawerOpen(true)} style={{ background:'none', border:'1px solid rgba(255,173,237,0.2)', color:'#fdf8fc', padding:'10px 24px', fontSize:11, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer', transition:'all 0.3s' }}>Cart ({cart.count})</button>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'100vh', position:'relative', display:'flex', alignItems:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 100% at 65% 50%, #1a0415 0%, #0d0210 40%, #080808 100%)' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'52%', overflow:'hidden' }}>
          <img src="/images/billboard.png" alt="Faithfully Faded" style={{ position:'absolute', width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity:0.85 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, #080808 0%, transparent 35%), linear-gradient(to top, #080808 0%, transparent 35%)' }} />
        </div>
        <div style={{ position:'relative', zIndex:2, padding:'0 80px 90px', width:'54%', animation:'heroIn 1.2s cubic-bezier(.16,1,.3,1) both' }}>
          <div style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'#FFADED', marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ display:'block', width:40, height:1, background:'#FFADED' }} />New Collection · 2025
          </div>
          <h1 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(72px,10vw,136px)', lineHeight:0.9, letterSpacing:'0.02em', color:'#fdf8fc', marginBottom:12 }}>
            Faithfully<span style={{ display:'block', color:'transparent', WebkitTextStroke:'1px #420420' }}>Faded</span>
          </h1>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, fontStyle:'italic', color:'#9a7a8e', marginBottom:48, letterSpacing:'0.06em' }}>Just be Blunt.</p>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <Link href="#shop" style={{ background:'#420420', color:'#fdf8fc', padding:'16px 40px', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', display:'inline-block' }}>Shop Now</Link>
            <Link href="#story" style={{ color:'#9a7a8e', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', padding:'4px 0' }}>Our Story</Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background:'#420420', padding:'13px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 22s linear infinite', whiteSpace:'nowrap' }}>
          {Array(10).fill(null).map((_, i) => (
            <span key={i} style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:13, letterSpacing:'0.25em', color:'#fdf8fc', padding:'0 40px', display:'flex', alignItems:'center', gap:40 }}>
              Faithfully Faded™ <span style={{ width:4, height:4, background:'rgba(255,255,255,0.35)', borderRadius:'50%', display:'inline-block' }} />
              Just Be Blunt <span style={{ width:4, height:4, background:'rgba(255,255,255,0.35)', borderRadius:'50%', display:'inline-block' }} />
              Distinctive Apparel <span style={{ width:4, height:4, background:'rgba(255,255,255,0.35)', borderRadius:'50%', display:'inline-block' }} />
              Free Shipping Over $75
            </span>
          ))}
        </div>
      </div>

      {/* BRAND MARKS */}
      <section style={{ padding:'72px 80px', background:'#0a0808', display:'flex', alignItems:'center', justifyContent:'center', gap:80, borderBottom:'1px solid rgba(255,173,237,0.1)', flexWrap:'wrap' }}>
        <div className="reveal" style={{ textAlign:'center' }}>
          <img src="/images/butterfly-maroon.png" alt="Signature Mark" style={{ width:180, height:180, objectFit:'contain', filter:'drop-shadow(0 0 28px rgba(255,173,237,0.35))' }} />
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9a7a8e', marginTop:16 }}>Signature Mark</div>
          <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,173,237,0.3)', marginTop:6 }}>#420420 · #FFADED</div>
        </div>
        <div className="reveal" style={{ textAlign:'center', transitionDelay:'0.15s' }}>
          <img src="/images/butterfly-green.png" alt="Verde Edition" style={{ width:180, height:180, objectFit:'contain', filter:'drop-shadow(0 0 28px rgba(80,180,80,0.3))' }} />
          <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9a7a8e', marginTop:16 }}>Verde Edition</div>
          <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,173,237,0.3)', marginTop:6 }}>#420420 · #FFADED</div>
        </div>
        <div className="reveal d1" style={{ textAlign:'center', fontFamily:'Cormorant Garamond,serif' }}>
          <div style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'#FFADED', marginBottom:12 }}>Faithfully Faded™</div>
          <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:72, lineHeight:0.9, color:'#fdf8fc', letterSpacing:'0.04em' }}>
            The<br /><span style={{ color:'transparent', WebkitTextStroke:'1px #420420' }}>Mark</span>
          </div>
          <div style={{ fontSize:13, color:'#9a7a8e', marginTop:16, fontStyle:'italic', maxWidth:280, lineHeight:1.7 }}>
            Wings of the cannabis leaf.<br />Body of the pineapple.<br />Born from culture.
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" style={{ padding:'120px 80px', background:'#150b0b' }}>
        <div className="reveal" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:72, borderBottom:'1px solid rgba(255,173,237,0.1)', paddingBottom:32, flexWrap:'wrap', gap:24 }}>
          <div>
            <div className="section-label">Essential Collection</div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300, lineHeight:1.05 }}>
              The <em style={{ fontStyle:'italic', color:'#FFADED' }}>Pieces</em><br />That Define You
            </h2>
          </div>
          <Link href="/lookbook" style={{ color:'#9a7a8e', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', borderBottom:'1px solid rgba(255,173,237,0.15)', paddingBottom:4, whiteSpace:'nowrap' }}>View All Styles →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:3 }}>
          {featuredProducts.map((p, i) => (
            <Link key={p.id} href={`/shop/${p.id}`} className={`reveal d${i}`} style={{ position:'relative', background:'#0f0b0e', overflow:'hidden', cursor:'pointer', display:'block' }}>
              <div style={{ aspectRatio: i === 0 ? '2/3' : '3/4', background:'linear-gradient(160deg,rgba(66,4,32,0.2) 0%,#0d0808 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, position:'relative', overflow:'hidden' }}>
                <span style={{ fontSize:56, opacity:0.25 }}>{p.emoji}</span>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(8,8,8,0.9) 0%,transparent 50%)' }} />
                {p.badge && (
                  <div style={{ position:'absolute', top:16, left:16, background: p.badge === 'Bestseller' ? '#FFADED' : '#150b0b', color: p.badge === 'Bestseller' ? '#420420' : '#FFADED', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'5px 12px', fontWeight:500 }}>{p.badge}</div>
                )}
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); cart.add({ ...p, selectedColor: p.colors[0]?.name, selectedSize: p.sizes[1] || p.sizes[0] }); setDrawerOpen(true) }}
                  style={{ position:'absolute', top:16, right:16, background:'#420420', color:'#fdf8fc', border:'none', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, cursor:'pointer', borderRadius:4 }}
                >+</button>
              </div>
              <div style={{ padding:'20px 24px 28px', borderTop:'1px solid rgba(255,173,237,0.1)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9a7a8e', marginBottom:8 }}>{p.category}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {p.colors.map(c => <div key={c.hex} style={{ width:14, height:14, borderRadius:'50%', background:c.hex, border:'1px solid rgba(255,255,255,0.15)' }} />)}
                  </div>
                </div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:22, color:'#FFADED' }}>${p.price}</div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:3, marginTop:3 }}>
          {PRODUCTS.slice(3).map((p, i) => (
            <Link key={p.id} href={`/shop/${p.id}`} className={`reveal d${i}`} style={{ position:'relative', background:'#0f0b0e', overflow:'hidden', cursor:'pointer', display:'block' }}>
              <div style={{ aspectRatio:'3/4', background:'linear-gradient(160deg,rgba(66,4,32,0.2) 0%,#0d0808 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, position:'relative' }}>
                <span style={{ fontSize:48, opacity:0.25 }}>{p.emoji}</span>
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(8,8,8,0.9) 0%,transparent 50%)' }} />
                {p.badge && <div style={{ position:'absolute', top:16, left:16, background:'#150b0b', color:'#FFADED', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'5px 12px', fontWeight:500 }}>{p.badge}</div>}
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); cart.add({ ...p, selectedColor: p.colors[0]?.name, selectedSize: p.sizes[1] || p.sizes[0] }); setDrawerOpen(true) }}
                  style={{ position:'absolute', top:16, right:16, background:'#420420', color:'#fdf8fc', border:'none', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, cursor:'pointer', borderRadius:4 }}
                >+</button>
              </div>
              <div style={{ padding:'20px 24px 28px', borderTop:'1px solid rgba(255,173,237,0.1)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9a7a8e' }}>{p.category}</div>
                </div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:22, color:'#FFADED' }}>${p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="story" style={{ padding:'120px 80px', background:'#420420', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', fontFamily:'Bebas Neue,sans-serif', fontSize:'40vw', color:'rgba(0,0,0,0.08)', right:'-8vw', top:'50%', transform:'translateY(-50%)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>FF</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:80, alignItems:'center', position:'relative', zIndex:1 }}>
          <div className="reveal">
            <div className="section-label" style={{ color:'rgba(255,173,237,0.7)' }}>Our Story</div>
            <blockquote style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(32px,4.5vw,58px)', fontWeight:300, fontStyle:'italic', lineHeight:1.2, color:'#fff0fb' }}>
              &ldquo;Just be Blunt. Be who you are, always.&rdquo;
            </blockquote>
          </div>
          <div className="reveal d1">
            <p style={{ color:'rgba(255,240,251,0.75)', fontSize:15, lineHeight:1.9, marginBottom:20 }}>
              Faithfully Faded™ was born from the intersection of culture, identity, and uncompromising self-expression. We don&apos;t design clothes — we design permission. Permission to be exactly who you are, in exactly the room you walk into.
            </p>
            <p style={{ color:'rgba(255,240,251,0.75)', fontSize:15, lineHeight:1.9, marginBottom:20 }}>
              Rooted in the creative vision of Tru Skool Entertainment, every stitch carries intention. The butterfly isn&apos;t decoration — it&apos;s transformation. The fade isn&apos;t absence — it&apos;s evolution.
            </p>
            <p style={{ color:'rgba(255,240,251,0.75)', fontSize:15, lineHeight:1.9 }}>Distinctive apparel for distinctive people.</p>
            <div style={{ marginTop:40, fontFamily:'Cormorant Garamond,serif', fontSize:22, fontStyle:'italic', color:'#FFADED' }}>— Faithfully Faded™, Dallas TX</div>
          </div>
        </div>
      </section>

      {/* AHNIKA SECTION */}
      <section id="ahnika" style={{ padding:'120px 80px', background:'#150b0b', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(66,4,32,0.45) 0%,transparent 70%)', top:'50%', left:'50%', animation:'pulse 4s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', position:'relative', zIndex:1 }}>
          <div className="reveal" style={{ position:'relative', overflow:'hidden', background:'linear-gradient(160deg,#200a0a,#0f0808)', border:'1px solid rgba(255,173,237,0.15)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:60, gap:20, aspectRatio:'3/4' }}>
            <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(to right,transparent,#FFADED,transparent)', animation:'scan 3s linear infinite', opacity:0.35 }} />
            <div style={{ animation:'float 3s ease-in-out infinite' }}>
              <img src="/images/butterfly-green.png" alt="Ahnika Merlot" style={{ width:160, height:160, objectFit:'contain', filter:'drop-shadow(0 0 24px rgba(255,173,237,0.3))' }} />
            </div>
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontStyle:'italic', color:'#FFADED', letterSpacing:'0.08em' }}>Ahnika Merlot</div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#9a7a8e' }}>AI Style Curator</div>
          </div>
          <div className="reveal d1">
            <div className="section-label">Meet Your Stylist</div>
            <div style={{ display:'inline-block', background:'rgba(255,173,237,0.08)', border:'1px solid rgba(255,173,237,0.25)', color:'#FFADED', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', padding:'8px 20px', marginBottom:24 }}>
              Powered by AI · Live Now
            </div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(28px,3.5vw,48px)', fontWeight:300, lineHeight:1.2, marginBottom:24 }}>
              Meet <em style={{ fontStyle:'italic', color:'#FFADED' }}>Ahnika</em>,<br />Your Personal<br />Style Guide
            </h2>
            <p style={{ color:'#9a7a8e', fontSize:15, lineHeight:1.8, marginBottom:32 }}>
              Ahnika Merlot is Faithfully Faded&apos;s AI style curator — always on, always on-brand. She knows the collection inside out and helps you find your perfect look.
            </p>
            <ul style={{ listStyle:'none', marginBottom:40 }}>
              {['Personalized outfit recommendations', 'Live style consultations, 24/7', 'Real-time inventory awareness', 'Cultural context behind each piece'].map(f => (
                <li key={f} style={{ padding:'12px 0', borderBottom:'1px solid rgba(255,173,237,0.08)', fontSize:13, color:'#cfc0cb', display:'flex', alignItems:'center', gap:14 }}>
                  <span style={{ color:'#FFADED', fontSize:8 }}>◆</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => setChatOpen(true)} style={{ background:'#420420', color:'#fdf8fc', border:'none', padding:'16px 40px', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>Chat with Ahnika →</button>
          </div>
        </div>
      </section>

      {/* AR TRY-ON */}
      <section style={{ padding:'100px 80px', background:'#080808', textAlign:'center', borderTop:'1px solid rgba(255,173,237,0.1)' }}>
        <div className="reveal">
          <div style={{ fontSize:10, letterSpacing:'0.4em', textTransform:'uppercase', color:'#FFADED', display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginBottom:24 }}>
            <span style={{ display:'block', width:30, height:1, background:'#FFADED' }} />Coming Soon<span style={{ display:'block', width:30, height:1, background:'#FFADED' }} />
          </div>
          <h2 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(48px,8vw,120px)', letterSpacing:'0.04em', background:'linear-gradient(to right,#420420,#FFADED,#420420)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', backgroundSize:'200% auto', animation:'shimmer 4s linear infinite', marginBottom:16 }}>SEE IT ON YOU</h2>
          <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, fontStyle:'italic', color:'#9a7a8e', marginBottom:56 }}>3D Augmented Reality Try-On — point your camera, wear the collection.</p>
          <div style={{ display:'flex', justifyContent:'center', gap:60, marginBottom:56, flexWrap:'wrap' }}>
            {[
              { icon: '📱', label: 'Mobile AR' },
              { icon: '🪞', label: 'Virtual Mirror' },
              { icon: '🎨', label: 'Color Swap' },
              { icon: '📐', label: 'Size Guide' },
            ].map(f => (
              <div key={f.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                <div style={{ width:64, height:64, border:'1px solid rgba(255,173,237,0.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, background:'rgba(66,4,32,0.08)' }}>{f.icon}</div>
                <div style={{ fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9a7a8e' }}>{f.label}</div>
              </div>
            ))}
          </div>
          <button style={{ background:'none', border:'1px solid rgba(255,173,237,0.25)', color:'#FFADED', padding:'16px 40px', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}>Notify Me When It&apos;s Live</button>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding:'100px 80px', background:'#420420', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
        <div className="reveal">
          <div className="section-label" style={{ color:'rgba(255,173,237,0.7)' }}>Stay Connected</div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(32px,4vw,52px)', fontWeight:300, lineHeight:1.2, color:'#fff0fb' }}>
            First to the Drop,<br /><em style={{ fontStyle:'italic', color:'#FFADED' }}>First to the Culture</em>
          </h2>
        </div>
        <div className="reveal d1">
          {nlSubmitted ? (
            <div style={{ textAlign:'center', padding:40 }}>
              <img src="/images/butterfly-maroon.png" alt="" style={{ width:48, height:48, objectFit:'contain', marginBottom:16 }} />
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:24, color:'#FFADED', marginBottom:8 }}>You&apos;re in.</div>
              <p style={{ fontSize:13, color:'rgba(255,240,251,0.6)' }}>Check your inbox for your 15% off code.</p>
            </div>
          ) : (
            <form onSubmit={submitNewsletter} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <input value={nlEmail} onChange={e => setNlEmail(e.target.value)} type="email" required placeholder="Your email address"
                style={{ background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.18)', color:'#fdf8fc', padding:'16px 22px', fontSize:14, outline:'none', width:'100%' }} />
              <input value={nlName} onChange={e => setNlName(e.target.value)} placeholder="First name (optional)"
                style={{ background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.18)', color:'#fdf8fc', padding:'16px 22px', fontSize:14, outline:'none', width:'100%' }} />
              <button type="submit" disabled={nlLoading}
                style={{ background:'#080808', color:'#FFADED', border:'none', padding:'16px 32px', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', alignSelf:'flex-start' }}
              >{nlLoading ? 'Subscribing...' : 'Subscribe & Get 15% Off →'}</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'72px 80px 40px', background:'#150b0b', borderTop:'1px solid rgba(255,173,237,0.1)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:60, marginBottom:60, paddingBottom:60, borderBottom:'1px solid rgba(255,173,237,0.1)' }}>
          <div>
            <img src="/images/butterfly-maroon.png" alt="FF" style={{ width:52, height:52, objectFit:'contain', marginBottom:12, filter:'drop-shadow(0 0 8px rgba(255,173,237,0.3))' }} />
            <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>
              Faithfully <span style={{ color:'#FFADED' }}>Faded</span>™
            </div>
            <p style={{ fontSize:13, color:'#9a7a8e', lineHeight:1.7, marginBottom:24 }}>Distinctive apparel for distinctive people. Dallas, TX. Culture first, always.</p>
            <div style={{ display:'flex', gap:12 }}>
              {[
                { label: 'fb', href: 'https://facebook.com/faithfullyfaded23' },
                { label: 'ig', href: 'https://instagram.com/faithfullyfaded23' },
                { label: 'tt', href: 'https://tiktok.com/@faithfullyfaded23' },
                { label: '𝕏', href: 'https://twitter.com/FadedFaithfully' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ width:36, height:36, border:'1px solid rgba(255,173,237,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#9a7a8e', fontSize:12 }}>{s.label}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:24 }}>Shop</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
              {PRODUCTS.slice(0, 5).map(p => (
                <li key={p.id}><Link href={`/shop/${p.id}`} style={{ color:'#9a7a8e', fontSize:13 }}>{p.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:24 }}>Info</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
              {[{ label:'Our Story', href:'/#story' }, { label:'Lookbook', href:'/lookbook' }, { label:'Size Guide', href:'/size-guide' }, { label:'FAQ', href:'/faq' }, { label:'Contact', href:'/contact' }].map(l => (
                <li key={l.label}><Link href={l.href} style={{ color:'#9a7a8e', fontSize:13 }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:24 }}>Support</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:12 }}>
              {[{ label:'Shipping Info', href:'/faq' }, { label:'Returns', href:'/faq' }, { label:'Privacy Policy', href:'/privacy' }, { label:'Terms of Service', href:'/terms' }].map(l => (
                <li key={l.label}><Link href={l.href} style={{ color:'#9a7a8e', fontSize:13 }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'#9a7a8e' }}>© 2025 Faithfully Faded™ · A Tru Skool Entertainment Brand</div>
          <div style={{ display:'flex', gap:24 }}>
            <Link href="/privacy" style={{ fontSize:11, color:'#9a7a8e' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize:11, color:'#9a7a8e' }}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
