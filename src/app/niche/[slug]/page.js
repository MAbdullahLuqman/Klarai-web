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
  const faqsList = page.faqs || [];

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-black min-h-screen">
      <GlobalHeader />

      <main className="pt-24 md:pt-32 pb-24">
        
        {/* --- HERO SECTION: Clean & Bold --- */}
        <section className="relative px-6 py-16 md:py-24 border-b border-gray-200 overflow-hidden">
          {/* Architectural Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
            <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
              Industry Module: {page.niche || 'Business'}
            </span>
            <h1 className="text-[12vw] md:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase text-gray-900 mb-8">
              {page.h1 || ''}
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed mb-10" 
               dangerouslySetInnerHTML={{ __html: page.subheadline || '' }} />
            
            <Link href="/free-audit" className="inline-block bg-gray-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10">
              Initiate System Audit
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-6 space-y-24 mt-20">
          
          {/* TL;DR / EXECUTIVE SUMMARY */}
          {page.tldr && (
            <section className="bg-white border-2 border-gray-100 p-8 md:p-12 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#ccff00]"></div>
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-6">Executive Summary //</h2>
              <p className="text-xl md:text-2xl text-gray-800 font-bold leading-relaxed" 
                 dangerouslySetInnerHTML={{ __html: page.tldr }} />
            </section>
          )}

          {/* DELIVERABLES: Split Grid */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
              <h2 className="text-[10vw] md:text-[4vw] font-black tracking-tighter uppercase leading-none">The Stack.</h2>
              <p className="text-gray-500 font-medium max-w-xs">Everything included in our {safeService} architecture for {page.niche}.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(page.deliverables || []).map((item, i) => (
                <div key={i} className="bg-white p-8 border border-gray-100 rounded-3xl hover:border-blue-500 transition-all group flex items-start gap-4">
                  <span className="text-blue-500 font-mono text-xs font-bold pt-1">{i + 1}.0</span>
                  <span className="text-lg font-bold text-gray-900" dangerouslySetInnerHTML={{ __html: item || '' }} />
                </div>
              ))}
            </div>
          </section>

          {/* PROCESS: Dark Contrast Section */}
          <section className="bg-gray-900 rounded-[3rem] p-10 md:p-20 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">How It Works</h2>
              <div className="space-y-6">
                {(page.steps || []).map((step, i) => (
                  <div key={i} className="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-[#ccff00] text-black font-black text-xl shadow-[0_0_20px_rgba(204,255,0,0.3)]">{i + 1}</div>
                    <p className="text-lg font-medium text-gray-200" dangerouslySetInnerHTML={{ __html: step || '' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* KEYWORD DATA TABLE: Refined for Mobile */}
          {page.keywords && page.keywords.some(k => k.kw) && (
            <section>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Target Intelligence</h2>
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Keyword</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Volume</th>
                        <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {page.keywords.map((item, i) => item.kw ? (
                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                          <td className="p-6 font-bold text-gray-900">{item.kw}</td>
                          <td className="p-6 text-center text-blue-600 font-black">{item.vol}</td>
                          <td className="p-6 text-center text-lime-600 font-black">{item.kd}</td>
                        </tr>
                      ) : null)}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* FAQS: Clean Accordion Style */}
          <section>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Common Queries</h2>
            <div className="space-y-4">
              {(page.faqs || []).map((faq, i) => (
                <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] hover:border-blue-200 transition-all">
                  <h3 className="font-black text-gray-900 mb-3 text-lg">Q: {faq?.q || ''}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: faq?.a || '' }} />
                </div>
              ))}
            </div>
          </section>

          {/* FINAL CTA: High Conversion */}
          <section className="py-20 text-center border-t border-gray-200">
            <h2 className="text-[12vw] md:text-[7vw] font-black tracking-tighter uppercase leading-none mb-10">
              Ready to <br/> <span className="text-blue-600">Scale?</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium mb-12 max-w-xl mx-auto" 
               dangerouslySetInnerHTML={{ __html: page.ctaText || '' }} />
            <Link href="/free-audit" className="inline-block bg-gray-900 text-[#ccff00] px-12 py-6 rounded-full font-black text-lg uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
              Initiate System Audit
            </Link>
          </section>

        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}