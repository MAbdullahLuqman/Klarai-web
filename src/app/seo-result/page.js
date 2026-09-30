import Link from "next/link";
import SiteHero from "@/components/SiteHero";

const RANKING_DATA = [
  { keyword: "answer engine optimisation", country: "UK", position: 53, volume: "High", intent: "Informational" },
  { keyword: "top plumbing keywords", country: "UK", position: 17, volume: "Medium", intent: "Commercial" },
  { keyword: "plumbing keywords list", country: "UK", position: 29, volume: "Medium", intent: "Informational" },
  { keyword: "seo mot garage", country: "UK", position: 36, volume: "Low", intent: "Commercial" },
  { keyword: "plumbing seo keywords", country: "UK", position: 41, volume: "Medium", intent: "Commercial" },
  { keyword: "seo for plumbers", country: "UK", position: 91, volume: "High", intent: "Commercial" },
];

const STRATEGY_POINTS = [
  {
    title: "Long‑Tail SEO Content",
    desc: "Targeted highly specific, problem-aware queries instead of competing for impossible short-tail keywords immediately.",
    tags: ["Informational Intent", "Niche Pages", "Conversational Phrasing"]
  },
  {
    title: "Answer Engine Optimization",
    desc: "Structured content for AI Overviews, ChatGPT retrieval, featured snippets, and semantic search matching.",
    tags: ["FAQ Sections", "Direct Answers", "Entity Coverage"]
  },
  {
    title: "Industry Topical Clusters",
    desc: "Built authority inside specific industries (Plumbing SEO, MOT Garage SEO) rather than random blog posts.",
    tags: ["Plumbing SEO", "MOT Garage", "Local Intent"]
  },
  {
    title: "Technical Foundations",
    desc: "Sitemap optimization, semantic heading structures, internal linking architecture, and crawlability improvements.",
    tags: ["Crawlability", "Mobile", "Schema"]
  }
];

const GEO_REACH = ["United Kingdom", "United States", "Pakistan", "Sweden", "Spain", "Kuwait"];

export default function SeoResultPage() {
  return <div className="site-page">
    <SiteHero eyebrow="Klarai search case study" description="How a new domain started building search visibility through useful content, technical foundations, and a focused industry strategy." actions={<Link className="home-button home-button-solid" href="/case-studies/klarai-zero-domain-authority-geo-aeo-growth">Read the full case study ↗</Link>}>Small beginnings.<br /><em>Visible progress.</em></SiteHero>
    <section className="site-section home-container"><h2 className="site-section-title">The work behind<br /><em>the visibility.</em></h2><div className="site-editorial-rows">{STRATEGY_POINTS.map((point, index) => <article className="site-editorial-row" key={point.title}><span className="site-number">0{index + 1}</span><h3>{point.title}</h3><p>{point.desc}</p></article>)}</div></section>
    <section className="home-services site-section"><div className="home-container"><h2 className="site-section-title">A snapshot of<br /><em>search performance.</em></h2><p className="mb-8 text-lg">Recorded positions from the first 30–60 days. Rankings change over time.</p><div className="site-table-scroll" tabIndex={0} role="region" aria-label="Recorded keyword rankings"><table className="site-table"><thead><tr>{["Keyword", "Country", "Position", "Search volume", "Intent"].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{RANKING_DATA.map(row => <tr key={row.keyword}><th scope="row">{row.keyword}</th><td>{row.country}</td><td>{row.position}</td><td>{row.volume}</td><td>{row.intent}</td></tr>)}</tbody></table></div><p className="mt-8 text-lg">Countries reached: {GEO_REACH.join(", ")}.</p></div></section>
    <section className="site-callout"><div className="home-container"><h2>What’s possible for<br /><em>your business?</em></h2><p>Start with a practical look at your website.</p><div className="home-actions"><Link href="/seoauditor" className="home-button home-button-solid">Run an audit ↗</Link><Link href="/portfolio" className="home-button">Explore our work ↗</Link></div></div></section>
  </div>;
}
