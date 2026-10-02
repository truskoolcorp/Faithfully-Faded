import { NextResponse } from 'next/server'
import { decrementOwnedStock, resolveOwnedSku } from '@/lib/commerce-ledger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function validToken(token) {
  const key=process.env.SNIPCART_SECRET_API_KEY
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
    if(!isTest && !(await validToken(token))) return NextResponse.json({error:'Invalid token'},{status:401})
  } catch(err) { return NextResponse.json({error:err?.message||'Webhook configuration error'},{status:500}) }
  if(payload?.eventName!=='order.completed') return NextResponse.json({ignored:payload?.eventName||'unknown'})
  const order=payload?.content||{}
  const invoice=order.invoiceNumber||order.token
  if(!invoice) return NextResponse.json({error:'Order missing identifier'},{status:400})
  const externalId=`snipcart-${invoice}`
  const owned=[]
  for(const item of order.items||[]) {
    const sku=resolveOwnedSku(item)
    if(!sku) continue
    owned.push({sku,quantity:Math.max(1,Number(item.quantity)||1),itemId:String(item.id)})
  }
  if(!owned.length) return NextResponse.json({received:true,ownedStock:false})
  if(isTest) return NextResponse.json({received:true,ownedStock:true,inventoryMode:'dry-run',skus:owned.map(x=>x.sku)})
  try {
    for(const line of owned) await decrementOwnedStock({eventId:`${externalId}:${line.sku}`,externalOrderId:externalId,sku:line.sku,quantity:line.quantity,payload})
    return NextResponse.json({received:true,ownedStock:true,skus:owned.map(x=>x.sku)})
  } catch(err) {
    console.error('[inventory-ledger]',externalId,err?.message||err)
    return NextResponse.json({error:err?.message||'Inventory ledger failed'},{status:500})
  }
}
