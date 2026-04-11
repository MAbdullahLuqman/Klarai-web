"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';

const TEAM = [
  {
    id: 'abdullah',
    name: 'Abdullah Luqman',
    role: 'Lead System Architect',
    image: '/1.jpg', 
    bio: 'The marketing industry is full of salespeople selling services they don\'t know how to execute. I architect the core systems, write the underlying code, and map the mathematical strategies that turn capital into exponential revenue growth.',
    skills: ['System Architecture', 'SEO/AEO', 'Next.js', 'Growth Strategy'],
    linkedin: 'https://www.linkedin.com/in/abdullahluqman/',
    tagColor: 'text-blue-200 bg-blue-900 border-blue-800',
    sysTag: 'sys.core'
  },
  {
    id: 'khubaib',
    name: 'Khubaib Amjad',
    role: 'Head of UI/UX & Frontend',
    image: '/2.jpg', 
    bio: '"Design is successful when the user doesn\'t have to think twice." Bridging the gap between the creative precision of Adobe/Figma and the logical rigor of C++ and Python. I ensure digital products feel natural, effortless, and technically sound.',
    skills: ['UI/UX Design', 'Figma', 'Tailwind CSS', 'Python'],
    linkedin: 'https://www.linkedin.com/in/khubaib-amjad-b669b327b/',
    tagColor: 'text-gray-300 bg-white/10 border-white/10',
    sysTag: 'sys.interface'
  },
  {
    id: 'anas',
    name: 'Muhammad Anas Nadeem',
    role: 'AI & Machine Learning Engineer',
    image: '/3.jpg', 
    bio: 'Building things that actually work in production. From document automation for government institutions to stress-testing LLMs at Invisible Technologies. I evaluate AI responses daily for accuracy and reasoning, making me unusually good at spotting where AI breaks.',
    skills: ['Python / Flask', 'OpenAI API', 'LangChain', 'Scikit-Learn'],
    linkedin: 'https://www.linkedin.com/in/muhammad-anas-nadeem-970300354/',
    tagColor: 'text-[#ADD8E6] bg-blue-950 border-blue-900',
    sysTag: 'sys.intelligence'
  }
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yText1 = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#fafafa] text-gray-900 font-sans selection:bg-blue-200 selection:text-[#0A101D] min-h-screen overflow-hidden">
      <GlobalHeader />

      <main className="pb-24">
        
        {/* --- 1. HERO SECTION --- */}
        <section className="relative px-6 pt-[120px] pb-24 md:pb-16 md:min-h-screen overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
          </div>
          <div className="absolute top-0 right-1/4 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-blue-300/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

          <motion.div style={{ y: yText1, opacity: opacityText }} className="relative z-10 max-w-[1400px] mx-auto w-full mt-0 pt-0">
            <span className="inline-block py-1.5 px-4 mb-6 md:mb-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              The Architecture Firm
            </span>
            <h1 className="text-5xl md:text-[8vw] leading-[0.9] md:leading-[0.85] font-black tracking-tighter uppercase text-gray-900 m-0 mb-10">
              We Are Not <br/>
              An Agency <br/>
              We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-950">Architects</span>
            </h1>
            
            {/* ADDED: High-Contrast CTA before dropping into the dark "Us" section */}
            <Link href="/free-audit" className="inline-flex items-center justify-center gap-3 bg-[#0A101D] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#008dd8] shadow-[0_8px_20px_rgba(10,16,29,0.2)] hover:shadow-[0_8px_25px_rgba(0,141,216,0.4)] transition-all active:scale-95 group">
                GET A FREE AUDIT
            </Link>
          </motion.div>
        </section>

        {/* --- 2. THE TEAM (Dark Blue BG) --- */}
        <section className="py-24 md:py-32 px-6 bg-[#0A101D] border-t border-white/5 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
          
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-[4vw] leading-none font-black tracking-tighter uppercase text-white mb-4">Built by Engineers.</h2>
              <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto">When you partner with Klarai, you aren't handed off to a junior account manager. You work directly with the system architects who are physically writing the code and mapping your strategy.</p>
            </div>

            <div className="bg-white/5 rounded-[2.5rem] md:rounded-[3rem] p-[1px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10 rounded-[2.5rem] overflow-hidden">
                {TEAM.map((member, idx) => (
                  <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="bg-[#0A101D] hover:bg-black/40 transition-colors duration-300 group flex flex-col p-8 md:p-10 text-left h-full"
                  >
                    <div className="flex justify-between items-start mb-6 md:mb-8">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 border border-white/10 text-[#0A101D] rounded-full flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-110 transition-transform duration-300">
                        <img 
                          src={member.image} 
                          alt={`${member.name} - Klarai Lead Architect`} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <span className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold bg-white/5 px-2.5 py-1 rounded-md border border-white/10 shadow-sm">{member.sysTag}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1 transition-colors duration-300 group-hover:text-blue-500">{member.name}</h3>
                    <p className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-400 mb-4 md:mb-6">{member.role}</p>
                    <p className="text-gray-300 md:text-gray-300/90 text-sm md:text-base font-medium leading-relaxed mb-6 md:mb-8 flex-1">{member.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6 md:mb-8 mt-auto">
                      {member.skills.map(skill => (
                        <span key={skill} className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${member.tagColor}`}>{skill}</span>
                      ))}
                    </div>
                    
                    {/* FIXED: LinkedIn Button (Solid Official Color, No Arrow) */}
                    <div className="pt-6 border-t-2 border-white/5">
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full text-center bg-[#0A66C2] text-white px-6 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:bg-[#004182] transition-colors shadow-md border border-white/10 active:scale-95"
                      >
                        LinkedIn
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* --- 3. THE DEATH OF GUESSWORK (Light Blue Theme) --- */}
        <section className="py-24 md:py-32 px-6 relative z-10 shadow-inner" style={{ background: 'linear-gradient(180deg, #ADD8E6 0%, #90C2D8 100%)' }}>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start relative z-10 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-[5vw] leading-[0.9] md:leading-[0.85] font-black tracking-tighter uppercase mb-4 md:mb-8 text-[#0A101D]">
                The Death <br/> Of Guesswork
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 md:space-y-8 text-lg md:text-2xl font-bold leading-relaxed text-gray-800"
            >
              <p>Klarai was founded out of deep frustration with the standard marketing agency model. A model built on rented templates, vanity metrics, and hollow promises.</p>
              <p>We believe that in a world drowning in digital noise, <span className="bg-[#0A101D] text-white px-3 py-1.5 uppercase tracking-widest text-xs md:text-sm rounded-sm">precision is the ultimate competitive advantage.</span></p>
              <p>We don't run isolated campaigns. We engineer mathematical, data-driven ecosystems. We look at your code, your search entity, and your conversion pathways, and we architect them for absolute dominance.</p>
            </motion.div>
          </div>
        </section>

        {/* --- 4. SYSTEM DIRECTIVES (Color Unified) --- */}
        <section className="bg-gray-50 py-24 md:py-32 px-6 relative z-10 border-t border-gray-200">
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
           
           <div className="max-w-[1400px] mx-auto relative z-10">
              <h2 className="text-4xl md:text-[4vw] leading-none font-black tracking-tighter uppercase text-[#0A101D] mb-4 text-center">System Directives</h2>
              <p className="text-center text-gray-500 font-mono text-xs md:text-sm uppercase tracking-widest mb-16">The laws governing our code & strategy</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border-2 border-gray-200 hover:border-blue-600 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] transition-all group flex flex-col md:min-h-[350px]">
                  <div className="text-blue-600 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 font-bold flex justify-between">
                    <span>Directive 01</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">sys.integrity</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-[#0A101D] group-hover:text-blue-600 transition-colors">Structural Integrity</h3>
                  <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed">A beautiful frontend is worthless if the backend architecture is flawed. We prioritize technical perfection, speed, and clean code above all else.</p>
                </div>
                
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border-2 border-gray-200 hover:border-[#0A101D] hover:shadow-[0_20px_40px_rgba(10,16,29,0.08)] transition-all group flex flex-col md:min-h-[350px] lg:translate-y-8">
                  <div className="text-gray-800 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 font-bold flex justify-between">
                    <span>Directive 02</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">sys.data</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-[#0A101D]">Radical Transparency</h3>
                  <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed">No black boxes. No vanity metrics. Our clients have absolute visibility into every sprint, every line of code, and every dollar of ad spend.</p>
                </div>
                
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border-2 border-gray-200 hover:border-[#008dd8] hover:shadow-[0_20px_40px_rgba(0,141,216,0.08)] transition-all group flex flex-col md:min-h-[350px] lg:translate-y-16">
                  <div className="text-[#008dd8] font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 font-bold flex justify-between">
                    <span>Directive 03</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">sys.scale</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-[#0A101D] group-hover:text-[#008dd8] transition-colors">Calculated Scale</h3>
                  <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed">We don't rely on viral hope. We rely on math. We build systems designed to predictably turn capital into exponential revenue growth.</p>
                </div>
              </div>
           </div>
        </section>

        {/* --- 5. CLOSING CTA (Unified Dark Theme) --- */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-20 mb-10">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-[#0A101D] text-white py-16 px-6 md:p-24 rounded-[2.5rem] md:rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center shadow-[0_30px_60px_rgba(10,16,29,0.3)]"
           >
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#008dd8]/20 rounded-full blur-[100px]"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6">Ready to upgrade your infrastructure?</h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto font-medium">Get a completely free, deep-dive technical audit. We will map out exactly where your business is losing money and how to fix it.</p>
                
                {/* Unified White Button */}
                <Link href="/free-audit" className="inline-flex items-center justify-center gap-2 bg-white text-[#0A101D] px-10 py-5 rounded-full font-black text-sm md:text-base hover:bg-gray-100 shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 uppercase tracking-widest w-full md:w-auto">
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