"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

export default function BlogComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if(email) {
      // Here you would normally push the email to Firebase or your newsletter provider
      setIsSubscribed(true);
      setEmail('');
    }
  };

  // Fake placeholder data for the "loading" skeleton cards
  const skeletons = [1, 2, 3];

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-cyan-300 selection:text-black min-h-screen overflow-hidden flex flex-col">
      <GlobalHeader />

      <main className="flex-1 pt-32 pb-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6 mb-20">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute -top-10 left-1/4 w-[300px] h-[300px] bg-cyan-300/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-10 right-1/4 w-[300px] h-[300px] bg-fuchsia-300/20 rounded-full blur-[100px]"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
              System Compiling
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
              Transmissions <span className="text-gray-300">Offline</span>.
            </h1>
            <p className="text-xl mb-10 text-gray-500 font-medium max-w-2xl mx-auto">
              Our architects are currently compiling high-fidelity growth blueprints, technical SEO breakdowns, and scaling methodologies. 
            </p>

            {/* NOTIFY ME FORM */}
            <div className="max-w-md mx-auto bg-white p-2 rounded-2xl border-2 border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative z-20">
             

            </div>
          </motion.div>
        </section>

        {/* --- SKELETON GRID (Visual Proof of "Coming Soon") --- */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-gray-400 font-bold">
              Encrypted Archives [3 Items Found]
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skeletons.map((item, index) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-sm relative overflow-hidden"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-10 pointer-events-none"></div>
                
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center">
                   <span className="font-mono text-gray-300 text-[10px] tracking-widest uppercase">Rendering Asset...</span>
                </div>
                
                {/* Text Placeholders */}
                <div className="space-y-3 mb-6">
                  <div className="h-3 bg-blue-50 rounded-full w-24 mb-4"></div>
                  <div className="h-6 bg-gray-100 rounded-lg w-full"></div>
                  <div className="h-6 bg-gray-100 rounded-lg w-4/5"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-gray-50 rounded-full w-full"></div>
                  <div className="h-2 bg-gray-50 rounded-full w-5/6"></div>
                  <div className="h-2 bg-gray-50 rounded-full w-4/6"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      
      
      {/* Tailwind Custom Keyframe for the Shimmer */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}