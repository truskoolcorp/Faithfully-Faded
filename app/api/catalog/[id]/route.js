import { shippingWeightGrams } from '@/lib/shipping-weight.mjs'
import {NextResponse} from 'next/server'
import {getProduct} from '@/lib/products'
import {getOwnedBalance} from '@/lib/commerce-ledger'
export const dynamic='force-dynamic'
export const runtime='nodejs'
export async function GET(request,{params}){
 const {id}=await params
 if(id!=='hooded-baseball-jersey-dress')return NextResponse.json({error:'Product not found'},{status:404})
 const p=getProduct(id)
 try{
  const balances=Object.fromEntries(await Promise.all(p.sizes.map(async size=>[size,await getOwnedBalance('FF-JERSEY-DRESS-'+size)])))
  const available=p.sizes.filter(size=>Number(balances[size])>0)
  return NextResponse.json({
   dimensions:{weight:shippingWeightGrams(p.id)},
   id:p.id,name:p.name,price:p.price,url:'https://www.faithfully-faded.com/api/catalog/'+p.id,
   inventoryManagementMethod:'Variant',allowOutOfStockPurchases:false,
   customFields:[
    {name:'Color',type:'dropdown',options:p.colors.map(c=>c.name).join('|'),required:true},
    {name:'Size',type:'dropdown',options:available.join('|'),required:true}
   ],
   variants:p.sizes.map(size=>({variation:[{name:'Color',option:'Maroon'},{name:'Size',option:size}],stock:balances[size],allowOutOfStockPurchases:false}))
  },{headers:{'Cache-Control':'no-store'}})
 }catch{return NextResponse.json({error:'Live inventory unavailable'},{status:503,headers:{'Cache-Control':'no-store'}})}
}
