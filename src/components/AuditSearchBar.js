"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditSearchBar({ className = "" }) {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleStartAudit = (e) => {
    e.preventDefault();
    if (!url) return;
    // Sends the user to the auditor page with auto=true to trigger the scan instantly
    router.push(`/seoauditor?url=${encodeURIComponent(url)}&auto=true`);
  };

  return (
    <form onSubmit={handleStartAudit} className={`relative w-full max-w-3xl mx-auto group ${className}`}>
      <div className="absolute -inset-1 bg-[#e0b48b] rounded-[2rem] blur opacity-20 group-hover:opacity-34 transition duration-500"></div>
      <div className="relative flex flex-col md:flex-row items-center bg-white border border-black/8 rounded-[1.1rem] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.08)] focus-within:border-[#ad5b2b]/60 transition-colors">
        
        <div className="flex-1 w-full flex items-center px-6 py-4 md:py-2">
          <svg className="w-6 h-6 text-gray-400 mr-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Enter your website (e.g. example.co.uk)" 
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent text-lg md:text-xl font-bold text-[#2f3438] placeholder:text-black/28 outline-none"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
        
        <button type="submit" className="w-full md:w-auto bg-[#ad5b2b] text-white px-10 py-5 md:py-6 rounded-md font-black text-sm uppercase tracking-widest hover:bg-[#8d4822] transition-all active:scale-95 shadow-[0_10px_20px_rgba(173,91,43,0.2)] mt-2 md:mt-0 whitespace-nowrap">
          Run Audit
        </button>

      </div>
    </form>
  );
}
