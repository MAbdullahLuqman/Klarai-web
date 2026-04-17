"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';

// ==========================================
// 1. SERVICES DATA
// ==========================================
const SERVICES_GRID = [
  {
    title: <>ADVANCED<br/>SEO</>,
    href: "/seo-services",
    icon: (
      <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="21" x2="16.65" y1="21" y2="16.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="11" x2="11" y1="8" y2="14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" x2="14" y1="11" y2="11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>ANSWER ENGINE<br/>OPTIMIZATION</>,
    href: "/aeo-services",
    icon: (
      <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 4v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 8h20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 4v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>PREDICTABLE<br/>REVENUE</>,
    href: "/meta-ads",
    icon: (
      <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 7 22 7 22 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>META<br/>ADS</>,
    href: "/meta-ads",
    icon: (
      <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="m3 11 18-5v12L3 14v-3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>ONGOING<br/>GROWTH SUPPORT</>,
    href: "/social-media-marketing",
    icon: (
      <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 12 12 8 8 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="16" x2="12" y2="8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

const WORDS = ["Growth", "Expansion", "Evolution"];

// ==========================================
// 2. FRAMER MOTION MICRO-INTERACTION (Hover Tilt)
// ==========================================
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      <div style={{ transform: "translateZ(20px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

// ==========================================
// 3. ANIMATION VARIANTS
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function RefinedPremiumHome() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Subtle Parallax for Hero
  const yText1 = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="bg-[#ffffff] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-[#0A101D] min-h-screen overflow-x-hidden">
      <GlobalHeader />
      
      {/* --- 1. FULLSCREEN HERO (Perfect Laptop Fit) --- */}
      <section className="relative px-6 w-full h-[100dvh] min-h-[600px] max-h-[900px] flex flex-col justify-center items-center overflow-hidden bg-white">
        
        {/* Soft ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] bg-[#008dd8]/[0.04] blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          style={{ y: yText1, opacity: opacityHero }} 
          className="relative z-10 w-full max-w-[1000px] text-center flex flex-col items-center"
        >
          
          <motion.span variants={itemVariants} className="inline-block py-1.5 px-4 mb-6 md:mb-8 rounded-full bg-white border border-gray-200 text-gray-400 text-[10px] font-black tracking-[0.25em] uppercase shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            Digital Architecture Firm
          </motion.span>

          <motion.h1 variants={itemVariants} className="text-[12vw] md:text-[6.5vw] lg:text-[6.5rem] leading-[0.95] font-black tracking-tighter uppercase text-[#0A101D] flex flex-col items-center gap-1 md:gap-2">
            <span>Advanced</span>
            
            <span className="flex items-center gap-3 md:gap-4 text-[#008dd8]">
              AI{" "}
              <span className="inline-grid [grid-template-areas:'stack'] text-left relative" style={{ perspective: "1000px" }}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={WORDS[wordIndex]}
                    initial={{ opacity: 0, rotateX: -90, y: 20 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 90, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                    className="[grid-area:stack] origin-center block"
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
            
            <span>Engines.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mt-6 md:mt-8 mb-10 md:mb-12 text-sm md:text-base lg:text-lg text-gray-500 font-medium max-w-2xl leading-relaxed px-4">
            From emerging startups to mature enterprises. We build digital infrastructure that doesn't just compete, it overwrites the algorithm.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <TiltCard>
              <Link href="/free-audit" className="flex items-center gap-2.5 bg-[#ccff00] text-[#0A101D] px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs shadow-[0_10px_30px_rgba(204,255,0,0.25)] hover:bg-[#b3e600] transition-all active:scale-95 border border-[#b3e600]/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Initiate Sequence
              </Link>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-300">
          <span className="text-[9px] uppercase tracking-[0.3em] font-black">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-[2px] h-8 bg-gradient-to-b from-gray-200 to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* --- 2. HELPING YOU RISE ABOVE (Services Grid) --- */}
      <section className="py-20 md:py-32 px-6 relative z-20 bg-[#fafafa] border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-24 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start"
            >
              <h2 className="text-3xl md:text-5xl leading-[1.05] font-black tracking-tighter uppercase mb-6 text-[#0A101D]">
                Helping You <br/> Rise Above <br/> The Current.
              </h2>
              <p className="text-sm md:text-base font-medium leading-relaxed text-gray-500 mb-8">
                From initial strategy to launch and ongoing refinement, we design and develop digital ecosystems built to lead, evolve, and scale with your business.
              </p>
              
              <Link href="/services" className="inline-flex items-center gap-2 bg-[#0A101D] text-white px-7 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:bg-[#008dd8] transition-all shadow-md active:scale-95 group">
                Explore Systems
                <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </motion.div>

            {/* Framer Motion Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
              style={{ perspective: "1500px" }}
            >
              {SERVICES_GRID.map((service, index) => (
                <TiltCard key={index} className="h-full">
                  <Link 
                    href={service.href} 
                    className="group flex flex-col items-start p-5 md:p-6 bg-white border border-gray-200 rounded-[20px] md:rounded-[24px] hover:border-[#008dd8]/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] transition-all duration-300 h-full justify-between min-h-[160px] md:min-h-[180px]"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#008dd8] group-hover:text-white transition-colors duration-300 mb-5 md:mb-6 shadow-sm">
                      {service.icon}
                    </div>
                    <h3 className="text-[#0A101D] font-black tracking-tight text-[10px] md:text-[11px] uppercase leading-tight">
                      {service.title}
                    </h3>
                  </Link>
                </TiltCard>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- 3. SCALING THE NEXT WAVE (Bento Box) --- */}
      <section className="py-20 md:py-32 px-6 relative z-10 bg-white">
         <div className="max-w-[1200px] mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl leading-[1] font-black tracking-tighter uppercase text-[#0A101D] mb-4 text-center">
              Scaling The Next Wave
            </h2>
            <p className="text-center text-gray-400 font-mono text-[10px] md:text-[11px] uppercase tracking-widest mb-12 md:mb-16">
              Select capabilities & architecture
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              
              <TiltCard>
                <div className="bg-[#fafafa] rounded-[2rem] p-8 md:p-10 border border-gray-100 hover:border-[#008dd8] hover:shadow-[0_15px_30px_rgba(0,141,216,0.06)] transition-all group flex flex-col justify-between h-full min-h-[280px] md:min-h-[300px]">
                  <div className="text-[#008dd8] font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Search</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 text-[#0A101D]">Algorithmic Dominance</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">We mathematically map search intent to site architecture, ensuring your brand captures high-value traffic before competitors realize it exists.</p>
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="bg-[#fafafa] rounded-[2rem] p-8 md:p-10 border border-gray-100 hover:border-[#ccff00] hover:shadow-[0_15px_30px_rgba(204,255,0,0.15)] transition-all group flex flex-col justify-between h-full min-h-[280px] md:min-h-[300px] md:translate-y-8">
                  <div className="text-gray-800 font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Conversion</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 text-[#0A101D]">Frictionless Flow</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Beautiful design is useless if it doesn't convert. We engineer user journeys that obliterate friction and turn passive traffic into predictable revenue.</p>
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="bg-[#fafafa] rounded-[2rem] p-8 md:p-10 border border-gray-100 hover:border-[#0A101D] hover:shadow-[0_15px_30px_rgba(10,16,29,0.06)] transition-all group flex flex-col justify-between h-full min-h-[280px] md:min-h-[300px]">
                  <div className="text-gray-600 font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Future</div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 text-[#0A101D]">Answer Engines</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">As search evolves into AI conversations, we optimize your brand's digital entity so models like ChatGPT recommend you as the undisputed authority.</p>
                  </div>
                </div>
              </TiltCard>

            </div>
         </div>
      </section>

      {/* --- 4. DIGITAL FLAGSHIP FOOTER CTA --- */}
      <section className="py-24 md:py-40 px-6 border-t border-gray-100 relative overflow-hidden bg-[#fafafa]">
        <div className="max-w-[1000px] mx-auto text-center relative z-10 flex flex-col items-center">
          
          <h2 className="text-4xl md:text-5xl lg:text-[6rem] leading-[0.9] font-black tracking-tighter uppercase text-[#0A101D] mb-8 md:mb-10">
            Digital <br/> Flagship.
          </h2>
          
          <TiltCard>
            <Link href="/free-audit" className="flex items-center gap-2.5 bg-[#ccff00] text-[#050505] px-10 py-4 rounded-full font-black uppercase tracking-widest text-[11px] md:text-xs hover:bg-[#b3e600] shadow-[0_15px_30px_rgba(204,255,0,0.25)] transition-all active:scale-95 border border-[#b3e600]/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Initiate Sequence
            </Link>
          </TiltCard>

        </div>
      </section>

    </div>
  );
}