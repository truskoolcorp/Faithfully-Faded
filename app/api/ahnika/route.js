import { NextResponse } from 'next/server'
import { PRODUCTS } from '../../../lib/products'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const money = value => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(value)
export function styleReply(message) {
  const msg=message.toLowerCase()
  if (/ship|deliver/.test(msg)) return 'Shipping destinations, charges and estimates are confirmed at checkout and in your order confirmation. Pre-order production timing must also be confirmed. See /shipping for the current policy.'
  if (/return|exchange|refund/.test(msg)) return 'Our published return policy explains the 30-day request window, item-condition requirements, prepaid return-label process and eligible size exchanges. Please review /returns or contact truskoolcorp@truskool.net for your order.'
  if (/size|fit/.test(msg)) return 'Use /size-guide and the current product page before choosing a size. The dress is described as an oversized fit. Available sizes and on-hand stock are checked on the product page; I cannot reserve or guarantee stock.'
  if (/try.on|virtual|camera|\bar\b/.test(msg)) return 'Virtual try-on is marked coming soon. A request for launch information does not activate the feature or create an automatic notification subscription.'
  const groups=[
    {terms:/dress|jersey|baseball/,id:'hooded-baseball-jersey-dress'},
    {terms:/hoodie|crop/,id:'signature-crop-hoodie'},
    {terms:/tee|t-shirt|shirt/,id:'butterfly-varsity-tee'},
    {terms:/hat|cap/,id:'ff-dad-cap'},
    {terms:/jogger|pants|bottom/,id:'culture-joggers'},
    {terms:/verde|pullover/,id:'verde-pullover'},
  ]
  const product=PRODUCTS.find(p=>p.id===groups.find(group=>group.terms.test(msg))?.id)
  if (product) {
    const colors=product.colors?.length ? ' Listed color: '+product.colors.map(c=>c.name).join(', ')+'.' : ' Check the product page for confirmed options.'
    return product.name+' is listed at '+money(product.price)+'. '+product.fulfillmentNotice+colors+' Product: /shop/'+product.id
  }
  if (/price|cost|collection|recommend|suggest/.test(msg)) return 'Current listed products: '+PRODUCTS.map(p=>p.name+' '+money(p.price)).join('; ')+'. Check each product page for confirmed options, stock and pre-order status.'
  return 'Welcome to Faithfully Faded. I can help you find current catalog prices, product pages, the size guide and our published shipping/return policies. For order-specific help, contact truskoolcorp@truskool.net.'
}
export async function GET() {
  return NextResponse.json({status:'Style guidance available',source:'Current catalog and published policies'})
}
export async function POST(request) {
  let body
  try {body=await request.json()} catch {return NextResponse.json({error:'Invalid JSON'},{status:400})}
  if(typeof body?.message!=='string'||!body.message.trim()||body.message.length>2000)
    return NextResponse.json({error:'Enter a message up to 2000 characters.'},{status:400})
  return NextResponse.json({response:styleReply(body.message.trim())})
}
