import { SITE_URL } from "@/lib/seo-config";

const urls = [
  "",
  "/services",
  "/industries",
  "/blog",
  "/case-studies",
  "/portfolio",
  "/about",
  "/contact",
  "/seoauditor",

  "/services/seo-services",
  "/services/aeo-services",
  "/services/web-development",
  "/services/technical-seo-audit",
  "/services/seo-content-writing-services",
  "/services/white-label-seo-agency",

  "/industries/seo-for-accountants",
  "/industries/aeo-for-local-business",
  "/industries/seo-for-saas",
  "/industries/saas-website-design-agency",
  "/industries/seo-for-dentists",
  "/industries/seo-for-garages",
  "/industries/seo-for-plumbers",

  "/case-studies/pitchside-ai-free-tools-strategy",
  "/case-studies/klarai-zero-domain-authority-geo-aeo-growth",

  "/blog/how-to-do-seo-for-accountants",
  "/blog/what-technical-seo-audit-includes",
  "/blog/agencies-that-redesign-websites-for-fast-growing-saas-companies",
  "/blog/saas-website-design-agency",
  "/blog/how-to-do-seo-for-dentists",
  "/blog/what-is-answer-engine-optimisation",
  "/blog/seo-for-garages-uk",
  "/blog/plumbing-seo-keywords",
  "/blog/seo-for-plumbers",
  "/blog/aeo-vs-seo-vs-geo",
  "/blog/how-to-rank-google-ai-overviews-uk",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default function sitemap() {
  return urls.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    changeFrequency: path.startsWith("/blog/")
      ? "monthly"
      : path === ""
        ? "weekly"
        : "monthly",
    priority:
      path === ""
        ? 1
        : path.startsWith("/services/")
          ? 0.9
          : path.startsWith("/industries/")
            ? 0.9
            : path.startsWith("/blog/")
              ? 0.7
              : 0.6,
  }));
}
