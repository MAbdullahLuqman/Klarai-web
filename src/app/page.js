"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';
import AuditSearchBar from '@/components/AuditSearchBar';

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
// 2. FRAMER MOTION MICRO-INTERACTION
// ==========================================
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
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
      <div style={{ transform: typeof window !== 'undefined' && window.innerWidth > 768 ? "translateZ(10px)" : "none" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
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
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function RefinedPremiumHome() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yText1 = useTransform(scrollYProgress, [0, 0.2], [0, -40]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#18181b] text-gray-900 font-sans selection:bg-[#008dd8] selection:text-white min-h-screen relative">

      <GlobalHeader />

      {/* ============================================================
          SECTION 1: KLAR AI — BRAND HERO (Theme: MINIMAL DARK)
          ============================================================ */}
      <section className="w-full min-h-[90vh] flex flex-col justify-center items-center relative overflow-hidden bg-[#111111] pt-32 pb-20 md:py-32 px-6">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: yText1, opacity: opacityHero }}
          className="relative z-10 w-full max-w-[900px] flex flex-col items-start"
        >
          <motion.h1 variants={itemVariants} className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-medium tracking-tight text-white mb-8 sm:mb-10">
          Visibility is not<br />
an accident.<br />
Neither is trust.
          </motion.h1>

          <motion.div variants={itemVariants}>
            <Link href="/free-audit" className="inline-flex justify-center items-center bg-white text-black px-7 sm:px-8 py-3.5 sm:py-4 rounded-[2rem] font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all active:scale-95 shadow-lg">
              Enquire Now
            </Link>
          </motion.div>
        </motion.div>

        {/* Subtle Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          <div className="w-5 h-8 rounded-full border-2 border-gray-500 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1.5 bg-gray-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ============================================================
          SECTION 2: THE SCANNER (Theme: LIGHT)
          ============================================================ */}
      <section className="w-full flex flex-col justify-center items-center relative overflow-hidden bg-[#fafafa] py-24 md:py-32 px-6">

        <div className="relative z-10 w-full max-w-[800px] mx-auto text-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 bg-blue-50 border border-blue-100 py-1.5 px-4 rounded-full">
              <svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span className="text-[#008dd8] text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">Free AI Audit Tool</span>
            </motion.div>

            {/* Headline */}
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.05] font-black tracking-tighter uppercase text-[#0A101D] mb-4">
              Discover Why<br/>
              <span className="text-[#008dd8]">Competitors</span> Outrank You
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed mb-8">
              Enter any UK website URL below. Our AI scans your architecture, content gaps, and technical SEO in 30 seconds — completely free.
            </motion.p>

            {/* The Tool */}
            <motion.div variants={itemVariants} className="w-full mb-6">
              <AuditSearchBar />
            </motion.div>

            {/* Trust Signals */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                100% Free
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                No Credit Card
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                30-Second Scan
              </span>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: SERVICES GRID (Theme: DARK)
          ============================================================ */}
      <section className="w-full flex items-center justify-center py-24 md:py-32 px-6 relative z-10 bg-[#0A101D]">
        <div className="max-w-[1200px] w-full mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-20 items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="flex flex-col items-start"
            >
              <motion.span variants={itemVariants} className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Our Capabilities</motion.span>
              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl leading-[1.05] font-black tracking-tighter uppercase mb-4 text-white">
                Helping You <br/> Rise Above <br/> The Noise.
              </motion.h2>
              <motion.p variants={itemVariants} className="text-sm md:text-base font-medium leading-relaxed text-gray-400 mb-8 max-w-md">
                From initial search strategy to launch and ongoing refinement, we design and develop digital ecosystems built to lead, evolve, and scale with your business.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/services" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#008dd8] text-white px-7 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#0077b6] transition-all shadow-md active:scale-95 group">
                  Explore Systems
                  <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
                <Link href="/free-audit" className="w-full sm:w-auto inline-flex justify-center items-center bg-transparent border-2 border-gray-700 text-white px-7 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:border-gray-500 transition-all active:scale-95">
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
              style={{ perspective: "1000px" }}
            >
              {SERVICES_GRID.map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <TiltCard className="h-full">
                    <Link
                      href={service.href}
                      className="group flex flex-col items-start p-4 md:p-5 bg-[#111827] border border-gray-800 rounded-[1rem] md:rounded-[1.25rem] hover:border-[#008dd8]/60 hover:shadow-[0_10px_25px_rgba(0,141,216,0.1)] transition-all duration-300 h-full min-h-[130px] md:min-h-[160px] justify-between"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-500 group-hover:bg-[#008dd8] group-hover:text-white transition-colors duration-300 mb-4 shadow-sm border border-gray-800 group-hover:border-transparent">
                        {service.icon}
                      </div>
                      <h3 className="text-white font-black tracking-tight text-[10px] md:text-[11px] uppercase leading-tight">
                        {service.title}
                      </h3>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: SCALING THE NEXT WAVE (Theme: LIGHT)
          ============================================================ */}
      <section className="w-full flex items-center justify-center py-24 md:py-32 px-6 relative z-10 bg-white">
        
        <div className="max-w-[1200px] w-full mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <span className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block">The Architecture</span>
              <h2 className="text-3xl md:text-5xl leading-[1] font-black tracking-tighter uppercase text-[#0A101D] mb-3">
                Scaling The Next Wave
              </h2>
              <p className="text-center text-gray-500 font-mono text-[10px] md:text-[11px] uppercase tracking-widest">
                Select capabilities & architecture
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div variants={itemVariants}>
                <TiltCard>
                  <div className="bg-[#fafafa] rounded-[1.5rem] p-6 md:p-8 border border-gray-200 hover:border-[#008dd8] hover:shadow-[0_15px_30px_rgba(0,141,216,0.1)] transition-all flex flex-col justify-between h-full min-h-[220px]">
                    <div className="text-[#008dd8] font-mono text-[10px] uppercase tracking-widest mb-3 font-bold">Search</div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 text-[#0A101D]">Algorithmic Dominance</h3>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">We mathematically map search intent to site architecture, ensuring your brand captures high-value traffic before competitors.</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <TiltCard>
                  <div className="bg-[#fafafa] rounded-[1.5rem] p-6 md:p-8 border border-gray-200 hover:border-[#0A101D] hover:shadow-[0_15px_30px_rgba(10,16,29,0.1)] transition-all flex flex-col justify-between h-full min-h-[220px] md:translate-y-6">
                    <div className="text-gray-800 font-mono text-[10px] uppercase tracking-widest mb-3 font-bold">Conversion</div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 text-[#0A101D]">Frictionless Flow</h3>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">Beautiful design is useless if it doesn't convert. We engineer user journeys that obliterate friction.</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <TiltCard>
                  <div className="bg-[#fafafa] rounded-[1.5rem] p-6 md:p-8 border border-gray-200 hover:border-gray-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between h-full min-h-[220px]">
                    <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-3 font-bold">Future</div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 text-[#0A101D]">Answer Engines</h3>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">As search evolves, we optimize your brand's digital entity so AI models recommend you as the undisputed authority.</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: DIGITAL FLAGSHIP — FINAL CTA (Theme: DARK)
          ============================================================ */}
      <section className="w-full flex flex-col justify-center items-center relative overflow-hidden bg-[#111111] py-24 md:py-32 border-t border-gray-800">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative z-10 max-w-[900px] w-full mx-auto px-6 text-center flex flex-col items-center"
        >

          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-block py-1.5 px-4 mb-6 rounded-full bg-gray-800/50 border border-gray-700 text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
            Digital Flagship
          </motion.div>

          {/* Big Headline */}
          <motion.h2 variants={itemVariants} className="text-5xl sm:text-6xl md:text-[6.5rem] leading-[0.95] font-black tracking-tighter uppercase text-white mb-6">
            Ready to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] to-[#777777]">Dominate?</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-gray-400 font-medium max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            You've seen the architecture. Now see how your own site measures up. Run a deep-scan audit instantly, or speak with our engineers to build your growth engine.
          </motion.p>

          {/* Final CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-3 mb-12">
            <Link href="/seoauditor" className="inline-flex justify-center items-center gap-2 bg-[#008dd8] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-[#0077b6] transition-all shadow-md active:scale-95 group">
              Get a Free Audit
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <Link href="/free-audit" className="inline-flex justify-center items-center gap-2 bg-white text-[#0A101D] px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all active:scale-95">
              Contact Engineers
            </Link>
          </motion.div>

          {/* Mini trust footer */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              UK Based
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Results Driven
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              AI Powered
            </span>
          </motion.div>

        </motion.div>
      </section>

    </div>
  );
}