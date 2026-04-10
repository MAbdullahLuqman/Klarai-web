"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
const SERVICES_GRID = [
  {
    title: <>ADVANCED<br/>SEO</>,
    href: "/seo-services",
    icon: (
      <svg className="w-10 h-10 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="21" x2="16.65" y1="21" y2="16.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="11" x2="11" y1="8" y2="14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" x2="14" y1="11" y2="11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>ANSWER<br/>ENGINE<br/>OPTIMIZATION</>,
    href: "/aeo-services",
    icon: (
      <svg className="w-10 h-10 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" x2="12.01" y1="17" y2="17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>HIGH CONVERTING<br/>WEB DESIGN</>,
    href: "/web-development",
    icon: (
      <svg className="w-10 h-10 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 4v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 8h20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 4v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>PREDICTABLE<br/>REVENUE</>,
    href: "/services",
    icon: (
      <svg className="w-10 h-10 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 7 22 7 22 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>META ADS</>,
    href: "/meta-ads",
    icon: (
      <svg className="w-10 h-10 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="m3 11 18-5v12L3 14v-3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>ONGOING<br/>GROWTH<br/>SUPPORT</>,
    href: "/social-media-marketing",
    icon: (
      <svg className="w-10 h-10 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 12 12 8 8 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="16" x2="12" y2="8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

// ... (Inside your component, update the Right Column Grid rendering) ...

            {/* Right Column: Interactive Services Grid with Perfect LIME GREEN Borders */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#ccff00] rounded-[2.5rem] md:rounded-[3rem] p-[1px] shadow-[0_0_40px_rgba(204,255,0,0.15)]"
            >
              {/* The 1px gap reveals the lime green background, creating the exact lines from your image */}
              <div className="grid grid-cols-2 gap-[1px] bg-[#ccff00] rounded-[2.5rem] overflow-hidden">
                {SERVICES_GRID.map((service, index) => (
                  <Link 
                    href={service.href} 
                    key={index}
                    className="group flex flex-col items-start p-6 md:p-8 bg-[#111111] hover:bg-[#1a1a1a] transition-colors h-full"
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-[#ccff00] font-black tracking-tight text-[13px] md:text-base leading-snug mt-8">
                      {service.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </motion.div>

export default function LightBrutalistHome() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yText1 = useTransform(scrollYProgress, [0, 0.3], [0, -150]);

  return (
    <div ref={containerRef} className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-black min-h-screen overflow-hidden">
      
      {/* --- 1. LIGHT HERO --- */}
     {/* --- 1. LIGHT HERO --- */}
      <section className="relative px-6 pt-[140px] md:pt-[180px] pb-16 md:pb-24 overflow-hidden flex flex-col justify-center min-h-[85vh] md:min-h-[90vh]">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
        
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/4 left-0 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-blue-400/10 blur-[130px] rounded-full pointer-events-none -translate-x-1/2"></div>

        <motion.div style={{ y: yText1 }} className="relative z-10 max-w-[1400px] mx-auto w-full mt-4">
          
          {/* UI/UX ARCHITECTURE: 
            Using flex-col ensures perfect, predictable stacking. 
            leading-[0.85] gives it that premium, tight "touching" look from your mockup.
            text-[#0A101D] gives a richer, deeper almost-black for better contrast.
          */}
          <h1 className="flex flex-col text-[13.5vw] md:text-[8vw] leading-[0.85] md:leading-[0.82] font-black tracking-tighter uppercase text-[#0A101D] m-0 p-0">
            <span>Advanced</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 pb-1 md:pb-2">
              AI Growth
            </span>
            <span>Engines</span>
          </h1>
          
          <p className="mt-8 md:mt-10 mb-8 md:mb-12 text-lg md:text-[22px] text-gray-500 font-medium max-w-2xl leading-relaxed">
            From emerging startups to mature enterprises. We build digital infrastructure that doesn't just compete, it overwrites the algorithm.
          </p>
          
          <Link href="/free-audit" className="inline-block bg-[#0A101D] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95">
            Get a Free Audit
          </Link>

        </motion.div>
      </section>

      {/* --- 2. THE NEON CUT (High Contrast Section + Grid) --- */}
      <section className="bg-[#ccff00] text-[#050505] py-24 md:py-32 px-6 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Column: Messaging */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start"
            >
              <h2 className="text-5xl md:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase mb-6 md:mb-8 text-gray-900">
                Helping You <br/> Rise Above <br/> The Current.
              </h2>
              <p className="text-lg md:text-2xl font leading-relaxed max-w-xl text-gray-900 mb-8 md:mb-10">
                From initial strategy to launch and ongoing refinement, we design and develop digital ecosystems built to lead, evolve, and scale with your business.
              </p>
              <Link href="/services" className="inline-block bg-gray-900 text-[#ccff00] px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:bg-black hover:scale-105 transition-all shadow-2xl shadow-gray-900/20">
                Explore Systems
              </Link>
            </motion.div>

            {/* Right Column: Interactive Services Grid with Perfect Border Lines */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
            >
              {/* gap-[1px] with a bg color creates the perfect thin lines between items */}
              <div className="grid grid-cols-2 gap-[1px] bg-white/10">
                {SERVICES_GRID.map((service, index) => (
                  <Link 
                    href={service.href} 
                    key={index}
                    className="group flex flex-col items-start p-6 md:p-8 bg-[#111111] hover:bg-[#1a1a1a] transition-colors h-full"
                  >
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    {/* FIXED: Text is stacked exactly like the screenshot */}
                    <h3 className="text-[#ccff00] font-black tracking-tight text-[13px] md:text-base leading-snug mt-8">
                      {service.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </motion.div>

          </div>
          
        </div>
      </section>

      {/* --- 3. DIGITAL CAPABILITIES (Light Grid) --- */}
      <section className="bg-white py-24 md:py-32 px-6 relative z-10 border-t border-gray-200">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

         <div className="max-w-[1400px] mx-auto relative z-10">
            <h2 className="text-4xl md:text-[5vw] leading-none font-black tracking-tighter uppercase text-gray-900 mb-6 text-center">
              Scaling The Next Wave
            </h2>
            <p className="text-center text-gray-400 font-mono text-xs md:text-sm uppercase tracking-widest mb-16 md:mb-20">Select capabilities & architecture</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-gray-50 rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 hover:border-cyan-400 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)] transition-all group flex flex-col justify-between md:min-h-[400px]">
                <div className="text-cyan-500 font-mono text-[24px] md:text-24px uppercase tracking-widest mb-6 font-bold"> Search</div>
                <div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Algorithmic Dominance</h3>
                  <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">We mathematically map search intent to site architecture, ensuring your brand captures high-value traffic before competitors even realize it exists.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 hover:border-[#ccff00] hover:shadow-[0_20px_40px_rgba(204,255,0,0.15)] transition-all group flex flex-col justify-between md:min-h-[400px] lg:translate-y-12">
                <div className="text-lime-600 font-mono text-[24px] md:text-24 uppercase tracking-widest mb-6 font-bold">Conversion</div>
                <div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Frictionless Flow</h3>
                  <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">Beautiful design is useless if it doesn't convert. We engineer user journeys that obliterate friction and turn passive traffic into predictable revenue.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 hover:border-fuchsia-400 hover:shadow-[0_20px_40px_rgba(232,121,249,0.1)] transition-all group flex flex-col justify-between md:min-h-[400px]">
                <div className="text-fuchsia-500 font-mono text-[24px] md:text-24 uppercase tracking-widest mb-6 font-bold">Future</div>
                <div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Answer Engines</h3>
                  <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">As search evolves into AI conversations, we optimize your brand's digital entity so models like ChatGPT recommend you as the undisputed authority.</p>
                </div>
              </div>

            </div>
         </div>
      </section>

      {/* --- 4. MASSIVE FOOTER CTA --- */}
      <section className="bg-gray-50 pt-24 md:pt-32 pb-12 px-6 border-t border-gray-200 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-cyan-300/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        {/* FIXED: Removed the email form completely, centered the Digital Flagship CTA */}
        <div className="max-w-[1400px] mx-auto text-center relative z-10 flex flex-col items-center">
          <h2 className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter uppercase text-gray-900 mb-10">
            Digital <br/> Flagship.
          </h2>
          <Link href="/free-audit" className="inline-block bg-[#ccff00] text-gray-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm md:text-lg hover:bg-blue-600 hover:text-white hover:scale-105 transition-all shadow-lg active:scale-95">
            Initiate Sequence
          </Link>
        </div>

       
      </section>

    </div>
  );
}