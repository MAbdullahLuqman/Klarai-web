"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const leftLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Industries", "/industries"],
  ["About", "/about"],
];

const rightLinks = [
  ["Projects", "/portfolio"],
  ["Contact", "/contact"],
];

const mobileLinks = [
  ...leftLinks,
  ...rightLinks,
];

export default function GlobalHeader() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSuppressedRoute = pathname && pathname.startsWith("/admin");

  useEffect(() => {
    if (isSuppressedRoute) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isSuppressedRoute]);

  useEffect(() => {
    if (isSuppressedRoute) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isSuppressedRoute]);

  if (isSuppressedRoute) return null;

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const renderDesktopLink = ([label, href]) => (
    <Link
      key={label}
      href={href}
      className={`rounded-full px-4 py-2 transition hover:bg-white/58 ${isActive(href) ? "bg-white/58 text-[#2f3438]" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 px-5 pt-4 transition-transform duration-500 sm:px-6 sm:pt-6 ${isHidden && !isMobileMenuOpen ? "-translate-y-[130%]" : "translate-y-0"}`}>
        <nav className="mx-auto grid h-14 max-w-[1760px] grid-cols-[1fr_auto] items-center rounded-full border border-white/28 bg-[#f9f0e2]/88 px-5 text-sm font-bold text-[#2f3438] shadow-[0_18px_60px_rgba(14,20,24,0.16)] backdrop-blur-xl md:h-16 md:grid-cols-[1fr_auto_1fr]">
          <div className="hidden items-center gap-1 md:flex">
            {leftLinks.map(renderDesktopLink)}
          </div>

          <Link href="/" className="justify-self-start font-serif text-2xl font-bold tracking-wide text-[#8f4a25] md:justify-self-center" onClick={() => setIsMobileMenuOpen(false)}>
            Klarai
          </Link>

          <div className="hidden items-center justify-end gap-1 md:flex">
            {rightLinks.map(renderDesktopLink)}
            <Link href="/seoauditor" className="ml-2 rounded-full bg-[#2f3438] px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(47,52,56,0.24)] transition hover:bg-[#ad5b2b]">
              SEO Audit
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/8 bg-white/62 text-[#2f3438] shadow-[0_8px_22px_rgba(47,52,56,0.12)] md:hidden"
            aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="flex flex-col gap-1.25">
              <motion.span animate={isMobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 bg-current" />
              <motion.span animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-[2px] w-5 bg-current" />
              <motion.span animate={isMobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 bg-current" />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#f4efe4]/96 px-5 pb-8 pt-24 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-3 rounded-[1.25rem] border border-black/8 bg-white/55 p-5 shadow-[0_24px_80px_rgba(14,20,24,0.12)]">
              {mobileLinks.map(([label, href], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block border-b border-black/8 pb-3 font-serif text-3xl font-medium leading-tight ${isActive(href) ? "text-[#ad5b2b]" : "text-[#2f3438]"}`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-5 flex flex-col gap-3">
              <Link href="/seoauditor" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md bg-[#ad5b2b] px-7 py-4 text-center text-sm font-black text-white">
                SEO Audit
              </Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="rounded-md border border-[#ad5b2b] px-7 py-4 text-center text-sm font-black text-[#9b542a]">
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
