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

  // --- SCROLL LISTENER EFFECT ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide the header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true); 
        setIsMobileMenuOpen(false); // Close mobile menu if they start scrolling down
      } else {
        setIsHidden(false); 
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hide entirely on Admin
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <div className={`fixed top-4 md:top-6 left-0 w-full z-50 flex flex-col items-center px-4 transition-transform duration-500 ease-in-out ${isHidden ? '-translate-y-[150%]' : 'translate-y-0'}`}>
      
      {/* --- MAIN HEADER PILL --- */}
      <nav className="bg-white/90 border border-gray-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl rounded-full px-2 py-2 flex items-center justify-between w-full max-w-4xl relative z-50">
        
        {/* LOGO */}
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 pl-4 group pr-4 md:pr-8">
          <svg className="w-6 h-6 text-gray-900 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
          <span className="text-xl font-black tracking-tighter text-gray-900">Klarai</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center space-x-6 font-mono text-[11px] font-bold tracking-[0.1em] uppercase text-gray-500">
          <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link href="/industries" className="hover:text-blue-600 transition-colors">Industries</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        </div>

        {/* DESKTOP CTA */}
        <div className="hidden md:block pl-8">
          <Link href="/free-audit" className="bg-gray-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 px-6 py-2.5 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase transition-all block">
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden pr-2 flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>

      </nav>

      {/* --- MOBILE DROPDOWN MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full mt-2 w-full max-w-4xl px-4 z-40"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-3xl p-6 flex flex-col gap-6">
              
              <div className="flex flex-col space-y-4">
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter text-gray-900 hover:text-blue-600 transition-colors border-b border-gray-100 pb-4">
                  Services
                </Link>
                <Link href="/industries" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter text-gray-900 hover:text-blue-600 transition-colors border-b border-gray-100 pb-4">
                  Industries
                </Link>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter text-gray-900 hover:text-blue-600 transition-colors border-b border-gray-100 pb-4">
                  Blog
                </Link>
              </div>

              <Link href="/free-audit" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#ccff00] text-gray-900 text-center py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-md active:scale-95 transition-all">
                Initiate Sequence
              </Link>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional Overlay to darken the background when mobile menu is open */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 h-screen w-screen bg-gray-900/20 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

    </div>
  );
}