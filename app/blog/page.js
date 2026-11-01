import Link from 'next/link'
import { posts } from '@/lib/blog-posts'

export const metadata = { title: 'Journal | Faithfully Faded', description: 'News, apparel stories and styling inspiration from Faithfully Faded.' }

export default function BlogPage() {
  return <main style={{minHeight:'80vh',background:'#0d0808',color:'#f8eaf0',padding:'64px max(24px, 8vw)'}}>
    <Link href="/" style={{color:'#ffaded'}}>← Faithfully Faded</Link>
    <h1 style={{fontSize:'clamp(2rem,5vw,4rem)',marginTop:32}}>The Faithfully Faded Journal</h1>
    <p style={{maxWidth:640,lineHeight:1.7}}>Brand stories, collection news and style inspiration.</p>
    <div style={{marginTop:40,maxWidth:780}}>{posts.map(p=><article key={p.slug} style={{borderTop:'1px solid #8f6b77',padding:'26px 0'}}>
      <time dateTime={p.date}>{p.date}</time><h2><Link href={`/blog/${p.slug}`} style={{color:'#ffaded'}}>{p.title}</Link></h2><p>{p.excerpt}</p>
    </article>)}</div>
    <a href="/feed.xml" style={{color:'#ffaded'}}>Subscribe via RSS</a>
  </main>
}
