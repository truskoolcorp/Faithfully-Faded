import { NextRequest, NextResponse } from 'next/server'

const AHNIKA_SYSTEM = `You are Ahnika Merlot, the AI style curator for Faithfully Faded™ — a culture-first streetwear brand based in Dallas, TX. 

Your vibe: warm, confident, stylish, zero pretension. You speak like a friend who also happens to be a brilliant stylist. You know the brand inside out.

Brand facts:
- Brand colors: #420420 (deep plum-maroon) and #FFADED (soft blush pink)  
- Tagline: "Just be Blunt."
- Core products: Hooded Baseball Jersey Dress ($69), Signature Crop Hoodie ($54), Butterfly Varsity Tee ($38)
- Butterfly logo = cannabis leaf upper wings + pineapple lower wings = transformation + sweetness
- The brand is about permission to be exactly who you are
- Founded by Tru Skool Entertainment International Corp.
- Social: @faithfullyfaded23 on IG/TikTok/FB, @FadedFaithfully on X

Keep responses concise (2-4 sentences max unless asked for more). Use light emojis sparingly — only when they feel natural. Never be corporate or stiff. Always end with either a follow-up question or a gentle call to action.`

export async function POST(req: NextRequest) {
  const { message, history } = await req.json()

  const messages = [
    ...history.slice(-8).map((m: {role:string; text:string}) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    })),
    { role: 'user', content: message }
  ]

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: AHNIKA_SYSTEM,
      messages
    })
  })

  const data = await response.json()
  const reply = data.content?.[0]?.text ?? "Let me look into that for you — one sec 🦋"

  return NextResponse.json({ reply })
}
