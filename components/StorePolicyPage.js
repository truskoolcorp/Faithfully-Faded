import { policies } from '@/lib/store-policies';
const links = [
 ['/privacy', 'Privacy'],
 ['/shipping', 'Shipping'],
 ['/returns', 'Returns & refunds'],
 ['/terms', 'Terms'],
];
export default function StorePolicyPage({policyKey}) {
 const policy = policies[policyKey];
 return (<><nav style={{padding:'24px',borderBottom:'1px solid #FFADED'}}><a href="/">Faithfully Faded® — Home</a></nav>
      <article style={{maxWidth: '52rem', margin: '0 auto', padding: '48px 24px', lineHeight: 1.8}}>
        <a href="/#shop" style={{textDecoration: 'underline'}}>← Back to shop</a>
        <h1 style={{fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 1.2, marginTop: 24, marginBottom: 12}}>{policy.title}</h1>
        <p style={{marginBottom: 28}}>Effective October 31, 2026</p>
        <nav aria-label="Store policies" style={{display: 'flex', flexWrap: 'wrap', gap: '10px 22px', borderTop: '1px solid currentColor', borderBottom: '1px solid currentColor', padding: '16px 0', marginBottom: 32}}>
          {links.map(([href, label]) => <a key={href} href={href} style={{textDecoration: 'underline'}}>{label}</a>)}
        </nav>
        {policy.sections.map(([heading, paragraph]) => (
          <section key={heading} style={{marginBottom: 30}}>
            <h2 style={{fontSize: 23, lineHeight: 1.4, marginBottom: 10}}>{heading}</h2>
            <p>{paragraph}</p>
          </section>
        ))}
        <p style={{borderTop: '1px solid currentColor', paddingTop: 24}}>Questions? <a href={"mailto:truskoolcorp@truskool.net"} style={{textDecoration: 'underline'}}>truskoolcorp@truskool.net</a></p>
      </article></>
 );
}
