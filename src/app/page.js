"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import AuditSearchBar from "@/components/AuditSearchBar";

gsap.registerPlugin(ScrollTrigger);

const mountainImage = "/images/hero-mountain.jpg";
const mountainForegroundImage = "/images/hero-mountain-foreground.webp";

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
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#657d9b_0%,#c5a2a2_28%,#f0b06d_48%,#f5d8a0_66%,#5f6f74_100%)]" />
      <img
        src={mountainImage}
        alt=""
        draggable={false}
        decoding="async"
        fetchPriority="high"
        className="hero-mountain-base pointer-events-none absolute inset-0 z-[1] h-full w-full select-none object-cover object-[48%_100%] brightness-[0.9] contrast-[1.08] saturate-[1.02] will-change-transform [backface-visibility:hidden] [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_28%,rgba(0,0,0,0.16)_41%,rgba(0,0,0,0.5)_50%,#000_62%,#000_100%)] [transform:translate3d(0,0,0)] md:object-center"
      />
      <div
        className="hero-sky-night absolute inset-0 z-[2] bg-[linear-gradient(180deg,#111827_0%,#233044_34%,#313b48_56%,#101418_100%)]"
      />
      <div
        className="hero-sun absolute left-[78%] top-[24%] z-10 h-36 w-36 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_46%_24%,#fffdf2_0%,#ffe4a2_16%,#ffc164_34%,rgba(255,145,63,0.46)_52%,rgba(243,188,122,0)_76%)] opacity-55 shadow-[0_0_42px_rgba(255,184,96,0.18)] mix-blend-screen blur-[1px] will-change-transform [backface-visibility:hidden] [transform:translate3d(-50%,0,0)] sm:left-[67%] sm:top-[11%] sm:h-64 sm:w-64 sm:opacity-90 sm:shadow-[0_0_80px_rgba(255,184,96,0.34)] lg:left-[57%] lg:top-[9%] lg:h-80 lg:w-80"
      />
      <img
        src={mountainForegroundImage}
        alt=""
        draggable={false}
        decoding="async"
        fetchPriority="high"
        className="hero-mountain-foreground pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-cover object-[48%_100%] brightness-[1.02] contrast-[1.08] saturate-[1.04] will-change-transform [backface-visibility:hidden] [transform:translate3d(0,0,0)] md:object-center"
      />
      <div
        className="hero-mountain-shade absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(18,24,31,0.02)_0%,rgba(18,24,31,0.28)_46%,rgba(2,5,8,0.82)_100%)]"
      />
      <div className="absolute inset-0 z-30 bg-[linear-gradient(180deg,rgba(5,7,10,0.1)_0%,rgba(5,7,10,0.02)_32%,rgba(5,7,10,0.24)_58%,rgba(5,7,10,0.78)_100%)] md:hidden" />
      <div className="absolute inset-0 z-30 bg-[linear-gradient(90deg,rgba(16,12,10,0.42)_0%,rgba(18,15,15,0.18)_45%,rgba(13,18,24,0.24)_100%)]" />
      <div className="absolute inset-0 z-30 bg-[radial-gradient(circle_at_57%_34%,rgba(255,220,168,0.16)_0%,rgba(12,16,20,0.16)_56%,rgba(5,7,10,0.58)_100%)]" />
    </div>
  );
}

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  }, []);

  return null;
}

