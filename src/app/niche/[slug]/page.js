import React from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

// 1. DYNAMIC META DATA GENERATION FOR SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const docRef = doc(db, 'niche_pages', slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return { title: 'Page Not Found | Klarai' };

  const data = docSnap.data();
  return {
    title: data?.metaTitle || 'Klarai',
    description: data?.metaDescription || '',
  };
}

// 2. SERVER-SIDE PAGE RENDERER
export default async function NicheLandingPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Fetch data directly on the server before rendering
  const docRef = doc(db, 'niche_pages', slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound(); 
  }

  // Fallback empty object if data fails to load properly
  const page = docSnap.data() || {};

  // SAFE PARSING: Fallback to empty strings to prevent the .replace() crash
  const safeDefinition = page.definition || '';
  const safeService = page.service || '';
  const formattedDefinition = safeDefinition.replace(safeService, '');

  // FAQ SCHEMA GENERATION
  const faqsList = page.faqs || [];
  const faqSchema = faqsList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsList.map(faq => ({
      "@type": "Question",
      "name": faq?.q || '',
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq?.a || ''
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <GlobalHeader />

      {/* Inject JSON-LD Schema for SEO */}
      {faqSchema && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
        />
      )}

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-24">
        
        {/* BLOCK 1 & 2: H1 & Subheadline with Dynamic Image Background */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-20 min-h-[500px] flex items-center justify-center text-center p-10">
          
          {page.imageUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${page.imageUrl})` }}
            ></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/90 to-[#050505] z-0"></div>
          
          <div className="relative z-10 space-y-6 max-w-4xl mx-auto pt-10">
            <div className="inline-block px-4 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs uppercase tracking-[0.2em] rounded-full backdrop-blur-md mb-4">
              {safeService} for {page.niche || 'Business'}
            </div>
            <h1 className="font-nothing text-4xl md:text-6xl lg:text-7xl uppercase tracking-widest drop-shadow-[0_0_20px_rgba(0,0,0,1)] leading-tight text-white">
              {page.h1 || ''}
            </h1>
            <p 
              className="font-tech text-lg md:text-xl text-blue-300 tracking-[0.2em] uppercase max-w-2xl mx-auto drop-shadow-lg"
              dangerouslySetInnerHTML={{ __html: page.subheadline || '' }}
            />
          </div>
        </section>

        {/* BLOCK 3: Definition Snippet */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]"></div>
          <p className="font-sans text-lg md:text-xl leading-relaxed text-gray-300">
            <strong className="text-white font-bold">{safeService}</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: formattedDefinition }} />
          </p>
        </section>

        {/* BLOCK 4: What's Included */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[1px] bg-blue-500"></div>
            <h2 className="font-nothing text-3xl md:text-4xl uppercase tracking-widest">What's Included</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-tech text-sm tracking-[0.1em] text-gray-400 uppercase">
            {(page.deliverables || []).map((item, i) => (
              <li key={i} className="flex items-start gap-4 bg-black/40 p-5 border border-white/5 rounded-lg hover:border-blue-500/30 transition-colors">
                <span className="text-blue-500 font-bold">0{i + 1}.</span> 
                <span dangerouslySetInnerHTML={{ __html: item || '' }} />
              </li>
            ))}
          </ul>
        </section>

        {/* BLOCK 5: How It Works */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[1px] bg-green-500"></div>
            <h2 className="font-nothing text-3xl md:text-4xl uppercase tracking-widest">How It Works</h2>
          </div>
          <div className="space-y-4">
            {(page.steps || []).map((step, i) => (
              <div key={i} className="flex items-center gap-6 bg-black/40 border border-white/5 p-5 rounded-lg font-tech text-sm tracking-widest text-gray-300 uppercase hover:border-green-500/30 transition-colors">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-green-500/50 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  {i + 1}
                </div>
                <p dangerouslySetInnerHTML={{ __html: step || '' }} />
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 6: Why Niche Needs Service */}
        <section>
           <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[1px] bg-purple-500"></div>
            <h2 className="font-nothing text-3xl md:text-4xl uppercase tracking-widest">Why {page.niche || 'You'} Need {safeService}</h2>
          </div>
          <div className="space-y-6 font-sans text-gray-300 leading-relaxed text-lg md:text-xl">
            {(page.whyNeeds || []).map((paragraph, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: paragraph || '' }} />
            ))}
          </div>
        </section>

        {/* BLOCK 7: FAQs */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[1px] bg-blue-500"></div>
            <h2 className="font-nothing text-3xl md:text-4xl uppercase tracking-widest">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {(page.faqs || []).map((faq, i) => (
              <div key={i} className="bg-black/40 border border-white/10 p-6 md:p-8 rounded-xl hover:border-blue-500/30 transition-colors">
                <h3 className="font-tech font-bold text-blue-400 mb-4 uppercase tracking-[0.1em] text-sm md:text-base leading-relaxed">
                  Q: {faq?.q || ''}
                </h3>
                <p className="font-sans text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq?.a || '' }} />
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 8: Closing CTA */}
        <section className="relative text-center bg-gradient-to-b from-blue-900/20 to-black border border-blue-500/30 p-12 md:p-20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.1)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="font-nothing text-4xl md:text-5xl mb-6 uppercase tracking-widest text-white">Get a Free Audit</h2>
            <p 
              className="font-sans text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.ctaText || '' }} 
            />
            <Link href="/free-audit" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-tech font-bold px-12 py-5 rounded-full uppercase tracking-[0.3em] transition-transform hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              Initiate System Audit
            </Link>
          </div>
        </section>

      </main>

     
    </div>
  );
}