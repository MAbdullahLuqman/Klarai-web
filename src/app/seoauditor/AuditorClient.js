"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardPaste,
  Download,
  FileText,
  Gauge,
  Globe,
  Link2,
  Loader2,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

const CATEGORY_META = {
  seo: {
    label: "SEO",
    title: "Traditional SEO",
    color: "#6f8fa3",
    icon: Search,
    blurb: "Crawlability, metadata and structure for classic search visibility.",
  },
  aeo: {
    label: "AEO",
    title: "Answer Engine Optimisation",
    color: "#ad5b2b",
    icon: Bot,
    blurb: "Question-led answers, schema and snippet-ready formatting.",
  },
  geo: {
    label: "GEO",
    title: "Generative Engine Optimisation",
    color: "#2f3438",
    icon: Sparkles,
    blurb: "Depth, entities and evidence that help AI systems cite the page.",
  },
};

const STATUS_META = {
  pass: { label: "Pass", icon: CheckCircle2, tone: "text-[#557488]", ring: "border-[#6f8fa3]/30 bg-[#6f8fa3]/10" },
  warning: { label: "Warning", icon: AlertTriangle, tone: "text-[#ad5b2b]", ring: "border-[#ad5b2b]/30 bg-[#ad5b2b]/10" },
  error: { label: "Critical", icon: XCircle, tone: "text-red-700", ring: "border-red-700/25 bg-red-700/10" },
};

const questionWords = ["who", "what", "where", "when", "why", "how", "which", "can", "does", "do", "is", "are", "should", "will"];
const transitions = ["because", "therefore", "for example", "however", "in addition", "according to", "specifically", "in summary", "notably"];
const authorityHosts = ["wikipedia.org", "nih.gov", "who.int", "reuters.com", "bbc.co.uk", "bbc.com", "schema.org", "google.com", "developer.mozilla.org", "w3.org", "gov.uk"];

