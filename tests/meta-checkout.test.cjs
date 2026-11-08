const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const api = import('../lib/meta-checkout.mjs')
const cart = import('../lib/meta-checkout-cart.mjs')
const { PRODUCTS } = (() => {
  const out = {}; vm.runInNewContext(fs.readFileSync(require.resolve('../lib/products.js'), 'utf8').replace(/export /g, '') + ';out.PRODUCTS=PRODUCTS', { out }); return out
})()
const actualProduct = JSON.parse(JSON.stringify(PRODUCTS[0]))
// Synthetic stock values below exist only in tests, never in production data.
const rows = ['S','M','L','XL'].map((size, i) => ({ sku: `FF-JERSEY-DRESS-${size}`, on_hand: i + 2, reserved: 1 }))
const query = value => new URLSearchParams(value)
const intent = 'products=FF-JERSEY-DRESS-M%3A2%2CFF-JERSEY-DRESS-L%3A1&coupon=VALID-TEST'
async function payload(q = intent) { const m = await api; return m.resolveCheckout(m.parseCheckoutQuery(query(q)), actualProduct, rows) }
function sdk(initial = [], { failOnAdd = false, failCoupon = false } = {}) {
  let items = structuredClone(initial), n = 0
  const calls = []
  return {
    calls,
    ready: Promise.resolve(),
    store: { getState: () => ({ cart: { currency: 'usd', items: { items } } }) },
    api: { cart: {
      items: {
        add: async definition => { calls.push(['add', definition]); if(failOnAdd) throw Error('SDK unavailable'); items.push({ ...definition, basePrice: definition.price, uniqueId: `item-${++n}` }) },
        update: async update => { calls.push(['update', update]); items = items.map(item => item.uniqueId === update.uniqueId ? { ...item, ...update } : item) },
        remove: async id => { calls.push(['remove', id]); items = items.filter(item => item.uniqueId !== id) },
      },
      applyDiscount: async code => { calls.push(['coupon', code]); if(failCoupon) throw Error('Invalid') },
    } },
  }
}

test('RFC3986 decoding, allowlisted IDs, quantities and coupon', async () => {
  const m = await api, p = m.parseCheckoutQuery(query(intent))
  assert.deepEqual(p.lines, [{sku:'FF-JERSEY-DRESS-M',size:'M',quantity:2},{sku:'FF-JERSEY-DRESS-L',size:'L',quantity:1}])
  assert.equal(p.coupon, 'VALID-TEST')
})
for (const invalid of ['', 'products=', 'products=x:1', 'products=hooded-baseball-jersey-dress:1', 'products=FF-JERSEY-DRESS-M:0', 'products=FF-JERSEY-DRESS-M:-1', 'products=FF-JERSEY-DRESS-M:01', 'products=FF-JERSEY-DRESS-M:1.5', 'products=FF-JERSEY-DRESS-M:1e2', 'products=FF-JERSEY-DRESS-M:1000', 'products=FF-JERSEY-DRESS-M:2,', 'products=FF-JERSEY-DRESS-M:1,FF-JERSEY-DRESS-M:1', 'products=FF-JERSEY-DRESS-M:1&products=FF-JERSEY-DRESS-L:1', 'products=FF-JERSEY-DRESS-M%253A1', 'products=FF-JERSEY-DRESS-M:1&coupon=x&coupon=y', 'products=FF-JERSEY-DRESS-M:1&coupon=%0Aevil', 'products=FF-JERSEY-DRESS-M:1&coupon=+space']) {
  test(`reject malformed query ${invalid}`, async () => { const m = await api; assert.throws(() => m.parseCheckoutQuery(query(invalid)), /./) })
}
test('canonical product mapping ignores caller price, URL and tracking', async () => {
  const p = await payload('products=FF-JERSEY-DRESS-M:1&price=0.01&url=https://evil.test&cart_origin=facebook')
  assert.equal(p.items[0].price, actualProduct.price)
  assert.equal(p.items[0].id, actualProduct.id)
  assert.equal(p.items[0].catalogId, 'FF-JERSEY-DRESS-M')
  assert.equal(p.items[0].url, 'https://www.faithfully-faded.com/api/catalog/hooded-baseball-jersey-dress')
  assert.equal(p.items[0].customFields[0].value, 'Maroon')
  assert.equal(p.items[0].customFields[1].value, 'M')
  assert.equal(p.items[0].maxQuantity, 2)
})

