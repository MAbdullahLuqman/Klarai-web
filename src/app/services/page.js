import React from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { canonical } from "@/lib/seo-config";
import { mergeServicePageContent } from "@/lib/service-page-content";
import { safeGetDoc } from "@/lib/firestore-safe";
import { stripHtml } from "@/lib/html";

export const metadata = {
  title: "Services | Klarai",
  description: "Klarai services for SEO, AEO and high-converting web development.",
  alternates: {
    canonical: canonical("/services"),
  },
};

const serviceCards = [
  {
    id: "aeo",
    path: "/services/aeo-services",
    tag: "Answer systems",
    fallbackTitle: "Answer Engine Optimisation",
    fallbackSub: "Structure your expertise so AI answer engines can understand, cite and recommend your brand.",
  },
  {
    id: "seo",
    path: "/services/seo-services",
    tag: "Search foundations",
    fallbackTitle: "Technical & Local SEO",
    fallbackSub: "Fix the architecture, speed, schema and local signals that make your site rankable.",
  },
  {
    id: "web",
    path: "/services/web-development",
    tag: "Conversion builds",
    fallbackTitle: "High-Converting Web Development",
    fallbackSub: "Build fast, modern sites that rank from day one and turn visitors into enquiries.",
  },
  {
    id: "technicalAudit",
    path: "/services/technical-seo-audit",
    tag: "Technical audits",
    fallbackTitle: "Technical SEO Audit",
    fallbackSub: "Find crawl, indexation, rendering and performance issues, then turn them into a fix plan.",
  },
  {
    id: "contentWriting",
    path: "/services/seo-content-writing-services",
    tag: "Content systems",
    fallbackTitle: "SEO Content Writing Services",
    fallbackSub: "Plan and write useful pages around search intent, expert input, internal links and lead paths.",
  },
  {
    id: "whiteLabel",
    path: "/services/white-label-seo-agency",
    tag: "Agency delivery",
    fallbackTitle: "White Label SEO Agency",
    fallbackSub: "Confidential SEO delivery support for agencies that need reliable technical and content work.",
  },
];

const process = [
  ["Audit", "We find the technical, content and authority gaps suppressing visibility."],
  ["Architect", "We map search intent and AI-answer intent into a page structure buyers can trust."],
  ["Build", "We ship pages, schema, copy blocks and conversion paths with speed and clarity."],
];

async function getServiceCard(service) {
  const docSnap = await safeGetDoc(doc(db, "pages", service.id), `pages/${service.id}`);
  const data = mergeServicePageContent(service.id, docSnap?.data?.() || {});

  return {
    ...service,
    title: stripHtml(data.hero?.h1) || service.fallbackTitle,
    sub: stripHtml(data.hero?.sub) || service.fallbackSub,
  };
}

export default async function ServicesHubPage() {
  const services = await Promise.all(serviceCards.map(getServiceCard));

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      <section className="relative overflow-hidden px-5 pb-20 pt-40 sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(173,91,43,0.16)_0%,rgba(173,91,43,0)_34%),radial-gradient(circle_at_82%_8%,rgba(111,143,163,0.18)_0%,rgba(111,143,163,0)_32%)]" />
        <div className="relative mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              Klarai services
            </p>
            <h1 className="font-serif text-6xl font-medium leading-[0.94] tracking-tight sm:text-8xl">
              Three systems for modern visibility.
            </h1>
          </div>
          <div className="rounded-[1.2rem] border border-black/8 bg-white/76 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-sm">
            <p className="text-lg font-medium leading-relaxed text-black/58">
              Most agencies separate SEO, AI search, content, audits and web design. Klarai connects them into one architecture: pages that can be crawled, cited and trusted by real buyers.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/seoauditor" className="rounded-md bg-[#ad5b2b] px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-[#8d4822]">
                SEO Audit
              </Link>
              <Link href="/contact" className="rounded-md border border-[#ad5b2b] px-6 py-3.5 text-center text-sm font-black text-[#9b542a] transition hover:bg-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={service.path}
              className="group flex min-h-[440px] flex-col rounded-[1.2rem] border border-black/8 bg-white p-8 shadow-[0_28px_90px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#ad5b2b]/35"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6f8fa3]/20 bg-[#6f8fa3]/10 text-xl font-black text-[#6f8fa3]">
                  0{index + 1}
                </div>
                <span className="rounded-md border border-black/8 bg-[#f9f5ec] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-black/38">
                  {service.tag}
                </span>
              </div>
              <div className="mt-auto">
                <h2 className="font-serif text-4xl font-medium leading-[1] tracking-tight text-[#2f3438] transition group-hover:text-[#ad5b2b]">
                  {service.title}
                </h2>
                <p className="mt-5 text-base font-medium leading-relaxed text-black/56">
                  {service.sub}
                </p>
                <div className="mt-10 border-t border-black/8 pt-6 text-[10px] font-black uppercase tracking-[0.18em] text-[#9b542a]">
                  View architecture
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-black/8 bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              How it works
            </p>
            <h2 className="sticky top-32 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">
              One architecture, three connected layers.
            </h2>
          </div>
          <div className="space-y-4">
            {process.map(([title, body], index) => (
              <div key={title} className="grid gap-6 rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.04)] sm:grid-cols-[0.2fr_1fr]">
                <div className="text-4xl font-black tracking-tight text-[#ad5b2b]">0{index + 1}</div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">{title}</h3>
                  <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-black/54">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1050px] gap-8 text-center">
          <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">
            Start with the system that removes the most friction.
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-black/55">
            Run the audit first. We will show you whether search architecture, answer-engine readiness or the website itself is the clearest path to growth.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/seoauditor" className="rounded-md bg-[#ad5b2b] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-[#8d4822]">
              SEO Audit
            </Link>
            <Link href="/contact" className="rounded-md border border-[#ad5b2b] px-7 py-4 text-center text-sm font-bold text-[#9b542a] transition hover:bg-[#f9f5ec]">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
