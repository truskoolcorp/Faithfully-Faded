// Browser-only orchestration. This module never confirms orders, accepts
// payments, writes inventory, or supplies customer information.
const flights = new WeakMap()
const canonicalProduct = 'hooded-baseball-jersey-dress'

function key(item) {
  const fields = item?.customFields
  if (item?.id !== canonicalProduct || !Array.isArray(fields)) return null
  const colors = fields.filter(f => f.name === 'Color')
  const sizes = fields.filter(f => f.name === 'Size')
  if (colors.length !== 1 || colors[0].value !== 'Maroon' || sizes.length !== 1 ||
      !['S', 'M', 'L', 'XL'].includes(sizes[0].value)) return null
  return `FF-JERSEY-DRESS-${sizes[0].value}`
}

function cartItems(sdk) {
  const items = sdk.store.getState()?.cart?.items?.items
  if (!Array.isArray(items)) throw new Error('Your bag is still loading. Please try again.')
  return items
}

export function planCart(sdk, payload) {
  const existing = cartItems(sdk)
  const requested = new Set(payload.items.map(item => item.catalogId))
  const matches = new Map()
  const extras = []
  for (const item of existing) {
    const id = key(item)
    if (requested.has(id)) {
      if (matches.has(id) || !item.uniqueId) throw new Error('Please review duplicate items in your bag before continuing.')
      matches.set(id, item)
    } else {
      if (!item.uniqueId) throw new Error('Your bag could not be read safely. Please review it before continuing.')
      extras.push(item)
    }
  }
  return { matches, extras }
}

export function verifyCart(sdk, payload) {
  const items = cartItems(sdk)
  if (items.length !== payload.items.length) throw new Error('Your bag changed while checkout was loading. Please review your bag before trying again.')
  for (const expected of payload.items) {
    const matches = items.filter(item => key(item) === expected.catalogId)
    if (matches.length !== 1 || matches[0].quantity !== expected.quantity ||
        typeof matches[0].basePrice !== 'number' ||
        Math.round(matches[0].basePrice * 100) !== Math.round(expected.price * 100)) {
      throw new Error('Your bag could not be verified with the selected quantity and current price. Please review it before trying again.')
    }
  }
  const currency = sdk.store.getState()?.cart?.currency
  if (typeof currency !== 'string' || currency.toUpperCase() !== payload.currency) {
    throw new Error('Your bag currency could not be verified. Please review your bag before continuing.')
  }
}

export function applyCheckoutCart(sdk, payload, { replaceExisting = false, signal } = {}) {
  // One mutation flow per SDK instance, even if React mounts twice or a shopper
  // double-clicks. A concurrent different request is not silently substituted.
  if (flights.has(sdk)) return Promise.reject(new Error('Your bag is already being updated. Please wait.'))
  const assertActive = () => { if (signal?.aborted) throw new Error('Checkout was cancelled.') }
  const flight = (async () => {
    assertActive()
    const { matches, extras } = planCart(sdk, payload)
    if (extras.length && !replaceExisting) return { needsReplacement: true, existingCount: extras.length }
    for (const product of payload.items) {
      assertActive()
      const { catalogId, ...definition } = product
      const existing = matches.get(catalogId)
      if (existing) {
        await sdk.api.cart.items.update({
          uniqueId: existing.uniqueId, quantity: product.quantity,
          basePrice: product.price, url: product.url, name: product.name,
          description: product.description, image: product.image,
          customFields: product.customFields, minQuantity: 1, maxQuantity: product.maxQuantity,
        })
      } else {
        await sdk.api.cart.items.add(definition)
      }
    }
    // Do not discard the original bag until all intended items were added.
    // No rollback or automatic retry follows a rejected/uncertain SDK mutation.
    for (const item of extras) { assertActive(); await sdk.api.cart.items.remove(item.uniqueId) }
    assertActive()
    let couponWarning = null
    if (payload.coupon) {
      try { await sdk.api.cart.applyDiscount(payload.coupon) }
      catch { couponWarning = 'The promo code could not be applied. Review the total before paying, or enter another code in your bag.' }
    }
    assertActive()
    verifyCart(sdk, payload)
    return { needsReplacement: false, couponWarning }
  })()
  flights.set(sdk, flight)
  return flight.finally(() => { if (flights.get(sdk) === flight) flights.delete(sdk) })
}

export function waitForSnipcart(win, doc, timeoutMs = 15000, signal) {
  return new Promise((resolve, reject) => {
    let timer, settled = false, observed
    const cleanup = () => { clearTimeout(timer); doc.removeEventListener('snipcart.ready', check); signal?.removeEventListener('abort', aborted) }
    const finish = (error, sdk) => { if (settled) return; settled = true; cleanup(); error ? reject(error) : resolve(sdk) }
    const aborted = () => finish(new Error('Checkout was cancelled.'))
    function check() {
      const sdk = win.Snipcart
      if (!sdk?.api?.cart?.items || !sdk?.store?.getState || sdk === observed) return
      observed = sdk
      // Snipcart.ready also waits for a saved bag to be restored.
      Promise.resolve(sdk.ready).then(() => finish(null, sdk), () => finish(new Error('Your bag could not be loaded. Please try again.')))
    }
    timer = setTimeout(() => finish(new Error('Secure checkout did not load. Please allow Snipcart, then try again.')), timeoutMs)
    doc.addEventListener('snipcart.ready', check)
    signal?.addEventListener('abort', aborted, { once: true })
    if (signal?.aborted) aborted(); else check()
  })
}
