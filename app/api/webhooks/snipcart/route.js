import { NextResponse } from 'next/server'
import { decrementOwnedOrder, resolveOwnedSku } from '@/lib/commerce-ledger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function validToken(token) {
  const key=(process.env.SNIPCART_SECRET_API_KEY || process.env.SNIPCART_SECRET_KEY)
  if(!key) throw new Error('SNIPCART_SECRET_API_KEY is not configured')
  const res=await fetch(`https://app.snipcart.com/api/requestvalidation/${encodeURIComponent(token)}`,{headers:{Accept:'application/json',Authorization:`Basic ${Buffer.from(`${key}:`).toString('base64')}`},cache:'no-store'})
  return res.ok
}

export async function POST(req) {
  const token=req.headers.get('x-snipcart-requesttoken')
  if(!token) return NextResponse.json({error:'Missing validation token'},{status:401})
  let payload
  try { payload=await req.json() } catch { return NextResponse.json({error:'Invalid JSON'},{status:400}) }
  const isTest=payload?.mode==='Test'
  try {
    if(!(await validToken(token))) return NextResponse.json({error:'Invalid token'},{status:401})
  } catch(err) { console.error('[snipcart] Webhook validation unavailable',err); return NextResponse.json({error:'Webhook validation unavailable'},{status:503}) }
  if(payload?.eventName!=='order.completed') return NextResponse.json({ignored:payload?.eventName||'unknown'})
  const order=payload?.content||{}
  const invoice=order.invoiceNumber||order.token
  if(!invoice) return NextResponse.json({error:'Order missing identifier'},{status:400})
  const externalId=`snipcart-${invoice}`
  const owned=[]
  for(const item of order.items||[]) {
    let sku
    try { sku=resolveOwnedSku(item) } catch { return NextResponse.json({error:'Owned item missing valid size'},{status:422}) }
    if(!sku) continue
    const quantity=Number(item.quantity)
    if(!Number.isSafeInteger(quantity)||quantity<1) return NextResponse.json({error:'Invalid owned item quantity'},{status:422})
    owned.push({sku,quantity})
  }
  if(!owned.length) return NextResponse.json({received:true,ownedStock:false})
  if(isTest) return NextResponse.json({received:true,ownedStock:true,inventoryMode:'dry-run',skus:owned.map(x=>x.sku)})
  try {
    await decrementOwnedOrder({externalOrderId:externalId,lines:owned,payload})
    return NextResponse.json({received:true,ownedStock:true,skus:owned.map(x=>x.sku)})
  } catch(err) {
    console.error('[inventory-ledger]',externalId,err?.message||err)
    return NextResponse.json({error:'Inventory ledger failed'},{status:500})
  }
}
