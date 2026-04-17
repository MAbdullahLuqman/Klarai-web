import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader';

export const metadata = {
  title: 'Digital Systems & Architecture | Klarai',
  description: 'Explore our core capabilities: Next-Gen SEO, Answer Engine Optimization (AEO), and High-Converting Web Design.',
};

// SVG Icons for the light-themed cards
const getIcon = (id) => {
  switch(id) {
    case 'seo': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />;
    case 'aeo': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />; // Lightning / AI
    case 'web': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />; // Code brackets
    case 'ads': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />; // Data/Chart
    case 'smma': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />; // Chat Network
    default: return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />;
  }
};

// Safe Tailwind Grid Span Logic to perfectly balance 5 items
const getGridClasses = (index) => {
  if (index < 3) return 'lg:col-span-2 md:col-span-1 col-span-1'; // Top 3 items
  if (index === 3) return 'lg:col-span-3 md:col-span-1 col-span-1'; // Bottom left item spans half
  return 'lg:col-span-3 md:col-span-2 col-span-1'; // Bottom right item spans half
};

export default async function ServicesHubPage() {
  const serviceIds = [
    { id: 'seo', path: '/seo-services', tag: 'sys.search' },
    { id: 'aeo', path: '/aeo-services', tag: 'sys.intelligence' },
    { id: 'web', path: '/web-development', tag: 'sys.infrastructure' },
    { id: 'ads', path: '/meta-ads', tag: 'sys.revenue' },
    { id: 'smma', path: '/social-media-marketing', tag: 'sys.social' }
  ];

  const fetchedServices = await Promise.all(
    serviceIds.map(async (s) => {
      const docSnap = await getDoc(doc(db, 'pages', s.id));
      const data = docSnap.data() || {};
      return { ...s, h1: data.hero?.h1 || s.id, sub: data.hero?.sub || '' };
    })
  );

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-[#0A101D] min-h-screen">
      <GlobalHeader />

      {/* 1. CLEAN LIGHT HERO (Landing Page Style) */}
      <section className="pt-[160px] pb-16 px-6 relative overflow-hidden text-center max-w-4xl mx-auto">
        <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-[#008dd8] text-[10px] md:text-xs font-black tracking-[0.2em] uppercase">
          Capabilities & Systems
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] font-black tracking-tighter text-[#0A101D] mb-6 uppercase">
          Digital <span className="text-[#008dd8]">Architecture.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-10">
          We do not run isolated campaigns. We engineer holistic, data-driven digital ecosystems designed to dominate search engines, capture AI recommendations, and predictably scale revenue.
        </p>

        <div className="flex justify-center">
           <Link href="/free-audit" className="inline-flex bg-[#0A101D] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#008dd8] transition-all shadow-[0_8px_20px_rgba(10,16,29,0.2)] active:scale-95">
             Get Your Free Audit
           </Link>
        </div>
      </section>

      {/* 2. BALANCED GRID (6-Column Math to perfectly center 5 items) */}
      <main className="pb-24 px-6 max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
          
          {fetchedServices.map((service, i) => (
             <Link 
               key={i} 
               href={service.path} 
               className={`group bg-white rounded-3xl border-2 border-gray-100 p-8 md:p-10 hover:border-[#008dd8] hover:shadow-[0_20px_40px_rgba(0,141,216,0.08)] transition-all duration-300 flex flex-col h-full relative overflow-hidden ${getGridClasses(i)}`}
             >
               
               {/* Icon & Tag Header */}
               <div className="flex justify-between items-start mb-8">
                 <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#008dd8] group-hover:scale-110 group-hover:bg-[#008dd8] group-hover:text-white transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {getIcon(service.id)}
                    </svg>
                 </div>
                 <div className="font-mono text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                   {service.tag}
                 </div>
               </div>

               {/* Content */}
               <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#0A101D] group-hover:text-[#008dd8] transition-colors mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: service.h1 }} />
               <p className="text-gray-600 font-medium leading-relaxed mb-10 flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: service.sub }} />
                 
               {/* Footer Link */}
               <div className="mt-auto pt-6 border-t border-gray-100">
                 <div className="text-[#0A101D] font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-1 group-hover:gap-2 group-hover:text-[#008dd8] transition-all">
                   View Architecture <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                 </div>
               </div>

             </Link>
          ))}

        </div>
      </main>

      {/* 3. FINAL CTA (Dark Anchor) */}
      <section className="py-24 px-6 border-t border-gray-200">
         <div className="max-w-5xl mx-auto bg-[#0A101D] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
           <div className="absolute top-0 right-0 w-80 h-80 bg-[#008dd8]/20 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

           <div className="relative z-10 flex flex-col items-center">
             <h2 className="text-3xl md:text-[2.8rem] leading-[1.1] font-black tracking-tighter mb-6">Not sure which system you need?</h2>
             <p className="text-lg md:text-xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto">Get a free, technical SEO and Architecture audit. We'll show you exactly where you're losing money and which systems to deploy first.</p>
             <Link href="/free-audit" className="inline-block bg-[#008dd8] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#0077b5] transition-all active:scale-95 shadow-xl">
               Initiate Free Audit
             </Link>
           </div>
         </div>
      </section>

    </div>
  );
}