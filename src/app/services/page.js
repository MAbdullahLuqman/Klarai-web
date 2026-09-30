import SiteHero from "@/components/SiteHero";
import HomepageServices from "@/components/HomepageServices";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { canonical } from "@/lib/seo-config";
import { mergeServicePageContent } from "@/lib/service-page-content";
import { safeGetDoc } from "@/lib/firestore-safe";
import { stripHtml } from "@/lib/html";

export const metadata = {
  title: "Services | Klarai",
  description: "Klarai services for SEO, AEO and high-converting web development.",
  alternates: {
    canonical: canonical("/services"),
  },
  openGraph: {
    url: canonical("/services"),
  },
};

const serviceCards = [
  {
    id: "aeo",
    path: "/services/aeo-services",
    tag: "Answer systems",
    fallbackTitle: "Answer Engine Optimisation",
    fallbackSub: "Structure your expertise so AI answer engines can understand, cite and recommend your brand.",
  },
  {
    id: "seo",
    path: "/services/seo-services",
    tag: "Search foundations",
    fallbackTitle: "Technical & Local SEO",
    fallbackSub: "Fix the architecture, speed, schema and local signals that make your site rankable.",
  },
  {
    id: "web",
    path: "/services/web-development",
    tag: "Conversion builds",
    fallbackTitle: "High-Converting Web Development",
    fallbackSub: "Build fast, modern sites that rank from day one and turn visitors into enquiries.",
  },
  {
    id: "technicalAudit",
    path: "/services/technical-seo-audit",
    tag: "Technical audits",
    fallbackTitle: "Technical SEO Audit",
    fallbackSub: "Find crawl, indexation, rendering and performance issues, then turn them into a fix plan.",
  },
  {
    id: "contentWriting",
    path: "/services/seo-content-writing-services",
    tag: "Content systems",
    fallbackTitle: "SEO Content Writing Services",
    fallbackSub: "Plan and write useful pages around search intent, expert input, internal links and lead paths.",
  },
  {
    id: "whiteLabel",
    path: "/services/white-label-seo-agency",
    tag: "Agency delivery",
    fallbackTitle: "White Label SEO Agency",
    fallbackSub: "Confidential SEO delivery support for agencies that need reliable technical and content work.",
  },
];

const process = [
  ["Audit", "We find the technical, content and authority gaps suppressing visibility."],
  ["Architect", "We map search intent and AI-answer intent into a page structure buyers can trust."],
  ["Build", "We ship pages, schema, copy blocks and conversion paths with speed and clarity."],
];

async function getServiceCard(service) {
  const docSnap = await safeGetDoc(doc(db, "pages", service.id), `pages/${service.id}`);
  const data = mergeServicePageContent(service.id, docSnap?.data?.() || {});

  return {
    ...service,
    title: stripHtml(data.hero?.h1) || service.fallbackTitle,
    sub: stripHtml(data.hero?.sub) || service.fallbackSub,
  };
}

export default async function ServicesHubPage() {
  const services = await Promise.all(serviceCards.map(getServiceCard));

  return <div className="site-page">
    <SiteHero eyebrow="Our services" description="Search, AI answers, and websites. Connected so your business is easier to find, understand, and choose." actions={<><Link href="/seoauditor" className="home-button home-button-solid">Run an SEO audit ↗</Link><Link href="/contact" className="home-button">Let’s talk ↗</Link></>}>
      Good businesses deserve<br /><em>to be found.</em>
    </SiteHero>
    <section className="home-services site-section">
      <div className="home-container"><div className="home-section-intro"><p className="home-eyebrow">What we do</p><h2 className="site-section-title">A clearer path to <em>growth.</em></h2></div>
        <HomepageServices services={services.map(service => ({ href: service.path, title: service.fallbackTitle, body: service.sub, cta: "Explore service" }))} />
      </div>
    </section>
    <section className="site-section home-container"><p className="home-eyebrow">How we work</p><h2 className="site-section-title">From first look to <em>launch.</em></h2><div className="site-editorial-rows">
      {process.map(([title, body], index) => <article className="site-editorial-row" key={title}><span className="site-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
    </div></section>
    <section className="site-callout"><div className="home-container"><h2>Where should we <em>start?</em></h2><p>An audit shows what’s holding your site back and where the next useful improvement belongs.</p><Link href="/seoauditor" className="home-button home-button-solid">Find your next step ↗</Link></div></section>
  </div>;
}
