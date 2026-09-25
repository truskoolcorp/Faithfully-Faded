// Floating bag button. Snipcart opens the cart for any element with .snipcart-checkout
// and keeps .snipcart-items-count in sync with the cart.
export default function CartButton() {
  return (
    <button
      type="button"
      className="snipcart-checkout"
      aria-label="Open shopping bag"
      style={{
        position: 'fixed', left: 24, bottom: 24, zIndex: 150,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 22px', border: '1px solid rgba(255,173,237,0.35)',
        background: '#420420', color: '#fdf8fc', cursor: 'pointer',
        fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
      }}
    >
      Bag (<span className="snipcart-items-count">0</span>)
    </button>
  )
}
