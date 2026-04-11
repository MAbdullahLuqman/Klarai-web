import React from 'react';
import Link from 'next/link';

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0A101D] relative z-10">
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        
        {/* FIXED: Changed text-white-500 (invalid) to text-white. Reordered to put About Us first. */}
        <div className="flex flex-wrap justify-center md:justify-start gap-8 font-mono text-[12px] uppercase tracking-widest text-white font-bold">
          
          {/* FIXED: About Us now points to /about */}
          <Link href="/about" className="hover:text-[#008dd8] transition-colors duration-200">About Us</Link>

          <Link href="/privacy-policy" className="hover:text-[#008dd8] transition-colors duration-200">Privacy Policy</Link>

          <Link href="/terms-and-conditions" className="hover:text-[#008dd8] transition-colors duration-200">Terms of Service</Link>
          
          <a href="https://www.linkedin.com/company/klarai-uk/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors duration-200">LinkedIn</a>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          {/* FIXED: Changed font-white (invalid) to font-black for weight */}
          <Link href="/" className="text-2xl font-black text-white tracking-tighter hover:text-[#008dd8] transition-colors">Klarai</Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">© {new Date().getFullYear()} Klarai Digital Architecture.</p>
        </div>

      </div>
    </footer>
  );
}