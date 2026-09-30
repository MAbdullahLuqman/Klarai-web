import Link from "next/link";
import Image from "next/image";
import SiteHero from "@/components/SiteHero";

const portfolioProjects = [
  {
    id: "pitchside",
    title: "Pitchside.ai",
    logo: "/brands/pitchside.webp", logoClass: "home-logo-pitchside", width: 384, height: 46,
    description: "A sports-tech homepage and search foundation built before launch so the platform can capture demand from day one.",
    techStack: "React, frontend development, responsive UI",
    liveUrl: "https://pitchside.ai",
    githubUrl: "https://github.com/MAbdullahLuqman/pticheside",
  },
  {
    id: "asa-educators",
    title: "ASA Educators",
    logo: "/brands/asa-educators.webp", logoClass: "home-logo-asa", width: 384, height: 442,
    description: "An education website built to present programmes, trust signals, and contact routes in a simple structure for students and parents.",
    techStack: "Website design, content structure, responsive build",
    liveUrl: "https://www.asaeducators.com/",
    githubUrl: "#",
    canEmbed: false,
  },
  {
    id: "flowvix-solutions",
    title: "Flowvix Solutions",
    description: "A service-business website focused on clear positioning, fast scanning, and direct enquiry paths for visitors comparing solutions.",
    techStack: "Web design, responsive UI, conversion layout",
    liveUrl: "https://flowvix-solutions.vercel.app/",
    githubUrl: "#",
    isMockup: true,
  },
  {
    id: "wash-pass",
    title: "Wash Pass",
    description: "A car-wash subscription concept with a product-style interface, pricing flow, and mobile-first landing experience.",
    techStack: "Product mockup, SaaS landing page, responsive UI",
    liveUrl: "https://wash-pass-io-mock.vercel.app/",
    githubUrl: "#",
    isMockup: true,
  },
  {
    id: "atelier-architect",
    title: "Atelier architectural portfolio",
    description: "A calm editorial landing page for an architecture studio, built around spatial hierarchy, restrained motion, and strong first-viewport brand clarity.",
    techStack: "Next.js, Framer Motion, Tailwind CSS",
    liveUrl: "https://architect-landing-page.vercel.app/",
    githubUrl: "https://github.com/MAbdullahLuqman/architect-landing-page",
  },
];


const brands = [
  ...portfolioProjects.slice(0, 2),
  { id: "drifty", title: "Drifty.so", logo: "/brands/drifty.png", logoClass: "home-logo-drifty", width: 2030, height: 1035, liveUrl: "https://drifty.so", description: "A brand we’ve worked with.", techStack: "Digital experience" },
  { id: "rovolto", title: "Rovolto", logo: "/brands/rovolto.jpeg", logoClass: "home-logo-rovolto", width: 200, height: 200, description: "A brand we’ve worked with.", techStack: "Client collaboration" },
  { id: "backhouse", title: "Backhouse Care Home", description: "A new website is taking shape. More to share when it’s ready.", techStack: "Under construction" },
];
export default function PortfolioPage() {
  const featured = brands[0];
  return <div className="site-page site-portfolio">
    <SiteHero eyebrow="Selected work" description="Different businesses, shared ambition. A look at the brands we’ve worked with and the websites we’ve brought to life." actions={<Link className="home-button" href="#client-work">Explore the work ↓</Link>}>Good partnerships.<br /><em>Thoughtful websites.</em></SiteHero>
    <section id="client-work" className="home-container site-featured-project" aria-labelledby="featured-title">
      <Link href="/case-studies/pitchside-ai-free-tools-strategy" className="site-featured-preview"><Image src="/images/pitchside-case-study-01.png" alt="Pitchside.ai website, designed for grassroots football" fill sizes="(max-width: 767px) calc(100vw - 48px), 1200px" className="object-cover object-top" /><span className="site-featured-label">Featured collaboration / 01</span></Link>
      <div className="site-featured-copy"><div><span className="home-eyebrow">Sports technology</span><h2 id="featured-title">{featured.title}</h2></div><div><p>{featured.description}</p><div className="home-actions"><Link href="/case-studies/pitchside-ai-free-tools-strategy" className="home-button home-button-solid">Read the story ↗</Link><a href={featured.liveUrl} target="_blank" rel="noopener noreferrer" className="home-button">Visit website ↗</a></div></div></div>
    </section>
    <section className="home-container site-section" aria-labelledby="collaborations-title"><div className="home-section-intro"><p className="home-eyebrow">Shared ambitions</p><h2 id="collaborations-title" className="site-section-title">More good <em>company.</em></h2></div><div className="site-work-grid site-portfolio-brands">
      {brands.slice(1).map((project, index) => <article className={`site-work-card ${project.id === "rovolto" ? "site-rovolto-card" : ""}`} key={project.id}>
        <div className="site-brand-preview">{project.logo ? <span className={`home-brand-logo ${project.logoClass}`}><Image src={project.logo} alt={project.title} width={project.width} height={project.height} /></span> : <span className="site-preview-wordmark site-italic">{project.title}</span>}</div>
        <div className="site-work-body"><span className="site-number">0{index + 2} / {project.techStack}</span><h3>{project.title}</h3><p>{project.description}</p>{project.liveUrl && <div className="home-actions"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="home-button">Visit website ↗</a></div>}</div>
      </article>)}
    </div></section>
    <section className="site-portfolio-experiments site-section"><div className="home-container"><p className="home-eyebrow">Design & development explorations</p><h2 className="site-section-title">Room to <em>explore.</em></h2><div className="site-editorial-rows">{portfolioProjects.slice(2).map((project, index) => <article className="site-editorial-row" key={project.id}><span className="site-number">0{index + 1}</span><div><h3>{project.title}</h3><span className="site-project-kind">{project.isMockup ? "Concept / mockup" : "Portfolio build"}</span></div><div><p>{project.description}</p><div className="home-actions mt-6"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="home-button">{project.isMockup ? "View concept" : "View build"} ↗</a>{project.githubUrl !== "#" && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="home-button">Source code ↗</a>}</div></div></article>)}</div></div></section>
    <section className="site-callout"><div className="home-container"><h2>Your brand.<br /><em>Our next chapter.</em></h2><p>Let’s build something that feels right for your business.</p><Link href="/contact" className="home-button home-button-solid">Work with us ↗</Link></div></section>
  </div>;
}