test('all products are validated before any cart operation', async () => {
  const m = await api
  assert.throws(() => m.resolveCheckout(m.parseCheckoutQuery(query('products=FF-JERSEY-DRESS-M:3')), actualProduct, rows), /requested quantity/)
  assert.throws(() => m.resolveCheckout(m.parseCheckoutQuery(query('products=FF-JERSEY-DRESS-M:1')), { ...actualProduct, fulfillmentStatus:'pre-order' }, rows), /not currently/)
  for (const badRows of [[], rows.slice(1), [...rows, rows[0]], rows.map(r => ({...r, on_hand:-1}))]) {
    assert.throws(() => m.resolveCheckout(m.parseCheckoutQuery(query('products=FF-JERSEY-DRESS-M:1')), actualProduct, badRows))
  }
})

test('resolver production gate and failure no-store responses', async () => {
  const m = await api
  const request = new Request('https://example.test/api/meta-checkout?' + intent)
  for (const [enabled, environment, expected] of [[false,'production',404],[true,'preview',404],[true,'development',404],[true,'production',200]]) {
    let reads = 0
    const res = await m.createCheckoutHandler({ getProduct:()=>actualProduct, readInventory:async()=>{reads++;return rows}, enabled:()=>enabled, environment:()=>environment })(request)
    assert.equal(res.status,expected);assert.match(res.headers.get('Cache-Control'),/no-store/);assert.equal(reads, expected===200?1:0)
  }
  for (const reader of [async()=>{throw Error('secret database URL')},async()=>[]]) {
    const res = await m.createCheckoutHandler({getProduct:()=>actualProduct,readInventory:reader,enabled:()=>true,environment:()=> 'production'})(request)
    assert.equal(res.status,503); assert.doesNotMatch(await res.text(),/secret/)
  }
})

test('malformed query does not read inventory', async () => {
  const m = await api; let reads = 0
  const res = await m.createCheckoutHandler({getProduct:()=>actualProduct,readInventory:async()=>{reads++;return rows},enabled:()=>true,environment:()=> 'production'})(new Request('https://example.test/api/meta-checkout?products=invalid:1'))
  assert.equal(res.status,400);assert.equal(reads,0)
})

test('inventory timeout aborts and fails closed', async () => {
  const m = await api; let aborted = false
  const res = await m.createCheckoutHandler({getProduct:()=>actualProduct,readInventory:({signal})=>new Promise(()=>signal.addEventListener('abort',()=>{aborted=true})),enabled:()=>true,environment:()=> 'production',timeoutMs:5})(new Request('https://example.test/api/meta-checkout?' + intent))
  assert.equal(res.status,503);assert.equal(aborted,true)
})

test('fresh bag has exact variants/quantities; second visit does not duplicate', async () => {
  const c = await cart, s = sdk(), p = await payload()
  await c.applyCheckoutCart(s,p);await c.applyCheckoutCart(s,p)
  const items = s.store.getState().cart.items.items
  assert.equal(items.length,2);assert.deepEqual(items.map(i=>i.quantity),[2,1])
  assert.equal(s.calls.filter(x=>x[0]==='add').length,2)
  assert.equal(s.calls.filter(x=>x[0]==='update').length,2)
  assert.equal(s.calls.find(x=>x[0]==='update')[1].basePrice,actualProduct.price)
  assert.equal(s.calls.find(x=>x[0]==='coupon')[1],'VALID-TEST')
})

