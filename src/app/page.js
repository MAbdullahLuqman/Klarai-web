"use client"; // MUST BE THE VERY FIRST LINE
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SolarSystem from "../components/SolarSystem";

export default function Home() {
  const [activeService, setActiveService] = useState(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black font-sans">
      
      <SolarSystem onPlanetClick={setActiveService} />
      
      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-40 pointer-events-none">
        <div className="pointer-events-auto flex-shrink-0">
          <img 
            src="https://via.placeholder.com/150x50?text=KLARAI+LOGO" 
            alt="KLARAI Logo" 
            className="h-8 md:h-10 w-auto object-contain drop-shadow-lg"
          />
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block pointer-events-auto text-sm text-gray-300 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
          >
            Connect with Founder
          </a>
          <button className="pointer-events-auto bg-purple-600 hover:bg-purple-700 backdrop-blur-md text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-bold transition-all shadow-lg shadow-purple-600/20 text-sm md:text-base">
            Get Strategy Call
          </button>
        </div>
      </nav>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none opacity-70">
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
              
              <button 
                onClick={() => setActiveService(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-16 h-16 rounded-full mb-6" style={{ backgroundColor: activeService.color }} />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                {activeService.title}
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {activeService.extendedDescription}
              </p>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-2">Key Deliverables:</h3>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Custom AI Architecture Mapping</li>
                  <li>High-Authority Entity Structuring</li>
                  <li>Conversion-Optimized User Flows</li>
                </ul>
              </div>

              <button className="mt-10 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors pointer-events-auto">
                Initiate Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </main>
  );
}