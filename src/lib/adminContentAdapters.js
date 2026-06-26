import { stripHtml } from "@/lib/html";
import { getCanonicalPathForContent } from "@/lib/routeRules";
import { slugify } from "@/lib/slugUtils";

export function cleanTitle(value = "") {
  return String(value)
    .replace(/<\/?(p|h1|h2|div)[^>]*>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .trim();
}

const preserve = (existingDoc, updates) => ({
  ...(existingDoc || {}),
  ...updates,
});

const arr = (value) => (Array.isArray(value) ? value : []);

export function normalizeBlogPostForAdmin(doc = {}, id = "") {
  const slug = doc.slug || id;
  return {
    id,
    collection: "blog_posts",
    contentType: "blog",
    title: cleanTitle(doc.hero?.title || doc.seoMeta?.title || slug),
    slug,
    canonicalPath: doc.seoMeta?.canonicalUrl || `/blog/${slug}`,
    status: doc.status || "published",
    postType: doc.postType || "standard",
    primaryService: doc.primaryService || doc.serviceTag || "general",
    industry: doc.industry || doc.industryTag || "general",
    excerpt: stripHtml(doc.hero?.description || doc.quickAnswer || ""),
    metaTitle: cleanTitle(doc.seoMeta?.title || ""),
    metaDescription: stripHtml(doc.seoMeta?.metaDescription || ""),
    hero: doc.hero || {},
    tldr: arr(doc.tldr),
    intro: arr(doc.intro),
    sections: arr(doc.sections),
    faqs: arr(doc.faqs),
    cta: doc.toolBlock || {},
    downloadAsset: doc.downloadAsset || { enabled: false },
    relatedCaseStudies: arr(doc.relatedCaseStudies),
    relatedPosts: arr(doc.relatedPosts),
    relatedServices: arr(doc.relatedServices),
    raw: doc,
  };
}

export function normalizeIndustryPageForAdmin(doc = {}, id = "") {
  const slug = doc.slug || id;
  return {
    id,
    collection: "industry_pages",
    contentType: "industry",
    title: cleanTitle(doc.hero?.h1 || doc.meta?.title || slug),
    slug,
    canonicalPath: `/industries/${slug}`,
    status: doc.status || "published",
    primaryService: doc.primaryService || "seo",
    industry: doc.industry || slug,
    excerpt: stripHtml(doc.hero?.sub || doc.tldr?.text || ""),
    metaTitle: cleanTitle(doc.meta?.title || ""),
    metaDescription: stripHtml(doc.meta?.description || ""),
    hero: doc.hero || {},
    tldr: doc.tldr || {},
    sections: arr(doc.sections),
    faqs: arr(doc.faqs),
    cta: doc.cta || {},
    relatedCaseStudies: arr(doc.relatedCaseStudies),
    relatedPosts: arr(doc.relatedPosts || doc.related),
    raw: doc,
  };
}

export function normalizeNichePageForAdmin(doc = {}, id = "") {
  const slug = doc.slug || id;
  return {
    id,
    collection: "niche_pages",
    contentType: "niche",
    title: cleanTitle(doc.h1 || doc.metaTitle || slug),
    slug,
    canonicalPath: `/niche/${slug}`,
    status: doc.status || "published",
    primaryService: doc.primaryService || doc.service || "seo",
    industry: doc.industry || doc.niche || "general",
    excerpt: stripHtml(doc.subheadline || doc.tldr || ""),
    metaTitle: cleanTitle(doc.metaTitle || ""),
    metaDescription: stripHtml(doc.metaDescription || ""),
    h1: doc.h1 || "",
    tldr: doc.tldr || "",
    h2Sections: arr(doc.h2Sections),
    faqs: arr(doc.faqs),
    cta: doc.cta || {},
    relatedCaseStudies: arr(doc.relatedCaseStudies),
    relatedPosts: arr(doc.relatedPosts || doc.relatedLinks),
    raw: doc,
  };
}

export function normalizeServicePageForAdmin(doc = {}, id = "") {
  const slug = id === "seo" ? "seo-services" : id === "aeo" ? "aeo-services" : id === "web" ? "web-development" : id;
  return {
    id,
    collection: "pages",
    contentType: "service",
    title: cleanTitle(doc.hero?.h1 || doc.meta?.title || id),
    slug,
    canonicalPath: `/services/${slug}`,
    status: doc.status || "published",
    primaryService: id,
    excerpt: stripHtml(doc.hero?.sub || doc.tldr?.text || ""),
    metaTitle: cleanTitle(doc.meta?.title || ""),
    metaDescription: stripHtml(doc.meta?.description || ""),
    sections: doc,
    faqs: doc.faq?.qas || "",
    cta: doc.cta || {},
    relatedCaseStudies: arr(doc.relatedCaseStudies),
    raw: doc,
  };
}

export function normalizeCaseStudyForAdmin(doc = {}, id = "") {
  const slug = doc.slug || id;
  return {
    id,
    collection: "case_studies",
    contentType: "case-study",
    title: cleanTitle(doc.title || doc.heroTitle || slug),
    slug,
    canonicalPath: doc.canonicalPath || `/case-studies/${slug}`,
    status: doc.status || "draft",
    primaryService: doc.primaryService || "seo",
    industry: doc.industry || "general",
    excerpt: stripHtml(doc.excerpt || doc.heroSubtitle || ""),
    metaTitle: cleanTitle(doc.metaTitle || doc.title || ""),
    metaDescription: stripHtml(doc.metaDescription || doc.excerpt || ""),
    raw: doc,
  };
}

export function prepareBlogPostForSave(formState, existingDoc = {}) {
  const slug = slugify(formState.slug || existingDoc.slug);
  return preserve(existingDoc, {
    ...formState,
    slug,
    seoMeta: {
      ...(existingDoc.seoMeta || {}),
      ...(formState.seoMeta || {}),
      title: cleanTitle(formState.seoMeta?.title || formState.metaTitle || existingDoc.seoMeta?.title || ""),
      metaDescription: formState.seoMeta?.metaDescription || formState.metaDescription || existingDoc.seoMeta?.metaDescription || "",
      canonicalUrl: formState.seoMeta?.canonicalUrl || `/blog/${slug}`,
    },
    postType: formState.postType || existingDoc.postType || "standard",
    primaryService: formState.primaryService ?? existingDoc.primaryService ?? existingDoc.serviceTag ?? null,
    industry: formState.industry ?? existingDoc.industry ?? existingDoc.industryTag ?? "general",
    downloadAsset: formState.downloadAsset || existingDoc.downloadAsset || { enabled: false },
  });
}

export function prepareIndustryPageForSave(formState, existingDoc = {}) {
  const slug = slugify(formState.slug || existingDoc.slug);
  return preserve(existingDoc, { ...formState, slug });
}

export function prepareNichePageForSave(formState, existingDoc = {}) {
  const slug = slugify(formState.slug || existingDoc.slug);
  return preserve(existingDoc, { ...formState, slug });
}

export function prepareServicePageForSave(formState, existingDoc = {}) {
  return preserve(existingDoc, formState);
}

export function normalizeAnyContentForAdmin(collection, id, doc) {
  if (collection === "blog_posts") return normalizeBlogPostForAdmin(doc, id);
  if (collection === "industry_pages") return normalizeIndustryPageForAdmin(doc, id);
  if (collection === "niche_pages") return normalizeNichePageForAdmin(doc, id);
  if (collection === "pages") return normalizeServicePageForAdmin(doc, id);
  if (collection === "case_studies") return normalizeCaseStudyForAdmin(doc, id);
  const slug = doc?.slug || id;
  return {
    id,
    collection,
    contentType: collection,
    title: cleanTitle(doc?.title || doc?.pageTitle || slug),
    slug,
    canonicalPath: getCanonicalPathForContent({ collection, slug, id }),
    status: doc?.status || "published",
    excerpt: stripHtml(doc?.excerpt || doc?.pageSubtitle || ""),
    metaTitle: cleanTitle(doc?.metaTitle || ""),
    metaDescription: stripHtml(doc?.metaDescription || ""),
    raw: doc || {},
  };
}
