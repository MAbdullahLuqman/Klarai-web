import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const docSnap = await getDoc(doc(db, 'blog_posts', slug));
  if (!docSnap.exists()) return { title: 'Post Not Found | Klarai' };
  const post = docSnap.data();
  return { 
    title: post.seoMeta?.title || post.hero?.title, 
    description: post.seoMeta?.metaDescription || post.hero?.description,
    alternates: { canonical: post.seoMeta?.canonicalUrl || `https://klarai.com/blog/${slug}` }
  };
}


// ==========================================
// RENDERER: PURE DARK MODE SAAS COMPARISON CARDS
// ==========================================
const renderComparisonCards = (comp) => {
  if (!comp || !comp.cards || comp.cards.length === 0) return null;
  
  return (
    <div className="my-16 grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch w-full">
      {comp.cards.map((card, idx) => {
        // The card with a badge becomes the highlighted "Winner" card
        const isHighlighted = card.badge && card.badge.trim() !== '';

        return (
          <div key={idx} className={`relative flex flex-col rounded-[1.5rem] p-6 md:p-8 transition-all duration-500 border-2 ${
            isHighlighted 
              ? 'bg-gradient-to-b from-[#0A101D] to-[#061422] border-[#008dd8] shadow-[0_20px_50px_rgba(0,141,216,0.15)] md:-translate-y-2 z-10' 
              : 'bg-[#111111] border-white/5 hover:border-white/10 shadow-xl'
          }`}>
            
            {/* Floating Top Badge (Blue tinted for the highlighted card) */}
            {isHighlighted && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] text-center">
                <span className="bg-[#e0f2fe] text-[#008dd8] text-[10px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-full shadow-lg border border-[#bae6fd] inline-block w-fit max-w-full truncate">
                  {card.badge}
                </span>
              </div>
            )}

            {/* Header Section */}
            <div className={`flex flex-col gap-3 mb-6 pb-6 border-b ${isHighlighted ? 'border-[#008dd8]/30' : 'border-white/10'}`}>
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 shadow-inner ${
                   isHighlighted ? 'bg-white text-[#0A101D]' : 'bg-[#1a1a1a] text-white border border-white/10'
                 }`}>
                   {card.icon}
                 </div>
                 <div className="flex flex-col">
                    <h3 className="font-black text-2xl tracking-tighter text-white leading-none mb-1">{card.title}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.1em] leading-snug ${
                      isHighlighted ? 'text-blue-300' : 'text-gray-500'
                    }`}>
                      {card.subtitle}
                    </p>
                 </div>
               </div>
            </div>

            {/* Metrics Section */}
            <div className="space-y-6 flex-1">
              {card.metrics?.map((m, mIdx) => (
                <div key={mIdx}>
                  {/* COLORED KEYWORDS (GOAL, FOCUS, OUTCOME) */}
                  <div className={`text-[11px] uppercase tracking-[0.15em] font-black mb-1.5 ${
                    isHighlighted ? 'text-[#008dd8]' : 'text-blue-400/60'
                  }`}>
                    {m.label}
                  </div>
                  {/* METRIC VALUES */}
                  <div className={`text-[14px] font-medium leading-relaxed ${
                    isHighlighted ? 'text-gray-100' : 'text-gray-300'
                  }`} dangerouslySetInnerHTML={{ __html: m.value }} />
                </div>
              ))}
            </div>
            
          </div>
        );
      })}
    </div>
  );
};
export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const docSnap = await getDoc(doc(db, 'blog_posts', slug));

  if (!docSnap.exists()) notFound(); 
  const post = docSnap.data();

  const tags = [];
  if (post.serviceTag && post.serviceTag !== 'general') tags.push(post.serviceTag.toUpperCase());
  if (post.industryTag && post.industryTag !== 'none') tags.push(post.industryTag.charAt(0).toUpperCase() + post.industryTag.slice(1));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.hero?.title,
    "description": post.hero?.description,
    "author": { "@type": "Person", "name": post.authorInfo?.name, "url": post.authorInfo?.profileUrl },
    "datePublished": post.hero?.publishDate,
    "dateModified": post.hero?.updatedDate || post.hero?.publishDate,
  };

  const faqSchema = post.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-[#0A101D] min-h-screen relative">
      <GlobalHeader />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-50">
        <div className="h-full bg-[#008dd8]" style={{ width: 'var(--scroll-width, 0%)' }} id="progress-bar"></div>
      </div>
      <script dangerouslySetInnerHTML={{__html: `window.addEventListener('scroll', () => { document.getElementById('progress-bar').style.setProperty('--scroll-width', (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 + '%'); });`}} />

      <main className="pt-[140px] pb-24 max-w-[1000px] mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
        
        <article className="flex-1 w-full space-y-12 md:space-y-16">
          
          <header className="space-y-6 border-b border-gray-200 pb-10">
            {tags.length > 0 && (
              <div className="flex gap-2 mb-4">
                {tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 border border-gray-200 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tighter text-[#0A101D] leading-[1.05]">{post.hero?.title}</h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-3xl">{post.hero?.description}</p>
            <div className="flex flex-wrap gap-4 items-center text-xs font-mono uppercase tracking-widest text-gray-500 font-bold pt-4">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0A101D] rounded-full flex items-center justify-center text-white shadow-sm">{post.authorInfo?.name?.charAt(0)}</div>
                <Link href={post.authorInfo?.profileUrl || '#'} className="hover:text-[#008dd8] text-[#0A101D]">{post.authorInfo?.name}</Link>
              </span>
              <span>•</span><span>{post.hero?.publishDate}</span><span>•</span><span className="text-[#008dd8]">{post.hero?.readTime}</span>
            </div>
          </header>

          {post.tldr && post.tldr.length > 0 && post.tldr[0] !== "" && (
            <section className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#008dd8] mb-5">TL;DR Summary</h2>
              <ul className="space-y-3">
                {post.tldr.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-800 font-medium">
                    <span className="text-[#0A101D] font-black mt-0.5">→</span> 
                    <span dangerouslySetInnerHTML={{ __html: point }} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {post.quickAnswer && (
            <section className="bg-[#0A101D] text-white p-8 md:p-10 rounded-[2rem] shadow-xl border-l-[6px] border-[#ccff00] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#008dd8]/20 blur-[50px] rounded-full pointer-events-none"></div>
              <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 mb-4 relative z-10">AEO Snippet Target</h2>
              <div className="text-xl font-medium leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: post.quickAnswer }} />
            </section>
          )}

          {post.intro && post.intro.length > 0 && post.intro[0] !== "" && (
            <section className="space-y-6 text-gray-700 text-lg leading-relaxed font-medium">
              {post.intro.map((para, i) => <div key={i} dangerouslySetInnerHTML={{ __html: para }} />)}
            </section>
          )}

          {post.sections && post.sections.map((sec, i) => (
            <section key={i} id={sec.id} className="space-y-6 pt-8 scroll-mt-32">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[#0A101D]">{sec.heading}</h2>
              
              {sec.contentType === 'definition' && sec.content[0] && (
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-900 font-bold mb-6 text-lg" dangerouslySetInnerHTML={{ __html: sec.content[0] }} />
              )}

              {sec.content?.map((para, idx) => {
                if (sec.contentType === 'definition' && idx === 0) return null;
                if (!para) return null;
                return <div key={idx} className="text-gray-700 text-lg leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: para }} />;
              })}

              {sec.list && sec.list.length > 0 && sec.list[0] !== "" && (
                <ul className={`space-y-4 pl-2 pt-4 ${sec.contentType === 'howto' ? 'list-decimal ml-6 font-bold text-[#0A101D] text-lg' : ''}`}>
                  {sec.list.map((item, idx) => (
                    <li key={idx} className={`leading-relaxed ${sec.contentType === 'howto' ? 'pl-2' : 'flex items-start gap-3'}`}>
                      {sec.contentType !== 'howto' && <span className="text-[#008dd8] font-black mt-1">✓</span>}
                      <span className={sec.contentType !== 'howto' ? "text-gray-700 font-medium text-lg" : "block mt-1 font-medium text-gray-600 text-lg"} dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              )}

              {/* RENDER H2 SAAS CARDS */}
              {renderComparisonCards(sec.comparison)}

              {sec.subheadings?.map((sub, idx) => (
                <div key={idx} className="pt-8 space-y-5">
                  <h3 className="text-2xl font-black tracking-tight text-[#0A101D]">{sub.title}</h3>
                  {sub.content?.map((para, pIdx) => para && <div key={pIdx} className="text-gray-700 text-lg leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: para }} />)}
                  
                  {/* H3 Lists Render */}
                  {sub.list && sub.list.length > 0 && sub.list[0] !== "" && (
                    <ul className="space-y-3 pl-2 pt-2">
                      {sub.list.map((item, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-3 leading-relaxed">
                          <span className="text-[#ccff00] font-black mt-1">✓</span>
                          <span className="text-gray-700 font-medium text-lg" dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* RENDER H3 SAAS CARDS */}
                  {renderComparisonCards(sub.comparison)}
                </div>
              ))}
            </section>
          ))}

          {/* REDESIGNED DARK PREMIUM CTA BLOCK */}
          {post.toolBlock && post.toolBlock.title && (
            <section className="bg-[#0A101D] border border-gray-800 p-10 md:p-14 rounded-[2.5rem] text-center mt-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#ccff00]/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-[#008dd8]/20 blur-[60px] rounded-full pointer-events-none"></div>
              
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-4 relative z-10">{post.toolBlock.title}</h2>
              <p className="text-gray-400 font-medium mb-10 max-w-lg mx-auto relative z-10 text-lg">{post.toolBlock.description}</p>
              
              <Link href={post.toolBlock.ctaLink} className="relative z-10 inline-flex items-center gap-2 bg-[#ccff00] text-[#0A101D] px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#b3e600] transition-all active:scale-95 shadow-[0_10px_30px_rgba(204,255,0,0.2)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                {post.toolBlock.ctaText}
              </Link>
            </section>
          )}

          {post.faqs && post.faqs.length > 0 && post.faqs[0].question && (
            <section className="pt-16 border-t border-gray-200 space-y-6">
              <h2 className="text-3xl font-black tracking-tighter text-[#0A101D]">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details key={i} className="group border border-gray-200 bg-white rounded-2xl [&_summary::-webkit-details-marker]:hidden cursor-pointer shadow-sm hover:border-[#008dd8]/30 transition-colors">
                    <summary className="flex items-center justify-between p-6 font-bold text-lg text-gray-900">
                      {faq.question}
                      <span className="transition group-open:rotate-180 text-[#008dd8]">
                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 font-medium leading-relaxed mt-[-10px]" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </details>
                ))}
              </div>
            </section>
          )}

        </article>

        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit max-h-[80vh] overflow-y-auto no-scrollbar pt-6">
          <div className="border-l-2 border-gray-100 pl-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Architecture Index</h3>
            <ul className="space-y-4 text-sm font-bold">
              {post.sections?.map((sec, i) => sec.heading && (
                <li key={i}>
                  <a href={`#${sec.id}`} className="text-gray-500 hover:text-[#008dd8] transition-colors block">{sec.heading}</a>
                  {sec.subheadings?.length > 0 && (
                    <ul className="pl-4 mt-3 space-y-3 border-l-2 border-gray-100 ml-2">
                      {sec.subheadings.map((sub, idx) => sub.title && (
                        <li key={idx}><a href={`#${sec.id}`} className="text-gray-400 hover:text-[#0A101D] font-medium text-[12px]">{sub.title}</a></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="mt-10 pt-8 border-t border-gray-100">
               <Link href="/free-audit" className="flex items-center justify-center gap-2 w-full bg-[#ccff00] text-[#0A101D] py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#b3e600] transition-all shadow-md">
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 Initiate Sequence
               </Link>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}