"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SolarSystem from "../components/SolarSystem";

export default function Home() {
  const [activeService, setActiveService] = useState(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);

  const isAnyModalOpen = !!activeService || isStrategyModalOpen;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-sans">
      
      <SolarSystem 
        onPlanetClick={setActiveService} 
        onSunClick={() => setIsStrategyModalOpen(true)}
        isModalOpen={isAnyModalOpen} 
        isStrategyModalOpen={isStrategyModalOpen}
      />
      
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-40 pointer-events-none">
        <div className="pointer-events-auto flex-shrink-0">
          <img 
            src="/klarailogo.webp" 
            alt="KLARAI Logo" 
            className="h-8 md:h-10 w-auto object-contain drop-shadow-lg cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          />
        </div>

        <div className="flex items-center gap-6">
          {/* UPDATED: Connected to your actual LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/abdullahluqman/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block pointer-events-auto text-sm text-gray-300 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            Connect with Founder
          </a>
        </div>
      </nav>

      {/* NEW: Floating "Get Audit" Button at the bottom of the page */}
      <div className={`fixed bottom-6 right-6 z-50 transition-opacity duration-500 ${isAnyModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={() => setIsStrategyModalOpen(true)}
          className="pointer-events-auto bg-[#eab308] hover:bg-[#ca8a04] text-black px-6 py-3 rounded-full font-extrabold transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] text-sm md:text-base tracking-wide flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
          Get Free Audit
        </button>
      </div>

      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 ${isAnyModalOpen ? 'opacity-0' : 'opacity-70'}`}>
        <span className="text-white text-[10px] md:text-xs tracking-[0.3em] uppercase drop-shadow-md">Scroll to Explore</span>
        <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
      </div>

      <AnimatePresence>
        {activeService && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-2xl"
            onWheel={(e) => e.stopPropagation()} 
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              <button onClick={() => setActiveService(null)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer pointer-events-auto">
                <X className="w-6 h-6" />
              </button>
              <div className="w-16 h-16 rounded-full mb-6" style={{ backgroundColor: activeService.color }} />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">{activeService.title}</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">{activeService.extendedDescription}</p>
              <button 
                onClick={() => { setActiveService(null); setIsStrategyModalOpen(true); }}
                className="mt-10 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors pointer-events-auto"
              >
                Request Deep Dive Audit
              </button>
            </div>
          </motion.div>
        )}

        {isStrategyModalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-xl"
            onWheel={(e) => e.stopPropagation()} 
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-black/80 border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <button onClick={() => setIsStrategyModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer pointer-events-auto">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Claim Your Free Audit.</h2>
              <p className="text-gray-400 mb-8">Enter your details below to see exactly where your competitors are outranking you in AI Search.</p>
              
              {/* UPDATED: Formspree Link Attached */}
              <form 
                className="space-y-6 pointer-events-auto" 
                action="https://formspree.io/f/mwvrdbly" 
                method="POST"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Full Name</label>
                    <input type="text" name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308] transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Work Email</label>
                    <input type="email" name="email" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308] transition-colors" placeholder="john@company.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Company Website</label>
                  <input type="url" name="website" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308] transition-colors" placeholder="https://" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Primary Goal</label>
                  <select name="goal" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#eab308] transition-colors appearance-none">
                    <option value="AEO">Answer Engine Optimization (AEO)</option>
                    <option value="SEO">Search Engine Optimization (SEO)</option>
                    <option value="Web Dev">3D Web Development</option>
                    <option value="Ads">Performance Marketing Scaling</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-[#eab308] hover:bg-[#ca8a04] text-black py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]">
                  Submit Audit Request
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </main>
  );
}