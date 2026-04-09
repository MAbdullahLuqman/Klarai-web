"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';

export default function ServicePageTemplate({ data }) {
  const isVisible = (sectionData) => sectionData?.visible !== false && sectionData?.visible !== 'false';

  // SAFE DATA PARSING
  const bullets = (data?.definition?.bullets || '').split('\n').filter(b => b.trim() !== '');
  const includedItems = (data?.included?.items || '').split('\n').filter(i => i.trim() !== '');
  const processSteps = (data?.process?.steps || '').split('\n').filter(s => s.trim() !== '');
  
  const rawCaseStudy = (data?.results?.caseStudy || '').split('|').map(s => s.trim());
  const caseStudyParts = [rawCaseStudy[0] || '', rawCaseStudy[1] || '', rawCaseStudy[2] || ''];
  const faqs = (data?.faq?.qas || '').split('\n').filter(q => q.trim() !== '').map(qa => (qa || '').split('|'));

  const parsePricing = (tierStr) => {
    const parts = (tierStr || '').split('|');
    let name = 'Tier', price = '£?', link = '#cta', featuresStr = '';
    if (parts.length === 3) { name = parts[0]; price = parts[1]; featuresStr = parts[2]; } 
    else if (parts.length >= 4) { name = parts[0]; price = parts[1]; link = parts[2]; featuresStr = parts[3]; }
    const features = (featuresStr || '').split(',').map(f => f.trim()).filter(f => f !== '');
    return { name, price, link, features };
  };

  const starterPlan = parsePricing(data?.pricing?.starter);
  const growthPlan = parsePricing(data?.pricing?.growth);
  const premiumPlan = parsePricing(data?.pricing?.premium);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(([q, a]) => ({ "@type": "Question", "name": q || '', "acceptedAnswer": { "@type": "Answer", "text": a || '' } }))
  };

  // 3D SCROLL EFFECTS
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-cyan-300 selection:text-black min-h-screen overflow-hidden">
      <GlobalHeader />
      {isVisible(data?.faq) && faqs.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="pt-32 pb-24 space-y-32">
        
        {/* HERO */}
        {isVisible(data?.hero) && (
          <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6" style={{ perspective: '1000px' }}>
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px]"></div>
            </div>
            
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
                {data?.hero?.h1}
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-500 font-medium max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data?.hero?.sub || '' }} />
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <Link href={data?.hero?.btn1Link || "/#audit"} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-[0_15px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_40px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all">
                  {data?.hero?.btn1Text || "Get Your Free Audit"}
                </Link>
                <Link href={data?.hero?.btn2Link || "#what-is"} className="bg-white border-2 border-gray-200 text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1 transition-all shadow-sm">
                  {data?.hero?.btn2Text || "See How It Works"}
                </Link>
              </div>
              <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-black tracking-widest uppercase text-gray-400">
                {(data?.hero?.trust || '').split('|').map((badge, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>{badge.trim()}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* DEFINITION */}
        {isVisible(data?.definition) && (
          <section id="what-is" className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-6">{data?.definition?.h2}</h2>
              <p className="text-lg text-gray-500 leading-relaxed font-medium mb-8" dangerouslySetInnerHTML={{ __html: data?.definition?.para || '' }} />
            </div>
            <div className="bg-white p-10 rounded-3xl border-2 border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <ul className="space-y-6 relative z-10">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-black">✓</span>
                    <span className="text-lg font-bold text-gray-700" dangerouslySetInnerHTML={{ __html: bullet }} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* INCLUDED */}
        {isVisible(data?.included) && (
          <section className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-12 text-center">{data?.included?.h2}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedItems.map((item, idx) => {
                const [title, desc] = item.split(':');
                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)] hover:-translate-y-2 hover:border-cyan-200 transition-all duration-300"
                  >
                    <h3 className="text-xl font-black text-gray-900 mb-3">{title?.trim()}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: desc?.trim() || '' }} />
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* PROCESS (3D Entrance) */}
        {isVisible(data?.process) && (
          <section className="max-w-6xl mx-auto px-6" style={{ perspective: '1200px' }}>
            <div className="bg-gray-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white mb-12 text-center">{data?.process?.h2}</h2>
                <div className="grid md:grid-cols-2 gap-10">
                  {processSteps.map((step, idx) => {
                    const [title, desc] = step.split(':');
                    return (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, rotateX: -20 }}
                        whileInView={{ opacity: 1, rotateX: 0 }}
                        viewport={{ once: true }}
                        className="flex gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500 text-gray-900 font-black text-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,255,204,0.4)]">{idx + 1}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{title?.trim()}</h3>
                          <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: desc?.trim() || '' }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PRICING */}
        {isVisible(data?.pricing) && (
          <section className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-12 text-center">{data?.pricing?.h2}</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {[starterPlan, growthPlan, premiumPlan].map((plan, idx) => (
                <div key={idx} className={`relative flex flex-col bg-white border-2 rounded-3xl p-8 transition-all hover:-translate-y-2 ${idx === 1 ? 'border-blue-500 shadow-[0_30px_60px_rgba(37,99,235,0.15)] lg:-mt-4 lg:mb-4' : 'border-gray-100 shadow-sm'}`}>
                  {idx === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">Most Popular</div>}
                  <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-5xl font-black text-gray-900 mb-8">{plan.price}</div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                        <svg className="w-5 h-5 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.link || "#cta"} className={`w-full py-4 rounded-xl font-black text-center transition-all ${idx === 1 ? 'bg-blue-600 text-white hover:bg-cyan-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    Choose {plan.name}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {isVisible(data?.faq) && (
          <section className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-10 text-center">{data?.faq?.h2}</h2>
            <div className="space-y-4">
              {faqs.map(([q, a], idx) => (
                <div key={idx} className="bg-white border-2 border-gray-100 p-6 md:p-8 rounded-3xl shadow-sm">
                  <h3 className="text-lg font-black text-gray-900 mb-3">{q}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: a || '' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA (Cyberpunk Anchor) */}
        {isVisible(data?.cta) && (
          <section className="max-w-7xl mx-auto px-6 mb-20">
             <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-16 md:p-24 rounded-[3rem] relative overflow-hidden text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px]"></div>
                <div className="relative z-10">
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">{data?.cta?.h2}</h2>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium" dangerouslySetInnerHTML={{ __html: data?.cta?.text || '' }} />
                  <Link href={data?.cta?.btnLink || "mailto:founder@klarai.uk"} className="inline-block bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 shadow-[0_15px_30px_rgba(255,255,255,0.2)] transition-all active:scale-95 uppercase tracking-widest">
                    {data?.cta?.btnText || "Contact Us"}
                  </Link>
                </div>
             </div>
          </section>
        )}

      </main>
    
    </div>
  );
}