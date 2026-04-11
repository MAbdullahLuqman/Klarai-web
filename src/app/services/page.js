"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';

// --- DATA: CORE SERVICES ARCHITECTURE ---
// Restored all the unique colors for each grid box!
const coreServices = [
  { 
    id: 'seo', 
    tag: 'SEO.ARCH', 
    title: 'Advanced Search Engine Optimization', 
    desc: 'The mathematical alignment of your digital architecture with search engine algorithms. We build robust systems to dominate organic search results and capture high-intent local traffic.', 
    link: '/seo-services', 
    colorline: 'group-hover:bg-blue-600',
    blob: 'bg-blue-100/60',
    iconText: 'text-blue-600',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
    btnHover: 'group-hover:bg-blue-600 group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]',
    cardHover: 'hover:border-blue-600',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  },
  { 
    id: 'aeo', 
    tag: 'AEO.SYS', 
    title: 'Answer Engine Optimization', 
    desc: 'Structure your entity data so AI engines like ChatGPT, Gemini, and Claude recommend your business first. Future-proof your brand against the shift from search engines to answer engines.', 
    link: '/aeo-services', 
    colorline: 'group-hover:bg-fuchsia-500',
    blob: 'bg-fuchsia-100/60',
    iconText: 'text-fuchsia-500',
    iconBg: 'bg-fuchsia-50',
    iconBorder: 'border-fuchsia-100',
    btnHover: 'group-hover:bg-fuchsia-500 group-hover:shadow-[0_8px_20px_rgba(217,70,239,0.3)]',
    cardHover: 'hover:border-fuchsia-500',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  },
  { 
    id: 'web', 
    tag: 'WEB.DEV', 
    title: 'High-Converting Web Design', 
    desc: 'Custom, blazing-fast Next.js architecture designed to convert traffic into qualified leads. We build immersive, interactive frontends that establish instant authority and trust.', 
    link: '/web-development', 
    colorline: 'group-hover:bg-cyan-500',
    blob: 'bg-cyan-100/60',
    iconText: 'text-cyan-500',
    iconBg: 'bg-cyan-50',
    iconBorder: 'border-cyan-100',
    btnHover: 'group-hover:bg-cyan-500 group-hover:shadow-[0_8px_20px_rgba(6,182,212,0.3)]',
    cardHover: 'hover:border-cyan-500',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  },
  { 
    id: 'ads', 
    tag: 'META.ADS', 
    title: 'Predictable Revenue Scaling', 
    desc: 'Data-driven Meta advertising campaigns engineered for maximum ROI. We bypass the guesswork with rigorous A/B testing, granular tracking, and high-fidelity creative execution.', 
    link: '/meta-ads', 
    colorline: 'group-hover:bg-blue-600',
    blob: 'bg-blue-100/60',
    iconText: 'text-blue-600',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
    btnHover: 'group-hover:bg-blue-600 group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]',
    cardHover: 'hover:border-blue-600',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  },
  { 
    id: 'smma', 
    tag: 'SOC.MED', 
    title: 'Ongoing Growth Support', 
    desc: 'Build long-term brand authority and a loyal community through high-fidelity content production. We architect social ecosystems that turn passive viewers into active buyers.', 
    link: '/social-media-marketing', 
    colorline: 'group-hover:bg-fuchsia-400',
    blob: 'bg-fuchsia-100/60',
    iconText: 'text-fuchsia-500',
    iconBg: 'bg-fuchsia-50',
    iconBorder: 'border-fuchsia-100',
    btnHover: 'group-hover:bg-fuchsia-500 group-hover:shadow-[0_8px_20px_rgba(217,70,239,0.3)]',
    cardHover: 'hover:border-fuchsia-500',
    iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  }
];

export default function ServicesHubPage() {
  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-gray-900 min-h-screen overflow-hidden">
      <GlobalHeader />

      <main className="pt-32 pb-24 space-y-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-[400px] h-[400px] bg-blue-200/50 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[100px]"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              Core Architecture
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-[#0A101D] tracking-tighter leading-tight mb-6">
              Systems Engineered <br className="hidden md:block" /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-[#0A101D]">Scale</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-500 font-medium max-w-3xl mx-auto">
              We don't sell random marketing tactics. We build robust, interconnected digital infrastructure designed to capture market share and drive predictable revenue.
            </p>
            
            <Link href="/free-audit" className="inline-flex items-center gap-3 bg-[#0A101D] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-blue-600 hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)] transition-all shadow-[0_8px_20px_rgba(10,16,29,0.2)] active:scale-95 group">
                GET A FREE AUDIT
                <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
            </Link>
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
                className={index === 0 ? 'md:col-span-2' : ''}
              >
                {/* Notice the specific border hover class assigned directly from the array */}
                <Link 
                  href={service.link}
                  className={`relative block bg-white rounded-[2rem] border-2 border-gray-200 p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 overflow-hidden group h-full flex flex-col text-left ${service.cardHover}`}
                >
                  {/* Colored Top Border Indicator */}
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gray-200 transition-colors duration-300 ${service.colorline}`}></div>
                  
                  {/* Hover Blob Effect */}
                  <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${service.blob}`}></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      {/* Box Icon uses specific color assigned in array */}
                      <div className={`w-16 h-16 border rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-300 ${service.iconBg} ${service.iconBorder} ${service.iconText}`}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {service.iconPath}
                        </svg>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        {service.tag}
                      </span>
                    </div>

                    <h2 className={`text-3xl md:text-4xl font-black tracking-tighter text-[#0A101D] mb-4 transition-colors duration-300 ${service.iconText.replace('text-', 'group-hover:text-')}`}>
                      {service.title}
                    </h2>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10 flex-1">
                      {service.desc}
                    </p>

                    {/* Pseudo-Button styling changes color on hover based on array data */}
                    <div className="mt-auto pt-6 flex justify-start">
                      <span className={`inline-flex items-center justify-center gap-3 bg-[#0A101D] text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs transition-all duration-300 ${service.btnHover}`}>
                        Explore System
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- CLOSING CTA --- */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-[#0A101D] text-white py-16 px-6 md:p-24 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center shadow-[0_30px_60px_rgba(10,16,29,0.3)]"
           >
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 w-full">Not sure what you need?</h2>
                {/* <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-medium w-full">Get a completely free, deep-dive technical audit </p> */}
                <Link href="/free-audit" className="inline-flex items-center justify-center gap-2 bg-white text-[#0A101D] px-10 py-5 rounded-full font-black text-sm md:text-base hover:bg-gray-100 shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 uppercase tracking-widest">
                  Initiate System Audit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </div>
           </motion.div>
        </section>

      </main>
    </div>
  );
}