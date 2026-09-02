import React from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, doc, limit, query } from "firebase/firestore";
import { notFound } from "next/navigation";
import { jsonLd, removedNicheSlugs, SITE_URL } from "@/lib/seo-config";
import { mergeServicePageContent } from "@/lib/service-page-content";
import { safeGetDoc, safeGetDocs } from "@/lib/firestore-safe";
import { hydrateCaseStudyRefs } from "@/lib/caseStudies";
import RelatedCaseStudies from "@/components/RelatedCaseStudies";
import ServiceLeadForm from "@/components/ServiceLeadForm";

const stripTags = (value = "") => String(value).replace(/<[^>]*>/g, "").trim();

const richTextLines = (value = "") => String(value)
  .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<\/?p[^>]*>/gi, "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const parseCollapsedDelimitedText = (line, delimiter) => {
  if (delimiter === "|") {
    const matches = [...line.matchAll(/([^|?]+\?)\|([\s\S]*?)(?=\s+[A-Z][^|?]+\?\||$)/g)];
    if (matches.length > 1) {
      return matches.map((match) => ({ title: stripTags(match[1]), desc: match[2].trim() }));
    }
  }

  if (delimiter === ":") {
    const matches = [...line.matchAll(/([A-Z][A-Za-z0-9 &/,-]+):\s*([\s\S]*?)(?=\s+[A-Z][A-Za-z0-9 &/,-]+:\s|$)/g)];
    if (matches.length > 1) {
      return matches.map((match) => ({ title: stripTags(match[1]), desc: match[2].trim() }));
    }
  }

  return null;
};

const parseDelimitedList = (value, delimiter = ":") => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        title: stripTags(item.title || item.name || item.heading || item.q || item.question || ""),
        desc: item.desc || item.description || item.text || item.a || item.answer || "",
      }))
      .filter((item) => item.title || item.desc);
  }
  return richTextLines(value).flatMap((line) => {
      const collapsedItems = parseCollapsedDelimitedText(line, delimiter);
      if (collapsedItems) return collapsedItems;
      const parts = line.split(delimiter);
      return {
        title: stripTags(parts[0] || ""),
        desc: parts.slice(1).join(delimiter)?.trim() || "",
      };
    });
};

const parsePricingTier = (text) => {
  if (!text) return null;
  const [name, price, link, features] = text.split("|");
  return {
    name: name?.trim() || "",
    price: price?.trim() || "",
    link: link?.trim() || "#",
    features: features ? features.split(",").map((feature) => feature.trim()).filter(Boolean) : [],
  };
};

function SectionEyebrow({ children, light = false }) {
  return (
    <p className={`mb-5 text-[10px] font-black uppercase tracking-[0.24em] ${light ? "text-[#e0b48b]" : "text-black/36"}`}>
      {children}
    </p>
  );
}

function CheckIcon() {
  return <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6f8fa3]" />;
}

function JsonLdScript({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLd(data),
      }}
    />
  );
}

