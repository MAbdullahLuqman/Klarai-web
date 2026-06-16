"use client";
import React, { useState, useEffect } from 'react';
import { useAdminMode } from '@/context/AdminModeContext';

export default function AdminToggle() {
  const { isAdminLoggedIn, viewMode, toggleViewMode, authLoading } = useAdminMode();
  const [mounted, setMounted] = useState(false);

  // This prevents Next.js Server-Side Rendering from silently crashing the component
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 🚨 I HAVE COMMENTED THIS OUT SO THE BUTTON IS FORCED TO SHOW 🚨
  // if (authLoading || !isAdminLoggedIn) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999999] flex items-center bg-[#0a0a0a] border border-white/10 p-1.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      
      {/* 🔴 DEBUG INDICATOR: Tells you exactly what Firebase sees */}
      <div className={`px-4 text-[10px] font-black uppercase tracking-widest ${isAdminLoggedIn ? 'text-[#10b981]' : 'text-red-500'}`}>
        {authLoading ? 'AUTH: LOADING...' : (isAdminLoggedIn ? 'AUTH: YES' : 'AUTH: NO')}
      </div>

      <button
        onClick={() => viewMode !== 'user' && toggleViewMode()}
        className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
          viewMode === 'user' 
            ? 'bg-[#10b981] text-white shadow-lg' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
      >
        👁️ User View
      </button>
      <button
        onClick={() => viewMode !== 'admin' && toggleViewMode()}
        className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
          viewMode === 'admin' 
            ? 'bg-[#008dd8] text-white shadow-lg' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
      >
        ✏️ Admin View
      </button>
    </div>
  );
}