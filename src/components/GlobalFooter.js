import React from 'react';
import Link from 'next/link';

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-gray-200 bg-black relative z-10">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-wrap justify-center gap-8 font-mono text-[12px] uppercase tracking-widest text-white-500 font-bold">
            
          <Link href="/privacy-policy" className="hover:text-cyan-500 transition-colors duration-200">Privacy Policy</Link>

          <Link href="/privacy-policy" className="hover:text-cyan-500 transition-colors duration-200">About us </Link>

          <Link href="/terms-and-conditions" className="hover:text-cyan-500 transition-colors duration-200">Terms of Service</Link>
          <a href="https://www.linkedin.com/company/klarai-uk/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors duration-200">LinkedIn</a>
        </div>
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="text-2xl font-white text-white tracking-tighter hover:text-cyan-500 transition-colors">Klarai</Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">© {new Date().getFullYear()} Klarai Digital Architecture.</p>
        </div>
      </div>
    </footer>
  );
}