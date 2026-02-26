import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — Faithfully Faded™' }

export default function Privacy() {
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
        <div className="section-label">Legal</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300 }}>Privacy <em style={{ fontStyle:'italic', color:'#FFADED' }}>Policy</em></h1>
      </div>
      <div className="page-content legal-content">
        <p>Last updated: January 2025</p>
        <h2>Information We Collect</h2>
        <p>When you visit faithfullyfaded.com, we may collect personal information you provide directly, such as your name, email address, shipping address, and payment information when you make a purchase or subscribe to our newsletter.</p>
        <h2>How We Use Your Information</h2>
        <p>We use collected information to process and fulfill orders, communicate about your purchases, send marketing communications (with your consent), improve our website and services, and comply with legal obligations.</p>
        <h2>Information Sharing</h2>
        <p>We do not sell your personal information. We may share information with service providers who assist in order fulfillment, payment processing, and email delivery.</p>
        <h2>Data Security</h2>
        <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        <h2>Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by contacting us at info@faithfullyfaded.com.</p>
        <h2>Contact</h2>
        <p>For privacy-related inquiries, contact: info@faithfullyfaded.com</p>
        <p>Faithfully Faded™ — A Tru Skool Entertainment International Corp Brand<br />Dallas, Texas</p>
      </div>
    </div>
  )
}
