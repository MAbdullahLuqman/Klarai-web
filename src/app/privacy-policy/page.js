import React from "react";

export const revalidate = 0;
import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Privacy Policy | Klarai",
  description: "How Klarai collects, uses, and protects your data.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: canonical("/privacy-policy"),
  },
};

const sections = [
  [
    "Introduction",
    "Welcome to Klarai. We respect your privacy and are committed to protecting your personal data. This policy explains how we look after your personal data when you visit our website and tells you about your privacy rights.",
  ],
  [
    "The data we collect",
    "We may collect identity data, contact data, and technical data such as browser type, IP address, time zone setting, device information, and website interaction data.",
  ],
  [
    "How we use your data",
    "We use your personal data when the law allows us to, including when we need to respond to an enquiry, perform a contract, improve our services, protect the website, or comply with a legal obligation.",
  ],
  [
    "Contact us",
    "If you have questions about this privacy policy or our privacy practices, contact us at founder@klarai.uk.",
  ],
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
          Legal
        </p>
        <h1 className="font-serif text-6xl font-medium leading-[0.96] tracking-tight sm:text-8xl">
          Privacy Policy
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