function PitchsidePreview() {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/14 bg-[#0d1214] shadow-[0_35px_100px_rgba(0,0,0,0.34)]">
      <div className="flex h-11 items-center justify-between border-b border-white/10 bg-[#151b1e] px-4">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="max-w-[58%] truncate rounded-md border border-white/10 bg-black/30 px-5 py-1 text-center text-[10px] font-bold text-white/48">
          pitchside.ai
        </div>
        <Link href="/portfolio" className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50 transition hover:text-white">
          View
        </Link>
      </div>
      <div className="relative aspect-[16/10] bg-black">
        <iframe
          src="https://pticheside.vercel.app/"
          title="Pitchside AI website preview"
          loading="lazy"
          className="h-full w-full border-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_58%,rgba(0,0,0,0.34)_100%)]" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-sky-night", { autoAlpha: 0, force3D: true });
      gsap.set(".hero-mountain-shade", { autoAlpha: 0, force3D: true });
      gsap.set(".hero-mountain-base, .hero-mountain-foreground", { y: 0, z: 0.01, scale: 1.045, transformOrigin: "50% 50%", force3D: true });
      gsap.set(".hero-sun", { y: 0, z: 0.01, scale: 1, autoAlpha: 1, transformOrigin: "50% 50%", force3D: true });
      gsap.set(".hero-content", { y: 0, z: 0.01, scale: 1, autoAlpha: 1, transformOrigin: "50% 50%", force3D: true });
      gsap.set(".hero-frame", { z: 0.01, scale: 1, transformOrigin: "50% 50%", force3D: true });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".hero-sun", { y: 455, scale: 0.58, autoAlpha: 0, duration: 1 }, 0)
        .to(".hero-sky-night", { autoAlpha: 1, duration: 1 }, 0)
        .to(".hero-mountain-shade", { autoAlpha: 0.86, duration: 1 }, 0)
        .to(".hero-mountain-base, .hero-mountain-foreground", { y: -24, scale: 1.08, duration: 1 }, 0)
        .to(".hero-content", { y: -34, scale: 0.982, autoAlpha: 0.72, duration: 1 }, 0)
        .to(".hero-frame", { scale: 0.992, duration: 1 }, 0);
    }, heroRef);

    const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refresh);
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
    <ReactLenis
      root
      options={{
        autoRaf: true,
        duration: 1.28,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.82,
        touchMultiplier: 1.05,
        anchors: true,
      }}
    >
      <LenisScrollTriggerSync />
      <div className="min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main>
        <section ref={heroRef} className="hero-pin relative min-h-[720px] h-[100svh] bg-[#151b1e] md:min-h-[620px]">
          <div className="hero-frame min-h-[720px] h-[100svh] overflow-hidden bg-[#151b1e] shadow-[0_30px_90px_rgba(33,39,38,0.22)] md:min-h-[620px]">
            <HeroLandscape />

            <div className="hero-content relative z-20 flex h-full flex-col justify-between px-5 pb-8 pt-28 sm:px-7 md:px-14 md:pb-10 md:pt-32">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-[900px] font-serif text-[2.5rem] font-medium leading-[0.98] tracking-[0.01em] text-[#fff7ed] drop-shadow-[0_5px_28px_rgba(10,12,14,0.58)] sm:text-6xl md:text-7xl lg:text-[7.4rem]"
                >
                  Visibility is not
                  <br />
                  an accident.
                  <br />
                  Neither is trust.
                </motion.h1>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.68fr_1fr] md:items-end">
                <div className="order-2 flex flex-col gap-3 sm:flex-row md:order-1">
                  <Link href="/seoauditor" className="rounded-md bg-[#ad5b2b] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-[#8d4822]">
                    SEO Audit
                  </Link>
                  <Link href="/contact" className="rounded-md border border-[#ad5b2b] bg-[#fbf6eb]/58 px-7 py-4 text-center text-sm font-bold text-[#9b542a] backdrop-blur-sm transition hover:bg-white">
                    Contact
                  </Link>
                </div>
                <p className="order-1 max-w-xl rounded-md border border-white/10 bg-[#111827]/34 p-4 text-sm font-semibold leading-relaxed text-white shadow-[0_14px_42px_rgba(0,0,0,0.18)] backdrop-blur-md sm:text-base md:order-2 md:justify-self-end md:border-0 md:bg-transparent md:p-0 md:text-right md:text-lg md:shadow-none md:backdrop-blur-0">
                  Escape the noise with search architecture, AI-readable authority, and digital experiences that feel calm, credible, and impossible to miss.
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 hidden h-px w-[72%] -translate-x-1/2 bg-white/28 md:block" />
          </div>
        </section>

        <section className="relative z-40 overflow-hidden bg-[#f4efe4] px-5 pb-24 pt-20 shadow-[0_-35px_90px_rgba(15,18,20,0.18)] sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-[1480px]"
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

        <section className="relative overflow-visible bg-[#2f3438] px-5 py-24 text-white sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.84fr_1.16fr]">
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
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.72fr_1.28fr]">
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
          <div className="mx-auto max-w-[1480px]">
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
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
    </ReactLenis>
  );
}
