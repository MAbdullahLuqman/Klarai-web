import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const docSnap = await getDoc(doc(db, 'niche_pages', slug));
  if (!docSnap.exists()) return { title: 'Page Not Found | Klarai' };
  return { title: docSnap.data()?.metaTitle || 'Klarai', description: docSnap.data()?.metaDescription || '' };
}

export default async function NicheLandingPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const docSnap = await getDoc(doc(db, 'niche_pages', slug));

  if (!docSnap.exists()) notFound(); 
  const page = docSnap.data() || {};

  let relatedPosts = [];
  try {
    const blogQ = query(collection(db, 'blog_posts'), orderBy('updatedAt', 'desc'), limit(20));
    const blogSnap = await getDocs(blogQ);
    const allPosts = blogSnap.docs.map(doc => {
      const d = doc.data();
      return { id: doc.id, slug: d.slug || doc.id, title: d.hero?.title || 'Intelligence Report', readTime: d.hero?.readTime || '5 Min' };
    });

    const nicheKeyword = (page.service || page.h1 || '').toLowerCase();
    let matched = allPosts.filter(p => {
       const t = p.title.toLowerCase();
       if (nicheKeyword.includes('seo') && t.includes('seo')) return true;
       if (nicheKeyword.includes('aeo') && (t.includes('aeo') || t.includes('answer engine') || t.includes('ai'))) return true;
       if (nicheKeyword.includes('web') && (t.includes('web') || t.includes('design') || t.includes('develop'))) return true;
       if ((nicheKeyword.includes('ad') || nicheKeyword.includes('meta')) && (t.includes('ad') || t.includes('meta'))) return true;
       return false;
    });

    relatedPosts = matched.length > 0 ? matched.slice(0, 4) : allPosts.slice(0, 4);
  } catch (e) { }

  const faqSchema = page.faqs && page.faqs.some(f => f.q) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.filter(f => f.q && f.a).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  } : null;

  const brutalityH2 = "text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight mb-6 md:mb-8 text-left text-[#0A101D]";

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-[#0A101D] min-h-screen">
      <GlobalHeader />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="pt-[140px] pb-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
        
        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit">
           <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#008dd8] mb-5 border-b border-gray-100 pb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                Intelligence Hub
              </h3>
              <div className="space-y-5">
                {relatedPosts.length > 0 ? relatedPosts.map(post => (
                   <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#008dd8] transition-colors">{post.readTime} Read</div>
                      <h4 className="text-sm font-black text-[#0A101D] leading-snug group-hover:text-[#008dd8] transition-colors line-clamp-2">{post.title}</h4>
                   </Link>
                )) : <p className="text-xs font-medium text-gray-500">No recent articles found.</p>}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                 <Link href="/blog" className="text-xs font-black uppercase tracking-widest text-[#0A101D] hover:text-[#008dd8] flex items-center gap-1 transition-colors">
                    View All Systems <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                 </Link>
              </div>
           </div>
        </aside>

        <article className="flex-1 w-full max-w-[800px] space-y-16">
          <section className="text-left border-b border-gray-200 pb-10">
            <h1 className="text-4xl md:text-[2.8rem] leading-[1.1] font-black tracking-tighter text-[#0A101D] mb-4">{page.h1 || 'High-Performance Architecture'}</h1>
            <p className="text-lg md:text-xl text-gray-700 font-bold mb-8 max-w-2xl leading-relaxed">{page.subheadline || 'Data-driven growth and scaling for your sector.'}</p>
            <Link href="/free-audit" className="inline-flex bg-[#0A101D] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#008dd8] transition-all shadow-[0_8px_20px_rgba(10,16,29,0.2)] active:scale-95 mb-6">
              Get Your Free Audit
            </Link>
            <p className="text-[11px] font-mono uppercase tracking-widest text-gray-500 font-bold">{page.trustLine || 'No Contracts · Results-Focused · Data-Driven'}</p>
          </section>

          {/* HTML Safely injected here */}
          {page.tldr && (
            <section className="bg-blue-50 border-l-4 border-[#008dd8] p-6 md:p-8 rounded-r-2xl">
              <div className="text-base text-gray-800 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: page.tldr }} />
            </section>
          )}

          {page.statCards && page.statCards.some(s => s.number) && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {page.statCards.map((stat, i) => stat.number ? (
                <div key={i} className="bg-white border-2 border-gray-100 p-6 rounded-2xl shadow-sm text-center hover:border-blue-200 transition-colors">
                  <div className="text-4xl font-black text-[#008dd8] mb-2 tracking-tighter">{stat.number}</div>
                  <div className="text-sm font-bold text-gray-900 mb-2 leading-snug">{stat.label}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">{stat.source}</div>
                </div>
              ) : null)}
            </section>
          )}

          {/* HTML safely injected in directAnswer and expansion */}
          {page.h2Sections && page.h2Sections.some(s => s.question) && (
            <section className="space-y-12">
              {page.h2Sections.map((sec, i) => sec.question ? (
                <div key={i} className="border-b border-gray-100 pb-10 last:border-0 last:pb-0">
                  <h2 className="text-2xl md:text-[1.75rem] font-black text-[#0A101D] mb-5 tracking-tight leading-snug">{sec.question}</h2>
                  <div className="bg-gray-100 p-5 rounded-2xl mb-6 font-bold text-gray-900 text-base leading-relaxed border border-gray-200" dangerouslySetInnerHTML={{ __html: sec.directAnswer }} />
                  <div className="text-gray-600 text-[17px] leading-relaxed font-medium space-y-4" dangerouslySetInnerHTML={{ __html: sec.expansion }} />
                </div>
              ) : null)}
            </section>
          )}

          {page.deliverables && page.deliverables.some(d => d.action) && (
            <section className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-black text-[#0A101D] mb-6 tracking-tight">What We Actually Do</h2>
              <ul className="space-y-4">
                {page.deliverables.map((del, i) => del.action ? (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#008dd8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-[17px] text-gray-700 font-medium leading-snug pt-0.5">
                      <strong className="text-[#0A101D] font-black">{del.action}</strong> <span className="text-gray-400 mx-1">→</span> {del.outcome}
                    </span>
                  </li>
                ) : null)}
              </ul>
            </section>
          )}

          {page.caseStudy && page.caseStudy.location && (
            <section className="bg-[#0A101D] text-white p-8 md:p-10 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#008dd8]/20 rounded-full blur-[50px] pointer-events-none"></div>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-white/10 pb-4">Sector Case Study</h2>
              <div className="space-y-5 font-mono text-sm md:text-base relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-3 gap-1"><span className="text-gray-400">Location / Sector</span><span className="font-bold text-[#008dd8]">{page.caseStudy.location}</span></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-3 gap-1"><span className="text-gray-400">Core Metrics</span><span className="font-bold text-white bg-white/10 px-3 py-1 rounded-md">{page.caseStudy.before} → {page.caseStudy.after}</span></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-3 gap-1"><span className="text-gray-400">Timeframe</span><span className="font-bold text-white">{page.caseStudy.time}</span></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-1 gap-1"><span className="text-gray-400">Page 1 Keywords</span><span className="font-bold text-green-400">{page.caseStudy.kwBefore} → {page.caseStudy.kwAfter}</span></div>
              </div>
            </section>
          )}

          {page.process && page.process.some(p => p) && (
            <section>
              <h2 className="text-2xl font-black text-[#0A101D] mb-6 tracking-tight">Deployment Protocol</h2>
              <div className="flex flex-wrap gap-3">
                {page.process.map((step, i) => step ? (
                  <div key={i} className="flex items-center gap-2 bg-gray-100 border-2 border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-800"><span className="text-[#008dd8] font-black">{i + 1}.</span> {step}</div>
                ) : null)}
              </div>
            </section>
          )}

          {page.keywords && page.keywords.some(k => k.kw) && (
            <section className="text-left">
              <h2 className={brutalityH2}>Target Intelligence</h2>
              <div className="rounded-2xl md:rounded-[2rem] border-2 border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="w-[50%] md:w-[60%] p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-left">Keyword Entity</th>
                        <th className="w-[25%] md:w-[20%] p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center whitespace-nowrap">Search Vol.</th>
                        <th className="w-[25%] md:w-[20%] p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center whitespace-nowrap">Diff. (KD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                      {page.keywords.map((item, i) => item.kw ? (
                        <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 md:p-6 text-sm md:text-base font-bold text-[#0A101D] text-left break-words">{item.kw}</td>
                          <td className="p-4 md:p-6 text-sm md:text-base text-center text-[#008dd8] font-black whitespace-nowrap">{item.vol}</td>
                          <td className="p-4 md:p-6 text-sm md:text-base text-center text-gray-600 font-black whitespace-nowrap">{item.kd}</td>
                        </tr>
                      ) : null)}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* HTML safely injected in FAQ answers */}
          {page.faqs && page.faqs.some(f => f.q) && (
            <section>
              <h2 className="text-2xl font-black text-[#0A101D] mb-6 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {page.faqs.map((faq, i) => faq.q ? (
                  <div key={i} className="border-2 border-gray-200 p-6 rounded-2xl bg-white hover:border-[#008dd8]/30 transition-colors">
                    <h3 className="font-black text-[#0A101D] mb-3 text-lg leading-snug">Q: {faq.q}</h3>
                    <div className="text-[16px] text-gray-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
                  </div>
                ) : null)}
              </div>
            </section>
          )}

          {page.relatedLinks && page.relatedLinks.some(l => l.url) && (
            <section className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-100">
              <h2 className="text-xl font-black text-[#0A101D] mb-5 tracking-tight">Related Architecture Guides</h2>
              <ul className="space-y-3">
                {page.relatedLinks.map((link, i) => link.url ? (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <Link href={link.url} className="text-[#008dd8] font-bold text-base hover:underline decoration-2 underline-offset-4">{link.title}</Link>
                  </li>
                ) : null)}
              </ul>
            </section>
          )}

          <section className="lg:hidden bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm mt-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#008dd8] mb-5 border-b border-gray-100 pb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
              Related Intelligence
            </h3>
            <div className="space-y-5">
              {relatedPosts.length > 0 ? relatedPosts.map(post => (
                 <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#008dd8] transition-colors">{post.readTime} Read</div>
                    <h4 className="text-sm font-black text-[#0A101D] leading-snug group-hover:text-[#008dd8] transition-colors line-clamp-2">{post.title}</h4>
                 </Link>
              )) : <p className="text-xs font-medium text-gray-500">No recent articles found.</p>}
            </div>
          </section>

          <section className="bg-[#0A101D] text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden mt-12 flex flex-col items-center text-center">
             <div className="absolute top-0 right-0 w-80 h-80 bg-[#008dd8]/20 rounded-full blur-[80px] pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-[2.5rem] font-black tracking-tighter mb-6 text-white leading-tight">Ready to Dominate?</h2>
                <div className="text-gray-300 font-medium text-base mb-8 max-w-md mx-auto">
                  <p className="mb-4">Get a free, technical SEO audit. We'll show you:</p>
                  <div className="inline-block text-left bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <ul className="space-y-2.5 text-gray-300 font-mono text-xs md:text-sm">
                      <li className="flex items-start gap-2"><span className="text-[#008dd8] font-black shrink-0">✓</span> <span>Missing high-intent keywords</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#008dd8] font-black shrink-0">✓</span> <span>Competitor ranking vulnerabilities</span></li>
                      <li className="flex items-start gap-2"><span className="text-[#008dd8] font-black shrink-0">✓</span> <span>Exact growth pathways & timelines</span></li>
                    </ul>
                  </div>
                </div>
                <Link href="/free-audit" className="inline-block bg-white text-[#0A101D] px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95 mb-10 w-full md:w-auto">
                  Initiate System Audit
                </Link>
                {page.authorName && (
                  <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                     <div className="w-14 h-14 bg-gray-900 border border-white/10 rounded-full flex items-center justify-center font-black text-2xl text-[#008dd8] shadow-inner shrink-0">
                        {page.authorName.charAt(0)}
                     </div>
                     <div className="text-center sm:text-left">
                        <div className="font-black text-white text-base tracking-tight mb-0.5">{page.authorName}</div>
                        <div className="text-[10px] uppercase tracking-widest text-[#008dd8] font-bold">{page.authorRole || 'Lead Architect'}</div>
                     </div>
                  </div>
                )}
             </div>
          </section>
        </article>
      </main>
    </div>
  );
}