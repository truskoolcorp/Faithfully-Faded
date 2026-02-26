import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Faithfully Faded™' }

export default function Terms() {
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
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300 }}>Terms of <em style={{ fontStyle:'italic', color:'#FFADED' }}>Service</em></h1>
      </div>
      <div className="page-content legal-content">
        <p>Last updated: January 2025</p>
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using faithfullyfaded.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
        <h2>Products and Pricing</h2>
        <p>All prices are listed in US dollars. We reserve the right to modify prices at any time. Products are subject to availability. Limited edition items (such as the Verde Edition) cannot be restocked once sold out.</p>
        <h2>Orders and Payment</h2>
        <p>By placing an order, you represent that the information provided is accurate and that you are authorized to use the payment method. We reserve the right to cancel orders that appear fraudulent.</p>
        <h2>Shipping and Delivery</h2>
        <p>Standard shipping within the US is 5-7 business days. Free shipping on orders over $75. We are not responsible for delays caused by carriers or customs.</p>
        <h2>Returns and Exchanges</h2>
        <p>Returns are accepted within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Exchanges are free. Refunds are processed within 5-7 business days of receiving the returned item.</p>
        <h2>Intellectual Property</h2>
        <p>All content on this website, including the Faithfully Faded™ name, butterfly logo, product designs, and Ahnika Merlot character, are the property of Tru Skool Entertainment International Corp and are protected by trademark and copyright law.</p>
        <h2>Limitation of Liability</h2>
        <p>Faithfully Faded™ shall not be liable for any indirect, incidental, or consequential damages arising from use of this website or products purchased.</p>
        <h2>Contact</h2>
        <p>For questions about these terms, contact: info@faithfullyfaded.com</p>
        <p>Faithfully Faded™ — A Tru Skool Entertainment International Corp Brand<br />Dallas, Texas</p>
      </div>
    </div>
  )
}
