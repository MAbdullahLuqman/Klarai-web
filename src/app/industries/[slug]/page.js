import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { canonical, breadcrumbSchema, SITE_URL } from "@/lib/seo-config";
import { safeGetDoc } from "@/lib/firestore-safe";

export const dynamic = "force-dynamic";

async function getIndustry(slug) {
  const snap = await safeGetDoc(doc(db, "industry_pages", slug), `industry_pages/${slug}`);
  if (!snap?.exists?.()) return null;
  return { id: snap.id, slug, ...snap.data() };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getIndustry(slug);
  if (!page) return { title: "Industry | Klarai" };
  return {
    title: page.meta?.title || `${page.hero?.h1 || slug} | Klarai`,
    description: page.meta?.description || page.tldr?.text?.slice(0, 160) || "",
    alternates: { canonical: canonical(`/industries/${slug}`) },
  };
}

function FaqSchema({ qas }) {
  if (!qas || qas.length === 0) return null;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function ServiceSchema({ slug, page }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.hero?.h1 || slug,
    description: page.meta?.description || page.tldr?.text || "",
    provider: { "@type": "Organization", name: "Klarai", url: SITE_URL },
    areaServed: "United Kingdom",
    url: `${SITE_URL}/industries/${slug}`,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export default async function IndustrySlugPage({ params }) {
  const { slug } = await params;
  const page = await getIndustry(slug);
  if (!page) notFound();

  const sections = page.sections || [];
  const related = page.related || [];
  const faqs = page.faqs || [];
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: page.hero?.h1 || slug, path: `/industries/${slug}` },
  ]);

  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ServiceSchema slug={slug} page={page} />
      <FaqSchema qas={faqs} />

      <section className="mx-auto max-w-[1100px]">
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">Industry hub</p>
        <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
          {page.hero?.h1}
        </h1>
        {page.hero?.sub && (
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-black/60">{page.hero.sub}</p>
        )}
        {page.hero?.cta && (
          <Link
            href={page.hero?.ctaHref || "/seoauditor"}
            className="mt-9 inline-flex rounded-md bg-[#2f3438] px-7 py-4 text-sm font-black text-white transition hover:bg-[#ad5b2b]"
          >
            {page.hero.cta}
          </Link>
        )}
      </section>

      {page.tldr?.text && (
        <section className="mx-auto mt-16 max-w-[1100px] rounded-[1.1rem] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">TL;DR</p>
          <p className="text-base font-medium leading-relaxed text-black/70">{page.tldr.text}</p>
        </section>
      )}

      <section className="mx-auto mt-20 max-w-[1100px] space-y-14">
        {sections.map((s, i) => (
          <article key={i}>
            <h2 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight">{s.h2}</h2>
            {s.paras?.map((p, idx) => (
              <p key={idx} className="mt-5 text-base font-medium leading-relaxed text-black/70">{p}</p>
            ))}
            {s.sub?.length > 0 && (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {s.sub.map((sh, j) => (
                  <div key={j} className="rounded-[1rem] border border-black/8 bg-white p-6">
                    <h3 className="text-lg font-black tracking-tight">{sh.h3}</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-black/64">{sh.text}</p>
                  </div>
                ))}
              </div>
            )}
            {s.list?.length > 0 && (
              <ul className="mt-5 list-disc space-y-2 pl-5 text-base font-medium leading-relaxed text-black/70">
                {s.list.map((item, k) => <li key={k}>{item}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1100px]">
          <h2 className="font-serif text-3xl font-medium tracking-tight">Related guides</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((r, i) => (
              <Link key={i} href={r.href} className="block rounded-[1rem] border border-black/8 bg-white p-6 hover:border-[#ad5b2b]/40">
                <p className="text-sm font-black text-[#9b542a]">{r.label}</p>
                <p className="mt-2 text-base font-medium text-black/70">{r.href}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1100px]">
          <h2 className="font-serif text-3xl font-medium tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-5">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-[1rem] border border-black/8 bg-white p-6">
                <summary className="cursor-pointer text-base font-black">{f.q}</summary>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/64">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {page.cta && (
        <section className="mx-auto mt-20 max-w-[1100px] rounded-[1.35rem] bg-[#2f3438] px-7 py-16 text-center text-white sm:px-10">
          <h2 className="mx-auto max-w-3xl font-serif text-4xl font-medium leading-[1.05] sm:text-6xl">
            {page.cta.heading}
          </h2>
          {page.cta.sub && (
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/72">{page.cta.sub}</p>
          )}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href={page.cta.primaryHref || "/seoauditor"} className="rounded-md bg-white px-7 py-4 text-sm font-black text-[#2f3438] transition hover:bg-[#e0b48b]">
              {page.cta.primary}
            </Link>
            {page.cta.secondary && (
              <Link href={page.cta.secondaryHref || "/contact"} className="rounded-md border border-white/24 px-7 py-4 text-sm font-black text-white transition hover:border-[#e0b48b]">
                {page.cta.secondary}
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
