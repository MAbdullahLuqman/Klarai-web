import { SITE_URL } from "@/lib/seo-config";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/portfolio",
  "/free-audit",
  "/seoauditor",
  "/industries",
  "/services",
  "/services/seo-services",
  "/services/aeo-services",
  "/services/web-development",
  "/blog",
  "/privacy-policy",
  "/terms-and-conditions",
];

export default async function sitemap() {
  const now = new Date();

  // Fetch slug registry — single getDoc, always permitted by Firestore rules
  let blogSlugs = [];
  let industrySlugs = [];
  let nicheSlugs = [];
  let caseStudySlugs = [];
  try {
    const snap = await getDoc(doc(db, "_meta", "slugs"));
    if (snap.exists()) {
      const data = snap.data();
      blogSlugs = data.blogSlugs || [];
      industrySlugs = data.industrySlugs || [];
      nicheSlugs = data.nicheSlugs || [];
      caseStudySlugs = data.caseStudySlugs || [];
    }
  } catch {
    // Registry not created yet — sitemap falls back to static routes only
  }

  return [
    ...staticRoutes.map((p) => ({
      url: `${SITE_URL}${p || "/"}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p === "" ? 1 : 0.7,
    })),
    ...industrySlugs.map((s) => ({
      url: `${SITE_URL}/industries/${s}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...nicheSlugs.map((s) => ({
      url: `${SITE_URL}/niche/${s}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...blogSlugs.map((s) => ({
      url: `${SITE_URL}/blog/${s}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...caseStudySlugs.map((s) => ({
      url: `${SITE_URL}/case-studies/${s}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
