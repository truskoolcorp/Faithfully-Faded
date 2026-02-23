'use client'
import { useEffect } from 'react'
import Image from 'next/image'

const PRODUCTS = [
  {
    id: 'jersey-dress',
    name: 'Hooded Baseball Jersey Dress',
    tag: 'Signature Collection',
    price: 69,
    badge: 'Bestseller',
    badgeStyle: { background: '#FFADED', color: '#080808' },
    colors: ['#420420', '#1a1a6b', '#1a1a1a'],
    icon: '👗',
    shopifyVariantId: null, // Add your Shopify variant ID here
  },
  {
    id: 'crop-hoodie',
    name: 'Signature Crop Hoodie',
    tag: 'Streetwear',
    price: 54,
    badge: null,
    colors: ['#420420', '#2d2d2d'],
    icon: '🧥',
    shopifyVariantId: null,
  },
  {
    id: 'varsity-tee',
    name: 'Butterfly Varsity Tee',
    tag: 'Essentials',
    price: 38,
    badge: 'New',
    badgeStyle: { background: '#0f0b0e', color: '#FFADED', border: '1px solid rgba(255,173,237,0.3)' },
    colors: ['#fff0fb', '#420420'],
    icon: '👕',
    shopifyVariantId: null,
  },
]

export default function Shop({ onAddToCart }) {
  // Shopify Buy Button SDK loader
  // Uncomment and configure once you have your Shopify Starter store set up:
  /*
  useEffect(() => {
    if (window.ShopifyBuy) return
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
    script.onload = () => initShopify()
    document.head.appendChild(script)
  }, [])

  function initShopify() {
    const client = window.ShopifyBuy.buildClient({
      domain: 'YOUR-STORE.myshopify.com',       // ← your Shopify Starter domain
      storefrontAccessToken: 'YOUR_TOKEN',        // ← from Shopify admin > Apps > Storefront API
    })
    // Build buy buttons per product using client + product IDs
  }
  */

  return (
    <section id="shop" style={{ padding: '120px 80px', background: '#150b0b' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 72, borderBottom: '1px solid rgba(255,173,237,0.12)', paddingBottom: 32
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#FFADED', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ display: 'block', width: 28, height: 1, background: '#FFADED' }} />
            Essential Collection
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 300, lineHeight: 1.05 }}>
            The <em style={{ fontStyle: 'italic', color: '#FFADED' }}>Pieces</em><br />That Define You
          </h2>
        </div>
        <a href="#" style={{ color: '#9a7a8e', textDecoration: 'none', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', paddingBottom: 4, borderBottom: '1px solid rgba(255,173,237,0.2)', transition: 'all 0.3s', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.target.style.color = '#FFADED'; e.target.style.borderColor = '#FFADED'; }}
          onMouseLeave={e => { e.target.style.color = '#9a7a8e'; e.target.style.borderColor = 'rgba(255,173,237,0.2)'; }}
        >View All Styles →</a>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 2 }}>
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.id} product={p} featured={i === 0} onAddToCart={onAddToCart} />
        ))}
      </div>

      {/* Shopify setup notice — remove once configured */}
      <div style={{
        marginTop: 40, padding: '20px 28px',
        border: '1px dashed rgba(255,173,237,0.2)',
        display: 'flex', alignItems: 'center', gap: 16
      }}>
        <span style={{ color: '#FFADED', fontSize: 18 }}>⚡</span>
        <div>
          <div style={{ fontSize: 12, color: '#FFADED', letterSpacing: '0.1em', marginBottom: 4 }}>Shopify Buy Button — Ready to Connect</div>
          <div style={{ fontSize: 12, color: '#9a7a8e', lineHeight: 1.6 }}>
            Once your Shopify Starter account is set up, add your store domain + Storefront API token to <code style={{ background: 'rgba(255,173,237,0.08)', padding: '1px 6px', fontSize: 11 }}>src/components/Shop.js</code> to activate real checkout.
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, featured, onAddToCart }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', background: '#0f0c0c', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div style={{ aspectRatio: featured ? '2/3' : '3/4', position: 'relative', background: 'linear-gradient(160deg, #1a0415, #0d0208)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <Image src="/butterfly-maroon.png" alt="" width={120} height={120}
            style={{ objectFit: 'contain', opacity: hovered ? 0.28 : 0.15, transition: 'opacity 0.4s, transform 0.4s', transform: hovered ? 'scale(1.08)' : 'scale(1)' }} />
          <span style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>Product Photo</span>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 50%)' }} />
        {hovered && <div style={{ position: 'absolute', inset: 0, background: 'rgba(66,4,32,0.2)', transition: 'opacity 0.4s' }} />}
        {product.badge && (
          <div style={{ position: 'absolute', top: 16, left: 16, padding: '5px 12px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500, ...product.badgeStyle }}>
            {product.badge}
          </div>
        )}
        {hovered && (
          <button
            onClick={() => onAddToCart(product)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: '#420420', color: '#fdf8fc', border: 'none',
              width: 40, height: 40, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => e.target.style.background = '#FFADED'}
            onMouseLeave={e => e.target.style.background = '#420420'}
          >+</button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '18px 22px 24px', borderTop: '1px solid rgba(255,173,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, marginBottom: 4 }}>{product.name}</div>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9a7a8e' }}>{product.tag}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {product.colors.map((c, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.12)' }} />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#FFADED' }}>${product.price}</div>
      </div>
    </div>
  )
}

// Need useState in ProductCard
import { useState } from 'react'
