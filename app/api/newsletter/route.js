import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { email, name } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    console.log(`Newsletter signup: ${email} ${name || '(no name)'}`)
    return NextResponse.json({ success: true, message: 'Welcome to the family! Check your inbox for 15% off.' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
