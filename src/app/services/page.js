"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

// --- DATA: CORE SERVICES ARCHITECTURE ---
const coreServices = [
  { 
    id: 'seo', 
    tag: 'SEO.ARCH', 
    title: 'Advanced Search Engine Optimization', 
    desc: 'The mathematical alignment of your digital architecture with search engine algorithms. We build robust systems to dominate organic search results and capture high-intent local traffic.', 
    link: '/seo-services', 
    colorline: 'bg-blue-500',
    blob: 'bg-blue-100',
    iconText: 'text-blue-600',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  },
  { 
    id: 'aeo', 
    tag: 'AEO.SYS', 
    title: 'Answer Engine Optimization', 
    desc: 'Structure your entity data so AI engines like ChatGPT, Gemini, and Claude recommend your business first. Future-proof your brand against the shift from search engines to answer engines.', 
    link: '/aeo-services', 
    colorline: 'bg-fuchsia-500',
    blob: 'bg-fuchsia-100',
    iconText: 'text-fuchsia-500',
    iconBg: 'bg-fuchsia-50',
    iconBorder: 'border-fuchsia-100',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  },
  { 
    id: 'web', 
    tag: 'WEB.DEV', 
    title: 'High-Converting Web Design', 
    desc: 'Custom, blazing-fast Next.js architecture designed to convert traffic into qualified leads. We build immersive, interactive frontends that establish instant authority and trust.', 
    link: '/web-development', 
    colorline: 'bg-cyan-500',
    blob: 'bg-cyan-100',
    iconText: 'text-cyan-500',
    iconBg: 'bg-cyan-50',
    iconBorder: 'border-cyan-100',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  },
  { 
    id: 'ads', 
    tag: 'META.ADS', 
    title: 'Predictable Revenue Scaling', 
    desc: 'Data-driven Meta advertising campaigns engineered for maximum ROI. We bypass the guesswork with rigorous A/B testing, granular tracking, and high-fidelity creative execution.', 
    link: '/meta-ads', 
    colorline: 'bg-blue-600',
    blob: 'bg-blue-100',
    iconText: 'text-blue-600',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  },
  { 
    id: 'smma', 
    tag: 'SOC.MED', 
    title: 'Organic Social Media Growth', 
    desc: 'Build long-term brand authority and a loyal community through high-fidelity content production. We architect social ecosystems that turn passive viewers into active buyers.', 
    link: '/social-media-marketing', 
    colorline: 'bg-fuchsia-400',
    blob: 'bg-fuchsia-100',
    iconText: 'text-fuchsia-500',
    iconBg: 'bg-fuchsia-50',
    iconBorder: 'border-fuchsia-100',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  }
];

export default function ServicesHubPage() {
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
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10"
          >
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              Core Architecture
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
              Systems Engineered <br className="hidden md:block" /> for <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-500 bg-clip-text text-transparent">Scale</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-500 font-medium max-w-3xl mx-auto">
              We don't sell random marketing tactics. We build robust, interconnected digital infrastructure designed to capture market share and drive predictable revenue
            </p>
          </motion.div>
        </section>

        {/* --- SERVICES GRID --- */}
        <section className="max-w-7xl mx-auto px-6" style={{ perspective: '1200px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreServices.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, rotateX: 15, y: 40 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className={`relative bg-white rounded-[2rem] border-2 border-gray-100 p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(6,182,212,0.15)] hover:-translate-y-2 transition-all duration-300 overflow-hidden group ${index === 0 ? 'md:col-span-2' : ''}`}
              >
                {/* Colored Top Border Indicator */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${service.colorline}`}></div>
                
                {/* Hover Blob Effect */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 ${service.blob} rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-16 h-16 ${service.iconBg} border ${service.iconBorder} ${service.iconText} rounded-2xl flex items-center justify-center shadow-inner`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {service.iconPath}
                      </svg>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      {service.tag}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10 flex-1">
                    {service.desc}
                  </p>

                  <div className="mt-auto">
                   <div className="mt-auto">
 <div className="mt-auto pt-6">
  {/* Modern Brutalist Button Design */}
 <div className="mt-auto pt-6">
  {/* Modern Brutalist Button Design */}
  <Link 
    href={service.link} 
    className="inline-flex items-center justify-center gap-3 bg-[black] text-[white] px-6 py-3 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-[#b3e600] shadow-[0_4px_15px_rgba(204,255,0,0.2)] "
  >
    Visit Page
  
  </Link>
</div>
</div>
</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- CLOSING CTA --- */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-16 md:p-24 rounded-[3rem] relative overflow-hidden text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
           >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Not sure what you need?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">Get a completely free, deep-dive technical audit. We will map out exactly where your business is losing money and how to fix it.</p>
                <Link href="/free-audit" className="inline-block bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 shadow-[0_15px_30px_rgba(255,255,255,0.2)] transition-all active:scale-95 uppercase tracking-widest">
                  Initiate System Audit
                </Link>
              </div>
           </motion.div>
        </section>

      </main>

      
    </div>
  );
}