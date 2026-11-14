import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshShippingWeights } from '../lib/shipping-weight-refresh.mjs'
test('old bags refresh dimensions only and leave POD lines intact',async()=>{
 const items=[{id:'hooded-baseball-jersey-dress',uniqueId:'dress',quantity:2,price:69,dimensions:{weight:0,length:20}},{id:'hoe-tee-owned-v1',uniqueId:'tee',dimensions:{weight:0}},{id:'printful-123',uniqueId:'pod',dimensions:{weight:0}}]
 const patches=[]; const sdk={store:{getState:()=>({cart:{items:{items}}})},api:{cart:{items:{update:async p=>{patches.push(p);Object.assign(items.find(i=>i.uniqueId===p.uniqueId),p)}}}}}
 await Promise.all([refreshShippingWeights(sdk),refreshShippingWeights(sdk)])
 assert.equal(patches.length,2);assert.equal(items[0].dimensions.weight,900);assert.equal(items[0].dimensions.length,20);assert.equal(items[0].quantity,2);assert.equal(items[0].price,69);assert.equal(items[2].dimensions.weight,0)
 assert.deepEqual(Object.keys(patches[0]).sort(),['dimensions','uniqueId'])
 await refreshShippingWeights(sdk);assert.equal(patches.length,2)
})
test('SDK errors are surfaced',async()=>{
 const sdk={store:{getState:()=>({cart:{items:{items:[{id:'hoe-tee-owned-v1',uniqueId:'old'}]}}})},api:{cart:{items:{update:async()=>{throw Error('offline')}}}}}
 await assert.rejects(refreshShippingWeights(sdk),/offline/)
})
