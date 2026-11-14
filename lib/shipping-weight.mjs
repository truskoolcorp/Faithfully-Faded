// Owner-authorized conservative shipping estimates, including light packaging.
// Grams per item for all offered sizes; replace with packed scale measurements.
const weights = Object.freeze({
  'hooded-baseball-jersey-dress': 900,
  'hoe-tee-owned': 400,
  'hoe-hoodie-owned': 1100,
  'varsity-jacket': 1400,
  'varsity-skirt': 500,
  'varsity-jacket-skirt-set': 1900,
})
export function shippingWeightGrams(id) {
  const key = String(id).replace(/-v\d+$/, '')
  return Object.hasOwn(weights, key) ? weights[key] : undefined
}
