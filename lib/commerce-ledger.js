import 'server-only'
import { neon } from '@neondatabase/serverless'

function db() {
  const url = process.env.COMMERCE_DATABASE_URL
  if (!url) throw new Error('COMMERCE_DATABASE_URL is not configured')
  return neon(url)
}

export function resolveOwnedSku(item) {
  if (String(item?.id) !== 'hooded-baseball-jersey-dress') return null
  const sizeField = item?.customFields?.find?.(field => String(field?.name).toLowerCase() === 'size')
  const size = String(sizeField?.value || '').toUpperCase()
  return ['S', 'M', 'L', 'XL'].includes(size) ? `FF-JERSEY-DRESS-${size}` : null
}

export async function decrementOwnedStock({ eventId, externalOrderId, sku, quantity, payload }) {
  const sql = db()
  const payloadJson = JSON.stringify(payload)
  const rows = await sql`SELECT applied, new_balance FROM commerce.decrement_owned_stock('snipcart', ${eventId}, ${externalOrderId}, ${sku}, ${quantity}, ${payloadJson}::jsonb)`
  const row = rows[0]
  if (!row) throw new Error(`Owned-stock SKU unavailable: ${sku}`)
  return row
}

export async function getOwnedBalance(sku) {
  const sql = db()
  const rows = await sql`SELECT on_hand, reserved FROM commerce.inventory WHERE sku = ${sku}`
  const row = rows[0]
  return row ? Math.max(0, Number(row.on_hand) - Number(row.reserved)) : 0
}
