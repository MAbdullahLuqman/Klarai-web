"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AdminModeContext = createContext();

export function AdminModeProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState('user'); // 'admin' or 'user'
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoggedIn(true);
        setViewMode('admin'); // Default to admin view if they are logged in
      } else {
        setIsAdminLoggedIn(false);
        setViewMode('user');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'admin' ? 'user' : 'admin');
  };

  return (
    <AdminModeContext.Provider value={{ isAdminLoggedIn, viewMode, setViewMode, toggleViewMode, authLoading }}>
      {children}
      
      {/* 
        THE FIX: This entire block is wrapped in {isAdminLoggedIn && ( ... )}
        If a normal user visits, this code does not render AT ALL. No ghost boxes.
      */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-[#111] border border-white/10 rounded-full flex items-center px-4 py-2 gap-4 shadow-2xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 pr-2 border-r border-white/10">
            ADMIN MODE
          </span>
          
          <button 
            onClick={() => setViewMode('user')} 
            className={`text-xs font-bold transition-colors ${viewMode === 'user' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            👁 USER VIEW
          </button>
          
          <button 
            onClick={() => setViewMode('admin')} 
            className={`text-xs font-bold transition-colors ${viewMode === 'admin' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            ✏️ ADMIN VIEW
          </button>
        </div>
      )}
      
    </AdminModeContext.Provider>
  );
}

// Custom hook to use the context easily in any file
export function useAdminMode() {
  return useContext(AdminModeContext);
}