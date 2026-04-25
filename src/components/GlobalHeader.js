"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalHeader() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll Hide Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true); 
      } else {
        setIsHidden(false); 
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Industries', path: '/industries' },
    { name: 'Architects', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* --- DESKTOP / MAIN FLOATING HEADER --- */}
      <div className={`fixed top-4 md:top-6 left-0 w-full z-50 flex flex-col items-center px-4 transition-transform duration-500 ease-in-out ${isHidden && !isMobileMenuOpen ? '-translate-y-[150%]' : 'translate-y-0'}`}>
        
        <nav className="bg-white/90 border border-gray-200/60 shadow-md backdrop-blur-xl rounded-full px-2 py-2 flex items-center justify-between w-full max-w-5xl relative z-50">
          
          {/* Logo */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 pl-4 group pr-4 md:pr-6">
            <svg className="w-6 h-6 text-gray-900 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            <span className="text-xl font-sans font-[900] tracking-tighter text-gray-900">Klarai</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-gray-500">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className="relative px-3 py-2 transition-colors z-10 rounded-full">
                {isActive(link.path) && (
                  <motion.span
                    layoutId="activeNavBox"
                    className="absolute inset-0 bg-gray-100 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-200/60 -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 35, mass: 3 }}
                  />
                )}
                <span className={isActive(link.path) ? "text-[#0A101D]" : "hover:text-[#0A101D]"}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* DUAL CTA BUTTONS - High Contrast Solid Colors */}
          <div className="hidden md:flex items-center gap-3 pl-6">
            <Link href="/free-audit" className="bg-[#0A101D] text-white hover:bg-gray-800 shadow-[0_4px_10px_rgba(10,16,29,0.2)] px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all active:scale-95 border border-transparent">
              Contact Us
            </Link>
            <Link href="/seoauditor" className="bg-[#008dd8] text-white hover:bg-[#0077b6] shadow-[0_4px_15px_rgba(0,141,216,0.35)] px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 border border-[#0077b6]/30 active:scale-95">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              SEO AUDITOR
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden pr-2 flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 bg-transparent text-gray-900 rounded-full flex flex-col items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <motion.span animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="w-5 h-[2px] bg-[#0A101D] block transition-transform" />
              <motion.span animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-5 h-[2px] bg-[#0A101D] block transition-opacity" />
              <motion.span animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="w-5 h-[2px] bg-[#0A101D] block transition-transform" />
            </button>
          </div>
        </nav>
      </div>

      {/* --- FULLSCREEN MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { delay: 0.2 } }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-3xl flex flex-col pt-32 px-8 pb-12 overflow-y-auto"
          >
            
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                >
                  <Link 
                    href={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-between"
                  >
                    <span className={`text-4xl font-black tracking-tighter transition-colors ${isActive(link.path) ? 'text-[#0A101D]' : 'text-gray-400 group-hover:text-[#0A101D]'}`}>
                      {link.name}
                    </span>
                    {isActive(link.path) && (
                       <span className="w-3 h-3 rounded-full bg-[#008dd8] shadow-[0_0_10px_rgba(0,141,216,0.6)]" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* DUAL Mobile Footer CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pt-12 border-t border-gray-200 w-full flex flex-col gap-3"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">Ready to Dominate?</p>
              
              <Link 
                href="/free-audit" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#0A101D] text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-transform"
              >
                Contact Us
              </Link>

              <Link 
                href="/seoauditor" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#008dd8] text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_8px_25px_rgba(0,141,216,0.35)] active:scale-95 transition-transform"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                SEO AUDITOR TOOL
              </Link>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}