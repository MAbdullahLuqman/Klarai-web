import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { breadcrumbSchema, canonical, SITE_URL } from "@/lib/seo-config";
import { safeGetDoc } from "@/lib/firestore-safe";

export const dynamic = "force-dynamic";

async function getCaseStudy(slug) {
  const snap = await safeGetDoc(doc(db, "case_studies", slug), `case_studies/${slug}`);
  if (!snap?.exists?.()) return null;
  return { id: snap.id, slug, ...snap.data() };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study || study.status !== "published") return { title: "Case Study | Klarai" };
  return {
    title: study.metaTitle || study.title || study.heroTitle,
    description: study.metaDescription || study.excerpt || study.heroSubtitle || "",
    alternates: { canonical: canonical(`/case-studies/${slug}`) },
    openGraph: {
      title: study.ogTitle || study.metaTitle || study.title || study.heroTitle,
      description: study.ogDescription || study.metaDescription || study.excerpt || "",
      images: study.ogImage ? [study.ogImage] : undefined,
    },
    robots: study.noindex ? { index: false, follow: true } : undefined,
  };
}

function JsonLd({ study }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: study.title || study.heroTitle,
    description: study.excerpt || study.heroSubtitle || study.metaDescription,
    url: `${SITE_URL}/case-studies/${study.slug}`,
    author: { "@type": "Organization", name: "Klarai", url: SITE_URL },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

function TextSection({ eyebrow, title, children }) {
  if (!children) return null;
  return (
    <section className="mx-auto max-w-[980px] border-t border-black/10 py-12">
      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-medium tracking-tight text-[#2f3438]">{title}</h2>
      <div className="mt-5 whitespace-pre-line text-lg font-medium leading-relaxed text-black/62">{children}</div>
    </section>
  );
}

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study || study.status !== "published") notFound();

  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
    { name: study.title || study.heroTitle, path: `/case-studies/${slug}` },
  ]);

  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <JsonLd study={study} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">{study.industry || "Case study"}</p>
          <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">{study.heroTitle || study.title}</h1>
          <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-black/60">{study.heroSubtitle || study.excerpt}</p>
        </div>
        <aside className="rounded-[1.1rem] border border-black/8 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#9b542a]">Project summary</p>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              ["Client", study.clientName],
              ["Industry", study.industry],
              ["Primary service", study.primaryService],
              ["Project type", study.projectType],
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-5 border-b border-black/8 pb-3">
                <dt className="font-bold text-black/42">{label}</dt>
                <dd className="text-right font-black">{value}</dd>
              </div>
            ))}
          </dl>
          {study.clientWebsite && (
            <a href={study.clientWebsite} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-black text-[#9b542a] hover:underline">
              Visit client site
            </a>
          )}
        </aside>
      </section>

      {study.heroImage && (
        <section className="mx-auto mt-12 max-w-[1180px] overflow-hidden rounded-[1.2rem] border border-black/8 bg-white">
          <img src={study.heroImage} alt={study.heroTitle || study.title} className="h-auto w-full object-cover" />
        </section>
      )}

      <TextSection eyebrow="Problem" title="The problem">{study.problem}</TextSection>
      <TextSection eyebrow="Goals" title="What needed to happen">{study.goals}</TextSection>
      <TextSection eyebrow="Strategy" title="The strategy">{study.strategy}</TextSection>
      <TextSection eyebrow="Execution" title="What we shipped">{study.execution}</TextSection>
      <TextSection eyebrow="Results" title="The result">{study.results}</TextSection>

      {study.metrics?.length > 0 && (
        <section className="mx-auto max-w-[980px] border-t border-black/10 py-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Metrics</p>
          <div className="grid gap-4 md:grid-cols-3">
            {study.metrics.map((metric, index) => (
              <div key={index} className="rounded-[1rem] border border-black/8 bg-white p-6">
                <p className="font-serif text-5xl font-medium text-[#ad5b2b]">{metric.value}</p>
                <h3 className="mt-3 text-sm font-black uppercase tracking-widest">{metric.label}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/54">{metric.context}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {study.timeline?.length > 0 && (
        <section className="mx-auto max-w-[980px] border-t border-black/10 py-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Timeline</p>
          <div className="space-y-4">
            {study.timeline.map((item, index) => (
              <div key={index} className="grid gap-4 rounded-[1rem] border border-black/8 bg-white p-6 md:grid-cols-[140px_1fr]">
                <p className="text-xs font-black uppercase tracking-widest text-black/36">{item.phase}</p>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/58">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {study.stack && <TextSection eyebrow="Stack" title="Tools and systems used">{study.stack}</TextSection>}
      {study.body && <TextSection eyebrow="Detail" title="Additional notes">{study.body}</TextSection>}

      {study.screenshots?.length > 0 && (
        <section className="mx-auto max-w-[980px] border-t border-black/10 py-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Screenshots</p>
          <div className="grid gap-5 md:grid-cols-2">
            {study.screenshots.map((shot, index) => (
              <figure key={index} className="overflow-hidden rounded-[1rem] border border-black/8 bg-white">
                <img src={shot.imageUrl} alt={shot.alt || shot.title} className="h-auto w-full" />
                <figcaption className="p-4">
                  <strong>{shot.title}</strong>
                  {shot.caption && <p className="mt-1 text-sm text-black/54">{shot.caption}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {study.testimonial?.quote && (
        <section className="mx-auto max-w-[980px] border-t border-black/10 py-12">
          <blockquote className="rounded-[1.2rem] bg-[#2f3438] p-8 text-white">
            <p className="font-serif text-3xl font-medium leading-snug">&ldquo;{study.testimonial.quote}&rdquo;</p>
            <footer className="mt-6 text-sm font-black uppercase tracking-widest text-[#e0b48b]">
              {study.testimonial.name} {study.testimonial.role && `- ${study.testimonial.role}`} {study.testimonial.company && `, ${study.testimonial.company}`}
            </footer>
          </blockquote>
        </section>
      )}

      {study.faqs?.length > 0 && (
        <section className="mx-auto max-w-[980px] border-t border-black/10 py-12">
          <h2 className="font-serif text-4xl font-medium tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {study.faqs.map((faq, index) => (
              <details key={index} className="rounded-[1rem] border border-black/8 bg-white p-6">
                <summary className="cursor-pointer font-black">{faq.q}</summary>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/60">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {study.cta?.heading && (
        <section className="mx-auto mt-12 max-w-[980px] rounded-[1.35rem] bg-[#2f3438] px-7 py-14 text-center text-white sm:px-10">
          <h2 className="font-serif text-4xl font-medium leading-tight sm:text-6xl">{study.cta.heading}</h2>
          {study.cta.sub && <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/72">{study.cta.sub}</p>}
          <Link href={study.cta.buttonHref || "/seoauditor"} className="mt-8 inline-flex rounded-md bg-[#ad5b2b] px-7 py-4 text-sm font-black text-white hover:bg-[#8d4822]">
            {study.cta.buttonText || "Start with a free audit"}
          </Link>
        </section>
      )}
    </main>
  );
}
