import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
  
  const safeService = page.service || 'SEO';
  const nicheName = page.niche || 'Business';

  // DIY Fields Check
  const diyPara = page.diySeoPara || page.diy_seo_para || page.diyGuidePara || null;
  const diySteps = page.diySeoSteps || page.diy_seo_steps || page.diyGuideSteps || [];
  const articleContent = page.diyGuide || page.content || page.body || null;

  // Typography definitions for extreme readability
  const brutalityH2 = "text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight mb-6 md:mb-8 text-left text-[#0A101D]";
  const bodyText = "text-base md:text-lg text-gray-600 font-medium leading-relaxed text-left";

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-[#0A101D] min-h-screen">
      <GlobalHeader />

      <main className="pb-16 md:pb-24">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="relative px-6 pt-[120px] md:pt-[160px] pb-16 md:pb-24 border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-blue-300/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-4xl mx-auto relative z-10 text-left">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
              Industry Module: {nicheName}
            </span>
            <h1 className="text-4xl md:text-7xl leading-[1.1] md:leading-[0.95] font-black tracking-tighter uppercase text-[#0A101D] mb-6 md:mb-8 text-left">
              {page.h1 || 'Dominant Search Architecture'}
            </h1>
            <div className="text-lg md:text-2xl text-gray-600 font-medium leading-relaxed mb-8 md:mb-10 text-left" dangerouslySetInnerHTML={{ __html: page.subheadline || '' }} />
            
            <div className="flex justify-start w-full">
              <Link href="/free-audit" className="inline-flex bg-[#0A101D] text-white px-10 py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:bg-[#008dd8] transition-all shadow-[0_8px_20px_rgba(10,16,29,0.2)] hover:shadow-[0_8px_25px_rgba(0,141,216,0.4)] active:scale-95 items-center justify-center gap-2 w-full md:w-max">
                  GET A FREE AUDIT
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-16 md:space-y-24 mt-12 md:mt-20">
          
          {/* --- 2. EXECUTIVE SUMMARY (TL;DR) --- */}
          {page.tldr && (
            <section className="bg-white border-2 border-gray-200 p-6 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#008dd8]"></div>
              <h2 className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 md:mb-6 text-left">TL;DR / Executive Summary //</h2>
              <div className="text-lg md:text-2xl text-[#0A101D] font-bold leading-relaxed space-y-4 text-left" dangerouslySetInnerHTML={{ __html: page.tldr }} />
            </section>
          )}

          {/* --- 3. DELIVERABLES (The Stack) --- */}
          <section>
            <div className="mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-8 text-left">
              <h2 className={brutalityH2}>
                {page.stackHeading || `The ${safeService} Architecture`}
              </h2>
              <p className={bodyText}>
                Everything engineered into our proprietary {safeService} systems for the {nicheName} sector.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {(page.deliverables || []).map((item, i) => (
                <div key={i} className="bg-white p-6 md:p-8 border-2 border-gray-200 rounded-[1.5rem] md:rounded-[2rem] hover:border-[#008dd8] transition-all group shadow-sm text-left">
                  <div className={bodyText} dangerouslySetInnerHTML={{ __html: item || '' }} />
                </div>
              ))}
            </div>
          </section>

          {/* --- 4. PROCESS --- */}
          <section className="bg-[#0A101D] rounded-[2rem] md:rounded-[3rem] p-6 md:p-20 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(10,16,29,0.2)]">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="relative z-10 text-left">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-10 md:mb-12 text-left">System Deployment</h2>
              <div className="space-y-4 md:space-y-6">
                {(page.steps || []).map((step, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2rem] backdrop-blur-md">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-xl md:rounded-2xl bg-[#008dd8] text-white font-black text-lg md:text-xl shadow-[0_0_15px_rgba(0,141,216,0.3)]">{i + 1}</div>
                    <div className="text-base md:text-lg font-medium text-gray-300 leading-relaxed text-left pt-1" dangerouslySetInnerHTML={{ __html: step || '' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- 5. DIY / EEAT GUIDE --- */}
          {(diyPara || (diySteps && diySteps.length > 0) || articleContent) && (
            <section className="bg-white border-2 border-gray-200 p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-left">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight mb-8 md:mb-10 border-b-2 border-gray-100 pb-6 md:pb-8 text-left text-[#0A101D]">
                  The Blueprint.
                </h2>
                
                {diyPara && (
                  <div className={bodyText + " mb-8 md:mb-10"} dangerouslySetInnerHTML={{ __html: diyPara }} />
                )}

                {diySteps && diySteps.length > 0 && (
                  <div className="space-y-6 md:space-y-8 mb-10 text-left">
                    {diySteps.map((step, i) => (
                      <div key={i} className="flex gap-4 md:gap-5 items-start">
                        <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-[#0A101D] text-white rounded-full flex items-center justify-center font-black text-sm md:text-lg mt-1 shadow-md">
                          {i + 1}
                        </div>
                        <div className={bodyText + " pt-1 md:pt-1.5"} dangerouslySetInnerHTML={{ __html: step?.step || step || '' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Highly readable typography for article injection */}
                {articleContent && !diyPara && (!diySteps || diySteps.length === 0) && (
                  <div 
                    className="text-base md:text-lg text-gray-600 leading-relaxed text-left font-medium
                               [&>h2]:text-2xl [&>h2]:md:text-4xl [&>h2]:font-black [&>h2]:text-[#0A101D] [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:tracking-tighter [&>h2]:uppercase [&>h2]:leading-tight
                               [&>h3]:text-xl [&>h3]:md:text-3xl [&>h3]:font-black [&>h3]:text-[#0A101D] [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:tracking-tight [&>h3]:leading-snug
                               [&>p]:mb-6
                               [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-8 [&>ul]:space-y-3
                               [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-8 [&>ol]:space-y-3
                               [&>strong]:text-[#0A101D] [&>strong]:font-black
                               [&>a]:text-[#008dd8] [&>a]:underline [&>a]:font-bold [&>a]:decoration-2 [&>a]:underline-offset-4"
                    dangerouslySetInnerHTML={{ __html: articleContent }} 
                  />
                )}
              </div>
            </section>
          )}

          {/* --- 6. KEYWORD DATA TABLE --- */}
          {page.keywords && page.keywords.some(k => k.kw) && (
            <section className="text-left">
              <h2 className={brutalityH2}>Target Intelligence</h2>
              <div className="rounded-2xl md:rounded-[2rem] border-2 border-gray-200 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Keyword Entity</th>
                        <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center whitespace-nowrap">Search Vol.</th>
                        <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center whitespace-nowrap">Diff. (KD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                      {page.keywords.map((item, i) => item.kw ? (
                        <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 md:p-6 text-sm md:text-base font-bold text-[#0A101D] whitespace-nowrap text-left">{item.kw}</td>
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

          {/* --- 7. FAQS --- */}
          {page.faqs && page.faqs.some(faq => faq.q) && (
            <section className="text-left">
              <h2 className={brutalityH2}>Common Queries</h2>
              <div className="space-y-4">
                {page.faqs.map((faq, i) => (
                  <div key={i} className="bg-white border-2 border-gray-200 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl hover:border-blue-200 transition-all shadow-sm">
                    <h3 className="font-black text-[#0A101D] mb-3 text-lg md:text-xl text-left leading-snug">Q: {faq?.q || ''}</h3>
                    <div className={bodyText} dangerouslySetInnerHTML={{ __html: faq?.a || '' }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- 8. ABOUT THE AUTHOR/ARCHITECT --- */}
          {page.authorName && (
             <section className="bg-white border-2 border-gray-200 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-start gap-6 md:gap-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-[1.2rem] md:rounded-3xl flex items-center justify-center font-black text-3xl md:text-4xl text-[#0A101D] flex-shrink-0 border border-gray-200">
                    {page.authorName.charAt(0)}
                </div>
                <div className="flex-1 text-left w-full">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1 text-[#0A101D]">{page.authorName}</h3>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 mb-4 md:mb-5">{page.authorRole || 'Lead Architect'}</p>
                    <div className={bodyText + " mb-6 md:mb-8"} dangerouslySetInnerHTML={{ __html: page.authorBio || '' }} />
                    
                    {/* FIXED: Solid LinkedIn Button spanning mobile, matching About page */}
                    <div className="pt-6 border-t-2 border-gray-100">
                        <Link 
                          href={page.authorLinkedin || 'https://linkedin.com'} 
                          className="block md:inline-block w-full md:w-auto text-center bg-[#0A66C2] text-white px-6 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:bg-[#004182] transition-colors shadow-md active:scale-95"
                        >
                           LinkedIn
                        </Link>
                    </div>
                </div>
             </section>
          )}

          {/* --- 9. FINAL CTA --- */}
          <section className="py-16 md:py-24 border-t border-gray-200 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[1.1] md:leading-none mb-6 md:mb-8 text-[#0A101D]">
              Ready to <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-[#0A101D]">Scale?</span>
            </h2>
            <div className="text-base md:text-xl text-gray-600 font-medium mb-10 md:mb-12 max-w-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: page.ctaText || '' }} />
            
            <div className="w-full flex justify-center md:justify-start">
              <Link href="/free-audit" className="inline-flex bg-[#0A101D] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[12px] md:text-[14px] shadow-[0_8px_20px_rgba(10,16,29,0.2)] hover:bg-[#008dd8] transition-all active:scale-95 items-center justify-center w-full md:w-auto">
                  GET A FREE AUDIT
              </Link>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}