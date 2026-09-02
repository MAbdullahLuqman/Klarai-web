"use client";

import React, { useState } from "react";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import WebsitePreviewFrame from "@/components/WebsitePreviewFrame";

const portfolioProjects = [
  {
    id: "atelier-architect",
    title: "Atelier architectural portfolio",
    description: "A calm editorial landing page for an architecture studio, built around spatial hierarchy, restrained motion, and strong first-viewport brand clarity.",
    techStack: "Next.js, Framer Motion, Tailwind CSS",
    liveUrl: "https://architect-landing-page.vercel.app/",
    githubUrl: "https://github.com/MAbdullahLuqman/architect-landing-page",
  },
  {
    id: "pitchside",
    title: "Pitchside AI web experience",
    description: "A sports-tech homepage and search foundation built before launch so the platform can capture demand from day one.",
    techStack: "React, frontend development, responsive UI",
    liveUrl: "https://pitchside.ai",
    githubUrl: "https://github.com/MAbdullahLuqman/pticheside",
  },
];

export default function PortfolioPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProject = portfolioProjects[currentIndex];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Link href="/" className="mb-8 inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-black/38 transition hover:text-[#ad5b2b]">
              Back to home
            </Link>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              Selected work
            </p>
            <h1 className="font-serif text-6xl font-medium leading-[0.96] tracking-tight sm:text-8xl">
              Real builds with visible architecture.
            </h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-black/58">
              A focused record of Klarai web experiences, search foundations, and interface systems. More work will be added as the portfolio grows.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button onClick={() => setCurrentIndex((prev) => (prev - 1 + portfolioProjects.length) % portfolioProjects.length)} className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#2f3438] transition hover:border-[#ad5b2b] hover:text-[#ad5b2b]" aria-label="Previous project">
                <ChevronLeft size={20} />
              </button>
              <div className="min-w-24 text-center text-[10px] font-black uppercase tracking-[0.18em] text-black/38">
                0{currentIndex + 1} / 0{portfolioProjects.length}
              </div>
              <button onClick={() => setCurrentIndex((prev) => (prev + 1) % portfolioProjects.length)} className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-[#2f3438] transition hover:border-[#ad5b2b] hover:text-[#ad5b2b]" aria-label="Next project">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={currentProject.id}
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-start"
          >
            <aside className="rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)] lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ad5b2b]">Featured project</p>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight">{currentProject.title}</h2>
              <p className="mt-5 text-base font-medium leading-relaxed text-black/56">{currentProject.description}</p>
              <p className="mt-7 text-[10px] font-black uppercase tracking-[0.18em] text-black/38">{currentProject.techStack}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href={currentProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ad5b2b] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#8d4822]">
                  Live demo <ExternalLink size={16} />
                </a>
                {currentProject.githubUrl !== "#" && (
                  <a href={currentProject.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-[#ad5b2b] px-6 py-3.5 text-sm font-black text-[#9b542a] transition hover:bg-[#f9f5ec]">
                    Source code <Github size={16} />
                  </a>
                )}
              </div>
            </aside>

            <WebsitePreviewFrame
              url={currentProject.liveUrl}
              title={`${currentProject.title} preview`}
              desktopHeight={1180}
              className="border-black/10"
              viewportClassName="min-h-[360px]"
            />
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