test('unrelated bag is preserved without shopper consent', async () => {
  const c = await cart, s=sdk([{id:'unrelated',uniqueId:'old',quantity:1}])
  const result=await c.applyCheckoutCart(s,await payload())
  assert.equal(result.needsReplacement,true);assert.equal(s.calls.length,0)
})

test('approved replacement adds desired items before removing old bag', async () => {
  const c=await cart,s=sdk([{id:'unrelated',uniqueId:'old',quantity:1}])
  await c.applyCheckoutCart(s,await payload(),{replaceExisting:true})
  assert.deepEqual(s.calls.map(x=>x[0]),['add','add','remove','coupon'])
  assert.equal(s.store.getState().cart.items.items.length,2)
})

test('add failure never discards old bag or applies coupon', async () => {
  const c=await cart,s=sdk([{id:'unrelated',uniqueId:'old',quantity:1}],{failOnAdd:true})
  await assert.rejects(c.applyCheckoutCart(s,await payload(),{replaceExisting:true}),/unavailable/)
  assert.deepEqual(s.calls.map(x=>x[0]),['add']);assert.equal(s.store.getState().cart.items.items[0].uniqueId,'old')
})

test('coupon rejection is a visible warning, not fabricated discount', async () => {
  const c=await cart,s=sdk([],{failCoupon:true})
  const result=await c.applyCheckoutCart(s,await payload())
  assert.match(result.couponWarning,/could not be applied/);assert.equal(result.needsReplacement,false)
})

test('ambiguous duplicate variants fail before any mutation', async () => {
  const c=await cart,p=await payload(),s=sdk([{...p.items[0],uniqueId:'one'},{...p.items[0],uniqueId:'two'}])
  await assert.rejects(c.applyCheckoutCart(s,p),/duplicate/);assert.equal(s.calls.length,0)
})

test('concurrent clicks cannot interleave cart mutations', async () => {
  const c=await cart,p=await payload(),s=sdk();let release
  s.api.cart.items.add=definition=>new Promise(resolve=>{release=()=>{s.store.getState().cart.items.items.push({...definition,basePrice:definition.price,uniqueId:'new'});resolve()}})
  const first=c.applyCheckoutCart(s,{...p,items:[p.items[0]],coupon:null})
  await assert.rejects(c.applyCheckoutCart(s,p),/already/);release();await first
})

test('cancelled navigation stops remaining mutations', async () => {
  const c=await cart,p=await payload(),s=sdk(),controller=new AbortController()
  s.api.cart.items.add=async()=>{s.calls.push(['add']);controller.abort()}
  await assert.rejects(c.applyCheckoutCart(s,p,{signal:controller.signal}),/cancelled/)
  assert.equal(s.calls.length,1)
})

test('readiness supports immediate SDK, delayed event, timeout and abort', async () => {
  const c=await cart,s=sdk(),d=new EventTarget(),w={Snipcart:s}
  assert.equal(await c.waitForSnipcart(w,d,20),s)
  const later={},pending=c.waitForSnipcart(later,d,50);later.Snipcart=s;d.dispatchEvent(new Event('snipcart.ready'));assert.equal(await pending,s)
  await assert.rejects(c.waitForSnipcart({},d,2),/did not load/)
  const controller=new AbortController(),cancelled=c.waitForSnipcart({},d,20,controller.signal);controller.abort();await assert.rejects(cancelled,/cancelled/)
})

