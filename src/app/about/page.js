"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

const TEAM = [
  {
    id: 'abdullah',
    name: 'Abdullah Luqman',
    role: 'Lead System Architect',
    bio: 'The marketing industry is full of salespeople selling services they don\'t know how to execute. I architect the core systems, write the underlying code, and map the mathematical strategies that turn capital into exponential revenue growth.',
    skills: ['System Architecture', 'SEO/AEO', 'Next.js', 'Growth Strategy'],
    linkedin: 'https://www.linkedin.com/in/abdullahluqman/',
    color: 'hover:border-blue-500 hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)]',
    tagColor: 'text-blue-600 bg-blue-50 border-blue-100',
    sysTag: 'sys.core'
  },
  {
    id: 'khubaib',
    name: 'Khubaib Amjad',
    role: 'Head of UI/UX & Frontend',
    bio: '"Design is successful when the user doesn\'t have to think twice." Bridging the gap between the creative precision of Adobe/Figma and the logical rigor of C++ and Python. I ensure digital products feel natural, effortless, and technically sound.',
    skills: ['UI/UX Design', 'Figma', 'Tailwind CSS', 'Python'],
    linkedin: 'https://www.linkedin.com/in/khubaib-amjad-b669b327b/',
    color: 'hover:border-fuchsia-500 hover:shadow-[0_20px_40px_rgba(217,70,239,0.1)]',
    tagColor: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100',
    sysTag: 'sys.interface'
  },
  {
    id: 'anas',
    name: 'Muhammad Anas Nadeem',
    role: 'AI & Machine Learning Engineer',
    bio: 'Building things that actually work in production. From document automation for government institutions to stress-testing LLMs at Invisible Technologies. I evaluate AI responses daily for accuracy and reasoning, making me unusually good at spotting where AI breaks.',
    skills: ['Python / Flask', 'OpenAI API', 'LangChain', 'Scikit-Learn'],
    linkedin: 'https://www.linkedin.com/in/muhammad-anas-nadeem-970300354/',
    color: 'hover:border-cyan-500 hover:shadow-[0_20px_40px_rgba(6,182,212,0.1)]',
    tagColor: 'text-cyan-600 bg-cyan-50 border-cyan-100',
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
    <div ref={containerRef} className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-black min-h-screen overflow-hidden">
      <GlobalHeader />

      <main className="pb-24">
        
        {/* FIXED: Changed to md:min-h-screen so mobile drops the extra height */}
        <section className="relative px-6 pt-[120px] pb-24 md:pb-16 md:min-h-screen overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
          </div>
          <div className="absolute top-0 right-1/4 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-cyan-400/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

          <motion.div style={{ y: yText1, opacity: opacityText }} className="relative z-10 max-w-[1400px] mx-auto w-full mt-0 pt-0">
            <span className="inline-block py-1.5 px-4 mb-6 md:mb-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              The Architecture Firm
            </span>
            <h1 className="text-6xl md:text-[8vw] leading-[0.9] md:leading-[0.85] font-black tracking-tighter uppercase text-gray-900 m-0">
              We Are Not <br/>
              An Agency. <br/>
              We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Architects</span>.
            </h1>
            
          </motion.div>
          
        </section>

        {/* --- THE REST REMAINS UNCHANGED --- */}
        <section className="bg-[#ccff00] text-[#050505] py-24 md:py-32 px-6 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-y border-gray-200">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-[5vw] leading-[0.9] md:leading-[0.85] font-black tracking-tighter uppercase mb-4 md:mb-8 text-gray-900">
                The Death <br/> Of Guesswork.
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6 md:space-y-8 text-lg md:text-2xl font-bold leading-relaxed text-gray-900"
            >
              <p>Klarai was founded out of deep frustration with the standard marketing agency model. A model built on rented templates, vanity metrics, and hollow promises.</p>
              <p>We believe that in a world drowning in digital noise, <span className="bg-black text-[#ccff00] px-2 py-1 uppercase tracking-widest text-xs md:text-sm">precision is the ultimate competitive advantage</span>.</p>
              <p>We don't run isolated campaigns. We engineer mathematical, data-driven ecosystems. We look at your code, your search entity, and your conversion pathways, and we architect them for absolute dominance.</p>
            </motion.div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-32 px-6 relative z-10">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
           <div className="max-w-[1400px] mx-auto relative z-10">
              <h2 className="text-4xl md:text-[4vw] leading-none font-black tracking-tighter uppercase text-gray-900 mb-4 text-center">System Directives</h2>
              <p className="text-center text-gray-400 font-mono text-xs md:text-sm uppercase tracking-widest mb-16">The laws governing our code & strategy</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 hover:border-blue-500 transition-all group flex flex-col md:min-h-[350px]">
                  <div className="text-blue-600 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 font-bold flex justify-between">
                    <span>Directive .01</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">sys.integrity</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-gray-900">Structural Integrity</h3>
                  <p className="text-gray-600 md:text-gray-500 text-sm md:text-base font-medium leading-relaxed">A beautiful frontend is worthless if the backend architecture is flawed. We prioritize technical perfection, speed, and clean code above all else.</p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 hover:border-fuchsia-500 transition-all group flex flex-col md:min-h-[350px] lg:translate-y-8">
                  <div className="text-fuchsia-500 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 font-bold flex justify-between">
                    <span>Directive .02</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-fuchsia-400">sys.data</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-gray-900">Radical Transparency</h3>
                  <p className="text-gray-600 md:text-gray-500 text-sm md:text-base font-medium leading-relaxed">No black boxes. No vanity metrics. Our clients have absolute visibility into every sprint, every line of code, and every dollar of ad spend.</p>
                </div>
                <div className="bg-gray-50 rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 hover:border-cyan-500 transition-all group flex flex-col md:min-h-[350px] lg:translate-y-16">
                  <div className="text-cyan-500 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 font-bold flex justify-between">
                    <span>Directive .03</span><span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400">sys.scale</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-gray-900">Calculated Scale</h3>
                  <p className="text-gray-600 md:text-gray-500 text-sm md:text-base font-medium leading-relaxed">We don't rely on viral hope. We rely on math. We build systems designed to predictably turn capital into exponential revenue growth.</p>
                </div>
              </div>
           </div>
        </section>

        <section className="py-24 md:py-32 px-6 bg-gray-50 border-t border-gray-200 relative">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-4xl md:text-[4vw] leading-none font-black tracking-tighter uppercase text-gray-900 mb-4">Built by Engineers.</h2>
              <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">When you partner with Klarai, you aren't handed off to a junior account manager. You work directly with the system architects who are physically writing the code and mapping your strategy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {TEAM.map((member, idx) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className={`bg-white rounded-[2rem] p-8 md:p-10 border-2 border-gray-100 transition-all duration-300 group flex flex-col ${member.color}`}
                >
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {member.name.charAt(0)}
                    </div>
                    <span className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] uppercase tracking-widest text-gray-400 font-bold">{member.sysTag}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-400 mb-4 md:mb-6">{member.role}</p>
                  <p className="text-gray-600 md:text-gray-500 text-sm md:text-base font-medium leading-relaxed mb-6 md:mb-8 flex-1">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-6 md:mb-8 mt-auto">
                    {member.skills.map(skill => (
                      <span key={skill} className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${member.tagColor}`}>{skill}</span>
                    ))}
                  </div>
                  <div className="pt-6 border-t-2 border-gray-100">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs md:text-sm font-black uppercase tracking-widest text-gray-900 hover:text-blue-600 transition-colors">
                      Initialize Link <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-16 md:mt-20 mb-10">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-10 md:p-24 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden text-center shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
           >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#00ffcc 1px, transparent 1px), linear-gradient(90deg, #00ffcc 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-[#ccff00]/20 rounded-full blur-[120px]"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6">Ready to upgrade your infrastructure?</h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto font-medium">Get a completely free, deep-dive technical audit. We will map out exactly where your business is losing money and how to fix it.</p>
                <Link href="/free-audit" className="inline-block w-full md:w-auto bg-[#ccff00] text-gray-900 px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-sm md:text-lg hover:scale-105 shadow-[0_15px_30px_rgba(204,255,0,0.2)] hover:bg-white transition-all active:scale-95 uppercase tracking-widest">
                  Initiate System Audit
                </Link>
              </div>
           </motion.div>
        </section>
      </main>
    </div>
  );
}