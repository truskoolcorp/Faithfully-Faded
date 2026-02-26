'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PRODUCTS, getProduct, getRelatedProducts } from '@/lib/products'

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const related = getRelatedProducts(slug, 3)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, paddingTop:100 }}>
        <div style={{ fontSize:48, opacity:0.3 }}>🦋</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32 }}>Product Not Found</h1>
        <Link href="/#shop" style={{ color:'#FFADED', fontSize:13, letterSpacing:'0.2em', textTransform:'uppercase' }}>← Back to Shop</Link>
      </div>
    )
  }

  const handleAdd = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div style={{ paddingTop:100 }}>
      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'24px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(8,8,8,0.95)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:14 }}>
          <img src="/images/butterfly-maroon.png" alt="FF" style={{ width:36, height:36, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(255,173,237,0.4))' }} />
          <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:17, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            Faithfully <span style={{ color:'#FFADED' }}>Faded</span>™
          </span>
        </Link>
        <div style={{ display:'flex', gap:36 }}>
          {[{ label:'Shop', href:'/#shop' }, { label:'Lookbook', href:'/lookbook' }, { label:'Contact', href:'/contact' }].map(l => (
            <Link key={l.label} href={l.href} style={{ color:'#9a7a8e', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase' }}>{l.label}</Link>
          ))}
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ padding:'0 80px', marginBottom:40 }}>
        <div style={{ fontSize:11, color:'#9a7a8e', display:'flex', gap:8 }}>
          <Link href="/" style={{ color:'#9a7a8e' }}>Home</Link> / <Link href="/#shop" style={{ color:'#9a7a8e' }}>Shop</Link> / <span style={{ color:'#FFADED' }}>{product.name}</span>
        </div>
      </div>

      {/* PRODUCT */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, padding:'0 80px 80px' }}>
        <div style={{ aspectRatio:'3/4', background:'linear-gradient(160deg,rgba(66,4,32,0.2),#0d0808)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, border:'1px solid rgba(255,173,237,0.1)', position:'relative' }}>
          <span style={{ fontSize:100, opacity:0.3 }}>{product.emoji}</span>
          {product.badge && <div style={{ position:'absolute', top:20, left:20, background: product.badge === 'Bestseller' ? '#FFADED' : '#150b0b', color: product.badge === 'Bestseller' ? '#420420' : '#FFADED', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'6px 14px' }}>{product.badge}</div>}
          <div style={{ position:'absolute', bottom:20, left:20, fontSize:10, color:'#9a7a8e', letterSpacing:'0.2em' }}>Product image coming soon</div>
        </div>

        <div>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#FFADED', marginBottom:8 }}>{product.category}</div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(32px,4vw,48px)', fontWeight:300, marginBottom:16 }}>{product.name}</h1>
          <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:32, color:'#FFADED', marginBottom:32 }}>${product.price}</div>
          <p style={{ color:'#9a7a8e', fontSize:14, lineHeight:1.8, marginBottom:40 }}>{product.description}</p>

          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9a7a8e', marginBottom:12 }}>Color — {product.colors[selectedColor].name}</div>
            <div style={{ display:'flex', gap:10 }}>
              {product.colors.map((c, i) => (
                <button key={c.hex} onClick={() => setSelectedColor(i)} style={{ width:36, height:36, borderRadius:'50%', background:c.hex, border: i === selectedColor ? '2px solid #FFADED' : '2px solid rgba(255,255,255,0.15)', cursor:'pointer', transition:'border-color 0.3s' }} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#9a7a8e', marginBottom:12 }}>Size</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{
                  padding:'12px 20px', fontSize:12, letterSpacing:'0.1em',
                  background: selectedSize === s ? '#420420' : 'transparent',
                  color: selectedSize === s ? '#fdf8fc' : '#9a7a8e',
                  border: selectedSize === s ? '1px solid #420420' : '1px solid rgba(255,173,237,0.15)',
                  cursor:'pointer', transition:'all 0.3s',
                }}>{s}</button>
              ))}
            </div>
            <Link href="/size-guide" style={{ fontSize:11, color:'#FFADED', marginTop:12, display:'inline-block', letterSpacing:'0.15em' }}>Size Guide →</Link>
          </div>

          <button onClick={handleAdd} style={{
            width:'100%', padding:20, fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', border:'none', transition:'all 0.3s',
            background: addedToCart ? '#2a6a2a' : '#420420',
            color:'#fdf8fc',
          }}>{addedToCart ? '✓ Added to Cart' : 'Add to Cart'}</button>

          <div style={{ marginTop:48, borderTop:'1px solid rgba(255,173,237,0.1)', paddingTop:32 }}>
            <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#FFADED', marginBottom:16 }}>Details</div>
            {product.details.map((d, i) => (
              <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,173,237,0.06)', fontSize:13, color:'#9a7a8e', display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ color:'#FFADED', fontSize:6 }}>◆</span>{d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RELATED */}
      <section style={{ padding:'80px', background:'#150b0b', borderTop:'1px solid rgba(255,173,237,0.1)' }}>
        <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:28, fontWeight:300, marginBottom:40 }}>You May Also Like</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:3 }}>
          {related.map(p => (
            <Link key={p.id} href={`/shop/${p.id}`} style={{ background:'#0f0b0e', display:'block' }}>
              <div style={{ aspectRatio:'3/4', background:'linear-gradient(160deg,rgba(66,4,32,0.2),#0d0808)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:48, opacity:0.25 }}>{p.emoji}</span>
              </div>
              <div style={{ padding:'20px 24px', borderTop:'1px solid rgba(255,173,237,0.1)', display:'flex', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:16 }}>{p.name}</div>
                  <div style={{ fontSize:10, color:'#9a7a8e', letterSpacing:'0.15em', textTransform:'uppercase' }}>{p.category}</div>
                </div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:20, color:'#FFADED' }}>${p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
