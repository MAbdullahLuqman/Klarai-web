import React from "react";
import Image from "next/image";
import Link from "next/link";
import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Case Studies | Klarai",
  description: "Selected Klarai case studies across SEO, AEO and web development.",
  alternates: { canonical: canonical("/case-studies") },
  openGraph: { url: canonical("/case-studies") },
};

const cases = [
  {
    title: "Pitchside.ai",
    discipline: "SEO / AEO / Web",
    href: "/case-studies/pitchside-ai-free-tools-strategy",
    image: "/images/pitchside-case-study-01.png",
    marker: "Live",
  },
  {
    title: "Zero authority growth",
    discipline: "GEO / AEO",
    href: "/case-studies/klarai-zero-domain-authority-geo-aeo-growth",
    image: "/images/aeo-generative-performance.png",
    marker: "Klarai",
  },
  {
    title: "Free tools strategy",
    discipline: "Technical SEO",
    href: "/case-studies/pitchside-ai-free-tools-strategy",
    image: "/images/pitchside-case-study-02.png",
    marker: "Search",
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#151b1e] text-[#f4efe4]">
      <nav className="absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-5 rounded-full bg-[#f4efe4]/88 px-5 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#151b1e] backdrop-blur">
        <Link href="/" className="transition hover:text-[#ad5b2b]">Index</Link>
        <Link href="/case-studies" className="text-[#ad5b2b]">Work</Link>
        <Link href="/about" className="transition hover:text-[#ad5b2b]">Info</Link>
        <Link href="/contact" className="transition hover:text-[#ad5b2b]">Contact</Link>
      </nav>

      <div className="flex h-full w-full items-center gap-4 overflow-x-auto overflow-y-hidden px-5 pb-10 pt-24 sm:px-8">
        <section className="shrink-0 pr-[8vw]">
          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.28em] text-[#e0b48b]">Klarai cases</p>
          <h1 className="font-serif text-[22vw] font-medium leading-[0.82] tracking-tight text-[#f4efe4] sm:text-[11vw]">
            Cases
          </h1>
          <p className="mt-5 max-w-xs text-sm font-semibold leading-relaxed text-[#f4efe4]/58">
            Selected search, answer-engine and web systems. Scroll sideways.
          </p>
        </section>

        {cases.map((item) => (
          <Link key={`${item.title}-${item.marker}`} href={item.href} className="group shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ad5b2b]">
            <div className="relative h-[58vh] w-[62vw] overflow-hidden bg-[#2f3438] sm:h-[64vh] sm:w-[34vw] lg:h-[68vh] lg:w-[21vw]">
              <Image
                src={item.image}
                alt={`${item.title} case study preview`}
                fill
                sizes="(max-width: 768px) 62vw, (max-width: 1024px) 34vw, 21vw"
                className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
              <span className="absolute left-3 top-3 rounded-full border border-[#f4efe4]/30 bg-[#151b1e]/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#e0b48b] backdrop-blur-sm">
                {item.marker}
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-sm font-black text-[#f4efe4]">{item.title}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f4efe4]/42">{item.discipline}</span>
            </div>
          </Link>
        ))}

        <section className="flex h-[58vh] shrink-0 items-center pl-[6vw] pr-10 sm:h-[64vh]">
          <Link href="/contact" className="font-serif text-[12vw] font-medium leading-[0.9] tracking-tight text-[#e0b48b] transition hover:text-[#f4efe4] sm:text-[5vw]">
            Start a
            <br />
            project
          </Link>
        </section>
      </div>

      <p className="pointer-events-none absolute bottom-5 right-5 text-[10px] font-black uppercase tracking-[0.24em] text-[#f4efe4]/34 sm:right-8">
        Scroll / drag
      </p>
    </main>
  );
}
