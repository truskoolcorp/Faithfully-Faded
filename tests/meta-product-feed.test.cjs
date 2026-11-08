const { test, before } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const path = require('node:path')
const { pathToFileURL } = require('node:url')
let feed, products
before(async () => {
  feed = await import(pathToFileURL(path.resolve(__dirname, '../lib/meta-product-feed.mjs')))
  const context = { result: {} }
  vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '../lib/products.js'), 'utf8')
    .replace(/export /g, '') + '; result.products = PRODUCTS;', context)
  products = JSON.parse(JSON.stringify(context.result.products))
})
const product = () => structuredClone(products.find(p => p.id === feed.META_PRODUCT_ID))
const rows = () => feed.META_VARIANTS.map((v, index) => ({ sku: v.sku, on_hand: [0, 4, 3, 9][index], reserved: [0, 1, 3, 2][index] }))
const handler = overrides => feed.createMetaFeedHandler({
  getProduct: () => product(), readInventory: async () => rows(),
  enabled: () => true, environment: () => 'production', ...overrides,
})
function assertStock(xml, expected) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1])
  assert.equal(items.length, expected.length)
  items.forEach((item, index) => {
    const quantities = [...item.matchAll(/<g:quantity_to_sell_on_facebook>(.*?)<\/g:quantity_to_sell_on_facebook>/g)]
    assert.equal(quantities.length, 1, 'exactly one quantity per variant')
    assert.match(quantities[0][1], /^(0|[1-9]\d*)$/, 'quantity is a canonical nonnegative integer')
    assert.equal(quantities[0][1], String(expected[index]), 'exact sellable quantity without rounding')
    const availability = [...item.matchAll(/<g:availability>(.*?)<\/g:availability>/g)]
    assert.equal(availability.length, 1)
    assert.equal(availability[0][1], expected[index] > 0 ? 'in stock' : 'out of stock')
  })
}
const assertZeroStock = xml => assertStock(xml, [0, 0, 0, 0])

