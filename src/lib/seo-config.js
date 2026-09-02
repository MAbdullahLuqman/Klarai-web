export const SITE_URL = "https://www.klarai.uk";
export const SITE_NAME = "Klarai";
const SITE_HOST = new URL(SITE_URL).hostname;
const OWN_HOSTS = new Set(["klarai.uk", SITE_HOST]);

export const removedNicheRedirects = {
  "/niche/seo-for-pest-control": "/services/seo-services",
  "/niche/seo-for-will-writers-uk": "/services/seo-services",
  "/niche/seo-for-custom-tuning-garages-uk": "/industries/seo-for-garages",
  "/niche/web-design-for-tuning-garages-uk": "/industries/seo-for-garages",
  "/niche/web-design-for-architects-uk": "/services/web-development",
  "/niche/seo-for-plumbers": "/blog/seo-for-plumbers",
};

export const removedNicheSlugs = new Set(
  Object.keys(removedNicheRedirects).map((path) => path.replace("/niche/", ""))
);

export const redirectedCaseStudySlugs = new Set(["pitchside-ai"]);

export function canonical(path = "/") {
  if (/^https?:\/\//.test(path)) {
    const url = new URL(path);
    if (!OWN_HOSTS.has(url.hostname)) return path;
    url.protocol = "https:";
    url.hostname = SITE_HOST;
    url.port = "";
    return url.toString();
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/klarailogo.webp`,
    sameAs: ["https://www.linkedin.com/company/klarai-uk/"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  };
}
