"use client";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmptyState from '@/components/admin/EmptyState';
import PageHeader from '@/components/admin/PageHeader';

// Import the new Headless Notion-Style Editor
import TipTapEditor from '@/components/TipTapEditor';
import JsonUploader from '@/components/admin/JsonUploader';
import AdminShell from '@/components/admin/AdminShell';
import AdminDashboardView from '@/components/admin/AdminDashboard';
import ContentLibrary from '@/components/admin/ContentLibrary';
import InternalLinkStudio from '@/components/admin/InternalLinkStudio';
import CaseStudyManager from '@/components/admin/CaseStudyManager';
import SectionContentHub from '@/components/admin/SectionContentHub';
import AdminSettings from '@/components/admin/AdminSettings';
import DownloadAssetEditor from '@/components/admin/DownloadAssetEditor';
import JsonImportPanel from '@/components/admin/JsonImportPanel';
import SlugLockControl from '@/components/admin/SlugLockControl';
import RoutePreviewCard from '@/components/admin/RoutePreviewCard';
import SeoChecklist from '@/components/admin/SeoChecklist';
import { prepareBlogPostForSave } from '@/lib/adminContentAdapters';
import { INITIAL_HOME_CONTENT, SERVICE_URL_MAP, cleanAdminText } from '@/lib/adminConfig';
import { useAdminContent } from '@/hooks/useAdminContent';
import { addSlugToRegistry } from '@/lib/slugRegistry';

const BLOG_JSON_EXAMPLE = {
  slug: "local-seo-checklist-for-dentists",
  status: "draft",
  postType: "guide",
  primaryService: "seo",
  industry: "dentists",
  serviceTag: "seo",
  industryTag: "dentists",
  seoMeta: {
    title: "Local SEO Checklist for Dentists | Klarai",
    metaDescription: "A practical local SEO checklist for dental clinics that want better rankings, more calls, and more booked appointments.",
    canonicalUrl: "/blog/local-seo-checklist-for-dentists"
  },
  hero: {
    title: "Local SEO Checklist for Dentists",
    description: "Use this checklist to tighten your clinic visibility across Google, maps, service pages, reviews, and answer-engine results.",
    coverImage: "",
    publishDate: "2026-07-20",
    readTime: "7 Min"
  },
  tldr: [],
  mainQuestion: "What should a local SEO checklist for dentists include?",
  quickAnswer: "",
  intro: [
    "Most dental SEO failures are not caused by one missing tactic. They happen because the website, local profile, reviews, and content all tell Google slightly different stories.",
    "This checklist gives your team a repeatable structure for improving visibility without turning every page into generic SEO copy."
  ],
  sections: [
    {
      id: "google-business-profile",
      heading: "Google Business Profile Setup",
      contentType: "default",
      content: [
        "Your profile should list the exact clinic name, address, phone number, opening hours, services, and booking link.",
        "Add treatment-specific services and keep photo uploads current so the profile looks active and trustworthy."
      ],
      list: ["Use the same NAP details everywhere", "Add services for major treatments", "Reply to reviews with natural language"],
      subheadings: [
        {
          title: "Review Signals",
          content: ["Ask patients for specific reviews that mention the treatment, location, and outcome in natural language."]
        }
      ],
      comparison: null
    },
    {
      id: "service-pages",
      heading: "Build Treatment Pages That Match Search Intent",
      contentType: "default",
      content: [
        "Each important treatment needs a dedicated page with clear pricing guidance, FAQs, proof, and a booking path.",
        "Avoid thin duplicate pages. Each page should answer real patient questions before asking for the enquiry."
      ],
      list: [],
      subheadings: [],
      comparison: null
    }
  ],
  toolBlock: {
    title: "Free Dental SEO Audit",
    description: "Find the visibility gaps stopping your clinic from getting more calls.",
    ctaText: "Start Audit",
    ctaLink: "/seoauditor"
  },
  downloadAsset: {
    enabled: true,
    title: "Download the dental SEO checklist",
    description: "Use the same structure internally when reviewing clinic visibility.",
    buttonText: "Download checklist",
    fileUrl: "",
    leadGateEnabled: false,
    leadGateFormTitle: ""
  },
  internalLinks: [
    { anchor: "SEO services", href: "/services/seo-services" },
    { anchor: "SEO for dentists", href: "/industries/seo-for-dentists" },
    { anchor: "free SEO audit", href: "/seoauditor" }
  ],
  relatedCaseStudies: [],
  relatedPosts: [
    { title: "SEO for dentists", href: "/industries/seo-for-dentists" }
  ],
  relatedServices: ["seo"],
  faqs: [
    {
      question: "How long does dental SEO take?",
      answer: "Most clinics need three to six months to see stable movement, depending on competition, site quality, review strength, and local authority."
    },
    {
      question: "Do dentists need separate pages for every treatment?",
      answer: "Yes for commercial treatments. Separate pages help match patient intent and make it easier to rank for high-value searches."
    }
  ],
  authorInfo: {
    name: "Abdullah Luqman",
    role: "Lead Architect",
    bio: "Architecting digital systems for absolute scale.",
    profileUrl: "/about"
  }
};

const INDUSTRY_JSON_EXAMPLE = {
  slug: "seo-for-dentists",
  imageUrl: "",
  meta: {
    title: "SEO for Dentists in the UK | Klarai",
    description: "SEO strategy for dental clinics that need more local visibility, booked consultations, and treatment enquiries."
  },
  hero: {
    h1: "SEO for Dentists",
    sub: "A search visibility system for clinics that want more booked consultations from high-intent local searches.",
    cta: "Get my free audit",
    ctaHref: "/seoauditor"
  },
  tldr: {
    text: "Dental SEO helps clinics rank for treatment, emergency, and local intent searches by improving technical health, service pages, Google Business Profile strength, reviews, and trust signals."
  },
  sections: [
    {
      h2: "Why Dental Clinics Need Industry-Specific SEO",
      paras: [
        "Dental search is local, competitive, and trust-heavy. Patients compare clinics quickly, so rankings alone are not enough.",
        "Your SEO system needs treatment pages, local proof, clear conversion paths, and strong technical foundations."
      ],
      sub: [
        {
          h3: "Treatment Intent",
          text: "Pages should separate emergency dentistry, implants, Invisalign, whitening, and routine checkups so each searcher lands on a relevant answer."
        }
      ],
      list: ["Improve local rankings", "Increase booked consultations", "Build trust before the first call"]
    },
    {
      h2: "What Klarai Builds",
      paras: [
        "We build a structured visibility system around your services, locations, clinical proof, FAQs, reviews, and technical health."
      ],
      sub: [],
      list: ["Technical audit", "Service page architecture", "Internal links", "Schema and FAQ improvements"]
    }
  ],
  related: [
    { label: "Dental SEO checklist", href: "/blog/local-seo-checklist-for-dentists" },
    { label: "SEO services", href: "/services/seo-services" }
  ],
  internalLinks: [
    { anchor: "Dental SEO checklist", href: "/blog/local-seo-checklist-for-dentists" },
    { anchor: "SEO services", href: "/services/seo-services" },
    { anchor: "free SEO audit", href: "/seoauditor" }
  ],
  faqs: [
    {
      q: "Can SEO help a dental clinic get more bookings?",
      a: "Yes. SEO can increase qualified calls and bookings when service pages, local listings, reviews, and conversion paths are aligned."
    },
    {
      q: "What should a dental SEO campaign include?",
      a: "It should include technical SEO, Google Business Profile improvements, treatment pages, local content, internal links, schema, and reporting."
    }
  ],
  cta: {
    heading: "Find the gaps costing your clinic patients",
    sub: "Get a practical audit of your search visibility, local profile, and treatment pages.",
    primary: "Get my free audit",
    primaryHref: "/seoauditor",
    secondary: "Talk to us",
    secondaryHref: "/contact"
  }
};

