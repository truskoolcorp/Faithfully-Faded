import { test } from 'node:test'
import assert from 'node:assert/strict'
import {allowed,catalogItem,itemPayload,purchasePayload} from '../lib/meta-tracking.mjs'
const item = {id:'hooded-baseball-jersey-dress',quantity:1,price:69,customFields:[{name:'Size',value:'M'},{name:'Color',value:'Maroon'}]}
test('no consent or GPC means no marketing',()=>{for(const x of [null,'deny','invalid']) assert.equal(allowed(x,false),false); assert.equal(allowed('allow',true),false);assert.equal(allowed('allow',false),true)})
test('maps website size to exact Meta variant and ignores retired products',()=>{assert.equal(catalogItem(item).id,'FF-JERSEY-DRESS-M');assert.equal(catalogItem({...item,id:'retired'}),null);assert.equal(catalogItem({...item,customFields:[]}),null);assert.equal(catalogItem({...item,quantity:-1}),null);assert.equal(itemPayload(item).value,69)})
test('confirmed paid orders only; no pending, test, redirect, mixed or missing total',()=>{
 const cart={token:'private-order-token',paymentStatus:'Paid',currency:'usd',items:[item],total:74}
 assert.equal(purchasePayload(cart).data.value,74)
 for(const bad of [{...cart,paymentStatus:'Pending'},{...cart,isInTestMode:true},{...cart,total:undefined},{...cart,items:[item,{...item,id:'retired'}]},{...cart,currency:'eur'}]) assert.equal(purchasePayload(bad),null)
 assert.equal(purchasePayload({cart,requiresRedirect:true}),null)
 assert.equal(JSON.stringify(purchasePayload(cart).data).includes('private-order-token'),false)
})
