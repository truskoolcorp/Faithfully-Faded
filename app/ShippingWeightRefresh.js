'use client'
import { useEffect, useState } from 'react'
import { refreshShippingWeights, observeBagOpening } from '@/lib/shipping-weight-refresh.mjs'
export default function ShippingWeightRefresh() {
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true, subscribed, unsubscribe
    const refresh = sdk => refreshShippingWeights(sdk).then(() => { if (active) setFailed(false) }, () => { if (active) setFailed(true) })
    const ready = () => {
      const sdk = window.Snipcart
      if (!sdk?.api?.cart?.items || !sdk?.store?.getState || sdk === subscribed) return
      subscribed = sdk
      Promise.resolve(sdk.ready).then(() => {
        if (!active) return
        refresh(sdk)
        unsubscribe = observeBagOpening(sdk, refresh)
      }, () => { if (active) setFailed(true) })
    }
    document.addEventListener('snipcart.ready', ready)
    ready()
    return () => { active = false; document.removeEventListener('snipcart.ready', ready); if (typeof unsubscribe === 'function') unsubscribe() }
  }, [])
  return failed ? <p role="alert" style={{position:'fixed',bottom:16,left:16,right:16,zIndex:2147483647,background:'#fff',color:'#222',padding:16}}>Shipping details could not be refreshed. Reload this page before checking out.</p> : null
}
