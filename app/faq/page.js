'use client'
import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  { q: 'What is the shipping time?', a: 'Standard shipping is 5-7 business days within the US. Express shipping (2-3 business days) is available at checkout. International shipping is coming soon.' },
  { q: 'Is shipping free?', a: 'Yes! Free standard shipping on all orders over $75. Orders under $75 have a flat rate of $5.99.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Exchanges are always free.' },
  { q: 'How do I start a return or exchange?', a: 'Email us at info@faithfullyfaded.com with your order number and reason. We\'ll send you a prepaid return label within 24 hours.' },
  { q: 'Do your clothes run true to size?', a: 'Most pieces run true to size with a relaxed fit. The Hooded Baseball Jersey Dress is designed oversized — size down one for a closer fit. Check our Size Guide for detailed measurements.' },
  { q: 'Is the Verde Edition really limited?', a: 'Yes — limited to exactly 100 units worldwide. Each piece has a numbered interior tag. Once they sell out, this colorway is retired permanently.' },
  { q: 'Can I cancel or modify my order?', a: 'We process orders quickly! Email us within 1 hour of placing your order and we\'ll do our best to accommodate changes.' },
  { q: 'Do you offer wholesale or bulk pricing?', a: 'Yes! For wholesale inquiries, reach out via our Contact page or email wholesale@faithfullyfaded.com with your business details.' },
  { q: 'Who is Ahnika?', a: 'Ahnika Merlot is our AI-powered style curator. She knows the collection inside out and can help with outfit recommendations, sizing advice, and more. Chat with her anytime from the butterfly icon on our site!' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
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
        <div className="section-label">Support</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300 }}>Frequently <em style={{ fontStyle:'italic', color:'#FFADED' }}>Asked</em></h1>
      </div>
      <div className="page-content" style={{ maxWidth:800 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom:'1px solid rgba(255,173,237,0.1)' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width:'100%', textAlign:'left', background:'none', border:'none', color:'#fdf8fc', padding:'24px 0',
              fontSize:16, fontFamily:'Cormorant Garamond,serif', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              {faq.q}
              <span style={{ color:'#FFADED', fontSize:20, transition:'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && <div style={{ padding:'0 0 24px', color:'#9a7a8e', fontSize:14, lineHeight:1.8 }}>{faq.a}</div>}
          </div>
        ))}
        <div style={{ marginTop:60, background:'rgba(66,4,32,0.08)', border:'1px solid rgba(255,173,237,0.15)', padding:32 }}>
          <p style={{ color:'#9a7a8e', fontSize:13, lineHeight:1.7 }}>Can&apos;t find what you&apos;re looking for? <Link href="/contact" style={{ color:'#FFADED' }}>Contact us</Link> or chat with Ahnika.</p>
        </div>
      </div>
    </div>
  )
}
