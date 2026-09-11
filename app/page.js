'use client'

import { useEffect } from 'react'
import OriginalHome from './home-original'
import { PRODUCTS } from '@/lib/products'

function syncProductArt() {
  const byHref = new Map(PRODUCTS.map(p => [`/shop/${p.id}`, p]))

  document.querySelectorAll('#shop a[href^="/shop/"]').forEach(card => {
    const href = card.getAttribute('href')
    const product = byHref.get(href)
    const art = card.firstElementChild
    if (!product?.image || !art) return

    // Keep the existing badges, overlays and add-to-cart controls intact,
    // but render every product from a normal static asset path. This avoids
    // duplicate/layered images and the corruption seen with large data URIs.
    art.querySelectorAll(':scope > img[data-product-art="true"]').forEach(img => img.remove())
    art.style.backgroundImage = `url("${product.image}")`
    art.style.backgroundSize = 'contain'
    art.style.backgroundRepeat = 'no-repeat'
    art.style.backgroundPosition = 'center'
    art.style.backgroundColor = '#0d0808'
    art.style.overflow = 'hidden'

    const emoji = art.querySelector(':scope > span')
    if (emoji) emoji.style.display = 'none'
  })
}

export default function Home() {
  useEffect(() => {
    syncProductArt()
    const observer = new MutationObserver(syncProductArt)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return <OriginalHome />
}
