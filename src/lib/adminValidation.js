import { cleanTitle } from "@/lib/adminContentAdapters";
import { extractLinksFromHtml, isInternalHref } from "@/lib/internalLinking";

export function hasRawBlockTags(value = "") {
  return /<\/?(p|h1|h2|div|br)\b[^>]*>/i.test(String(value));
}

export function countInternalLinks(html = "") {
  return extractLinksFromHtml(html).filter((link) => isInternalHref(link.href)).length;
}

export function buildSeoChecklist(item = {}) {
  const raw = item.raw || item;
  const bodyHtml = [
    raw.quickAnswer,
    ...(Array.isArray(raw.intro) ? raw.intro : []),
    ...(Array.isArray(raw.sections) ? raw.sections.flatMap((section) => [section.heading, ...(section.content || [])]) : []),
    raw.body,
  ].filter(Boolean).join("\n");

  const title = item.title || raw.title || raw.heroTitle || raw.hero?.title || raw.hero?.h1 || raw.h1;
  const metaTitle = item.metaTitle || raw.metaTitle || raw.meta?.title || raw.seoMeta?.title;
  const metaDescription = item.metaDescription || raw.metaDescription || raw.meta?.description || raw.seoMeta?.metaDescription;
  const cta = item.cta || raw.cta || raw.toolBlock;
  const faqs = item.faqs || raw.faqs || [];

  return [
    { id: "title", label: "Title/H1 exists", ok: Boolean(cleanTitle(title || "")) },
    { id: "slug", label: "Slug exists", ok: Boolean(item.slug || raw.slug) },
    { id: "canonical", label: "Canonical path exists", ok: Boolean(item.canonicalPath || raw.canonicalPath || raw.seoMeta?.canonicalUrl) },
    { id: "meta-title", label: "Meta title exists", ok: Boolean(cleanTitle(metaTitle || "")) },
    { id: "meta-description", label: "Meta description exists", ok: Boolean(metaDescription) },
    { id: "excerpt", label: "Excerpt/description exists", ok: Boolean(item.excerpt || raw.excerpt || raw.hero?.description || raw.heroSubtitle) },
    { id: "body", label: "Body/content exists", ok: Boolean(bodyHtml.trim()) },
    { id: "cta", label: "CTA exists", ok: Boolean(cta?.title || cta?.heading || cta?.h2 || cta?.btnText || cta?.ctaText) },
    { id: "faqs", label: "FAQs exist", ok: Array.isArray(faqs) && faqs.length > 0 },
    { id: "internal-links", label: "At least 2 internal links for long-form pages", ok: countInternalLinks(bodyHtml) >= 2 },
    { id: "no-internal-nofollow", label: "No internal nofollow links", ok: !extractLinksFromHtml(bodyHtml).some((link) => isInternalHref(link.href) && link.isNofollow) },
    { id: "clean-title", label: "No raw block tags in title/meta", ok: !hasRawBlockTags(title) && !hasRawBlockTags(metaTitle) },
    { id: "sitemap", label: "Sitemap eligible when published", ok: raw.status !== "published" || raw.noindex === true || raw.showInSitemap !== false },
    {
      id: "download",
      label: "Guide/checklist posts have download asset",
      ok: !["guide", "checklist", "keyword-list"].includes(raw.postType) || raw.downloadAsset?.enabled === true,
    },
  ];
}
