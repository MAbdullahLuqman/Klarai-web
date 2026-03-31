"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // THE FIX: If we are on the admin panel, do not render the public header at all
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  // Your future pages go here!
  const navLinks = [
    { name: 'Home', href: '/' },
    
    { name: 'Industries', href: '/industries' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <>
      {/* GLASSMORPHISM HEADER 
        fixed, high z-index, frosted glass background
      */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-[#030303]/40 backdrop-blur-md border-b border-white/5 transition-all py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* 1. LOGO */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/klarailogo.webp" 
              alt="KLARAI" 
              className="h-7 md:h-8 w-auto object-contain drop-shadow-lg cursor-pointer hover:opacity-80 transition-opacity" 
            />
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`text-sm font-bold tracking-widest uppercase transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. DESKTOP CTA - CONNECT WITH FOUNDER */}
          <div className="hidden md:block">
            <Link 
              href="https://www.linkedin.com/in/abdullahluqman/" 
              target="_blank"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/30 hover:scale-105"
            >
              Connect with Founder
            </Link>
          </div>

          {/* 4. MOBILE MENU BUTTON */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* 5. MOBILE FULL-SCREEN MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-[90] bg-[#030303]/95 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-black tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="w-12 h-px bg-white/20 my-4"></div>

          <Link 
            href="https://www.linkedin.com/in/abdullahluqman/" 
            target="_blank"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-8 py-4 text-sm font-bold tracking-widest text-white uppercase bg-[#185FA5] rounded-full hover:bg-blue-600 transition-colors"
          >
            Connect with Founder
          </Link>
        </nav>
      </div>
    </>
  );
}