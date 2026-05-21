"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';

// ==========================================
// DESIGN SYSTEM UTILITIES (Shared with homepage)
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ==========================================
// TILT CARD (Exact copy from homepage)
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

// ==========================================
// SPOTLIGHT CURSOR EFFECT (Exact copy from homepage)
// ==========================================
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

// ==========================================
// DATA: YOUR OWN SEO CASE STUDY
// ==========================================
const RANKING_DATA = [
  { keyword: "answer engine optimisation", country: "UK", position: 53, volume: "High", intent: "Informational" },
  { keyword: "top plumbing keywords", country: "UK", position: 17, volume: "Medium", intent: "Commercial" },
  { keyword: "plumbing keywords list", country: "UK", position: 29, volume: "Medium", intent: "Informational" },
  { keyword: "seo mot garage", country: "UK", position: 36, volume: "Low", intent: "Commercial" },
  { keyword: "plumbing seo keywords", country: "UK", position: 41, volume: "Medium", intent: "Commercial" },
  { keyword: "seo for plumbers", country: "UK", position: 91, volume: "High", intent: "Commercial" },
];

const STRATEGY_POINTS = [
  {
    title: "Long‑Tail SEO Content",
    desc: "Targeted highly specific, problem-aware queries instead of competing for impossible short-tail keywords immediately.",
    tags: ["Informational Intent", "Niche Pages", "Conversational Phrasing"]
  },
  {
    title: "Answer Engine Optimization",
    desc: "Structured content for AI Overviews, ChatGPT retrieval, featured snippets, and semantic search matching.",
    tags: ["FAQ Sections", "Direct Answers", "Entity Coverage"]
  },
  {
    title: "Industry Topical Clusters",
    desc: "Built authority inside specific industries (Plumbing SEO, MOT Garage SEO) rather than random blog posts.",
    tags: ["Plumbing SEO", "MOT Garage", "Local Intent"]
  },
  {
    title: "Technical Foundations",
    desc: "Sitemap optimization, semantic heading structures, internal linking architecture, and crawlability improvements.",
    tags: ["Crawlability", "Mobile", "Schema"]
  }
];

const GEO_REACH = ["United Kingdom", "United States", "Pakistan", "Sweden", "Spain", "Kuwait"];

// ==========================================
// DATA: WEB DESIGN PORTFOLIO
// ==========================================
const PORTFOLIO_PROJECTS = [
  {
    title: "Pitchside.ai",
    year: "2026",
    category: "AI Platform / SEO",
    description: "Full-stack AI sports analytics platform with real-time data visualization and automated SEO architecture.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    color: "#008dd8",
    stats: { traffic: "+340%", keywords: "Top 10", speed: "98/100" }
  },
  {
    title: "Atelier Studio",
    year: "2025",
    category: "Creative Agency / Web Design",
    description: "Luxury brand identity and high-converting portfolio system for an award-winning interior design studio.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop",
    color: "#d4af37",
    stats: { traffic: "+210%", keywords: "Top 3", speed: "99/100" }
  },
  {
    title: "Nova Finance",
    year: "2025",
    category: "Fintech / AEO",
    description: "Answer-engine-optimized fintech dashboard designed for semantic search and AI model citation.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    color: "#0A101D",
    stats: { traffic: "+450%", keywords: "Top 5", speed: "96/100" }
  },
  {
    title: "Thera Health",
    year: "2024",
    category: "Healthcare / Local SEO",
    description: "Medical practice website with localized SEO infrastructure and appointment conversion optimization.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
    color: "#059669",
    stats: { traffic: "+180%", keywords: "Top 3", speed: "97/100" }
  }
];

