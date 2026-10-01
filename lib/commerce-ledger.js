import 'server-only'
import { neon } from '@neondatabase/serverless'

function db() {
  const url = process.env.COMMERCE_DATABASE_URL
  if (!url) throw new Error('COMMERCE_DATABASE_URL is not configured')
  return neon(url)
}
export function resolveOwnedSku(item) {
  if (String(item?.id) !== 'hooded-baseball-jersey-dress') return null
  const size = String(item?.customFields?.find?.(f => String(f?.name).toLowerCase() === 'size')?.value || '').toUpperCase()
  return ['S','M','L','XL'].includes(size) ? `FF-JERSEY-DRESS-${size}` : null
}
export async function decrementOwnedStock({ eventId, externalOrderId, sku, quantity, payload }) {
  const sql=db()
  const payloadJson=JSON.stringify(payload)\n  const rows=await sql`SELECT applied,new_balance FROM commerce.decrement_owned_stock('snipcart',${eventId},${externalOrderId},${sku},${quantity},${payloadJson}::jsonb)`
  const row=rows[0]
  if(!row) throw new Error(`Owned-stock SKU unavailable: ${sku}`)
  return row
}
