import { META_PRODUCT_ID, META_VARIANTS, verifyProduct, validateInventory } from './meta-product-feed.mjs'

const ORIGIN = 'https://www.faithfully-faded.com'
export const CHECKOUT_HEADERS = Object.freeze({
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
})

export class CheckoutError extends Error {
  constructor(message, status = 400) { super(message); this.status = status }
}

export function parseCheckoutQuery(params) {
  if (params.getAll('products').length !== 1 || params.getAll('coupon').length > 1) {
    throw new CheckoutError('This checkout link is incomplete or invalid. Please return to the shop.')
  }
  const products = params.get('products')
  if (!products || products.length > 1000) throw new CheckoutError('Please select a product in the shop first.')
  const entries = products.split(',')
  if (entries.length > META_VARIANTS.length) throw new CheckoutError('This checkout link contains too many products.')
  const seen = new Set()
  const lines = entries.map(entry => {
    // URLSearchParams has already decoded once. Never decode a second time.
    const match = /^(FF-JERSEY-DRESS-(?:S|M|L|XL)):([1-9]\d{0,2})$/.exec(entry)
    const variant = match && META_VARIANTS.find(v => v.sku === match[1])
    if (!variant || seen.has(variant.sku)) throw new CheckoutError('This checkout link contains an unsupported or repeated product.')
    seen.add(variant.sku)
    return { sku: variant.sku, size: variant.size, quantity: Number(match[2]) }
  })
  const coupon = params.get('coupon') || null
  if (coupon && (coupon.length > 100 || coupon.trim() !== coupon || /[\u0000-\u001f\u007f]/u.test(coupon))) {
    throw new CheckoutError('This checkout link contains an invalid promo code.')
  }
  // Other parameters (including price, URL and tracking) cannot change products.
  return { lines, coupon }
}

export function resolveCheckout(intent, product, rows) {
  const verified = verifyProduct(product)
  if (!verified.eligible) throw new CheckoutError('This product is not currently available for checkout.', 409)
  const balances = validateInventory(rows)
  for (const line of intent.lines) {
    if (line.quantity > balances.get(line.sku)) {
      throw new CheckoutError(`Size ${line.size} is unavailable in the requested quantity. Please choose another size or quantity in the shop.`, 409)
    }
  }
  const options = META_VARIANTS.filter(v => balances.get(v.sku) > 0).map(v => v.size).join('|')
  return {
    coupon: intent.coupon,
    currency: 'USD',
    items: intent.lines.map(line => ({
      catalogId: line.sku,
      id: META_PRODUCT_ID,
      name: verified.name,
      description: verified.description,
      price: product.price,
      quantity: line.quantity,
      maxQuantity: balances.get(line.sku),
      minQuantity: 1,
      url: `${ORIGIN}/api/catalog/${META_PRODUCT_ID}`,
      image: verified.image,
      shippable: true,
      taxable: true,
      customFields: [
        { name: 'Color', type: 'dropdown', options: 'Maroon', value: 'Maroon', required: true },
        { name: 'Size', type: 'dropdown', options, value: line.size, required: true },
      ],
    })),
  }
}

async function boundedInventory(readInventory, timeoutMs) {
  const controller = new AbortController()
  let timer
  try {
    return await Promise.race([
      Promise.resolve().then(() => readInventory({ signal: controller.signal })),
      new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Inventory timeout')) }, timeoutMs) }),
    ])
  } finally { clearTimeout(timer) }
}

export function createCheckoutHandler({ getProduct, readInventory, enabled, environment, timeoutMs = 5000 }) {
  return async function GET(request) {
    const respond = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: CHECKOUT_HEADERS })
    if (!enabled() || environment() !== 'production') return respond({ error: 'Shop checkout is not available here. Please return to the shop.' }, 404)
    try {
      const intent = parseCheckoutQuery(new URL(request.url).searchParams)
      const rows = await boundedInventory(readInventory, timeoutMs)
      return respond(resolveCheckout(intent, getProduct(META_PRODUCT_ID), rows))
    } catch (error) {
      if (error instanceof CheckoutError) return respond({ error: error.message }, error.status)
      return respond({ error: 'We could not verify current availability. Please try again later or contact us before ordering.' }, 503)
    }
  }
}
