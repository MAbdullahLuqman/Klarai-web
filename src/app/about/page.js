"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const TEAM = [
  {
    id: "abdullah",
    name: "Abdullah Luqman",
    role: "Founder and Lead System Architect",
    image: "/1.jpg",
    bio: "An AI student and developer building the same search, answer-engine, and web systems Klarai sells. Abdullah leads strategy, architecture, and delivery so clients work close to the people shipping the work.",
    skills: ["SEO/AEO", "Next.js", "Search Architecture", "Growth Strategy"],
    linkedin: "https://www.linkedin.com/in/abdullahluqman/",
  },
  {
    id: "ahmad",
    name: "Ahmad Ali Luqman",
    role: "Growth and Operations Partner",
    image: "",
    bio: "Supports Klarai across client communication, operations, and growth so delivery stays organised, clear, and close to the business outcome.",
    skills: ["Operations", "Client Support", "Growth", "Research"],
    linkedin: "https://www.linkedin.com/in/ahmadaliluqman/",
  },
];

const principles = [
  [
    "Structural clarity",
    "We start with architecture: routes, content hierarchy, technical health, and the exact jobs every page must perform.",
  ],
  [
    "Transparent delivery",
    "No black boxes or vague activity reports. You see what is being built, why it matters, and what changed.",
  ],
  [
    "Compounding visibility",
    "We prioritise work that can keep paying off: rankable pages, citable answers, schema, and conversion-ready web experiences.",
  ],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2f3438]">
      <section className="px-5 pb-20 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              About Klarai
            </p>
            <h1 className="font-serif text-6xl font-medium leading-[0.96] tracking-tight sm:text-8xl">
              Engineered by people who build, not just talk.
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-black/58">
              Klarai is a founder-led UK visibility studio for SEO, AEO, and high-converting web development. We build calm, credible systems that help customers and AI answer engines understand why your business should be found.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/seoauditor" className="rounded-md bg-[#ad5b2b] px-7 py-4 text-center text-sm font-black text-white transition hover:bg-[#8d4822]">
                SEO Audit
              </Link>
              <Link href="/services" className="rounded-md border border-[#ad5b2b] px-7 py-4 text-center text-sm font-black text-[#9b542a] transition hover:bg-white">
                View services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#2f3438] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <h2 className="font-serif text-5xl font-medium leading-[0.98] sm:text-7xl">
              The named team behind the work.
            </h2>
            <p className="max-w-2xl text-base font-medium leading-relaxed text-white/58 lg:justify-self-end">
              A small team is not a weakness when the work is technical. It means tighter decisions, faster delivery, and fewer layers between strategy and execution.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {TEAM.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 46 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.1rem] border border-white/10 bg-white/[0.045] p-7"
              >
                <div className="mb-8 grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-white/12 bg-white/10">
                  {member.image ? (
                    <img src={member.image} alt={`${member.name}, ${member.role}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-[#e0b48b]">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black tracking-tight">{member.name}</h3>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#e0b48b]">{member.role}</p>
                <p className="mt-5 text-sm font-medium leading-relaxed text-white/62">{member.bio}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/54">
                      {skill}
                    </span>
                  ))}
                </div>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex text-sm font-black text-white transition hover:text-[#e0b48b]">
                  Connect on LinkedIn
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              How we think
            </p>
            <h2 className="font-serif text-5xl font-medium leading-[0.98] sm:text-7xl">
              Calm systems beat noisy campaigns.
            </h2>
          </div>
          <div className="space-y-4">
            {principles.map(([title, body], index) => (
              <div key={title} className="grid gap-6 rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:grid-cols-[0.18fr_1fr]">
                <div className="text-4xl font-black tracking-tight text-[#ad5b2b]">0{index + 1}</div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                  <p className="mt-3 text-base font-medium leading-relaxed text-black/56">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
