import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts } from '@/lib/blog-posts'

export function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}) { const {slug}=await params;const p=posts.find(x=>x.slug===slug);return {title:p ? `${p.title} | Faithfully Faded` : 'Not found'} }
export default async function BlogPost({params}) {
  const {slug}=await params;const p=posts.find(x=>x.slug===slug);if(!p) notFound()
  return <article style={{minHeight:'80vh',background:'#0d0808',color:'#f8eaf0',padding:'64px max(24px, 8vw)'}}>
    <Link href="/blog" style={{color:'#ffaded'}}>← Journal</Link>
    <h1 style={{fontSize:'clamp(2rem,5vw,4rem)',marginTop:32}}>{p.title}</h1>
    <time dateTime={p.date}>{p.date}</time>
    <div style={{maxWidth:760,lineHeight:1.9,fontSize:'1.1rem',marginTop:36}}>{p.paragraphs.map((x,i)=><p key={i}>{x}</p>)}</div>
    <Link href="/shop" style={{color:'#ffaded'}}>Shop Faithfully Faded</Link>
  </article>
}
