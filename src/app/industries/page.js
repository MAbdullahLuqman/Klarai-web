import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

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
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-cyan-300 selection:text-black min-h-screen overflow-hidden">
      <GlobalHeader />

      <main className="pt-32 pb-24 space-y-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-cyan-300/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-fuchsia-300/20 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative z-10">
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              Sector Expertise
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
              Industries We <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-500 bg-clip-text text-transparent">Dominate</span>.
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-500 font-medium max-w-3xl mx-auto">
              Our digital architecture is custom-engineered for high-growth sectors. Select your industry below to see how we scale revenue.
            </p>
          </div>
        </section>

        {/* --- DYNAMIC INDUSTRIES GRID --- */}
        <section className="max-w-7xl mx-auto px-6">
          {niches.length === 0 ? (
             <div className="text-center bg-white border-2 border-gray-100 p-12 rounded-3xl">
                <p className="text-gray-500 font-medium text-lg">System Booting: No industry modules detected in the database yet.</p>
                <p className="text-sm text-gray-400 mt-2">Create your first niche page in the Admin Portal to populate this hub.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {niches.map((niche) => (
                <Link key={niche.id} href={`/niche/${niche.slug}`} className="group block h-full">
                  <div className="bg-white h-full border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] hover:border-cyan-200 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    
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
                      {/* Neon Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                      
                      {/* Floating Cyber Tag */}
                      <div className="absolute bottom-4 left-4">
                         <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-blue-400/50">
                           {niche.service || 'Growth Systems'}
                         </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                        {niche.niche || 'Industry Partner'}
                      </h2>
                      <p className="text-gray-500 font-medium leading-relaxed text-sm flex-1 line-clamp-3">
                         {niche.subheadline || `Advanced digital architecture and predictable revenue scaling designed specifically for ${niche.niche || 'your business'}.`}
                      </p>
                      
                      {/* Fake Terminal UI line for aesthetic */}
                      <div className="mt-6 pt-6 border-t-2 border-gray-100 flex items-center justify-between">
                         <span className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                           sys.mount(/niche/{niche.slug})
                         </span>
                         <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* --- CTA --- */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
           <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-16 md:p-20 rounded-[3rem] relative overflow-hidden text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Don't see your industry?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">We build custom digital architecture for ambitious brands across all sectors. Let's map out your growth system.</p>
                <Link href="/free-audit" className="inline-block bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 shadow-[0_15px_30px_rgba(255,255,255,0.2)] transition-all active:scale-95 uppercase tracking-widest">
                  Request Custom Audit
                </Link>
              </div>
           </div>
        </section>

      </main>

     
    </div>
  );
}