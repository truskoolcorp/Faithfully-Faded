export const metadata={title:"Faithfully Faded email updates"}
export default function NewsletterPage(){return <main style={{maxWidth:640,margin:'60px auto',padding:24,lineHeight:1.7}}>
<h1>Faithfully Faded email updates</h1><p>Get collection news and promotional offers from Faithfully Faded. No purchase is required. Confirm your address by email before enrollment.</p>
<form method="post" action="https://www.concrete-rose.world/api/newsletter">
<input type="hidden" name="brand" value="faithfully-faded"/>
<label>Email address<input type="email" name="email" required maxLength={254} autoComplete="email" style={{display:'block',width:'100%',padding:12,margin:'12px 0',color:'#111',background:'#fff'}}/></label>
<div aria-hidden="true" style={{position:'absolute',left:-10000}}><label>Company<input name="company" tabIndex={-1} autoComplete="off"/></label></div>
<label style={{display:'block',margin:'20px 0'}}><input type="checkbox" name="consent" value="yes" required/> I agree to receive Faithfully Faded collection and promotional emails. I can unsubscribe at any time.</label>
<button type="submit" style={{padding:'12px 24px',cursor:'pointer'}}>Send confirmation email</button></form>
<p>Tru Skool processes this request at concrete-rose.world for this brand only. No discount or order is created. Confirmation emails are capped at 20 per day across these three brand lists while campaign signup is validated.</p>
<p><a href="/privacy">Privacy policy</a> · <a href="/">Back to store</a></p></main>}
