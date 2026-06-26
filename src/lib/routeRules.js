import { buildLegacyPath } from "@/lib/slugUtils";

export const CONTENT_ROUTE_RULES = {
  blog_posts: { label: "Blog", basePath: "/blog", slugField: "slug" },
  industry_pages: { label: "Industry", basePath: "/industries", slugField: "slug" },
  niche_pages: { label: "Niche", basePath: "/niche", slugField: "slug" },
  case_studies: { label: "Case Study", basePath: "/case-studies", slugField: "slug" },
  static_pages: { label: "Static Page", basePath: "", slugField: "slug" },
  pages: { label: "Service Page", basePath: "/services", slugField: "slug" },
};

export function getCanonicalPathForContent(item = {}) {
  if (item.canonicalPath) return item.canonicalPath;
  const slug = item.slug || item.id;
  return buildLegacyPath(item.collection, slug);
}

export function getContentTypeFromCollection(collection) {
  if (collection === "blog_posts") return "blog";
  if (collection === "industry_pages") return "industry";
  if (collection === "niche_pages") return "niche";
  if (collection === "case_studies") return "case-study";
  if (collection === "static_pages") return "static";
  if (collection === "pages") return "service";
  return "content";
}
