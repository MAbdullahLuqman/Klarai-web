"use client";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GlobalHeader from '@/components/GlobalHeader';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';

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
export const metadata = {
  title: 'Free AI SEO Audit Tool — Instant Results in 30 Seconds | Klarai',
  description: 'Run a free AI-powered SEO audit on any UK website. Powered by Gemini, Klarai SEO auditor delivers instant results in 30 seconds covering technical, on-page, local, and AI visibility..',
};
export default function SeoAuditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-bold text-gray-500 tracking-widest uppercase text-xs">Loading Core...</div>}>
      <AuditorCore />
    </Suspense>
  );
}

function AuditorCore() {
  const searchParams = useSearchParams();
  const defaultUrl = searchParams.get('url') || '';
  const autoStart = searchParams.get('auto') === 'true';

  const [url, setUrl] = useState(defaultUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [auditResult, setAuditResult] = useState(null); 
  const [showRawJson, setShowRawJson] = useState(false);
  const [hasTriggeredAuto, setHasTriggeredAuto] = useState(false);
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef(null);

  const formatUrl = (inputUrl) => {
    let formatted = inputUrl.trim();
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }
    return formatted;
  };

  const executeAudit = async (targetUrlString) => {
    const formattedUrl = formatUrl(targetUrlString);
    
    setIsAnalyzing(true);
    setAuditComplete(false);
    setProgress(0);
    setPhaseIndex(0);
    setAuditResult(null); 
    setShowRawJson(false);

    // Scroll to top when analysis starts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 98 : prev + 1));
    }, 300);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev >= auditPhases.length - 1 ? prev : prev + 1));
    }, 3000); 

    try {
      const response = await fetch('https://klarai-seo-audit-tool-production.up.railway.app/free-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const auditData = await response.json();
      setAuditResult(auditData);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!url) return;
    executeAudit(url);
  };

  useEffect(() => {
    if (autoStart && defaultUrl && !hasTriggeredAuto) {
      setHasTriggeredAuto(true);
      executeAudit(defaultUrl);
    }
  }, [autoStart, defaultUrl, hasTriggeredAuto]);

 // PDF Download Engine (Powered by html-to-image)
  
 // PDF Download Engine (Mathematically Aligned for A4)
  const downloadPDF = async () => {
    const element = reportRef.current;
    if (!element) return;

    setIsGeneratingPdf(true);

    try {
      const filter = (node) => {
        if (node?.getAttribute && node.getAttribute('data-html2canvas-ignore') === 'true') {
          return false;
        }
        return true;
      };

      // 1. Capture the image with extra padding so the edges don't crop
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2, // High resolution
        backgroundColor: '#fafafa',
        filter: filter,
        style: {
          padding: '20px', // Adds breathing room before capture
          margin: '0',
        }
      });
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));
      
      // 2. Setup A4 Canvas
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      // 3. Setup Margins (10mm on left/right)
      const margin = 10; 
      const printWidth = pdfWidth - (margin * 2);
      const printHeight = (img.height * printWidth) / img.width;
      
      let heightLeft = printHeight;

      // 4. Print First Page (with top margin)
      pdf.addImage(dataUrl, 'PNG', margin, margin, printWidth, printHeight);
      heightLeft -= (pdfHeight - margin); // Calculate what was printed
      
      let position = -(pdfHeight - margin); // Shift image UP for the next page

      // 5. Print Subsequent Pages seamlessly
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', margin, position, printWidth, printHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
      }

      // 6. Save
      const safeUrlName = formatUrl(url).replace(/^https?:\/\//, '').replace(/[^a-z0-9]/gi, '_');
      pdf.save(`KlarAI_SEO_Audit_${safeUrlName}.pdf`);
      
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const rawScraped = auditResult?.scraped_data || {};
  const scrapedData = rawScraped.seo_data || rawScraped; 
  const aiData = auditResult?.ai_analysis || {};
  const perfData = auditResult?.performance_data || {};
  const summary = aiData.audit_summary || {};
  const headings = scrapedData.headings || {};
  const content = scrapedData.content || {};
  const media = scrapedData.media_and_links || {};
  const metrics = perfData.metrics || {};
  const h1Content = Array.isArray(headings.h1_content) ? headings.h1_content : [];
  const criticalFixes = aiData.critical_fixes_checklist || [];
  const localOps = aiData.local_uk_opportunities || [];
  const geoGaps = aiData.geo_ai_overview_gaps || [];
  const quickWins = aiData.quick_wins || [];

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#008dd8] selection:text-white min-h-screen flex flex-col">
      <GlobalHeader />

      {/* ============================================================
          SECTION 1: THE TOOL HERO (DARK)
          ============================================================ */}
      <section className="w-full flex flex-col items-center pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden bg-[#0A101D]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#008dd8]/[0.05] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-[700px] w-full mx-auto relative z-10">
          {!isAnalyzing && !auditComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-900/30 border border-blue-500/30 text-[#00b4d8] text-[9px] font-black tracking-[0.2em] uppercase shadow-sm">
                ⚡ Powered by Google Gemini — Results in 30 seconds
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Free AI SEO Audit Tool <br/> <span className="text-[#008dd8]">for UK Websites</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
                Enter any website URL and Klarai's Gemini-powered SEO auditor analyses your site in 30 seconds. You get an instant, prioritised report covering technical SEO, on-page signals, local visibility, and AI search readiness.
              </p>

              <form onSubmit={handleFormSubmit} className="mt-8 relative max-w-xl mx-auto group w-full px-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#008dd8] to-[#00b4d8] rounded-[1.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex flex-col sm:flex-row items-center bg-[#111827] border border-gray-700 rounded-[1.25rem] p-1.5 shadow-xl focus-within:border-[#008dd8] transition-colors w-full">
                  <div className="flex-1 w-full flex items-center px-4 py-2">
                    <svg className="w-4 h-4 text-gray-500 mr-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                      type="text" 
                      placeholder="example.co.uk" 
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-gray-500 outline-none"
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-[#008dd8] text-white px-6 py-3 rounded-[1rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#0077b6] transition-all active:scale-95 shadow-md mt-2 sm:mt-0 whitespace-nowrap">
                    Run Free Audit
                  </button>
                </div>
              </form>
              <div className="flex justify-center gap-4 mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                <span>No signup</span>
                <span>•</span>
                <span>No credit card</span>
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <div className="w-full max-w-2xl mx-auto bg-[#111827] rounded-[1.25rem] border border-gray-800 shadow-2xl overflow-hidden animate-fade-in mt-6">
              <div className="bg-[#0A101D] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-gray-500 text-[9px] font-mono uppercase tracking-widest ml-2 truncate max-w-[150px] sm:max-w-xs">
                    Target: {formatUrl(url)}
                  </span>
                </div>
                <span className="text-[#00b4d8] text-[9px] font-mono font-bold">{progress}%</span>
              </div>
              <div className="p-5 sm:p-6 space-y-3 font-mono text-[10px] sm:text-xs">
                {auditPhases.map((phase, index) => {
                  const isCompleted = index < phaseIndex;
                  const isActive = index === phaseIndex;
                  const isPending = index > phaseIndex;
                  return (
                    <div key={index} className={`flex items-start gap-3 transition-all duration-300 ${isCompleted ? 'text-gray-600' : isActive ? 'text-white' : 'text-gray-800 opacity-50'}`}>
                      <div className="mt-0.5 shrink-0">
                        {isCompleted && <svg className="w-3.5 h-3.5 text-[#008dd8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        {isActive && <svg className="w-3.5 h-3.5 text-[#00b4d8] animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {isPending && <div className="w-3 h-3 flex items-center justify-center"><div className="w-1 h-1 bg-gray-800 rounded-full"></div></div>}
                      </div>
                      <span className={`${isActive ? 'animate-pulse font-semibold' : ''} leading-snug`}>{phase}...</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          RESULTS DASHBOARD (Only shows when audit is complete)
          ============================================================ */}
      {auditComplete && auditResult && (
        <section className="w-full bg-[#fafafa] py-12 px-4 sm:px-6">
          <div ref={reportRef} className="w-full max-w-[1000px] mx-auto animate-fade-in relative z-10 space-y-5 pb-10">
             
             {/* TOP HEADER */}
             <div className="bg-[#0A101D] rounded-[1rem] border border-gray-800 p-5 sm:p-6 relative overflow-hidden shadow-xl">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#008dd8] to-[#00b4d8]"></div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3">
                 <div>
                   <span className="inline-block py-1 px-3 rounded-full bg-gray-800/80 border border-gray-700 text-[#00b4d8] text-[8px] font-black tracking-[0.2em] uppercase mb-2">
                     Intelligence Report
                   </span>
                   <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-1 break-all">
                     {rawScraped.url || formatUrl(url)}
                   </h2>
                 </div>
                 
                 <div className="flex flex-col items-start md:items-end gap-2 mt-2 md:mt-0">
                    <div className="text-left md:text-right">
                      <p className="text-gray-500 text-[8px] font-mono uppercase tracking-widest">Generated</p>
                      <p className="text-white font-mono text-xs">{new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <button onClick={downloadPDF} disabled={isGeneratingPdf} data-html2canvas-ignore="true" className="bg-[#008dd8] text-white px-3 py-1.5 rounded flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-widest hover:bg-[#0077b6] transition-all shadow-md active:scale-95 disabled:opacity-50">
                      {isGeneratingPdf ? 'Generating PDF...' : (
                        <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Download PDF</>
                      )}
                    </button>
                 </div>
               </div>
             </div>

             {/* HIGH LEVEL SCORES & VERDICT */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-3">
                  <div className="bg-white p-4 rounded-[1rem] border border-gray-200 shadow-sm flex flex-col justify-center">
                    <h3 className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1">Performance</h3>
                    <div className="text-3xl font-black text-[#0A101D] leading-none mb-1">{perfData?.score || 'N/A'}</div>
                    <p className="text-[9px] text-gray-500 font-medium">Core Web Vitals</p>
                  </div>
                  <div className="bg-[#0A101D] p-4 rounded-[1rem] border border-gray-800 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#008dd8]/20 rounded-full blur-xl"></div>
                    <h3 className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1 relative z-10">AEO Readiness</h3>
                    <div className="text-3xl font-black text-[#00b4d8] leading-none mb-1 relative z-10">{aiData?.aeo_readiness_score || 'N/A'}</div>
                    <p className="text-[9px] text-gray-400 font-medium relative z-10">AI Model visibility</p>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-[1rem] border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-[#0A101D] mb-2 flex items-center gap-2">
                      <span className="text-[#008dd8]">✨</span> AI Executive Verdict
                    </h3>
                    <p className="text-xs text-gray-700 font-medium italic leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-50/50">
                      "{summary?.verdict || "Analysis completed. Review the metrics below."}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-3">
                      <span className="text-red-600 font-black text-xl leading-none">{summary?.critical_issues_count || 0}</span>
                      <div>
                        <span className="block text-red-800 text-[8px] font-black uppercase tracking-widest">Immediate</span>
                        <span className="block text-red-600 font-bold text-[10px]">Critical Issues</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-3">
                      <span className="text-green-600 font-black text-xl leading-none">{summary?.quick_wins_count || 0}</span>
                      <div>
                        <span className="block text-green-800 text-[8px] font-black uppercase tracking-widest">Low Effort</span>
                        <span className="block text-green-600 font-bold text-[10px]">Quick Wins</span>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* INTELLIGENCE LISTS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-5 rounded-[1rem] shadow-sm">
                  <h3 className="text-base font-black text-[#0A101D] mb-3 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Critical Fixes Required
                  </h3>
                  {criticalFixes.length > 0 ? (
                    <ul className="space-y-2">
                      {criticalFixes.map((fix, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 font-medium text-xs leading-relaxed border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                          <span className="text-red-400 shrink-0 mt-0.5">•</span> {fix}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-green-600 text-xs font-bold bg-green-50 p-2 rounded">No critical errors detected.</div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-[1rem] shadow-sm">
                  <h3 className="text-base font-black text-[#0A101D] mb-3 flex items-center gap-2">
                    <span className="text-[#008dd8]">📍</span> UK Local Opportunities
                  </h3>
                  {localOps.length > 0 ? (
                    <ul className="space-y-2">
                      {localOps.map((op, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 font-medium text-xs leading-relaxed border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                          <span className="text-[#008dd8] shrink-0 mt-0.5">•</span> {op}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-xs font-medium italic">No local opportunities found.</div>
                  )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-5 rounded-[1rem] shadow-sm">
                  <h3 className="text-base font-black text-[#0A101D] mb-3 flex items-center gap-2">
                    <span className="text-green-500">✅</span> Quick Wins
                  </h3>
                  {quickWins.length > 0 ? (
                    <ul className="space-y-2">
                      {quickWins.map((winObj, i) => (
                        <li key={i} className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col gap-1">
                          <strong className="text-gray-900 text-xs">{winObj.win || JSON.stringify(winObj)}</strong>
                          <div className="flex gap-2 text-[8px] font-bold mt-1 uppercase tracking-widest">
                            {winObj.effort && <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Effort: {winObj.effort}</span>}
                            {winObj.expected_impact && <span className="bg-[#008dd8]/10 text-[#008dd8] px-1.5 py-0.5 rounded">Impact: {winObj.expected_impact}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-xs font-medium italic">No quick wins identified.</div>
                  )}
                </div>
                
                <div className="bg-white border border-gray-200 p-5 rounded-[1rem] shadow-sm">
                  <h3 className="text-base font-black text-[#0A101D] mb-3 flex items-center gap-2">
                    <span className="text-orange-500">⚠️</span> Geo-AI Overview Gaps
                  </h3>
                  {geoGaps.length > 0 ? (
                    <ul className="space-y-2">
                      {geoGaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 font-medium text-xs leading-relaxed border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                          <span className="text-orange-400 shrink-0 mt-0.5">•</span> {gap}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-xs font-medium italic">No AI geo-gaps found.</div>
                  )}
                </div>
             </div>

             {/* ON-PAGE ARCHITECTURE */}
             <div className="bg-white rounded-[1rem] border border-gray-200 shadow-sm p-5">
                <div className="mb-4 border-b border-gray-100 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-[#0A101D]">On-Page Architecture</h3>
                    <p className="text-gray-500 text-[10px] font-medium">Data extracted from DOM.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#008dd8] text-[8px] font-black uppercase tracking-widest block">Word Count</span>
                    <span className="text-[#0A101D] font-black text-lg">{content.word_count || 0}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="text-[8px] font-black text-[#008dd8] uppercase tracking-widest">Page Title</p>
                        {scrapedData.title ? <span className="text-[7px] font-bold text-green-600 bg-green-100 px-1 rounded">Found</span> : <span className="text-[7px] font-bold text-red-600 bg-red-100 px-1 rounded">Missing</span>}
                      </div>
                      <p className={`text-xs font-medium leading-snug break-words ${scrapedData.title ? 'text-gray-800' : 'text-red-500 italic'}`}>
                        {scrapedData.title || "No title tag found."}
                      </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="text-[8px] font-black text-[#008dd8] uppercase tracking-widest">Meta Description</p>
                        {scrapedData.meta_description ? <span className="text-[7px] font-bold text-green-600 bg-green-100 px-1 rounded">Found</span> : <span className="text-[7px] font-bold text-red-600 bg-red-100 px-1 rounded">Missing</span>}
                      </div>
                      <p className={`text-[10px] font-medium leading-relaxed line-clamp-3 break-words ${scrapedData.meta_description ? 'text-gray-700' : 'text-red-500 italic'}`}>
                        {scrapedData.meta_description || "No meta description found."}
                      </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 sm:col-span-2">
                    <p className="text-[8px] font-black text-[#008dd8] uppercase tracking-widest mb-2">Heading Structure</p>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className={`p-2 rounded border flex flex-col items-center text-center ${headings.h1_count === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                        <span className="text-gray-400 font-bold text-[7px] uppercase tracking-widest">H1</span>
                        <span className={`text-base font-black ${headings.h1_count === 0 ? 'text-red-600' : 'text-[#0A101D]'}`}>{headings.h1_count || 0}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 flex flex-col items-center text-center">
                        <span className="text-gray-400 font-bold text-[7px] uppercase tracking-widest">H2</span>
                        <span className="text-base font-black text-[#0A101D]">{headings.h2_count || 0}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200 flex flex-col items-center text-center">
                        <span className="text-gray-400 font-bold text-[7px] uppercase tracking-widest">H3</span>
                        <span className="text-base font-black text-[#0A101D]">{headings.h3_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* BOTTOM CTA STRIP (Ignored by PDF) */}
             <div data-html2canvas-ignore="true" className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-[1rem] border border-gray-200 shadow-md text-center sm:text-left">
                <div>
                  <h4 className="text-sm font-black text-[#0A101D]">Fix these issues.</h4>
                  <p className="text-[9px] font-medium text-gray-500">Book a strategy call to review this audit.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => setAuditComplete(false)} className="w-full sm:w-auto text-[#0A101D] font-black text-[8px] uppercase tracking-widest hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded transition-all">
                    New Scan
                  </button>
                  <Link href="/free-audit" className="w-full sm:w-auto bg-[#0A101D] text-white font-black text-[8px] uppercase tracking-widest hover:bg-[#008dd8] px-4 py-2 rounded transition-all shadow-sm">
                    Contact Us
                  </Link>
                </div>
             </div>

          </div>
        </section>
      )}

      {/* ============================================================
          EDUCational LANDING PAGE CONTENT (Only shows before scan)
          Theme Alternation: Light -> Dark -> Light -> Dark
          ============================================================ */}
      {!isAnalyzing && !auditComplete && (
        <>
          {/* SECTION 1: INTRO (LIGHT) */}
          <section className="w-full bg-[#fafafa] py-16 sm:py-24 px-6 border-t border-gray-100">
            <div className="max-w-[800px] mx-auto">
              <div className="bg-blue-50 border-l-4 border-[#008dd8] p-5 sm:p-6 rounded-r-xl mb-12 shadow-sm">
                <h3 className="text-[10px] font-black text-[#008dd8] uppercase tracking-widest mb-2">AEO Quick Answer</h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                  Klarai's free AI SEO audit tool analyses any website in 30 seconds using Google Gemini. It checks technical SEO health, on-page signals, Core Web Vitals, local SEO consistency, schema markup, and AI search visibility, then delivers a prioritised, plain-English action plan. No signup required. Built specifically for UK businesses and digital agencies.
                </p>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#0A101D] mb-4">Most websites have SEO problems hiding in plain sight.</h2>
              <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                <p>A title tag duplicated across a dozen pages. A robots.txt accidentally blocking Google from your most important service section. A site loading in 6 seconds on mobile while a competitor loads in 1.4. These are not rare edge cases. They are the most common findings every time we run an audit, on sites that look completely fine from the outside.</p>
                <p>The traditional fix was to hire an agency, wait two weeks for a PDF, and pay several hundred pounds for a report you then had to interpret yourself. Klarai's SEO auditor does the same analysis in 30 seconds, powered by Google Gemini, and gives you a plain-English action list you can start working through immediately.</p>
                <p>This is not a basic on-page checker that gives you a score and a colour. It covers technical health, on-page signals, Core Web Vitals, local SEO, structured data, and AI search visibility in a single scan. The result is a complete picture of where your site stands and exactly what needs to change to rank higher, appear in AI Overviews, and generate more leads from organic search.</p>
              </div>
            </div>
          </section>

          {/* SECTION 2: COMPARISON (DARK) */}
          <section className="w-full bg-[#0A101D] py-16 sm:py-24 px-6 border-t border-gray-800">
            <div className="max-w-[1000px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">What makes this SEO auditor different?</h2>
                <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">There are dozens of free SEO checkers online. Most run the same automated scan, produce a score out of 100, flag your missing meta descriptions, and leave you to figure out the rest. Klarai's SEO auditor is built differently.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div className="bg-[#111827] p-6 sm:p-8 rounded-2xl border border-gray-800">
                  <h3 className="text-lg font-black text-gray-400 mb-6 uppercase tracking-wider">Standard Free Checkers</h3>
                  <ul className="space-y-4">
                    {["Scan one page in isolation", "Return a score with no priority ranking", "Generic advice that applies to every site", "No local SEO or citation analysis", "No AI visibility or GEO checks", "Results that require an SEO expert to interpret"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-500">
                        <span className="text-gray-600 mt-0.5">✖</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-b from-[#008dd8]/10 to-[#111827] p-6 sm:p-8 rounded-2xl border border-[#008dd8]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#008dd8]/20 blur-3xl rounded-full"></div>
                  <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-[#008dd8]">⚡</span> Klarai SEO Auditor
                  </h3>
                  <ul className="space-y-4 relative z-10">
                    {["Gemini-powered analysis across your full site in 30 seconds", "Findings prioritised by revenue impact, not technical severity", "Specific, actionable recommendations for your actual pages", "Local SEO and UK directory citation checks built in", "AI Overview eligibility and GEO readiness assessment", "Plain-English output anyone can act on immediately"].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-200 font-medium">
                        <span className="text-[#008dd8] mt-0.5">✔</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 bg-[#111827] p-6 rounded-xl border border-gray-800 text-center max-w-3xl mx-auto">
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed italic">
                  "The Gemini integration is what makes the speed and depth possible simultaneously. Traditional tools run rule-based checks against a fixed list. Gemini reads and interprets your content contextually, the same way Google's own systems do, identifying issues rules miss entirely."
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: 6 CORE AREAS (LIGHT) */}
          <section className="w-full bg-[#fafafa] py-16 sm:py-24 px-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A101D] mb-4">What the Klarai SEO auditor checks</h2>
                <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto font-medium">The audit covers six core areas. Every area produces specific findings tied to your actual pages, not generic warnings that could apply to any website.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { num: "01", title: "Technical SEO health", desc: "Crawlability, indexability, robots.txt, XML sitemap, redirect chains, broken links, HTTPS security, and canonical tags. If Google cannot access your pages cleanly, nothing else matters." },
                  { num: "02", title: "On-page signals", desc: "Title tags, meta descriptions, H1 and heading structure, keyword usage and density, content length, internal linking, and image alt text across your key pages." },
                  { num: "03", title: "Core Web Vitals", desc: "Largest Contentful Paint, Cumulative Layout Shift, and Interaction to Next Paint for mobile and desktop. Google uses these as direct ranking signals." },
                  { num: "04", title: "Local SEO signals", desc: "Google Business Profile consistency, NAP data accuracy, local schema markup, and citation presence across UK directories including Checkatrade, Yell, and Thomson Local." },
                  { num: "05", title: "Schema and structured data", desc: "FAQ, HowTo, LocalBusiness, Article, and BreadcrumbList schema. Structured data makes your content extractable by Google AI Overviews and other systems." },
                  { num: "06", title: "AI search and GEO readiness", desc: "LLM accessibility, entity clarity, citability signals, and content structure. Gemini interprets your site the way ChatGPT and Perplexity do when deciding what to cite." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm hover:border-[#008dd8] transition-colors group">
                    <span className="text-3xl font-black text-gray-100 group-hover:text-[#008dd8]/20 transition-colors block mb-2">{item.num}</span>
                    <h3 className="text-lg font-black text-[#0A101D] mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: HOW TO RUN (DARK) */}
          <section className="w-full bg-[#0A101D] py-16 sm:py-24 px-6 border-t border-gray-800">
            <div className="max-w-[1000px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">How to run your free SEO audit</h2>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">The process takes less time than it takes to make a cup of tea.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Enter your website URL", desc: "Type or paste your full domain. You can audit any website, including competitors. No account required." },
                  { step: "2", title: "Gemini analyses in 30s", desc: "Our engine crawls your site, reads content contextually, checks technical signals, and assesses AI visibility." },
                  { step: "3", title: "Get your instant report", desc: "Results appear on screen immediately. Each finding is prioritised by its impact with plain-English explanations." },
                  { step: "4", title: "Implement or hand off", desc: "Work through the action list in-house, or get in touch with Klarai to have the improvements implemented for you." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#008dd8] text-white flex items-center justify-center font-black text-lg mb-4 shadow-[0_0_15px_rgba(0,141,216,0.3)]">{item.step}</div>
                    <h3 className="text-sm font-black text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: AI & GEO (LIGHT) */}
          <section className="w-full bg-[#fafafa] py-16 sm:py-24 px-6">
            <div className="max-w-[800px] mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A101D] mb-6 text-center">What is an AI SEO audit and why does it matter in 2025?</h2>
              
              <div className="space-y-4 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-10">
                <p>A standard SEO audit checks whether your website follows technical best practices. An AI SEO audit goes further by assessing whether your content is structured in a way that AI-powered systems can read, understand, and cite.</p>
                <p>In 2025, Google's AI Overviews appear for a significant share of UK searches. ChatGPT, Perplexity, and Gemini answer questions directly without sending users to websites. If your content is not structured for AI extraction, you are invisible to a growing portion of your potential customers, even if your traditional rankings are strong.</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-sm font-black text-[#0A101D] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="text-[#008dd8]">🔍</span> What AI & GEO readiness checks reveal
                </h3>
                <ul className="space-y-3">
                  {[
                    "Whether AI systems can crawl and read your content without technical barriers blocking access",
                    "Whether your business entity is clearly defined so Gemini, ChatGPT, and Perplexity can categorise and cite you accurately",
                    "Whether your content is structured with the concise, direct answer format that AI systems extract from",
                    "Whether your schema markup makes your content machine-readable for AI Overview citations",
                    "Whether you are currently appearing in Google AI Overviews for any of your target keywords"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 font-medium">
                      <span className="text-[#008dd8] mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 6: WHO ITS FOR (DARK) */}
          <section className="w-full bg-[#0A101D] py-16 sm:py-24 px-6 border-t border-gray-800">
            <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-8">Who the Klarai SEO auditor is built for</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-base font-black text-[#008dd8] mb-2">UK small businesses and tradespeople</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">If you run a local business and depend on Google to bring in customers, this audit tells you exactly why you are not ranking above your competitors. It covers local SEO signals that generic tools do not check, including Google Business Profile consistency and UK directory citation accuracy.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#008dd8] mb-2">Digital agencies and SEO professionals</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">Run instant audits on client sites before onboarding calls. Identify quick wins in the first meeting. The Gemini-powered analysis gives you contextual insights that standard crawl tools miss.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#008dd8] mb-2">Business owners researching SEO options</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">If you are considering hiring an SEO agency, run this audit first. You will understand your site's strengths and weaknesses, know what questions to ask, and be able to evaluate any agency's proposed work against an objective baseline.</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#111827] border border-[#008dd8]/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
                <span className="inline-block py-1 px-3 rounded-full bg-[#008dd8]/20 text-[#00b4d8] text-[10px] font-black tracking-[0.2em] uppercase mb-4 self-start">Pro Tip</span>
                <h3 className="text-xl font-black text-white mb-3">Audit your competitors.</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed italic">
                  "Run the audit on your three main competitors after you run it on your own site. The comparison immediately shows you what they are doing that you are not, which keywords they are structuring content around, and where their local authority comes from. This competitive gap analysis is the fastest way to identify your highest-priority actions."
                </p>
              </div>

            </div>
          </section>

          {/* SECTION 7: FAQ & LINKS (LIGHT) */}
          <section className="w-full bg-[#fafafa] py-16 sm:py-24 px-6 border-t border-gray-200">
            <div className="max-w-[800px] mx-auto">
              
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A101D] mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-4 mb-16">
                {[
                  { q: "What is an AI SEO audit tool?", a: "An AI SEO audit tool uses artificial intelligence to analyse your website for technical errors, on-page issues, and visibility problems. Klarai's auditor is powered by Gemini, which reads your content contextually to identify problems like unclear entity signals and AI extractability issues that standard rule-based checkers miss." },
                  { q: "How is this SEO auditor powered by Gemini?", a: "Klarai sends your website data through Google's Gemini API. It reads your content contextually, assesses whether it is clear and authoritative enough to be cited by AI systems, and identifies structural issues that prevent generative engines from understanding what your business does." },
                  { q: "Is the Klarai SEO audit tool completely free?", a: "Yes. The SEO audit is free to run with no account creation, no email address, and no credit card required. If you want Klarai to implement the recommended fixes for you, that is a separate paid service, but using the tool carries no cost or obligation." },
                  { q: "How long does the SEO audit take?", a: "The audit delivers results in approximately 30 seconds. Gemini analyses your site's technical signals, reads your content contextually, checks your local SEO consistency, and assesses your AI visibility simultaneously rather than sequentially." }
                ].map((faq, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-sm font-black text-[#0A101D] mb-2">{faq.q}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Related Resources</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {["Klarai SEO services", "What is answer engine optimisation?", "AEO vs SEO vs GEO explained", "How to rank in Google AI Overviews", "SEO for plumbers UK"].map((link, i) => (
                    <Link key={i} href="#" className="text-[10px] sm:text-xs font-bold text-[#008dd8] bg-blue-50 px-4 py-2 rounded-full hover:bg-[#008dd8] hover:text-white transition-colors">
                      {link} →
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* FINAL CTA (DARK) */}
          <section className="w-full bg-[#0A101D] py-20 px-6 text-center border-t border-gray-800">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Free AI SEO audit — powered by Gemini</h2>
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8">Find out what is holding your site back in 30 seconds. No signup. No waiting.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-[#008dd8] text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#0077b6] transition-all shadow-lg active:scale-95">
              Run my free SEO audit ↗
            </button>
          </section>
        </>
      )}

    </div>
  );
}