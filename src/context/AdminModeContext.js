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
    <AdminModeContext.Provider value={{ isAdminLoggedIn, viewMode, toggleViewMode, authLoading }}>
      {children}
    </AdminModeContext.Provider>
  );
}

// Custom hook to use the context easily in any file
export function useAdminMode() {
  return useContext(AdminModeContext);
}