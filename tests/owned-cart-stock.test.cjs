const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function harness(fail=false){let GET;const src=fs.readFileSync(require.resolve('../app/api/catalog/[id]/route.js'),'utf8').replace(/^import .*$/gm,'').replace(/export /g,'');vm.runInNewContext(src+';out.fn=GET;',{
 NextResponse:{json:(data,init={})=>({data,status:init.status||200,headers:init.headers})},
 getProduct:()=>({id:'hooded-baseball-jersey-dress',name:'Dress',price:69,sizes:['S','M','L','XL'],colors:[{name:'Maroon'}]}),
 getOwnedBalance:async sku=>{if(fail)throw Error('database');return {S:0,M:3,L:4,XL:2}[sku.split('-').pop()]},
 out:{set fn(v){GET=v}}
});return GET}
test('JSON validation excludes sold-out cart options and marks variant stock non-oversell',async()=>{
 const r=await harness()({}, {params:Promise.resolve({id:'hooded-baseball-jersey-dress'})});
 assert.equal(r.status,200);assert.equal(r.data.price,69);assert.equal(r.data.customFields[1].options,'M|L|XL');assert.equal(r.data.customFields[1].required,true);assert.equal(r.data.variants[0].stock,0);assert.equal(r.data.variants[0].allowOutOfStockPurchases,false);assert.equal(r.headers['Cache-Control'],'no-store');
});
test('inventory failure cannot validate a checkout',async()=>{const r=await harness(true)({}, {params:Promise.resolve({id:'hooded-baseball-jersey-dress'})});assert.equal(r.status,503)});
test('unknown product cannot use owned validation endpoint',async()=>{const r=await harness()({}, {params:Promise.resolve({id:'other'})});assert.equal(r.status,404)});
