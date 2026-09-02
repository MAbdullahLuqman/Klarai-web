import React from "react";
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

  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
            Sector expertise
          </p>
          <h1 className="font-serif text-6xl font-medium leading-[0.96] tracking-tight sm:text-8xl">
            Search systems for specific markets.
          </h1>
        </div>
        <p className="max-w-2xl text-lg font-medium leading-relaxed text-black/58 lg:justify-self-end">
          Every industry has different search intent, buyer anxiety, local patterns, and conversion moments. These niche pages show how Klarai adapts visibility architecture to the market in front of us.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-[1480px]">
        {niches.length === 0 ? (
          <div className="rounded-[1.1rem] border border-black/8 bg-white p-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
            <p className="text-lg font-black tracking-tight">No industry modules are live yet.</p>
            <p className="mt-2 text-sm font-medium text-black/52">Upload industry pages via the admin panel to populate this hub.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {niches.map((niche) => (
              <Link key={`${niche.source || "niche"}-${niche.id}`} href={niche.source === "industry" ? `/industries/${niche.slug}` : `/niche/${niche.slug}`} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-black/8 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:border-[#ad5b2b]/42">
                  {niche.imageUrl && (
                    <div className="relative h-56 overflow-hidden bg-[#e9e1d4]">
                      <img src={niche.imageUrl} alt={`${niche.niche} SEO and marketing`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(13,18,20,0.72)_100%)]" />
                      <span className="absolute bottom-4 left-4 rounded-full border border-white/12 bg-[#151b1e]/86 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                        {niche.service || "Growth systems"}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-2xl font-black tracking-tight transition group-hover:text-[#ad5b2b]">
                      {niche.niche || niche.h1 || "Industry partner"}
                    </h2>
                    <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-black/56">
                      {niche.subheadline || `Advanced digital architecture and predictable visibility systems designed specifically for ${niche.niche || niche.h1 || "your business"}.`}
                    </p>
                    <span className="mt-8 inline-flex text-sm font-black text-[#9b542a]">
                      Explore sector
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto mt-20 max-w-[1480px] rounded-[1.35rem] bg-[#2f3438] px-7 py-16 text-center text-white sm:px-10">
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-[#e0b48b]">
          Custom market
        </p>
        <h2 className="mx-auto max-w-3xl font-serif text-5xl font-medium leading-[0.98] sm:text-7xl">
          Do not see your industry?
        </h2>
        <Link href="/seoauditor" className="mt-9 inline-flex rounded-md bg-white px-7 py-4 text-sm font-black text-[#2f3438] transition hover:bg-[#e0b48b]">
          Request custom audit
        </Link>
      </section>
    </main>
  );
}
