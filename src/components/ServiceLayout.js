import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';

const parseDelimitedList = (text, delimiter = ':') => {
  if (!text) return [];
  return text.split('\n').filter(Boolean).map(line => {
    const parts = line.split(delimiter);
    return { title: parts[0]?.trim() || '', desc: parts.slice(1).join(delimiter)?.trim() || '' };
  });
};

const parsePricingTier = (text) => {
  if (!text) return null;
  const [name, price, link, features] = text.split('|');
  return {
    name: name?.trim() || '', price: price?.trim() || '', link: link?.trim() || '#',
    features: features ? features.split(',').map(f => f.trim()) : []
  };
};

export default async function ServiceLayout({ serviceId }) {
  const docSnap = await getDoc(doc(db, 'pages', serviceId)); 
  if (!docSnap.exists()) notFound(); 
  const page = docSnap.data();

  let activeNiches = [];
  try {
    const nicheQuery = query(collection(db, 'niche_pages'), limit(4));
    const nicheDocs = await getDocs(nicheQuery);
    activeNiches = nicheDocs.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {}

  const includedItems = parseDelimitedList(page.included?.items, ':');
  const processSteps = parseDelimitedList(page.process?.steps, ':');
  const faqs = parseDelimitedList(page.faq?.qas, '|');
  const caseStudyParts = page.results?.caseStudy ? page.results.caseStudy.split('|').map(s => s.trim()) : [];
  
  const pricing = {
    starter: parsePricingTier(page.pricing?.starter),
    growth: parsePricingTier(page.pricing?.growth),
    premium: parsePricingTier(page.pricing?.premium)
  };

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-[#0A101D] min-h-screen">
      <GlobalHeader />

      {page.hero?.visible !== false && (
        <section className="bg-[#0A101D] pt-[160px] pb-24 px-6 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-[#008dd8]/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] font-black tracking-tighter text-white mb-6 uppercase" dangerouslySetInnerHTML={{ __html: page.hero?.h1 }} />
            <p className="text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mb-10" dangerouslySetInnerHTML={{ __html: page.hero?.sub }} />
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {page.hero?.btn1Text && (
                <Link href={page.hero.btn1Link || '#'} className="bg-[#008dd8] text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#0077b5] transition-all shadow-[0_10px_30px_rgba(0,141,216,0.3)] active:scale-95">
                  {page.hero.btn1Text}
                </Link>
              )}
              {page.hero?.btn2Text && (
                <Link href={page.hero.btn2Link || '#'} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95">
                  {page.hero.btn2Text}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {page.definition?.visible !== false && (
        <section id="what-is" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div><h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#0A101D] mb-6 leading-tight">{page.definition?.h2}</h2></div>
            <div className="bg-white border-2 border-gray-100 p-8 md:p-10 rounded-3xl shadow-sm">
              <div className="text-lg text-gray-700 font-medium leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: page.definition?.para }} />
              {page.definition?.bullets && (
                <ul className="space-y-3 border-t border-gray-100 pt-6">
                  {page.definition.bullets.split('\n').filter(Boolean).map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-800 font-bold"><span className="text-[#008dd8] mt-0.5">✓</span><span dangerouslySetInnerHTML={{ __html: bullet }} /></li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {page.included?.visible !== false && includedItems.length > 0 && (
        <section className="py-24 px-6 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center text-[#0A101D] mb-16">{page.included?.h2}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedItems.map((item, i) => (
                <div key={i} className="bg-white border-2 border-gray-100 p-8 rounded-3xl hover:border-[#008dd8] transition-colors group">
                  <div className="w-12 h-12 bg-blue-50 text-[#008dd8] rounded-xl flex items-center justify-center mb-6 font-black text-xl group-hover:scale-110 transition-transform">{i + 1}</div>
                  <h3 className="text-xl font-black text-[#0A101D] mb-3 leading-snug">{item.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.results?.visible !== false && (
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="bg-[#0A101D] text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#008dd8]/20 rounded-full blur-[80px] pointer-events-none"></div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-10">{page.results?.h2}</h2>
            {caseStudyParts.length >= 2 && (
              <div className="mb-12">
                <div className="text-5xl md:text-7xl font-black tracking-tighter text-[#008dd8] mb-4">{caseStudyParts[1]}</div>
                <div className="text-xl font-bold">{caseStudyParts[0]} {caseStudyParts[2] ? `→ ${caseStudyParts[2]}` : ''}</div>
              </div>
            )}
            <div className="max-w-3xl mx-auto border-t border-white/10 pt-10">
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: page.results?.quote }} />
              <p className="text-sm font-bold uppercase tracking-widest text-[#008dd8]">— {page.results?.author}</p>
            </div>
          </div>
        </section>
      )}

      {page.process?.visible !== false && processSteps.length > 0 && (
        <section className="py-24 px-6 bg-white border-y border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center text-[#0A101D] mb-16">{page.process?.h2}</h2>
            <div className="space-y-8">
              {processSteps.map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start bg-gray-50 border-2 border-gray-100 p-8 rounded-3xl">
                  <div className="text-6xl font-black text-gray-200 leading-none shrink-0 w-16">0{i + 1}</div>
                  <div><h3 className="text-2xl font-black text-[#0A101D] mb-3">{step.title}</h3><p className="text-gray-600 font-medium leading-relaxed text-lg">{step.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.pricing?.visible !== false && pricing.starter && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center text-[#0A101D] mb-16">{page.pricing?.h2}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-sm text-center">
              <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-2">{pricing.starter.name}</h3>
              <div className="text-4xl font-black text-[#0A101D] mb-8">{pricing.starter.price}</div>
              <Link href={pricing.starter.link} className="block w-full bg-gray-100 text-[#0A101D] py-3 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-gray-200 transition-colors mb-8">Get Started</Link>
              <ul className="space-y-4 text-left">{pricing.starter.features.map((f, i) => <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700"><span className="text-[#008dd8] font-black">✓</span> {f}</li>)}</ul>
            </div>

            {pricing.growth && (
              <div className="bg-[#0A101D] text-white border-2 border-[#0A101D] p-10 rounded-[2.5rem] shadow-2xl text-center transform md:-translate-y-4 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#008dd8] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
                <h3 className="text-lg font-black uppercase tracking-widest text-[#008dd8] mb-2">{pricing.growth.name}</h3>
                <div className="text-5xl font-black text-white mb-8">{pricing.growth.price}</div>
                <Link href={pricing.growth.link} className="block w-full bg-[#008dd8] text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-[#0077b5] transition-colors mb-8 shadow-lg">Start Scaling</Link>
                <ul className="space-y-4 text-left">{pricing.growth.features.map((f, i) => <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-300"><span className="text-[#008dd8] font-black">✓</span> {f}</li>)}</ul>
              </div>
            )}

            {pricing.premium && (
              <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-sm text-center">
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-500 mb-2">{pricing.premium.name}</h3>
                <div className="text-4xl font-black text-[#0A101D] mb-8">{pricing.premium.price}</div>
                <Link href={pricing.premium.link} className="block w-full bg-gray-100 text-[#0A101D] py-3 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-gray-200 transition-colors mb-8">Get Started</Link>
                <ul className="space-y-4 text-left">{pricing.premium.features.map((f, i) => <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-700"><span className="text-[#008dd8] font-black">✓</span> {f}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      )}

      {page.faq?.visible !== false && faqs.length > 0 && (
        <section className="py-24 px-6 bg-gray-50 border-y border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center text-[#0A101D] mb-16">{page.faq?.h2}</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-2 border-gray-200 bg-white rounded-2xl [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                  <summary className="flex items-center justify-between p-6 font-black text-lg text-gray-900">{faq.title}<span className="transition group-open:rotate-180 text-[#008dd8]"><svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span></summary>
                  <p className="px-6 pb-6 text-gray-600 font-medium leading-relaxed mt-[-10px]" dangerouslySetInnerHTML={{ __html: faq.desc }} />
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeNiches.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#0A101D] mb-4">Sector-Specific Architecture</h2>
                <p className="text-lg text-gray-600 font-medium">Generic strategies yield generic results. We engineer bespoke digital ecosystems tailored to the exact search behaviors and conversion triggers of your industry.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeNiches.map((niche, i) => (
                <Link key={i} href={`/niche/${niche.slug}`} className="group bg-gray-50 border-2 border-gray-100 rounded-3xl p-8 hover:border-[#008dd8] hover:shadow-[0_10px_30px_rgba(0,141,216,0.1)] transition-all duration-300">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform"><svg className="w-5 h-5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></div>
                  <h3 className="text-xl font-black text-[#0A101D] mb-2">{niche.niche || niche.h1}</h3>
                  <p className="text-sm text-gray-500 font-medium line-clamp-2">{niche.subheadline || 'Explore tailored architecture.'}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.cta?.visible !== false && (
        <section className="py-24 px-6 border-t border-gray-200">
           <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0A101D] to-[#1a2b4c] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
             <div className="relative z-10">
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">{page.cta?.h2}</h2>
               <p className="text-xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: page.cta?.text }} />
               <Link href={page.cta?.btnLink || '/free-audit'} className="inline-block bg-[#008dd8] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#0077b5] transition-all active:scale-95 shadow-xl">{page.cta?.btnText}</Link>
             </div>
           </div>
        </section>
      )}
    </div>
  );
}