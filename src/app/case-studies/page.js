import SiteHero from "@/components/SiteHero";
import Image from "next/image";
import Link from "next/link";
import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Case Studies | Klarai",
  description: "Selected Klarai case studies across SEO, AEO and web development.",
  alternates: { canonical: canonical("/case-studies") },
  openGraph: { url: canonical("/case-studies") },
};

const cases = [
  {
    title: "Pitchside.ai",
    discipline: "SEO / AEO / Web",
    href: "/case-studies/pitchside-ai-free-tools-strategy",
    image: "/images/pitchside-case-study-01.png",
    marker: "Live",
  },
  {
    title: "Zero authority growth",
    discipline: "GEO / AEO",
    href: "/case-studies/klarai-zero-domain-authority-geo-aeo-growth",
    image: "/images/aeo-generative-performance.png",
    marker: "Klarai",
  },

];

export default function CaseStudiesPage() {
  return <div className="site-page"><SiteHero eyebrow="Case studies" description="A closer look at the strategy, decisions, and work behind our search and web projects.">The thinking behind<br /><em>the results.</em></SiteHero>
    <section className="home-container site-work-grid">{cases.map(item => <article className="site-work-card" key={item.href}><Link href={item.href} className="site-work-image"><Image src={item.image} alt={`${item.title} case study`} fill sizes="(max-width: 767px) calc(100vw - 48px), 584px" /></Link><div className="site-work-body"><span className="home-eyebrow">{item.discipline}</span><h2><Link href={item.href}>{item.title}</Link></h2><div className="home-actions"><Link href={item.href} className="home-button">Read the story ↗</Link></div></div></article>)}</section>
    <section className="site-callout"><div className="home-container"><h2>Your next chapter<br /><em>starts here.</em></h2><p>Let’s find the right approach for your business.</p><Link className="home-button home-button-solid" href="/contact">Start a project ↗</Link></div></section>
  </div>;
}