export default async function ServiceLayout({ serviceId, pageOverride = null }) {
  const docSnap = pageOverride ? null : await safeGetDoc(doc(db, "pages", serviceId), `pages/${serviceId}`);
  const page = pageOverride || mergeServicePageContent(serviceId, docSnap?.exists?.() ? docSnap.data() : {});
  if (!page.hero?.h1) notFound();
  const relatedCaseStudies = await hydrateCaseStudyRefs(page.relatedCaseStudies || []);

  let activeNiches = [];
  try {
    const nicheQuery = query(collection(db, "niche_pages"), limit(4));
    const nicheDocs = await safeGetDocs(nicheQuery, "niche_pages preview");
    activeNiches = (nicheDocs?.docs || [])
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((niche) => !removedNicheSlugs.has(niche.slug || niche.id));
  } catch (error) {}

  const includedItems = parseDelimitedList(page.included?.items, ":");
  const processSteps = parseDelimitedList(page.process?.steps, ":");
  const faqs = parseDelimitedList(page.faq?.qas, "|");
  const contentSections = Array.isArray(page.sections) ? page.sections : [];
  const proofStats = Array.isArray(page.hero?.proof) ? page.hero.proof : [];
  const deliverableRows = Array.isArray(page.deliverables?.rows) ? page.deliverables.rows : [];
  const beforeAfter = page.beforeAfter?.visible !== false ? page.beforeAfter : null;
  const caseStudyParts = page.results?.caseStudy ? stripTags(page.results.caseStudy).split("|").map((part) => part.trim()) : [];
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.desc.replace(/<[^>]*>/g, ""),
      },
    })),
  } : null;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: stripTags(page.hero?.h1),
    serviceType: page.serviceType || stripTags(page.hero?.h1),
    provider: {
      "@type": "ProfessionalService",
      name: "Klarai",
      url: SITE_URL,
    },
    areaServed: "GB",
  };

  const pricing = {
    starter: parsePricingTier(page.pricing?.starter),
    growth: parsePricingTier(page.pricing?.growth),
    premium: parsePricingTier(page.pricing?.premium),
  };

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      <JsonLdScript data={serviceSchema} />
      {faqSchema && <JsonLdScript data={faqSchema} />}

      {page.hero?.visible !== false && (
        <section className="relative overflow-hidden bg-[#1f2528] px-5 pb-16 pt-40 text-white sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,37,40,0.94),rgba(31,37,40,0.72),rgba(31,37,40,0.36)),url('/klarai-service-hero.jpg')] bg-cover bg-center" />
          <div className="relative mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <SectionEyebrow light>{page.hero?.eyebrow || "Klarai service"}</SectionEyebrow>
              <h1 className="max-w-5xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
                {stripTags(page.hero?.h1)}
              </h1>
            </div>
            <div className="rounded-[1.2rem] border border-white/12 bg-white/12 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm">
              <div className="text-lg font-medium leading-relaxed text-white/72" dangerouslySetInnerHTML={{ __html: page.hero?.sub || "" }} />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {page.hero?.btn1Text && (
                  <Link href={page.hero.btn1Link || "/contact"} className="rounded-md bg-[#ad5b2b] px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-[#8d4822]">
                    {page.hero.btn1Text}
                  </Link>
                )}
                {page.hero?.btn2Text && (
                  <Link href={page.hero.btn2Link || "/services"} className="rounded-md border border-white/24 px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10">
                    {page.hero.btn2Text}
                  </Link>
                )}
              </div>
            </div>
          </div>
          {proofStats.length > 0 && (
            <div className="relative mx-auto mt-14 grid max-w-[1480px] gap-px overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {proofStats.map((stat, index) => (
                <div key={index} className="bg-[#1f2528]/72 p-5 backdrop-blur-sm">
                  <div className="font-serif text-3xl font-medium text-[#e0b48b]">{stat.value}</div>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-white/58">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {page.tldr?.visible !== false && page.tldr?.text && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1120px] border-y border-black/10 py-10">
            <SectionEyebrow>{stripTags(page.tldr?.h2 || "TL;DR")}</SectionEyebrow>
            <div className="font-serif text-2xl font-medium leading-snug text-[#2f3438] sm:text-3xl" dangerouslySetInnerHTML={{ __html: page.tldr.text }} />
          </div>
        </section>
      )}

      {page.problem?.visible !== false && page.problem?.paras?.length > 0 && (
        <section className="bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <SectionEyebrow>Problem</SectionEyebrow>
              <h2 className="sticky top-32 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.problem.h2)}</h2>
            </div>
            <div className="space-y-6 text-lg font-medium leading-relaxed text-black/62">
              {page.problem.paras.map((paragraph, index) => (
                <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {page.definition?.visible !== false && (
        <section id="what-is" className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionEyebrow>Definition</SectionEyebrow>
              <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.definition?.h2)}</h2>
            </div>
            <div className="rounded-[1.2rem] border border-black/8 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
              <div className="text-lg font-medium leading-relaxed text-black/60" dangerouslySetInnerHTML={{ __html: page.definition?.para || "" }} />
              {page.definition?.bullets && (
                <ul className="mt-8 space-y-4 border-t border-black/8 pt-7">
                  {page.definition.bullets.split("\n").filter(Boolean).map((bullet, index) => (
                    <li key={index} className="flex gap-3 text-base font-bold text-[#2f3438]">
                      <CheckIcon />
                      <span dangerouslySetInnerHTML={{ __html: bullet }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {page.included?.visible !== false && includedItems.length > 0 && (
        <section className="border-y border-black/8 bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <SectionEyebrow>Included</SectionEyebrow>
            <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.included?.h2)}</h2>
            <div className={`mt-14 grid gap-4 md:grid-cols-2 ${includedItems.length === 1 ? "lg:grid-cols-1" : "lg:grid-cols-3"}`}>
              {includedItems.map((item, index) => (
                <div key={index} className="rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                  <div className="mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#6f8fa3]">0{index + 1}</div>
                  <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                  <div className="mt-4 text-sm font-medium leading-relaxed text-black/54" dangerouslySetInnerHTML={{ __html: item.desc }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.audience?.visible !== false && page.audience?.text && (
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-8 border-y border-black/10 py-14 lg:grid-cols-[0.45fr_1fr] lg:items-start">
            <div>
              <SectionEyebrow>Fit</SectionEyebrow>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{stripTags(page.audience.h2)}</h2>
            </div>
            <div className="text-xl font-medium leading-relaxed text-black/60" dangerouslySetInnerHTML={{ __html: page.audience.text }} />
          </div>
        </section>
      )}

      {page.deliverables?.visible !== false && deliverableRows.length > 0 && (
        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <SectionEyebrow>{page.deliverables.eyebrow || "Deliverables"}</SectionEyebrow>
            <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.deliverables.h2)}</h2>
            <div className="mt-10 overflow-hidden rounded-[1.1rem] border border-black/8 bg-white">
              {deliverableRows.map((row, index) => (
                <div key={index} className="grid gap-3 border-t border-black/8 p-6 first:border-t-0 md:grid-cols-[0.38fr_1fr]">
                  <h3 className="text-base font-black tracking-tight">{row.label}</h3>
                  <p className="text-sm font-medium leading-relaxed text-black/56">{row.value}</p>
                </div>
              ))}
            </div>
            {page.deliverables.note && <p className="mt-6 text-sm font-bold leading-relaxed text-black/45">{page.deliverables.note}</p>}
          </div>
        </section>
      )}

      {beforeAfter && (
        <section className="border-y border-black/8 bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <SectionEyebrow>{beforeAfter.eyebrow || "Before and after"}</SectionEyebrow>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(beforeAfter.h2)}</h2>
              {beforeAfter.text && <p className="max-w-xl text-base font-medium leading-relaxed text-black/55">{beforeAfter.text}</p>}
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[1.1rem] border border-black/8 bg-[#f9f5ec] p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/36">Before</p>
                <h3 className="mt-4 text-3xl font-black tracking-tight">{beforeAfter.beforeTitle || "Before Klarai"}</h3>
                <p className="mt-4 text-base font-medium leading-relaxed text-black/56">{beforeAfter.beforeText}</p>
              </div>
              <div className="rounded-[1.1rem] border border-[#ad5b2b]/20 bg-[#2f3438] p-7 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">After</p>
                <h3 className="mt-4 text-3xl font-black tracking-tight">{beforeAfter.afterTitle || "After Klarai"}</h3>
                <p className="mt-4 text-base font-medium leading-relaxed text-white/62">{beforeAfter.afterText}</p>
              </div>
            </div>
            {beforeAfter.image && (
              <div className="mt-5 overflow-hidden rounded-[1.1rem] border border-black/8 bg-[#f9f5ec]">
                <Image src={beforeAfter.image} alt={beforeAfter.imageAlt || ""} width={2048} height={650} className="h-auto w-full" />
              </div>
            )}
            {beforeAfter.sitePreview && (
              <div className="mt-5 overflow-hidden rounded-[1.1rem] border border-black/8 bg-[#151b1e]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e0b48b]">Site preview</p>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-white">{beforeAfter.sitePreview.title}</h3>
                  </div>
                  <a href={beforeAfter.sitePreview.url} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/15 px-4 py-2 text-xs font-black text-white transition hover:bg-white/10">
                    Open site
                  </a>
                </div>
                <iframe src={beforeAfter.sitePreview.url} title={beforeAfter.sitePreview.title} loading="lazy" className="h-[520px] w-full bg-white" />
              </div>
            )}
            {Array.isArray(beforeAfter.stats) && beforeAfter.stats.length > 0 && (
              <div className="mt-5 grid gap-px overflow-hidden rounded-[1.1rem] border border-black/8 bg-black/8 sm:grid-cols-2 lg:grid-cols-4">
                {beforeAfter.stats.map((stat, index) => (
                  <div key={index} className="bg-[#f9f5ec] p-6">
                    <div className="font-serif text-4xl font-medium text-[#ad5b2b]">{stat.value}</div>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-black/44">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
            {Array.isArray(beforeAfter.queries) && beforeAfter.queries.length > 0 && (
              <div className="mt-5 overflow-hidden rounded-[1.1rem] border border-black/8 bg-white">
                <div className="grid grid-cols-[1fr_0.22fr_0.28fr] gap-3 bg-[#2f3438] p-4 text-[10px] font-black uppercase tracking-[0.16em] text-white/58">
                  <span>Top queries</span>
                  <span>Clicks</span>
                  <span>Impressions</span>
                </div>
                {beforeAfter.queries.slice(0, 12).map((query, index) => (
                  <div key={index} className="grid grid-cols-[1fr_0.22fr_0.28fr] gap-3 border-t border-black/8 p-4 text-sm font-bold text-black/62">
                    <span>{query.term}</span>
                    <span>{query.clicks}</span>
                    <span>{query.impressions}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {page.results?.visible !== false && (
        <section className="bg-[#2f3438] px-5 py-24 text-white sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1200px] gap-10 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-8 md:p-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionEyebrow light>{page.results?.h2 || "Proof"}</SectionEyebrow>
              {caseStudyParts.length >= 2 && (
                <div>
                  <div className="font-serif text-6xl font-medium text-[#e0b48b]">{caseStudyParts[1]}</div>
                  <p className="mt-4 text-xl font-bold text-white">{caseStudyParts[0]} {caseStudyParts[2] || ""}</p>
                </div>
              )}
            </div>
            <div className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="text-xl font-medium leading-relaxed text-white/68" dangerouslySetInnerHTML={{ __html: page.results?.text || page.results?.quote || "" }} />
              {page.results?.note && <p className="mt-6 text-sm font-bold leading-relaxed text-white/42">{page.results.note}</p>}
              {page.results?.author && <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#6f8fa3]">{page.results.author}</p>}
            </div>
          </div>
        </section>
      )}

      {page.process?.visible !== false && processSteps.length > 0 && (
        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <SectionEyebrow>Process</SectionEyebrow>
              <h2 className="sticky top-32 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.process?.h2)}</h2>
            </div>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div key={index} className="grid gap-6 rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:grid-cols-[0.2fr_1fr]">
                  <div className="text-4xl font-black tracking-tight text-[#ad5b2b]">0{index + 1}</div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">{step.title}</h3>
                    <div className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-black/54" dangerouslySetInnerHTML={{ __html: step.desc }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.engagement?.visible !== false && page.engagement?.text && (
        <section className="border-y border-black/8 bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.45fr_1fr] lg:items-start">
            <div>
              <SectionEyebrow>Engagement</SectionEyebrow>
              <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.engagement.h2)}</h2>
            </div>
            <div className="text-xl font-medium leading-relaxed text-black/60" dangerouslySetInnerHTML={{ __html: page.engagement.text }} />
          </div>
        </section>
      )}

      {page.pricing?.visible !== false && pricing.starter && (
        <section className="border-y border-black/8 bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <SectionEyebrow>Pricing</SectionEyebrow>
            <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.pricing?.h2)}</h2>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[pricing.starter, pricing.growth, pricing.premium].filter(Boolean).map((tier, index) => (
                <div key={tier.name} className={`rounded-[1.2rem] border p-7 ${index === 1 ? "border-[#ad5b2b]/35 bg-[#2f3438] text-white shadow-[0_30px_90px_rgba(47,52,56,0.22)]" : "border-black/8 bg-[#f9f5ec] text-[#2f3438]"}`}>
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] opacity-62">{tier.name}</h3>
                  <div className="mt-4 font-serif text-5xl font-medium">{tier.price}</div>
                  <Link href={tier.link} className={`mt-7 block rounded-md px-5 py-3.5 text-center text-sm font-black transition ${index === 1 ? "bg-[#ad5b2b] text-white hover:bg-[#8d4822]" : "bg-white text-[#2f3438] hover:bg-[#f4efe4]"}`}>
                    Get started
                  </Link>
                  <ul className="mt-7 space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex gap-3 text-sm font-medium leading-relaxed opacity-72">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {contentSections.length > 0 && (
        <section className="bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto space-y-20 max-w-[1480px]">
            {contentSections.map((section, index) => (
              <article key={section.id || index} id={section.id || undefined} className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
                <div>
                  <SectionEyebrow>Service guide</SectionEyebrow>
                  <h2 className="sticky top-32 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(section.heading)}</h2>
                </div>
                <div className="space-y-8">
                  <div className="space-y-6 text-lg font-medium leading-relaxed text-black/62">
                    {(section.content || []).filter(Boolean).map((paragraph, paragraphIndex) => (
                      <div key={paragraphIndex} dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ))}
                  </div>
                  {(section.subheadings || []).filter((subheading) => subheading.title || subheading.content?.length).map((subheading, subIndex) => (
                    <div key={subIndex} className="rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                      {subheading.title && <h3 className="text-3xl font-black tracking-tight">{stripTags(subheading.title)}</h3>}
                      <div className="mt-4 space-y-4 text-base font-medium leading-relaxed text-black/54">
                        {(subheading.content || []).filter(Boolean).map((paragraph, paragraphIndex) => (
                          <div key={paragraphIndex} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {page.faq?.visible !== false && faqs.length > 0 && (
        <section className="bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.faq?.h2)}</h2>
            <div className="mt-12 divide-y divide-black/10 rounded-[1.1rem] border border-black/8 bg-white">
              {faqs.map((faq, index) => (
                <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 p-7 text-xl font-black tracking-tight">
                    {faq.title}
                    <span className="text-[#ad5b2b] transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-7 pb-7 text-base font-medium leading-relaxed text-black/56" dangerouslySetInnerHTML={{ __html: faq.desc }} />
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeNiches.length > 0 && (
        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <SectionEyebrow>Industry pages</SectionEyebrow>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">Sector-specific architecture.</h2>
              <p className="max-w-xl text-base font-medium leading-relaxed text-black/55">Generic strategies yield generic results. We tailor the structure to your industry search behaviour and conversion triggers.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {activeNiches.map((niche, index) => (
                <Link key={niche.id || index} href={`/niche/${niche.slug}`} className="rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[#6f8fa3]/50">
                  <h3 className="text-xl font-black tracking-tight">{niche.niche || niche.h1}</h3>
                  <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-black/52">{niche.subheadline || "Explore tailored architecture."}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedCaseStudies.length > 0 && (
        <section className="px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <RelatedCaseStudies studies={relatedCaseStudies} />
          </div>
        </section>
      )}

      {page.cta?.visible !== false && (
        <section className="bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-10 rounded-[1.4rem] bg-[#2f3438] p-10 text-white shadow-[0_35px_100px_rgba(47,52,56,0.22)] md:p-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionEyebrow light>Next step</SectionEyebrow>
              <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{stripTags(page.cta?.h2)}</h2>
              <div className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-white/62" dangerouslySetInnerHTML={{ __html: page.cta?.text || "" }} />
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href={page.cta?.btnLink || "/seoauditor"} className="rounded-md bg-[#ad5b2b] px-8 py-4 text-center text-sm font-black text-white transition hover:bg-[#8d4822]">
                  {page.cta?.btnText}
                </Link>
                {page.cta?.secondaryText && (
                  <Link href={page.cta?.secondaryLink || "/contact"} className="rounded-md border border-white/18 px-8 py-4 text-center text-sm font-black text-white transition hover:bg-white/10">
                    {page.cta.secondaryText}
                  </Link>
                )}
              </div>
            </div>
            <ServiceLeadForm service={stripTags(page.hero?.h1)} />
          </div>
        </section>
      )}
    </div>
  );
}
