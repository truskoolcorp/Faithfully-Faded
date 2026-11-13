// UI-only state: never changes the cart, stock, or checkout authorization.
export function checkoutDisplayState(previous, query, next) {
  const preservePreview = previous?.query === query &&
    (next.phase === 'loading' || next.phase === 'stalled')
  return {
    ...(preservePreview ? { items: previous.items } : {}),
    ...next,
    query,
  }
}
