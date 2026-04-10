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

  return (
    <>
      <div className={`fixed top-4 md:top-6 left-0 w-full z-40 flex flex-col items-center px-4 transition-transform duration-500 ease-in-out ${isHidden && !isMobileMenuOpen ? '-translate-y-[150%]' : 'translate-y-0'}`}>
        
        <nav className="bg-white/85 border border-gray-200/50 shadow-sm backdrop-blur-xl rounded-full px-2 py-2 flex items-center justify-between w-full max-w-4xl relative z-50">
          
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 pl-4 group pr-4 md:pr-8">
            <svg className="w-6 h-6 text-gray-900 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
            <span className="text-xl font-sans font-[900] tracking-tighter text-gray-900">Klarai</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-gray-500">
            <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link href="/industries" className="hover:text-blue-600 transition-colors">Industries</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">Architects</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          </div>

          <div className="hidden md:block pl-8">
            {/* FIXED: Changed to "Initiate Sequence" with Lime Green styling and subtle glow */}
            <Link href="/free-audit" className="bg-[#ccff00] text-[#050505] hover:bg-[#b3e600] hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all block border border-[#b3e600]/30 active:scale-95 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Initiate Sequence
            </Link>
          </div>

          <div className="md:hidden pr-2 flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 bg-transparent text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </nav>
      </div>

      {/* --- Mobile Menu Remains Exactly the Same --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-sm bg-[#e8ecef]/95 backdrop-blur-3xl shadow-2xl rounded-[2rem] p-5 flex flex-col gap-4 border border-white/50"
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center gap-2">
                 
                  <span className="text-xl font-sans font-[900] tracking-tighter text-gray-900"></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-900 p-1">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="bg-white hover:bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="text-[17px] font-medium text-gray-900">Services</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>

                <Link href="/industries" onClick={() => setIsMobileMenuOpen(false)} className="bg-white hover:bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span className="text-[17px] font-medium text-gray-900">Industries</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>

                 <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="bg-white hover:bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    <span className="text-[17px] font-medium text-gray-900">Architects</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>

                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="bg-white hover:bg-gray-50 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3L22 4"></path></svg>
                    <span className="text-[17px] font-medium text-gray-900">Blog</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
              </div>

              <Link href="/free-audit" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 bg-[#1a202c] text-[white] flex items-center justify-center gap-2 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:bg-black transition-all active:scale-95">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Initiate Sequence
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}