function AuditorFallback() {
  return (
    <div className="min-h-screen bg-[#f4efe4] px-5 pt-36 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#2f3438]/46">
      Loading audit console
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
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState(defaultUrl);
  const [html, setHtml] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasTriggeredAuto = useRef(false);
  const reportRef = useRef(null);

  const submitAudit = useCallback(async (event, overrideUrl = "") => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const targetUrl = overrideUrl || url;
      const data = mode === "html"
        ? runLocalAudit(html, { url: targetUrl, keyword })
        : await runUrlAudit(targetUrl, keyword);
      setResult(data);
      setFilter("all");
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (auditError) {
      setError(auditError?.message || "Something went wrong while auditing that page.");
    } finally {
      setLoading(false);
    }
  }, [html, keyword, mode, url]);

  useEffect(() => {
    if (autoStart && defaultUrl && !hasTriggeredAuto.current) {
      hasTriggeredAuto.current = true;
      submitAudit(null, defaultUrl);
    }
  }, [autoStart, defaultUrl, submitAudit]);

  const visibleChecks = useMemo(() => {
    if (!result) return [];
    if (filter === "all") return result.checks;
    return result.checks.filter((check) => check.status === filter);
  }, [filter, result]);

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      <section className="hide-on-print relative overflow-hidden px-5 pb-16 pt-34 sm:px-8 lg:px-12 lg:pt-40">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(180deg,#151b1e_0%,#2f3438_62%,rgba(47,52,56,0)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[url('/images/hero-mountain.jpg')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="relative mx-auto max-w-[1240px]">
          <header className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e0b48b] backdrop-blur-md">
                <Activity size={14} />
                SEO AEO GEO audit console
              </p>
              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] text-white sm:text-7xl">
                Audit any page for search and AI visibility.
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/68">
                Paste a URL or raw HTML and get a rule-based read on classic SEO, answer-engine readiness and generative-engine citability.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {Object.values(CATEGORY_META).map((category) => (
                <span key={category.label} className="rounded-md border border-white/16 bg-white/10 px-3 py-2 text-xs font-black tracking-widest text-white/82">
                  {category.label}
                </span>
              ))}
            </div>
          </header>

          <form onSubmit={submitAudit} className="mt-8 rounded-[1.15rem] border border-white/16 bg-[#f9f5ec] p-4 shadow-[0_30px_90px_rgba(14,20,24,0.24)] sm:p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "url", label: "Fetch URL", icon: Globe },
                { id: "html", label: "Paste HTML", icon: ClipboardPaste },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMode(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${active ? "bg-[#ad5b2b] text-white" : "border border-black/10 bg-white text-[#2f3438]/58 hover:text-[#2f3438]"}`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
              {mode === "url" ? (
                <label>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/38">Target URL</span>
                  <input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="example.co.uk"
                    className="mt-2 min-h-14 w-full rounded-md border border-black/10 bg-white px-4 text-base font-bold outline-none transition placeholder:text-black/28 focus:border-[#ad5b2b]"
                  />
                </label>
              ) : (
                <label>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/38">Raw HTML</span>
                  <textarea
                    value={html}
                    onChange={(event) => setHtml(event.target.value)}
                    rows={8}
                    placeholder="<!doctype html><html><head><title>...</title></head><body>...</body></html>"
                    className="mt-2 w-full resize-y rounded-md border border-black/10 bg-white px-4 py-3 font-mono text-xs leading-relaxed outline-none transition placeholder:text-black/28 focus:border-[#ad5b2b]"
                  />
                </label>
              )}
              <div className="flex flex-col justify-between gap-4">
                <label>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/38">Primary keyword optional</span>
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="answer engine optimisation"
                    className="mt-2 min-h-14 w-full rounded-md border border-black/10 bg-white px-4 text-base font-bold outline-none transition placeholder:text-black/28 focus:border-[#ad5b2b]"
                  />
                </label>
                <button type="submit" disabled={loading} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-[#ad5b2b] px-6 text-sm font-black text-white transition hover:bg-[#8d4822] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? <Loader2 size={17} className="animate-spin" /> : <Gauge size={17} />}
                  {loading ? "Auditing" : "Run audit"}
                </button>
              </div>
            </div>

            {error && (
              <p className="mt-4 flex items-start gap-2 rounded-md border border-red-700/25 bg-red-700/10 px-4 py-3 text-sm font-bold text-red-800">
                <XCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

      {!result && !loading && (
        <section className="hide-on-print px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-3">
            {Object.values(CATEGORY_META).map((category) => {
              const Icon = category.icon;
              return (
                <article key={category.label} className="rounded-[1.1rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                  <Icon size={18} style={{ color: category.color }} />
                  <h2 className="mt-4 text-xl font-black tracking-tight">{category.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/54">{category.blurb}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {result && (
        <section ref={reportRef} className="px-5 pb-24 sm:px-8 lg:px-12">
          <div id="seo-audit-report" className="mx-auto max-w-[1240px] space-y-5">
            <div className="hide-on-print flex justify-end">
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-black text-[#2f3438] transition hover:border-[#ad5b2b]/40">
                <Download size={16} />
                Download PDF
              </button>
            </div>

            <section className="rounded-[1.15rem] border border-black/8 bg-[#151b1e] p-6 text-white shadow-[0_30px_90px_rgba(14,20,24,0.18)]">
              <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
                <div className="flex items-center gap-5 lg:border-r lg:border-white/10 lg:pr-8">
                  <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full border-4 border-[#ad5b2b]/35 bg-white/6">
                    <div className="text-center">
                      <span className="font-serif text-5xl font-medium leading-none">{result.scores.overall}</span>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-white/36">overall</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-serif text-3xl font-medium">{bandLabel(result.scores.overall)}</p>
                    <p className="mt-2 max-w-[18rem] break-words text-xs font-semibold text-white/52">{result.url || "Pasted HTML document"}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                      <span className="rounded-md border border-[#6f8fa3]/35 bg-[#6f8fa3]/14 px-2 py-1 text-[#a8c2d1]">{result.counts.pass} pass</span>
                      <span className="rounded-md border border-[#e0b48b]/35 bg-[#e0b48b]/14 px-2 py-1 text-[#e0b48b]">{result.counts.warning} warn</span>
                      <span className="rounded-md border border-red-300/35 bg-red-500/12 px-2 py-1 text-red-200">{result.counts.error} critical</span>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                  {result.categories.map((category) => {
                    const meta = CATEGORY_META[category.key];
                    return <ScoreGauge key={category.key} score={category.score} color={meta.color} label={meta.label} sublabel={meta.blurb} />;
                  })}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <StatTile icon={FileText} label="Words" value={result.stats.words} />
              <StatTile icon={BarChart3} label="Reading ease" value={result.stats.readingEase} />
              <StatTile icon={Activity} label="Grade" value={result.stats.gradeLevel} />
              <StatTile icon={Activity} label="Avg sentence" value={result.stats.avgSentence} />
              <StatTile icon={FileText} label="Headings" value={result.stats.headings} />
              <StatTile icon={Link2} label="Links" value={result.stats.links} />
            </section>

            <section className="rounded-[1.15rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
              <div className="space-y-5">
                {result.categories.map((category) => {
                  const meta = CATEGORY_META[category.key];
                  const Icon = meta.icon;
                  return (
                    <div key={category.key}>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="inline-flex items-center gap-2 font-black">
                          <Icon size={16} style={{ color: meta.color }} />
                          {meta.title}
                        </span>
                        <span className="font-black" style={{ color: meta.color }}>{category.score}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/8">
                        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${category.score}%`, backgroundColor: meta.color }} />
                      </div>
                    </div>
                  );
                })}
                {result.stats.schemaTypes.length > 0 && (
                  <p className="text-xs font-bold text-black/46">Schema detected: {result.stats.schemaTypes.join(", ")}</p>
                )}
              </div>
            </section>

            <section className="rounded-[1.15rem] border border-black/8 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-serif text-3xl font-medium">Actionable checklist</h2>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    ["all", `All (${result.checks.length})`],
                    ["error", `Critical (${result.counts.error})`],
                    ["warning", `Warnings (${result.counts.warning})`],
                    ["pass", `Passes (${result.counts.pass})`],
                  ].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setFilter(id)} className={`rounded-md px-3 py-2 font-black transition ${filter === id ? "bg-[#ad5b2b] text-white" : "border border-black/10 bg-[#f9f5ec] text-black/52 hover:text-black"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {visibleChecks.length > 0 ? (
                <ul className="mt-4">
                  {visibleChecks.map((check) => <CheckRow key={`${check.category}-${check.id}`} check={check} />)}
                </ul>
              ) : (
                <p className="mt-4 rounded-md bg-[#f9f5ec] p-4 text-sm font-bold text-black/54">Nothing in this bucket.</p>
              )}
            </section>

            <section className="hide-on-print flex flex-col justify-between gap-4 rounded-[1.15rem] border border-black/8 bg-[#f9f5ec] p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-3xl font-medium">Turn the audit into fixes.</h2>
                <p className="mt-1 text-sm font-semibold text-black/54">Klarai can prioritise the work that moves visibility first.</p>
              </div>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#2f3438] px-5 text-sm font-black text-white transition hover:bg-[#ad5b2b]">
                Contact Klarai
              </Link>
            </section>
          </div>
        </section>
      )}

      <style jsx global>{`
        @media print {
          body {
            background: #f4efe4 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .hide-on-print {
            display: none !important;
          }
          #seo-audit-report {
            margin: 0 !important;
            max-width: none !important;
          }
          @page {
            margin: 15mm;
            size: A4 portrait;
          }
        }
      `}</style>
    </main>
  );
}

async function runUrlAudit(inputUrl, keyword) {
  const urls = auditUrlCandidates(inputUrl);
  let lastError;

  for (const targetUrl of urls) {
    try {
      const data = await fetchAuditHtml(targetUrl);
      return runLocalAudit(data.html, { url: data.url || targetUrl, keyword });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Could not audit that URL.");
}

async function fetchAuditHtml(targetUrl) {
  let response;
  try {
    response = await fetch("/api/seoaudit", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: targetUrl }),
    });
  } catch {
    throw new Error("Could not reach the audit API. Restart the dev server or redeploy the site so /api/seoaudit is available.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `Audit service returned ${response.status}.`);
  return data;
}

function runLocalAudit(inputHtml, options = {}) {
  if (inputHtml.trim().length < 30) throw new Error("Paste some HTML to audit.");
  const doc = new DOMParser().parseFromString(inputHtml, "text/html");
  const text = bodyText(doc);
  const keyword = options.keyword || "";
  const baseUrl = options.url || "";
  const seo = auditSeo(doc, { text, keyword, baseUrl });
  const aeo = auditAeo(doc, { text });
  const geo = auditGeo(doc, { text, baseUrl });
  const seoScore = scoreOf(seo);
  const aeoScore = scoreOf(aeo);
  const geoScore = scoreOf(geo);
  const checks = [
    ...seo.map((check) => ({ ...check, category: "SEO" })),
    ...aeo.map((check) => ({ ...check, category: "AEO" })),
    ...geo.map((check) => ({ ...check, category: "GEO" })),
  ];
  const fk = fleschKincaid(text);
  return {
    url: baseUrl || null,
    keyword,
    scores: { overall: Math.round(seoScore * 0.34 + aeoScore * 0.33 + geoScore * 0.33), seo: seoScore, aeo: aeoScore, geo: geoScore },
    categories: [
      { key: "seo", label: "Traditional SEO", score: seoScore },
      { key: "aeo", label: "Answer Engine (AEO)", score: aeoScore },
      { key: "geo", label: "Generative Engine (GEO)", score: geoScore },
    ],
    counts: countStatuses(checks),
    stats: {
      words: words(text).length,
      readingEase: fk.ease,
      gradeLevel: fk.grade,
      avgSentence: fk.avgSentence,
      headings: queryAll(doc, "h1,h2,h3,h4,h5,h6").length,
      links: queryAll(doc, "a[href]").length,
      schemaTypes: schemaTypes(doc),
    },
    checks,
  };
}

function auditSeo(doc, ctx) {
  const title = textOfNode(doc.querySelector("title"));
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
  const h1s = queryAll(doc, "h1");
  const headings = queryAll(doc, "h1,h2,h3,h4,h5,h6").map((node) => Number(node.tagName.slice(1)));
  const skipped = headings.some((level, index) => index > 0 && level - headings[index - 1] > 1);
  const images = queryAll(doc, "img");
  const missingAlt = images.filter((img) => !img.getAttribute("alt")?.trim()).length;
  const links = queryAll(doc, "a[href]").map((node) => node.getAttribute("href") || "");
  const { internal, external } = linkCounts(links, ctx.baseUrl);
  const keyword = ctx.keyword.trim().toLowerCase();
  const checks = [
    makeCheck("title", "Meta title", !title ? "error" : title.length < 30 || title.length > 65 ? "warning" : "pass", title ? `${title.length} characters: ${title}` : "No title tag found.", title && title.length >= 30 && title.length <= 65 ? null : "Use one unique 50-60 character title.", 2),
    makeCheck("description", "Meta description", !desc ? "error" : desc.length < 110 || desc.length > 165 ? "warning" : "pass", desc ? `${desc.length} characters.` : "Missing meta description.", desc && desc.length >= 110 && desc.length <= 165 ? null : "Write a 140-160 character summary.", 2),
    makeCheck("h1", "Single H1", h1s.length === 1 ? "pass" : h1s.length === 0 ? "error" : "warning", h1s.length ? `${h1s.length} H1 tag(s).` : "No H1 found.", h1s.length === 1 ? null : "Use exactly one descriptive H1.", 2),
    makeCheck("hierarchy", "Heading hierarchy", headings.length && !skipped ? "pass" : headings.length ? "warning" : "error", headings.length ? `${headings.length} headings detected.` : "No headings detected.", headings.length && !skipped ? null : "Do not skip heading levels.", 2),
    makeCheck("canonical", "Canonical tag", doc.querySelector('link[rel="canonical"]') ? "pass" : "warning", doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "No canonical link element.", doc.querySelector('link[rel="canonical"]') ? null : "Add a canonical URL."),
    makeCheck("alt", "Image alt text", images.length === 0 ? "warning" : missingAlt === 0 ? "pass" : missingAlt / images.length > 0.3 ? "error" : "warning", images.length ? `${missingAlt} of ${images.length} images missing alt text.` : "No images found.", missingAlt ? "Add concise alt text to meaningful images." : null),
    makeCheck("links", "Internal and outbound links", internal === 0 ? "error" : external === 0 ? "warning" : "pass", `${internal} internal, ${external} outbound.`, internal === 0 ? "Add internal links." : external === 0 ? "Add credible outbound citations." : null),
    makeCheck("viewport", "Responsive viewport", doc.querySelector('meta[name="viewport"]') ? "pass" : "error", doc.querySelector('meta[name="viewport"]')?.getAttribute("content") || "Missing viewport meta.", doc.querySelector('meta[name="viewport"]') ? null : "Add a responsive viewport meta tag."),
  ];
  if (keyword) {
    const inTitle = title.toLowerCase().includes(keyword);
    const inDesc = desc.toLowerCase().includes(keyword);
    const density = ((ctx.text.toLowerCase().split(keyword).length - 1) / Math.max(1, words(ctx.text).length / 100));
    checks.push(makeCheck("kw-meta", "Keyword in metadata", inTitle && inDesc ? "pass" : inTitle || inDesc ? "warning" : "error", `Title: ${inTitle ? "found" : "missing"}, description: ${inDesc ? "found" : "missing"}.`, inTitle && inDesc ? null : "Use the primary keyword naturally in both."));
    checks.push(makeCheck("kw-density", "Keyword density", density === 0 ? "error" : density > 3.5 ? "warning" : "pass", `${density.toFixed(2)}% of body copy.`, density === 0 ? "Mention the keyword in body copy." : density > 3.5 ? "Reduce repetition." : null));
  }
  return checks;
}

function auditAeo(doc, ctx) {
  const types = schemaTypes(doc);
  const questionHeadings = queryAll(doc, "h2,h3").filter((node) => isQuestion(textOfNode(node)));
  const ready = questionHeadings.filter((node) => {
    const next = nextElement(node);
    if (!next) return false;
    if (["UL", "OL"].includes(next.tagName)) return true;
    if (next.tagName === "P") {
      const count = words(textOfNode(next)).length;
      return count >= 30 && count <= 75;
    }
    return false;
  });
  const text = ctx.text.toLowerCase();
  const qCount = questionWords.reduce((total, word) => total + (text.match(new RegExp(`\\b${word}\\b`, "g")) || []).length, 0);
  const qDensity = (qCount / Math.max(1, words(ctx.text).length)) * 100;
  const lists = queryAll(doc, "ul,ol").length;
  const tables = queryAll(doc, "table").length;
  const firstParagraph = queryAll(doc, "p").map(textOfNode).find((value) => words(value).length > 15) || "";
  const answerSchema = types.some((type) => ["FAQPage", "HowTo", "QAPage", "Question"].includes(type));
  return [
    makeCheck("schema", "JSON-LD structured data", types.length ? "pass" : "error", types.length ? `Detected: ${types.join(", ")}.` : "No JSON-LD blocks found.", types.length ? null : "Add Article, FAQPage, HowTo or QAPage schema.", 3),
    makeCheck("answer-schema", "Answer-oriented schema", answerSchema ? "pass" : types.length ? "warning" : "error", answerSchema ? "FAQ/HowTo/Q&A style schema detected." : "No FAQ, HowTo or QAPage schema.", answerSchema ? null : "Mark up Q&A blocks with answer-oriented schema.", 3),
    makeCheck("snippet", "Featured-snippet ready answers", questionHeadings.length === 0 ? "error" : ready.length / questionHeadings.length >= 0.6 ? "pass" : "warning", questionHeadings.length ? `${ready.length} of ${questionHeadings.length} question headings are snippet-ready.` : "No question-formatted H2/H3 headings.", questionHeadings.length ? "Follow questions with a 40-60 word answer or short list." : "Rewrite key subheadings as user questions.", 3),
    makeCheck("question-density", "Conversational question density", qDensity >= 1.2 ? "pass" : qDensity >= 0.5 ? "warning" : "error", `${qCount} question words (${qDensity.toFixed(2)}%).`, qDensity >= 1.2 ? null : "Add who, what, why and how phrasing.", 2),
    makeCheck("extractable", "Extractable formatting", lists + tables >= 2 ? "pass" : lists + tables === 1 ? "warning" : "error", `${lists} lists, ${tables} tables.`, lists + tables >= 2 ? null : "Add lists, steps or comparison tables."),
    makeCheck("direct-answer", "Direct answer up front", firstParagraph && words(firstParagraph).length <= 90 ? "pass" : firstParagraph ? "warning" : "error", firstParagraph ? `Opening paragraph is ${words(firstParagraph).length} words.` : "No substantive opening paragraph.", firstParagraph && words(firstParagraph).length <= 90 ? null : "Answer the core question in the first 40-60 words.", 2),
  ];
}

function auditGeo(doc, ctx) {
  const wordCount = words(ctx.text).length;
  const paragraphs = queryAll(doc, "p").map((node) => words(textOfNode(node)).length).filter(Boolean);
  const avgPara = paragraphs.length ? paragraphs.reduce((sum, value) => sum + value, 0) / paragraphs.length : 0;
  const longParas = paragraphs.filter((count) => count > 120).length;
  const fk = fleschKincaid(ctx.text);
  const lower = ctx.text.toLowerCase();
  const transitionCount = transitions.reduce((total, item) => total + (lower.split(item).length - 1), 0);
  const entities = new Set((ctx.text.match(/\b[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,})*/g) || []).filter((entity) => entity.length > 3));
  const stats = (ctx.text.match(/\b\d+(?:[.,]\d+)?\s?(?:%|percent|million|billion|users|years|x)\b/gi) || []).length;
  const authLinks = authorityLinkCount(queryAll(doc, "a[href]").map((node) => node.getAttribute("href") || ""), ctx.baseUrl);
  return [
    makeCheck("depth", "Content depth", wordCount >= 1200 ? "pass" : wordCount >= 600 ? "warning" : "error", `${wordCount} words of body copy.`, wordCount >= 1200 ? null : "Expand toward 1,200+ words of useful detail.", 3),
    makeCheck("paragraphs", "Paragraph chunking", paragraphs.length && avgPara <= 90 && longParas === 0 ? "pass" : paragraphs.length ? "warning" : "error", paragraphs.length ? `${paragraphs.length} paragraphs, ${Math.round(avgPara)} words average.` : "No paragraphs detected.", paragraphs.length && avgPara <= 90 && longParas === 0 ? null : "Keep paragraphs to 40-80 words.", 2),
    makeCheck("readability", "Readability", fk.ease >= 50 && fk.ease <= 80 ? "pass" : fk.ease >= 35 ? "warning" : "error", `Reading ease ${fk.ease}, grade ${fk.grade}.`, fk.ease >= 50 && fk.ease <= 80 ? null : "Shorten sentences and simplify dense copy.", 2),
    makeCheck("semantic", "Semantic connectives", transitionCount >= 8 ? "pass" : transitionCount >= 3 ? "warning" : "error", `${transitionCount} reasoning connective(s).`, transitionCount >= 8 ? null : "Use because, therefore, for example and similar connective language.", 2),
    makeCheck("entities", "Named entity coverage", entities.size >= 15 ? "pass" : entities.size >= 6 ? "warning" : "error", `${entities.size} distinct named entities.`, entities.size >= 15 ? null : "Name products, people, places and standards explicitly.", 2),
    makeCheck("evidence", "Statistics and evidence", stats >= 5 ? "pass" : stats >= 2 ? "warning" : "error", `${stats} quantified data point(s).`, stats >= 5 ? null : "Add concrete numbers, dates and measurable claims.", 2),
    makeCheck("authority", "Authoritative citations", authLinks >= 3 ? "pass" : authLinks >= 1 ? "warning" : "error", `${authLinks} recognised authority citation(s).`, authLinks >= 3 ? null : "Cite primary sources, .gov/.edu pages or recognised publishers.", 3),
    makeCheck("summary", "Summary block", /\b(tl;dr|key takeaways?|in summary|conclusion|bottom line)\b/i.test(ctx.text) ? "pass" : "warning", /\b(tl;dr|key takeaways?|in summary|conclusion|bottom line)\b/i.test(ctx.text) ? "Summary section detected." : "No explicit summary section.", "Add a key takeaways block."),
  ];
}

function ScoreGauge({ score, color, label, sublabel }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="9" className="stroke-white/10" />
          <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="9" strokeLinecap="round" stroke={color} strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl font-medium leading-none">{score}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/36">/100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-widest" style={{ color }}>{label}</p>
        <p className="mt-1 text-sm font-bold text-white">{bandLabel(score)}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/46">{sublabel}</p>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[0.9rem] border border-black/8 bg-white p-4 shadow-[0_16px_50px_rgba(0,0,0,0.035)]">
      <div className="flex items-center gap-2 text-black/42">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-2 font-serif text-3xl font-medium text-[#2f3438]">{value}</p>
    </div>
  );
}

function CheckRow({ check }) {
  const meta = STATUS_META[check.status] || STATUS_META.warning;
  const Icon = meta.icon;
  return (
    <li className="flex gap-3 border-t border-black/8 py-4 first:border-t-0">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.tone}`} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-black text-[#2f3438]">{check.label}</p>
          <span className={`rounded-sm border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${meta.ring}`}>
            {check.category}
          </span>
        </div>
        <p className="mt-1 break-words text-sm font-medium leading-relaxed text-black/56">{check.message}</p>
        {check.recommendation && (
          <p className="mt-2 rounded-md border-l-2 border-[#ad5b2b] bg-[#ad5b2b]/6 px-3 py-2 text-xs font-bold text-[#2f3438]/78">
            {check.recommendation}
          </p>
        )}
      </div>
    </li>
  );
}

