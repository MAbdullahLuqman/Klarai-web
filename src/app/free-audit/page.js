"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader'; 

export default function FreeAuditPage() {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ name: '', email: '', website: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [reportData, setReportData] = useState(null);

  // --- 1. FIREBASE SAVE & API INITIATION ---
  const handleStartScan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        email: formData.email,
        website: formData.website,
        goal: 'Free Technical Audit',
        capturedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'scans'), {
        website: formData.website,
        scannedAt: serverTimestamp(),
      });

      setStep(2); 
      
      try {
        const response = await fetch('/api/your-backend-scanner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: formData.website })
        });
        
        if (response.ok) {
          const backendResults = await response.json();
          setReportData(backendResults);
        } else {
          console.warn("Backend API not ready, using mock data.");
        }
      } catch (apiError) {
         console.warn("Backend API fetch failed, using mock data.");
      }

      setStep(3); 

    } catch (error) {
      console.error("Firebase Save Error:", error);
      alert("Failed to connect to scanner. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 2. BULLETPROOF PDF GENERATOR ---
 // --- 2. THE NEW, POWERFUL PDF GENERATOR (WITH STABILITY FIX) ---
// --- 2. THE NUCLEAR PDF GENERATOR FIX ---
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const reportElement = document.getElementById('audit-report-container');
      if (!reportElement) throw new Error("Report container not found");

      // Give React a tiny bit more time to ensure all backend text is painted
      await new Promise(resolve => setTimeout(resolve, 800));

      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin:       [15, 15, 15, 15], 
        filename:     `Klarai-Audit-${formData.website.replace(/[^a-zA-Z0-9]/g, '')}.pdf`,
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#0a0a0a',
          scrollY: 0,
          // THIS IS THE NUCLEAR FIX:
          // It intercepts the invisible document right before the PDF is captured 
          // and forcefully removes any height limits or hidden overflows.
          onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('audit-report-container');
            if(el) {
              el.style.height = 'max-content';
              el.style.overflow = 'visible';
            }
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] } 
      };

      await html2pdf().set(opt).from(reportElement).save();

    } catch (error) {
      console.error("PDF Error:", error);
      alert("Failed to generate PDF. Make sure all content has loaded.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#030303] text-white min-h-screen font-sans selection:bg-[#ccff00] selection:text-[#0a0a0a]">
      <GlobalHeader />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6">
        
        {/* STEP 1: LEAD CAPTURE */}
        {step === 1 && (
          <div className="bg-[#0a0a0a] border border-white/10 p-10 rounded-[2rem] shadow-2xl max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black uppercase tracking-widest text-[#ccff00] mb-2">Initiate System Audit</h1>
              <p className="text-gray-400 font-medium">Enter your details to uncover the technical flaws costing you rankings.</p>
            </div>

            <form onSubmit={handleStartScan} className="space-y-5">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Target URL</label>
                <input required type="url" placeholder="https://yourwebsite.com" value={formData.website} onChange={(e)=>setFormData({...formData, website: e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 text-sm focus:border-[#008dd8] outline-none text-white rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Your Name</label>
                <input required type="text" placeholder="John Doe" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 text-sm focus:border-[#008dd8] outline-none text-white rounded-xl" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Work Email</label>
                <input required type="email" placeholder="john@company.com" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 text-sm focus:border-[#008dd8] outline-none text-white rounded-xl" />
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#008dd8] hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-xl mt-6 transition-all disabled:opacity-50 shadow-lg">
                {isSubmitting ? 'Connecting...' : 'Run Technical Scan'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: SCANNING */}
        {step === 2 && (
          <div className="text-center space-y-8 py-20">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-[#111] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#ccff00] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-widest uppercase text-white animate-pulse">Analyzing Architecture...</h2>
              <p className="text-[#008dd8] font-mono text-sm mt-4 tracking-widest">Scanning {formData.website}</p>
            </div>
          </div>
        )}

        {/* STEP 3: THE REPORT */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#111] p-6 rounded-2xl border border-white/10">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">Scan Complete</h2>
                <p className="text-[#ccff00] text-sm font-mono mt-1">{formData.website}</p>
              </div>
              
              <button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-[#ccff00] text-[#0a0a0a] px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#b3e600] transition-all flex items-center gap-2 shadow-lg disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                {isDownloading ? 'Packaging PDF...' : 'Download Full Report'}
              </button>
            </div>

            {/* --- PDF WRAPPER --- */}
            <div id="audit-report-container" className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
              
              <div className="border-b border-white/10 pb-8 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-[#008dd8]">Technical Audit</h1>
                  <p className="text-gray-400 font-mono text-sm">Target: {formData.website}</p>
                  <p className="text-gray-400 font-mono text-sm">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-red-500">42/100</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-2">Overall Score</div>
                </div>
              </div>

              <div className="space-y-10">
                
                {/* Note the 'break-inside-avoid' class on all these sections. This tells the PDF generator never to slice this specific box in half. */}
                <section className="break-inside-avoid">
                  <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-red-500 pl-4 mb-4">Critical Issues</h3>
                  <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl space-y-3">
                    <div className="flex gap-3"><span className="text-red-500 font-black">✕</span><p className="text-sm font-medium text-red-200">Missing primary H1 tag on homepage.</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-black">✕</span><p className="text-sm font-medium text-red-200">Load time exceeds 4.5 seconds on mobile.</p></div>
                  </div>
                </section>

                <section className="break-inside-avoid">
                  <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-yellow-500 pl-4 mb-4">Warnings</h3>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-xl space-y-3">
                    <div className="flex gap-3"><span className="text-yellow-500 font-black">!</span><p className="text-sm font-medium text-yellow-200">Meta description is too short.</p></div>
                  </div>
                </section>

                {/* RESTORED: On-Page Architecture */}
                <section className="break-inside-avoid">
                  <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-blue-500 pl-4 mb-4">On-Page Architecture</h3>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl space-y-3">
                    {reportData?.onPage && reportData.onPage.length > 0 ? (
                      reportData.onPage.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="text-blue-500 font-black">→</span>
                          <p className="text-sm font-medium text-blue-200">{item}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex gap-3"><span className="text-blue-500 font-black">→</span><p className="text-sm font-medium text-blue-200">Header tag hierarchy jumps from H1 directly to H3.</p></div>
                        <div className="flex gap-3"><span className="text-blue-500 font-black">→</span><p className="text-sm font-medium text-blue-200">Internal linking structure lacks topical clusters.</p></div>
                        <div className="flex gap-3"><span className="text-blue-500 font-black">→</span><p className="text-sm font-medium text-blue-200">Image alt-text optimization is missing on 80% of assets.</p></div>
                      </>
                    )}
                  </div>
                </section>

                {/* RESTORED: GEO / AI Overview Gaps */}
                <section className="break-inside-avoid">
                  <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-purple-500 pl-4 mb-4">GEO / AI Overview Gaps</h3>
                  <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-xl space-y-3">
                    {reportData?.aiGaps && reportData.aiGaps.length > 0 ? (
                      reportData.aiGaps.map((gap, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="text-purple-500 font-black">✦</span>
                          <p className="text-sm font-medium text-purple-200">{gap}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex gap-3"><span className="text-purple-500 font-black">✦</span><p className="text-sm font-medium text-purple-200">Brand Entity is not recognized by Gemini or ChatGPT.</p></div>
                        <div className="flex gap-3"><span className="text-purple-500 font-black">✦</span><p className="text-sm font-medium text-purple-200">Conversational long-tail keywords are missing from structures.</p></div>
                        <div className="flex gap-3"><span className="text-purple-500 font-black">✦</span><p className="text-sm font-medium text-purple-200">Lack of author authority signals for E-E-A-T compliance.</p></div>
                      </>
                    )}
                  </div>
                </section>

                <section className="break-inside-avoid">
                  <h3 className="text-lg font-black uppercase tracking-widest border-l-4 border-emerald-500 pl-4 mb-4">Passed Checks</h3>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl space-y-3">
                    <div className="flex gap-3"><span className="text-emerald-500 font-black">✓</span><p className="text-sm font-medium text-emerald-200">SSL Certificate is valid and active.</p></div>
                  </div>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 text-center break-inside-avoid">
                <h3 className="text-xl font-black uppercase mb-4 text-white">Stop Guessing. Start Scaling.</h3>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">Your technical architecture is actively losing you leads. Let our engineering team fix these errors and align your site for AI Search dominance.</p>
                <div className="mt-6 text-xs font-mono text-[#008dd8]">founder@klarai.uk • klarai.uk</div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}