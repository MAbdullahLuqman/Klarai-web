"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// UPDATE THIS IMPORT to point to your existing firebase configuration file
import { db } from '@/lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FreeAuditPage() {
  // 1. Form State Management (Added phone)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    goal: 'seo'
  });
  
  // 2. UI Status Management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // 3. Input Handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 4. Firebase Database Injection
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const leadsRef = collection(db, 'leads');

      await addDoc(leadsRef, {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
    } catch (err) {
      console.error("Database connection error: ", err);
      setError('System failure. Could not process request. Please check your database connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        {/* Navigation Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white font-tech text-xs uppercase tracking-widest mb-12 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Abort Sequence
        </Link>

        {isSuccess ? (
          // SUCCESS STATE
          <div className="p-10 md:p-16 rounded-3xl bg-black/40 border border-green-500/30 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="font-nothing text-4xl md:text-5xl text-white mb-4 uppercase tracking-widest">Data Received</h2>
            <p className="font-tech text-sm text-gray-400 tracking-[0.2em] mb-10 max-w-md mx-auto uppercase">
              Your audit request is securely logged. Our systems are analyzing your data. We will initiate contact shortly.
            </p>
            <Link href="/" className="inline-block border border-white/20 text-white px-8 py-3 font-tech text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
              Return to Core
            </Link>
          </div>
        ) : (
          // LEAD CAPTURE FORM
          <div className="p-8 md:p-14 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(255,255,255,0.03)]">
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
              <p className="font-tech text-blue-400 text-xs font-bold tracking-[0.4em] uppercase">Secure Uplink</p>
            </div>

            <h1 className="font-nothing text-4xl md:text-6xl text-white mb-2 uppercase tracking-widest">
              Initiate Audit
            </h1>
            <p className="font-tech text-xs text-gray-500 tracking-[0.2em] mb-10 uppercase">
              Input target parameters for comprehensive system analysis.
            </p>

            {error && (
              <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 font-tech text-xs tracking-widest uppercase">
                ERROR: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 2x2 Grid for balanced inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name Input (Optional) */}
                <div className="space-y-2">
                  <label className="block font-tech text-[10px] text-gray-400 uppercase tracking-[0.2em]">Primary Contact (Optional)</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-tech text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors placeholder:text-gray-700"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Input (Compulsory) */}
                <div className="space-y-2">
                  <label className="block font-tech text-[10px] text-gray-400 uppercase tracking-[0.2em]">Comms Relay (Email) *</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-tech text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors placeholder:text-gray-700"
                    placeholder="john@company.com"
                  />
                </div>

                {/* Phone Input (Compulsory) */}
                <div className="space-y-2">
                  <label className="block font-tech text-[10px] text-gray-400 uppercase tracking-[0.2em]">Direct Line (Phone) *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-tech text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors placeholder:text-gray-700"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Website Input (Optional) */}
                <div className="space-y-2">
                  <label className="block font-tech text-[10px] text-gray-400 uppercase tracking-[0.2em]">Target Domain (Optional)</label>
                  <input 
                    type="url" 
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 p-4 text-white font-tech text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-colors placeholder:text-gray-700"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

              </div>

              {/* Goal Selection */}
              <div className="space-y-2">
                <label className="block font-tech text-[10px] text-gray-400 uppercase tracking-[0.2em]">Primary Objective</label>
                <select 
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 p-4 text-white font-tech text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="seo">Advanced SEO Dominance</option>
                  <option value="web">3D / High-Converting Web Dev</option>
                  <option value="ads">Predictable Meta Ads Scaling</option>
                  <option value="aeo">AEO (AI Answer Engine Optimization)</option>
                  <option value="full">Full Stack Growth Architecture</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full relative overflow-hidden group px-8 py-5 mt-8 font-tech font-bold text-sm uppercase tracking-[0.3em] transition-all duration-300 ${
                  isSubmitting 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? 'Transmitting Data...' : 'Execute Audit Sequence'}
                  {!isSubmitting && <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                </span>
                {!isSubmitting && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>}
              </button>

            </form>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=Space+Mono:wght@400;700&display=swap');
        .font-nothing { font-family: 'DotGothic16', sans-serif; }
        .font-tech { font-family: 'Space Mono', monospace; }
        
        @keyframes shimmer { 
          100% { transform: translateX(100%); } 
        }
        .animate-shimmer { 
          animation: shimmer 1.5s infinite; 
        }
      `}} />
    </div>
  );
}