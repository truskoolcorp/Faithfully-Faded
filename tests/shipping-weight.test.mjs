import test from 'node:test'
import assert from 'node:assert/strict'
import { shippingWeightGrams as weight } from '../lib/shipping-weight.mjs'
import { applyCheckoutCart } from '../lib/meta-checkout-cart.mjs'
test('estimates, variant lookup, component totals and unknown products',()=>{
 for(const [id,g] of Object.entries({'hoe-tee-owned':400,'hoe-hoodie-owned':1100,'hooded-baseball-jersey-dress':900,'varsity-jacket':1400,'varsity-skirt':500,'varsity-jacket-skirt-set':1900}))assert.equal(weight(id),g)
 assert.equal(weight('hoe-hoodie-owned-v13'),1100)
 assert.equal(weight('varsity-jacket-skirt-set'),weight('varsity-jacket')+weight('varsity-skirt'))
 for(const id of ['printful-123','preorder-boots','toString','__proto__'])assert.equal(weight(id),undefined)
})
const [catalogId,id,color,size]=["FF-JERSEY-DRESS-M","hooded-baseball-jersey-dress","Maroon","M"]
const product={catalogId,id,name:'Product',price:79,quantity:1,maxQuantity:2,url:'https://example.com/validation',dimensions:{weight:weight(id)},customFields:[{name:'Color',value:color},{name:'Size',value:size}]}
function mock(ignore=false,empty=false){
 const items=empty?[]:[{...structuredClone(product),uniqueId:'old',dimensions:{weight:0}}]
 return {store:{getState:()=>({cart:{currency:'USD',items:{items}}})},api:{cart:{items:{update:async patch=>{const p={...patch};if(ignore)delete p.dimensions;Object.assign(items[0],p)},add:async p=>items.push({...p,uniqueId:'new'}),remove:async()=>{throw Error('unexpected removal')}}}}}
}
test('restored zero-weight cart is updated',async()=>{const sdk=mock();await applyCheckoutCart(sdk,{currency:'USD',items:[product]});assert.equal(sdk.store.getState().cart.items.items[0].dimensions.weight,product.dimensions.weight)})
test('ignored weight updates fail verification',async()=>{await assert.rejects(applyCheckoutCart(mock(true),{currency:'USD',items:[product]}),/verified/)})
test('new cart carries weight',async()=>{const sdk=mock(false,true);await applyCheckoutCart(sdk,{currency:'USD',items:[product]});assert.equal(sdk.store.getState().cart.items.items[0].dimensions.weight,product.dimensions.weight)})
