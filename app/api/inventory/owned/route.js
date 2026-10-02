import { NextResponse } from 'next/server'
import { getOwnedBalance } from '@/lib/commerce-ledger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SKU = { S:'FF-JERSEY-DRESS-S', M:'FF-JERSEY-DRESS-M', L:'FF-JERSEY-DRESS-L', XL:'FF-JERSEY-DRESS-XL' }

export async function GET() {
  try {
    const entries = await Promise.all(Object.entries(SKU).map(async ([size, sku]) => [size, await getOwnedBalance(sku)]))
    return NextResponse.json({ productId:'hooded-baseball-jersey-dress', sizes:Object.fromEntries(entries) }, { headers:{'Cache-Control':'no-store'} })
  } catch (error) {
    console.error('[inventory] live owned inventory unavailable', error)
    return NextResponse.json({ productId:'hooded-baseball-jersey-dress', sizes:{S:0,M:0,L:0,XL:0}, unavailable:true }, { status:503, headers:{'Cache-Control':'no-store'} })
  }
}
