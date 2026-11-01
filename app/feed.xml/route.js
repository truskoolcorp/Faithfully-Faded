import { posts } from '@/lib/blog-posts'

const site='https://www.faithfully-faded.com'
const esc=(s)=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
export function GET(){
 const items=posts.map(p=>`<item><title>${esc(p.title)}</title><link>${site}/blog/${p.slug}</link><guid isPermaLink="true">${site}/blog/${p.slug}</guid><pubDate>${new Date(p.date+'T12:00:00Z').toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`).join('')
 const xml=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Faithfully Faded Journal</title><link>${site}/blog</link><description>News, product stories and styling inspiration from Faithfully Faded.</description><language>en-us</language>${items}</channel></rss>`
 return new Response(xml,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=300'}})
}
