'use client'

export default function CartDrawer({ open, onClose, items }) {
  const total = items.reduce((s, i) => s + i.price, 0)

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 199,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity 0.4s',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: open ? 0 : -500, bottom: 0,
        width: 460,
        background: '#150b0b',
        borderLeft: '1px solid rgba(255,173,237,0.12)',
        zIndex: 200,
        transition: 'right 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '48px 40px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingBottom: 24, borderBottom: '1px solid rgba(255,173,237,0.1)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, letterSpacing: '0.06em' }}>Your Cart</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9a7a8e', fontSize: 22, transition: 'color 0.3s' }}
            onMouseEnter={e => e.target.style.color = '#FFADED'}
            onMouseLeave={e => e.target.style.color = '#9a7a8e'}
          >✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 14, color: '#9a7a8e', fontSize: 14 }}>
              <div style={{ fontSize: 44, opacity: 0.2 }}>🛍</div>
              Your cart is empty
            </div>
          ) : (
            items.map((item, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,173,237,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#9a7a8e' }}>One Size</div>
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", color: '#FFADED', fontSize: 18 }}>${item.price}</div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,173,237,0.1)', paddingTop: 24, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>
            <span>Total</span>
            <span style={{ color: '#FFADED' }}>${total}.00</span>
          </div>
          <button style={{ width: '100%', background: '#420420', color: '#fdf8fc', border: 'none', padding: 18, fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'background 0.3s' }}
            onMouseEnter={e => e.target.style.background = '#FFADED'}
            onMouseLeave={e => e.target.style.background = '#420420'}
          >
            {items.length > 0 ? 'Proceed to Checkout' : 'Continue Shopping'}
          </button>
          <p style={{ fontSize: 11, color: '#9a7a8e', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
            Checkout powered by Shopify · Secure payments
          </p>
        </div>
      </div>
    </>
  )
}
