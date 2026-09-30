import Link from "next/link";
import Image from "next/image";
import HomepageServices from "@/components/HomepageServices";
import AuditSearchBar from "@/components/AuditSearchBar";
import { jsonLd } from "@/lib/seo-config";
import { homepageFonts } from "@/lib/homepage-fonts";
import "./home.css";

const services = [
  {
    title: "AI visibility",
    body: "Become the answer ChatGPT, Gemini, Perplexity and Google AI Overviews cite, not the result buried below it.",
    href: "/services/aeo-services",
    cta: "Explore AEO",
  },
  {
    title: "Search visibility",
    body: "The foundations that make you rankable: site architecture, page speed, schema, and local visibility that turns searches into calls.",
    href: "/services/seo-services",
    cta: "Explore SEO",
  },
  {
    title: "Web development",
    body: "Fast, modern sites built to rank from day one and turn visitors into enquiries, not just look good.",
    href: "/services/web-development",
    cta: "Explore Web Design",
  },
];

const processSteps = [
  [
    "Audit",
    "We scan your site's architecture, content gaps and technical health, then show you exactly where you're losing visibility.",
  ],
  [
    "Architect",
    "We map search and answer-engine intent to a concrete page-and-content plan, prioritised by fastest impact.",
  ],
  [
    "Build & optimise",
    "We ship the pages, schema and content that win rankings and citations.",
  ],
  [
    "Grow",
    "We track, refine and compound the gains month over month.",
  ],
];

const faqs = [
  {
    question: "What's the difference between SEO and AEO?",
    answer:
      "SEO ranks you in traditional results; AEO structures your content so AI engines like ChatGPT and Google AI Overviews cite you as the answer. You need both now.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "Terms you already rank near page one can move within weeks; new competitive terms typically take 2-3 months. We prioritise the fastest wins first.",
  },
  {
    question: "Do you lock me into long contracts?",
    answer: "No. We're results-focused and work month to month.",
  },
  {
    question: "Do you work with my industry?",
    answer:
      "We work across UK service businesses and brands, from trades to tech. Run a free audit and we'll tell you honestly if we can help.",
  },
];


const brands = [
  { name: "Pitchside.ai", href: "https://pitchside.ai", logo: "/brands/pitchside.webp", width: 384, height: 46, className: "home-logo-pitchside" },
  { name: "ASA Educators", href: "https://www.asaeducators.com/", logo: "/brands/asa-educators.webp", width: 384, height: 442, className: "home-logo-asa" },
  { name: "Drifty.so", href: "https://drifty.so", logo: "/brands/drifty.png", width: 2030, height: 1035, className: "home-logo-drifty" },
  { name: "Rovolto", logo: "/brands/rovolto.jpeg", width: 200, height: 200, className: "home-logo-rovolto" },
  { name: "Backhouse Care Home", status: "Under construction" },
];

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  return (
    <div className={`homepage ${homepageFonts}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="home-container">
          <p className="home-eyebrow">Independent thinking. Lasting visibility.</p>
          <h1 id="hero-title" className="home-hero-title">
            <span className="home-hero-line"><em>We</em> BUILD <span className="home-star" aria-hidden="true">✳</span></span>
            <span className="home-hero-line">BRANDS <em>that</em></span>
            <span className="home-hero-line">GET <span className="home-capsule">FOUND.</span><span className="home-mountain"><Image src="/images/hero-mountain.jpg" alt="" width={180} height={96} sizes="(max-width: 767px) 80px, 160px" preload /></span></span>
          </h1>
          <p className="home-hero-copy">SEO, AI visibility and fast websites for ambitious UK brands.</p>
          <div className="home-actions"><Link href="/seoauditor" className="home-button home-button-solid">Run your free audit <span aria-hidden="true">↗</span></Link><Link href="/contact" className="home-button">Talk to us <span aria-hidden="true">↗</span></Link></div>
          <p className="home-hero-note">Good work deserves to be seen.</p>
        </div>
      </section>

      <section className="home-section home-services" aria-labelledby="services-title">
        <div className="home-container">
          <div className="home-section-intro"><p className="home-eyebrow">What we do</p><h2 id="services-title" className="home-heading">Make yourself <em>visible.</em></h2><p>Three connected disciplines. One clear ambition: get your business found on Google and in AI answers.</p></div>
          <HomepageServices services={services} />
        </div>
      </section>

      <section className="home-section" aria-labelledby="brands-title">
        <div className="home-container"><div className="home-section-intro"><p className="home-eyebrow">Shared ambitions</p><h2 id="brands-title" className="home-heading">Brands we’ve<br /><em>worked with.</em></h2></div>
          <div className="home-brands">{brands.map(brand => <div className="home-brand" key={brand.name}>{brand.href ? <a href={brand.href} target="_blank" rel="noopener noreferrer" aria-label={`${brand.name} (opens in a new tab)`}><span className={`home-brand-logo ${brand.className}`}><Image src={brand.logo} alt={brand.name} width={brand.width} height={brand.height} sizes="(max-width: 767px) 120px, 180px" /></span><span className="home-brand-arrow" aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a> : <>{brand.logo ? <span className={`home-brand-logo ${brand.className}`}><Image src={brand.logo} alt={brand.name} width={brand.width} height={brand.height} sizes="120px" /></span> : <span>{brand.name}</span>}{brand.status && <small>{brand.status}</small>}</>}</div>)}</div>
        </div>
      </section>

      <section className="home-section home-process" aria-labelledby="process-title"><div className="home-container"><div className="home-section-intro"><p className="home-eyebrow">Our process</p><h2 id="process-title" className="home-heading">Clear thinking.<br /><em>Real progress.</em></h2><p>A clear path from invisible to inevitable.</p></div><ol className="home-process-list">{processSteps.map(([title, text], index) => <li key={title}><span className="home-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p><span className="home-step-arrow" aria-hidden="true">↗</span></li>)}</ol></div></section>

      <section className="home-trust"><div className="home-container"><ul>{["UK-based", "Results-focused, no lock-in contracts", "Founder-led delivery"].map(item => <li key={item}><span aria-hidden="true">✳</span> {item}</li>)}</ul><p>Founded and run by Abdullah Luqman, building Klarai’s track record one transparent result at a time.</p></div></section>

      <section className="home-section"><div className="home-container home-founder"><h2 className="home-heading">Built by people<br /><em>who build.</em></h2><div><p>Klarai is founder-led by Abdullah Luqman, an AI student and developer who builds the same systems we sell. We’re a small UK-focused team that ships real work across SEO, AEO and web development without the bloat or lock-in of larger agencies.</p><Link href="/about" className="home-button">Connect with the founder <span aria-hidden="true">↗</span></Link></div></div></section>

      <section className="home-section home-faq"><div className="home-container"><div className="home-section-intro"><p className="home-eyebrow">A little clarity</p><h2 className="home-heading">Questions, <em>answered.</em></h2></div><div className="home-faq-list">{faqs.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>

      <section id="audit" className="home-section home-audit"><div className="home-container"><div className="home-section-intro"><p className="home-eyebrow">Free visibility scan</p><h2 className="home-heading">Your next chapter<br /><em>starts here.</em></h2><p>See why competitors outrank you. Explore your architecture, content gaps and technical SEO with our free audit. No credit card, no commitment.</p></div><AuditSearchBar className="home-audit-form" /><div className="home-actions"><Link href="/contact" className="home-button">Let’s talk about your ambitions <span aria-hidden="true">↗</span></Link></div></div></section>
    </div>
  );
}