function makeCheck(id, label, status, message, recommendation, weight = 1, category) {
  return { id, label, status, message, recommendation, weight, ...(category ? { category } : {}) };
}

function scoreOf(checks) {
  const total = checks.reduce((sum, check) => sum + check.weight, 0) || 1;
  const won = checks.reduce((sum, check) => sum + check.weight * (check.status === "pass" ? 1 : check.status === "warning" ? 0.5 : 0), 0);
  return Math.round((won / total) * 100);
}

function countStatuses(checks) {
  return {
    pass: checks.filter((check) => check.status === "pass").length,
    warning: checks.filter((check) => check.status === "warning").length,
    error: checks.filter((check) => check.status === "error").length,
  };
}

function auditUrlCandidates(inputUrl) {
  const trimmed = String(inputUrl || "").trim();
  if (!trimmed) throw new Error("Enter a URL to audit.");
  if (/^https?:\/\//i.test(trimmed)) return [trimmed];
  return [`https://${trimmed}`, `http://${trimmed}`];
}

function textOfNode(node) {
  return node?.textContent?.replace(/\s+/g, " ").trim() || "";
}

function bodyText(doc) {
  const clone = doc.cloneNode(true);
  queryAll(clone, "script,style,noscript,svg,iframe").forEach((node) => node.remove());
  return textOfNode(clone.body || clone.documentElement);
}

function queryAll(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

function nextElement(node) {
  let next = node.nextElementSibling;
  while (next && !textOfNode(next)) next = next.nextElementSibling;
  return next;
}

function words(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean);
}

function isQuestion(text) {
  return /\?/.test(text) || /^(who|what|where|when|why|how|which|can|could|should|would|will|does|do|did|is|are|was|were|has|have)\b/i.test(text.trim());
}

function schemaTypes(doc) {
  const types = [];
  queryAll(doc, 'script[type="application/ld+json"]').forEach((script) => {
    try {
      const parsed = JSON.parse(script.textContent || "{}");
      const nodes = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
      nodes.forEach((node) => {
        const type = node?.["@type"];
        if (Array.isArray(type)) types.push(...type);
        else if (type) types.push(type);
      });
    } catch {
      types.push("Invalid JSON-LD");
    }
  });
  return Array.from(new Set(types));
}

function linkCounts(links, baseUrl) {
  const pageHost = hostOf(baseUrl);
  return links.reduce((counts, href) => {
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return counts;
    const host = hostOf(href, baseUrl);
    if (!host || href.startsWith("/") || (pageHost && host === pageHost)) counts.internal += 1;
    else counts.external += 1;
    return counts;
  }, { internal: 0, external: 0 });
}

function authorityLinkCount(links, baseUrl) {
  const pageHost = hostOf(baseUrl);
  return new Set(links.map((href) => hostOf(href, baseUrl)).filter((host) => host && host !== pageHost && authorityHosts.some((authority) => host === authority || host.endsWith(`.${authority}`)))).size;
}

function hostOf(href, baseUrl = "https://example.com") {
  try {
    return new URL(href, baseUrl || "https://example.com").hostname.toLowerCase();
  } catch {
    return "";
  }
}

function fleschKincaid(text) {
  const wordList = words(text);
  const sentenceList = String(text || "").replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter((sentence) => sentence.trim().length > 1);
  if (!wordList.length || !sentenceList.length) return { ease: 0, grade: 0, avgSentence: 0 };
  const syllableCount = wordList.reduce((sum, word) => sum + syllables(word), 0);
  const wordsPerSentence = wordList.length / sentenceList.length;
  const syllablesPerWord = syllableCount / wordList.length;
  return {
    ease: Math.round((206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord) * 10) / 10,
    grade: Math.round((0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59) * 10) / 10,
    avgSentence: Math.round(wordsPerSentence * 10) / 10,
  };
}

function syllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;
  const matched = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return matched ? matched.length : 1;
}

function bandLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Solid";
  if (score >= 50) return "Needs work";
  return "Critical";
}
