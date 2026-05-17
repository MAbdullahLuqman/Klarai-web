"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalFooter() {
  const pathname = usePathname() || '/';

  // Hide footer on admin panel route if applicable
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-[#050505] relative z-50 border-t border-white/10 pt-32 pb-8 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* 4-Column Layout - Perfectly Spaced Horizontally */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 lg:gap-x-24 gap-y-16 mb-24">
          
          {/* Column 1: Take Action */}
          <div className="flex flex-col items-start gap-8">
            <span className="text-[#008dd8] font-bold text-[11px] uppercase tracking-[0.2em]">Take Action</span>
            <div className="flex flex-col gap-6">
              <Link href="/contact" className="text-white text-xl md:text-2xl font-black uppercase tracking-widest hover:text-[#008dd8] transition-colors">Start A Project</Link>
              <Link href="/seoauditor" className="text-white text-xl md:text-2xl font-black uppercase tracking-widest hover:text-[#008dd8] transition-colors">Free SEO Audit</Link>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col items-start gap-8">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-[0.2em]">Platform</span>
            <div className="flex flex-col gap-5">
              <Link href="/services" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Services</Link>
              <Link href="/about" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">About Us</Link>
              <Link href="/portfolio" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Portfolio</Link>
              <Link href="/contact" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Contact</Link>
              <Link href="/blog" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col items-start gap-8">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-[0.2em]">Legal</span>
            <div className="flex flex-col gap-5">
              <Link href="/privacy-policy" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col items-start gap-8">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-[0.2em]">Connect</span>
            <div className="flex flex-col gap-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">X (Twitter)</a>
              <a href="https://www.linkedin.com/company/klarai-uk/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 text-[15px] font-medium hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Centered Logo & Copyright */}
        <div className="w-full flex flex-col items-center justify-center gap-16 pt-8">
          
          {/* Centered Glowing Logo */}
          <Link href="/" className="text-4xl md:text-5xl font-black tracking-tighter text-[#008dd8] uppercase hover:opacity-80 transition-opacity drop-shadow-[0_0_20px_rgba(0,141,216,0.4)]">
            KLARAI<span className="text-sm align-top relative -top-3 font-bold">®</span>
          </Link>
          
          {/* Copyright & Tagline */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-mono gap-4 text-center md:text-left border-t border-white/5 pt-8">
            <span>© {new Date().getFullYear()} Klar AI. All rights reserved.</span>
            <span>Digital Architecture & Growth</span>
          </div>
        </div>

      </div>
    </footer>
  );
}