import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { breadcrumbSchema, canonical, jsonLd, SITE_URL } from "@/lib/seo-config";
import { safeGetDoc } from "@/lib/firestore-safe";
import { defaultCaseStudies } from "@/lib/case-study-content";

export const dynamic = "force-dynamic";

async function getCaseStudy(slug) {
  const snap = await safeGetDoc(doc(db, "case_studies", slug), `case_studies/${slug}`);
  if (snap?.exists?.()) return { id: snap.id, slug, ...snap.data() };
  return defaultCaseStudies[slug] ? { id: slug, ...defaultCaseStudies[slug] } : null;
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
      url: canonical(`/case-studies/${slug}`),
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(json) }} />;
}

function TextSection({ eyebrow, title, children }) {
  if (!children) return null;
  return (
    <section id={eyebrow.toLowerCase()} className="grid gap-8 border-t border-black/10 py-14 lg:grid-cols-[0.36fr_0.64fr]">
      <div>
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">{eyebrow}</p>
        <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-[#2f3438]">{title}</h2>
      </div>
      <div className="whitespace-pre-line text-lg font-medium leading-relaxed text-black/62">{children}</div>
    </section>
  );
}

function getHeroImage(study, slug) {
  if (study.heroImage) return study.heroImage;
  if (slug.includes("pitchside")) return "/images/pitchside-search-performance.png";
  return "/images/aeo-generative-performance.png";
}

const pitchsideImages = [
  { src: "/images/pitchside-case-study-01.png", alt: "Pitchside AI homepage and beta walkthrough", position: "object-top" },
  { src: "/images/pitchside-case-study-02.png", alt: "Pitchside AI app sections and match stats", position: "object-[center_42%]" },
];

function PitchsideHardcodedCaseStudy({ study, breadcrumb }) {
  const details = [
    ["Client", "Pitchside AI"],
    ["Role", "SEO / AEO / Front-end"],
    ["Scope", "Launch search system"],
    ["Year", "2026"],
  ];
  const sections = [
    ["Context", "Grassroots football is recorded on phones, shared in chats and then forgotten. Pitchside turns that footage into highlights, stats and player moments."],
    ["Challenge", "Communicate an ambitious AI product while the category is still new, without leaning on keyword-volume data that showed almost no demand."],
    ["Approach", "Lead with the cinematic product world, then step down into practical evidence: walkthroughs, event labels, feature pages and beta caveats."],
  ];
  const shots = [
    ["01 - Hero: Own the cage", pitchsideImages[0].src, "object-top", "h-[72vh]"],
    ["02 - Private beta walkthrough", pitchsideImages[0].src, "object-[center_24%]", "h-[72vh]"],
    ["03 - Event taxonomy", pitchsideImages[0].src, "object-[center_42%]", "h-[72vh]"],
    ["04 - Record. Play. Replay.", pitchsideImages[1].src, "object-[center_40%]", "h-[72vh]"],
    ["05 - App mockups", pitchsideImages[1].src, "object-[center_58%]", "h-[72vh]"],
  ];
  const takeaways = [
    "Floodlit black, thermal reds and signal-lime visuals make the work feel like football technology, not generic SaaS.",
    "The page sells private beta access with direct product evidence instead of abstract claims.",
    "Search architecture is treated like product design: every page has a job, a user intent and a measurable proof point.",
  ];

  return (
    <main className="bg-[#f4efe4] text-[#151b1e]">
      <JsonLd study={study} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />

      <section className="px-5 pt-28 sm:px-8">
        <div className="relative mx-auto h-[78vh] max-w-[1400px] overflow-hidden rounded-lg border border-black/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
          <Image src={pitchsideImages[0].src} alt="Pitchside.ai homepage hero" fill priority sizes="(max-width: 768px) 100vw, 1400px" className="object-cover object-[center_4%]" />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-4 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div className="bg-white/52 p-7 sm:p-9">
          <Link href="/case-studies" className="mb-6 inline-flex text-[10px] font-black uppercase tracking-[0.24em] text-black/38 transition hover:text-[#ad5b2b]">
            Back to case studies
          </Link>
          <h1 className="max-w-5xl text-4xl font-black leading-[0.94] tracking-tight text-[#151b1e] sm:text-6xl lg:text-[clamp(3rem,4.2vw,5rem)]">
            Pitchside AI is a football recording and highlights platform built for grassroots teams, players and parents.
          </h1>
        </div>
        <aside className="bg-[#0b3a2a] p-7 text-white sm:p-9">
          <p className="mb-6 text-[10px] font-black uppercase tracking-[0.22em] text-[#e0b48b]">Project Details</p>
          <dl className="space-y-5 text-sm leading-relaxed text-white/66">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="font-black text-[#e0b48b]">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 md:grid-cols-3">
        {sections.map(([heading, body]) => (
          <div key={heading}>
            <h2 className="text-sm font-black uppercase tracking-[0.22em] text-[#ad5b2b]">{heading}</h2>
            <p className="mt-4 text-[0.95rem] font-medium leading-relaxed text-black/58">{body}</p>
          </div>
        ))}
      </section>

      <section id="work" className="mx-auto max-w-5xl space-y-20 px-5 pb-24 sm:px-8">
        {shots.map(([caption, src, position, height]) => (
          <figure key={caption}>
            <div className={`relative ${height} overflow-hidden rounded-lg border border-black/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.12)]`}>
              <Image src={src} alt={caption} fill sizes="(max-width: 768px) 100vw, 1024px" className={`object-cover ${position}`} />
            </div>
            <figcaption className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-black/38">{caption}</figcaption>
          </figure>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <h2 className="font-serif text-3xl font-medium tracking-tight text-[#151b1e] sm:text-4xl">
          The whole page, end to end
        </h2>
        <p className="mt-3 max-w-xl text-sm font-medium text-black/54">
          Scroll inside the frame to run the full homepage top to bottom.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-black/10 bg-white p-3 shadow-[0_40px_120px_rgba(0,0,0,0.12)]">
          <div className="h-[70vh] overflow-y-auto rounded-md bg-black">
            <Image
              src={pitchsideImages[1].src}
              alt="Full-length scrolling capture of the Pitchside.ai homepage"
              width={1536}
              height={14762}
              sizes="(max-width: 768px) 100vw, 960px"
              className="block h-auto w-full"
            />
          </div>
        </div>
        <div className="mx-auto mt-3 h-2 w-1/3 rounded-b-xl bg-[#e0b48b]" />
      </section>

      <section id="takeaways" className="mx-auto max-w-4xl px-5 pb-28 sm:px-8">
        <h2 className="text-sm font-black uppercase tracking-[0.22em] text-[#ad5b2b]">Takeaways</h2>
        <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {takeaways.map((item) => (
            <li key={item} className="flex gap-6 py-5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ad5b2b]" />
              <p className="text-[0.95rem] font-medium leading-relaxed text-black/58">{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-black/10 px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <Link href="/case-studies" className="font-serif text-4xl font-medium tracking-tight text-[#151b1e] transition hover:text-[#ad5b2b] sm:text-6xl">
            All cases
          </Link>
          <div className="text-sm font-medium text-black/54">
            <a href="https://pitchside.ai" target="_blank" rel="noreferrer" className="font-black text-[#151b1e] underline decoration-[#ad5b2b] underline-offset-4">
              Visit pitchside.ai
            </a>
            <p className="mt-2">© 2026 Klarai</p>
          </div>
        </div>
      </footer>
    </main>
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
  if (slug.includes("pitchside")) return <PitchsideHardcodedCaseStudy study={study} breadcrumb={breadcrumb} />;

  const heroImage = getHeroImage(study, slug);
  const navItems = [
    ["Overview", "#overview"],
    ["Problem", "#problem"],
    ["Strategy", "#strategy"],
    ["Results", "#results"],
    ["Metrics", "#metrics"],
  ].filter(([label]) => label !== "Metrics" || study.metrics?.length);

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2f3438]">
      <JsonLd study={study} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />

      <section className="px-5 pb-14 pt-32 sm:px-8 lg:h-screen lg:px-12 lg:pb-8 lg:pt-24">
        <div className="mx-auto flex h-full max-w-[1480px] flex-col lg:min-h-0">
          <Link href="/case-studies" className="mb-7 inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-black/38 transition-[color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-[#ad5b2b] active:scale-[0.98] lg:mb-5">
            Back to case studies
          </Link>
          <div className="grid gap-8 lg:grid-cols-[0.94fr_0.42fr] lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-black/36 lg:mb-3">{study.industry || "Case study"}</p>
              <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-[clamp(3.4rem,5.2vw,5.25rem)]">{study.heroTitle || study.title}</h1>
              <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-black/60 lg:mt-4 lg:text-base">{study.heroSubtitle || study.excerpt}</p>
            </div>
            <aside className="bg-[#151b1e] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.14)] lg:p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#e0b48b]">Navigate</p>
              <nav className="mt-3 divide-y divide-white/10">
                {navItems.map(([label, href]) => (
                  <a key={label} href={href} className="flex items-center justify-between py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-white/72 transition-[color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-white active:scale-[0.98]">
                    {label}
                    <span aria-hidden="true">+</span>
                  </a>
                ))}
              </nav>
            </aside>
          </div>
          <div className="relative mt-10 aspect-[16/8] min-h-[280px] overflow-hidden bg-[#d8d4cd] shadow-[0_30px_90px_rgba(33,39,38,0.18)] lg:mt-6 lg:min-h-0 lg:flex-1">
            {heroImage.startsWith("/") ? (
              <Image src={heroImage} alt={study.heroTitle || study.title} fill priority sizes="(max-width: 768px) 100vw, 1480px" className="object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImage} alt={study.heroTitle || study.title} className="h-full w-full object-cover" />
            )}
          </div>
        </div>
      </section>

      <section id="overview" className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-10 border-t border-black/10 py-14 lg:grid-cols-[0.42fr_0.58fr]">
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Overview</p>
            <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight">Project summary</h2>
          </div>
          <div>
            <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
              {[
                ["Client", study.clientName],
                ["Industry", study.industry],
                ["Primary service", study.primaryService],
                ["Project type", study.projectType],
              ].filter(([, value]) => value).map(([label, value]) => (
                <div key={label} className="border-t border-black/10 pt-3">
                  <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-black/38">{label}</dt>
                  <dd className="mt-2 font-black">{value}</dd>
                </div>
              ))}
            </dl>
            {study.clientWebsite && (
              <a href={study.clientWebsite} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex bg-[#151b1e] px-6 py-3.5 text-sm font-black text-white transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#ad5b2b] active:scale-[0.98]">
                Visit client site
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1480px]">
          <TextSection eyebrow="Problem" title="The problem">{study.problem}</TextSection>
          <TextSection eyebrow="Goals" title="What needed to happen">{study.goals}</TextSection>
          <TextSection eyebrow="Strategy" title="The strategy">{study.strategy}</TextSection>
          <TextSection eyebrow="Execution" title="What we shipped">{study.execution}</TextSection>
          <TextSection eyebrow="Results" title="The result">{study.results}</TextSection>
        </div>
      </section>

      {study.metrics?.length > 0 && (
        <section id="metrics" className="bg-white px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Metrics</p>
          <div className="grid gap-px overflow-hidden bg-black/10 md:grid-cols-2 lg:grid-cols-4">
            {study.metrics.map((metric, index) => (
              <div key={index} className="bg-white p-6">
                <p className="font-serif text-5xl font-medium text-[#ad5b2b]">{metric.value}</p>
                <h3 className="mt-3 text-sm font-black uppercase tracking-widest">{metric.label}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/54">{metric.context}</p>
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {study.timeline?.length > 0 && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Timeline</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {study.timeline.map((item, index) => (
              <div key={index} className="bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.04)]">
                <p className="text-xs font-black uppercase tracking-widest text-[#ad5b2b]">{item.phase}</p>
                <h3 className="mt-8 text-2xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/58">{item.description}</p>
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      <section className="px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1480px]">
          {study.stack && <TextSection eyebrow="Stack" title="Tools and systems used">{study.stack}</TextSection>}
          {study.body && <TextSection eyebrow="Detail" title="Additional notes">{study.body}</TextSection>}
        </div>
      </section>

      {study.screenshots?.length > 0 && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px] border-t border-black/10 pt-12">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Screenshots</p>
          <div className="grid gap-5 md:grid-cols-2">
            {study.screenshots.map((shot, index) => (
              <figure key={index} className="overflow-hidden border border-black/8 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.imageUrl} alt={shot.alt || shot.title} className="h-auto w-full" />
                <figcaption className="p-4">
                  <strong>{shot.title}</strong>
                  {shot.caption && <p className="mt-1 text-sm text-black/54">{shot.caption}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
          </div>
        </section>
      )}

      {study.testimonial?.quote && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <blockquote className="mx-auto max-w-[1180px] bg-[#2f3438] p-8 text-white sm:p-12">
            <p className="font-serif text-3xl font-medium leading-snug">&ldquo;{study.testimonial.quote}&rdquo;</p>
            <footer className="mt-6 text-sm font-black uppercase tracking-widest text-[#e0b48b]">
              {study.testimonial.name} {study.testimonial.role && `- ${study.testimonial.role}`} {study.testimonial.company && `, ${study.testimonial.company}`}
            </footer>
          </blockquote>
        </section>
      )}

      {study.faqs?.length > 0 && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1180px] border-t border-black/10 pt-12">
          <h2 className="font-serif text-4xl font-medium tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {study.faqs.map((faq, index) => (
              <details key={index} className="border border-black/8 bg-white p-6">
                <summary className="cursor-pointer font-black">{faq.q}</summary>
                <p className="mt-3 text-sm font-medium leading-relaxed text-black/60">{faq.a}</p>
              </details>
            ))}
          </div>
          </div>
        </section>
      )}

      {study.cta?.heading && (
        <section className="px-5 pb-24 pt-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px] bg-[#151b1e] px-7 py-14 text-center text-white sm:px-10">
            <h2 className="font-serif text-4xl font-medium leading-tight sm:text-6xl">{study.cta.heading}</h2>
            {study.cta.sub && <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/72">{study.cta.sub}</p>}
            <Link href={study.cta.buttonHref || "/seoauditor"} className="mt-8 inline-flex bg-[#ad5b2b] px-7 py-4 text-sm font-black text-white transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-[#8d4822] active:scale-[0.98]">
              {study.cta.buttonText || "Start with a free audit"}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
