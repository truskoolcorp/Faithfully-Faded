export const PIXEL_ID = '849355580233464'
export const CONSENT_KEY = 'ff-marketing-choice-v1'
export function allowed(choice, gpc) { return choice === 'allow' && gpc !== true }
export function catalogItem(item) {
  if (!item || item.id !== 'hooded-baseball-jersey-dress') return null
  const field = name => item.customFields?.find(f => f.name?.toLowerCase() === name)?.value
  const size = String(field('size') || '').toUpperCase()
  const color = String(field('color') || '').toLowerCase()
  const quantity = Number(item.quantity)
  const price = Number(item.price)
  if (!['S','M','L','XL'].includes(size) || color !== 'maroon' || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) return null
  return { id: 'FF-JERSEY-DRESS-' + size, quantity, item_price: price }
}
export function itemPayload(item) {
  const content = catalogItem(item)
  return content ? { content_ids: [content.id], content_type: 'product', contents: [content], currency: 'USD', value: Number((content.item_price * content.quantity).toFixed(2)) } : null
}
export function purchasePayload(response) {
  const cart = response?.cart || response
  if (!cart || response?.requiresRedirect || String(cart.paymentStatus).toLowerCase() !== 'paid' || cart.mode === 'Test' || cart.isInTestMode === true || cart.currency?.toLowerCase() !== 'usd') return null
  const items = Array.isArray(cart.items) ? cart.items : cart.items?.items
  if (!Array.isArray(items) || !items.length) return null
  const contents = items.map(catalogItem)
  const value = Number(cart.total ?? cart.summary?.total)
  if (contents.some(c => !c) || !Number.isFinite(value) || value <= 0 || typeof cart.token !== 'string' || !cart.token) return null
  return { token: cart.token, data: { content_ids: contents.map(c => c.id), content_type: 'product', contents, currency: 'USD', value } }
}
