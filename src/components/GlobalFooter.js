"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const platformLinks = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Portfolio", "/portfolio"],
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

const serviceLinks = [
  ["Technical SEO", "/services/seo-services"],
  ["AEO/GEO", "/services/aeo-services"],
  ["Web Development", "/services/web-development"],
];

export default function GlobalFooter() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative z-50 overflow-hidden border-t border-white/10 bg-[#151b1e] px-5 py-20 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(173,91,43,0.22)_0%,rgba(173,91,43,0)_34%),radial-gradient(circle_at_82%_8%,rgba(111,143,163,0.18)_0%,rgba(111,143,163,0)_32%)]" />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.1fr_0.9fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label="Klarai home">
              <Image
                src="/klarai-logo-transparent.png"
                alt="Klarai"
                width={190}
                height={54}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-white/58">
              Search architecture, answer-engine visibility and high-converting web systems for UK-focused brands.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/seoauditor" className="rounded-md bg-[#ad5b2b] px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-[#8d4822]">
                SEO Audit
              </Link>
              <Link href="/contact" className="rounded-md border border-white/16 px-6 py-3.5 text-center text-sm font-black text-white/78 transition hover:border-[#6f8fa3] hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">Platform</p>
            <div className="flex flex-col gap-3">
              {platformLinks.map(([label, href]) => (
                <Link key={label} href={href} className="text-sm font-semibold text-white/62 transition hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">Services</p>
            <div className="flex flex-col gap-3">
              {serviceLinks.map(([label, href]) => (
                <Link key={label} href={href} className="text-sm font-semibold text-white/62 transition hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">Legal</p>
            <div className="flex flex-col gap-3">
              <Link href="/privacy-policy" className="text-sm font-semibold text-white/62 transition hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-sm font-semibold text-white/62 transition hover:text-white">
                Terms of Service
              </Link>
              <a href="https://www.linkedin.com/company/klarai-uk/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white/62 transition hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/34 md:flex-row">
          <span>© {new Date().getFullYear()} Klarai. All rights reserved.</span>
          <span className="text-[#6f8fa3]">Visibility engineered with trust.</span>
        </div>
      </div>
    </footer>
  );
}
