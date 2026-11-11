'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { allowed, itemPayload, purchasePayload, PIXEL_ID, CONSENT_KEY } from '@/lib/meta-tracking.mjs'

export default function MarketingTracking({ enabled = false }) {
  const path = usePathname()
  const [choice, setChoice] = useState(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [gpc, setGpc] = useState(false)
  const lastView = useRef('')
  const sentOrders = useRef(new Set())
  useEffect(() => {
    setGpc(navigator.globalPrivacyControl === true)
    try { setChoice(localStorage.getItem(CONSENT_KEY)) } catch {}
    setReady(true)
  }, [])
  const consented = enabled && allowed(choice, gpc)
  function choose(value) {
    try { localStorage.setItem(CONSENT_KEY, value) } catch {}
    setChoice(value); setOpen(false)
  }
  useEffect(() => {
    function changed(event) { if (event.key === CONSENT_KEY) setChoice(event.newValue) }
    window.addEventListener('storage', changed)
    return () => window.removeEventListener('storage', changed)
  }, [])
  useEffect(() => {
    if (!consented) { window.fbq?.('consent', 'revoke'); lastView.current = ''; return }
    if (!window.fbq) {
      const q = function() { q.callMethod ? q.callMethod.apply(q, arguments) : q.queue.push(arguments) }
      q.queue = []; q.loaded = true; q.version = '2.0'; q.push = q
      window.fbq = q; window._fbq = q
      q('set', 'autoConfig', false, PIXEL_ID)
      q('init', PIXEL_ID)
      const script = document.createElement('script')
      script.id = 'ff-meta-pixel'; script.async = true
      script.src = 'https://connect.facebook.net/en_US/fbevents.js'
      document.head.appendChild(script)
    }
    window.fbq('consent', 'grant')
    const cleanPage = location.origin + path
    if (lastView.current !== cleanPage) {
      lastView.current = cleanPage
      window.fbq('trackSingle', PIXEL_ID, 'PageView', {})
      if (path === '/shop/hooded-baseball-jersey-dress') window.fbq('trackSingle', PIXEL_ID, 'ViewContent', {
        content_ids: ['hooded-baseball-jersey-dress'], content_type: 'product_group', currency: 'USD', value: 69
      })
    }
  }, [consented, path])
  useEffect(() => {
    if (!consented) return
    let dispose = []
    let bound = false
    function bind() {
      if (bound || !window.Snipcart?.events) return
      bound = true
      dispose.push(window.Snipcart.events.on('item.added', item => {
        if (!allowed(localChoice(), navigator.globalPrivacyControl)) return
        const data = itemPayload(item)
        if (data) window.fbq?.('trackSingle', PIXEL_ID, 'AddToCart', data)
      }))
      dispose.push(window.Snipcart.events.on('cart.confirmed', async response => {
        if (!allowed(localChoice(), navigator.globalPrivacyControl)) return
        const purchase = purchasePayload(response)
        if (!purchase) return
        // The order token stays local; only a one-way digest is used for deduplication.
        const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(purchase.token))
        const id = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('')
        const key = 'ff-meta-purchase-' + id
        if (sentOrders.current.has(id)) return
        try { if (localStorage.getItem(key)) return } catch {}
        if (!allowed(localChoice(), navigator.globalPrivacyControl)) return
        window.fbq?.('trackSingle', PIXEL_ID, 'Purchase', purchase.data, { eventID: id })
        sentOrders.current.add(id)
        try { localStorage.setItem(key, '1') } catch {}
      }))
    }
    function localChoice() { try { return localStorage.getItem(CONSENT_KEY) } catch { return choice } }
    bind()
    document.addEventListener('snipcart.ready', bind)
    return () => { document.removeEventListener('snipcart.ready', bind); dispose.forEach(fn => fn?.()) }
  }, [consented, choice])
  if (!enabled || !ready) return null
  return <>
    <button type="button" onClick={() => setOpen(true)} style={{position:'fixed',left:12,bottom:12,zIndex:999,fontSize:12,padding:'8px 12px',background:'#fff',color:'#420420',border:'1px solid #420420',borderRadius:4}}>Privacy choices</button>
    {(open || (!choice && !gpc)) && <section role="dialog" aria-label="Marketing privacy choices" style={{position:'fixed',left:12,right:12,bottom:52,zIndex:1000,maxWidth:580,padding:20,background:'#fff',color:'#24101c',border:'1px solid #420420',borderRadius:8,boxShadow:'0 4px 24px #0005'}}>
      <strong>Optional marketing measurement</strong>
      <p style={{fontSize:14,lineHeight:1.5,margin:'10px 0'}}>Allow Meta to receive page visits, current product choices and confirmed purchase totals to measure our marketing. Meta may process browser identifiers, IP address and page URLs. Shopping works either way. <a href="/privacy" style={{textDecoration:'underline'}}>Privacy policy</a></p>
      {gpc && <p>Your browser’s Global Privacy Control is on. Meta tracking stays off.</p>}
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <button type="button" onClick={() => choose('deny')} style={{padding:'10px 16px'}}>Decline</button>
        <button type="button" disabled={gpc} onClick={() => choose('allow')} style={{padding:'10px 16px'}}>Allow Meta measurement</button>
      </div>
    </section>}
  </>
}
