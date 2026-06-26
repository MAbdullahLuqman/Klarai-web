import { getCanonicalPathForContent } from "@/lib/routeRules";

const OWN_HOSTS = new Set(["klarai.uk", "www.klarai.uk", "localhost"]);

export function extractLinksFromHtml(html = "") {
  const links = [];
  const pattern = /<a\b([^>]*)>(.*?)<\/a>/gis;
  let match;
  while ((match = pattern.exec(String(html)))) {
    const attrs = match[1] || "";
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
    const rel = attrs.match(/\brel=["']([^"']+)["']/i)?.[1] || "";
    const anchorText = match[2].replace(/<[^>]*>/g, "").trim();
    links.push({ href, rel, anchorText, isNofollow: /\bnofollow\b/i.test(rel) });
  }
  return links;
}

export function isInternalHref(href = "") {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href);
    return OWN_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function normalizeInternalPath(href = "") {
  if (href.startsWith("/")) return href.split("#")[0].split("?")[0];
  try {
    const url = new URL(href);
    return url.pathname;
  } catch {
    return href;
  }
}

export function getInternalLinkIssues(html = "", contentItems = []) {
  const knownPaths = new Set(contentItems.map(getCanonicalPathForContent).filter(Boolean));
  const links = extractLinksFromHtml(html);
  const issues = [];

  links.forEach((link) => {
    if (!isInternalHref(link.href)) return;
    const path = normalizeInternalPath(link.href);
    if (!link.anchorText) issues.push({ type: "empty-anchor", link });
    if (link.isNofollow) issues.push({ type: "internal-nofollow", link });
    if (knownPaths.size && !knownPaths.has(path)) issues.push({ type: "broken-internal", link, path });
  });

  return issues;
}

export function getContentHtmlForLinks(item = {}) {
  const doc = item.raw || item;
  return [
    doc.quickAnswer,
    ...(Array.isArray(doc.intro) ? doc.intro : []),
    ...(Array.isArray(doc.tldr) ? doc.tldr : []),
    ...(Array.isArray(doc.sections)
      ? doc.sections.flatMap((section) => [
          section.heading,
          ...(section.content || []),
          ...(section.list || []),
          ...(section.subheadings || []).flatMap((sub) => [sub.title, ...(sub.content || []), ...(sub.list || [])]),
        ])
      : []),
    doc.tldr?.text,
    ...(Array.isArray(doc.faqs) ? doc.faqs.flatMap((faq) => [faq.q, faq.question, faq.a, faq.answer]) : []),
  ]
    .filter(Boolean)
    .join("\n");
}

export function suggestInternalLinks(source = {}, targets = []) {
  const service = source.primaryService || source.serviceTag;
  const industry = String(source.industry || source.industryTag || source.slug || "").toLowerCase();
  const suggestions = [];

  const add = (target, reason) => {
    if (!target || target.id === source.id && target.collection === source.collection) return;
    if (!suggestions.some((item) => item.target.canonicalPath === target.canonicalPath)) {
      suggestions.push({ target, reason });
    }
  };

  add(targets.find((item) => item.collection === "pages" && (item.id === service || item.primaryService === service)), "Relevant service page");
  add(targets.find((item) => item.collection === "industry_pages" && industry && String(item.slug).includes(industry)), "Relevant industry hub");
  targets
    .filter((item) => item.collection === "blog_posts" && item.id !== source.id)
    .slice(0, 2)
    .forEach((item) => add(item, "Related blog post"));
  add(targets.find((item) => item.collection === "case_studies" && item.status === "published"), "Related case study proof");

  return suggestions.slice(0, 6);
}
