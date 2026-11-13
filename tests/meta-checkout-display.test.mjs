import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkoutDisplayState } from '../lib/meta-checkout-display.mjs'

const query = 'products=FF-JERSEY-DRESS-M%3A1'
const items = [{ name: 'Hooded Baseball Jersey Dress - Maroon - M' }]

test('same-selection product title remains visible through every loading/stall phase', () => {
  let state = { query, items, phase: 'loading' }
  for (const phase of ['loading', 'loading', 'loading', 'stalled']) {
    state = checkoutDisplayState(state, query, { phase, message: 'Waiting' })
    assert.equal(state.items, items)
  }
})
test('new URL never inherits a previous selection preview', () => {
  const state = checkoutDisplayState({ query, items }, 'products=OTHER:1', { phase: 'loading' })
  assert.equal(state.items, undefined)
})
test('fresh resolver items replace server preview and stale totals/warnings disappear', () => {
  const fresh = [{ name: 'Current verified title' }]
  const state = checkoutDisplayState({ query, items, subtotal: 69, warning: 'Old warning' }, query, { phase: 'loading', items: fresh })
  assert.equal(state.items, fresh)
  assert.equal(state.subtotal, undefined)
  assert.equal(state.warning, undefined)
})
test('errors clear previews rather than implying invalid/out-of-stock items are checkout ready', () => {
  const state = checkoutDisplayState({ query, items }, query, { phase: 'error' })
  assert.equal(state.items, undefined)
})
test('ready and replacement states use only their explicit items', () => {
  for (const phase of ['ready', 'replace']) {
    assert.equal(checkoutDisplayState({ query, items }, query, { phase }).items, undefined)
    assert.equal(checkoutDisplayState({ query, items }, query, { phase, items }).items, items)
  }
})
