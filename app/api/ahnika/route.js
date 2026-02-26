import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ status: 'Ahnika Merlot is online 🦋', version: '3.0' })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { message } = body
    const msg = (message || '').toLowerCase()
    let response = ''

    if (msg.includes('size') || msg.includes('fit')) {
      response = "Great question! Most of our pieces run true to size with a relaxed fit. The Hooded Baseball Jersey Dress is designed oversized — if you want a closer fit, size down one. The Crop Hoodie is boxy by design. Check our Size Guide for exact measurements! 📐"
    } else if (msg.includes('ship') || msg.includes('deliver')) {
      response = "We ship nationwide! Standard shipping is 5-7 business days, and it's FREE on orders over $75. Express shipping (2-3 days) is available at checkout. 📦"
    } else if (msg.includes('return') || msg.includes('exchange')) {
      response = "We offer hassle-free returns within 30 days of delivery. Items must be unworn with tags attached. Exchanges are free — just reach out and we'll get you right. 💕"
    } else if (msg.includes('hoodie') || msg.includes('crop')) {
      response = "The Signature Crop Hoodie ($54) is a fan favorite — 380gsm heavyweight French terry, dropped shoulders, and that raw-cut hem hits different. Available in Maroon and Charcoal. Pairs perfectly with the Culture Joggers! 🦋"
    } else if (msg.includes('dress') || msg.includes('jersey') || msg.includes('baseball')) {
      response = "The Hooded Baseball Jersey Dress ($69) is our BESTSELLER — oversized fit, embroidered butterfly logo, attached hood. Comes in Maroon, Midnight, and Onyx. Style it with sneakers or boots! 👗"
    } else if (msg.includes('tee') || msg.includes('t-shirt') || msg.includes('shirt')) {
      response = "The Butterfly Varsity Tee ($38) is our everyday essential. Garment-dyed vintage wash — broken in from day one. Unisex relaxed fit in Blush or Maroon. Perfect starter piece! ✨"
    } else if (msg.includes('hat') || msg.includes('cap')) {
      response = "The FF Butterfly Dad Cap ($32) — unstructured low-profile with the butterfly embroidered front and 'Just be Blunt' on the back strap. Brass buckle closure. In Maroon, Black, and Sage. 🧢"
    } else if (msg.includes('jogger') || msg.includes('pants') || msg.includes('bottom')) {
      response = "Culture Joggers ($62) — tapered French terry, embroidered FF mark at the hip, ribbed ankle cuffs. Pair with the Crop Hoodie for a full-set look that goes HARD. In Onyx or Maroon. 👖"
    } else if (msg.includes('verde') || msg.includes('limited') || msg.includes('pullover')) {
      response = "The Verde Edition Pullover ($78) is our limited drop — only 100 units, each numbered. 420gsm heavyweight cotton with green butterfly embroidery. Once they're gone, they're GONE. 🦋💚"
    } else if (msg.includes('recommend') || msg.includes('suggest') || msg.includes('what should')) {
      response = "For a first-time buyer, start with the Butterfly Varsity Tee ($38) — perfect intro to FF. Want a statement? The Hooded Baseball Jersey Dress ($69) is our bestseller. Want exclusive? The Verde Pullover ($78) is limited to 100. What vibe are you going for? 🦋"
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('sup')) {
      response = "Hey love! Welcome to Faithfully Faded. I'm Ahnika, your personal style curator. Whether you're looking for a statement piece or an everyday essential, I've got you. What are you vibing with today? 🦋"
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
      response = "Our collection ranges from $32 (Dad Cap) to $78 (Verde Limited Pullover). The sweet spot is the Butterfly Varsity Tee at $38 or the Crop Hoodie at $54. Free shipping kicks in at $75! 💰"
    } else if (msg.includes('brand') || msg.includes('story') || msg.includes('about') || msg.includes('who')) {
      response = "Faithfully Faded™ was born from culture, identity, and self-expression. Founded through Tru Skool Entertainment out of Dallas, TX. Our butterfly mark represents transformation — wings of the cannabis leaf, body of the pineapple, born from culture. Just be Blunt. 🦋"
    } else if (msg.includes('try') || msg.includes('ar') || msg.includes('virtual') || msg.includes('camera')) {
      response = "Our AR Virtual Try-On is coming soon! You'll be able to point your camera and see our pieces on you in real-time. Want me to notify you when it drops? In the meantime, check our Size Guide for the perfect fit! 📱"
    } else {
      response = "Great question! I know our entire collection inside out — sizing, fabric details, styling tips. I can help with shipping, returns, or finding your perfect piece. What would you like to know? 💕"
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Ahnika API error:', error)
    return NextResponse.json({ response: "I'm having a moment — try again in a sec! 💕" }, { status: 200 })
  }
}
