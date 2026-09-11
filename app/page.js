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

    // Use an actual <img> element instead of a CSS background so both
    // normal asset paths and data-URI product art render reliably.
    art.style.backgroundImage = 'linear-gradient(160deg,rgba(66,4,32,0.18),#0d0808)'
    art.style.backgroundSize = 'cover'
    art.style.backgroundRepeat = 'no-repeat'
    art.style.backgroundPosition = 'center'
    art.style.position = 'relative'
    art.style.overflow = 'hidden'

    let img = art.querySelector(':scope > img[data-product-art="true"]')
    if (!img) {
      img = document.createElement('img')
      img.dataset.productArt = 'true'
      img.alt = product.name
      Object.assign(img.style, {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block',
        position: 'absolute',
        inset: '0',
        zIndex: '1',
      })
      art.prepend(img)
    }

    if (img.getAttribute('src') !== product.image) img.setAttribute('src', product.image)

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
