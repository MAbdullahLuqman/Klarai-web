"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function LightBrutalistHome() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Massive text scroll effects
  const yText1 = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const yText2 = useTransform(scrollYProgress, [0.2, 0.5], [100, -100]);

  return (
    <div ref={containerRef} className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-black min-h-screen overflow-hidden">
      
      {/* --- 1. LIGHT HERO (Grid Background) --- */}
      <section className="relative min-h-[100vh] flex flex-col justify-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Subtle Dark Cyber Grid on Light Background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
        
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div style={{ y: yText1 }} className="relative z-10 max-w-[1400px] mx-auto w-full">
          <h1 className="text-[12vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase text-gray-900">
            ADVANCED <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">AI Growth </span> <br/>
            Engines<br/>
           
          </h1>
          <p className="mt-12 text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed">
            From emerging startups to billion-dollar enterprises. We build digital infrastructure that doesn't just compete—it overwrites the algorithm.
          </p>
        </motion.div>
      </section>

      {/* --- 2. THE NEON CUT (High Contrast Section) --- */}
      <section className="bg-[#ccff00] text-[#050505] py-32 px-6 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1400px] mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[10vw] md:text-[6vw] leading-[0.85] font-black tracking-tighter uppercase mb-16 text-gray-900">
              Helping You <br/> Rise Above <br/> The Current.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-xl text-gray-900">
                From initial strategy to launch and ongoing refinement, we design and develop digital ecosystems built to lead, evolve, and scale with your business.
              </p>
              <div className="flex md:justify-end">
                <Link href="/services" className="bg-gray-900 text-[#ccff00] px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-black hover:scale-105 transition-all shadow-xl shadow-gray-900/20">
                  Explore Systems
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Massive Services Marquee Text */}
          <motion.div style={{ y: yText2 }} className="mt-32">
            <h3 className="text-[8vw] md:text-[5.5vw] leading-[0.9] font-black tracking-tighter uppercase text-gray-900/90 text-justify">
              ADVANCED SEO / ANSWER ENGINE OPTIMIZATION / HIGH-CONVERTING WEB DESIGN / PREDICTABLE REVENUE / META ADS / <span className="text-gray-900/30">ONGOING GROWTH SUPPORT.</span>
            </h3>
          </motion.div>
        </div>
      </section>

      {/* --- 3. DIGITAL CAPABILITIES (Light Grid) --- */}
      <section className="bg-white py-32 px-6 relative z-10 border-t border-gray-200">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

         <div className="max-w-[1400px] mx-auto relative z-10">
            <h2 className="text-[8vw] md:text-[5vw] leading-none font-black tracking-tighter uppercase text-gray-900 mb-6 text-center">
              Scaling The Next Wave
            </h2>
            <p className="text-center text-gray-400 font-mono text-sm uppercase tracking-widest mb-20">Select capabilities & architecture</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-gray-50 rounded-[2rem] p-10 border-2 border-gray-100 hover:border-cyan-400 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)] transition-all group flex flex-col justify-between min-h-[400px]">
                <div className="text-cyan-500 font-mono text-xs uppercase tracking-widest mb-6 font-bold">Search</div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Algorithmic Dominance</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">We mathematically map search intent to site architecture, ensuring your brand captures high-value traffic before competitors even realize it exists.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-10 border-2 border-gray-100 hover:border-[#ccff00] hover:shadow-[0_20px_40px_rgba(204,255,0,0.15)] transition-all group flex flex-col justify-between min-h-[400px] lg:translate-y-12">
                <div className="text-lime-600 font-mono text-xs uppercase tracking-widest mb-6 font-bold">Conversion</div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Frictionless Flow</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">Beautiful design is useless if it doesn't convert. We engineer user journeys that obliterate friction and turn passive traffic into predictable revenue.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-10 border-2 border-gray-100 hover:border-fuchsia-400 hover:shadow-[0_20px_40px_rgba(232,121,249,0.1)] transition-all group flex flex-col justify-between min-h-[400px]">
                <div className="text-fuchsia-500 font-mono text-xs uppercase tracking-widest mb-6 font-bold">Future</div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Answer Engines</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">As search evolves into AI conversations, we optimize your brand's digital entity so models like ChatGPT recommend you as the undisputed authority.</p>
                </div>
              </div>

            </div>
         </div>
      </section>

      {/* --- 4. MASSIVE FOOTER CTA (Light Mode Adapation) --- */}
      <section className="bg-gray-50 pt-32 pb-12 px-6 border-t border-gray-200 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-cyan-300/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
          
          <div className="w-full md:w-1/2">
            <h2 className="text-[12vw] md:text-[8vw] leading-[0.8] font-black tracking-tighter uppercase text-gray-900 mb-10">
              Digital <br/> Flagship.
            </h2>
            <Link href="/free-audit" className="inline-block bg-[#ccff00] text-gray-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-lg hover:bg-blue-600 hover:text-white hover:scale-105 transition-all shadow-lg">
              Initiate Sequence
            </Link>
          </div>

          <div className="w-full md:w-1/2 flex flex-col md:items-end text-left md:text-right">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">Planning a Project?</h3>
            <p className="text-gray-500 mb-8 max-w-md font-medium text-lg">
              Get instant access to our system architects. We will map out a custom blueprint for driving your business forward.
            </p>
          </div>

        </div>

       
      </section>

    </div>
  );
}