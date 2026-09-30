"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { homepageFonts } from "@/lib/homepage-fonts";

const platformLinks = [
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["Case Studies", "/case-studies"],
  ["Portfolio", "/portfolio"],
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
];

const serviceLinks = [
  ["Technical SEO", "/services/seo-services"],
  ["AEO/GEO", "/services/aeo-services"],
  ["Web Development", "/services/web-development"],
  ["Technical SEO Audit", "/services/technical-seo-audit"],
  ["SEO Content Writing", "/services/seo-content-writing-services"],
  ["White Label SEO", "/services/white-label-seo-agency"],
];

export default function GlobalFooter() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className={`home-footer ${homepageFonts}`}><div className="home-container">
      <div className="home-footer-top"><div><Link href="/" className="home-footer-title" aria-label="Klarai home">Klarai<span className="text-[#ad5b2b]">✳</span></Link><p>Search architecture, answer-engine visibility and high-converting web systems for UK-focused brands.</p><Link href="/contact" className="home-button mt-6">Start a conversation ↗</Link></div>
        {[["Explore", platformLinks], ["Services", serviceLinks], ["Elsewhere", [["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms-and-conditions"], ["LinkedIn", "https://www.linkedin.com/company/klarai-uk/"]]]].map(([title, links]) => <div className="home-footer-links" key={title}><h3>{title}</h3>{links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>)}
      </div><div className="home-footer-bottom"><span>© {new Date().getFullYear()} Klarai. All rights reserved.</span><span>Visibility engineered with trust.</span></div>
    </div></footer>
  );

}
