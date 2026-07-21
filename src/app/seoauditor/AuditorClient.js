"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, Check, Download, FileText, Gauge, Globe2, Mail, MapPin, Search, Sparkles, X } from "lucide-react";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const auditPhases = [
  "Opening a secure connection to the target site",
  "Reading page structure, metadata and indexable content",
  "Checking technical SEO signals and speed data",
  "Reviewing local search and UK visibility markers",
  "Testing answer engine and AI overview readiness",
  "Finding critical blockers and quick wins",
  "Preparing the Klarai audit summary",
  "Compiling the final visibility report",
];

const featureChecks = [
  "Technical SEO structure",
  "On-page metadata",
  "Core Web Vitals signals",
  "Local visibility gaps",
  "Answer engine readiness",
  "Priority fixes",
];

const methodSteps = [
  ["01", "Audit", "Read the site the way crawlers, search engines and answer engines see it."],
  ["02", "Architect", "Separate structural blockers from surface-level copy issues."],
  ["03", "Prioritise", "Turn the findings into fixes that can improve visibility fastest."],
];

const formatAuditUrl = (inputUrl) => {
  let formatted = inputUrl.trim();
  if (!/^https?:\/\//i.test(formatted)) formatted = `https://${formatted}`;
  return formatted;
};

const renderTextSafely = (item) => {
  if (typeof item === "string") return item;
  return item?.gap || item?.issue || item?.description || item?.title || item?.win || JSON.stringify(item);
};

function AuditorFallback() {
  return (
    <div className="min-h-screen bg-[#f4efe4] px-5 pt-36 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#2f3438]/46">
      Loading audit interface
    </div>
  );
}

export default function AuditorClient() {
  return (
    <Suspense fallback={<AuditorFallback />}>
      <AuditorCore />
    </Suspense>
  );
}

function AuditorCore() {
  const searchParams = useSearchParams();
  const defaultUrl = searchParams.get("url") || "";
  const autoStart = searchParams.get("auto") === "true";

  const [url, setUrl] = useState(defaultUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const hasTriggeredAuto = useRef(false);
  const reportRef = useRef(null);

  const executeAudit = useCallback(async (targetUrlString) => {
    const formattedUrl = formatAuditUrl(targetUrlString);
    setIsAnalyzing(true);
    setAuditComplete(false);
    setProgress(0);
    setPhaseIndex(0);
    setAuditResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const progressInterval = setInterval(() => setProgress((prev) => (prev >= 98 ? 98 : prev + 1)), 300);
    const phaseInterval = setInterval(() => setPhaseIndex((prev) => (prev >= auditPhases.length - 1 ? prev : prev + 1)), 3000);

    try {
      const response = await fetch("https://klarai-seo-audit-tool-production.up.railway.app/free-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const auditData = await response.json();
      setAuditResult(auditData);

      try {
        await addDoc(collection(db, "scans"), { website: formattedUrl, scannedAt: serverTimestamp() });
      } catch (dbError) {
        console.error("DB Error:", dbError);
      }

      setProgress(100);
      setPhaseIndex(auditPhases.length);
      setAuditComplete(true);
    } catch (error) {
      console.error("Audit Failed:", error);
      alert("The audit service could not complete the scan. Please try again.");
    } finally {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      setIsAnalyzing(false);
    }
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!url.trim()) return;
    executeAudit(url);
  };

  useEffect(() => {
    if (autoStart && defaultUrl && !hasTriggeredAuto.current) {
      hasTriggeredAuto.current = true;
      executeAudit(defaultUrl);
    }
  }, [autoStart, defaultUrl, executeAudit]);

  const downloadPDF = () => {
    window.print();
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!userEmail.trim()) return;

    setIsSubmittingLead(true);
    try {
      await addDoc(collection(db, "leads"), {
        email: userEmail,
        website: formatAuditUrl(url),
        capturedAt: serverTimestamp(),
      });
      setShowEmailModal(false);
      setTimeout(() => downloadPDF(), 500);
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("The report could not be unlocked. Please try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

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
  const reportUrl = rawScraped.url || formatAuditUrl(url || "example.co.uk");

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      <section className="hide-on-print relative overflow-hidden px-5 pb-20 pt-34 sm:px-8 lg:px-12 lg:pb-24 lg:pt-40">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,#151b1e_0%,#2f3438_58%,rgba(47,52,56,0)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[url('/images/hero-mountain.jpg')] bg-cover bg-center opacity-24 mix-blend-luminosity" />
        <div className="relative mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[1.04fr_0.72fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7 }}>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e0b48b] backdrop-blur-md">
              <Sparkles size={14} />
              Gemini-assisted SEO audit
            </p>
            <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[0.98] text-white sm:text-7xl lg:text-8xl">
              Free AI SEO audit for websites that need clarity.
            </h1>
            <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed text-white/72 sm:text-lg">
              Enter a URL and get a practical visibility report covering technical SEO, content structure, local signals and answer engine readiness.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.7, delay: 0.08 }} className="rounded-[1.15rem] border border-white/16 bg-[#f9f5ec] p-4 shadow-[0_30px_90px_rgba(14,20,24,0.24)] sm:p-5">
            <form onSubmit={handleFormSubmit} className="rounded-[0.85rem] border border-black/8 bg-white p-3">
              <label htmlFor="audit-url" className="mb-3 flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/38">
                <Globe2 size={14} />
                Website URL
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="audit-url"
                  type="text"
                  placeholder="example.co.uk"
                  required
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  className="min-h-14 flex-1 rounded-md border border-black/10 bg-[#f9f5ec] px-4 text-base font-bold text-[#2f3438] outline-none transition placeholder:text-black/28 focus:border-[#ad5b2b]"
                />
                <button type="submit" disabled={isAnalyzing} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-[#ad5b2b] px-6 text-sm font-black text-white transition hover:bg-[#8d4822] disabled:cursor-not-allowed disabled:opacity-60">
                  {isAnalyzing ? "Auditing" : "Run Free Audit"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {featureChecks.map((item) => (
                <div key={item} className="flex min-h-16 items-center gap-2 rounded-md border border-black/8 bg-[#f4efe4] px-3 text-xs font-bold leading-snug text-[#2f3438]/72">
                  <Check size={14} className="shrink-0 text-[#ad5b2b]" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {isAnalyzing && (
        <section className="hide-on-print px-5 pb-18 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[980px] rounded-[1.15rem] border border-black/8 bg-[#151b1e] p-5 text-white shadow-[0_30px_90px_rgba(14,20,24,0.18)] sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e0b48b]">Audit in progress</p>
                <p className="mt-2 break-all text-sm font-semibold text-white/62">{formatAuditUrl(url)}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-serif text-5xl font-medium text-white">{progress}%</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6f8fa3]">Processing</p>
              </div>
            </div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#ad5b2b] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid gap-3 font-mono text-xs">
              {auditPhases.map((phase, index) => {
                const isCompleted = index < phaseIndex;
                const isActive = index === phaseIndex;
                return (
                  <div key={phase} className={`flex items-start gap-3 rounded-md border px-4 py-3 transition ${isCompleted ? "border-white/8 bg-white/5 text-white/42" : isActive ? "border-[#ad5b2b]/40 bg-[#ad5b2b]/10 text-white" : "border-white/8 text-white/28"}`}>
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${isCompleted ? "border-[#6f8fa3] text-[#6f8fa3]" : isActive ? "border-[#e0b48b] text-[#e0b48b]" : "border-white/16"}`}>
                      {isCompleted ? <Check size={12} /> : <Activity size={12} className={isActive ? "animate-pulse" : ""} />}
                    </span>
                    <span className="leading-relaxed">{phase}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {auditComplete && auditResult && (
        <section className="bg-[#f4efe4] px-5 pb-20 sm:px-8 lg:px-12">
          <div id="seo-audit-report" ref={reportRef} className="mx-auto max-w-[1120px] space-y-5 pb-10">
            <div className="break-inside-avoid overflow-hidden rounded-[1.15rem] border border-black/8 bg-[#151b1e] text-white shadow-[0_30px_90px_rgba(14,20,24,0.16)]">
              <div className="h-1.5 bg-[#ad5b2b]" />
              <div className="flex flex-col justify-between gap-5 p-6 md:flex-row md:items-end">
                <div>
                  <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#e0b48b]">Visibility report</p>
                  <h2 className="break-all font-serif text-3xl font-medium leading-tight sm:text-5xl">{reportUrl}</h2>
                </div>
                <button onClick={() => setShowEmailModal(true)} className="hide-on-print inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#ad5b2b] px-5 text-xs font-black text-white transition hover:bg-[#8d4822]">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 break-inside-avoid md:grid-cols-3">
              <ScorePanel icon={<Gauge size={19} />} label="Performance" value={perfData?.score || "N/A"} detail="Core Web Vitals signal" />
              <ScorePanel icon={<Sparkles size={19} />} label="AEO readiness" value={aiData?.aeo_readiness_score || "N/A"} detail="AI answer visibility" dark />
              <div className="rounded-[1.15rem] border border-black/8 bg-white p-6 md:col-span-1">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#ad5b2b]">Executive verdict</p>
                <p className="text-sm font-semibold leading-relaxed text-[#2f3438]/74">{summary?.verdict || "Analysis completed. Review the priority fixes and page architecture below."}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FindingPanel icon={<AlertTriangle size={18} />} title="Critical Fixes Required" items={criticalFixes} empty="No critical errors detected." accent="text-[#ad5b2b]" />
              <FindingPanel icon={<MapPin size={18} />} title="UK Local Opportunities" items={localOps} empty="No local opportunities found." accent="text-[#6f8fa3]" />
              <QuickWinsPanel items={quickWins} />
              <FindingPanel icon={<Search size={18} />} title="Geo-AI Overview Gaps" items={geoGaps} empty="No AI overview gaps found." accent="text-[#ad5b2b]" />
            </div>

            <div className="break-inside-avoid rounded-[1.15rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
              <div className="mb-6 flex flex-col justify-between gap-4 border-b border-black/8 pb-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ad5b2b]">On-page architecture</p>
                  <h3 className="mt-2 font-serif text-3xl font-medium text-[#2f3438]">Indexable structure and metadata.</h3>
                </div>
                <div className="rounded-md border border-black/8 bg-[#f9f5ec] px-5 py-3 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/36">Word count</p>
                  <p className="font-serif text-4xl font-medium text-[#2f3438]">{content.word_count || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <MetaPanel label="Page Title" value={scrapedData.title} missing="No title tag found." />
                <MetaPanel label="Meta Description" value={scrapedData.meta_description} missing="No meta description found." />
                <div className="rounded-[0.9rem] border border-black/8 bg-[#f9f5ec] p-5 sm:col-span-2">
                  <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#ad5b2b]">Heading structure</p>
                  <div className="grid grid-cols-3 gap-3">
                    <HeadingCount label="H1" value={headings.h1_count || 0} warning={headings.h1_count === 0} />
                    <HeadingCount label="H2" value={headings.h2_count || 0} />
                    <HeadingCount label="H3" value={headings.h3_count || 0} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hide-on-print flex flex-col items-center justify-between gap-4 rounded-[1.15rem] border border-black/8 bg-[#f9f5ec] p-5 text-center sm:flex-row sm:text-left">
              <div>
                <h4 className="font-serif text-3xl font-medium text-[#2f3438]">Turn the audit into fixes.</h4>
                <p className="mt-1 text-sm font-semibold text-[#2f3438]/58">Klarai can review the report and prioritise the work that matters first.</p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <button onClick={() => setAuditComplete(false)} className="min-h-12 rounded-md border border-[#ad5b2b] px-5 text-sm font-black text-[#9b542a] transition hover:bg-white">
                  New Scan
                </button>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#2f3438] px-5 text-sm font-black text-white transition hover:bg-[#ad5b2b]">
                  Contact Klarai
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isAnalyzing && !auditComplete && (
        <section className="hide-on-print border-t border-black/8 bg-[#f4efe4] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#ad5b2b]">How it works</p>
              <h2 className="font-serif text-5xl font-medium leading-[0.98] text-[#2f3438] sm:text-7xl">Visibility is not a mystery report.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {methodSteps.map(([num, title, text]) => (
                <article key={title} className="rounded-[1.1rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                  <p className="mb-8 text-3xl font-black text-[#ad5b2b]">{num}</p>
                  <h3 className="font-serif text-3xl font-medium text-[#2f3438]">{title}</h3>
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-[#2f3438]/62">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {showEmailModal && (
        <div className="hide-on-print fixed inset-0 z-[100] flex items-center justify-center bg-[#151b1e]/72 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }} className="relative w-full max-w-md rounded-[1.15rem] border border-black/8 bg-[#f9f5ec] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
            <button onClick={() => setShowEmailModal(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-black/8 bg-white text-[#2f3438]/58 transition hover:text-[#ad5b2b]" aria-label="Close download form">
              <X size={16} />
            </button>
            <div className="mb-6">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-md bg-[#ad5b2b] text-white">
                <FileText size={20} />
              </div>
              <h3 className="font-serif text-4xl font-medium leading-tight text-[#2f3438]">Get the full audit report.</h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-[#2f3438]/58">Enter your email to download the PDF version of this audit.</p>
            </div>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label htmlFor="report-email" className="sr-only">Email address</label>
              <div className="flex min-h-14 items-center gap-3 rounded-md border border-black/10 bg-white px-4 focus-within:border-[#ad5b2b]">
                <Mail size={17} className="text-[#ad5b2b]" />
                <input id="report-email" type="email" required placeholder="name@company.com" value={userEmail} onChange={(event) => setUserEmail(event.target.value)} className="w-full bg-transparent text-sm font-bold text-[#2f3438] outline-none placeholder:text-black/28" />
              </div>
              <button type="submit" disabled={isSubmittingLead} className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-md bg-[#ad5b2b] px-6 text-sm font-black text-white transition hover:bg-[#8d4822] disabled:opacity-50">
                {isSubmittingLead ? "Preparing report" : "Unlock and Download PDF"}
                <Download size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body {
            background-color: #f4efe4 !important;
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

function ScorePanel({ icon, label, value, detail, dark = false }) {
  return (
    <div className={`rounded-[1.15rem] border p-6 ${dark ? "border-white/10 bg-[#151b1e] text-white" : "border-black/8 bg-white text-[#2f3438]"}`}>
      <div className={`mb-5 grid h-10 w-10 place-items-center rounded-md ${dark ? "bg-[#6f8fa3]/16 text-[#6f8fa3]" : "bg-[#ad5b2b]/10 text-[#ad5b2b]"}`}>{icon}</div>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${dark ? "text-white/40" : "text-black/36"}`}>{label}</p>
      <p className="mt-2 font-serif text-5xl font-medium">{value}</p>
      <p className={`mt-2 text-xs font-bold ${dark ? "text-white/42" : "text-[#2f3438]/50"}`}>{detail}</p>
    </div>
  );
}

function FindingPanel({ icon, title, items, empty, accent }) {
  return (
    <div className="break-inside-avoid rounded-[1.15rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
      <h3 className="mb-5 flex items-center gap-2 font-serif text-3xl font-medium text-[#2f3438]">
        <span className={accent}>{icon}</span>
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3 border-b border-black/6 pb-3 text-sm font-semibold leading-relaxed text-[#2f3438]/70 last:border-0 last:pb-0">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ad5b2b]" />
              {renderTextSafely(item)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-md border border-black/8 bg-[#f9f5ec] p-4 text-sm font-bold text-[#2f3438]/58">{empty}</div>
      )}
    </div>
  );
}

function QuickWinsPanel({ items }) {
  return (
    <div className="break-inside-avoid rounded-[1.15rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
      <h3 className="mb-5 flex items-center gap-2 font-serif text-3xl font-medium text-[#2f3438]">
        <Check size={18} className="text-[#6f8fa3]" />
        Quick Wins
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="rounded-[0.85rem] border border-black/8 bg-[#f9f5ec] p-4">
              <strong className="block text-sm leading-relaxed text-[#2f3438]">{renderTextSafely(item)}</strong>
              {(item?.effort || item?.expected_impact) && (
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.16em]">
                  {item.effort && <span className="rounded-full bg-white px-3 py-1 text-[#2f3438]/58">Effort: {item.effort}</span>}
                  {item.expected_impact && <span className="rounded-full bg-[#6f8fa3]/12 px-3 py-1 text-[#557488]">Impact: {item.expected_impact}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-md border border-black/8 bg-[#f9f5ec] p-4 text-sm font-bold text-[#2f3438]/58">No quick wins identified.</div>
      )}
    </div>
  );
}

function MetaPanel({ label, value, missing }) {
  return (
    <div className="rounded-[0.9rem] border border-black/8 bg-[#f9f5ec] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ad5b2b]">{label}</p>
        <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${value ? "bg-[#6f8fa3]/12 text-[#557488]" : "bg-[#ad5b2b]/12 text-[#9b542a]"}`}>{value ? "Found" : "Missing"}</span>
      </div>
      <p className={`break-words text-sm font-semibold leading-relaxed ${value ? "text-[#2f3438]/72" : "text-[#9b542a]"}`}>{value || missing}</p>
    </div>
  );
}

function HeadingCount({ label, value, warning = false }) {
  return (
    <div className={`rounded-md border p-4 text-center ${warning ? "border-[#ad5b2b]/35 bg-[#ad5b2b]/8" : "border-black/8 bg-white"}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/34">{label}</p>
      <p className={`mt-2 font-serif text-4xl font-medium ${warning ? "text-[#ad5b2b]" : "text-[#2f3438]"}`}>{value}</p>
    </div>
  );
}
