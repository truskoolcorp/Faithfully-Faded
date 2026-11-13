const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

// Exercise the actual component's async controller without mounting the SDK,
// touching a real bag, or making network requests. JSX rendering is build-checked.
async function bridge({ waitForSnipcart, fetch, applyCheckoutCart }) {
  const { checkoutDisplayState } = await import('../lib/meta-checkout-display.mjs')
  const source = fs.readFileSync(require.resolve('../app/checkout/CheckoutBridge.js'), 'utf8')
    .replace(/^import .*$/gm, '').replace('export default function', 'function')
    .split('  return (\n    <main')[0] + '\n  return { begin }\n}\n'
  const items = [{ name: 'Hooded Baseball Jersey Dress - Maroon - M', price: 69, quantity: 1 }]
  let state
  const sandbox = { checkoutDisplayState, waitForSnipcart, fetch, applyCheckoutCart,
    AbortController, URLSearchParams, setTimeout, clearTimeout, window: {}, document: {},
    useState(initial) { state = initial; return [initial, next => { state = typeof next === 'function' ? next(state) : next }] },
    useRef: current => ({ current }), useEffect() {},
    useSearchParams: () => new URLSearchParams('products=FF-JERSEY-DRESS-M%3A1'),
  }
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox)
  return { controller: sandbox.CheckoutBridge({ enabled: true, initialItems: items }), get: () => state, items }
}

test('actual bridge preserves SSR title while SDK waits and uses fresh resolver items before replacement prompt', async () => {
  let releaseSdk, releaseCart
  const fresh = [{ name: 'Verified catalog title', price: 69, quantity: 1 }]
  const b = await bridge({
    waitForSnipcart: () => new Promise(resolve => { releaseSdk = resolve }),
    fetch: async () => ({ ok: true, json: async () => ({ items: fresh }) }),
    applyCheckoutCart: () => new Promise(resolve => { releaseCart = resolve }),
  })
  const task = b.controller.begin()
  assert.equal(b.get().items, b.items)
  releaseSdk({})
  while (!releaseCart) await new Promise(resolve => setImmediate(resolve))
  assert.equal(b.get().items, fresh)
  releaseCart({ needsReplacement: true })
  await task
  assert.equal(b.get().phase, 'replace')
  assert.equal(b.get().items, fresh)
})
test('actual bridge removes preview on resolver error and never touches cart', async () => {
  let mutations = 0
  const b = await bridge({ waitForSnipcart: async () => ({}),
    fetch: async () => ({ ok: false, json: async () => ({ error: 'Out of stock' }) }),
    applyCheckoutCart: async () => { mutations++ },
  })
  await b.controller.begin()
  assert.equal(b.get().phase, 'error')
  assert.equal(b.get().items, undefined)
  assert.equal(mutations, 0)
})
