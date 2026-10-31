'use client'
import {useState} from 'react'
import Link from 'next/link'
export default function Contact(){
 const [notice,setNotice]=useState('')
 function openDraft(event){
  event.preventDefault()
  const data=new FormData(event.currentTarget)
  const subject='Faithfully Faded — '+String(data.get('topic')||'Support')
  const body='Name: '+String(data.get('name')||'')+'\nReply email: '+String(data.get('email')||'')+'\n\n'+String(data.get('message')||'')
  window.location.href='mailto:truskoolcorp@truskool.net?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)
  setNotice('Finish sending in your email app. This website has not sent your message. If no email app opens, email truskoolcorp@truskool.net directly.')
 }
 const field={display:'block',width:'100%',background:'#150b0b',border:'1px solid #9a7a8e',color:'#fdf8fc',padding:14,marginTop:6}
 return <div style={{maxWidth:900,margin:'0 auto',padding:'40px 24px'}}>
  <Link href="/">← Faithfully Faded® Home</Link>
  <h1 style={{fontSize:42,margin:'28px 0 12px'}}>Contact Faithfully Faded</h1>
  <p>Order support, returns, exchanges and general questions: <a style={{textDecoration:'underline'}} href="mailto:truskoolcorp@truskool.net">truskoolcorp@truskool.net</a>. Include your order number when available.</p>
  <p style={{margin:'16px 0 28px'}}>Use the form to prepare an email in your own email app. You review and send it there. Do not include payment-card details or passwords.</p>
  <form onSubmit={openDraft} style={{display:'grid',gap:20,maxWidth:650}}>
   <label>Your name<input name="name" autoComplete="name" required style={field}/></label>
   <label>Email address<input type="email" name="email" autoComplete="email" required style={field}/></label>
   <label>Topic<select name="topic" style={field}><option>General inquiry</option><option>Order support</option><option>Return or exchange</option><option>Wholesale</option><option>Press or collaboration</option></select></label>
   <label>Message<textarea name="message" rows={6} required style={field}/></label>
   <button type="submit" style={{background:'#420420',color:'#fdf8fc',border:'1px solid #FFADED',padding:16}}>Open email draft</button>
   <p aria-live="polite">{notice}</p>
  </form>
  <nav aria-label="Store policies" style={{display:'flex',flexWrap:'wrap',gap:20,marginTop:32}}><Link href="/shipping">Shipping</Link><Link href="/returns">Returns &amp; refunds</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
 </div>
}
