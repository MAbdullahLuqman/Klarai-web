export const SERVICE_ROUTES = {
  "seo-services": {
    id: "seo",
    label: "Technical & Local SEO",
    path: "/services/seo-services",
  },
  "aeo-services": {
    id: "aeo",
    label: "Answer Engine Optimisation",
    path: "/services/aeo-services",
  },
  "web-development": {
    id: "web",
    label: "High-Converting Web Development",
    path: "/services/web-development",
  },
};

export const SERVICE_ID_TO_SLUG = Object.fromEntries(
  Object.entries(SERVICE_ROUTES).map(([slug, service]) => [service.id, slug])
);

export function getServiceBySlug(slug) {
  return SERVICE_ROUTES[slug] || null;
}

export function getServicePathById(serviceId) {
  const slug = SERVICE_ID_TO_SLUG[serviceId];
  return slug ? SERVICE_ROUTES[slug].path : "/services";
}
