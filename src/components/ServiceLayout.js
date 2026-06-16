import React from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, doc, limit, query } from "firebase/firestore";
import { notFound } from "next/navigation";
import { removedNicheSlugs } from "@/lib/seo-config";
import { mergeServicePageContent } from "@/lib/service-page-content";
import { safeGetDoc, safeGetDocs } from "@/lib/firestore-safe";

const parseDelimitedList = (text, delimiter = ":") => {
  if (!text) return [];
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(delimiter);
      return {
        title: parts[0]?.trim() || "",
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
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function ServiceLayout({ serviceId }) {
  const docSnap = await safeGetDoc(doc(db, "pages", serviceId), `pages/${serviceId}`);
  const page = mergeServicePageContent(serviceId, docSnap?.exists?.() ? docSnap.data() : {});
  if (!page.hero?.h1) notFound();

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
  const caseStudyParts = page.results?.caseStudy ? page.results.caseStudy.split("|").map((part) => part.trim()) : [];
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

  const pricing = {
    starter: parsePricingTier(page.pricing?.starter),
    growth: parsePricingTier(page.pricing?.growth),
    premium: parsePricingTier(page.pricing?.premium),
  };

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#2f3438] selection:bg-[#ad5b2b] selection:text-white">
      {faqSchema && <JsonLdScript data={faqSchema} />}

      {page.hero?.visible !== false && (
        <section className="relative overflow-hidden px-5 pb-24 pt-40 sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,rgba(111,143,163,0.22)_0%,rgba(111,143,163,0)_34%),radial-gradient(circle_at_18%_24%,rgba(173,91,43,0.16)_0%,rgba(173,91,43,0)_32%)]" />
          <div className="relative mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <SectionEyebrow>Service architecture</SectionEyebrow>
              <h1
                className="max-w-5xl font-serif text-5xl font-medium leading-[0.98] tracking-tight text-[#2f3438] sm:text-7xl lg:text-8xl"
                dangerouslySetInnerHTML={{ __html: page.hero?.h1 || "" }}
              />
            </div>
            <div className="rounded-[1.2rem] border border-black/8 bg-white/72 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur-sm">
              <p className="text-lg font-medium leading-relaxed text-black/58" dangerouslySetInnerHTML={{ __html: page.hero?.sub || "" }} />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {page.hero?.btn1Text && (
                  <Link href={page.hero.btn1Link || "/contact"} className="rounded-md bg-[#ad5b2b] px-6 py-3.5 text-center text-sm font-black text-white transition hover:bg-[#8d4822]">
                    {page.hero.btn1Text}
                  </Link>
                )}
                {page.hero?.btn2Text && (
                  <Link href={page.hero.btn2Link || "/services"} className="rounded-md border border-[#ad5b2b] px-6 py-3.5 text-center text-sm font-black text-[#9b542a] transition hover:bg-white">
                    {page.hero.btn2Text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {page.tldr?.visible !== false && page.tldr?.text && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1120px] border-y border-black/10 py-10">
            <SectionEyebrow>{page.tldr?.h2 || "TL;DR"}</SectionEyebrow>
            <p className="font-serif text-2xl font-medium leading-snug text-[#2f3438] sm:text-3xl" dangerouslySetInnerHTML={{ __html: page.tldr.text }} />
          </div>
        </section>
      )}

      {page.problem?.visible !== false && page.problem?.paras?.length > 0 && (
        <section className="bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <SectionEyebrow>Problem</SectionEyebrow>
              <h2 className="sticky top-32 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.problem.h2}</h2>
            </div>
            <div className="space-y-6 text-lg font-medium leading-relaxed text-black/62">
              {page.problem.paras.map((paragraph, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
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
              <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.definition?.h2}</h2>
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
            <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.included?.h2}</h2>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {includedItems.map((item, index) => (
                <div key={index} className="rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                  <div className="mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#6f8fa3]">0{index + 1}</div>
                  <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-black/54">{item.desc}</p>
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
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-6xl">{page.audience.h2}</h2>
            </div>
            <p className="text-xl font-medium leading-relaxed text-black/60" dangerouslySetInnerHTML={{ __html: page.audience.text }} />
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
              <p className="text-xl font-medium leading-relaxed text-white/68" dangerouslySetInnerHTML={{ __html: page.results?.text || page.results?.quote || "" }} />
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
              <h2 className="sticky top-32 font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.process?.h2}</h2>
            </div>
            <div className="space-y-4">
              {processSteps.map((step, index) => (
                <div key={index} className="grid gap-6 rounded-[1.1rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)] sm:grid-cols-[0.2fr_1fr]">
                  <div className="text-4xl font-black tracking-tight text-[#ad5b2b]">0{index + 1}</div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-black/54">{step.desc}</p>
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
              <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.engagement.h2}</h2>
            </div>
            <p className="text-xl font-medium leading-relaxed text-black/60" dangerouslySetInnerHTML={{ __html: page.engagement.text }} />
          </div>
        </section>
      )}

      {page.pricing?.visible !== false && pricing.starter && (
        <section className="border-y border-black/8 bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <SectionEyebrow>Pricing</SectionEyebrow>
            <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.pricing?.h2}</h2>
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

      {page.faq?.visible !== false && faqs.length > 0 && (
        <section className="bg-[#f9f5ec] px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.faq?.h2}</h2>
            <div className="mt-12 divide-y divide-black/10 rounded-[1.1rem] border border-black/8 bg-white">
              {faqs.map((faq, index) => (
                <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 p-7 text-xl font-black tracking-tight">
                    {faq.title}
                    <span className="text-[#ad5b2b] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-7 pb-7 text-base font-medium leading-relaxed text-black/56" dangerouslySetInnerHTML={{ __html: faq.desc }} />
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

      {page.cta?.visible !== false && (
        <section className="bg-white px-5 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1050px] rounded-[1.4rem] bg-[#2f3438] p-10 text-center text-white shadow-[0_35px_100px_rgba(47,52,56,0.22)] md:p-16">
            <SectionEyebrow light>Next step</SectionEyebrow>
            <h2 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl">{page.cta?.h2}</h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-white/62" dangerouslySetInnerHTML={{ __html: page.cta?.text || "" }} />
            <Link href={page.cta?.btnLink || "/free-audit"} className="mt-9 inline-flex rounded-md bg-[#ad5b2b] px-8 py-4 text-sm font-black text-white transition hover:bg-[#8d4822]">
              {page.cta?.btnText}
            </Link>
            {page.cta?.secondaryText && (
              <Link href={page.cta?.secondaryLink || "/contact"} className="ml-4 mt-9 inline-flex rounded-md border border-white/18 px-8 py-4 text-sm font-black text-white transition hover:bg-white/10">
                {page.cta.secondaryText}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
