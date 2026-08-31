import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { canonical, breadcrumbSchema, jsonLd, SITE_URL } from "@/lib/seo-config";
import { safeGetDoc } from "@/lib/firestore-safe";
import { hydrateCaseStudyRefs } from "@/lib/caseStudies";
import RelatedCaseStudies from "@/components/RelatedCaseStudies";

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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(json) }} />;
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(json) }} />;
}

function sectionId(section, index) {
  return String(section.id || section.h2 || `section-${index + 1}`)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function IndustrySlugPage({ params }) {
  const { slug } = await params;
  const page = await getIndustry(slug);
  if (!page) notFound();

  const sections = page.sections || [];
  const related = page.related || [];
  const faqs = page.faqs || [];
  const relatedCaseStudies = await hydrateCaseStudyRefs(page.relatedCaseStudies || []);
  const sectionsWithIds = sections.map((section, index) => ({ ...section, id: sectionId(section, index) }));
  const heroImage = page.imageEnabled === true && page.imageUrl ? page.imageUrl : "";
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: page.hero?.h1 || slug, path: `/industries/${slug}` },
  ]);

  return (
    <main className="min-h-screen bg-white px-5 pb-24 pt-28 text-[#171b1f] sm:px-8 lg:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <ServiceSchema slug={slug} page={page} />
      <FaqSchema qas={faqs} />

      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[250px_minmax(0,760px)] lg:items-start">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-9">
            {sectionsWithIds.length > 0 && (
              <nav className="border-b border-black/10 pb-8">
                <p className="mb-6 text-[9px] font-black uppercase tracking-[0.28em] text-[#9cc600]">Contents</p>
                <ul className="space-y-4">
                  {sectionsWithIds.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="block text-[13px] font-medium leading-5 text-black/55 transition hover:text-black">
                        {section.h2}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {related.length > 0 && (
              <div>
                <p className="mb-5 text-[9px] font-black uppercase tracking-[0.28em] text-[#9cc600]">More to read</p>
                <div className="space-y-5">
                  {related.slice(0, 4).map((r, i) => (
                    <Link key={i} href={r.href} className="block">
                      <p className="mb-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#9cc600]">Guide</p>
                      <p className="text-[13px] font-black leading-5 text-black transition hover:text-[#628000]">{r.label}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <article className="min-w-0">
          <header className="mb-10">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.28em] text-[#9cc600]">Industry hub</p>
            <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight text-[#171b1f] sm:text-7xl">
              {page.hero?.h1}
            </h1>
            {page.hero?.sub && (
              <p className="mt-6 text-lg font-medium leading-8 text-black/58">{page.hero.sub}</p>
            )}
          </header>

          {heroImage && (
            <figure className="mb-12 overflow-hidden rounded-[1.15rem] bg-[#eef1f2] shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
              <img src={heroImage} alt={`${page.hero?.h1 || slug} industry strategy`} className="aspect-[16/9] w-full object-cover" />
            </figure>
          )}

          {page.tldr?.text && (
            <section className="mb-12 rounded-[1.1rem] border border-[#b9ff00] bg-[#fbfff4] p-8">
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/70">Executive summary</p>
              <p className="text-base font-medium leading-8 text-black/78">{page.tldr.text}</p>
            </section>
          )}

          {page.hero?.sub && (
            <p className="mb-20 border-l-4 border-[#ccff00] pl-7 text-2xl font-light leading-[1.32] tracking-tight text-black/82 sm:text-3xl">
              {page.hero.sub}
            </p>
          )}

          <div className="space-y-20">
          {sectionsWithIds.map((s, i) => (
            <section key={i} id={s.id} className="scroll-mt-32">
              <h2 className="font-mono text-3xl font-black uppercase tracking-tight text-[#171b1f]">{s.h2}</h2>
              <div className="mt-6 space-y-5">
                {s.paras?.map((p, idx) => (
                  <p key={idx} className="text-base font-medium leading-8 text-black/62">{p}</p>
                ))}
              </div>
              {s.sub?.length > 0 && (
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  {s.sub.map((sh, j) => (
                    <div key={j} className="rounded-[0.9rem] border border-black/10 bg-[#f8faf7] p-6">
                      <h3 className="text-lg font-black tracking-tight">{sh.h3}</h3>
                      <p className="mt-3 text-sm font-medium leading-7 text-black/58">{sh.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {s.list?.length > 0 && (
                <ul className="mt-7 list-disc space-y-3 pl-5 text-base font-medium leading-8 text-black/62">
                  {s.list.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          </div>

          {related.length > 0 && (
            <section className="mt-20 border-t border-black/10 pt-12">
              <h2 className="font-mono text-2xl font-black uppercase tracking-tight">Related guides</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {related.map((r, i) => (
                  <Link key={i} href={r.href} className="block rounded-[0.9rem] border border-black/10 bg-[#f8faf7] p-6 hover:border-[#ccff00]">
                    <p className="text-sm font-black text-black">{r.label}</p>
                    <p className="mt-2 break-all text-xs font-medium text-black/48">{r.href}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {faqs.length > 0 && (
            <section className="mt-20 border-t border-black/10 pt-12">
              <h2 className="font-mono text-2xl font-black uppercase tracking-tight">Frequently asked questions</h2>
              <div className="mt-6 space-y-4">
                {faqs.map((f, i) => (
                  <details key={i} className="rounded-[0.9rem] border border-black/10 bg-white p-6">
                    <summary className="cursor-pointer text-base font-black">{f.q}</summary>
                    <p className="mt-3 text-sm font-medium leading-7 text-black/58">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {relatedCaseStudies.length > 0 && <RelatedCaseStudies studies={relatedCaseStudies} />}

          {page.cta && (
            <section className="mt-20 rounded-[1rem] border border-[#b9ff00] bg-[#080a0d] px-7 py-14 text-center text-white sm:px-10">
              <h2 className="mx-auto max-w-3xl font-mono text-3xl font-black uppercase leading-[1.08] sm:text-4xl">
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
        </article>
      </div>
    </main>
  );
}
