"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import AuditSearchBar from "@/components/AuditSearchBar";
import WebsitePreviewFrame from "@/components/WebsitePreviewFrame";
import { jsonLd } from "@/lib/seo-config";

const mountainVideo = "/hero-mountain-base.mp4";
const mountainForegroundImage = "/images/hero-mountain-foreground-clean.webp";

const services = [
  {
    title: "Answer Engine Optimisation (AEO/GEO)",
    body: "Become the answer ChatGPT, Gemini, Perplexity and Google AI Overviews cite, not the result buried below it.",
    href: "/services/aeo-services",
    cta: "Explore AEO",
  },
  {
    title: "Technical & Local SEO",
    body: "The foundations that make you rankable: site architecture, page speed, schema, and local visibility that turns searches into calls.",
    href: "/services/seo-services",
    cta: "Explore SEO",
  },
  {
    title: "High-Converting Web Development",
    body: "Fast, modern sites built to rank from day one and turn visitors into enquiries, not just look good.",
    href: "/services/web-development",
    cta: "Explore Web Design",
  },
];

const processSteps = [
  [
    "Audit",
    "We scan your site's architecture, content gaps and technical health, then show you exactly where you're losing visibility.",
  ],
  [
    "Architect",
    "We map search and answer-engine intent to a concrete page-and-content plan, prioritised by fastest impact.",
  ],
  [
    "Build & optimise",
    "We ship the pages, schema and content that win rankings and citations.",
  ],
  [
    "Grow",
    "We track, refine and compound the gains month over month.",
  ],
];

const faqs = [
  {
    question: "What's the difference between SEO and AEO?",
    answer:
      "SEO ranks you in traditional results; AEO structures your content so AI engines like ChatGPT and Google AI Overviews cite you as the answer. You need both now.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "Terms you already rank near page one can move within weeks; new competitive terms typically take 2-3 months. We prioritise the fastest wins first.",
  },
  {
    question: "Do you lock me into long contracts?",
    answer: "No. We're results-focused and work month to month.",
  },
  {
    question: "Do you work with my industry?",
    answer:
      "We work across UK service businesses and brands, from trades to tech. Run a free audit and we'll tell you honestly if we can help.",
  },
];

function HeroLandscape() {
  return (
    <div className="absolute inset-0 isolate overflow-hidden bg-[#eec59f] [transform:translate3d(0,0,0)]">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#9caebf_0%,#c5c1bc_26%,#d5c4ad_45%,#bbb7aa_62%,#3f4d50_100%)]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.08)_24%,rgba(255,255,255,0)_54%)]" />
      <h1
        aria-label="KlarAI"
        className="hero-brand-backdrop pointer-events-none absolute inset-x-0 top-[40%] z-[12] flex select-none justify-center overflow-hidden whitespace-nowrap text-[4rem] font-black uppercase leading-none tracking-[0] text-white drop-shadow-[0_12px_42px_rgba(5,10,18,0.28)] [perspective:900px] sm:top-[29%] sm:text-8xl md:top-[24%] md:text-[9rem] lg:text-[13rem] xl:text-[16rem]"
      >
        {"KLARAI".split("").map((letter, index) => (
          <span key={`${letter}-${index}`} aria-hidden="true" className="hero-brand-letter inline-block will-change-transform">
            {letter}
          </span>
        ))}
      </h1>
      <video
        className="hero-video-base pointer-events-none absolute inset-0 z-[6] h-full w-full select-none object-cover object-center will-change-transform [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={mountainVideo} type="video/mp4" />
      </video>
      <div
        className="hero-sky-night absolute inset-0 z-[2] bg-[linear-gradient(180deg,#111827_0%,#233044_34%,#313b48_56%,#101418_100%)]"
      />
      <img
        src={mountainForegroundImage}
        alt=""
        draggable={false}
        decoding="async"
        fetchPriority="high"
        className="hero-mountain-foreground pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-cover object-center brightness-[1.02] contrast-[1.08] saturate-[0.96] will-change-transform [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
      />
      <div
        className="hero-mountain-shade absolute inset-0 z-[7] bg-[linear-gradient(180deg,rgba(18,24,31,0.02)_0%,rgba(18,24,31,0.28)_46%,rgba(2,5,8,0.82)_100%)]"
      />
      <div className="absolute inset-0 z-[7] bg-[linear-gradient(180deg,rgba(5,7,10,0.1)_0%,rgba(5,7,10,0.02)_32%,rgba(5,7,10,0.24)_58%,rgba(5,7,10,0.78)_100%)] md:hidden" />
      <div className="absolute inset-0 z-[7] bg-[linear-gradient(90deg,rgba(16,12,10,0.42)_0%,rgba(18,15,15,0.18)_45%,rgba(13,18,24,0.24)_100%)]" />
      <div className="absolute inset-0 z-[7] bg-[radial-gradient(circle_at_52%_30%,rgba(255,255,255,0.13)_0%,rgba(12,16,20,0.12)_52%,rgba(5,7,10,0.62)_100%)]" />
    </div>
  );
}

