'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const PRODUCTS = [
  { id: 1, name: 'Hooded Baseball Jersey Dress', tag: 'Signature Collection', price: 69, colors: ['#420420','#1a1a6b','#1a1a1a'], badge: 'Bestseller', emoji: '👗' },
  { id: 2, name: 'Signature Crop Hoodie', tag: 'Streetwear', price: 54, colors: ['#420420','#2d2d2d'], badge: null, emoji: '👕' },
  { id: 3, name: 'Butterfly Varsity Tee', tag: 'Essentials', price: 38, colors: ['#fff0fb','#420420'], badge: 'New', emoji: '✦' },
]

type CartItem = { name: string; price: number }

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [ahnikaOpen, setAhnikaOpen] = useState(false)
  const [ahnikaMsg, setAhnikaMsg] = useState('')
  const [ahnikaChat, setAhnikaChat] = useState<{role:string;text:string}[]>([
    { role: 'ahnika', text: "Hi, I'm Ahnika Merlot 🦋 — your Faithfully Faded style guide. What vibe are you going for today?" }
  ])
  const [ahnikaLoading, setAhnikaLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ahnikaChat])

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function addToCart(product: typeof PRODUCTS[0]) {
    setCart(c => [...c, { name: product.name, price: product.price }])
    setCartOpen(true)
  }

  async function sendAhnika() {
    if (!ahnikaMsg.trim()) return
    const userMsg = ahnikaMsg
    setAhnikaMsg('')
    setAhnikaChat(c => [...c, { role: 'user', text: userMsg }])
    setAhnikaLoading(true)
    try {
      const res = await fetch('/api/ahnika', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: ahnikaChat })
      })
      const data = await res.json()
      setAhnikaChat(c => [...c, { role: 'ahnika', text: data.reply }])
    } catch {
      setAhnikaChat(c => [...c, { role: 'ahnika', text: "My connection dropped for a sec — try again? 🦋" }])
    }
    setAhnikaLoading(false)
  }

  const cartTotal = cart.reduce((s, i) => s + i.price, 0)

  return (
    <>
      <style>{`
        .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1); }
        .reveal.visible { opacity:1; transform:none; }
        .d1 { transition-delay:0.1s; }
        .d2 { transition-delay:0.2s; }
        .d3 { transition-delay:0.3s; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes flutter { 0%,100%{transform:scaleX(1) rotate(0deg)} 50%{transform:scaleX(.88) rotate(-3deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes scan { from{top:0} to{top:100%} }
        @keyframes pulse { 0%,100%{opacity:.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)} }
        @keyframes shimmer { from{background-position:0% center} to{background-position:200% center} }
        @keyframes heroIn { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
      `}</style>

      {/* CART BACKDROP */}
      {cartOpen && (
        <div onClick={() => setCartOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)',zIndex:199}} />
      )}

      {/* CART DRAWER */}
      <div style={{
        position:'fixed',top:0,right:cartOpen?0:'-520px',bottom:0,width:'480px',
        background:'#150b0b',borderLeft:'1px solid rgba(255,173,237,0.15)',
        zIndex:200,transition:'right 0.5s cubic-bezier(.16,1,.3,1)',
        padding:'48px 40px',display:'flex',flexDirection:'column'
      }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:40,paddingBottom:24,borderBottom:'1px solid rgba(255,173,237,0.12)'}}>
          <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:300}}>Your Cart</span>
          <button onClick={() => setCartOpen(false)} style={{background:'none',border:'none',color:'#9a7a8e',fontSize:22,cursor:'pointer',transition:'color 0.3s'}} onMouseOver={e=>(e.currentTarget.style.color='#FFADED')} onMouseOut={e=>(e.currentTarget.style.color='#9a7a8e')}>✕</button>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          {cart.length === 0 ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:200,gap:16,color:'#9a7a8e',fontSize:14}}>
              <span style={{fontSize:48,opacity:0.25}}>🛍</span>
              Your cart is empty
            </div>
          ) : cart.map((item, i) => (
            <div key={i} style={{padding:'16px 0',borderBottom:'1px solid rgba(255,173,237,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:16,marginBottom:4}}>{item.name}</div>
                <div style={{fontSize:11,letterSpacing:'0.1em',color:'#9a7a8e'}}>One Size</div>
              </div>
              <div style={{fontFamily:'Cormorant Garamond,serif',color:'#FFADED',fontSize:18}}>${item.price}</div>
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,173,237,0.12)',paddingTop:24,marginTop:24}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,fontFamily:'Cormorant Garamond,serif',fontSize:20}}>
            <span>Total</span>
            <span style={{color:'#FFADED'}}>${cartTotal}.00</span>
          </div>
          <button style={{width:'100%',background:'#420420',color:'#fdf8fc',border:'none',padding:18,fontFamily:'DM Sans,sans-serif',fontSize:12,letterSpacing:'0.2em',textTransform:'uppercase',cursor:'pointer',transition:'background 0.3s'}}
            onMouseOver={e=>(e.currentTarget.style.background='#FFADED',e.currentTarget.style.color='#420420')}
            onMouseOut={e=>(e.currentTarget.style.background='#420420',e.currentTarget.style.color='#fdf8fc')}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* AHNIKA CHAT */}
      <div style={{
        position:'fixed',bottom:24,right:24,zIndex:190,
        display:'flex',flexDirection:'column',alignItems:'flex-end',gap:12
      }}>
        {ahnikaOpen && (
          <div style={{
            width:360,background:'#150b0b',border:'1px solid rgba(255,173,237,0.2)',
            borderRadius:2,overflow:'hidden',display:'flex',flexDirection:'column',
            boxShadow:'0 20px 60px rgba(66,4,32,0.5)'
          }}>
            <div style={{background:'#420420',padding:'16px 20px',display:'flex',alignItems:'center',gap:12}}>
              <Image src="/images/ff-butterfly-green.png" alt="Ahnika" width={32} height={32} style={{objectFit:'contain',filter:'drop-shadow(0 0 6px rgba(255,173,237,0.4))'}} />
              <div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:16,fontStyle:'italic',color:'#FFADED'}}>Ahnika Merlot</div>
                <div style={{fontSize:10,letterSpacing:'0.2em',color:'rgba(255,173,237,0.6)',textTransform:'uppercase'}}>AI Style Guide · Live</div>
              </div>
              <button onClick={() => setAhnikaOpen(false)} style={{marginLeft:'auto',background:'none',border:'none',color:'rgba(255,173,237,0.5)',cursor:'pointer',fontSize:18}}>✕</button>
            </div>
            <div style={{height:280,overflowY:'auto',padding:'16px 20px',display:'flex',flexDirection:'column',gap:12}}>
              {ahnikaChat.map((msg, i) => (
                <div key={i} style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{
                    maxWidth:'80%',padding:'10px 14px',fontSize:13,lineHeight:1.6,
                    background:msg.role==='user'?'#420420':'rgba(255,173,237,0.08)',
                    color:msg.role==='user'?'#fdf8fc':'#cfc0cb',
                    borderRadius:2,border:msg.role!=='user'?'1px solid rgba(255,173,237,0.1)':'none'
                  }}>{msg.text}</div>
                </div>
              ))}
              {ahnikaLoading && (
                <div style={{display:'flex',justifyContent:'flex-start'}}>
                  <div style={{padding:'10px 14px',background:'rgba(255,173,237,0.08)',border:'1px solid rgba(255,173,237,0.1)',fontSize:13,color:'#9a7a8e'}}>typing...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,173,237,0.1)',display:'flex',gap:8}}>
              <input
                value={ahnikaMsg}
                onChange={e => setAhnikaMsg(e.target.value)}
                onKeyDown={e => e.key==='Enter' && sendAhnika()}
                placeholder="Ask Ahnika anything…"
                style={{flex:1,background:'rgba(255,173,237,0.05)',border:'1px solid rgba(255,173,237,0.15)',color:'#fdf8fc',padding:'10px 14px',fontSize:13,fontFamily:'DM Sans,sans-serif',outline:'none'}}
              />
              <button onClick={sendAhnika} style={{background:'#420420',border:'none',color:'#FFADED',padding:'10px 16px',cursor:'pointer',fontSize:16,transition:'background 0.3s'}}
                onMouseOver={e=>(e.currentTarget.style.background='#5c0a2e')}
                onMouseOut={e=>(e.currentTarget.style.background='#420420')}>→</button>
            </div>
          </div>
        )}
        <button
          onClick={() => setAhnikaOpen(o => !o)}
          style={{
            width:64,height:64,borderRadius:'50%',background:'#420420',
            border:'2px solid rgba(255,173,237,0.3)',cursor:'pointer',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 0 30px rgba(66,4,32,0.6)',transition:'all 0.3s',
            animation:'float 3s ease-in-out infinite'
          }}
          onMouseOver={e=>(e.currentTarget.style.boxShadow='0 0 50px rgba(255,173,237,0.3)')}
          onMouseOut={e=>(e.currentTarget.style.boxShadow='0 0 30px rgba(66,4,32,0.6)')}>
          <Image src="/images/ff-butterfly-green.png" alt="Chat with Ahnika" width={38} height={38} style={{objectFit:'contain'}} />
        </button>
      </div>

      {/* NAV */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,
        padding:'24px 56px',display:'flex',alignItems:'center',justifyContent:'space-between',
        background:'linear-gradient(to bottom, rgba(8,8,8,0.95) 0%, transparent 100%)'
      }}>
        <a href="#" style={{display:'flex',alignItems:'center',gap:14,textDecoration:'none'}}>
          <Image src="/images/ff-butterfly-maroon.png" alt="FF" width={36} height={36}
            style={{objectFit:'contain',filter:'drop-shadow(0 0 8px rgba(255,173,237,0.4))',animation:'flutter 3s ease-in-out infinite'}} />
          <span style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,letterSpacing:'0.12em',textTransform:'uppercase',color:'#fdf8fc'}}>
            Faithfully <span style={{color:'#FFADED'}}>Faded</span>™
          </span>
        </a>
        <div style={{display:'flex',gap:36}}>
          {['Shop','Lookbook','Our Story','Ahnika'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(' ','-')}`}
              style={{color:'#9a7a8e',textDecoration:'none',fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',transition:'color 0.3s'}}
              onMouseOver={e=>(e.currentTarget.style.color='#FFADED')}
              onMouseOut={e=>(e.currentTarget.style.color='#9a7a8e')}>{link}</a>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{
          background:'none',border:'1px solid rgba(255,173,237,0.2)',color:'#fdf8fc',
          padding:'10px 24px',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',
          cursor:'pointer',transition:'all 0.3s',fontFamily:'DM Sans,sans-serif'
        }}
          onMouseOver={e=>{e.currentTarget.style.background='#FFADED';e.currentTarget.style.color='#420420'}}
          onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='#fdf8fc'}}>
          Cart ({cart.length})
        </button>
      </nav>

      {/* HERO */}
      <section style={{minHeight:'100vh',position:'relative',display:'flex',alignItems:'flex-end',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 100% at 65% 50%, #1a0415 0%, #0d0210 40%, #080808 100%)'}} />
        {/* Hero image */}
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'52%',overflow:'hidden'}}>
          <Image src="/images/ff-billboard.png" alt="Faithfully Faded" fill style={{objectFit:'cover',objectPosition:'center',opacity:0.85}} priority />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to right, #080808 0%, transparent 35%), linear-gradient(to top, #080808 0%, transparent 35%)'}} />
        </div>
        <div style={{position:'relative',zIndex:2,padding:'0 80px 90px',width:'54%',animation:'heroIn 1.2s cubic-bezier(.16,1,.3,1) both'}}>
          <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#FFADED',marginBottom:20,display:'flex',alignItems:'center',gap:14}}>
            <span style={{display:'block',width:40,height:1,background:'#FFADED'}} />
            New Collection · 2025
          </div>
          <h1 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(72px,10vw,136px)',lineHeight:0.9,letterSpacing:'0.02em',color:'#fdf8fc',marginBottom:12}}>
            Faithfully
            <span style={{display:'block',color:'transparent',WebkitTextStroke:'1px #420420'}}>Faded</span>
          </h1>
          <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic',color:'#9a7a8e',marginBottom:48,letterSpacing:'0.06em'}}>Just be Blunt.</p>
          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <a href="#shop" style={{background:'#420420',color:'#fdf8fc',padding:'16px 40px',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',textDecoration:'none',transition:'all 0.4s',display:'inline-block',position:'relative',overflow:'hidden'}}
              onMouseOver={e=>{e.currentTarget.style.background='#FFADED';e.currentTarget.style.color='#420420'}}
              onMouseOut={e=>{e.currentTarget.style.background='#420420';e.currentTarget.style.color='#fdf8fc'}}>Shop Now</a>
            <a href="#story" style={{color:'#9a7a8e',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',textDecoration:'none',borderBottom:'1px solid transparent',padding:'4px 0',transition:'all 0.3s'}}
              onMouseOver={e=>{e.currentTarget.style.color='#FFADED';e.currentTarget.style.borderColor='#FFADED'}}
              onMouseOut={e=>{e.currentTarget.style.color='#9a7a8e';e.currentTarget.style.borderColor='transparent'}}>Our Story</a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{background:'#420420',padding:'13px 0',overflow:'hidden'}}>
        <div style={{display:'flex',animation:'marquee 22s linear infinite',whiteSpace:'nowrap'}}>
          {[...Array(10)].map((_,i) => (
            <span key={i} style={{fontFamily:'Bebas Neue,sans-serif',fontSize:13,letterSpacing:'0.25em',color:'#fdf8fc',padding:'0 40px',display:'flex',alignItems:'center',gap:40}}>
              Faithfully Faded™ <span style={{width:4,height:4,background:'rgba(255,255,255,0.35)',borderRadius:'50%',display:'inline-block'}} />
              Just Be Blunt <span style={{width:4,height:4,background:'rgba(255,255,255,0.35)',borderRadius:'50%',display:'inline-block'}} />
              Distinctive Apparel <span style={{width:4,height:4,background:'rgba(255,255,255,0.35)',borderRadius:'50%',display:'inline-block'}} />
              Free Shipping Over $75
            </span>
          ))}
        </div>
      </div>

      {/* BRAND MARK */}
      <section style={{padding:'72px 80px',background:'#0a0808',display:'flex',alignItems:'center',justifyContent:'center',gap:80,borderBottom:'1px solid rgba(255,173,237,0.1)'}}>
        {[
          { src:'/images/ff-butterfly-maroon.png', label:'Signature Mark', glow:'rgba(255,173,237,0.35)', hglow:'rgba(255,173,237,0.65)' },
          { src:'/images/ff-butterfly-green.png', label:'Verde Edition', glow:'rgba(80,180,80,0.3)', hglow:'rgba(80,200,80,0.55)' }
        ].map((b, i) => (
          <div key={i} className="reveal" style={{textAlign:'center',transitionDelay:`${i*0.15}s`}}>
            <Image src={b.src} alt={b.label} width={180} height={180}
              style={{objectFit:'contain',filter:`drop-shadow(0 0 28px ${b.glow})`,transition:'filter 0.4s'}}
              onMouseOver={e=>(e.currentTarget.style.filter=`drop-shadow(0 0 50px ${b.hglow})`)}
              onMouseOut={e=>(e.currentTarget.style.filter=`drop-shadow(0 0 28px ${b.glow})`)} />
            <div style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#9a7a8e',marginTop:16}}>{b.label}</div>
            <div style={{fontSize:9,letterSpacing:'0.2em',color:'rgba(255,173,237,0.3)',marginTop:6}}>#420420 · #FFADED</div>
          </div>
        ))}
        <div className="reveal d1" style={{textAlign:'center',fontFamily:'Cormorant Garamond,serif'}}>
          <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#FFADED',marginBottom:12}}>Faithfully Faded™</div>
          <div style={{fontFamily:'Bebas Neue,sans-serif',fontSize:72,lineHeight:0.9,color:'#fdf8fc',letterSpacing:'0.04em'}}>
            The<br/><span style={{color:'transparent',WebkitTextStroke:'1px #420420'}}>Mark</span>
          </div>
          <div style={{fontSize:13,color:'#9a7a8e',marginTop:16,fontStyle:'italic',maxWidth:280,lineHeight:1.7}}>
            Wings of the cannabis leaf.<br/>Body of the pineapple.<br/>Born from culture.
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" style={{padding:'120px 80px',background:'#150b0b'}}>
        <div className="reveal" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:72,borderBottom:'1px solid rgba(255,173,237,0.1)',paddingBottom:32}}>
          <div>
            <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#FFADED',display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
              <span style={{display:'block',width:30,height:1,background:'#FFADED'}} />Essential Collection
            </div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,5vw,64px)',fontWeight:300,lineHeight:1.05}}>
              The <em style={{fontStyle:'italic',color:'#FFADED'}}>Pieces</em><br/>That Define You
            </h2>
          </div>
          <a href="#" style={{color:'#9a7a8e',textDecoration:'none',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',borderBottom:'1px solid rgba(255,173,237,0.15)',paddingBottom:4,transition:'all 0.3s',whiteSpace:'nowrap'}}
            onMouseOver={e=>{e.currentTarget.style.color='#FFADED';e.currentTarget.style.borderColor='#FFADED'}}
            onMouseOut={e=>{e.currentTarget.style.color='#9a7a8e';e.currentTarget.style.borderColor='rgba(255,173,237,0.15)'}}>View All Styles →</a>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:3}}>
          {PRODUCTS.map((product, idx) => (
            <div key={product.id} className={`reveal d${idx}`}
              style={{position:'relative',background:'#0f0b0e',overflow:'hidden',cursor:'pointer'}}
              onMouseOver={e=>{const img=e.currentTarget.querySelector('.card-overlay') as HTMLElement; if(img) img.style.opacity='1'}}
              onMouseOut={e=>{const img=e.currentTarget.querySelector('.card-overlay') as HTMLElement; if(img) img.style.opacity='0'}}>
              <div style={{aspectRatio:idx===0?'2/3':'3/4',background:'linear-gradient(160deg,rgba(66,4,32,0.2) 0%,#0d0808 100%)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12,position:'relative',overflow:'hidden'}}>
                <span style={{fontSize:56,opacity:0.12,transition:'opacity 0.4s'}}>{product.emoji}</span>
                <span style={{fontSize:10,letterSpacing:'0.2em',color:'rgba(255,255,255,0.08)',textTransform:'uppercase'}}>Product Photo</span>
                <div className="card-overlay" style={{position:'absolute',inset:0,background:'rgba(66,4,32,0.2)',opacity:0,transition:'opacity 0.4s'}} />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(8,8,8,0.9) 0%,transparent 50%)'}} />
                {product.badge && (
                  <div style={{position:'absolute',top:16,left:16,background:idx===2?'#150b0b':'#FFADED',color:idx===2?'#FFADED':'#420420',fontSize:9,letterSpacing:'0.2em',textTransform:'uppercase',padding:'5px 12px',fontWeight:500}}>{product.badge}</div>
                )}
                <button
                  onClick={() => addToCart(product)}
                  style={{position:'absolute',top:16,right:16,background:'#420420',color:'#fdf8fc',border:'none',width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',opacity:0,transform:'translateY(-8px)',transition:'all 0.3s'}}
                  className="add-btn"
                  onMouseOver={e=>{e.currentTarget.style.background='#FFADED';e.currentTarget.style.color='#420420'}}
                  onMouseOut={e=>{e.currentTarget.style.background='#420420';e.currentTarget.style.color='#fdf8fc'}}>+</button>
              </div>
              <div style={{padding:'20px 24px 28px',borderTop:'1px solid rgba(255,173,237,0.1)',display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
                <div>
                  <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:18,marginBottom:4}}>{product.name}</div>
                  <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'#9a7a8e',marginBottom:8}}>{product.tag}</div>
                  <div style={{display:'flex',gap:6}}>
                    {product.colors.map((c,ci) => (
                      <div key={ci} style={{width:14,height:14,borderRadius:'50%',background:c,border:'1px solid rgba(255,255,255,0.15)',cursor:'pointer',transition:'transform 0.2s'}}
                        onMouseOver={e=>(e.currentTarget.style.transform='scale(1.35)')}
                        onMouseOut={e=>(e.currentTarget.style.transform='scale(1)')} />
                    ))}
                  </div>
                </div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,color:'#FFADED'}}>${product.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add to cart hover fix via global style injection */}
        <style>{`
          .reveal:hover .add-btn { opacity:1 !important; transform:translateY(0) !important; }
        `}</style>
      </section>

      {/* STORY */}
      <section id="story" style={{padding:'120px 80px',background:'#420420',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',fontFamily:'Bebas Neue,sans-serif',fontSize:'40vw',color:'rgba(0,0,0,0.08)',right:'-8vw',top:'50%',transform:'translateY(-50%)',lineHeight:1,pointerEvents:'none',userSelect:'none'}}>FF</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:80,alignItems:'center',position:'relative',zIndex:1}}>
          <div className="reveal">
            <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'rgba(255,173,237,0.7)',display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
              <span style={{display:'block',width:30,height:1,background:'rgba(255,173,237,0.7)'}} />Our Story
            </div>
            <blockquote style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4.5vw,58px)',fontWeight:300,fontStyle:'italic',lineHeight:1.2,color:'#fff0fb'}}>
              "Just be Blunt. Be who you are, always."
            </blockquote>
          </div>
          <div className="reveal d1">
            <p style={{color:'rgba(255,240,251,0.75)',fontSize:15,lineHeight:1.9,marginBottom:20}}>
              Faithfully Faded™ was born from the intersection of culture, identity, and uncompromising self-expression. We don't design clothes — we design permission. Permission to be exactly who you are, in exactly the room you walk into.
            </p>
            <p style={{color:'rgba(255,240,251,0.75)',fontSize:15,lineHeight:1.9,marginBottom:20}}>
              Rooted in the creative vision of Tru Skool Entertainment, every stitch carries intention. The butterfly isn't decoration — it's transformation. The fade isn't absence — it's evolution.
            </p>
            <p style={{color:'rgba(255,240,251,0.75)',fontSize:15,lineHeight:1.9}}>
              Distinctive apparel for distinctive people.
            </p>
            <div style={{marginTop:40,fontFamily:'Cormorant Garamond,serif',fontSize:22,fontStyle:'italic',color:'#FFADED'}}>
              — Faithfully Faded™, Dallas TX
            </div>
          </div>
        </div>
      </section>

      {/* AHNIKA */}
      <section id="ahnika" style={{padding:'120px 80px',background:'#150b0b',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(66,4,32,0.45) 0%,transparent 70%)',top:'50%',left:'50%',animation:'pulse 4s ease-in-out infinite',pointerEvents:'none'}} />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center',position:'relative',zIndex:1}}>
          <div className="reveal" style={{position:'relative',overflow:'hidden',background:'linear-gradient(160deg,#200a0a,#0f0808)',border:'1px solid rgba(255,173,237,0.15)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:60,gap:20,aspectRatio:'3/4'}}>
            <div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(to right,transparent,#FFADED,transparent)',animation:'scan 3s linear infinite',opacity:0.35}} />
            <div style={{animation:'float 3s ease-in-out infinite'}}>
              <Image src="/images/ff-butterfly-green.png" alt="Ahnika Merlot" width={160} height={160} style={{objectFit:'contain',filter:'drop-shadow(0 0 24px rgba(255,173,237,0.3))'}} />
            </div>
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,fontStyle:'italic',color:'#FFADED',letterSpacing:'0.08em'}}>Ahnika Merlot</div>
            <div style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#9a7a8e'}}>AI Style Curator</div>
          </div>
          <div className="reveal d1">
            <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#FFADED',display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
              <span style={{display:'block',width:30,height:1,background:'#FFADED'}} />Meet Your Stylist
            </div>
            <div style={{display:'inline-block',background:'rgba(255,173,237,0.08)',border:'1px solid rgba(255,173,237,0.25)',color:'#FFADED',fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',padding:'8px 20px',marginBottom:24}}>Powered by AI · Live Now</div>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:300,lineHeight:1.2,marginBottom:24}}>
              Meet <em style={{fontStyle:'italic',color:'#FFADED'}}>Ahnika</em>,<br/>Your Personal<br/>Style Guide
            </h2>
            <p style={{color:'#9a7a8e',fontSize:15,lineHeight:1.8,marginBottom:32}}>
              Ahnika Merlot is Faithfully Faded's AI style curator — always on, always on-brand. She knows the collection inside out and helps you find your perfect look with the energy of a stylist who lives and breathes the culture.
            </p>
            <ul style={{listStyle:'none',marginBottom:40}}>
              {['Personalized outfit recommendations','Live style consultations, 24/7','Real-time inventory awareness','Cultural context behind each piece'].map(f => (
                <li key={f} style={{padding:'12px 0',borderBottom:'1px solid rgba(255,173,237,0.08)',fontSize:13,color:'#cfc0cb',display:'flex',alignItems:'center',gap:14}}>
                  <span style={{color:'#FFADED',fontSize:8}}>◆</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => setAhnikaOpen(true)} style={{background:'#420420',color:'#fdf8fc',border:'none',padding:'16px 40px',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.3s',fontFamily:'DM Sans,sans-serif'}}
              onMouseOver={e=>{e.currentTarget.style.background='#FFADED';e.currentTarget.style.color='#420420'}}
              onMouseOut={e=>{e.currentTarget.style.background='#420420';e.currentTarget.style.color='#fdf8fc'}}>Chat with Ahnika →</button>
          </div>
        </div>
      </section>

      {/* AR TEASER */}
      <section style={{padding:'100px 80px',background:'#080808',textAlign:'center',borderTop:'1px solid rgba(255,173,237,0.1)'}}>
        <div className="reveal">
          <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'#FFADED',display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:24}}>
            <span style={{display:'block',width:30,height:1,background:'#FFADED'}} />Coming Phase 2<span style={{display:'block',width:30,height:1,background:'#FFADED'}} />
          </div>
          <h2 style={{fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,120px)',letterSpacing:'0.04em',background:'linear-gradient(to right,#420420,#FFADED,#420420)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',backgroundSize:'200% auto',animation:'shimmer 4s linear infinite',marginBottom:16}}>SEE IT ON YOU</h2>
          <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:20,fontStyle:'italic',color:'#9a7a8e',marginBottom:56}}>3D Augmented Reality Try-On — point your camera, wear the collection.</p>
          <div style={{display:'flex',justifyContent:'center',gap:60,marginBottom:56,flexWrap:'wrap'}}>
            {[['📱','Mobile AR'],['🪞','Virtual Mirror'],['🎨','Color Swap'],['📐','Size Guide']].map(([icon,label]) => (
              <div key={label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <div style={{width:64,height:64,border:'1px solid rgba(255,173,237,0.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,background:'rgba(66,4,32,0.08)',transition:'all 0.4s'}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='#FFADED';e.currentTarget.style.transform='scale(1.1)'}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,173,237,0.15)';e.currentTarget.style.transform='scale(1)'}}>{icon}</div>
                <div style={{fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#9a7a8e'}}>{label}</div>
              </div>
            ))}
          </div>
          <button style={{background:'none',border:'1px solid rgba(255,173,237,0.25)',color:'#FFADED',padding:'16px 40px',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.3s',fontFamily:'DM Sans,sans-serif'}}
            onMouseOver={e=>{e.currentTarget.style.background='#420420'}}
            onMouseOut={e=>{e.currentTarget.style.background='none'}}>Notify Me When It's Live</button>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{padding:'100px 80px',background:'#420420',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
        <div className="reveal">
          <div style={{fontSize:10,letterSpacing:'0.4em',textTransform:'uppercase',color:'rgba(255,173,237,0.7)',display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
            <span style={{display:'block',width:30,height:1,background:'rgba(255,173,237,0.7)'}} />Stay Connected
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4vw,52px)',fontWeight:300,lineHeight:1.2,color:'#fff0fb'}}>
            First to the Drop,<br/><em style={{fontStyle:'italic',color:'#FFADED'}}>First to the Culture</em>
          </h2>
        </div>
        <div className="reveal d1" style={{display:'flex',flexDirection:'column',gap:14}}>
          {['Your email address','First name (optional)'].map(ph => (
            <input key={ph} placeholder={ph} style={{background:'rgba(0,0,0,0.2)',border:'1px solid rgba(255,255,255,0.18)',color:'#fdf8fc',padding:'16px 22px',fontFamily:'DM Sans,sans-serif',fontSize:14,outline:'none',width:'100%',transition:'border-color 0.3s'}}
              onFocus={e=>(e.target.style.borderColor='rgba(255,173,237,0.5)')}
              onBlur={e=>(e.target.style.borderColor='rgba(255,255,255,0.18)')} />
          ))}
          <button style={{background:'#080808',color:'#FFADED',border:'none',padding:'16px 32px',fontFamily:'DM Sans,sans-serif',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',cursor:'pointer',transition:'all 0.3s',alignSelf:'flex-start'}}
            onMouseOver={e=>{e.currentTarget.style.background='#FFADED';e.currentTarget.style.color='#420420'}}
            onMouseOut={e=>{e.currentTarget.style.background='#080808';e.currentTarget.style.color='#FFADED'}}>
            Subscribe & Get 15% Off →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'72px 80px 40px',background:'#150b0b',borderTop:'1px solid rgba(255,173,237,0.1)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:60,marginBottom:60,paddingBottom:60,borderBottom:'1px solid rgba(255,173,237,0.1)'}}>
          <div>
            <Image src="/images/ff-butterfly-maroon.png" alt="FF" width={52} height={52} style={{objectFit:'contain',marginBottom:12,filter:'drop-shadow(0 0 8px rgba(255,173,237,0.3))'}} />
            <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:20,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:14}}>
              Faithfully <span style={{color:'#FFADED'}}>Faded</span>™
            </div>
            <p style={{fontSize:13,color:'#9a7a8e',lineHeight:1.7,marginBottom:24}}>Distinctive apparel for distinctive people. Dallas, TX. Culture first, always.</p>
            <div style={{display:'flex',gap:12}}>
              {[['fb','https://facebook.com/faithfullyfaded23'],['ig','https://instagram.com/faithfullyfaded23'],['tt','https://tiktok.com/@faithfullyfaded23'],['𝕏','https://twitter.com/FadedFaithfully']].map(([label,href]) => (
                <a key={label} href={href} style={{width:36,height:36,border:'1px solid rgba(255,173,237,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#9a7a8e',textDecoration:'none',fontSize:12,transition:'all 0.3s'}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='#FFADED';e.currentTarget.style.color='#FFADED'}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,173,237,0.15)';e.currentTarget.style.color='#9a7a8e'}}>{label}</a>
              ))}
            </div>
          </div>
          {[
            { title:'Shop', links:['New Arrivals','Signature Collection','Essentials','Sale','Gift Cards'] },
            { title:'Info', links:['Our Story','Ahnika','AR Try-On','Lookbook','Blog'] },
            { title:'Support', links:['Contact Us','Shipping Info','Returns','Size Guide','FAQ'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{fontSize:10,letterSpacing:'0.3em',textTransform:'uppercase',color:'#FFADED',marginBottom:24}}>{col.title}</div>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:12}}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{color:'#9a7a8e',textDecoration:'none',fontSize:13,transition:'color 0.3s'}}
                      onMouseOver={e=>(e.currentTarget.style.color='#fff0fb')}
                      onMouseOut={e=>(e.currentTarget.style.color='#9a7a8e')}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:12,color:'#9a7a8e'}}>© 2025 Faithfully Faded™ · A Tru Skool Entertainment Brand</div>
          <div style={{display:'flex',gap:24}}>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <a key={l} href="#" style={{fontSize:11,color:'#9a7a8e',textDecoration:'none',transition:'color 0.3s'}}
                onMouseOver={e=>(e.currentTarget.style.color='#fff0fb')}
                onMouseOut={e=>(e.currentTarget.style.color='#9a7a8e')}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
