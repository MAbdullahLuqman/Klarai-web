import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';

// 1. METADATA GENERATOR
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

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const docSnap = await getDoc(doc(db, 'blog_posts', slug));

  if (!docSnap.exists()) notFound(); 
  const post = docSnap.data();

  // --- 2. DYNAMIC SCHEMA GENERATION ---
  
  // A. Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.hero?.title,
    "description": post.hero?.description,
    "author": { "@type": "Person", "name": post.authorInfo?.name, "url": post.authorInfo?.profileUrl },
    "datePublished": post.hero?.publishDate,
    "dateModified": post.hero?.updatedDate || post.hero?.publishDate,
  };

  // B. Breadcrumb Schema
  const breadcrumbSchema = post.breadcrumbs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": post.breadcrumbs.map((bc, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": bc.name,
      "item": `https://klarai.com${bc.url}`
    }))
  } : null;

  // C. FAQ Schema
  const faqSchema = post.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  // D. Conditional Schema (HowTo / DefinedTerm)
  let conditionalSchemas = [];
  post.sections?.forEach(sec => {
    if (sec.contentType === 'howto') {
      conditionalSchemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": sec.heading,
        "step": sec.list?.map((step, i) => ({
          "@type": "HowToStep",
          "url": `#${sec.id}`,
          "name": `Step ${i + 1}`,
          "itemListElement": [{ "@type": "HowToDirection", "text": step }]
        })) || []
      });
    }
  });

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-[#0A101D] min-h-screen relative">
      <GlobalHeader />
      
      {/* INJECT ALL SCHEMAS */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {conditionalSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* PROGRESS BAR (CSS Only Sticky implementation) */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-50">
        <div className="h-full bg-[#008dd8]" style={{ width: 'var(--scroll-width, 0%)' }} id="progress-bar"></div>
      </div>
      <script dangerouslySetInnerHTML={{__html: `window.addEventListener('scroll', () => { document.getElementById('progress-bar').style.setProperty('--scroll-width', (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 + '%'); });`}} />

      {/* MAIN LAYOUT GRID */}
      <main className="pt-[140px] pb-24 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
        
        {/* LEFT COLUMN: THE CONTENT (Locked to 800px max for readability) */}
        <article className="flex-1 w-full max-w-[800px] space-y-12 md:space-y-16 mx-auto lg:mx-0">
          
          {/* 1. Breadcrumbs */}
          {post.breadcrumbs && (
            <nav className="flex gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 overflow-x-auto pb-2">
              {post.breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <Link href={bc.url} className="hover:text-[#008dd8] transition-colors">{bc.name}</Link>
                  {i < post.breadcrumbs.length - 1 && <span>/</span>}
                </span>
              ))}
            </nav>
          )}

          {/* 2. Hero Section */}
          <header className="space-y-6 border-b border-gray-200 pb-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0A101D] leading-[1.1]">{post.hero?.title}</h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed">{post.hero?.description}</p>
            <div className="flex flex-wrap gap-4 items-center text-xs font-mono uppercase tracking-widest text-gray-500 font-bold pt-4">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white">{post.authorInfo?.name?.charAt(0)}</div>
                <Link href={post.authorInfo?.profileUrl || '#'} className="hover:text-[#008dd8]">{post.authorInfo?.name}</Link>
              </span>
              <span>•</span>
              <span>{post.hero?.publishDate}</span>
              <span>•</span>
              <span>{post.hero?.readTime} Read</span>
            </div>
          </header>

          {/* 3. TLDR Block */}
          {post.tldr && post.tldr.length > 0 && (
            <section className="bg-gray-50 border-2 border-gray-200 p-6 md:p-8 rounded-2xl">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#008dd8] mb-4">TL;DR Summary</h2>
              <ul className="space-y-3">
                {post.tldr.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-800 font-medium">
                    <span className="text-[#0A101D] font-black mt-0.5">→</span> {point}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Quick Answer (AEO Snippet) */}
          {post.quickAnswer && (
            <section className="bg-[#0A101D] text-white p-6 md:p-8 rounded-2xl shadow-xl border-l-4 border-[#008dd8]">
              {/* <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3"></h2> */}
              <p className="text-lg font-bold leading-relaxed">{post.quickAnswer}</p>
            </section>
          )}

          {/* 5. Intro */}
          {post.intro && post.intro.length > 0 && (
            <section className="space-y-5 text-gray-700 text-[17px] leading-relaxed font-medium">
              {post.intro.map((para, i) => <p key={i}>{para}</p>)}
            </section>
          )}

          {/* 6. Dynamic Content Sections */}
          {post.sections && post.sections.map((sec, i) => (
            <section key={i} id={sec.id} className="space-y-6 pt-6 scroll-mt-32">
              <h2 className="text-3xl font-black tracking-tight text-[#0A101D]">{sec.heading}</h2>
              
              {/* Content Type specific rendering */}
              {sec.contentType === 'definition' && (
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-blue-900 font-bold mb-6">
                  {sec.content[0]}
                </div>
              )}

              {sec.content?.map((para, idx) => (
                <p key={idx} className="text-gray-700 text-[17px] leading-relaxed font-medium">{para}</p>
              ))}

              {sec.list && sec.list.length > 0 && (
                <ul className={`space-y-3 pl-2 ${sec.contentType === 'howto' ? 'list-decimal ml-5 font-bold text-gray-900' : ''}`}>
                  {sec.list.map((item, idx) => (
                    <li key={idx} className={`text-[17px] leading-relaxed ${sec.contentType === 'howto' ? 'mb-4' : 'flex items-start gap-3'}`}>
                      {sec.contentType !== 'howto' && <span className="text-[#008dd8] font-black mt-0.5">✓</span>}
                      <span className={sec.contentType !== 'howto' ? "text-gray-700 font-medium" : "block mt-1 font-medium text-gray-600"}>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Subheadings H3 */}
              {sec.subheadings?.map((sub, idx) => (
                <div key={idx} className="pt-6 space-y-4">
                  <h3 className="text-xl font-black text-[#0A101D]">{sub.title}</h3>
                  {sub.content?.map((para, pIdx) => <p key={pIdx} className="text-gray-700 text-[17px] leading-relaxed font-medium">{para}</p>)}
                </div>
              ))}
            </section>
          ))}

          {/* 7. The Tool Block (Klarai Big Advantage) */}
          {post.toolBlock && post.toolBlock.title && (
            <section className="bg-gradient-to-r from-[#0A101D] to-[#1a2b4c] text-white p-8 md:p-10 rounded-3xl shadow-2xl text-center">
              <h2 className="text-2xl font-black mb-3">{post.toolBlock.title}</h2>
              <p className="text-gray-300 font-medium mb-8 max-w-md mx-auto">{post.toolBlock.description}</p>
              <Link href={post.toolBlock.ctaLink} className="inline-block bg-white text-[#0A101D] px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-xl">
                {post.toolBlock.ctaText}
              </Link>
            </section>
          )}

          {/* 8. FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="pt-10 border-t border-gray-200 space-y-6">
              <h2 className="text-3xl font-black tracking-tight text-[#0A101D]">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details key={i} className="group border-2 border-gray-100 bg-white rounded-2xl [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                    <summary className="flex items-center justify-between p-6 font-black text-lg text-gray-900">
                      {faq.question}
                      <span className="transition group-open:rotate-180 text-[#008dd8]">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <p className="px-6 pb-6 text-gray-600 font-medium leading-relaxed mt-[-10px]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* 9. Author Section (E-E-A-T) */}
          {post.authorInfo && post.authorInfo.name && (
            <section className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left bg-gray-50 p-8 rounded-3xl">
              <div className="w-24 h-24 bg-[#0A101D] text-white rounded-full flex items-center justify-center font-black text-3xl shrink-0 shadow-lg">
                {post.authorInfo.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{post.authorInfo.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#008dd8] mb-4">{post.authorInfo.role}</p>
                <p className="text-gray-600 font-medium leading-relaxed mb-4 text-sm">{post.authorInfo.bio}</p>
                <Link href={post.authorInfo.profileUrl} className="text-xs font-bold uppercase tracking-widest border-b-2 border-gray-300 hover:border-[#0A101D] transition-colors pb-1">View Full Profile</Link>
              </div>
            </section>
          )}
        </article>

        {/* RIGHT COLUMN: STICKY TABLE OF CONTENTS (Desktop Only) */}
        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-32 h-fit max-h-[80vh] overflow-y-auto no-scrollbar">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-5 border-b border-gray-100 pb-3">Table of Contents</h3>
            <ul className="space-y-3 text-sm font-bold">
              {post.sections?.map((sec, i) => (
                <li key={i}>
                  <a href={`#${sec.id}`} className="text-gray-600 hover:text-[#008dd8] transition-colors block">{sec.heading}</a>
                  {sec.subheadings?.length > 0 && (
                    <ul className="pl-4 mt-2 space-y-2 border-l-2 border-gray-100 ml-2">
                      {sec.subheadings.map((sub, idx) => (
                        <li key={idx}><a href={`#${sec.id}`} className="text-gray-400 hover:text-[#0A101D] font-medium text-[13px]">{sub.title}</a></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-6 border-t border-gray-100">
               <Link href="/free-audit" className="block w-full text-center bg-[#0A101D] text-white py-3 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-[#008dd8] transition-colors">
                 Get Free System Audit
               </Link>
            </div>
          </div>
        </aside>

        {/* MOBILE STICKY CTA */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-40">
          <Link href="/free-audit" className="block w-full text-center bg-[#008dd8] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl">
            Get Free System Audit
          </Link>
        </div>

      </main>
    </div>
  );
}