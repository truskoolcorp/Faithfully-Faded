import { NextResponse } from 'next/server'
export const dynamic='force-dynamic'
export async function POST() {
 return NextResponse.json({success:false,error:'Automatic signup is unavailable. Request collection updates through the email link on our homepage. No subscription or discount email has been created.'},{status:503})
}
