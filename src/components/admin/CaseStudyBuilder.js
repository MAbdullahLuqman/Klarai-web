"use client";

import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { slugify } from "@/lib/slugUtils";
import RoutePreviewCard from "./RoutePreviewCard";
import SlugLockControl from "./SlugLockControl";
import SeoChecklist from "./SeoChecklist";
import RelatedContentPicker from "./RelatedContentPicker";
import CaseStudySectionEditor from "./CaseStudySectionEditor";
import { addSlugToRegistry } from "@/lib/slugRegistry";

const emptyStudy = {
  title: "",
  slug: "",
  status: "draft",
  contentType: "case-study",
  canonicalPath: "",
  legacyPaths: [],
  clientName: "",
  clientWebsite: "",
  clientLogo: "",
  industry: "general",
  primaryService: "seo",
  secondaryServices: [],
  projectType: "",
  heroTitle: "",
  heroSubtitle: "",
  excerpt: "",
  heroImage: "",
  problem: "",
  goals: "",
  strategy: "",
  execution: "",
  results: "",
  metrics: [{ label: "", value: "", context: "" }],
  timeline: [{ phase: "", title: "", description: "" }],
  stack: "",
  screenshots: [{ title: "", imageUrl: "", alt: "", caption: "" }],
  testimonial: { quote: "", name: "", role: "", company: "", imageUrl: "" },
  body: "",
  faqs: [{ q: "", a: "" }],
  cta: { heading: "", sub: "", buttonText: "Start with a free audit", buttonHref: "/seoauditor" },
  relatedServices: [],
  relatedIndustries: [],
  relatedBlogPosts: [],
  relatedPortfolioItem: "",
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  noindex: false,
  showInSitemap: true,
};

const sanitizeStudy = (study) => {
  const slug = slugify(study.slug || study.title || study.heroTitle);
  return {
    ...study,
    title: study.title || study.heroTitle,
    slug,
    canonicalPath: study.canonicalPath || `/case-studies/${slug}`,
    contentType: "case-study",
    metrics: (study.metrics || []).filter((item) => item.label || item.value || item.context),
    timeline: (study.timeline || []).filter((item) => item.phase || item.title || item.description),
    screenshots: (study.screenshots || []).filter((item) => item.title || item.imageUrl),
    faqs: (study.faqs || []).filter((item) => item.q || item.a),
  };
};

