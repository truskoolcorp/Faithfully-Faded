'use client'
import { useState } from 'react'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import { Marquee, BrandMark } from '@/components/Marquee'
import Shop from '@/components/Shop'
import { Lookbook, Story, Ahnika, ARTeaser, Newsletter, Footer } from '@/components/Sections'
import CartDrawer from '@/components/CartDrawer'

export default function Home() {
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product])
    setCartOpen(true)
  }

  return (
    <>
      <Nav cartCount={cartItems.length} onCartOpen={() => setCartOpen(true)} />
      <Hero />
      <Marquee />
      <BrandMark />
      <Shop onAddToCart={addToCart} />
      <Lookbook />
      <Story />
      <Ahnika />
      <ARTeaser />
      <Newsletter />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} />
    </>
  )
}
