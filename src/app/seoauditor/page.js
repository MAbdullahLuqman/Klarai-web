"use client";
import React, { useState } from 'react';
import GlobalHeader from '@/components/GlobalHeader';

const auditPhases = [
  "Initializing secure connection to target server",
  "Bypassing cache & scraping DOM architecture",
  "Evaluating Core Web Vitals & speed metrics",
  "Extracting UK-specific localized schema",
  "Analyzing Answer Engine Optimization (AEO) readiness",
  "Scanning for critical technical vulnerabilities",
  "Feeding entity data to Generative AI scoring engine",
  "Compiling final KlarAI intelligence report"
];

export default function SeoAuditorPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [auditResult, setAuditResult] = useState(null); 
  const [showRawJson, setShowRawJson] = useState(false);

  const formatUrl = (inputUrl) => {
    let formatted = inputUrl.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    return formatted;
  };

  const startAudit = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    const targetUrl = formatUrl(url);
    
    setIsAnalyzing(true);
    setAuditComplete(false);
    setProgress(0);
    setPhaseIndex(0);
    setAuditResult(null); 
    setShowRawJson(false);

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
    }, 3000); 

    try {
      const response = await fetch('https://klarai-seo-audit-tool-production.up.railway.app/free-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const auditData = await response.json();
      setAuditResult(auditData);
      console.log("KlarAI Extraction Complete:", auditData);

      setProgress(100);
      setPhaseIndex(auditPhases.length);
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

  // Upgraded Helper to format Single Page DOM data beautifully
  const renderDOMValue = (value) => {
    // If the backend sends an array (like a list of H2s or links)
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400 italic">None found</span>;
      return (
        <ul className="list-disc pl-5 space-y-2">
          {value.map((item, idx) => (
            <li key={idx} className="text-gray-700 font-medium">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }
    // If it's a nested object
    if (typeof value === 'object' && value !== null) {
      return <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>;
    }
    // If it's empty
    if (value === null || value === '') return <span className="text-gray-400 italic">Empty</span>;
    
    // Standard text (like Title or Meta Description)
    return <span className="text-gray-800 font-medium">{String(value)}</span>;
  };

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-[#0A101D] min-h-screen flex flex-col">
      <GlobalHeader />

      <main className="flex-1 flex flex-col items-center justify-center pt-[120px] pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-[#008dd8]/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[800px] w-full mx-auto relative z-10">
          
          {/* INITIAL STATE */}
          {!isAnalyzing && !auditComplete && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-[#008dd8] text-[10px] font-black tracking-[0.2em] uppercase shadow-sm">
                  KlarAI Infrastructure
                </span>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#0A101D] leading-[0.95]">
                  Search & AEO <br/> <span className="text-[#008dd8]">Audit Tool.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-500 font-medium">
                  Identify critical search vulnerabilities, localized UK roadblocks, and Generative AI visibility.
                </p>
              </div>

              <form onSubmit={startAudit} className="mt-10 relative max-w-2xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#008dd8] to-[#ccff00] rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex flex-col md:flex-row items-center bg-white border-2 border-gray-200 rounded-[1.5rem] md:rounded-[2.5rem] p-2 shadow-xl focus-within:border-[#008dd8] transition-colors">
                  <div className="flex-1 w-full flex items-center px-4 py-3 md:py-2">
                    <svg className="w-6 h-6 text-gray-400 mr-3 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                      type="text" 
                      placeholder="example.co.uk" 
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent text-lg md:text-xl font-bold text-[#0A101D] placeholder-gray-300 outline-none"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                  <button type="submit" className="w-full md:w-auto bg-[#ccff00] text-[#0A101D] px-10 py-4 md:py-5 rounded-[1rem] md:rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#b3e600] transition-all active:scale-95 mt-2 md:mt-0 whitespace-nowrap">
                    Run Audit
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LOADING STATE */}
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
              <div className="p-8 md:p-12 space-y-4 font-mono text-sm md:text-base">
                {auditPhases.map((phase, index) => {
                  const isCompleted = index < phaseIndex;
                  const isActive = index === phaseIndex;
                  const isPending = index > phaseIndex;
                  return (
                    <div key={index} className={`flex items-start gap-4 transition-all duration-300 ${isCompleted ? 'text-gray-500' : isActive ? 'text-white' : 'text-gray-700 opacity-50'}`}>
                      <div className="mt-0.5 shrink-0">
                        {isCompleted && <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        {isActive && <svg className="w-5 h-5 text-[#ccff00] animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isPending && <div className="w-5 h-5 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div></div>}
                      </div>
                      <span className={`${isActive ? 'animate-pulse font-semibold' : ''}`}>{phase}...</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RESULTS STATE: THE KLAR AI DASHBOARD */}
        {auditComplete && auditResult && (
          <div className="w-full max-w-[1100px] mx-auto animate-fade-in mt-10 relative z-10 pb-20">
             
             {/* REPORT HEADER */}
             <div className="bg-[#0A101D] rounded-t-[2rem] border border-gray-800 p-10 md:p-14 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#008dd8] to-[#ccff00]"></div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div>
                   <span className="inline-block py-1 px-3 rounded-full bg-gray-800/50 border border-gray-700 text-[#ccff00] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
                     Single Page Intelligence Report
                   </span>
                   <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white line-clamp-1">
                     {auditResult.scraped_data?.url || formatUrl(url)}
                   </h2>
                   <p className="text-gray-400 font-medium mt-2 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     Live Audit Complete
                   </p>
                 </div>
                 <div className="text-left md:text-right">
                    <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Generated On</p>
                    <p className="text-white font-mono">{new Date().toLocaleDateString()}</p>
                 </div>
               </div>
             </div>

             {/* THE REPORT BODY */}
             <div className="bg-white rounded-b-[2rem] border-x border-b border-gray-200 shadow-2xl p-6 md:p-14 space-y-12">

               {/* 1. TOP METRICS GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gray-50 p-8 rounded-[1.5rem] border border-gray-100 flex flex-col items-center text-center shadow-sm">
                    <h3 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">Performance Score</h3>
                    <div className="text-7xl font-black text-[#0A101D]">
                      {auditResult.performance_data?.performance_score || 'N/A'}
                    </div>
                    <p className="text-sm font-medium text-gray-500 mt-2">Speed & Infrastructure Health</p>
                 </div>
                 
                 <div className="bg-[#0A101D] p-8 rounded-[1.5rem] border border-gray-800 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ccff00]/5 rounded-full blur-2xl"></div>
                    <h3 className="text-gray-400 font-black text-xs uppercase tracking-widest mb-4">AEO Readiness</h3>
                    <div className="text-7xl font-black text-[#ccff00] mb-2">
                      {auditResult.ai_analysis?.aeo_readiness_score || 'N/A'}<span className="text-3xl text-gray-600">/100</span>
                    </div>
                    <p className="text-sm font-medium text-gray-400">Answer Engine Optimization</p>
                 </div>
               </div>

               <hr className="border-gray-100" />

               {/* 2. AI EXECUTIVE SUMMARY */}
               {auditResult.ai_analysis?.audit_summary && (
                 <div>
                    <h3 className="text-2xl font-black text-[#0A101D] mb-6 flex items-center gap-3">
                      <svg className="w-6 h-6 text-[#008dd8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Executive Summary
                    </h3>
                    
                    {/* The Verdict Block */}
                    <div className="bg-[#f0f9ff] border-l-4 border-[#008dd8] p-6 rounded-r-xl mb-6 shadow-sm">
                      <p className="text-lg text-gray-700 font-medium italic leading-relaxed">
                        "{auditResult.ai_analysis.audit_summary.verdict}"
                      </p>
                    </div>

                    {/* Critical Issues vs Quick Wins */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                        <span className="block text-red-600 font-black text-4xl mb-1">{auditResult.ai_analysis.audit_summary.critical_issues_count}</span>
                        <span className="text-red-800 text-sm font-bold uppercase tracking-widest">Critical Issues</span>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                        <span className="block text-green-600 font-black text-4xl mb-1">{auditResult.ai_analysis.audit_summary.quick_wins_count}</span>
                        <span className="text-green-800 text-sm font-bold uppercase tracking-widest">Quick Wins</span>
                      </div>
                    </div>
                 </div>
               )}

               {/* 3. CRITICAL FIXES & LOCAL OPPORTUNITIES */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {auditResult.ai_analysis?.critical_fixes_checklist?.length > 0 && (
                   <div className="bg-white border border-gray-200 p-8 rounded-[1.5rem] shadow-sm">
                     <h3 className="text-xl font-black text-red-600 mb-6 flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                       Critical Fixes Required
                     </h3>
                     <ul className="space-y-4">
                       {auditResult.ai_analysis.critical_fixes_checklist.map((fix, i) => (
                         <li key={i} className="flex items-start gap-3 bg-red-50/50 p-3 rounded-lg border border-red-50">
                           <span className="text-red-500 mt-0.5 shrink-0">❌</span>
                           <span className="text-gray-700 font-medium text-sm leading-relaxed">{fix}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}

                 {auditResult.ai_analysis?.local_uk_opportunities?.length > 0 && (
                   <div className="bg-white border border-gray-200 p-8 rounded-[1.5rem] shadow-sm">
                     <h3 className="text-xl font-black text-[#008dd8] mb-6 flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       UK Local Opportunities
                     </h3>
                     <ul className="space-y-4">
                       {auditResult.ai_analysis.local_uk_opportunities.map((op, i) => (
                         <li key={i} className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                           <span className="text-[#008dd8] mt-0.5 shrink-0">📍</span>
                           <span className="text-gray-700 font-medium text-sm leading-relaxed">{op}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>

               {/* 4. EXTRACTED SINGLE PAGE DOM DATA */}
              {/* 4. EXTRACTED ON-PAGE SEO DATA (Beautiful Grid) */}
               {auditResult.scraped_data && (
                 <div className="pt-6">
                    <h3 className="text-2xl font-black text-[#0A101D] mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      On-Page SEO Architecture
                    </h3>
                    
                    <div className="space-y-6">
                      
                      {/* Top Level: Title & Meta */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                           <p className="text-xs font-bold text-[#008dd8] uppercase tracking-widest mb-2">Page Title</p>
                           <p className="text-lg font-medium text-gray-800 leading-snug">
                             {auditResult.scraped_data.title || <span className="text-red-500 font-bold">Missing Title</span>}
                           </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                           <p className="text-xs font-bold text-[#008dd8] uppercase tracking-widest mb-2">Meta Description</p>
                           <p className="text-sm font-medium text-gray-600 leading-relaxed">
                             {auditResult.scraped_data.meta_description || <span className="text-red-500 font-bold">Missing Meta Description</span>}
                           </p>
                        </div>
                      </div>

                      {/* Middle Level: Headings Structure */}
                      {auditResult.scraped_data.headings && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Heading Tag Distribution</p>
                          <div className="grid grid-cols-3 gap-4">
                            
                            {/* H1 Tag Card (Flags red if 0, like in your screenshot) */}
                            <div className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center ${auditResult.scraped_data.headings.h1_count === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">H1 Tags</span>
                              <span className={`text-4xl font-black mt-1 ${auditResult.scraped_data.headings.h1_count === 0 ? 'text-red-600' : 'text-[#0A101D]'}`}>
                                {auditResult.scraped_data.headings.h1_count}
                              </span>
                              {auditResult.scraped_data.headings.h1_count === 0 && <span className="text-red-500 text-[10px] font-bold mt-1 uppercase">Critical Error</span>}
                            </div>

                            {/* H2 Tag Card */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">H2 Tags</span>
                              <span className="text-3xl font-black mt-1 text-[#0A101D]">{auditResult.scraped_data.headings.h2_count}</span>
                            </div>

                            {/* H3 Tag Card */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                              <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">H3 Tags</span>
                              <span className="text-3xl font-black mt-1 text-[#0A101D]">{auditResult.scraped_data.headings.h3_count}</span>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* Bottom Level: Content & Schema */}
                      {auditResult.scraped_data.content && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                            <div>
                               <p className="text-xs font-bold text-[#008dd8] uppercase tracking-widest mb-1">Total Word Count</p>
                               <p className="text-sm font-medium text-gray-500">Content Depth</p>
                            </div>
                            <span className="text-3xl font-black text-[#0A101D]">{auditResult.scraped_data.content.word_count}</span>
                          </div>

                          {/* Schema Card (Flags red if false, like in your screenshot) */}
                          <div className={`p-6 rounded-xl border shadow-sm flex justify-between items-center ${auditResult.scraped_data.content.has_schema_markup ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'}`}>
                            <div>
                               <p className="text-xs font-bold text-[#008dd8] uppercase tracking-widest mb-1">Schema Markup</p>
                               <p className={`text-sm font-medium ${auditResult.scraped_data.content.has_schema_markup ? 'text-gray-500' : 'text-red-500'}`}>
                                 Rich Snippet Data
                               </p>
                            </div>
                            <span className={`text-xl font-black uppercase ${auditResult.scraped_data.content.has_schema_markup ? 'text-green-500' : 'text-red-600'}`}>
                              {auditResult.scraped_data.content.has_schema_markup ? 'Present' : 'Missing'}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                 </div>
               )}

               {/* 5. DEVELOPER RAW JSON TOGGLE */}
               <div className="pt-8 border-t border-gray-100">
                 <button 
                   onClick={() => setShowRawJson(!showRawJson)} 
                   className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-[#0A101D] flex items-center gap-2 transition-colors"
                 >
                   <svg className={`w-4 h-4 transform transition-transform ${showRawJson ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                   {showRawJson ? 'Hide Raw JSON Payload' : 'View Full Raw JSON Payload'}
                 </button>
                 
                 {showRawJson && (
                   <div className="bg-[#0A101D] rounded-[1.5rem] border border-gray-800 shadow-inner overflow-hidden mt-6 animate-fade-in">
                     <div className="bg-[#111] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
                        <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Developer Console</span>
                     </div>
                     <div className="p-6 overflow-x-auto max-h-[400px] overflow-y-auto">
                        <pre className="text-[#ccff00] font-mono text-xs leading-relaxed">
                          {JSON.stringify(auditResult, null, 2)}
                        </pre>
                     </div>
                   </div>
                 )}
               </div>

             </div>

             {/* ACTION BAR */}
             <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] border border-gray-200 shadow-xl relative z-10">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center md:text-left">
                  Need these issues fixed?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <button onClick={() => setAuditComplete(false)} className="w-full sm:w-auto text-gray-600 font-bold text-sm uppercase tracking-widest hover:text-[#0A101D] border-2 border-gray-200 hover:border-gray-400 px-8 py-4 rounded-full transition-all text-center">
                    New Audit
                  </button>
                  <a href="mailto:contact@klarai.com" className="w-full sm:w-auto bg-[#ccff00] text-[#0A101D] font-black text-sm uppercase tracking-widest hover:bg-[#b3e600] px-10 py-4 rounded-full transition-all text-center shadow-[0_10px_20px_rgba(204,255,0,0.2)]">
                    Book KlarAI
                  </a>
                </div>
             </div>

          </div>
        )}

      </main>
    </div>
  );
}