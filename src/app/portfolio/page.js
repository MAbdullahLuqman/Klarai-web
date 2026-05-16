"use client";

import React, { useState } from "react";
import { ExternalLink, ArrowLeft, Github, Maximize2, Code2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import GlobalHeader from '@/components/GlobalHeader';

// ==========================================
// PORTFOLIO DATA: Add all future sites here!
// ==========================================
const portfolioProjects = [
  {
    id: "atelier-architect",
    title: "Atelier | Architectural Portfolio",
    techStack: "Next.js • Framer Motion • Tailwind CSS",
    liveUrl: "https://architect-landing-page.vercel.app/",
    githubUrl: "https://github.com/MAbdullahLuqman/architect-landing-page",
  },
  {
    id: "pticheside",
    title: "PticheSide | Web Experience",
    techStack: "React • Frontend Development • Responsive UI",
    liveUrl: "https://pticheside.vercel.app/",
    githubUrl: "https://github.com/MAbdullahLuqman/pticheside",
  }
];

export default function WebDevPortfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolioProjects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolioProjects.length) % portfolioProjects.length);
  };

  const currentProject = portfolioProjects[currentIndex];

  return (
    <div className="bg-[#030303] text-white flex-grow flex flex-col font-sans selection:bg-[#008dd8] selection:text-white pb-32 overflow-x-hidden">
      <GlobalHeader />

      <div className="pt-32 px-4 sm:px-6 w-full max-w-[1400px] mx-auto flex-grow flex flex-col">
        
        {/* Page Main Header */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div>
            <Link href="/" className="text-gray-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 mb-6 w-max">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#008dd8]/10 text-[#00b4d8] rounded-xl flex items-center justify-center border border-[#008dd8]/20 shrink-0">
                <Code2 size={24} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Engineering Portfolio</h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl">
              A collection of high-performance web applications, interactive interfaces, and modern frontend architectures built for scale.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-4 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-xl bg-black/50 text-white hover:bg-[#008dd8] transition-colors border border-white/10"
              aria-label="Previous Project"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-xs font-mono font-bold tracking-widest text-gray-400 min-w-[80px] text-center">
              0{currentIndex + 1} / 0{portfolioProjects.length}
            </div>
            <button 
              onClick={handleNext}
              className="p-3 rounded-xl bg-black/50 text-white hover:bg-[#008dd8] transition-colors border border-white/10"
              aria-label="Next Project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* SINGLE PROJECT DISPLAY (FIXED HEIGHT) */}
        {/* ========================================== */}
        
        <div className="w-full relative flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full flex flex-col flex-grow"
            >
              
              {/* Individual Project Header */}
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
                <div>
                  <span className="text-[#008dd8] text-[10px] font-black tracking-[0.2em] uppercase mb-2 block">
                    Featured Work
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    {currentProject.title}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm font-medium">
                    {currentProject.techStack}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 text-xs font-bold transition-all flex items-center gap-2">
                     Live Demo <ExternalLink size={14} />
                  </a>
                  {currentProject.githubUrl !== "#" && (
                    <a href={currentProject.githubUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg bg-[#008dd8] text-white hover:bg-[#0077b6] text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,141,216,0.3)]">
                      Source Code <Github size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Mock Browser Sandbox */}
              <div className="w-full border border-white/10 rounded-2xl bg-[#0A101D] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col shrink-0">
                
                {/* Browser Top Bar */}
                <div className="h-10 sm:h-12 w-full bg-[#111827] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  
                  <div className="bg-[#000000]/40 border border-white/5 rounded-md px-8 sm:px-32 py-1 text-[9px] sm:text-[10px] font-mono text-gray-400 truncate max-w-[180px] sm:max-w-md text-center">
                    {currentProject.liveUrl}
                  </div>
                  
                  <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="Open in new tab">
                    <Maximize2 size={14} />
                  </a>
                </div>

                {/* THE NUCLEAR FIX: Hardcoded inline style heights. Tailwind cannot compress this. */}
                <div className="w-full bg-white block" style={{ height: "75vh", minHeight: "700px" }}>
                  <iframe 
                    src={currentProject.liveUrl} 
                    className="w-full h-full border-none block"
                    style={{ minHeight: "700px" }}
                    title={`${currentProject.title} Preview`}
                    allowFullScreen
                    loading="lazy" 
                  />
                </div>
                
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}