"use client";
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

// FIREBASE IMPORTS
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const auditPhases = [
  "Initializing secure connection to target server",
  "Bypassing cache & scraping DOM architecture",
  "Evaluating Core Web Vitals & speed metrics",
  "Extracting UK-specific localized schema",
  "Analyzing Answer Engine Optimization (AEO) readiness",
  "Scanning for critical technical vulnerabilities",
  "Feeding entity data to Generative AI scoring engine",
  "Compiling final Klarai intelligence report"
];

export default function AuditorClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-500 tracking-widest uppercase text-xs">Loading Core...</div>}>
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
  const [hasTriggeredAuto, setHasTriggeredAuto] = useState(false);
  const reportRef = useRef(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const formatUrl = (inputUrl) => {
    let formatted = inputUrl.trim();
    if (!/^https?:\/\//i.test(formatted)) formatted = 'https://' + formatted;
    return formatted;
  };

  const executeAudit = async (targetUrlString) => {
    const formattedUrl = formatUrl(targetUrlString);
    setIsAnalyzing(true);
    setAuditComplete(false);
    setProgress(0);
    setPhaseIndex(0);
    setAuditResult(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const progressInterval = setInterval(() => setProgress((prev) => (prev >= 98 ? 98 : prev + 1)), 300);
    const phaseInterval = setInterval(() => setPhaseIndex((prev) => (prev >= auditPhases.length - 1 ? prev : prev + 1)), 3000); 

    try {
      const response = await fetch('https://klarai-seo-audit-tool-production.up.railway.app/free-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl })
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const auditData = await response.json();
      setAuditResult(auditData);

      try {
        await addDoc(collection(db, 'scans'), { website: formattedUrl, scannedAt: serverTimestamp() });
      } catch (dbError) {
        console.error("DB Error (Adblocker active?):", dbError);
      }

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

  const downloadPDF = () => {
    window.print();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return;
    
    setIsSubmittingLead(true);
    try {
      await addDoc(collection(db, 'leads'), {
        email: userEmail,
        website: formatUrl(url),
        capturedAt: serverTimestamp()
      });
      setShowEmailModal(false);
      setTimeout(() => downloadPDF(), 500); 
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Please turn off Adblockers to save and download the report.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Safe Extraction
  const rawScraped = auditResult?.scraped_data || {};
  const scrapedData = rawScraped.seo_data || rawScraped; 
  const aiData = auditResult?.ai_analysis || {};
  const perfData = auditResult?.performance_data || {};
  const summary = aiData.audit_summary || {};
  const headings = scrapedData.headings || {};
  const content = scrapedData.content || {};
  const criticalFixes = aiData.critical_fixes_checklist || [];
  const localOps = aiData.local_uk_opportunities || [];
  const geoGaps = aiData.geo_ai_overview_gaps || [];
  const quickWins = aiData.quick_wins || [];

  // Bulletproof renderer to prevent React crashes if API sends objects instead of strings
  const renderTextSafely = (item) => {
    if (typeof item === 'string') return item;
    return item?.gap || item?.issue || item?.description || item?.title || JSON.stringify(item);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans selection:bg-[#ad5b2b] selection:text-white min-h-screen flex flex-col">

      {/* TOOL HERO */}
      <section className="hide-on-print w-full flex flex-col items-center pt-32 pb-16 px-4 sm:px-6 relative overflow-hidden bg-[#0A101D]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#008dd8]/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-[700px] w-full mx-auto relative z-10">
          {!isAnalyzing && !auditComplete && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-900/30 border border-blue-500/30 text-[#00b4d8] text-[9px] font-black tracking-[0.2em] uppercase">
                ⚡ Powered by Google Gemini
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Free AI SEO Audit Tool <br/> <span className="text-[#008dd8]">for UK Websites</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
                Enter any website URL and Klarai's Gemini-powered SEO auditor analyses your site in 30 seconds.
              </p>

              <form onSubmit={handleFormSubmit} className="mt-8 relative max-w-xl mx-auto group w-full px-2">
                <div className="absolute -inset-1 bg-[#008dd8] rounded-[1.5rem] blur opacity-20 transition duration-500"></div>
                <div className="relative flex flex-col sm:flex-row items-center bg-gray-900 border border-gray-700 rounded-[1.25rem] p-1.5 focus-within:border-[#008dd8] transition-colors w-full">
                  <div className="flex-1 w-full flex items-center px-4 py-2">
                    <input 
                      type="text" 
                      placeholder="example.co.uk" 
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-transparent text-sm sm:text-base font-bold text-white placeholder-gray-500 outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-[#008dd8] text-white px-6 py-3 rounded-[1rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#0077b6] transition-all">
                    Run Free Audit
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {isAnalyzing && (
            <div className="w-full max-w-2xl mx-auto bg-gray-900 rounded-[1.25rem] border border-gray-800 overflow-hidden animate-fade-in mt-6">
              <div className="bg-[#0A101D] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-[9px] font-mono uppercase tracking-widest ml-2">Target: {formatUrl(url)}</span>
                </div>
                <span className="text-[#00b4d8] text-[9px] font-mono font-bold">{progress}%</span>
              </div>
              <div className="p-5 sm:p-6 space-y-3 font-mono text-[10px] sm:text-xs">
                {auditPhases.map((phase, index) => {
                  const isCompleted = index < phaseIndex;
                  const isActive = index === phaseIndex;
                  return (
                    <div key={index} className={`flex items-start gap-3 transition-all duration-300 ${isCompleted ? 'text-gray-500' : isActive ? 'text-white' : 'text-gray-700 opacity-50'}`}>
                      <span className={`${isActive ? 'animate-pulse font-semibold' : ''} leading-snug`}>{isCompleted ? '✓' : '>'} {phase}...</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RESULTS DASHBOARD */}
      {auditComplete && auditResult && (
        <section className="w-full bg-gray-50 py-12 px-4 sm:px-6">
          <div id="seo-audit-report" ref={reportRef} className="w-full max-w-[1000px] mx-auto animate-fade-in relative z-10 space-y-5 pb-10">
             
             {/* TOP HEADER */}
             <div className="bg-[#0A101D] rounded-2xl border border-gray-800 p-6 relative overflow-hidden break-inside-avoid">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#008dd8] to-[#00b4d8]"></div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3">
                 <div>
                   <span className="inline-block py-1 px-3 rounded-full bg-gray-800 border border-gray-700 text-[#00b4d8] text-[8px] font-black tracking-[0.2em] uppercase mb-2">Intelligence Report</span>
                   <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-1">{rawScraped.url || formatUrl(url)}</h2>
                 </div>
                 
                 <div className="hide-on-print flex flex-col items-start md:items-end gap-2 mt-2 md:mt-0">
                    <button onClick={() => setShowEmailModal(true)} className="bg-[#008dd8] text-white px-4 py-2 rounded flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#0077b6] transition-all">
                      Download PDF
                    </button>
                 </div>
               </div>
             </div>

             {/* SCORES & VERDICT */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 break-inside-avoid">
                <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-3">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col justify-center">
                    <h3 className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1">Performance</h3>
                    <div className="text-4xl font-black text-gray-900 leading-none mb-1">{perfData?.score || 'N/A'}</div>
                    <p className="text-[9px] text-gray-500 font-medium">Core Web Vitals</p>
                  </div>
                  <div className="bg-[#0A101D] p-5 rounded-2xl border border-gray-800 flex flex-col justify-center relative overflow-hidden">
                    <h3 className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1 relative z-10">AEO Readiness</h3>
                    <div className="text-4xl font-black text-[#00b4d8] leading-none mb-1 relative z-10">{aiData?.aeo_readiness_score || 'N/A'}</div>
                    <p className="text-[9px] text-gray-400 font-medium relative z-10">AI Model visibility</p>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2"><span className="text-[#008dd8]">✨</span> AI Executive Verdict</h3>
                    <p className="text-sm text-gray-700 font-medium italic leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                      "{summary?.verdict || "Analysis completed. Review the metrics below."}"
                    </p>
                  </div>
                </div>
             </div>

             {/* INTELLIGENCE LISTS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl break-inside-avoid">
                  <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2"><span className="text-red-500">❌</span> Critical Fixes Required</h3>
                  {criticalFixes.length > 0 ? (
                    <ul className="space-y-3">
                      {criticalFixes.map((fix, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 font-medium text-xs sm:text-sm leading-relaxed border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <span className="text-red-500 shrink-0 mt-0.5">•</span> {renderTextSafely(fix)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-green-600 text-xs font-bold bg-green-50 p-3 rounded-lg">No critical errors detected.</div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-2xl break-inside-avoid">
                  <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2"><span className="text-[#008dd8]">📍</span> UK Local Opportunities</h3>
                  {localOps.length > 0 ? (
                    <ul className="space-y-3">
                      {localOps.map((op, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 font-medium text-xs sm:text-sm leading-relaxed border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <span className="text-[#008dd8] shrink-0 mt-0.5">•</span> {renderTextSafely(op)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-xs font-medium italic">No local opportunities found.</div>
                  )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 p-6 rounded-2xl break-inside-avoid">
                  <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2"><span className="text-green-500">✅</span> Quick Wins</h3>
                  {quickWins.length > 0 ? (
                    <ul className="space-y-3">
                      {quickWins.map((winObj, i) => (
                        <li key={i} className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col gap-2">
                          <strong className="text-gray-900 text-xs sm:text-sm">{winObj.win || JSON.stringify(winObj)}</strong>
                          <div className="flex gap-2 text-[9px] font-bold mt-1 uppercase tracking-widest">
                            {winObj.effort && <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Effort: {winObj.effort}</span>}
                            {winObj.expected_impact && <span className="bg-blue-50 text-[#008dd8] px-2 py-1 rounded">Impact: {winObj.expected_impact}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-xs font-medium italic">No quick wins identified.</div>
                  )}
                </div>
                
                {/* GEO AI OVERVIEW GAPS FIX - Rendered perfectly safe */}
                <div className="bg-white border border-gray-200 p-6 rounded-2xl break-inside-avoid">
                  <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2"><span className="text-orange-500">⚠️</span> Geo-AI Overview Gaps</h3>
                  {geoGaps.length > 0 ? (
                    <ul className="space-y-3">
                      {geoGaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 font-medium text-xs sm:text-sm leading-relaxed border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <span className="text-orange-500 shrink-0 mt-0.5">•</span> {renderTextSafely(gap)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-xs font-medium italic">No AI geo-gaps found.</div>
                  )}
                </div>
             </div>

             {/* ON-PAGE ARCHITECTURE */}
             <div className="bg-white rounded-2xl border border-gray-200 p-6 break-inside-avoid">
                <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">On-Page Architecture</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[#008dd8] text-[9px] font-black uppercase tracking-widest block">Word Count</span>
                    <span className="text-gray-900 font-black text-xl">{content.word_count || 0}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[9px] font-black text-[#008dd8] uppercase tracking-widest">Page Title</p>
                        {scrapedData.title ? <span className="text-[8px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Found</span> : <span className="text-[8px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Missing</span>}
                      </div>
                      <p className={`text-sm font-medium leading-snug break-words ${scrapedData.title ? 'text-gray-900' : 'text-red-500 italic'}`}>{scrapedData.title || "No title tag found."}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[9px] font-black text-[#008dd8] uppercase tracking-widest">Meta Description</p>
                        {scrapedData.meta_description ? <span className="text-[8px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">Found</span> : <span className="text-[8px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Missing</span>}
                      </div>
                      <p className={`text-xs font-medium leading-relaxed line-clamp-3 break-words ${scrapedData.meta_description ? 'text-gray-700' : 'text-red-500 italic'}`}>{scrapedData.meta_description || "No meta description found."}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 sm:col-span-2">
                    <p className="text-[9px] font-black text-[#008dd8] uppercase tracking-widest mb-3">Heading Structure</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`p-3 rounded-lg border flex flex-col items-center text-center ${headings.h1_count === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                        <span className="text-gray-400 font-bold text-[8px] uppercase tracking-widest mb-1">H1</span>
                        <span className={`text-xl font-black ${headings.h1_count === 0 ? 'text-red-600' : 'text-gray-900'}`}>{headings.h1_count || 0}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                        <span className="text-gray-400 font-bold text-[8px] uppercase tracking-widest mb-1">H2</span>
                        <span className="text-xl font-black text-gray-900">{headings.h2_count || 0}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col items-center text-center">
                        <span className="text-gray-400 font-bold text-[8px] uppercase tracking-widest mb-1">H3</span>
                        <span className="text-xl font-black text-gray-900">{headings.h3_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* BOTTOM CTA STRIP */}
             <div className="hide-on-print mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 text-center sm:text-left">
                <div>
                  <h4 className="text-base font-black text-gray-900">Fix these issues.</h4>
                  <p className="text-xs font-medium text-gray-500">Book a strategy call to review this audit.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => setAuditComplete(false)} className="w-full sm:w-auto text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 border border-gray-200 px-5 py-2.5 rounded-lg transition-all">New Scan</button>
                  <Link href="/free-audit" className="w-full sm:w-auto bg-[#0A101D] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#008dd8] px-5 py-2.5 rounded-lg transition-all">Contact Us</Link>
                </div>
             </div>

          </div>
        </section>
      )}

      {/* EDUCATIONAL LANDING PAGE */}
      <div className="hide-on-print">
        {!isAnalyzing && !auditComplete && (
          <section className="w-full bg-white py-20 px-6 border-t border-gray-200 text-center">
             <h2 className="text-3xl font-black text-gray-900 mb-4">AI SEO Audits for UK Businesses</h2>
             <p className="text-gray-500 max-w-2xl mx-auto">Run a full technical sweep to ensure your website is properly structured to capture traffic from Google and Generative AI systems.</p>
          </section>
        )}
      </div>

      {/* EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 hide-on-print">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">✕</button>
            <div className="text-center mb-6">
              <span className="text-3xl mb-2 block">📄</span>
              <h3 className="text-xl font-black text-gray-900 mb-2">Get your full audit report</h3>
              <p className="text-sm text-gray-500 font-medium">Enter your email to instantly download the PDF report.</p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input type="email" required placeholder="name@company.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-xl font-medium focus:outline-none focus:border-[#008dd8]"/>
              <button type="submit" disabled={isSubmittingLead} className="w-full bg-[#008dd8] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0077b6] transition-all disabled:opacity-50">
                {isSubmittingLead ? 'Unlocking...' : 'Unlock & Download PDF'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* GLOBAL PRINT CSS: This makes the Browser PDF look absolutely perfect */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .hide-on-print {
            display: none !important;
          }
          #seo-audit-report {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
          @page {
            margin: 15mm;
            size: A4 portrait;
          }
        }
      `}</style>
    </div>
  );
}
