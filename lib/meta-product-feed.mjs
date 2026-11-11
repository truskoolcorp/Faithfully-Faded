// Explicit review boundary: adding a storefront product never adds it to Meta.
export const META_PRODUCT_ID = 'hooded-baseball-jersey-dress'
export const META_VARIANTS = Object.freeze([
  Object.freeze({ size: 'S', sku: 'FF-JERSEY-DRESS-S' }),
  Object.freeze({ size: 'M', sku: 'FF-JERSEY-DRESS-M' }),
  Object.freeze({ size: 'L', sku: 'FF-JERSEY-DRESS-L' }),
  Object.freeze({ size: 'XL', sku: 'FF-JERSEY-DRESS-XL' }),
])
const ORIGIN = 'https://www.faithfully-faded.com'
const HEADERS = Object.freeze({
  'Content-Type': 'application/rss+xml; charset=utf-8',
  'Cache-Control': 'no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
})

function text(value, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.length > maxLength ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/u.test(value) ||
      !value.isWellFormed()) throw new Error('Invalid catalog text')
  return value.trim()
}

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[c])
}

// Read only existing metadata. No generated copy, badges, stock claims, GTINs,
// material, shipping promises, or unverified preorder designs are exported.
export function verifyProduct(product) {
  if (!product || product.id !== META_PRODUCT_ID || product.inventoryModel !== 'owned-stock' ||
      !Array.isArray(product.sizes) || product.sizes.length !== META_VARIANTS.length ||
      META_VARIANTS.some(v => !product.sizes.includes(v.size)) ||
      !Array.isArray(product.colors) || product.colors.length !== 1 ||
      product.colors[0].name !== 'Maroon') throw new Error('Unreviewed catalog configuration')
  const name = text(product.name, 130)
  const description = text(product.description, 5000)
  if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0 ||
      !Number.isSafeInteger(Math.round(product.price * 100)) || Math.round(product.price * 100) < 1 ||
      Math.abs(product.price * 100 - Math.round(product.price * 100)) > 0.000001) {
    throw new Error('Invalid catalog price')
  }
  // Only the owner-confirmed, unaltered front/back photograph may be exported. Do not silently
  // switch to a lifestyle/generative image or an arbitrary third-party URL.
  if (product.image !== '/images/products/hooded-baseball-jersey-dress-front-back-v2.jpg') {
    throw new Error('Unreviewed catalog image')
  }
  return {
    name, description, price: `${product.price.toFixed(2)} USD`,
    image: ORIGIN + product.image,
    eligible: product.fulfillmentStatus === 'in-stock',
  }
}

function stockInteger(value) {
  // PostgreSQL may return integer/numeric fields as canonical decimal strings.
  if (typeof value === 'string' && /^(0|[1-9]\d*)$/.test(value)) value = Number(value)
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error('Invalid inventory value')
  }
  return value
}

export function validateInventory(rows) {
  if (!Array.isArray(rows) || rows.length !== META_VARIANTS.length) throw new Error('Incomplete inventory')
  const available = new Map()
  for (const row of rows) {
    if (!row || !META_VARIANTS.some(v => v.sku === row.sku) || available.has(row.sku)) {
      throw new Error('Unexpected inventory row')
    }
    available.set(row.sku, Math.max(0, stockInteger(row.on_hand) - stockInteger(row.reserved)))
  }
  return available
}

export function metaVariantTitle(name, size) {
  return `${name} - Maroon - ${size}`
}

export function renderMetaFeed(product, balances = new Map()) {
  const items = META_VARIANTS.map(({ size, sku }) => {
    // Both fields use the same validated sellable balance. Ineligible or
    // unavailable inventory must never advertise a positive Meta quantity.
    const balance = balances.get(sku)
    const quantity = product.eligible && Number.isSafeInteger(balance) && balance > 0 ? balance : 0
    const fields = {
      id: sku,
      item_group_id: META_PRODUCT_ID,
      title: metaVariantTitle(product.name, size),
      description: product.description,
      link: `${ORIGIN}/shop/${META_PRODUCT_ID}`,
      image_link: product.image,
      availability: quantity > 0 ? 'in stock' : 'out of stock',
      quantity_to_sell_on_facebook: quantity,
      condition: 'new',
      price: product.price,
      brand: 'Faithfully Faded',
      google_product_category: '2271',
      color: 'Maroon',
      size,
    }
    return '    <item>\n' + Object.entries(fields).map(([key, value]) =>
      `      <g:${key}>${escapeXml(value)}</g:${key}>`).join('\n') + '\n    </item>'
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n  <channel>\n    <title>Faithfully Faded - reviewed owned-stock catalog</title>\n    <link>${ORIGIN}</link>\n    <description>Reviewed product variants with current inventory availability.</description>\n${items}\n  </channel>\n</rss>\n`
}

async function boundedRead(readInventory, timeoutMs) {
  const controller = new AbortController()
  let timer
  try {
    return await Promise.race([
      Promise.resolve().then(() => readInventory({ signal: controller.signal })),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort()
          reject(new Error('Inventory timeout'))
        }, timeoutMs)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

export function createMetaFeedHandler({ getProduct, readInventory, enabled, environment, timeoutMs = 5000, warn = () => {} }) {
  return async function GET() {
    // New code does not publish a feed by default, including on preview deploys.
    if (!enabled() || environment() !== 'production') {
      return new Response('Not found', { status: 404, headers: { ...HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } })
    }
    let product
    try {
      product = verifyProduct(getProduct(META_PRODUCT_ID))
    } catch {
      warn('[meta-catalog] Reviewed product configuration unavailable')
      // Never emit a successful empty replace feed, which could purge items.
      return new Response('Catalog configuration unavailable', { status: 503, headers: { ...HEADERS, 'Content-Type': 'text/plain; charset=utf-8' } })
    }
    let balances = new Map()
    let inventoryStatus = 'unavailable'
    try {
      balances = validateInventory(await boundedRead(readInventory, timeoutMs))
      inventoryStatus = 'verified'
    } catch {
      // A 503 alone leaves Meta's previous in-stock data intact. Return all four
      // stable IDs as out of stock so a successful ingestion can suppress them.
      warn('[meta-catalog] Inventory unavailable; all reviewed variants are out of stock')
    }
    return new Response(renderMetaFeed(product, balances), {
      status: 200, headers: { ...HEADERS, 'X-FF-Inventory-Status': inventoryStatus },
    })
  }
}
