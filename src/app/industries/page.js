import React from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

export const metadata = {
  title: 'Industries We Serve | Klarai UK',
  description: 'Specialized growth architectures, SEO, and Meta Ads strategies for ambitious brands across various industries in the UK.',
};

// Force Next.js to dynamically fetch this page so new niches appear instantly
export const dynamic = 'force-dynamic'; 

export default async function NicheHubPage() {
  // Fetch all niche pages from Firestore
  const nicheQuery = await getDocs(collection(db, 'niche_pages'));
  const niches = nicheQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <GlobalHeader />

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        
        {/* Header Section */}
        <section className="text-center space-y-6 mb-20">
          <h1 className="font-nothing text-5xl md:text-7xl uppercase tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Do You Need Our Service?
          </h1>
          <p className="font-tech text-lg md:text-xl text-gray-400 tracking-[0.2em] uppercase max-w-3xl mx-auto">
            Select your industry below to discover bespoke growth architectures, tailored deliverables, and proven case studies for your specific market.
          </p>
        </section>

        {/* Dynamic Grid of Niche Pages */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {niches.length === 0 ? (
             <p className="text-gray-500 font-tech text-center col-span-3 py-20">SYSTEM STATUS: NO NICHE PAGES DETECTED. AWAITING DEPLOYMENT.</p>
          ) : (
            niches.map((niche) => (
              <Link 
                href={`/niche/${niche.slug}`} 
                key={niche.id}
                className="group relative h-[400px] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-end p-8 hover:border-blue-500/50 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                {/* Background Image with Dark Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${niche.imageUrl || '/1.jpg'})` }} // Fallback image just in case
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                
                {/* Card Content */}
                <div className="relative z-10 space-y-3 transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] uppercase tracking-widest rounded-full backdrop-blur-md">
                    {niche.service}
                  </div>
                  <h2 className="font-nothing text-3xl uppercase tracking-widest text-white drop-shadow-lg">
                    {niche.niche}
                  </h2>
                  <p className="font-sans text-gray-300 text-sm line-clamp-2 leading-relaxed">
                    {niche.subheadline}
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-blue-400 font-tech text-xs uppercase tracking-widest group-hover:text-white transition-colors">
                    Access Blueprint 
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>

      </main>

      
    </div>
  );
}