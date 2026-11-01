const test=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const vm=require('node:vm')
function receiver(failure, providerStatus=200) {
  const effects=[]
  const source=fs.readFileSync(__dirname+'/../app/api/webhooks/snipcart/route.js','utf8').replace(/^import .*\n/gm,'').replace(/export /g,'')
  const sandbox={Buffer,console:{error(){}},process:{env:{SNIPCART_SECRET_API_KEY:'qa-only'}},
    AbortSignal:{timeout:ms=>{assert.equal(ms,10000);return {deadline:ms}}},
    NextResponse:{json:(body,{status=200}={})=>({body,status})},
    resolveOwnedSku:()=> 'FF-JERSEY-DRESS-M',
    decrementOwnedOrder:async()=>effects.push('decrement'),
    fetch:async(url,options)=>{effects.push('validate');assert.equal(options.signal.deadline,10000);if(failure)throw Object.assign(Error('deadline'),{name:'TimeoutError'});return {ok:providerStatus===200,status:providerStatus}}}
  vm.runInNewContext(source+'\nthis.post=POST',sandbox)
  return {effects,post:mode=>sandbox.post({headers:new Headers({'x-snipcart-requesttoken':'qa-token'}),json:async()=>({eventName:'order.completed',mode,content:{invoiceNumber:'QA-TIMEOUT',items:[{id:'hooded-baseball-jersey-dress',quantity:1}]}})})}
}
test('provider validation timeout returns 503 without inventory mutation',async()=>{
 const r=receiver(true),response=await r.post('Live')
 assert.equal(response.status,503);assert.deepEqual(r.effects,['validate'])
})
test('bounded successful validation preserves live stock allocation',async()=>{
 const r=receiver(false),response=await r.post('Live')
 assert.equal(response.status,200);assert.deepEqual(r.effects,['validate','decrement'])
})
test('bounded successful validation preserves Test dry run',async()=>{
 const r=receiver(false),response=await r.post('Test')
 assert.equal(response.status,200);assert.equal(response.body.inventoryMode,'dry-run');assert.deepEqual(r.effects,['validate'])
})


test('provider outage/rate limit remains retryable; invalid token is rejected',async()=>{
 for(const status of [429,500,503,401]) {
  const r=receiver(false,status),response=await r.post('Live')
  assert.equal(response.status,status===401?401:503);assert.deepEqual(r.effects,['validate'])
 }
})
