"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';
import AuditSearchBar from '@/components/AuditSearchBar';

// ==========================================
// FAST LOADING SCREEN
// ==========================================
const SlidingDoorsLoader = ({ onComplete }) => {
  return (
    <motion.div 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-transparent"
    >
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
        className="absolute left-0 top-0 w-1/2 h-full bg-[#0A101D] origin-left border-r border-[#008dd8]/20 shadow-2xl"
      />
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
        onAnimationComplete={onComplete}
        className="absolute right-0 top-0 w-1/2 h-full bg-[#0A101D] origin-right border-l border-[#008dd8]/20 shadow-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.95, 1, 1, 1.05] }}
        transition={{ duration: 0.9, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
        className="relative z-10 text-white font-sans text-5xl md:text-7xl font-black tracking-tighter"
      >
        Klar AI.
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// 1. SERVICES DATA
// ==========================================
const SERVICES_GRID = [
  {
    title: <>ADVANCED<br/>SEO</>,
    href: "/seo-services",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 7 22 7 22 13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>META<br/>ADS</>,
    href: "/meta-ads",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="m3 11 18-5v12L3 14v-3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    title: <>ONGOING<br/>GROWTH SUPPORT</>,
    href: "/social-media-marketing",
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16 12 12 8 8 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="16" x2="12" y2="8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

// ==========================================
// 2. FRAMER MOTION MICRO-INTERACTIONS
// ==========================================
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth > 768);
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e) => {
    if (!isDesktop) return;
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
      <div style={{ transform: isDesktop ? "translateZ(10px)" : "none" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

const Spotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0, 141, 216, 0.05), transparent 80%)`;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 transition-duration-300"
      style={{ background }}
    />
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function RefinedPremiumHome() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yText1 = useTransform(scrollYProgress, [0, 0.2], [0, -30]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [loading]);

  return (
    <div ref={containerRef} className="bg-[#030303] text-gray-900 font-sans selection:bg-[#008dd8] selection:text-white min-h-screen relative overflow-hidden">

      <AnimatePresence>
        {loading && <SlidingDoorsLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <GlobalHeader />
      <Spotlight />

      <main className="w-full flex flex-col relative">

        {/* ============================================================
            SECTION 1: BRAND HERO (Video BG, STRICTLY LEFT ALIGNED)
            ============================================================ */}
        <section className="w-full min-h-screen flex flex-col justify-center relative overflow-hidden bg-[#050505] pt-[140px] pb-20 md:py-32 px-6 lg:px-12">
          
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <motion.div 
              animate={{ scale: [1.05, 1.1, 1.05] }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-full h-full"
            >
              <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
                <source src="/mp4.mp4" type="video/mp4" />
              </video>
            </motion.div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-[#030303]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent"></div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: yText1 }}
            className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-start text-left"
          >
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] leading-[1.1] font-medium tracking-tight text-white mb-8 sm:mb-10 drop-shadow-2xl">
              Visibility is not <br className="hidden md:block" />
              an accident. <br className="hidden md:block" />
              Neither is trust.
            </motion.h1>

            <motion.div variants={itemVariants}>
              <Link href="/free-audit" className="inline-flex justify-center items-center bg-white text-black px-7 sm:px-8 py-3.5 sm:py-4 rounded-[2rem] font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                Enquire Now
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-6 md:bottom-10 left-6 sm:left-12 flex items-center gap-4 opacity-50 z-10 hidden sm:flex">
            <div className="w-5 h-8 rounded-full border-2 border-gray-500 flex justify-center pt-1.5">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-1 h-1.5 bg-gray-400 rounded-full" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">Scroll to explore</span>
          </motion.div>
        </section>

        {/* ============================================================
            SECTION 2: THE SCANNER 
            ============================================================ */}
        <section className="w-full bg-[#fafafa] py-24 md:py-32 px-6 relative overflow-hidden flex flex-col items-center text-center z-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="relative z-10 w-full max-w-[800px] mx-auto flex flex-col items-center">
            
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 bg-blue-50 border border-blue-100 py-1.5 px-4 rounded-full">
              <svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span className="text-[#008dd8] text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">Free AI Audit Tool</span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-[1.1] font-black tracking-tighter uppercase text-[#0A101D] mb-6">
              Discover Why<br/>
              <span className="text-[#008dd8]">Competitors</span> Outrank You
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed mb-8 md:mb-10">
              Enter any UK website URL below. Our AI scans your architecture, content gaps, and technical SEO in 30 seconds — completely free.
            </motion.p>

            <motion.div variants={itemVariants} className="w-full mb-8">
              <AuditSearchBar />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">
              <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> 100% Free</span>
              <span className="flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> No Credit Card</span>
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================================
            SECTION 3: SERVICES GRID 
            ============================================================ */}
        <section className="w-full bg-[#0A101D] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,141,216,0.05),transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-center">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="flex flex-col items-start text-left">
              <motion.span variants={itemVariants} className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Our Capabilities</motion.span>
              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] font-black tracking-tighter uppercase mb-6 text-white">
                Helping You <br/> Rise Above <br/> The Noise.
              </motion.h2>
              <motion.p variants={itemVariants} className="text-sm md:text-base font-medium leading-relaxed text-gray-400 mb-8 md:mb-10 max-w-md">
                From initial search strategy to launch and ongoing refinement, we design and develop digital ecosystems built to lead, evolve, and scale with your business.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link href="/services" className="inline-flex justify-center items-center gap-2 bg-[#008dd8] text-white px-7 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#0077b6] transition-all shadow-md active:scale-95">
                  Explore Systems <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" style={{ perspective: "1000px" }}>
              {SERVICES_GRID.map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <TiltCard className="h-full">
                    <Link href={service.href} className="group flex flex-col items-start text-left p-5 bg-[#111827] border border-white/5 rounded-[1.25rem] hover:border-[#008dd8]/60 hover:shadow-[0_10px_25px_rgba(0,141,216,0.1)] transition-all duration-300 h-full min-h-[160px] justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#0A101D] flex items-center justify-center text-gray-500 group-hover:bg-[#008dd8] group-hover:text-white transition-colors duration-300 mb-4 shadow-sm border border-white/5 group-hover:border-transparent">
                        {service.icon}
                      </div>
                      <h3 className="text-white font-black tracking-tight text-[11px] uppercase leading-tight">{service.title}</h3>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4: FEATURED PROJECTS (HARDCODED EXACT HEIGHTS)
            ============================================================ */}
        <section className="w-full bg-[#fafafa] py-24 md:py-32 px-6 relative overflow-hidden border-t border-gray-100">
          <div className="max-w-[1200px] w-full mx-auto relative z-10">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] md:items-baseline justify-between mb-16 gap-6 px-6">
                <motion.p variants={itemVariants} className="text-gray-500 font-medium text-sm md:text-base max-w-[200px] leading-snug text-left hidden md:block">
                    Unique solutions<br/>that generate leads
                </motion.p>
                <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#0A101D] text-center">
                    Featured Projects
                </motion.h2>
                <div className="hidden md:block"></div>
            </motion.div>

            {/* THE FIX: items-stretch forces grid items to be equal height, 
                but we STILL enforce a hard height on the image boxes to be 100% safe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
              
              {/* Project 1: PitchSide AI */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="h-full">
                <Link href="/portfolio" className="group flex flex-col h-full bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#008dd8]/30 transition-all duration-300 text-left">
                  <div className="flex flex-wrap items-center gap-3 mb-6 shrink-0">
                    <h3 className="text-2xl font-black tracking-tight text-[#0A101D] group-hover:text-[#008dd8] transition-colors">Pitchside.ai</h3>
                    <span className="text-gray-400 text-sm font-medium">/ 2026</span>
                  </div>
                  
                  {/* THE STRICT HEIGHT FIX: h-[300px] to h-[400px] ensures they never collapse or stretch */}
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-[1.5rem] overflow-hidden bg-gray-200 mt-auto border border-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
                      alt="Pitchside AI Interface" 
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Project 2: Atelier */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="h-full">
                <Link href="/portfolio" className="group flex flex-col h-full bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[#d4af37]/30 transition-all duration-300 text-left">
                  <div className="flex flex-wrap items-center gap-3 mb-6 shrink-0">
                    <h3 className="text-2xl font-black tracking-tight text-[#0A101D] group-hover:text-[#d4af37] transition-colors">Atelier Studio</h3>
                    <span className="text-gray-400 text-sm font-medium">/ 2025</span>
                  </div>
                  
                  {/* THE STRICT HEIGHT FIX: Exactly the same as Project 1 */}
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-[1.5rem] overflow-hidden bg-gray-200 mt-auto border border-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop" 
                      alt="Atelier Studio Interface" 
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105" 
                    />
                  </div>
                </Link>
              </motion.div>

            </div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="mt-12 text-center md:text-center text-left relative z-10">
              <Link href="/portfolio" className="inline-flex justify-center items-center gap-2 bg-[#0A101D] text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#008dd8] transition-all active:scale-95">
                View All Projects
              </Link>
            </motion.div>

          </div>
        </section>

        {/* ============================================================
            SECTION 5: SCALING ARCHITECTURE 
            ============================================================ */}
        <section className="w-full bg-white py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="max-w-[1200px] w-full mx-auto relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}>
              
              <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
                <span className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-3 block">The Architecture</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] font-black tracking-tighter uppercase text-[#0A101D] mb-4">
                  Scaling The Next Wave
                </h2>
                <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">
                  Select capabilities & architecture
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="bg-[#fafafa] rounded-[1.5rem] p-8 border border-gray-200 hover:border-[#008dd8] hover:shadow-xl transition-all flex flex-col justify-between h-full min-h-[240px] text-left">
                      <div className="text-[#008dd8] font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Search</div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-[#0A101D]">Algorithmic Dominance</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">We mathematically map search intent to site architecture, ensuring your brand captures high-value traffic before competitors.</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="bg-[#fafafa] rounded-[1.5rem] p-8 border border-gray-200 hover:border-[#0A101D] hover:shadow-xl transition-all flex flex-col justify-between h-full min-h-[240px] md:translate-y-6 text-left">
                      <div className="text-gray-800 font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Conversion</div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-[#0A101D]">Frictionless Flow</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">Beautiful design is useless if it doesn't convert. We engineer user journeys that obliterate friction.</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TiltCard>
                    <div className="bg-[#fafafa] rounded-[1.5rem] p-8 border border-gray-200 hover:border-gray-500 hover:shadow-xl transition-all flex flex-col justify-between h-full min-h-[240px] text-left">
                      <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">Future</div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-3 text-[#0A101D]">Answer Engines</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">As search evolves, we optimize your brand's digital entity so AI models recommend you as the undisputed authority.</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* ============================================================
            SECTION 6: FINAL CTA
            ============================================================ */}
        <section className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden flex flex-col justify-center items-center border-t border-white/5">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] bg-[#008dd8]/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="relative z-10 max-w-[900px] w-full text-center flex flex-col items-center mx-auto">
            
            <motion.div variants={itemVariants} className="inline-block py-1.5 px-4 mb-6 md:mb-8 rounded-full bg-[#18181b] border border-gray-700 text-gray-300 text-[10px] font-black tracking-[0.2em] uppercase">
              Digital Flagship
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl sm:text-6xl md:text-[6rem] leading-[1.1] font-black tracking-tighter uppercase text-white mb-6 md:mb-8">
              Ready to <br/>
              <span className="text-[#008dd8]">Dominate?</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-400 font-medium max-w-xl mx-auto mb-10 md:mb-12 text-sm md:text-base leading-relaxed">
              You've seen the architecture. Now see how your own site measures up. Run a deep-scan audit instantly, or speak with our engineers to build your growth engine.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12 md:mb-14 relative z-10">
              <Link href="/seoauditor" className="w-full sm:w-auto inline-flex justify-center items-center bg-[#008dd8] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-[#0077b6] transition-all shadow-lg active:scale-95">
                Get a Free Audit
              </Link>
              <Link href="/free-audit" className="w-full sm:w-auto inline-flex justify-center items-center bg-white text-[#0A101D] px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all active:scale-95">
                Contact Engineers
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-gray-600 relative z-10">
              <span className="flex items-center gap-1.5">UK Based</span>
              <span className="flex items-center gap-1.5">Results Driven</span>
              <span className="flex items-center gap-1.5">AI Powered</span>
            </motion.div>

          </motion.div>
        </section>

      </main>
    </div>
  );
}