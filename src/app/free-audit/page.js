"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

export default function FreeAuditPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    goal: 'Increase Organic Traffic' // Default option
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Push the lead directly to the Firebase 'leads' collection
      // This will instantly appear in your Admin Panel!
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error("Error submitting lead:", err);
      setError("Failed to initiate sequence. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-cyan-300 selection:text-black min-h-screen overflow-hidden flex flex-col">
      <GlobalHeader />

      <main className="flex-1 pt-32 pb-24">
        
        {/* --- HERO SECTION --- */}
        <section className="relative flex flex-col items-center text-center max-w-5xl mx-auto px-6 mb-16">
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
            <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-black tracking-[0.2em] uppercase shadow-sm">
              System Diagnostics
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight mb-6">
              Initiate System <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-500 bg-clip-text text-transparent">Audit</span>.
            </h1>
            <p className="text-xl mb-10 text-gray-500 font-medium max-w-2xl mx-auto">
              Stop guessing. Let our architects analyze your digital infrastructure and build a mathematically sound roadmap to scale your revenue.
            </p>
          </motion.div>
        </section>

        {/* --- CONTENT & FORM SPLIT --- */}
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start relative z-10">
          
          {/* LEFT SIDE: Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-10"
          >
            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 Deep Technical Analysis
               </h3>
               <p className="text-gray-500 font-medium leading-relaxed">We strip your website down to its core code. We analyze site speed, core web vitals, indexability issues, and hidden technical friction preventing you from ranking.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                 Competitor Entity Mapping
               </h3>
               <p className="text-gray-500 font-medium leading-relaxed">We reverse-engineer exactly what your top 3 competitors are doing to capture market share, and build a blueprint to dismantle their lead.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                 <svg className="w-8 h-8 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 Actionable Growth Blueprint
               </h3>
               <p className="text-gray-500 font-medium leading-relaxed">You won't get a generic PDF. You get a bespoke, plain-English architectural blueprint detailing exactly how to scale your specific brand over the next 6 months.</p>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Interactive Neon Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-[3rem] border-2 border-gray-100 p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.08)] relative"
          >
            {isSuccess ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-cyan-50 border border-cyan-200 text-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Request Received.</h3>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  Your system data has been securely transmitted. One of our lead architects will contact you within 24 hours with the next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@company.com"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+44 7700 900077"
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Website URL</label>
                  <input 
                    type="url" 
                    name="website" 
                    value={formData.website} 
                    onChange={handleChange} 
                    placeholder="https://www.yourcompany.com"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Primary Growth Goal</label>
                  <div className="relative">
                    <select 
                      name="goal" 
                      value={formData.goal} 
                      onChange={handleChange} 
                      className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all cursor-pointer"
                    >
                      <option>Increase Organic Traffic (SEO)</option>
                      <option>Scale Paid Ads Revenue (Meta Ads)</option>
                      <option>Build a New Website</option>
                      <option>General Digital Strategy</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-bold px-2">{error}</p>}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_15px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_40px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? 'Transmitting Data...' : 'Submit Request'}
                </button>

                <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest mt-4">
                  100% Secure. No credit card required.
                </p>
              </form>
            )}
          </motion.div>
        </section>
      </main>

      
    </div>
  );
}