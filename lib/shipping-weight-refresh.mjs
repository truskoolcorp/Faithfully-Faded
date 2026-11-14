import { shippingWeightGrams } from './shipping-weight.mjs'
const flights = new WeakMap()
// Refresh only shipping dimensions; preserve quantities, selections and prices.
export function refreshShippingWeights(sdk) {
  if (flights.has(sdk)) return flights.get(sdk)
  const flight = Promise.resolve().then(async () => {
    const items = sdk.store.getState()?.cart?.items?.items
    if (!Array.isArray(items)) throw new Error('Bag unavailable')
    for (const item of items) {
      const weight = shippingWeightGrams(item.id)
      if (weight === undefined || item.dimensions?.weight === weight) continue
      if (!item.uniqueId) throw new Error('Bag item unavailable')
      await sdk.api.cart.items.update({ uniqueId: item.uniqueId, dimensions: { ...item.dimensions, weight } })
    }
  }).finally(() => flights.delete(sdk))
  flights.set(sdk, flight)
  return flight
}