function Repeater({ label, items, emptyItem, renderItem, onChange }) {
  const update = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
        <button type="button" onClick={() => onChange([...(items || []), emptyItem])} className="rounded-md bg-white/8 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">Add</button>
      </div>
      <div className="space-y-4">
        {(items || []).map((item, index) => (
          <div key={index} className="rounded-lg border border-white/10 bg-[#111] p-4">
            <div className="mb-3 flex justify-end">
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="text-[10px] font-black uppercase tracking-widest text-red-400">Remove</button>
            </div>
            {renderItem(item, index, update)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyBuilder({ collections = {}, initialStudyId = "", showList = true, onBack, onSaved }) {
  const [studies, setStudies] = useState({});
  const [activeId, setActiveId] = useState("");
  const [formData, setFormData] = useState(emptyStudy);
  const [isSaving, setIsSaving] = useState(false);

  const previewItem = useMemo(() => ({ collection: "case_studies", id: activeId, ...sanitizeStudy(formData), raw: formData }), [formData, activeId]);

  const loadStudies = async () => {
    const snap = await getDocs(collection(db, "case_studies"));
    const next = {};
    snap.forEach((item) => { next[item.id] = item.data(); });
    setStudies(next);
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const snap = await getDocs(collection(db, "case_studies"));
      if (cancelled) return;
      const next = {};
      snap.forEach((item) => { next[item.id] = item.data(); });
      setStudies(next);
      if (initialStudyId && next[initialStudyId]) {
        setActiveId(initialStudyId);
        setFormData({ ...emptyStudy, ...next[initialStudyId] });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [initialStudyId]);

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const updateNested = (key, field, value) => setFormData((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), [field]: value } }));

  const startNew = () => {
    setActiveId("");
    setFormData(emptyStudy);
  };

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const cleaned = sanitizeStudy(formData);
      const id = activeId || cleaned.slug;
      const previous = activeId ? studies[activeId] : null;
      const legacyPaths = [...(previous?.legacyPaths || cleaned.legacyPaths || [])];
      if (previous?.slug && previous.slug !== cleaned.slug) legacyPaths.push(`/case-studies/${previous.slug}`);
      await setDoc(doc(db, "case_studies", id), {
        ...(previous || {}),
        ...cleaned,
        legacyPaths: Array.from(new Set(legacyPaths.filter(Boolean))),
        updatedAt: serverTimestamp(),
        createdAt: previous?.createdAt || serverTimestamp(),
        publishedAt: cleaned.status === "published" ? previous?.publishedAt || serverTimestamp() : previous?.publishedAt || null,
      }, { merge: true });
      if (cleaned.status === "published" && cleaned.showInSitemap !== false && cleaned.noindex !== true) {
        await addSlugToRegistry("case_studies", cleaned.slug);
      }
      await loadStudies();
      setActiveId(id);
      onSaved?.();
      alert("Case study saved.");
    } catch (error) {
      alert(`Case study save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (!activeId || !window.confirm(`Delete case study ${activeId}? Prefer archive unless this is a mistake.`)) return;
    await deleteDoc(doc(db, "case_studies", activeId));
    await loadStudies();
    startNew();
    onSaved?.();
  };

  return (
    <div className={`grid gap-6 p-6 md:p-8 ${showList ? "xl:grid-cols-[260px_minmax(0,1fr)_340px]" : "xl:grid-cols-[minmax(0,1fr)_340px]"}`}>
      {showList && (
        <aside className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
          <button type="button" onClick={startNew} className="mb-4 w-full rounded-lg bg-[#3b82f6] px-4 py-3 text-xs font-black uppercase tracking-widest text-white">New Case Study</button>
          <div className="space-y-2">
            {Object.entries(studies).map(([id, study]) => (
              <button key={id} type="button" onClick={() => { setActiveId(id); setFormData({ ...emptyStudy, ...study }); }} className={`w-full rounded-lg px-3 py-2 text-left text-xs ${activeId === id ? "bg-white/12 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                <strong className="block truncate">{study.title || study.heroTitle || id}</strong>
                <span className="text-[10px] text-gray-500">{study.status || "draft"}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

      <form onSubmit={save} className="min-w-0 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6]">Case study builder</p>
              <h2 className="mt-1 text-2xl font-black text-white">{activeId ? `Editing ${activeId}` : "Create case study"}</h2>
            </div>
            <div className="flex gap-2">
              {onBack && <button type="button" onClick={onBack} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 hover:bg-white/5 hover:text-white">Back</button>}
              {activeId && <button type="button" onClick={remove} className="rounded-lg border border-red-400/40 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-300">Delete</button>}
              <button disabled={isSaving} className="rounded-lg bg-[#3b82f6] px-5 py-2 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50">{isSaving ? "Saving..." : "Save"}</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input value={formData.title} onChange={(e) => update("title", e.target.value)} placeholder="Internal title" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <select value={formData.status} onChange={(e) => update("status", e.target.value)} className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <input value={formData.industry} onChange={(e) => update("industry", e.target.value)} placeholder="Industry" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <select value={formData.primaryService} onChange={(e) => update("primaryService", e.target.value)} className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white">
              <option value="seo">SEO</option>
              <option value="aeo">AEO</option>
              <option value="web-development">Web Development</option>
            </select>
          </div>
        </div>

        <SlugLockControl slug={formData.slug} status={formData.status} onSlugChange={(value) => update("slug", value)} />

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Hero and SEO</p>
          <input value={formData.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} placeholder="Hero H1" className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <textarea value={formData.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} placeholder="Hero subtitle" rows={2} className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <textarea value={formData.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Excerpt" rows={2} className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <input value={formData.heroImage} onChange={(e) => update("heroImage", e.target.value)} placeholder="Hero image URL" className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={formData.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} placeholder="Meta title" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <input value={formData.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} placeholder="Meta description" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 grid gap-4 md:grid-cols-2">
          <input value={formData.clientName} onChange={(e) => update("clientName", e.target.value)} placeholder="Client name" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <input value={formData.clientWebsite} onChange={(e) => update("clientWebsite", e.target.value)} placeholder="Client website" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <input value={formData.clientLogo} onChange={(e) => update("clientLogo", e.target.value)} placeholder="Client logo URL" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <input value={formData.projectType} onChange={(e) => update("projectType", e.target.value)} placeholder="Project type" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
        </div>

        <CaseStudySectionEditor label="Problem" value={formData.problem} onChange={(value) => update("problem", value)} />
        <CaseStudySectionEditor label="Goals" value={formData.goals} onChange={(value) => update("goals", value)} />
        <CaseStudySectionEditor label="Strategy" value={formData.strategy} onChange={(value) => update("strategy", value)} />
        <CaseStudySectionEditor label="Execution" value={formData.execution} onChange={(value) => update("execution", value)} />
        <CaseStudySectionEditor label="Results" value={formData.results} onChange={(value) => update("results", value)} />
        <CaseStudySectionEditor label="Long body" value={formData.body} onChange={(value) => update("body", value)} rows={6} />

        <Repeater label="Metrics" items={formData.metrics || []} emptyItem={{ label: "", value: "", context: "" }} onChange={(value) => update("metrics", value)} renderItem={(item, index, updateItem) => (
          <div className="grid gap-3 md:grid-cols-3">
            <input value={item.label} onChange={(e) => updateItem(index, "label", e.target.value)} placeholder="Label" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <input value={item.value} onChange={(e) => updateItem(index, "value", e.target.value)} placeholder="Value" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <input value={item.context} onChange={(e) => updateItem(index, "context", e.target.value)} placeholder="Context" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
          </div>
        )} />

        <Repeater label="Timeline" items={formData.timeline || []} emptyItem={{ phase: "", title: "", description: "" }} onChange={(value) => update("timeline", value)} renderItem={(item, index, updateItem) => (
          <div className="grid gap-3">
            <input value={item.phase} onChange={(e) => updateItem(index, "phase", e.target.value)} placeholder="Phase" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <input value={item.title} onChange={(e) => updateItem(index, "title", e.target.value)} placeholder="Title" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <textarea value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} placeholder="Description" rows={2} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
          </div>
        )} />

        <Repeater label="Screenshots" items={formData.screenshots || []} emptyItem={{ title: "", imageUrl: "", alt: "", caption: "" }} onChange={(value) => update("screenshots", value)} renderItem={(item, index, updateItem) => (
          <div className="grid gap-3 md:grid-cols-2">
            <input value={item.title} onChange={(e) => updateItem(index, "title", e.target.value)} placeholder="Title" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <input value={item.imageUrl} onChange={(e) => updateItem(index, "imageUrl", e.target.value)} placeholder="Image URL" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <input value={item.alt} onChange={(e) => updateItem(index, "alt", e.target.value)} placeholder="Alt text" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
            <input value={item.caption} onChange={(e) => updateItem(index, "caption", e.target.value)} placeholder="Caption" className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
          </div>
        )} />

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Testimonial</p>
          <textarea value={formData.testimonial?.quote || ""} onChange={(e) => updateNested("testimonial", "quote", e.target.value)} placeholder="Quote" rows={3} className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={formData.testimonial?.name || ""} onChange={(e) => updateNested("testimonial", "name", e.target.value)} placeholder="Name" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <input value={formData.testimonial?.role || ""} onChange={(e) => updateNested("testimonial", "role", e.target.value)} placeholder="Role" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <input value={formData.testimonial?.company || ""} onChange={(e) => updateNested("testimonial", "company", e.target.value)} placeholder="Company" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <input value={formData.testimonial?.imageUrl || ""} onChange={(e) => updateNested("testimonial", "imageUrl", e.target.value)} placeholder="Image URL" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">CTA</p>
          <input value={formData.cta?.heading || ""} onChange={(e) => updateNested("cta", "heading", e.target.value)} placeholder="CTA heading" className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <textarea value={formData.cta?.sub || ""} onChange={(e) => updateNested("cta", "sub", e.target.value)} placeholder="CTA subtext" rows={2} className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={formData.cta?.buttonText || ""} onChange={(e) => updateNested("cta", "buttonText", e.target.value)} placeholder="Button text" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
            <input value={formData.cta?.buttonHref || ""} onChange={(e) => updateNested("cta", "buttonHref", e.target.value)} placeholder="Button URL" className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white" />
          </div>
        </div>

        <RelatedContentPicker collections={collections} allowedCollections={["pages", "industry_pages", "blog_posts"]} selected={[...(formData.relatedServices || []), ...(formData.relatedIndustries || []), ...(formData.relatedBlogPosts || [])]} onChange={(items) => {
          update("relatedServices", items.filter((item) => item.collection === "pages"));
          update("relatedIndustries", items.filter((item) => item.collection === "industry_pages"));
          update("relatedBlogPosts", items.filter((item) => item.collection === "blog_posts"));
        }} />
      </form>

      <aside className="space-y-5">
        <RoutePreviewCard path={`/case-studies/${formData.slug || slugify(formData.title || formData.heroTitle)}`} status={formData.status} />
        <SeoChecklist item={previewItem} />
      </aside>
    </div>
  );
}
