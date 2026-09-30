import SiteHero from "@/components/SiteHero";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, doc } from "firebase/firestore";
import { canonical } from "@/lib/seo-config";
import { safeGetDoc, safeGetDocs } from "@/lib/firestore-safe";

const DEFAULT_INDUSTRY_SLUGS = [
  "seo-for-plumbers",
  "seo-for-garages",
  "aeo-for-local-business",
  "seo-for-dentists",
  "seo-for-accountants",
];

export const metadata = {
  title: "Industries We Serve | Klarai",
  description: "Explore the high-growth industries and niches where Klarai provides advanced digital architecture, SEO, and conversion-focused growth systems.",
  alternates: {
    canonical: canonical("/industries"),
  },
  openGraph: {
    url: canonical("/industries"),
  },
};

export const dynamic = "force-dynamic";

export default async function IndustriesHubPage() {
  const registrySnap = await safeGetDoc(doc(db, "_meta", "slugs"), "_meta/slugs");
  const registrySlugs = registrySnap?.exists?.() ? registrySnap.data().industrySlugs || [] : [];
  const registeredSlugs = Array.from(new Set([...DEFAULT_INDUSTRY_SLUGS, ...registrySlugs]));

  const docSnaps = await Promise.all(
    registeredSlugs.map((slug) => safeGetDoc(doc(db, "industry_pages", slug), `industry_pages/${slug}`))
  );

  const docsById = new Map();
  docSnaps.forEach((docSnap) => {
    if (docSnap?.exists?.()) docsById.set(docSnap.id, docSnap);
  });

  const collectionSnap = await safeGetDocs(collection(db, "industry_pages"), "industry_pages collection fallback");
  collectionSnap?.forEach?.((docSnap) => {
    docsById.set(docSnap.id, docSnap);
  });

  const niches = Array.from(docsById.values()).map((docSnap) => {
    const data = docSnap.data();
    const slug = data.slug || docSnap.id;
    const safeImageUrl = data.imageEnabled === true && data.imageUrl ? data.imageUrl : "";
    return {
      ...data,
      id: docSnap.id,
      slug,
      source: "industry",
      niche: data.hero?.h1 || slug,
      h1: data.hero?.h1 || slug,
      subheadline: data.hero?.sub || data.tldr?.text?.slice(0, 200) || "",
      service: data.primaryService || data.service || "Industry hub",
      imageUrl: safeImageUrl,
    };
  })
    .filter((item) => item.status !== "archived" && item.published !== false)
    .sort((a, b) => (a.niche || a.slug).localeCompare(b.niche || b.slug));

  return <div className="site-page">
    <SiteHero eyebrow="Industries" description="Different markets. Different customers. We adapt your search and website strategy to the people you want to reach.">Specific markets.<br /><em>Considered solutions.</em></SiteHero>
    <section className="home-container site-work-grid">
      {niches.length === 0 ? <div><h2>Your industry could be next.</h2><p className="mt-5 text-lg">Tell us about your business and we’ll help you find a useful starting point.</p><Link href="/contact" className="home-button mt-8">Talk to us ↗</Link></div> : niches.map((niche, index) => <article key={niche.id} className="site-work-card">
        {niche.imageUrl && <div className="site-work-image"><img src={niche.imageUrl} alt={`${niche.niche} industry`} loading="lazy" className="h-full w-full object-cover" /></div>}
        <div className="site-work-body"><span className="site-number">0{index + 1} / {niche.service}</span><h2><Link href={`/industries/${niche.slug}`}>{niche.niche}</Link></h2><p>{niche.subheadline || `A practical visibility strategy for ${niche.niche}.`}</p><div className="home-actions"><Link className="home-button" href={`/industries/${niche.slug}`}>Explore industry ↗</Link></div></div>
      </article>)}
    </section>
    <section className="site-callout"><div className="home-container"><h2>Don’t see your <em>industry?</em></h2><p>Let’s talk about your market and the people you want to reach.</p><Link href="/contact" className="home-button home-button-solid">Start a conversation ↗</Link></div></section>
  </div>;
}
