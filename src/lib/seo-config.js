export const SITE_URL = "https://klarai.uk";
export const SITE_NAME = "Klarai";

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

export function canonical(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
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
