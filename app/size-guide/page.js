import Link from 'next/link'

export const metadata = { title: 'Size Guide — Faithfully Faded™' }

export default function SizeGuide() {
  const sizes = [
    { size: 'XS', chest: '32-34', waist: '24-26', hips: '34-36' },
    { size: 'S', chest: '34-36', waist: '26-28', hips: '36-38' },
    { size: 'M', chest: '36-38', waist: '28-30', hips: '38-40' },
    { size: 'L', chest: '38-40', waist: '30-32', hips: '40-42' },
    { size: 'XL', chest: '40-42', waist: '32-34', hips: '42-44' },
    { size: '2XL', chest: '42-44', waist: '34-36', hips: '44-46' },
    { size: '3XL', chest: '44-46', waist: '36-38', hips: '46-48' },
  ]
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
        <div className="section-label">Fit Reference</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300 }}>Size <em style={{ fontStyle:'italic', color:'#FFADED' }}>Guide</em></h1>
      </div>
      <div className="page-content">
        <p style={{ color:'#9a7a8e', fontSize:14, lineHeight:1.8, marginBottom:40, maxWidth:600 }}>All measurements are in inches. Our pieces are designed with a relaxed fit — size down for a closer silhouette.</p>
        <table style={{ width:'100%', maxWidth:700, borderCollapse:'collapse', marginBottom:60 }}>
          <thead>
            <tr>{['Size','Chest','Waist','Hips'].map(h => <th key={h} style={{ textAlign:'left', padding:'16px 20px', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#FFADED', borderBottom:'1px solid rgba(255,173,237,0.2)' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {sizes.map(s => (
              <tr key={s.size}>
                <td style={{ padding:'14px 20px', fontSize:14, color:'#fdf8fc', borderBottom:'1px solid rgba(255,173,237,0.06)', fontWeight:500 }}>{s.size}</td>
                <td style={{ padding:'14px 20px', fontSize:13, color:'#9a7a8e', borderBottom:'1px solid rgba(255,173,237,0.06)' }}>{s.chest}&quot;</td>
                <td style={{ padding:'14px 20px', fontSize:13, color:'#9a7a8e', borderBottom:'1px solid rgba(255,173,237,0.06)' }}>{s.waist}&quot;</td>
                <td style={{ padding:'14px 20px', fontSize:13, color:'#9a7a8e', borderBottom:'1px solid rgba(255,173,237,0.06)' }}>{s.hips}&quot;</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ background:'rgba(66,4,32,0.08)', border:'1px solid rgba(255,173,237,0.15)', padding:32, maxWidth:600 }}>
          <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#FFADED', marginBottom:12 }}>Need Help?</div>
          <p style={{ color:'#9a7a8e', fontSize:13, lineHeight:1.7 }}>Not sure about your size? Chat with Ahnika — she can help you find the perfect fit based on your measurements and style preference.</p>
        </div>
      </div>
    </div>
  )
}
