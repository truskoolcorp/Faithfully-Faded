'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
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
        <div className="section-label">Get in Touch</div>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300 }}>Contact <em style={{ fontStyle:'italic', color:'#FFADED' }}>Us</em></h1>
      </div>
      <div style={{ padding:'60px 80px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80 }}>
        <div>
          {submitted ? (
            <div style={{ textAlign:'center', padding:60 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🦋</div>
              <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:24, color:'#FFADED', marginBottom:8 }}>Message Sent</div>
              <p style={{ fontSize:13, color:'#9a7a8e' }}>We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <input placeholder="Your name" required style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,173,237,0.15)', color:'#fdf8fc', padding:'16px 22px', fontSize:14, outline:'none' }} />
              <input type="email" placeholder="Email address" required style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,173,237,0.15)', color:'#fdf8fc', padding:'16px 22px', fontSize:14, outline:'none' }} />
              <select style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,173,237,0.15)', color:'#9a7a8e', padding:'16px 22px', fontSize:14, outline:'none' }}>
                <option>General Inquiry</option><option>Order Support</option><option>Wholesale</option><option>Press</option><option>Collaboration</option>
              </select>
              <textarea placeholder="Your message" rows={6} required style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,173,237,0.15)', color:'#fdf8fc', padding:'16px 22px', fontSize:14, outline:'none', resize:'vertical' }} />
              <button type="submit" style={{ background:'#420420', color:'#fdf8fc', border:'none', padding:'16px 32px', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', alignSelf:'flex-start' }}>Send Message →</button>
            </form>
          )}
        </div>
        <div>
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:12 }}>Email</div>
            <a href="mailto:info@faithfullyfaded.com" style={{ color:'#9a7a8e', fontSize:14 }}>info@faithfullyfaded.com</a>
          </div>
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:12 }}>Location</div>
            <p style={{ color:'#9a7a8e', fontSize:14, lineHeight:1.7 }}>Dallas, Texas<br />United States</p>
          </div>
          <div style={{ marginBottom:40 }}>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:12 }}>Social</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <a href="https://instagram.com/faithfullyfaded23" target="_blank" rel="noreferrer" style={{ color:'#9a7a8e', fontSize:13 }}>Instagram →</a>
              <a href="https://tiktok.com/@faithfullyfaded23" target="_blank" rel="noreferrer" style={{ color:'#9a7a8e', fontSize:13 }}>TikTok →</a>
              <a href="https://twitter.com/FadedFaithfully" target="_blank" rel="noreferrer" style={{ color:'#9a7a8e', fontSize:13 }}>X (Twitter) →</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#FFADED', marginBottom:12 }}>Response Time</div>
            <p style={{ color:'#9a7a8e', fontSize:14 }}>We typically respond within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
