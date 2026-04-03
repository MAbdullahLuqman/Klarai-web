import React from 'react';
import Link from 'next/link';

export default function ServicePageTemplate({ data }) {
  // --- BULLETPROOF VISIBILITY CHECKER ---
  const isVisible = (sectionData) => {
    if (sectionData?.visible === false || sectionData?.visible === 'false') return false;
    return true;
  };

  // --- ULTRA-SAFE DATA PARSING ---
  // We wrap every string in ( ... || '' ) so .split() NEVER touches undefined data
  const bullets = (data?.definition?.bullets || '').split('\n').filter(b => b.trim() !== '');
  const includedItems = (data?.included?.items || '').split('\n').filter(i => i.trim() !== '');
  const processSteps = (data?.process?.steps || '').split('\n').filter(s => s.trim() !== '');
  
  const rawCaseStudy = (data?.results?.caseStudy || '').split('|').map(s => s.trim());
  const caseStudyParts = [rawCaseStudy[0] || '', rawCaseStudy[1] || '', rawCaseStudy[2] || ''];
  
  const faqs = (data?.faq?.qas || '').split('\n').filter(q => q.trim() !== '').map(qa => (qa || '').split('|'));

  const parsePricing = (tierStr) => {
    const parts = (tierStr || '').split('|');
    let name = 'Tier', price = '£?', link = '#cta', featuresStr = '';
    
    if (parts.length === 3) {
      name = parts[0]; price = parts[1]; featuresStr = parts[2];
    } else if (parts.length >= 4) {
      name = parts[0]; price = parts[1]; link = parts[2]; featuresStr = parts[3];
    }
    
    // Safely parse features
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

  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans selection:bg-[#185FA5] selection:text-white pb-20">
      
      {isVisible(data?.faq) && faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <nav className="w-full p-6 md:p-10 flex justify-between items-center z-40 border-b border-white/5">
        <Link href="/">
          <img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-lg cursor-pointer" />
        </Link>
        <Link href="https://www.linkedin.com/in/abdullahluqman/" target="_blank" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
          Connect with Founder
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-32">
        
        {/* BLOCK 1: HERO */}
        {isVisible(data?.hero) && (
          <section id="hero" className="flex flex-col items-start text-left max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {data?.hero?.h1}
            </h1>
            {/* INJECTED HTML CAPABILITY FOR LINKS */}
            <p className="text-xl md:text-2xl mb-10 text-gray-400 font-medium" dangerouslySetInnerHTML={{ __html: data?.hero?.sub || '' }} />
            <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
              <Link href={data?.hero?.btn1Link || "/#audit"} className="bg-[#185FA5] hover:bg-[#144d85] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(24,95,165,0.4)] text-center">
                {data?.hero?.btn1Text || "Get Your Free Audit →"}
              </Link>
              <Link href={data?.hero?.btn2Link || "#what-is"} className="bg-transparent border border-white/20 hover:border-white/60 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all text-center">
                {data?.hero?.btn2Text || "See How It Works ↓"}
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest uppercase text-gray-500">
              {(data?.hero?.trust || '').split('|').map((badge, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#185FA5]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  {badge.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* BLOCK 2: DEFINITION */}
        {isVisible(data?.definition) && (
          <section id="what-is" className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">{data?.definition?.h2}</h2>
              {/* INJECTED HTML CAPABILITY FOR LINKS */}
              <p className="text-lg text-gray-400 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: data?.definition?.para || '' }} />
            </div>
            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl shadow-xl">
              <ul className="space-y-4">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#185FA5]/20 flex items-center justify-center mt-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span></span>
                    {/* INJECTED HTML CAPABILITY FOR LINKS */}
                    <span className="text-lg font-medium text-gray-200" dangerouslySetInnerHTML={{ __html: bullet }} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* BLOCK 3: WHAT'S INCLUDED */}
        {isVisible(data?.included) && (
          <section id="services">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">{data?.included?.h2}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedItems.map((item, idx) => {
                const [title, desc] = item.split(':');
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[#185FA5]/50 hover:bg-[#185FA5]/5 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-3">{title?.trim()}</h3>
                    {/* INJECTED HTML CAPABILITY FOR LINKS */}
                    <p className="text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: desc?.trim() || '' }} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* BLOCK 4: PROCESS */}
        {isVisible(data?.process) && (
          <section id="process" className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">{data?.process?.h2}</h2>
            <div className="grid md:grid-cols-2 gap-10">
              {processSteps.map((step, idx) => {
                const [title, desc] = step.split(':');
                return (
                  <div key={idx} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#185FA5] text-white font-black text-xl flex items-center justify-center shadow-[0_0_15px_rgba(24,95,165,0.4)]">{idx + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{title?.trim()}</h3>
                      {/* INJECTED HTML CAPABILITY FOR LINKS */}
                      <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: desc?.trim() || '' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* BLOCK 5: RESULTS */}
        {isVisible(data?.results) && (
          <section id="results" className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">{data?.results?.h2}</h2>
            <div className="bg-gradient-to-br from-[#185FA5]/10 to-transparent border border-[#185FA5]/30 p-10 md:p-14 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#185FA5]/10 blur-[100px] rounded-full"></div>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm mb-8">
                <span className="text-[#3b82f6]">{caseStudyParts[0]}</span><span className="w-1 h-1 bg-gray-500 rounded-full"></span><span>{caseStudyParts[1]}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8 leading-snug">"{caseStudyParts[2]}"</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="flex text-[#fcd34d] gap-1">
                  {[1, 2, 3, 4, 5].map(star => <svg key={star} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
                </div>
                {/* INJECTED HTML CAPABILITY FOR LINKS */}
                <p className="text-gray-400 italic text-lg" dangerouslySetInnerHTML={{ __html: data?.results?.quote || '' }} />
                <p className="text-white font-bold tracking-wide uppercase text-sm mt-2">{data?.results?.author}</p>
              </div>
            </div>
          </section>
        )}

        {/* BLOCK 6: PRICING */}
        {isVisible(data?.pricing) && (
          <section id="pricing">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">{data?.pricing?.h2}</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {[starterPlan, growthPlan, premiumPlan].map((plan, idx) => (
                <div key={idx} className={`relative flex flex-col bg-[#0a0a0a] border rounded-3xl p-8 ${idx === 1 ? 'border-[#185FA5] shadow-[0_0_30px_rgba(24,95,165,0.2)] lg:-mt-4 lg:mb-4' : 'border-white/10'}`}>
                  {idx === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#185FA5] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-4 rounded-full">Most Popular</div>}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-extrabold text-white mb-8">{plan.price}</div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-400">
                        <svg className="w-5 h-5 text-[#10b981] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {/* INJECTED HTML CAPABILITY FOR LINKS */}
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.link || "#cta"} className={`w-full py-4 rounded-xl font-bold text-center transition-all ${idx === 1 ? 'bg-[#185FA5] text-white hover:bg-[#144d85]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                    Choose {plan.name}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">All plans include a free audit. Cancel anytime.</p>
          </section>
        )}

        {/* BLOCK 7: FAQ */}
        {isVisible(data?.faq) && (
          <section id="faq" className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">{data?.faq?.h2}</h2>
            <div className="space-y-4">
              {faqs.map(([q, a], idx) => (
                <div key={idx} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-3">{q}</h3>
                  {/* INJECTED HTML CAPABILITY FOR LINKS */}
                  <p className="text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: a || '' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* BLOCK 8: CTA */}
        {isVisible(data?.cta) && (
          <section id="cta" className="text-center bg-[#185FA5] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">{data?.cta?.h2}</h2>
              {/* INJECTED HTML CAPABILITY FOR LINKS */}
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium" dangerouslySetInnerHTML={{ __html: data?.cta?.text || '' }} />
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link href={data?.cta?.btnLink || "mailto:founder@klarai.uk"} className="bg-[#030303] hover:bg-black text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-xl hover:scale-105">
                  {data?.cta?.btnText || "Contact Us"}
                </Link>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}