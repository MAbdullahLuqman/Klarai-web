"use client";
import React, { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / docHeight) * 100;
      setScrollWidth(scrollPercent);
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);
    
    // Call it once on mount to set initial state
    handleScroll();

    // Clean up the listener when unmounted to prevent memory leaks
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 z-[9999]">
      <div 
        className="h-full bg-[#008dd8] transition-all duration-150 ease-out" 
        style={{ width: `${scrollWidth}%` }}
      ></div>
    </div>
  );
}