function PitchsidePreview() {
  return (
    <div className="relative">
      <WebsitePreviewFrame
        url="https://pitchside.ai"
        title="Pitchside AI website preview"
        label="pitchside.ai"
        desktopHeight={900}
        className="border-white/14 shadow-[0_35px_100px_rgba(0,0,0,0.34)]"
        chromeClassName="h-11"
        action={
          <Link href="/portfolio" className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50 transition hover:text-white">
            View
          </Link>
        }
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.34)_100%)]" />
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-sky-night", { autoAlpha: 0.92 }, { autoAlpha: 0.2, duration: 2.2 }, 0)
        .fromTo(".hero-video-base", { scale: 1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.8, ease: "power2.out" }, 0)
        .fromTo(
          ".hero-brand-letter",
          { yPercent: 125, scale: 0.72, rotationX: -38, autoAlpha: 0 },
          { yPercent: 0, scale: 1, rotationX: 0, autoAlpha: 1, duration: 1.35, stagger: 0.09, ease: "back.out(1.35)" },
          0.45,
        )
        .fromTo(".hero-mountain-foreground", { yPercent: 18, scale: 1 }, { yPercent: 0, scale: 1, duration: 2.15, ease: "power2.out" }, 0.2)
        .fromTo(".hero-mountain-shade", { autoAlpha: 0 }, { autoAlpha: 0.68, duration: 1.8 }, 0.65)
        .fromTo(".hero-content", { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.15 }, 1.25);
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />
      <main>
        <section ref={heroRef} className="relative min-h-[720px] h-[100svh] bg-[#151b1e] md:min-h-[620px]">
          <div className="hero-frame min-h-[720px] h-[100svh] overflow-hidden bg-[#151b1e] shadow-[0_30px_90px_rgba(33,39,38,0.22)] md:min-h-[620px]">
            <HeroLandscape />

            <div className="hero-content relative z-30 flex h-full flex-col items-end justify-end px-5 pb-8 pt-28 sm:px-7 md:px-14 md:pb-10 md:pt-32">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <Link href="/seoauditor" className="flex min-h-14 min-w-40 items-center justify-center rounded-md bg-[#ad5b2b] px-9 text-base font-bold text-white shadow-[0_12px_32px_rgba(54,25,10,0.28)] transition hover:bg-[#8d4822]">
                    SEO Audit
                  </Link>
                  <Link href="/contact" className="flex min-h-14 min-w-40 items-center justify-center rounded-md border border-[#ad5b2b] bg-[#fbf6eb]/80 px-9 text-base font-bold text-[#9b542a] backdrop-blur-sm transition hover:bg-white">
                    Contact
                  </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-40 overflow-hidden bg-[#f4efe4] px-5 pb-24 pt-20 shadow-[0_-35px_90px_rgba(15,18,20,0.18)] sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto w-full max-w-7xl"
          >
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              What we do
            </p>
            <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <h2 className="font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Three systems that get you found on Google and in AI answers.
              </h2>
              <p className="max-w-2xl text-lg font-medium leading-relaxed text-black/56 lg:justify-self-end">
                Most agencies still optimise for blue links alone. We engineer visibility across search engines and the AI answer engines your customers now ask first.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group rounded-[1.1rem] border border-black/8 bg-white/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.05)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#ad5b2b]/40 md:min-h-[330px] md:p-7"
                >
                  <div className="mb-8 h-2 w-2 rounded-full bg-[#ad5b2b] md:mb-12" />
                  <h3 className="mb-4 text-2xl font-black tracking-tight">{service.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-black/54">{service.body}</p>
                  <span className="mt-8 inline-flex text-sm font-black text-[#9b542a] md:mt-10">
                    {service.cta}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="relative overflow-hidden bg-[#2f3438] px-5 py-24 text-white sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.84fr_1.16fr]">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-[#e0b48b]">
                Selected work
              </p>
              <h2 className="font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Pitchside AI, built to rank before launch
              </h2>
              <p className="mt-7 max-w-xl text-base font-medium leading-relaxed text-white/62">
                Pitchside is a grassroots football platform, think Strava for Sunday-league football. We built their entire search and answer-engine foundation ahead of launch: a full keyword and content architecture, 5 SEO-optimised pages structured for AI citation, and a phased content plan timed to their soft launch. The result is a site engineered to capture search demand from day one rather than waiting months to be found.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <div className="rounded-[1rem] border border-white/12 bg-white/[0.05] px-5 py-4">
                  <div className="font-serif text-4xl font-medium">5</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/42">Pages in progress</div>
                </div>
                <div className="rounded-[1rem] border border-white/12 bg-white/[0.05] px-5 py-4">
                  <div className="font-serif text-4xl font-medium">3k-5k</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/42">Forecast monthly impressions</div>
                </div>
              </div>
              <a
                href="https://pitchside.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex rounded-md bg-white px-7 py-4 text-sm font-black text-[#2f3438] transition hover:bg-[#e0b48b]"
              >
                Visit pitchside.ai
              </a>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 90, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                className="[perspective:1200px]"
              >
                <PitchsidePreview />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.2rem] border border-white/10 bg-white/[0.045] p-7"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">
                  Search architecture
                </p>
                <p className="mt-4 text-lg font-medium leading-relaxed text-white/66">
                  The launch strategy was built around answerable pages, clean internal routes, and citable content blocks so search engines and AI answer systems can understand the platform before the public growth push begins.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
                Our process
              </p>
              <h2 className="sticky top-32 font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                A clear path from invisible to inevitable.
              </h2>
            </div>
            <div className="space-y-4">
              {processSteps.map(([title, text], index) => (
                <div key={title} className="grid gap-6 rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:grid-cols-[0.2fr_1fr]">
                  <div className="text-4xl font-black tracking-tight text-[#ad5b2b]">0{index + 1}</div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">{title}</h3>
                    <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-black/54">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/8 bg-white px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-4 text-center md:grid-cols-3">
              {["UK-based", "Results-focused, no lock-in contracts", "Founder-led delivery"].map((item) => (
                <div key={item} className="rounded-[1rem] border border-black/8 px-6 py-7 text-sm font-black uppercase tracking-[0.13em] text-black/62">
                  {item}
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-base font-medium leading-relaxed text-black/54">
              Founded and run by Abdullah Luqman, building Klarai&apos;s track record one transparent result at a time.
            </p>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <h2 className="font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Engineered by people who build, not just talk.
            </h2>
            <div>
              <p className="text-lg font-medium leading-relaxed text-black/58">
                Klarai is founder-led by Abdullah Luqman, an AI student and developer who builds the same systems we sell. We&apos;re a small UK-focused team that ships real work across SEO, AEO and web development without the bloat or lock-in of larger agencies.
              </p>
              <Link href="/about" className="mt-8 inline-flex rounded-md border border-[#ad5b2b] px-7 py-4 text-sm font-black text-[#9b542a] transition hover:bg-white">
                Connect with the founder
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1150px]">
            <h2 className="font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
              Questions, answered.
            </h2>
            <div className="mt-12 divide-y divide-black/10 rounded-[1.1rem] border border-black/8 bg-white">
              {faqs.map((item) => (
                <div key={item.question} className="grid gap-4 p-7 md:grid-cols-[0.75fr_1.25fr]">
                  <h3 className="text-xl font-black tracking-tight">{item.question}</h3>
                  <p className="text-base font-medium leading-relaxed text-black/56">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1050px] gap-10 text-center">
            <div>
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
                Free visibility scan
              </p>
              <h2 className="font-serif text-4xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                See exactly why competitors outrank you.
              </h2>
            </div>
            <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-black/55">
              Run our free AI audit. In 30 seconds you&apos;ll see your architecture, content gaps and technical SEO. No credit card, no commitment.
            </p>
            <div className="mx-auto w-full max-w-3xl">
              <AuditSearchBar />
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/seoauditor" className="rounded-md bg-[#ad5b2b] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-[#8d4822]">
                Run my free audit
              </Link>
              <Link href="/contact" className="rounded-md border border-[#ad5b2b] px-7 py-4 text-center text-sm font-bold text-[#9b542a] transition hover:bg-[#f9f5ec]">
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>
      </div>
    </>
  );
}