// ==========================================
// SECTION 1: HERO
// ==========================================
const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const opacityText = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section ref={containerRef} className="w-full min-h-[70vh] flex flex-col justify-center relative overflow-hidden bg-[#050505] pt-[140px] pb-20 md:py-32 px-6 lg:px-12 border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,141,216,0.08),transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#008dd8]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-start text-left"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6 bg-white/5 border border-white/10 py-1.5 px-4 rounded-full backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gray-300 text-[10px] font-bold tracking-[0.2em] uppercase">Live Case Study</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] font-medium tracking-tight text-white mb-6 sm:mb-8 max-w-4xl">
          The Proof Is In <br className="hidden md:block" />
          The <span className="text-[#008dd8]">Rankings.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-gray-400 text-base md:text-lg font-medium max-w-xl leading-relaxed mb-8">
          How we took a brand-new domain with zero authority and generated measurable UK & US search visibility in under 60 days — without paid ads.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href="#rankings" className="inline-flex justify-center items-center bg-[#008dd8] text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#0077b6] transition-all active:scale-95 shadow-lg shadow-[#008dd8]/20">
            View Rankings
          </Link>
          <Link href="#portfolio" className="inline-flex justify-center items-center bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-white/20 transition-all active:scale-95">
            See Portfolio
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ==========================================
// SECTION 2: METRICS STRIP
// ==========================================
const MetricsStrip = () => {
  const metrics = [
    { value: "60", label: "Days to First Rankings", suffix: "" },
    { value: "6", label: "Countries Reached", suffix: "+" },
    { value: "0", label: "Paid Ads Used", suffix: "" },
    { value: "New", label: "Domain Authority Start", suffix: "" },
  ];

  return (
    <section className="w-full bg-[#0A101D] py-12 md:py-16 px-6 border-b border-white/5">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center md:text-left"
          >
            <div className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">
              {m.value}<span className="text-[#008dd8]">{m.suffix}</span>
            </div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// SECTION 3: STRATEGY
// ==========================================
const StrategySection = () => {
  return (
    <section className="w-full bg-[#030303] py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,141,216,0.03),transparent_50%)]" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-16 md:mb-20"
        >
          <motion.span variants={itemVariants} className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-4 block">
            The Strategy
          </motion.span>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] font-black tracking-tighter uppercase text-white mb-6 max-w-2xl">
            Built For AI Search. <br/> Optimized For Humans.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 text-sm md:text-base font-medium max-w-lg leading-relaxed">
            Instead of chasing vanity keywords, we engineered topical authority clusters designed for both traditional Google Search and emerging answer engines.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {STRATEGY_POINTS.map((strategy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TiltCard className="h-full">
                <div className="bg-[#0A101D] border border-white/5 rounded-[1.5rem] p-6 md:p-8 hover:border-[#008dd8]/30 transition-all duration-300 h-full">
                  <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3">{strategy.title}</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">{strategy.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map((tag, t) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-[#008dd8] bg-[#008dd8]/10 px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 4: RANKINGS TABLE (SEO CASE STUDY)
// ==========================================
const RankingsSection = () => {
  return (
    <section id="rankings" className="w-full bg-[#fafafa] py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-12 md:mb-16"
        >
          <motion.span variants={itemVariants} className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-4 block">
            Google Search Console Data
          </motion.span>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl leading-[1.1] font-black tracking-tighter uppercase text-[#0A101D] mb-6">
            Live Keyword <br/> Positions.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
            Real ranking data from the first 30–60 days. Achieved on a new domain with no established backlink profile.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[1.5rem] border border-gray-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Keyword</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Country</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Position</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Search Volume</th>
                  <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Intent</th>
                </tr>
              </thead>
              <tbody>
                {RANKING_DATA.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-bold text-[#0A101D]">{row.keyword}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        {row.country === "UK" ? (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2"/></svg>
                        ) : null}
                        {row.country}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-black ${row.position <= 20 ? 'bg-emerald-50 text-emerald-600' : row.position <= 50 ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                        {row.position}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">{row.volume}</td>
                    <td className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">{row.intent}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Query Win */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-[#0A101D] rounded-[1.5rem] p-6 md:p-8 border border-white/5"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#008dd8]/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h4 className="text-white font-black text-sm uppercase tracking-tight mb-2">AI / Conversational Search Win</h4>
              <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                "What's the difference between ai answer tracking tools and ai-optimized content platforms?"
              </p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
                Ranking for LLM-style semantic queries
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 5: GEOGRAPHIC REACH
// ==========================================
const GeoSection = () => {
  return (
    <section className="w-full bg-white py-20 md:py-24 px-6 border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h3 variants={itemVariants} className="text-2xl md:text-3xl font-black tracking-tighter text-[#0A101D] mb-4">
            Global Visibility In 60 Days
          </motion.h3>
          <motion.p variants={itemVariants} className="text-gray-500 text-sm font-medium max-w-md mx-auto">
            Search impressions began appearing across multiple continents without localized backlink campaigns.
          </motion.p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {GEO_REACH.map((country, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#fafafa] border border-gray-200 px-5 py-3 rounded-full text-sm font-bold text-[#0A101D] hover:border-[#008dd8] hover:text-[#008dd8] transition-colors cursor-default"
            >
              {country}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 6: WEB DESIGN PORTFOLIO
// ==========================================
const PortfolioSection = () => {
  return (
    <section id="portfolio" className="w-full bg-[#fafafa] py-24 md:py-32 px-6 relative overflow-hidden border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-16 md:mb-20"
        >
          <motion.span variants={itemVariants} className="text-[#008dd8] font-mono text-[10px] uppercase tracking-[0.2em] font-bold mb-4 block">
            Selected Work
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-black tracking-tighter uppercase text-[#0A101D]">
              Design That <br/> Converts.
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 text-sm md:text-base font-medium max-w-sm leading-relaxed">
              Every project is engineered as a growth system — not just a pretty interface.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href="/portfolio" className="group block bg-white rounded-[1.5rem] overflow-hidden border border-gray-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-gray-300 transition-all duration-500">
                {/* Image Container */}
                <div className="relative w-full h-[280px] md:h-[360px] overflow-hidden bg-gray-100">
                  <img
                    src={project.image}
                    alt={`${project.title} project showcase`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating Stats */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#0A101D]">
                      Traffic {project.stats.traffic}
                    </div>
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#0A101D]">
                      Speed {project.stats.speed}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-black tracking-tight text-[#0A101D] group-hover:text-[#008dd8] transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-gray-400 text-sm font-medium">{project.year}</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{project.category}</p>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{project.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/portfolio" className="inline-flex justify-center items-center gap-2 bg-[#0A101D] text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#008dd8] transition-all active:scale-95">
            View All Projects
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 7: FINAL CTA
// ==========================================
const CTASection = () => {
  return (
    <section className="w-full bg-[#0A101D] py-24 md:py-32 px-6 relative overflow-hidden flex flex-col justify-center items-center border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] bg-[#008dd8]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="relative z-10 max-w-[900px] w-full text-center flex flex-col items-center mx-auto"
      >
        <motion.div variants={itemVariants} className="inline-block py-1.5 px-4 mb-6 md:mb-8 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black tracking-[0.2em] uppercase">
          Your Turn
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-4xl sm:text-6xl md:text-[5rem] leading-[1.1] font-black tracking-tighter uppercase text-white mb-6 md:mb-8">
          Ready For <br/>
          <span className="text-[#008dd8]">Similar Results?</span>
        </motion.h2>

        <motion.p variants={itemVariants} className="text-gray-400 font-medium max-w-xl mx-auto mb-10 md:mb-12 text-sm md:text-base leading-relaxed">
          Whether you need SEO dominance, a high-converting website, or AI-search optimization — we engineer systems that compound over time.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12 md:mb-14">
          <Link href="/seoauditor" className="w-full sm:w-auto inline-flex justify-center items-center bg-[#008dd8] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-[#0077b6] transition-all shadow-lg shadow-[#008dd8]/20 active:scale-95">
            Get a Free Audit
          </Link>
          <Link href="/free-audit" className="w-full sm:w-auto inline-flex justify-center items-center bg-white text-[#0A101D] px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all active:scale-95">
            Contact Engineers
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-bold text-gray-600">
          <span className="flex items-center gap-1.5">UK Based</span>
          <span className="flex items-center gap-1.5">Results Driven</span>
          <span className="flex items-center gap-1.5">AI Powered</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

// ==========================================
// MAIN EXPORT
// ==========================================
export default function SEOResultPage() {
  return (
    <div className="bg-[#030303] text-gray-900 font-sans selection:bg-[#008dd8] selection:text-white min-h-screen relative overflow-hidden">
      <GlobalHeader />
      <Spotlight />
      
      <main className="w-full flex flex-col relative">
        <HeroSection />
        <MetricsStrip />
        <StrategySection />
        <RankingsSection />
        <GeoSection />
        <PortfolioSection />
        <CTASection />
      </main>
    </div>
  );
}