'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { applyCheckoutCart, waitForSnipcart } from '@/lib/meta-checkout-cart.mjs'
import styles from './checkout.module.css'

export default function CheckoutBridge({ enabled }) {
  const [state, setState] = useState({ phase: enabled ? 'loading' : 'error', message: enabled ? 'Checking current price and availability…' : 'Shop checkout is not available here. Please return to the shop.' })
  const checkoutQuery = useSearchParams().toString()
  const controller = useRef(null)
  const task = useRef(null)
  const sdkRef = useRef(null)

  function begin(replaceExisting = false) {
    if (!enabled || task.current) return task.current
    const current = execute(replaceExisting)
    task.current = current
    current.finally(() => { if (task.current === current) task.current = null })
    return current
  }

  async function execute(replaceExisting) {
    const run = new AbortController()
    controller.current = run
    setState({ phase: 'loading', message: 'Checking current price and availability…' })
    let timer, stallTimer
    try {
      // Keep the original checkout URL and tracking parameters in the address bar.
      // Only recognized cart arguments go to our read-only resolver.
      const original = new URLSearchParams(checkoutQuery)
      const query = new URLSearchParams()
      for (const name of ['products', 'coupon']) for (const value of original.getAll(name)) query.append(name, value)
      setState({ phase: 'loading', message: 'Loading secure checkout…' })
      const sdk = await waitForSnipcart(window, document, 15000, run.signal)
      if (run.signal.aborted) return
      sdkRef.current = sdk
      setState({ phase: 'loading', message: 'Checking current price and availability…' })
      timer = setTimeout(() => run.abort(), 12000)
      const response = await fetch(`/api/meta-checkout?${query}`, { cache: 'no-store', signal: run.signal })
      const payload = await response.json()
      clearTimeout(timer)
      if (!response.ok) throw new Error(payload.error || 'Checkout is unavailable. Please return to the shop.')
      if (run.signal.aborted) return
      setState({ phase: 'loading', message: 'Preparing your bag. No payment will be made until you place your order.' })
      stallTimer = setTimeout(() => {
        if (controller.current === run && !run.signal.aborted) setState({ phase: 'stalled', message: 'Your bag update is taking longer than expected. Review your bag or reload this page before retrying. Do not submit payment until you have checked the items and total.' })
      }, 20000)
      const result = await applyCheckoutCart(sdk, payload, { replaceExisting, signal: run.signal })
      if (run.signal.aborted) return
      if (result.needsReplacement) {
        setState({ phase: 'replace', message: 'Your bag already has other items. Replace them with the products selected in Facebook or Instagram?', items: payload.items })
        return
      }
      const subtotal = payload.items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0) / 100
      setState({ phase: 'ready', message: 'Your selected products are ready. Review quantities, any discounts, shipping, taxes and the final total in your bag before placing your order.', items: payload.items, subtotal, warning: result.couponWarning })
      sdk.api.theme.cart.open()
    } catch (error) {
      if (controller.current === run && !run.signal.aborted) {
        setState({ phase: 'error', message: error.message || 'Your bag could not be prepared. Please review it before trying again.' })
      } else if (controller.current === run && run.signal.aborted) {
        setState({ phase: 'error', message: 'Checkout took too long to load. Please try again or return to the shop.' })
      }
    } finally {
      clearTimeout(timer)
      clearTimeout(stallTimer)
    }
  }

  useEffect(() => {
    let active = true
    let stallTimer
    const start = setTimeout(async () => {
      // A newer URL cancels subsequent old mutations. Wait for any already
      // submitted SDK operation to settle before starting its replacement.
      if (task.current) {
        setState({ phase: 'loading', message: 'Finishing the previous bag update before loading your new selection…' })
        stallTimer = setTimeout(() => { if (active) setState({ phase: 'stalled', message: 'The previous bag update is still pending. Review your bag or reload before trying your new selection.' }) }, 20000)
        await task.current
      }
      clearTimeout(stallTimer)
      if (active) begin()
    }, 0)
    return () => {
      active = false
      clearTimeout(start)
      clearTimeout(stallTimer)
      controller.current?.abort()
      controller.current = null
    }
  }, [checkoutQuery])

  function openBag() { sdkRef.current?.api.theme.cart.open() }

  return (
    <main className={styles.page}>
      <Link className={styles.brand} href="/">Faithfully Faded™</Link>
      <section className={styles.panel} aria-labelledby="checkout-title">
        <p className={styles.eyebrow}>Your shop checkout</p>
        <h1 id="checkout-title">Let’s get your bag ready.</h1>
        <p role={state.phase === 'error' ? 'alert' : 'status'} aria-live="polite">{state.message}</p>
        {state.warning && <p className={styles.warning} role="alert">{state.warning}</p>}
        {state.items && <ul className={styles.items}>{state.items.map(item => (
          <li key={item.catalogId}>
            <span>{item.name}<small>Maroon · {item.customFields.find(field => field.name === 'Size').value} · Qty {item.quantity}</small></span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}</ul>}
        {state.phase === 'ready' && <p className={styles.subtotal}>Items subtotal before discounts, shipping and tax: <strong>${state.subtotal.toFixed(2)} USD</strong></p>}
        <div className={styles.actions}>
          {state.phase === 'replace' && <button onClick={() => begin(true)}>Replace bag and continue</button>}
          {(state.phase === 'ready' || state.phase === 'replace' || (state.phase === 'stalled' && sdkRef.current)) && <button className={styles.secondary} onClick={openBag}>{state.phase === 'replace' ? 'Keep and review my current bag' : 'Review bag and checkout'}</button>}
          {state.phase === 'error' && enabled && <button onClick={() => begin()}>Try again</button>}
          <Link href="/shop/hooded-baseball-jersey-dress">{state.phase === 'loading' ? 'Cancel and return to shop' : 'Return to shop'}</Link>
        </div>
        <noscript>JavaScript is needed for secure checkout. Enable JavaScript or contact us for help.</noscript>
        <footer><Link href="/shipping">Shipping</Link><Link href="/returns">Returns</Link><Link href="/contact">Contact</Link></footer>
      </section>
    </main>
  )
}