const normalizeJsonLinks = (links = []) => (
  Array.isArray(links)
    ? links
        .map((link) => ({
          anchor: link.anchor || link.label || link.title || "",
          href: link.href || link.url || "",
        }))
        .filter((link) => link.anchor && link.href)
    : []
);

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const buildInternalLinkHtml = (link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.anchor)}</a>`;

const stripSimpleHtml = (value = "") => String(value).replace(/<[^>]*>/g, "").trim();

const normalizeTextArray = (value) => {
  if (Array.isArray(value)) return value.map(stripSimpleHtml).filter(Boolean);
  const text = stripSimpleHtml(value || "");
  return text ? [text] : [];
};

const normalizeIndustrySections = (sections = []) => (
  Array.isArray(sections)
    ? sections
        .map((section) => ({
          h2: stripSimpleHtml(section.h2 || section.heading || section.title || ""),
          paras: normalizeTextArray(section.paras || section.content),
          sub: Array.isArray(section.sub)
            ? section.sub.map((sub) => ({
                h3: stripSimpleHtml(sub.h3 || sub.title || ""),
                text: normalizeTextArray(sub.text || sub.content).join("\n\n"),
              })).filter((sub) => sub.h3 || sub.text)
            : Array.isArray(section.subheadings)
              ? section.subheadings.map((sub) => ({
                  h3: stripSimpleHtml(sub.title || sub.h3 || ""),
                  text: normalizeTextArray(sub.content || sub.text).join("\n\n"),
                })).filter((sub) => sub.h3 || sub.text)
              : [],
          list: normalizeTextArray(section.list),
        }))
        .filter((section) => section.h2 || section.paras.length || section.sub.length || section.list.length)
    : []
);

const normalizeIndustryFaqs = (faqs = []) => (
  Array.isArray(faqs)
    ? faqs
        .map((faq) => ({
          q: stripSimpleHtml(faq.q || faq.question || ""),
          a: stripSimpleHtml(faq.a || faq.answer || ""),
        }))
        .filter((faq) => faq.q || faq.a)
    : []
);

function applyBlogJsonImport(payload = {}) {
  const internalLinks = normalizeJsonLinks(payload.internalLinks);
  const questionCandidate = stripSimpleHtml(payload.mainQuestion || payload.question || payload.quickAnswer || "");
  const quickAnswer = questionCandidate.includes("?") ? questionCandidate : "";

  const existingSections = Array.isArray(payload.sections) ? payload.sections : [];
  const relatedReadingSection = {
    id: "related-reading",
    heading: "Related reading",
    contentType: "default",
    content: internalLinks.map((link) => buildInternalLinkHtml(link)),
    list: [],
    subheadings: [],
    comparison: null,
  };

  return {
    ...payload,
    quickAnswer,
    hero: {
      ...(payload.hero || {}),
      coverImage: payload.hero?.coverImage || "",
    },
    sections: internalLinks.length > 0 ? [...existingSections, relatedReadingSection] : existingSections,
    relatedPosts: [
      ...(Array.isArray(payload.relatedPosts) ? payload.relatedPosts : []),
      ...internalLinks.map((link) => ({ title: link.anchor, href: link.href })),
    ],
  };
}

function applyIndustryJsonImport(payload = {}) {
  const internalLinks = normalizeJsonLinks(payload.internalLinks);
  const related = [
    ...(Array.isArray(payload.related) ? payload.related : []),
    ...internalLinks.map((link) => ({ label: link.anchor, href: link.href })),
  ];

  return {
    ...payload,
    imageEnabled: Boolean(payload.imageUrl),
    imageUrl: payload.imageUrl || "",
    meta: payload.meta || {
      title: payload.seoMeta?.title || payload.metaTitle || "",
      description: payload.seoMeta?.metaDescription || payload.metaDescription || "",
    },
    hero: {
      ...(payload.hero || {}),
      h1: payload.hero?.h1 || payload.hero?.title || payload.h1 || "",
      sub: payload.hero?.sub || payload.hero?.description || payload.subheadline || "",
      image: "",
      cta: payload.hero?.cta || payload.toolBlock?.ctaText || "Get my free audit",
      ctaHref: payload.hero?.ctaHref || payload.toolBlock?.ctaLink || "/seoauditor",
    },
    tldr: payload.tldr && !Array.isArray(payload.tldr)
      ? payload.tldr
      : { text: normalizeTextArray(payload.tldr).join(" ") },
    sections: normalizeIndustrySections(payload.sections),
    related,
    faqs: normalizeIndustryFaqs(payload.faqs),
    cta: payload.cta || {
      heading: payload.toolBlock?.title || "",
      sub: payload.toolBlock?.description || "",
      primary: payload.toolBlock?.ctaText || "Get my free audit",
      primaryHref: payload.toolBlock?.ctaLink || "/seoauditor",
      secondary: "Talk to us",
      secondaryHref: "/contact",
    },
  };
}

// ==========================================
// COMPONENT: MAIN ADMIN DASHBOARD WRAPPER
// ==========================================
export default function AdminDashboard() {
  const {
    user,
    isAuthLoading,
    email,
    setEmail,
    password,
    setPassword,
    loginError,
    isLoggingIn,
    handleLogin,
    handleLogout,
    viewMode,
    setViewMode,
    isDataLoading,
    activeTab,
    setActiveTab,
    content,
    isSaving,
    handleNestedChange,
    handleFlatChange,
    handleSaveToFirebase,
    nichePagesList,
    blogPagesList,
    industryPagesList,
    staticPagesList,
    activeNicheId,
    activeBlogId,
    setActiveBlogId,
    activeIndustryId,
    setActiveIndustryId,
    activeStaticPageId,
    allAdminCollections,
    adminCounts,
    handleLibraryEdit,
    fetchAllLiveContent,
  } = useAdminContent();

  const serviceHubItems = useMemo(() => (
    Object.keys(SERVICE_URL_MAP).map((id) => {
      const page = content[id] || {};
      return {
        id,
        title: cleanAdminText(page.hero?.h1 || page.meta?.title || id.toUpperCase()),
        subtitle: cleanAdminText(page.hero?.sub || page.meta?.description || "Core service page"),
        path: SERVICE_URL_MAP[id],
        status: "published",
        type: "service",
      };
    })
  ), [content]);

  const industryHubItems = useMemo(() => (
    Object.entries(industryPagesList).map(([id, page]) => ({
      id,
      title: cleanAdminText(page.title || page.h1 || page.heroTitle || page.hero?.h1 || id),
      subtitle: cleanAdminText(page.excerpt || page.subtitle || page.metaDescription || page.intro),
      path: `/industries/${page.slug || id}`,
      status: page.status || (page.published === false ? "draft" : "published"),
      type: "industry",
      industry: page.industry || page.slug || id,
    }))
  ), [industryPagesList]);

  const blogHubItems = useMemo(() => (
    Object.entries(blogPagesList).map(([id, post]) => ({
      id,
      title: cleanAdminText(post.title || post.h1 || post.heroTitle || id),
      subtitle: cleanAdminText(post.excerpt || post.metaDescription || post.subtitle),
      path: `/blog/${post.slug || id}`,
      status: post.status || (post.published === false ? "draft" : "published"),
      type: post.postType || "standard",
      service: post.primaryService,
      industry: post.industry,
    }))
  ), [blogPagesList]);

  const renderSectionHeader = (sectionKey, title) => {
    const isVisible = content[activeTab][sectionKey]?.visible !== false;
    return (
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 bg-[#0a0a0a] rounded-t-2xl z-10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400">{title}</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <span className={`text-xs font-bold uppercase transition-colors ${isVisible ? 'text-[#10b981]' : 'text-red-500'}`}>
            {isVisible ? 'LIVE ON SITE' : 'HIDDEN ON SITE'}
          </span>
          <div className={`w-11 h-6 rounded-full transition-colors relative ${isVisible ? 'bg-[#10b981]' : 'bg-red-500/40'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isVisible ? 'translate-x-5' : ''}`}></div>
          </div>
          <input type="checkbox" className="hidden" checked={isVisible} onChange={(e) => handleNestedChange(sectionKey, 'visible', e.target.checked)} />
        </label>
      </div>
    );
  };

  if (isAuthLoading) return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
  if (!user) {
    return (
      <div className="admin-theme flex min-h-screen items-center justify-center bg-background px-4 font-sans selection:bg-primary selection:text-primary-foreground">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center"><img src="/klarailogo.webp" alt="Klarai Logo" className="h-8 object-contain" /></div>
            <CardTitle>Admin portal</CardTitle>
            <CardDescription>Sign in with your Firebase admin account to manage content.</CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin email</Label>
              <Input id="admin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {loginError && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{loginError}</p>}
            <Button type="submit" disabled={isLoggingIn} className="w-full">{isLoggingIn ? "Checking..." : "Access dashboard"}</Button>
          </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isDataLoading) return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading admin panel</CardTitle>
          <CardDescription>Fetching live Firebase content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <AdminShell activeView={viewMode} onChangeView={setViewMode} onLogout={handleLogout} counts={adminCounts}>
        
        {viewMode === "dashboard" && <AdminDashboardView counts={adminCounts} onNavigate={setViewMode} />}
        {viewMode === "contentLibrary" && <ContentLibrary collections={allAdminCollections} onEdit={handleLibraryEdit} />}
        {viewMode === "servicesHub" && (
          <SectionContentHub
            eyebrow="Fixed public routes"
            title="Services"
            description="Edit the existing service pages from one list. These routes are fixed to protect the live site; use Static Pages for new supporting service content."
            items={serviceHubItems}
            createLabel="New support page"
            onCreate={() => setViewMode("staticBuilder")}
            onEdit={(item) => {
              setActiveTab(item.id);
              setViewMode("core");
            }}
          />
        )}
        {viewMode === "industriesHub" && (
          <SectionContentHub
            eyebrow="Industry pages"
            title="Industries"
            description="Manage every industry page in one place, then open the existing industry builder only when you need to create or edit."
            items={industryHubItems}
            createLabel="New industry page"
            emptyText="No industry pages found."
            onCreate={() => setViewMode("industryBuilder")}
            onEdit={(item) => {
              setActiveIndustryId(item.id);
              setViewMode("industryEdit");
            }}
          />
        )}
        {viewMode === "blogGuidesHub" && (
          <SectionContentHub
            eyebrow="Blog and guide library"
            title="Blog & Guides"
            description="Guide-style posts stay inside blog_posts and continue to publish under /blog. Create or edit from this section without changing the public blog template."
            items={blogHubItems}
            createLabel="New blog or guide"
            emptyText="No blog posts found."
            onCreate={() => setViewMode("blogBuilder")}
            onEdit={(item) => {
              setActiveBlogId(item.id);
              setViewMode("blogEdit");
            }}
          />
        )}
        {viewMode === "leads" && <LeadsView />}
        {viewMode === "homepage" && <HomePageStoryEditor />}
        {viewMode === "caseStudies" && <CaseStudyManager collections={allAdminCollections} onSaved={fetchAllLiveContent} />}
        {viewMode === "internalLinks" && <InternalLinkStudio collections={allAdminCollections} />}
        {viewMode === "settings" && <AdminSettings />}
        {viewMode === "portfolioAdmin" && (
          <AdminNotice
            eyebrow="Portfolio"
            title="Portfolio editing"
            description="Portfolio content still uses the existing static page. Use Static Pages or JSON Import for data-backed content until a portfolio_items collection is added."
            actionHref="/portfolio"
            actionLabel="Preview portfolio"
          />
        )}
        {viewMode === "toolsAudit" && (
          <AdminNotice
            eyebrow="SEO / Metadata"
            title="Audit tools and metadata"
            description="The SEO audit experience is live on the public route. Captured leads and completed scans are managed in Leads / Forms."
            actionHref="/seoauditor"
            actionLabel="Open SEO auditor"
          />
        )}

        {viewMode === "builder" && <NicheBuilderView isEditing={false} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}
        {viewMode === "nicheEdit" && <NicheBuilderView key={activeNicheId} isEditing={true} pageId={activeNicheId} initialData={nichePagesList[activeNicheId]} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}

        {viewMode === "blogBuilder" && <BlogBuilderView isEditing={false} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}
        {viewMode === "blogEdit" && <BlogBuilderView key={activeBlogId} isEditing={true} pageId={activeBlogId} initialData={blogPagesList[activeBlogId]} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}

        {viewMode === "industryBuilder" && <IndustryBuilderView isEditing={false} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}
        {viewMode === "industryEdit" && <IndustryBuilderView key={activeIndustryId} isEditing={true} pageId={activeIndustryId} initialData={industryPagesList[activeIndustryId]} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}

        {viewMode === "jsonUpload" && <div className="p-6"><JsonUploader /></div>}
        {viewMode === "staticBuilder" && <StaticPageBuilder isEditing={false} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}
        {viewMode === "staticEdit" && <StaticPageBuilder key={activeStaticPageId} isEditing={true} pageId={activeStaticPageId} initialData={staticPagesList[activeStaticPageId]} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}

        {/* CORE PAGE EDITORS (SEO, AEO, WEB, ETC) */}
        {viewMode === "core" && (
          <>
            <header className="h-20 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">Editing: <span className="text-[#fcd34d] bg-[#fcd34d]/10 px-3 py-1 rounded-md text-sm border border-[#fcd34d]/20 uppercase">{activeTab}</span></h2>
                
                <Link href="/llms.txt" target="_blank" className="text-[10px] bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded uppercase tracking-widest font-bold transition-colors">
                  Global llms.txt
                </Link>

                {activeTab !== 'footer' && (
                  <Link 
                    href={`${SERVICE_URL_MAP[activeTab]}/llms.txt`} 
                    target="_blank" 
                    className="bg-[#3b82f6] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Service llms.txt
                  </Link>
                )}
              </div>
              <button onClick={handleSaveToFirebase} disabled={isSaving} className="bg-[#185FA5] hover:bg-[#144d85] text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(24,95,165,0.4)] disabled:opacity-50 flex items-center gap-2 text-sm">
                {isSaving ? "Pushing to Live..." : "Save Core to Firebase"}
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-8 pb-32">
                  {activeTab !== "footer" ? (
                    <>
                      <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                          <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Meta Data & SEO</h3>
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Title</label><input type="text" value={content[activeTab].meta?.title || ""} onChange={(e) => handleNestedChange('meta', 'title', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Description</label><textarea rows="2" value={content[activeTab].meta?.description || ""} onChange={(e) => handleNestedChange('meta', 'description', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white resize-none" /></div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].hero?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("hero", "Block 1: Hero Section")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Main H1 Headline</label><input type="text" value={content[activeTab].hero?.h1 || ""} onChange={(e) => handleNestedChange('hero', 'h1', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold" /></div>
                              <TipTapEditor label="Subheadline" name="sub" value={content[activeTab].hero?.sub || ""} onChange={(e) => handleNestedChange('hero', 'sub', e.target.value)} />
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Trust Bar (Separate with | )</label><input type="text" value={content[activeTab].hero?.trust || ""} onChange={(e) => handleNestedChange('hero', 'trust', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Primary Button Text</label><input type="text" value={content[activeTab].hero?.btn1Text || ""} onChange={(e) => handleNestedChange('hero', 'btn1Text', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Primary Button Link URL</label><input type="text" value={content[activeTab].hero?.btn1Link || ""} onChange={(e) => handleNestedChange('hero', 'btn1Link', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#3b82f6]" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Secondary Button Text</label><input type="text" value={content[activeTab].hero?.btn2Text || ""} onChange={(e) => handleNestedChange('hero', 'btn2Text', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Secondary Button Link URL</label><input type="text" value={content[activeTab].hero?.btn2Link || ""} onChange={(e) => handleNestedChange('hero', 'btn2Link', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#3b82f6]" /></div>
                              </div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].definition?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("definition", "Block 2: Definition (Snippet Target)")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].definition?.h2 || ""} onChange={(e) => handleNestedChange('definition', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <TipTapEditor label="Paragraph (40-60 words)" name="para" value={content[activeTab].definition?.para || ""} onChange={(e) => handleNestedChange('definition', 'para', e.target.value)} />
                              <TipTapEditor label="Bullet Points (One per line)" name="bullets" value={content[activeTab].definition?.bullets || ""} onChange={(e) => handleNestedChange('definition', 'bullets', e.target.value)} />
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].included?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("included", "Block 3: What's Included")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].included?.h2 || ""} onChange={(e) => handleNestedChange('included', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <TipTapEditor label="Items (Format: Title: Description) - One per line" name="items" value={content[activeTab].included?.items || ""} onChange={(e) => handleNestedChange('included', 'items', e.target.value)} />
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].process?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("process", "Block 4: Process")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].process?.h2 || ""} onChange={(e) => handleNestedChange('process', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <TipTapEditor label="Steps (Format: Step Title: Description) - One per line" name="steps" value={content[activeTab].process?.steps || ""} onChange={(e) => handleNestedChange('process', 'steps', e.target.value)} />
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].results?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("results", "Block 5: Results / Social Proof")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].results?.h2 || ""} onChange={(e) => handleNestedChange('results', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Case Study (Format: Niche | Metric | Outcome)</label><input type="text" value={content[activeTab].results?.caseStudy || ""} onChange={(e) => handleNestedChange('results', 'caseStudy', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <TipTapEditor label="Testimonial Quote" name="quote" value={content[activeTab].results?.quote || ""} onChange={(e) => handleNestedChange('results', 'quote', e.target.value)} />
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Testimonial Author</label><input type="text" value={content[activeTab].results?.author || ""} onChange={(e) => handleNestedChange('results', 'author', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].pricing?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("pricing", "Block 6: Pricing")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].pricing?.h2 || ""} onChange={(e) => handleNestedChange('pricing', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Starter Tier (Format: Name | Price | Link URL | Feature 1, Feature 2)</label><input type="text" value={content[activeTab].pricing?.starter || ""} onChange={(e) => handleNestedChange('pricing', 'starter', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Growth Tier (Format: Name | Price | Link URL | Feature 1, Feature 2)</label><input type="text" value={content[activeTab].pricing?.growth || ""} onChange={(e) => handleNestedChange('pricing', 'growth', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Premium Tier (Format: Name | Price | Link URL | Feature 1, Feature 2)</label><input type="text" value={content[activeTab].pricing?.premium || ""} onChange={(e) => handleNestedChange('pricing', 'premium', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].faq?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("faq", "Block 7: FAQ")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].faq?.h2 || ""} onChange={(e) => handleNestedChange('faq', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <TipTapEditor label="Questions & Answers (Format: Question?|Answer) - One per line" name="qas" value={content[activeTab].faq?.qas || ""} onChange={(e) => handleNestedChange('faq', 'qas', e.target.value)} />
                          </div>
                      </section>

                       <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].cta?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          {renderSectionHeader("cta", "Block 8: Final CTA")}
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].cta?.h2 || ""} onChange={(e) => handleNestedChange('cta', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <TipTapEditor label="Description Text" name="text" value={content[activeTab].cta?.text || ""} onChange={(e) => handleNestedChange('cta', 'text', e.target.value)} />
                              <div className="grid grid-cols-2 gap-4">
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Button Text</label><input type="text" value={content[activeTab].cta?.btnText || ""} onChange={(e) => handleNestedChange('cta', 'btnText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Button Link URL</label><input type="text" value={content[activeTab].cta?.btnLink || ""} onChange={(e) => handleNestedChange('cta', 'btnLink', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#3b82f6]" /></div>
                              </div>
                          </div>
                      </section>
                    </>
                  ) : (
                    <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Global Footer Settings</h3>
                        <div className="space-y-5">
                            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Trademark Text</label><input type="text" value={content[activeTab].trademark || ""} onChange={(e) => handleFlatChange('trademark', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Privacy Policy Link Text</label><input type="text" value={content[activeTab].privacyText || ""} onChange={(e) => handleFlatChange('privacyText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Terms & Conditions Link Text</label><input type="text" value={content[activeTab].termsText || ""} onChange={(e) => handleFlatChange('termsText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                        </div>
                    </section>
                  )}
              </div>
            </div>
          </>
        )}
    </AdminShell>
  );
}

// ==========================================
// COMPONENT: LEADS & SCANS DASHBOARD
// ==========================================
function LeadsView() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const leadsSnapshot = await getDocs(collection(db, 'leads'));
        let leadsData = leadsSnapshot.docs.map(doc => {
          const data = doc.data();
          const timeData = data.capturedAt || data.createdAt;
          return {
            id: doc.id, ...data,
            rawTime: timeData ? timeData.toMillis() : 0,
            date: timeData ? timeData.toDate().toLocaleString() : 'Unknown Date'
          };
        });
        leadsData.sort((a, b) => b.rawTime - a.rawTime);
        setLeads(leadsData);

        const scansSnapshot = await getDocs(collection(db, 'scans'));
        let scansData = scansSnapshot.docs.map(doc => {
          const data = doc.data();
          const timeData = data.scannedAt;
          return {
            id: doc.id, ...data,
            rawTime: timeData ? timeData.toMillis() : 0,
            date: timeData ? timeData.toDate().toLocaleString() : 'Unknown Date'
          };
        });
        scansData.sort((a, b) => b.rawTime - a.rawTime);
        setScans(scansData);
      } catch (err) { 
        console.error("Error fetching data:", err); 
        alert("Failed to load data. Check console for details.");
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full bg-[#030303]">
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        <h2 className="text-3xl font-black uppercase tracking-widest text-white">Lead Generation & Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Leads Captured</p>
              <p className="text-4xl font-black text-white">{leads.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl">📧</div>
          </div>
          
          <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1">Total Free Scans Run</p>
              <p className="text-4xl font-black text-[#3b82f6]">{scans.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6] text-xl">🔍</div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          <div className="flex border-b border-white/10 bg-[#111]">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors ${activeTab === 'leads' ? 'bg-[#0a0a0a] text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              Captured Leads
            </button>
            <button 
              onClick={() => setActiveTab('scans')}
              className={`flex-1 py-4 text-sm font-black uppercase tracking-wider transition-colors ${activeTab === 'scans' ? 'bg-[#0a0a0a] text-[#3b82f6] border-b-2 border-[#3b82f6]' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              All Scans (Analytics)
            </button>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="p-10 text-center text-[#3b82f6] text-sm uppercase tracking-widest font-bold animate-pulse">Loading secure records...</div>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#111] border-b border-white/10">
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Date & Time</th>
                    {activeTab === 'leads' && (
                      <>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Prospect Name</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Details</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Source / Goal</th>
                      </>
                    )}
                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Target Website</th>
                    {activeTab === 'leads' && <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Message</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeTab === 'leads' && leads.length === 0 && (
                    <tr><td colSpan="6" className="py-12 text-center text-gray-500 text-xs tracking-widest uppercase">No leads captured yet.</td></tr>
                  )}
                  {activeTab === 'scans' && scans.length === 0 && (
                    <tr><td colSpan="2" className="py-12 text-center text-gray-500 text-xs tracking-widest uppercase">No scans run yet.</td></tr>
                  )}

                  {activeTab === 'leads' && leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 text-xs text-gray-500 font-mono group-hover:text-gray-400">{lead.date}</td>
                      <td className="py-4 px-6 text-sm font-bold text-white">{lead.name ? lead.name : <span className="text-gray-500 italic font-medium">Anonymous</span>}</td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-emerald-400">{lead.email}</div>
                        {lead.phone && <div className="text-xs text-gray-500 mt-1 tracking-wider">📞 {lead.phone}</div>}
                      </td>
                      <td className="py-4 px-6">
                        {lead.goal ? (
                          <div className="flex flex-col gap-2">
                            <span className="inline-block w-fit px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[9px] uppercase tracking-widest rounded-full font-bold">{lead.goal}</span>
                            {lead.source && <span className="text-[10px] uppercase tracking-widest text-gray-600">{lead.source.replaceAll('_', ' ')}</span>}
                          </div>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase tracking-widest rounded-full font-bold">PDF Download</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-300">
                        {lead.website ? (
                          <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#3b82f6] hover:underline transition-colors">{lead.website}</a>
                        ) : <span className="text-gray-600 italic">N/A</span>}
                      </td>
                      <td className="max-w-xs whitespace-normal py-4 px-6 text-sm font-medium leading-relaxed text-gray-400">{lead.message || <span className="text-gray-700 italic">No message</span>}</td>
                    </tr>
                  ))}

                  {activeTab === 'scans' && scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 text-xs text-gray-500 font-mono group-hover:text-gray-400">{scan.date}</td>
                      <td className="py-4 px-6 text-sm font-bold text-white">
                        <a href={scan.website?.startsWith('http') ? scan.website : `https://${scan.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#3b82f6] hover:underline transition-colors">{scan.website}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function AdminNotice({ eyebrow, title, description, actionHref, actionLabel }) {
  return (
    <div className="p-5 md:p-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current workflow</CardTitle>
          <CardDescription>This keeps the existing backend and routes intact while giving editors a clear next step.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={actionHref} target="_blank">{actionLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function HomePageStoryEditor() {
  const [data, setData] = useState(INITIAL_HOME_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchHomeContent = async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, "pages", "homepage"));
        if (snap.exists()) {
          const liveData = snap.data();
          setData({
            ...INITIAL_HOME_CONTENT,
            ...liveData,
            projects: Array.isArray(liveData.projects) && liveData.projects.length ? liveData.projects : INITIAL_HOME_CONTENT.projects,
          });
        }
      } catch (error) {}
      setIsLoading(false);
    };
    fetchHomeContent();
  }, []);

  const updateProject = (index, field, value) => {
    setData((prev) => {
      const projects = [...prev.projects];
      projects[index] = {
        ...projects[index],
        [field]: field === "metrics" ? value.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 3) : value,
      };
      return { ...prev, projects };
    });
  };

  const saveHomeContent = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "pages", "homepage"), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      alert("Homepage story saved.");
    } catch (error) {
      alert("Failed to save homepage story.");
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="text-white">Loading homepage story...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#ccff00] mb-2">Homepage Story</p>
            <h2 className="text-3xl font-black text-white tracking-tight">Edit hero and project panels</h2>
          </div>
          <button onClick={saveHomeContent} disabled={isSaving} className="bg-[#ccff00] text-black px-7 py-3 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Homepage"}
          </button>
        </div>

        <div className="space-y-5">
          <input
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white"
            value={data.eyebrow}
            onChange={(event) => setData({ ...data, eyebrow: event.target.value })}
            placeholder="Hero eyebrow"
          />
          <textarea
            className="w-full min-h-36 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white"
            value={data.headline}
            onChange={(event) => setData({ ...data, headline: event.target.value })}
            placeholder="Hero headline, one line per break"
          />
          <textarea
            className="w-full min-h-28 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white"
            value={data.intro}
            onChange={(event) => setData({ ...data, intro: event.target.value })}
            placeholder="Hero intro"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data.projects.map((project, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Project {index + 1}</h3>
              <input
                className="w-24 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={project.accent}
                onChange={(event) => updateProject(index, "accent", event.target.value)}
                placeholder="#ccff00"
              />
            </div>
            <input className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" value={project.name} onChange={(event) => updateProject(index, "name", event.target.value)} placeholder="Project name" />
            <input className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" value={project.type} onChange={(event) => updateProject(index, "type", event.target.value)} placeholder="Project type" />
            <input className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" value={project.href} onChange={(event) => updateProject(index, "href", event.target.value)} placeholder="Project URL" />
            <textarea className="w-full min-h-24 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white" value={project.line} onChange={(event) => updateProject(index, "line", event.target.value)} placeholder="Project description" />
            <input
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white"
              value={(project.metrics || []).join(", ")}
              onChange={(event) => updateProject(index, "metrics", event.target.value)}
              placeholder="Three metrics, comma separated"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: NICHE PAGE BUILDER
// ==========================================
function NicheBuilderView({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const parseArray = (arr, defaultObj, stringMapKey) => {
    if (!Array.isArray(arr) || arr.length === 0) return [{ ...defaultObj }];
    return arr.map(item => {
       if (typeof item === 'string') return { ...defaultObj, [stringMapKey]: item };
       if (typeof item === 'object' && item !== null) return { ...defaultObj, ...item };
       return { ...defaultObj };
    });
  };

  const [formData, setFormData] = useState(() => {
    const base = initialData || {};
    return {
      slug: base.slug || '',
      service: base.service || '',
      niche: base.niche || '',
      imageUrl: base.imageUrl || '',
      metaTitle: base.metaTitle || '',
      metaDescription: base.metaDescription || '',
      h1: base.h1 || '',
      subheadline: base.subheadline || '',
      trustLine: base.trustLine || '',
      tldr: base.tldr || '',
      statCards: parseArray(base.statCards, { number: '', label: '', source: '' }, 'label'),
      h2Sections: parseArray(base.h2Sections, { question: '', directAnswer: '', expansion: '' }, 'question'),
      deliverables: parseArray(base.deliverables, { action: '', outcome: '' }, 'action'),
      faqs: parseArray(base.faqs, { q: '', a: '' }, 'q'),
      relatedLinks: parseArray(base.relatedLinks, { title: '', url: '' }, 'title'),
      caseStudy: base.caseStudy || { location: '', before: '', after: '', time: '', kwBefore: '', kwAfter: '' },
      process: Array.isArray(base.process) && base.process.length > 0 ? base.process : ['', '', '', ''],
      authorName: base.authorName || 'Abdullah Luqman',
      authorRole: base.authorRole || 'Lead System Architect'
    };
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateArray = (key, index, field, value) => {
    const newArr = [...(formData[key] || [])];
    newArr[index] = { ...newArr[index], [field]: value };
    setFormData({ ...formData, [key]: newArr });
  };

  const addArrayItem = (key, emptyObj) => setFormData({ ...formData, [key]: [...(formData[key] || []), emptyObj] });
  
  const updateProcess = (index, value) => {
    const newProcess = [...(formData.process || ['', '', '', ''])];
    newProcess[index] = value;
    setFormData({ ...formData, process: newProcess });
  };

  const handleCaseStudy = (e) => setFormData({ ...formData, caseStudy: { ...(formData.caseStudy || {}), [e.target.name]: e.target.value }});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Deploying to database...');
    try {
      const targetSlug = isEditing ? pageId : formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await setDoc(doc(db, 'niche_pages', targetSlug), { ...formData, slug: targetSlug, updatedAt: serverTimestamp() });
      setStatus(`Success: Niche Page ${isEditing ? 'updated' : 'generated'} and is now live!`);
      refreshData();
      window.scrollTo(0, 0);
    } catch (error) { setStatus(`Error: ${error.message}`); } 
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete /niche/${pageId}?`)) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'niche_pages', pageId));
      alert(`Niche page /niche/${pageId} deleted successfully.`);
      await refreshData();
      setViewMode('core'); 
    } catch (error) { alert('Error: Could not delete page.'); setIsDeleting(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className={`font-black text-2xl uppercase tracking-widest ${isEditing ? 'text-[#10b981]' : 'text-green-400'}`}>
            {isEditing ? `Editing Niche: /${pageId}` : 'Strict Niche Architecture Builder'}
          </h2>
          <div className="flex items-center gap-3">
            {isEditing && (
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10 transition-colors disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
        
        {status && <div className={`mb-8 p-4 border text-xs tracking-widest uppercase font-bold rounded ${status.includes('Success') ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">1. System Config</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="slug" placeholder="URL Slug" required disabled={isEditing} value={formData.slug || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white disabled:opacity-50 rounded" />
              <input name="service" placeholder="Hub Service" required value={formData.service || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="niche" placeholder="Hub Niche" required value={formData.niche || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">2. Page Hero</h3>
            <input name="metaTitle" placeholder="Meta Title" value={formData.metaTitle || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            <input name="h1" placeholder="H1 Headline" required value={formData.h1 || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white font-bold rounded" />
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">3. TL;DR Block</h3>
            <TipTapEditor name="tldr" value={formData.tldr || ''} onChange={handleChange} placeholder="Direct, factual answer..." />
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">5. Question-Based H2s</h3>
            {formData.h2Sections.map((sec, i) => (
              <div key={i} className="space-y-3 p-4 bg-[#111] border border-white/5 rounded">
                <input placeholder="H2 Question" value={sec.question || ''} onChange={(e) => updateArray('h2Sections', i, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                <TipTapEditor label="Direct Answer" name="directAnswer" value={sec.directAnswer || ''} onChange={(e) => updateArray('h2Sections', i, 'directAnswer', e.target.value)} />
                <TipTapEditor label="Expansion" name="expansion" value={sec.expansion || ''} onChange={(e) => updateArray('h2Sections', i, 'expansion', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('h2Sections', {question:'', directAnswer:'', expansion:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add H2 Section</button>
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">9. FAQ Section</h3>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 border border-white/5 bg-[#111] rounded">
                <input placeholder="Question" value={faq.q || ''} onChange={(e) => updateArray('faqs', i, 'q', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:border-blue-500 outline-none text-white" />
                <TipTapEditor placeholder="Answer" name="a" value={faq.a || ''} onChange={(e) => updateArray('faqs', i, 'a', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('faqs', {q:'', a:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add FAQ</button>
          </div>

          <div className="p-6 bg-[#111] rounded-lg border border-white/10 space-y-6">
            <button type="submit" disabled={isSubmitting || isDeleting} className={`px-10 py-4 rounded font-black uppercase tracking-widest text-sm transition-all shadow-lg w-full md:w-auto ${isEditing ? 'bg-[#10b981] hover:bg-emerald-400 text-white' : 'bg-[#10b981] hover:bg-emerald-400 text-white'}`}>
              {isSubmitting ? 'Transmitting...' : (isEditing ? 'Update Live Niche Architecture' : 'Deploy Niche Architecture')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: INDUSTRY HUB BUILDER
// ==========================================
function IndustryBuilderView({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const parseArray = (arr, fallback) => Array.isArray(arr) && arr.length > 0 ? arr : [fallback];
  const parseTextArray = (arr) => Array.isArray(arr) && arr.length > 0 ? arr : [''];

  const [formData, setFormData] = useState(() => {
    const base = initialData || {};
    return {
      slug: base.slug || '',
      imageEnabled: base.imageEnabled === true && Boolean(base.imageUrl),
      imageUrl: base.imageEnabled === true ? base.imageUrl || '' : '',
      meta: base.meta || { title: '', description: '' },
      hero: { h1: '', sub: '', cta: 'Get my free audit', ctaHref: '/seoauditor', ...(base.hero || {}), image: '' },
      tldr: base.tldr || { text: '' },
      sections: parseArray(base.sections, { h2: '', paras: [''], sub: [], list: [] }),
      related: parseArray(base.related, { label: '', href: '' }),
      faqs: parseArray(base.faqs, { q: '', a: '' }),
      cta: base.cta || { heading: '', sub: '', primary: 'Get my free audit', primaryHref: '/seoauditor', secondary: 'Talk to us', secondaryHref: '/contact' },
    };
  });

  const updateNested = (key, field, value) => {
    setFormData((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), [field]: value } }));
  };

  const updateSection = (index, field, value) => {
    const sections = [...(formData.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    setFormData({ ...formData, sections });
  };

  const updateSectionTextArray = (sectionIndex, field, itemIndex, value) => {
    const sections = [...(formData.sections || [])];
    const items = parseTextArray(sections[sectionIndex]?.[field]);
    items[itemIndex] = value;
    sections[sectionIndex] = { ...sections[sectionIndex], [field]: items };
    setFormData({ ...formData, sections });
  };

  const addSectionTextArrayItem = (sectionIndex, field) => {
    const sections = [...(formData.sections || [])];
    sections[sectionIndex] = { ...sections[sectionIndex], [field]: [...parseTextArray(sections[sectionIndex]?.[field]), ''] };
    setFormData({ ...formData, sections });
  };

  const removeSectionTextArrayItem = (sectionIndex, field, itemIndex) => {
    const sections = [...(formData.sections || [])];
    const items = parseTextArray(sections[sectionIndex]?.[field]).filter((_, index) => index !== itemIndex);
    sections[sectionIndex] = { ...sections[sectionIndex], [field]: items.length > 0 ? items : [''] };
    setFormData({ ...formData, sections });
  };

  const updateSubsection = (sectionIndex, subIndex, field, value) => {
    const sections = [...(formData.sections || [])];
    const subs = Array.isArray(sections[sectionIndex]?.sub) ? [...sections[sectionIndex].sub] : [];
    subs[subIndex] = { ...subs[subIndex], [field]: value };
    sections[sectionIndex] = { ...sections[sectionIndex], sub: subs };
    setFormData({ ...formData, sections });
  };

  const addSubsection = (sectionIndex) => {
    const sections = [...(formData.sections || [])];
    const subs = Array.isArray(sections[sectionIndex]?.sub) ? sections[sectionIndex].sub : [];
    sections[sectionIndex] = { ...sections[sectionIndex], sub: [...subs, { h3: '', text: '' }] };
    setFormData({ ...formData, sections });
  };

  const removeSubsection = (sectionIndex, subIndex) => {
    const sections = [...(formData.sections || [])];
    const subs = (sections[sectionIndex]?.sub || []).filter((_, index) => index !== subIndex);
    sections[sectionIndex] = { ...sections[sectionIndex], sub: subs };
    setFormData({ ...formData, sections });
  };

  const updateObjectArray = (key, index, field, value) => {
    const items = [...(formData[key] || [])];
    items[index] = { ...items[index], [field]: value };
    setFormData({ ...formData, [key]: items });
  };

  const addObjectArrayItem = (key, empty) => setFormData({ ...formData, [key]: [...(formData[key] || []), empty] });
  const removeObjectArrayItem = (key, index, empty) => {
    const items = (formData[key] || []).filter((_, itemIndex) => itemIndex !== index);
    setFormData({ ...formData, [key]: items.length > 0 ? items : [empty] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('Saving industry hub...');
    try {
      const targetSlug = isEditing ? pageId : formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const cleanedData = {
        ...formData,
        slug: targetSlug,
        imageEnabled: Boolean(formData.imageUrl),
        imageUrl: formData.imageUrl || "",
        hero: { ...(formData.hero || {}), image: "" },
        sections: (formData.sections || [])
          .filter((section) => section.h2 || section.paras?.some(Boolean) || section.sub?.some((sub) => sub.h3 || sub.text) || section.list?.some(Boolean))
          .map((section) => ({
            ...section,
            paras: (section.paras || []).filter(Boolean),
            sub: (section.sub || []).filter((sub) => sub.h3 || sub.text),
            list: (section.list || []).filter(Boolean),
          })),
        related: (formData.related || []).filter((item) => item.label || item.href),
        faqs: (formData.faqs || []).filter((item) => item.q || item.a),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'industry_pages', targetSlug), cleanedData, { merge: true });
      await addSlugToRegistry('industry_pages', targetSlug);
      setStatus(`Success: /industries/${targetSlug} is live.`);
      await refreshData();
      window.scrollTo(0, 0);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`WARNING: Permanently delete /industries/${pageId}?`)) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'industry_pages', pageId));
      alert(`/industries/${pageId} deleted.`);
      await refreshData();
      setViewMode('core');
    } catch (error) {
      alert(`Error deleting industry hub: ${error.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-5xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="font-black text-2xl uppercase tracking-widest text-cyan-400">
            {isEditing ? `Editing Industry: /${pageId}` : 'Industry Hub Builder'}
          </h2>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10 disabled:opacity-50">
              {isDeleting ? 'Deleting...' : 'Delete Hub'}
            </button>
          )}
        </div>

        {status && <div className={`mb-8 p-4 border text-xs tracking-widest uppercase font-bold rounded ${status.includes('Success') ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <JsonImportPanel
            title="Import an industry page from JSON"
            description="Copy the example, replace the copy with your industry content, paste it back, and import it into this form before publishing."
            example={INDUSTRY_JSON_EXAMPLE}
            onImport={(payload) => setFormData((prev) => ({ ...prev, ...applyIndustryJsonImport(payload) }))}
          />

          <section className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold">1. URL, Metadata & Hero</h3>
            <input value={formData.slug} onChange={(event) => setFormData({ ...formData, slug: event.target.value })} disabled={isEditing} required placeholder="URL Slug, e.g. seo-for-dentists" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white disabled:opacity-50 rounded" />
            <input value={formData.meta?.title || ''} onChange={(event) => updateNested('meta', 'title', event.target.value)} placeholder="Meta title" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            <textarea value={formData.meta?.description || ''} onChange={(event) => updateNested('meta', 'description', event.target.value)} placeholder="Meta description" className="w-full min-h-20 bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            <input
              value={formData.imageUrl || ''}
              onChange={(event) => {
                const imageUrl = event.target.value;
                setFormData({ ...formData, imageUrl, imageEnabled: Boolean(imageUrl.trim()) });
              }}
              placeholder="Optional industry image URL. Leave empty for no image."
              className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded"
            />
            <input value={formData.hero?.h1 || ''} onChange={(event) => updateNested('hero', 'h1', event.target.value)} required placeholder="Hero H1" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white font-bold rounded" />
            <textarea value={formData.hero?.sub || ''} onChange={(event) => updateNested('hero', 'sub', event.target.value)} placeholder="Hero subheading" className="w-full min-h-24 bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={formData.hero?.cta || ''} onChange={(event) => updateNested('hero', 'cta', event.target.value)} placeholder="Hero CTA text" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
              <input value={formData.hero?.ctaHref || ''} onChange={(event) => updateNested('hero', 'ctaHref', event.target.value)} placeholder="Hero CTA href" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            </div>
          </section>

          <section className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold">2. TL;DR</h3>
            <textarea value={formData.tldr?.text || ''} onChange={(event) => updateNested('tldr', 'text', event.target.value)} placeholder="Short direct industry summary" className="w-full min-h-28 bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
          </section>

          <section className="space-y-5 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold">3. Content Sections</h3>
              <button type="button" onClick={() => setFormData({ ...formData, sections: [...(formData.sections || []), { h2: '', paras: [''], sub: [], list: [] }] })} className="text-[10px] bg-white/10 px-3 py-2 rounded text-white uppercase tracking-widest font-bold hover:bg-white/20">+ Add Section</button>
            </div>
            {(formData.sections || []).map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4 bg-[#111] border border-white/10 p-5 rounded-xl">
                <div className="flex gap-3">
                  <input value={section.h2 || ''} onChange={(event) => updateSection(sectionIndex, 'h2', event.target.value)} placeholder="H2 heading" className="flex-1 bg-transparent border-b border-white/10 p-2 text-sm focus:border-cyan-500 outline-none text-white font-bold" />
                  <button type="button" onClick={() => setFormData({ ...formData, sections: (formData.sections || []).filter((_, index) => index !== sectionIndex) })} className="text-red-500 text-xs font-bold uppercase">Remove</button>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Paragraphs</p>
                  {parseTextArray(section.paras).map((paragraph, paragraphIndex) => (
                    <div key={paragraphIndex} className="flex gap-2">
                      <textarea value={paragraph} onChange={(event) => updateSectionTextArray(sectionIndex, 'paras', paragraphIndex, event.target.value)} placeholder="Paragraph" className="flex-1 min-h-20 bg-black/40 border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
                      <button type="button" onClick={() => removeSectionTextArrayItem(sectionIndex, 'paras', paragraphIndex)} className="px-3 text-red-500 font-bold">x</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSectionTextArrayItem(sectionIndex, 'paras')} className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">+ Add paragraph</button>
                </div>

                <div className="space-y-3 border-l border-white/10 pl-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sub Cards</p>
                    <button type="button" onClick={() => addSubsection(sectionIndex)} className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">+ Add H3 Card</button>
                  </div>
                  {(section.sub || []).map((sub, subIndex) => (
                    <div key={subIndex} className="space-y-2 bg-black/30 border border-white/5 p-4 rounded">
                      <div className="flex gap-2">
                        <input value={sub.h3 || ''} onChange={(event) => updateSubsection(sectionIndex, subIndex, 'h3', event.target.value)} placeholder="H3 title" className="flex-1 bg-transparent border-b border-white/10 p-2 text-sm focus:border-cyan-500 outline-none text-white font-bold" />
                        <button type="button" onClick={() => removeSubsection(sectionIndex, subIndex)} className="text-red-500 text-xs font-bold uppercase">Remove</button>
                      </div>
                      <textarea value={sub.text || ''} onChange={(event) => updateSubsection(sectionIndex, subIndex, 'text', event.target.value)} placeholder="Card text" className="w-full min-h-20 bg-black/40 border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Bulleted List</p>
                  {parseTextArray(section.list).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2">
                      <input value={item} onChange={(event) => updateSectionTextArray(sectionIndex, 'list', itemIndex, event.target.value)} placeholder="List item" className="flex-1 bg-black/40 border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
                      <button type="button" onClick={() => removeSectionTextArrayItem(sectionIndex, 'list', itemIndex)} className="px-3 text-red-500 font-bold">x</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSectionTextArrayItem(sectionIndex, 'list')} className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">+ Add list item</button>
                </div>
              </div>
            ))}
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
              <h3 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold">4. Related Links</h3>
              {(formData.related || []).map((item, index) => (
                <div key={index} className="space-y-2 bg-[#111] border border-white/10 p-4 rounded">
                  <input value={item.label || ''} onChange={(event) => updateObjectArray('related', index, 'label', event.target.value)} placeholder="Label" className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-cyan-500 outline-none text-white" />
                  <input value={item.href || ''} onChange={(event) => updateObjectArray('related', index, 'href', event.target.value)} placeholder="Href" className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-cyan-500 outline-none text-white" />
                  <button type="button" onClick={() => removeObjectArrayItem('related', index, { label: '', href: '' })} className="text-red-500 text-[10px] font-bold uppercase">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addObjectArrayItem('related', { label: '', href: '' })} className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">+ Add related link</button>
            </div>

            <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
              <h3 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold">5. FAQs</h3>
              {(formData.faqs || []).map((faq, index) => (
                <div key={index} className="space-y-2 bg-[#111] border border-white/10 p-4 rounded">
                  <input value={faq.q || ''} onChange={(event) => updateObjectArray('faqs', index, 'q', event.target.value)} placeholder="Question" className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-cyan-500 outline-none text-white" />
                  <textarea value={faq.a || ''} onChange={(event) => updateObjectArray('faqs', index, 'a', event.target.value)} placeholder="Answer" className="w-full min-h-20 bg-black/40 border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
                  <button type="button" onClick={() => removeObjectArrayItem('faqs', index, { q: '', a: '' })} className="text-red-500 text-[10px] font-bold uppercase">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addObjectArrayItem('faqs', { q: '', a: '' })} className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">+ Add FAQ</button>
            </div>
          </section>

          <section className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-cyan-400 uppercase tracking-widest text-[10px] font-bold">6. Final CTA</h3>
            <input value={formData.cta?.heading || ''} onChange={(event) => updateNested('cta', 'heading', event.target.value)} placeholder="CTA heading" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            <textarea value={formData.cta?.sub || ''} onChange={(event) => updateNested('cta', 'sub', event.target.value)} placeholder="CTA subtext" className="w-full min-h-20 bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            <div className="grid gap-4 md:grid-cols-2">
              <input value={formData.cta?.primary || ''} onChange={(event) => updateNested('cta', 'primary', event.target.value)} placeholder="Primary CTA text" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
              <input value={formData.cta?.primaryHref || ''} onChange={(event) => updateNested('cta', 'primaryHref', event.target.value)} placeholder="Primary CTA href" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
              <input value={formData.cta?.secondary || ''} onChange={(event) => updateNested('cta', 'secondary', event.target.value)} placeholder="Secondary CTA text" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
              <input value={formData.cta?.secondaryHref || ''} onChange={(event) => updateNested('cta', 'secondaryHref', event.target.value)} placeholder="Secondary CTA href" className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-cyan-500 outline-none text-white rounded" />
            </div>
          </section>

          <button type="submit" disabled={isSubmitting || isDeleting} className="px-10 py-4 rounded font-black uppercase tracking-widest text-sm transition-all shadow-lg w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-[#031316] disabled:opacity-50">
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Industry Hub' : 'Publish Industry Hub')}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: BLOG BUILDER (THE MASSIVE CMS RESTORED)
// ==========================================
function BlogBuilderView({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const parseArray = (arr, defaultVal) => (!Array.isArray(arr) || arr.length === 0) ? [defaultVal] : arr;

  const [formData, setFormData] = useState(() => {
    const b = initialData || {};
    return {
      slug: b.slug || '',
      status: b.status || 'published',
      postType: b.postType || 'standard',
      primaryService: b.primaryService ?? b.serviceTag ?? 'general',
      industry: b.industry ?? b.industryTag ?? 'general',
      serviceTag: b.serviceTag || 'general', 
      industryTag: b.industryTag || 'none',   
      seoMeta: b.seoMeta || { title: '', metaDescription: '', canonicalUrl: '' },
      breadcrumbs: parseArray(b.breadcrumbs, { name: 'Home', url: '/' }),
      hero: {
        title: '',
        description: '',
        coverImage: '',
        authorName: 'Abdullah Luqman',
        authorProfileUrl: '/about',
        publishDate: new Date().toISOString().split('T')[0],
        readTime: '5 Min',
        ...(b.hero || {}),
      },
      tldr: parseArray(b.tldr, ''),
      quickAnswer: b.quickAnswer || '',
      intro: parseArray(b.intro, ''),
      sections: parseArray(b.sections, { 
        id: 'section-1', heading: '', contentType: 'default', content: [''], list: [], subheadings: [], comparison: null 
      }),
      toolBlock: b.toolBlock || { title: 'Free System Audit', description: 'Find out exactly where your digital architecture is failing.', ctaText: 'Start Audit', ctaLink: '/seoauditor' },
      downloadAsset: b.downloadAsset || { enabled: false },
      relatedCaseStudies: b.relatedCaseStudies || [],
      relatedPosts: b.relatedPosts || [],
      relatedServices: b.relatedServices || [],
      faqs: parseArray(b.faqs, { question: '', answer: '' }),
      authorInfo: b.authorInfo || { name: 'Abdullah Luqman', role: 'Lead Architect', bio: 'Architecting digital systems for absolute scale.', profileUrl: '/about' }
    };
  });

  const handleChange = (e, objKey) => {
    if(objKey) setFormData({...formData, [objKey]: {...formData[objKey], [e.target.name]: e.target.value}});
    else setFormData({...formData, [e.target.name]: e.target.value});
  };

  const updateSimpleArray = (key, index, value) => {
    const newArr = [...(formData[key] || [])];
    newArr[index] = value;
    setFormData({...formData, [key]: newArr});
  };

  const updateComplexArray = (key, index, field, value) => {
    const newArr = [...(formData[key] || [])];
    newArr[index] = { ...newArr[index], [field]: value };
    setFormData({...formData, [key]: newArr});
  };

  const updateSectionArray = (secIndex, field, arrIndex, value) => {
    const newSecs = [...(formData.sections || [])];
    if (!newSecs[secIndex][field]) newSecs[secIndex][field] = [];
    newSecs[secIndex][field][arrIndex] = value;
    setFormData({...formData, sections: newSecs});
  };

  const moveSection = (index, direction) => {
    const newSecs = [...(formData.sections || [])];
    let newIndex = index;
    
    if (direction === 'up' && index > 0) {
      const temp = newSecs[index - 1];
      newSecs[index - 1] = newSecs[index];
      newSecs[index] = temp;
      newIndex = index - 1;
    } else if (direction === 'down' && index < newSecs.length - 1) {
      const temp = newSecs[index + 1];
      newSecs[index + 1] = newSecs[index];
      newSecs[index] = temp;
      newIndex = index + 1;
    }
    
    setFormData({...formData, sections: newSecs});
  };

  const updateSubheading = (secIndex, subIndex, field, value, contentIndex = -1) => {
    const newSecs = [...(formData.sections || [])];
    if (!newSecs[secIndex].subheadings[subIndex]) return;
    
    if (field === 'content') {
      if (!newSecs[secIndex].subheadings[subIndex].content) newSecs[secIndex].subheadings[subIndex].content = [];
      newSecs[secIndex].subheadings[subIndex].content[contentIndex] = value;
    } else if (field === 'list') {
      if (!newSecs[secIndex].subheadings[subIndex].list) newSecs[secIndex].subheadings[subIndex].list = [];
      newSecs[secIndex].subheadings[subIndex].list[contentIndex] = value;
    } else {
      newSecs[secIndex].subheadings[subIndex][field] = value;
    }
    setFormData({...formData, sections: newSecs});
  };

  // --- SAAS COMPARISON CARD LOGIC ---
  const toggleComparison = (secIndex, subIndex = -1) => {
    const newSecs = [...(formData.sections || [])];
    const defaultCard = { badge: '', icon: 'SE', title: 'SEO', subtitle: 'Search Engine Optimisation', metrics: [ { label: 'GOAL', value: 'Bring organic traffic' } ] };
    const targetSub = subIndex === -1 ? newSecs[secIndex] : newSecs[secIndex].subheadings[subIndex];
    
    if (targetSub.comparison) targetSub.comparison = null;
    else targetSub.comparison = { cards: [ { ...defaultCard } ] };
    setFormData({...formData, sections: newSecs});
  };

  const updateCardField = (secIndex, subIndex, cIdx, field, value) => {
    const newSecs = [...(formData.sections || [])];
    const target = subIndex === -1 ? newSecs[secIndex].comparison : newSecs[secIndex].subheadings[subIndex].comparison;
    if (target.cards && target.cards[cIdx]) target.cards[cIdx][field] = value;
    setFormData({...formData, sections: newSecs});
  };

  const ComparisonEditor = ({ comp, secIndex, subIndex }) => (
    <div className="mt-6 p-5 bg-[#141414] border border-blue-500/30 rounded-xl shadow-lg">
      <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#008dd8]">SaaS Comparison Cards</h4>
        <button type="button" onClick={() => toggleComparison(secIndex, subIndex)} className="text-red-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest">✕ Remove All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {(comp.cards || []).map((card, cIdx) => (
            <div key={cIdx} className="bg-[#0a0a0a] border border-white/10 p-4 rounded-xl space-y-3 relative">
               <input placeholder="Badge (e.g. Most Urgent)" value={card.badge || ''} onChange={(e) => updateCardField(secIndex, subIndex, cIdx, 'badge', e.target.value)} className="w-full bg-blue-900/20 text-blue-300 border border-blue-500/30 p-2 text-[10px] uppercase font-bold outline-none rounded" />
               <input placeholder="Title (e.g. SEO)" value={card.title || ''} onChange={(e) => updateCardField(secIndex, subIndex, cIdx, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-sm outline-none text-white font-black" />
               <input placeholder="Subtitle" value={card.subtitle || ''} onChange={(e) => updateCardField(secIndex, subIndex, cIdx, 'subtitle', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-xs outline-none text-gray-400" />
            </div>
         ))}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetSlug = isEditing ? pageId : formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const dataToSave = prepareBlogPostForSave({ ...formData, slug: targetSlug }, initialData || {});
      await setDoc(doc(db, 'blog_posts', targetSlug), { ...dataToSave, updatedAt: serverTimestamp() }, { merge: true });
      alert('Success! Blog Post Published.');
      refreshData();
      window.scrollTo(0, 0);
    } catch (err) { alert('Error: ' + err.message); }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`WARNING: Permanently delete /blog/${pageId}?`)) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'blog_posts', pageId));
      alert(`Deleted successfully.`);
      await refreshData();
      setViewMode('core'); 
    } catch (error) { alert('Error deleting.'); setIsDeleting(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-[1200px] mx-auto pb-32">
        
        {/* === HEADER & DELETE === */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="font-black text-2xl uppercase tracking-widest text-purple-400">
            {isEditing ? `Editing Blog: /${pageId}` : 'Strict Article Architecture'}
          </h2>
          {isEditing && (
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10">
                {isDeleting ? 'Deleting...' : 'Delete Post'}
              </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <JsonImportPanel
            title="Import a blog or guide from JSON"
            description="Use mainQuestion for the AEO snippet area. If mainQuestion is missing, that field stays empty. Keep tldr as an empty array unless you have strong summary bullets."
            example={BLOG_JSON_EXAMPLE}
            onImport={(payload) => setFormData((prev) => ({ ...prev, ...applyBlogJsonImport(payload) }))}
          />
          
          {/* === SECTION 1: URL & METADATA === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">1. URL & Metadata</h3>
            <input name="slug" placeholder="URL Slug (e.g., local-seo-guide)" required disabled={isEditing} value={formData.slug} onChange={(e)=>handleChange(e)} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded disabled:opacity-50" />
            <input name="title" placeholder="Meta Title" value={formData.seoMeta?.title || ''} onChange={(e)=>handleChange(e, 'seoMeta')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded mt-4" />
            <textarea name="metaDescription" placeholder="Meta Description" value={formData.seoMeta?.metaDescription || ''} onChange={(e)=>handleChange(e, 'seoMeta')} rows={2} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded resize-none" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select name="status" value={formData.status || 'published'} onChange={handleChange} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <select name="postType" value={formData.postType || 'standard'} onChange={handleChange} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded">
                <option value="standard">Standard</option>
                <option value="guide">Guide</option>
                <option value="checklist">Checklist</option>
                <option value="keyword-list">Keyword list</option>
                <option value="comparison">Comparison</option>
                <option value="news">News</option>
              </select>
              <select name="primaryService" value={formData.primaryService || 'general'} onChange={handleChange} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded">
                <option value="general">General</option>
                <option value="seo">SEO</option>
                <option value="aeo">AEO</option>
                <option value="web-development">Web Development</option>
              </select>
              <input name="industry" placeholder="Industry" value={formData.industry || ''} onChange={handleChange} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
            <RoutePreviewCard path={`/blog/${formData.slug || 'new-post'}`} status={formData.status} />
            <SeoChecklist item={{ collection: 'blog_posts', id: formData.slug, ...formData, raw: formData }} />
          </div>

          {/* === SECTION 2: HERO DATA === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">2. Hero Data</h3>
            <TipTapEditor label="H1 Headline (Linkable)" name="title" value={formData.hero?.title || ''} onChange={(e)=>handleChange(e, 'hero')} />
            <textarea name="description" placeholder="Hero Subtext / Hook" required value={formData.hero?.description || ''} onChange={(e)=>handleChange(e, 'hero')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded h-20" />
            <input name="coverImage" placeholder="Optional cover image URL. Leave empty for no image." value={formData.hero?.coverImage || ''} onChange={(e)=>handleChange(e, 'hero')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
          </div>

          {/* === SECTION 2.5: TL;DR SUMMARY === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4 border-l-4 border-[#008dd8]">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">2.5 TL;DR Summary Points</h3>
            {(formData.tldr || []).map((point, i) => (
              <div key={`tldr-${i}`} className="flex gap-2 items-start mb-4">
                <div className="flex-1">
                  <TipTapEditor 
                    name={`tldr-${i}`} 
                    value={point} 
                    onChange={(e)=>updateSimpleArray('tldr', i, e.target.value)} 
                    placeholder="Enter summary bullet point..."
                  />
                </div>
                <button type="button" onClick={()=>{const n=[...(formData.tldr || [])]; n.splice(i,1); setFormData({...formData, tldr: n})}} className="bg-red-500/10 text-red-500 h-[42px] px-3 rounded hover:bg-red-500/20 font-bold">✕</button>
              </div>
            ))}
            <button type="button" onClick={()=>setFormData({...formData, tldr: [...(formData.tldr || []), '']})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold bg-blue-500/10 px-3 py-2 rounded hover:bg-blue-500/20 transition-colors">
              + Add TL;DR Point
            </button>
          </div>

          {/* === SECTION 3: MAIN QUESTION & INTRO PARAGRAPHS === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">3. Main Blog Question & Intro</h3>
            <TipTapEditor
              label="Main Blog Question"
              name="quickAnswer"
              value={formData.quickAnswer || ''}
              onChange={handleChange}
              placeholder="Add the main question for this blog. Leave empty if you do not want the question box."
            />
            
            <div className="pt-4 border-t border-white/10">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">Intro Paragraphs</label>
              {(formData.intro || []).map((para, i) => (
                <div key={i} className="flex gap-2 items-start mb-4">
                  <div className="flex-1"><TipTapEditor name={`intro-${i}`} value={para} onChange={(e)=>updateSimpleArray('intro', i, e.target.value)} /></div>
                  <button type="button" onClick={()=>{const n=[...formData.intro]; n.splice(i,1); setFormData({...formData, intro: n})}} className="bg-red-500/10 text-red-500 h-[42px] px-3 rounded hover:bg-red-500/20">✕</button>
                </div>
              ))}
              <button type="button" onClick={()=>setFormData({...formData, intro: [...(formData.intro || []), '']})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">+ Add Intro Paragraph</button>
            </div>
          </div>

          {/* === SECTION 4: CORE CONTENT SECTIONS (H2, H3, SAAS CARDS) === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
               <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">4. Core Content Sections (H2 & H3)</h3>
               <button type="button" onClick={()=> { const n=[...(formData.sections||[])]; n.push({ id: `sec-${n.length+1}`, heading: '', content: [''], list: [], subheadings: [], comparison: null }); setFormData({...formData, sections: n}); }} className="text-[10px] bg-white/10 px-2 py-1 rounded text-white uppercase tracking-widest font-bold hover:bg-white/20">+ Add H2 Section</button>
            </div>
            
            {(formData.sections || []).map((sec, i) => (
              <div key={i} className="p-5 bg-[#111] border border-white/10 rounded-xl shadow-lg space-y-4 relative">
                
                {/* Section Controls (Up/Down/Delete) */}
                <div className="absolute top-4 right-4 flex gap-2">
                   <button type="button" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="text-gray-400 hover:text-white disabled:opacity-30">↑</button>
                   <button type="button" onClick={() => moveSection(i, 'down')} disabled={i === (formData.sections||[]).length - 1} className="text-gray-400 hover:text-white disabled:opacity-30">↓</button>
                   <button type="button" onClick={() => { const n=[...formData.sections]; n.splice(i,1); setFormData({...formData, sections: n}); }} className="text-red-500 ml-4 hover:text-red-400 font-bold text-xs uppercase">Delete</button>
                </div>

                {/* H2 Setup */}
                <div className="w-3/4 space-y-2">
                  <input placeholder="Anchor ID (what-is-seo)" value={sec.id || ''} onChange={(e)=>updateComplexArray('sections', i, 'id', e.target.value)} className="w-1/3 bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-gray-400" />
                  <TipTapEditor label="H2 Heading (Linkable)" name={`sec-${i}-heading`} value={sec.heading || ''} onChange={(e)=>updateComplexArray('sections', i, 'heading', e.target.value)} />
                </div>

                {/* H2 Paragraphs */}
                <div className="space-y-4 border-l-2 border-white/10 pl-4">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Paragraphs</label>
                  {(sec.content || []).map((para, pIdx) => (
                    <div key={pIdx} className="flex gap-2 items-start mb-2">
                      <div className="flex-1"><TipTapEditor name={`sec-${i}-para-${pIdx}`} value={para} onChange={(e)=>updateSectionArray(i, 'content', pIdx, e.target.value)} /></div>
                      <button type="button" onClick={() => { const n=[...formData.sections]; n[i].content.splice(pIdx,1); setFormData({...formData, sections: n}); }} className="bg-red-500/10 text-red-500 h-[42px] px-3 rounded hover:bg-red-500/20">✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={()=> { const n=[...(formData.sections||[])]; if(!n[i].content) n[i].content=[]; n[i].content.push(''); setFormData({...formData, sections: n}); }} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">+ Add Paragraph</button>
                </div>

                {/* H2 SaaS Cards */}
                {!sec.comparison ? (
                   <button type="button" onClick={() => toggleComparison(i)} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded font-bold uppercase tracking-widest mt-4 hover:bg-blue-500/20 transition-colors block border border-blue-500/20">+ Add SaaS Comparison Cards Here</button>
                ) : (
                   <ComparisonEditor comp={sec.comparison} secIndex={i} subIndex={-1} />
                )}

                {/* H3 SUBHEADINGS */}
                <div className="space-y-6 border-l-2 border-purple-500/30 pl-4 mt-8">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">H3 Subheadings</label>
                     <button type="button" onClick={() => { const n=[...formData.sections]; if(!n[i].subheadings) n[i].subheadings=[]; n[i].subheadings.push({ title: '', content: [''] }); setFormData({...formData, sections: n}); }} className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-bold uppercase tracking-widest">+ Add H3</button>
                  </div>
                  
                  {(sec.subheadings || []).map((sub, sIdx) => (
                    <div key={sIdx} className="bg-black/50 p-4 border border-white/5 rounded space-y-4 relative">
                      <button type="button" onClick={() => { const n=[...formData.sections]; n[i].subheadings.splice(sIdx,1); setFormData({...formData, sections: n}); }} className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-xs font-bold uppercase">✕ Remove H3</button>
                      
                      <div className="w-3/4">
                        <TipTapEditor label="H3 Title (Linkable)" name={`sec-${i}-sub-${sIdx}-title`} value={sub.title || ''} onChange={(e) => updateSubheading(i, sIdx, 'title', e.target.value)} />
                      </div>
                      
                      {/* H3 Paragraphs */}
                      {(sub.content || []).map((subPara, spIdx) => (
                         <div key={spIdx} className="flex gap-2 items-start mb-2">
                           <div className="flex-1"><TipTapEditor name={`sec-${i}-sub-${sIdx}-para-${spIdx}`} value={subPara} onChange={(e) => updateSubheading(i, sIdx, 'content', e.target.value, spIdx)} /></div>
                           <button type="button" onClick={() => { const n=[...formData.sections]; n[i].subheadings[sIdx].content.splice(spIdx,1); setFormData({...formData, sections: n}); }} className="bg-red-500/10 text-red-500 h-[42px] px-3 rounded hover:bg-red-500/20">✕</button>
                         </div>
                      ))}
                      <button type="button" onClick={() => { const n=[...formData.sections]; n[i].subheadings[sIdx].content.push(''); setFormData({...formData, sections: n}); }} className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">+ Add H3 Paragraph</button>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* === SECTION 5: PREMIUM CTA TOOL BLOCK === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">5. Premium CTA Block (Dark Box)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">Headline</label>
                  <input name="title" value={formData.toolBlock?.title || ''} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">Description</label>
                  <input name="description" value={formData.toolBlock?.description || ''} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">Button Text</label>
                  <input name="ctaText" value={formData.toolBlock?.ctaText || ''} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">Button URL</label>
                  <input name="ctaLink" value={formData.toolBlock?.ctaLink || ''} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-[#3b82f6] rounded" />
               </div>
            </div>
          </div>

          <DownloadAssetEditor
            value={formData.downloadAsset}
            onChange={(downloadAsset) => setFormData({ ...formData, downloadAsset })}
          />

          {/* === SECTION 6: FAQs === */}
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">6. Frequently Asked Questions</h3>
            {(formData.faqs || []).map((faq, i) => (
              <div key={`faq-${i}`} className="p-4 bg-[#111] border border-white/5 rounded space-y-3 relative">
                <button type="button" onClick={() => { const n=[...(formData.faqs||[])]; n.splice(i,1); setFormData({...formData, faqs: n}); }} className="absolute top-2 right-2 text-red-500 hover:text-red-400 text-[10px] font-bold uppercase">✕</button>
                <input placeholder="Question" value={faq.question || ''} onChange={(e) => updateComplexArray('faqs', i, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                <TipTapEditor label="Answer" name={`faq-ans-${i}`} value={faq.answer || ''} onChange={(e) => updateComplexArray('faqs', i, 'answer', e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={()=>setFormData({...formData, faqs: [...(formData.faqs || []), {question:'', answer:''}]})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">+ Add FAQ</button>
          </div>

          {/* === SECTION 7: SUBMIT BUTTON === */}
          <div className="p-6 bg-[#111] rounded-lg border border-white/10 space-y-6">
              <button type="submit" disabled={isSubmitting || isDeleting} className="w-full bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded font-black uppercase tracking-widest text-sm shadow-lg transition-colors disabled:opacity-50">
                {isSubmitting ? 'Transmitting...' : (isEditing ? 'Update Live Blog Post' : 'Publish Blog Post')}
              </button>
          </div>

        </form>
      </div>
    </div>
  );
}
// ==========================================
// COMPONENT: STATIC PAGE BUILDER (For Portfolio, SEO Result, etc)
// ==========================================
function StaticPageBuilder({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState(() => {
    const base = initialData || {};
    return {
      slug: base.slug || '',
      metaTitle: base.metaTitle || '',
      metaDescription: base.metaDescription || '',
      pageTitle: base.pageTitle || '',
      pageSubtitle: base.pageSubtitle || '',
      sections: Array.isArray(base.sections) && base.sections.length > 0 ? base.sections : [{ heading: '', content: '' }]
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({ ...formData, sections: [...formData.sections, { heading: '', content: '' }] });
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const moveSection = (index, direction) => {
    const newSecs = [...formData.sections];
    let newIndex = index;
    
    if (direction === 'up' && index > 0) {
      const temp = newSecs[index - 1];
      newSecs[index - 1] = newSecs[index];
      newSecs[index] = temp;
      newIndex = index - 1;
    } else if (direction === 'down' && index < newSecs.length - 1) {
      const temp = newSecs[index + 1];
      newSecs[index + 1] = newSecs[index];
      newSecs[index] = temp;
      newIndex = index + 1;
    }
    
    setFormData({ ...formData, sections: newSecs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Saving page...');
    try {
      const targetSlug = isEditing ? pageId : formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await setDoc(doc(db, 'static_pages', targetSlug), { 
        ...formData, 
        slug: targetSlug, 
        updatedAt: serverTimestamp() 
      });
      setStatus(`Success: Page /${targetSlug} ${isEditing ? 'updated' : 'created'} and is now live!`);
      refreshData();
      window.scrollTo(0, 0);
    } catch (error) { 
      setStatus(`Error: ${error.message}`); 
    } 
    finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`WARNING: Are you sure you want to permanently delete /${pageId}?`)) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'static_pages', pageId));
      alert(`Page /${pageId} deleted successfully.`);
      await refreshData();
      setViewMode('staticBuilder'); 
    } catch (error) { 
      alert('Error: Could not delete page.'); 
      setIsDeleting(false); 
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className={`font-black text-2xl uppercase tracking-widest ${isEditing ? 'text-orange-400' : 'text-orange-400'}`}>
            {isEditing ? `Editing: /${pageId}` : 'Create New Static Page'}
          </h2>
          <div className="flex items-center gap-3">
            {isEditing && (
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10 transition-colors disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
        
        {status && <div className={`mb-8 p-4 border text-xs tracking-widest uppercase font-bold rounded ${status.includes('Success') ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* META DATA */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">Meta Data & SEO</h3>
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">URL Slug (URL Path)</label>
              <input name="slug" placeholder="portfolio" required disabled={isEditing} value={formData.slug || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white disabled:opacity-50 rounded" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Title (SEO)</label>
              <input name="metaTitle" placeholder="Page Title | Your Company" value={formData.metaTitle || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Description (SEO)</label>
              <textarea name="metaDescription" placeholder="Page description for search engines..." rows="2" value={formData.metaDescription || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded resize-none" />
            </div>
          </div>

          {/* PAGE HEADER */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">Page Header</h3>
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Main Heading (H1)</label>
              <input name="pageTitle" placeholder="Engineering Portfolio" value={formData.pageTitle || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white font-bold rounded" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Subheading</label>
              <input name="pageSubtitle" placeholder="A collection of high-performance web applications..." value={formData.pageSubtitle || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
          </div>

          {/* PAGE CONTENT SECTIONS */}
          <div className="space-y-6 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">Content Sections</h3>
              <button type="button" onClick={addSection} className="text-[10px] bg-white/10 px-3 py-1.5 rounded text-white uppercase tracking-widest font-bold hover:bg-white/20">+ Add Section</button>
            </div>
            
            {formData.sections.map((section, i) => (
              <div key={i} className="p-5 bg-[#111] border border-white/10 rounded-xl shadow-lg space-y-4 relative">
                
                {/* Section Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button type="button" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="text-gray-400 hover:text-white disabled:opacity-30 text-lg">↑</button>
                  <button type="button" onClick={() => moveSection(i, 'down')} disabled={i === (formData.sections||[]).length - 1} className="text-gray-400 hover:text-white disabled:opacity-30 text-lg">↓</button>
                  <button type="button" onClick={() => removeSection(i)} className="text-red-500 ml-4 hover:text-red-400 font-bold text-xs uppercase">Delete</button>
                </div>

                {/* Section Heading */}
                <div className="w-3/4 space-y-2">
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">Heading (H2)</label>
                  <input placeholder="Section Title" value={section.heading || ''} onChange={(e) => updateSection(i, 'heading', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                </div>

                {/* Section Content */}
                <div className="space-y-2 border-l-2 border-white/10 pl-4">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Content (Rich Text)</label>
                  <TipTapEditor name={`section-${i}`} value={section.content || ''} onChange={(e) => updateSection(i, 'content', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="p-6 bg-[#111] rounded-lg border border-white/10 space-y-6">
            <button type="submit" disabled={isSubmitting || isDeleting} className={`px-10 py-4 rounded font-black uppercase tracking-widest text-sm transition-all shadow-lg w-full md:w-auto ${isEditing ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Page' : 'Create Page')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
