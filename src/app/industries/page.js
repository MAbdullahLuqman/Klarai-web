import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader';

export const metadata = {
  title: 'Industries We Serve | Klarai',
  description: 'Explore the high-growth industries and niches where Klarai provides advanced digital architecture, SEO, and Meta Ads scaling.',
};

// SERVER COMPONENT: Fetches all active niche pages directly from Firebase for instant SEO rendering
export default async function IndustriesHubPage() {
  let niches = [];
  try {
    const querySnapshot = await getDocs(collection(db, 'niche_pages'));
    niches = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching industries:", error);
  }

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-gray-900 min-h-screen overflow-hidden">
      <GlobalHeader />

      <main className="pt-32 pb-24 space-y-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6">
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* UPDATED: Changed from cyan/fuchsia to the new light blue/blue theme */}
            <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-[#ADD8E6]/40 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              Sector Expertise
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
              Industries We <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-[#0A101D]">Dominate</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-500 font-medium max-w-3xl mx-auto">
              Our digital architecture is custom engineered for high growth sectors. Select your industry below to see how we scale revenues.
            </p>
          </div>
        </section>

        {/* --- DYNAMIC INDUSTRIES GRID --- */}
        <section className="max-w-7xl mx-auto px-6">
          {niches.length === 0 ? (
             <div className="text-center bg-white border-2 border-gray-200 p-12 rounded-3xl">
                <p className="text-gray-500 font-medium text-lg">System Booting: No industry modules detected in the database yet.</p>
                <p className="text-sm text-gray-400 mt-2">Create your first niche page in the Admin Portal to populate this hub.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {niches.map((niche) => (
                <Link key={niche.id} href={`/niche/${niche.slug}`} className="group block h-full">
                  {/* UPDATED: Unified hover borders and shadows */}
                  <div className="bg-white h-full border-2 border-gray-200 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,141,216,0.15)] hover:border-[#008dd8] hover:-translate-y-2 transition-all duration-300 flex flex-col text-left">
                    
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {niche.imageUrl ? (
                        <img 
                          src={niche.imageUrl} 
                          alt={`${niche.niche} SEO and Marketing`} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">No Image Data</span>
                        </div>
                      )}
                      
                      {/* Dark Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      
                      {/* Floating Sector Tag */}
                      <div className="absolute bottom-4 left-4">
                         <span className="bg-[#0A101D]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10">
                           {niche.service || 'Growth Systems'}
                         </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h2 className="text-2xl font-black text-[#0A101D] mb-3 tracking-tight group-hover:text-[#008dd8] transition-colors">
                        {niche.niche || 'Industry Partner'}
                      </h2>
                      <p className="text-gray-600 font-medium leading-relaxed text-sm flex-1 line-clamp-3">
                         {niche.subheadline || `Advanced digital architecture and predictable revenue scaling designed specifically for ${niche.niche || 'your business'}.`}
                      </p>
                      
                      {/* FIXED: Removed sys.mount and added unified CTA pseudo-button */}
                      <div className="mt-8 pt-6 border-t-2 border-gray-100 flex justify-start">
                         <span className="inline-flex items-center justify-center gap-2 bg-[#0A101D] text-white px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-[11px] group-hover:bg-[#008dd8] transition-all">
                           Explore Sector
                           <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                         </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* --- CLOSING CTA --- */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
           {/* UPDATED: Matches the massive dark ink block from the services page */}
           <div className="bg-[#0A101D] text-white py-16 px-6 md:p-24 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center shadow-[0_30px_60px_rgba(10,16,29,0.3)]">
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#008dd8]/20 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 w-full">Don't see your industry?</h2>
                {/* <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-medium w-full"></p> */}
                <Link href="/free-audit" className="inline-flex items-center justify-center gap-2 bg-white text-[#0A101D] px-10 py-5 rounded-full font-black text-sm md:text-base hover:bg-gray-100 shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 uppercase tracking-widest">
                  Request Custom Audit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}