test('exports exactly the four stable reviewed variant IDs, never preorder designs', async () => {
  const response = await handler()()
  const xml = await response.text()
  assert.equal(response.status, 200)
  assert.equal((xml.match(/<item>/g) || []).length, 4)
  assert.deepEqual([...xml.matchAll(/<g:id>(.*?)<\/g:id>/g)].map(m => m[1]), feed.META_VARIANTS.map(v => v.sku))
  for (const p of products.filter(p => p.id !== feed.META_PRODUCT_ID)) {
    assert.equal(xml.includes(p.id), false)
    assert.equal(xml.includes(p.name), false)
  }
  assert.equal(xml.includes('PRE-ORDER'), false)
  assert.equal(xml.includes('In stock and ready'), false)
  assertStock(xml, [0, 3, 0, 7])
  assert.equal(xml.includes('on_hand'), false)
})
test('uses current metadata and currency, canonical links, image, group, size and color', async () => {
  const xml = await (await handler()()).text()
  for (const snippet of ['<g:price>69.00 USD</g:price>', '<g:color>Maroon</g:color>',
    '<g:item_group_id>hooded-baseball-jersey-dress</g:item_group_id>',
    '<g:link>https://www.faithfully-faded.com/shop/hooded-baseball-jersey-dress</g:link>',
    '<g:image_link>https://www.faithfully-faded.com/images/products/hooded-baseball-jersey-dress-front-back-v2.jpg</g:image_link>',
    '<g:brand>Faithfully Faded</g:brand>', '<g:condition>new</g:condition>']) assert.ok(xml.includes(snippet))
  for (const size of ['S', 'M', 'L', 'XL']) assert.ok(xml.includes(`<g:size>${size}</g:size>`))
  assert.equal(xml.includes('/api/catalog/'), false)
  assertStock(xml, [0, 3, 0, 7])
})
test('availability subtracts reservations and retains zero-stock rows', async () => {
  const response = await handler()()
  assert.equal(response.headers.get('x-ff-inventory-status'), 'verified')
  assertStock(await response.text(), [0, 3, 0, 7])
})
test('reserved stock above on-hand exports zero for the affected variant', async () => {
  const input = rows(); input[1].reserved = 10
  assert.equal(feed.validateInventory(input).get(input[1].sku), 0)
  assertStock(await (await handler({ readInventory: async () => input })()).text(), [0, 0, 0, 7])
})
test('canonical database integer strings retain exact sellable quantities', async () => {
  const input = rows().map(r => ({ ...r, on_hand: String(r.on_hand), reserved: String(r.reserved) }))
  assert.equal(feed.validateInventory(input).get('FF-JERSEY-DRESS-XL'), 7)
  assertStock(await (await handler({ readInventory: async () => input })()).text(), [0, 3, 0, 7])
})
test('quantities preserve integer precision through the safe-integer boundary', async () => {
  const input = [
    { sku: 'FF-JERSEY-DRESS-S', on_hand: Number.MAX_SAFE_INTEGER, reserved: 0 },
    { sku: 'FF-JERSEY-DRESS-M', on_hand: '9007199254740991', reserved: '9007199254740990' },
    { sku: 'FF-JERSEY-DRESS-L', on_hand: '9007199254740991', reserved: '2' },
    { sku: 'FF-JERSEY-DRESS-XL', on_hand: '9007199254740990', reserved: '9007199254740991' },
  ]
  assertStock(await (await handler({ readInventory: async () => input })()).text(),
    [Number.MAX_SAFE_INTEGER, 1, 9007199254740989, 0])
})
test('each quantity stays attached to its SKU regardless of database row order', async () => {
  const input = feed.META_VARIANTS.map((v, i) => ({ sku: v.sku, on_hand: i + 12, reserved: i * 2 })).reverse()
  const before = structuredClone(input)
  let reads = 0
  const xml = await (await handler({ readInventory: async () => { reads++; return input; } })()).text()
  assertStock(xml, [12, 11, 10, 9])
  assert.deepEqual([...xml.matchAll(/<g:id>(.*?)<\/g:id>/g)].map(m => m[1]), feed.META_VARIANTS.map(v => v.sku))
  assert.equal(reads, 1, 'availability and quantity share one inventory snapshot')
  assert.deepEqual(input, before, 'rendering does not mutate ledger input')
})
test('renderer never emits positive or malformed quantities for invalid balances', () => {
  for (const value of [undefined, null, '3', -1, 0, -0, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    const balances = new Map(feed.META_VARIANTS.map(v => [v.sku, value]))
    assertZeroStock(feed.renderMetaFeed(feed.verifyProduct(product()), balances))
  }
  assertZeroStock(feed.renderMetaFeed(feed.verifyProduct(product())))
})
for (const field of ['on_hand', 'reserved']) for (const value of [null, undefined, '', ' ', '0x10', '1e3', '2.5', '01', '00', '1.0', '9007199254740992', '9007199254740993', true, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, 1n]) {
  test(`invalid inventory ${field} value ${String(value)} suppresses every variant and quantity`, async () => {
    const input = rows(); input[1][field] = value
    const response = await handler({ readInventory: async () => input })()
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('x-ff-inventory-status'), 'unavailable')
    assertZeroStock(await response.text())
  })
}
for (const [name, alter] of [
  ['missing row', input => input.slice(1)],
  ['duplicate row', input => [input[0], input[0], input[2], input[3]]],
  ['unexpected SKU', input => input.map((r, i) => i === 1 ? { ...r, sku: 'UNREVIEWED' } : r)],
  ['null row', input => [null, ...input.slice(1)]],
  ['extra row', input => [...input, input[0]]],
  ['empty rows', () => []],
  ['non-array result', () => ({})],
]) test(`${name} cannot produce partial in-stock feed`, async () => {
  const response = await handler({ readInventory: async () => alter(rows()) })()
  assert.equal(response.status, 200)
  assertZeroStock(await response.text())
})
test('database errors emit four out-of-stock rows without leaking errors or secrets', async () => {
  const logs = []
  const response = await handler({ readInventory: async () => { throw Error('postgres://secret'); }, warn: m => logs.push(m) })()
  const xml = await response.text()
  assert.equal(response.status, 200)
  assertZeroStock(xml)
  assert.equal(JSON.stringify(logs).includes('secret'), false)
  assert.equal(xml.includes('postgres'), false)
})
test('a synchronous inventory exception is safe', async () => {
  const response = await handler({ readInventory: () => { throw Error('failed'); } })()
  assertZeroStock(await response.text())
})
test('hung reader is bounded and its signal aborted', async () => {
  let signal
  const start = Date.now()
  const response = await handler({ timeoutMs: 15, readInventory: options => { signal = options.signal; return new Promise(() => {}); } })()
  assert.ok(Date.now() - start < 1000)
  assert.equal(signal.aborted, true)
  assertZeroStock(await response.text())
})
test('late resolution cannot alter a timed-out response', async () => {
  let resolve
  const response = await handler({ timeoutMs: 10, readInventory: () => new Promise(r => { resolve = r; }) })()
  resolve(rows())
  assertZeroStock(await response.text())
})
test('a later healthy fetch recovers without caching the failure', async () => {
  let call = 0
  const get = handler({ readInventory: async () => { if (++call === 1) throw Error('temporary'); return rows(); } })
  assertZeroStock(await (await get()).text())
  assertStock(await (await get()).text(), [0, 3, 0, 7])
  assert.equal(call, 2)
})
test('success and outage responses are not cached by browsers or Vercel', async () => {
  for (const get of [handler(), handler({ readInventory: async () => { throw Error('failed'); } })]) {
    const response = await get()
    assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0')
    assert.equal(response.headers.get('cdn-cache-control'), 'no-store')
    assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store')
    assert.equal(response.headers.get('content-type'), 'application/rss+xml; charset=utf-8')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  }
})
test('disabled and non-production handlers do not read products or the database', async () => {
  const fail = () => { throw Error('must not be called'); }
  for (const options of [{ enabled: () => false }, ...['preview', 'development', undefined, ''].map(value => ({ environment: () => value }))]) {
    const response = await handler({ getProduct: fail, readInventory: fail, ...options })()
    assert.equal(response.status, 404)
    assert.equal(await response.text(), 'Not found')
    assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0')
  }
})
test('changing the allowed product to preorder suppresses it even with positive stock', async () => {
  const p = product(); p.fulfillmentStatus = 'pre-order'
  const response = await handler({ getProduct: () => p })()
  assertZeroStock(await response.text())
})
test('unavailable or unknown fulfillment status exports zero for every positive balance', async () => {
  for (const fulfillmentStatus of ['out-of-stock', 'pre-order', undefined, 'unknown']) {
    const p = product(); p.fulfillmentStatus = fulfillmentStatus
    const input = feed.META_VARIANTS.map(v => ({ sku: v.sku, on_hand: 7, reserved: 2 }))
    const response = await handler({ getProduct: () => p, readInventory: async () => input })()
    assert.equal(response.headers.get('x-ff-inventory-status'), 'verified')
    assertZeroStock(await response.text())
  }
})
test('metadata cannot inject XML and unicode is preserved', async () => {
  const p = product(); p.name = 'Dress & <Tag> "quoted"'; p.description = "Café's dress > áo";
  const xml = await (await handler({ getProduct: () => p })()).text()
  assert.ok(xml.includes('Dress &amp; &lt;Tag&gt; &quot;quoted&quot;'))
  assert.ok(xml.includes('Café&apos;s dress &gt; áo'))
  assert.equal(xml.includes('<Tag>'), false)
})
for (const [name, mutate] of [
  ['missing product', () => null],
  ['unknown product', p => ({ ...p, id: 'not-reviewed' })],
  ['wrong inventory model', p => ({ ...p, inventoryModel: 'dropship' })],
  ['new size', p => ({ ...p, sizes: [...p.sizes, '2XL'] })],
  ['duplicate size', p => ({ ...p, sizes: ['S', 'S', 'L', 'XL'] })],
  ['new color', p => ({ ...p, colors: [{ name: 'Green' }] })],
  ['unreviewed image', p => ({ ...p, image: 'https://other.example/image.png' })],
  ['empty description', p => ({ ...p, description: '' })],
  ['control character', p => ({ ...p, description: '\u0000bad' })],
  ['invalid unicode', p => ({ ...p, name: '\uD800' })],
  ['price string', p => ({ ...p, price: '69' })],
  ['negative price', p => ({ ...p, price: -1 })],
  ['fractional cents', p => ({ ...p, price: 69.001 })],
  ['sub-cent positive price', p => ({ ...p, price: 0.000000001 })],
  ['NaN price', p => ({ ...p, price: NaN })],
]) test(`${name} produces 503, never an empty successful replacement`, async () => {
  let reads = 0
  const response = await handler({ getProduct: () => mutate(product()), readInventory: async () => { reads++; return rows(); } })()
  assert.equal(response.status, 503)
  assert.equal(reads, 0)
  assert.equal(await response.text(), 'Catalog configuration unavailable')
  assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0')
})
test('database adapter executes only the parameterized inventory SELECT and passes abort signal', async () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../lib/meta-inventory.js'), 'utf8')
  let result, captured
  const signal = new AbortController().signal
  const context = {
    process: { env: { COMMERCE_DATABASE_URL: 'postgres://test-only' } },
    META_VARIANTS: feed.META_VARIANTS,
    neon: url => { assert.equal(url, 'postgres://test-only'); return { query: (...args) => { captured = args; return Promise.resolve(rows()); } }; },
    result: { set fn(fn) { result = fn; } },
  }
  vm.runInNewContext(source.replace(/^import .*$/gm, '').replace(/export /g, '') + ';result.fn=readMetaInventory;', context)
  const actual = await result({ signal })
  assert.deepEqual(actual, rows())
  assert.equal(captured[0], 'SELECT sku, on_hand, reserved FROM commerce.inventory WHERE sku = ANY($1::text[])')
  assert.deepEqual(JSON.parse(JSON.stringify(captured[1])), [feed.META_VARIANTS.map(v => v.sku)])
  assert.equal(captured[2].fetchOptions.signal, signal)
  assert.equal(captured[2].fetchOptions.cache, 'no-store')
  context.process.env = {}
  await assert.rejects(result({ signal }), /Commerce inventory unavailable/)
})
test('production route wires explicit enable flag, dynamic execution and safe dependencies', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../app/api/meta-catalog/route.js'), 'utf8')
  assert.match(source, /FF_META_CATALOG_FEED_ENABLED === 'true'/)
  assert.match(source, /environment: \(\) => process\.env\.VERCEL_ENV/)
  assert.match(source, /dynamic = 'force-dynamic'/)
  assert.match(source, /revalidate = 0/)
  assert.match(source, /runtime = 'nodejs'/)
  assert.match(source, /readInventory: readMetaInventory/)
  assert.doesNotMatch(source, /POST|PUT|DELETE|fetch\(/)
})
