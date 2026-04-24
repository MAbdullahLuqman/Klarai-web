"use client";
import React, { useState } from 'react';
import GlobalHeader from '@/components/GlobalHeader';

// The steps the terminal will cycle through (Claude-style checklist)
const auditPhases = [
  "Initializing secure connection to target server",
  "Bypassing cache & scraping DOM architecture",
  "Analyzing H1/H2 hierarchy and content depth",
  "Evaluating Core Web Vitals & speed metrics",
  "Scanning for toxic backlinks & anchor text ratios",
  "Extracting schema payloads & rich snippet data",
  "Feeding entity data to scoring engine",
  "Compiling final SEO architecture report"
];

export default function SeoAuditorPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);

  const formatUrl = (inputUrl) => {
    let formatted = inputUrl.trim();
    // Automatically inject https:// if the user just types xyz.com or www.xyz.com
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    return formatted;
  };

  const startAudit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    // Format the URL behind the scenes before sending to FastAPI
    const targetUrl = formatUrl(url);
    
    setIsAnalyzing(true);
    setAuditComplete(false);
    setProgress(0);
    setPhaseIndex(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; 
        return prev + 1; 
      });
    }, 300);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => {
        if (prev >= auditPhases.length - 1) return prev;
        return prev + 1;
      });
    }, 3000); // Moves down the checklist every 3 seconds

    try {
      // 🚀 LIVE RAILWAY FASTAPI CONNECTION
      const response = await fetch('https://klarai-seo-audit-tool-production.up.railway.app/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Capture the final SEO JSON data sent back from FastAPI/Gemini
      const auditData = await response.json();
      
      // Logs the data to your browser console so you can see it working!
      console.log("FastAPI Analysis Complete:", auditData);

      setProgress(100);
      setPhaseIndex(auditPhases.length); // Mark all steps as complete
      setAuditComplete(true);
      
    } catch (error) {
      console.error("Audit Failed:", error);
      alert("System overload or connection failed. Please try again.");
    } finally {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-[#0A101D] min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 flex flex-col items-center justify-center pt-[120px] pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#008dd8]/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[800px] w-full mx-auto relative z-10">
          
          {/* INITIAL STATE: Search Input */}
          {!isAnalyzing && !auditComplete && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-[#008dd8] text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
                  KlarAI Infrastructure
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#0A101D] leading-[0.95]">
                  SEO Architecture <br/> <span className="text-[#008dd8]">Audit Tool.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 font-medium">
                  Identify critical search vulnerabilities, technical errors, and ranking roadblocks in under 30 seconds.
                </p>
              </div>

              <form onSubmit={startAudit} className="mt-10 relative max-w-2xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#008dd8] to-[#ccff00] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center bg-white border-2 border-gray-200 rounded-[1.5rem] md:rounded-[2.5rem] p-2 shadow-xl focus-within:border-[#008dd8] transition-colors">
                  
                  <div className="flex-1 w-full flex items-center px-4 py-3 md:py-2">
                    <svg className="w-6 h-6 text-gray-400 mr-3 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                      type="text" 
                      placeholder="example.com" 
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent text-lg md:text-xl font-bold text-[#0A101D] placeholder-gray-300 outline-none"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                  
                  <button type="submit" className="w-full md:w-auto bg-[#ccff00] text-[#0A101D] px-10 py-4 md:py-5 rounded-[1rem] md:rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#b3e600] transition-all active:scale-95 shadow-[0_10px_20px_rgba(204,255,0,0.2)] mt-2 md:mt-0 whitespace-nowrap">
                    Audit Site
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">Enter any URL to initiate deep scan</p>
              </form>
            </div>
          )}

          {/* LOADING STATE: Claude-Style Step Animation */}
          {isAnalyzing && (
            <div className="w-full max-w-3xl mx-auto bg-[#0A101D] rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden animate-fade-in">
              <div className="bg-[#111] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest ml-4">
                    Target: {formatUrl(url)}
                  </span>
                </div>
                <span className="text-[#ccff00] text-[10px] font-mono font-bold">{progress}%</span>
              </div>

              <div className="p-8 md:p-12">
                {/* Claude-Style Vertical Checklist */}
                <div className="space-y-4 font-mono text-sm md:text-base">
                  {auditPhases.map((phase, index) => {
                    // Determine the state of the current task
                    const isCompleted = index < phaseIndex;
                    const isActive = index === phaseIndex;
                    const isPending = index > phaseIndex;

                    return (
                      <div 
                        key={index} 
                        className={`flex items-start gap-4 transition-all duration-300 ${
                          isCompleted ? 'text-gray-500' : isActive ? 'text-white' : 'text-gray-700 opacity-50'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted && (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          )}
                          {isActive && (
                            <svg className="w-5 h-5 text-[#ccff00] animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          )}
                          {isPending && (
                            <div className="w-5 h-5 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div></div>
                          )}
                        </div>
                        <span className={`${isActive ? 'animate-pulse font-semibold' : ''}`}>
                          {phase}...
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* RESULTS STATE: The Output Shell */}
          {auditComplete && (
            <div className="w-full animate-fade-in space-y-8">
               <div className="text-center mb-12">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ccff00]/20 text-[#668000] rounded-full mb-6">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 <h2 className="text-4xl font-black tracking-tight text-[#0A101D]">Audit Complete</h2>
                 <p className="text-gray-500 font-medium mt-2">Target: {formatUrl(url)}</p>
               </div>
               
               <div className="bg-white p-10 rounded-[2rem] border border-gray-200 shadow-xl text-center">
                  <h3 className="text-xl font-bold mb-4">Your Data Will Inject Here</h3>
                  <p className="text-gray-500 mb-8">Open your browser console to see the JSON payload returned from FastAPI.</p>
                  <button onClick={() => setAuditComplete(false)} className="text-[#008dd8] font-bold text-sm uppercase tracking-widest hover:underline">
                    Run Another Audit
                  </button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}