test('bridge code contains no order confirmation, payment or database writes', async () => {
  for (const path of ['../lib/meta-checkout.mjs','../lib/meta-checkout-cart.mjs','../app/checkout/CheckoutBridge.js']) {
    assert.doesNotMatch(fs.readFileSync(require.resolve(path),'utf8'),/\.confirm\(|authorizePayment|setPaymentDetails|decrementOwned|INSERT INTO|UPDATE commerce/i)
  }
})


test('SDK clamp or unexpected cart mutation cannot claim ready', async () => {
  const c=await cart,p=await payload(),s=sdk()
  s.api.cart.items.add=async definition=>{s.store.getState().cart.items.items.push({...definition,basePrice:definition.price,quantity:1,uniqueId:'clamped'})}
  await assert.rejects(c.applyCheckoutCart(s,p),/could not be verified/)
  const t=sdk();const original=t.api.cart.items.add
  t.api.cart.items.add=async definition=>{await original(definition);if(t.calls.length===1)t.store.getState().cart.items.items.push({id:'other',uniqueId:'concurrent',quantity:1})}
  await assert.rejects(c.applyCheckoutCart(t,p),/bag changed/)
})

test('wrong base price or currency is not reported as ready', async () => {
  const c=await cart,p=await payload(),s=sdk()
  await c.applyCheckoutCart(s,p)
  s.store.getState().cart.items.items[0].basePrice=0.01
  assert.throws(()=>c.verifyCart(s,p),/current price/)
  s.store.getState().cart.items.items[0].basePrice=p.items[0].price
  const getState=s.store.getState;s.store.getState=()=>({...getState(),cart:{...getState().cart,currency:'EUR'}})
  assert.throws(()=>c.verifyCart(s,p),/currency/)
})

test('partial add failure followed by retry does not duplicate successful line', async () => {
 const c=await cart,p=await payload(),s=sdk();const original=s.api.cart.items.add;let count=0
 s.api.cart.items.add=async item=>{if(++count===2)throw Error('failed second');return original(item)}
 await assert.rejects(c.applyCheckoutCart(s,p),/failed second/)
 s.api.cart.items.add=original
 await c.applyCheckoutCart(s,p)
 assert.equal(s.store.getState().cart.items.items.length,2)
 assert.deepEqual(s.store.getState().cart.items.items.map(i=>i.quantity),[2,1])
})

test('update and removal failures stop without falsely reporting success', async () => {
 const c=await cart,p=await payload(),s=sdk();await c.applyCheckoutCart(s,p)
 s.api.cart.items.update=async()=>{throw Error('update failed')}
 await assert.rejects(c.applyCheckoutCart(s,p),/update failed/)
 const t=sdk([{id:'old',uniqueId:'old',quantity:1}]);t.api.cart.items.remove=async()=>{throw Error('remove failed')}
 await assert.rejects(c.applyCheckoutCart(t,p,{replaceExisting:true}),/remove failed/)
 assert.equal(t.calls.some(call=>call[0]==='coupon'),false)
})

test('SDK readiness rejection and pre-aborted cancellation are handled', async () => {
 const c=await cart,d=new EventTarget(),s=sdk();s.ready=Promise.reject(Error('failed'))
 await assert.rejects(c.waitForSnipcart({Snipcart:s},d,20),/could not be loaded/)
 const controller=new AbortController();controller.abort()
 await assert.rejects(c.waitForSnipcart({},d,20,controller.signal),/cancelled/)
})

test('query changes, timeout guidance and stock-after-SDK order are wired', () => {
 const source=fs.readFileSync(require.resolve('../app/checkout/CheckoutBridge.js'),'utf8')
 assert.match(source,/useSearchParams\(\)/)
 assert.match(source,/\}, \[checkoutQuery\]\)/)
 assert.match(source,/phase: 'stalled'/)
 assert.ok(source.indexOf('await waitForSnipcart')<source.indexOf('await fetch'))
})


test('verified Instagram footer destination is isolated from other networks', () => {
 const source=fs.readFileSync(require.resolve('../app/home-original.js'),'utf8')
 assert.ok(source.includes('https://www.instagram.com/faithfade23/'))
 assert.equal(source.includes('instagram.com/faithfullyfaded23'),false)
 assert.ok(source.includes('https://facebook.com/faithfullyfaded23'))
 assert.ok(source.includes('https://tiktok.com/@faithfullyfaded23'))
})
