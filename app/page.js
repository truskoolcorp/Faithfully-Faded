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

    art.style.backgroundImage = `linear-gradient(to top,rgba(8,8,8,.22) 0%,rgba(8,8,8,.02) 55%), url("${product.image}")`
    art.style.backgroundSize = 'contain'
    art.style.backgroundRepeat = 'no-repeat'
    art.style.backgroundPosition = 'center'

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
