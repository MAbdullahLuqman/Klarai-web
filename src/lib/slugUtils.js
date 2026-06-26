export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "blog",
  "services",
  "industries",
  "niche",
  "portfolio",
  "case-studies",
  "tools",
  "about",
  "contact",
  "privacy-policy",
  "terms-and-conditions",
  "terms",
  "sitemap.xml",
  "robots.txt",
  "llms.txt",
  "login",
  "dashboard",
  "seoauditor",
  "free-audit",
  "seo-result",
]);

export const ALLOWED_SERVICE_SLUGS = new Set(["seo-services", "aeo-services", "web-development"]);

export function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isReservedSlug(slug, { allowServiceSlug = false } = {}) {
  const normalized = slugify(slug);
  if (allowServiceSlug && ALLOWED_SERVICE_SLUGS.has(normalized)) return false;
  return RESERVED_SLUGS.has(normalized);
}

export function buildLegacyPath(collection, slug) {
  const normalized = slugify(slug);
  if (!normalized) return "";
  if (collection === "blog_posts") return `/blog/${normalized}`;
  if (collection === "industry_pages") return `/industries/${normalized}`;
  if (collection === "niche_pages") return `/niche/${normalized}`;
  if (collection === "case_studies") return `/case-studies/${normalized}`;
  if (collection === "pages") return `/services/${normalized}`;
  return `/${normalized}`;
}
