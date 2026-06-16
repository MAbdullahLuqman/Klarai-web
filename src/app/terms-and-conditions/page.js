import React from "react";

import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Terms & Conditions | Klarai",
  description: "Terms and conditions for using Klarai digital marketing services.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: canonical("/terms-and-conditions"),
  },
};

const sections = [
  [
    "Agreement to terms",
    "By accessing our website and using our digital marketing, SEO, AEO, and web development services, you agree to be bound by these terms and any applicable local laws.",
  ],
  [
    "Services and deliverables",
    "Klarai provides digital marketing, search visibility, answer-engine optimisation, and web development services. Specific deliverables, timelines, and costs are outlined in individual client agreements or statements of work.",
  ],
  [
    "Intellectual property rights",
    "Unless otherwise stated, Klarai or its licensors own the intellectual property rights for website materials. Client project ownership and licensing are handled through the relevant project agreement.",
  ],
  [
    "Limitations of liability",
    "Klarai will not be liable for indirect, incidental, or consequential damages arising from the use of this website or materials, except where liability cannot be excluded by law.",
  ],
];

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
          Legal
        </p>
        <h1 className="font-serif text-6xl font-medium leading-[0.96] tracking-tight sm:text-8xl">
          Terms & Conditions
        </h1>
        <p className="mt-8 text-sm font-medium text-black/48">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="mt-12 divide-y divide-black/10 rounded-[1.1rem] border border-black/8 bg-white">
          {sections.map(([title, body], index) => (
            <section key={title} className="grid gap-4 p-7 md:grid-cols-[0.22fr_0.78fr]">
              <div className="text-3xl font-black tracking-tight text-[#ad5b2b]">0{index + 1}</div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">{title}</h2>
                <p className="mt-3 text-base font-medium leading-relaxed text-black/56">{body}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
