import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'

export const metadata = { title: 'Lookbook — Faithfully Faded™' }

export default function Lookbook() {
  return (
    <div className="page-wrapper">
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'24px 56px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(8,8,8,0.95)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:14 }}>
          <img src="/images/butterfly-maroon.png" alt="FF" style={{ width:36, height:36, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(255,173,237,0.4))' }} />
          <span style={{ fontFamily:'Cormorant Garamond,serif', fontSize:17, letterSpacing:'0.12em', textTransform:'uppercase' }}>Faithfully <span style={{ color:'#FFADED' }}>Faded</span>™</span>
        </Link>
        <Link href="/" style={{ color:'#9a7a8e', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase' }}>← Back</Link>
      </nav>
      <div className="page-hero">
        <div className="section-label">Lookbook</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300 }}>The <em style={{ fontStyle:'italic', color:'#FFADED' }}>Collection</em></h1>
      </div>
      <div style={{ padding:'60px 80px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:3 }}>
        {PRODUCTS.map(p => (
          <Link key={p.id} href={`/shop/${p.id}`} style={{ background:'#0f0b0e', display:'block' }}>
            <div style={{ aspectRatio:'3/4', background:'linear-gradient(160deg,rgba(66,4,32,0.2),#0d0808)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <span style={{ fontSize:56, opacity:0.25 }}>{p.emoji}</span>
              {p.badge && <div style={{ position:'absolute', top:16, left:16, background:'#150b0b', color:'#FFADED', fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', padding:'5px 12px' }}>{p.badge}</div>}
            </div>
            <div style={{ padding:'20px 24px', borderTop:'1px solid rgba(255,173,237,0.1)', display:'flex', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:18 }}>{p.name}</div>
                <div style={{ fontSize:10, color:'#9a7a8e', letterSpacing:'0.15em', textTransform:'uppercase' }}>{p.category}</div>
              </div>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:22, color:'#FFADED' }}>${p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
