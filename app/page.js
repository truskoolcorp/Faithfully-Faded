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

    // Keep the product cards visually consistent and prevent CSS Grid from
    // stretching shorter cards into large empty panels.
    card.style.alignSelf = 'start'
    card.style.height = 'auto'

    // Use the intended homepage art when one is defined (for example the
    // modeled jersey hero), otherwise fall back to the catalog product image.
    const image = product.featuredImage || product.image

    art.querySelectorAll(':scope > img[data-product-art="true"]').forEach(img => img.remove())
    art.style.backgroundImage = `url("${image}")`
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
