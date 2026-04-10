import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

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
  
  // --- THE FIX: Look specifically for the split DIY fields you mentioned ---
  // Checking common variations (camelCase, snake_case) just to be safe!
  const diyPara = page.diySeoPara || page.diy_seo_para || page.diyGuidePara || null;
  const diySteps = page.diySeoSteps || page.diy_seo_steps || page.diyGuideSteps || [];
  
  // Fallback in case you still use a single rich-text editor somewhere else
  const articleContent = page.diyGuide || page.content || page.body || null;

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-black min-h-screen">
      <GlobalHeader />

      <main className="pb-16 md:pb-24">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="relative px-6 pt-[120px] md:pt-[140px] pb-16 md:pb-24 border-b border-gray-200 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="max-w-4xl mx-auto relative z-10 text-left">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
              Industry Module: {page.niche || 'Business'}
            </span>
            <h1 className="text-5xl md:text-7xl leading-[0.95] font-black tracking-tighter uppercase text-gray-900 mb-8">
              {page.h1 || 'Dominant Search Architecture'}
            </h1>
            <div className="text-lg md:text-2xl text-gray-600 font-medium leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: page.subheadline || '' }} />
            
            <Link href="/free-audit" className="inline-block w-full md:w-auto text-center bg-gray-900 text-[#ccff00] px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              Get a Free Audit
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 space-y-16 md:space-y-24 mt-16 md:mt-20">
          
          {/* --- 2. TL;DR / EXECUTIVE SUMMARY --- */}
          {page.tldr && (
            <section className="bg-white border-2 border-gray-100 p-8 md:p-12 rounded-[2rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#ccff00]"></div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">TL;DR //</h2>
              <div className="text-lg md:text-xl text-gray-800 font-bold leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: page.tldr }} />
            </section>
          )}

          {/* --- 3. DELIVERABLES (The Stack) --- */}
          <section>
            <div className="mb-10 border-b border-gray-200 pb-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-tight mb-4">
                {page.stackHeading || `The ${safeService} Architecture`}
              </h2>
              <p className="text-gray-500 font-medium text-lg max-w-2xl">
                Everything engineered into our proprietary {safeService} systems for the {page.niche} sector.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {(page.deliverables || []).map((item, i) => (
                <div key={i} className="bg-white p-8 border-2 border-gray-100 rounded-3xl hover:border-blue-500 transition-all">
                  <div className="text-lg text-gray-800 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: item || '' }} />
                </div>
              ))}
            </div>
          </section>

          {/* --- 4. PROCESS --- */}
          <section className="bg-gray-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-12">System Deployment</h2>
              <div className="space-y-6">
                {(page.steps || []).map((step, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl bg-[#ccff00] text-black font-black text-xl shadow-[0_0_15px_rgba(204,255,0,0.2)]">{i + 1}</div>
                    <div className="text-lg font-medium text-gray-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: step || '' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- 5. DIY / EEAT GUIDE (Fixed for split paragraph & steps) --- */}
          {(diyPara || (diySteps && diySteps.length > 0) || articleContent) && (
            <section className="bg-white border-2 border-gray-100 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-sm">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-10 border-b-2 border-gray-100 pb-8">
                  The Blueprint.
                </h2>
                
                {/* Renders the diySeoPara */}
                {diyPara && (
                  <div className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: diyPara }} />
                )}

                {/* Renders the diySeoSteps Array */}
                {diySteps && diySteps.length > 0 && (
                  <div className="space-y-8 mb-10">
                    {diySteps.map((step, i) => (
                      <div key={i} className="flex gap-5 items-start">
                        <div className="w-10 h-10 flex-shrink-0 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-lg mt-1">
                          {i + 1}
                        </div>
                        <div className="text-lg text-gray-600 font-medium leading-relaxed pt-1" dangerouslySetInnerHTML={{ __html: step?.step || step || '' }} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback just in case you use a single rich text editor on other pages */}
                {articleContent && !diyPara && (!diySteps || diySteps.length === 0) && (
                  <div 
                    className="text-lg text-gray-600 leading-relaxed 
                               [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:font-black [&>h2]:text-gray-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:tracking-tighter [&>h2]:uppercase
                               [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:font-black [&>h3]:text-gray-900 [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:tracking-tight
                               [&>p]:mb-6 [&>p]:font-medium
                               [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul]:space-y-3 [&>ul]:font-medium
                               [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol]:space-y-3 [&>ol]:font-medium
                               [&>strong]:text-gray-900 [&>strong]:font-black
                               [&>a]:text-blue-600 [&>a]:underline [&>a]:font-bold [&>a]:decoration-2 [&>a]:underline-offset-4"
                    dangerouslySetInnerHTML={{ __html: articleContent }} 
                  />
                )}
              </div>
            </section>
          )}

          {/* --- 6. KEYWORD DATA TABLE --- */}
          {page.keywords && page.keywords.some(k => k.kw) && (
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Target Intelligence</h2>
              <div className="rounded-3xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b-2 border-gray-100">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">Keyword Entity</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center whitespace-nowrap">Search Vol.</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center whitespace-nowrap">Diff. (KD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-50">
                      {page.keywords.map((item, i) => item.kw ? (
                        <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-6 text-base font-bold text-gray-900 whitespace-nowrap">{item.kw}</td>
                          <td className="p-6 text-base text-center text-blue-600 font-black whitespace-nowrap">{item.vol}</td>
                          <td className="p-6 text-base text-center text-lime-600 font-black whitespace-nowrap">{item.kd}</td>
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
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Common Queries</h2>
              <div className="space-y-4">
                {page.faqs.map((faq, i) => (
                  <div key={i} className="bg-white border-2 border-gray-100 p-8 rounded-3xl hover:border-blue-200 transition-all shadow-sm">
                    <h3 className="font-black text-gray-900 mb-3 text-lg md:text-xl">Q: {faq?.q || ''}</h3>
                    <div className="text-base md:text-lg text-gray-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: faq?.a || '' }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* --- 8. FINAL CTA --- */}
          <section className="py-16 md:py-24 text-center border-t border-gray-200">
            <h2 className="text-5xl md:text-[6vw] font-black tracking-tighter uppercase leading-none mb-8">
              Ready to <br/> <span className="text-blue-600">Scale?</span>
            </h2>
            <div className="text-lg md:text-xl text-gray-600 font-medium mb-12 max-w-xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: page.ctaText || '' }} />
            <Link href="/free-audit" className="inline-block w-full md:w-auto bg-[#ccff00] text-gray-900 px-12 py-6 rounded-full font-black text-sm md:text-lg uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-2xl">
              Get a Free Audit
            </Link>
          </section>

        </div>
      </main>

      
    </div>
  );
}