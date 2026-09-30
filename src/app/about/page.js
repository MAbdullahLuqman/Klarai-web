import Link from "next/link";
import Image from "next/image";
import SiteHero from "@/components/SiteHero";

const TEAM = [
  {
    id: "abdullah",
    name: "Abdullah Luqman",
    role: "Founder and Lead System Architect",
    image: "/1.jpg",
    bio: "An AI student and developer building the same search, answer-engine, and web systems Klarai sells. Abdullah leads strategy, architecture, and delivery so clients work close to the people shipping the work.",
    skills: ["SEO/AEO", "Next.js", "Search Architecture", "Growth Strategy"],
    linkedin: "https://www.linkedin.com/in/abdullahluqman/",
  },
  {
    id: "ahmad",
    name: "Ahmad Ali Luqman",
    role: "Growth and Operations Partner",
    image: "",
    bio: "Supports Klarai across client communication, operations, and growth so delivery stays organised, clear, and close to the business outcome.",
    skills: ["Operations", "Client Support", "Growth", "Research"],
    linkedin: "https://www.linkedin.com/in/ahmadaliluqman/",
  },
];

const principles = [
  [
    "Structural clarity",
    "We start with architecture: routes, content hierarchy, technical health, and the exact jobs every page must perform.",
  ],
  [
    "Transparent delivery",
    "No black boxes or vague activity reports. You see what is being built, why it matters, and what changed.",
  ],
  [
    "Compounding visibility",
    "We prioritise work that can keep paying off: rankable pages, citable answers, schema, and conversion-ready web experiences.",
  ],
];

export default function AboutPage() {
  return <div className="site-page">
    <SiteHero eyebrow="About Klarai" description="A founder-led studio connecting SEO, AI visibility, and thoughtful web design. You work with the people who build your site and shape your strategy." actions={<Link href="/contact" className="home-button home-button-solid">Meet your next team ↗</Link>}>
      People who care.<br /><em>Work that matters.</em>
    </SiteHero>
    <section className="home-services site-section"><div className="home-container"><h2 className="site-section-title">The people behind <em>the work.</em></h2><div className="site-team">
      {TEAM.map(member => <article key={member.id}><div className="site-team-avatar">{member.image ? <Image src={member.image} alt={member.name} width={192} height={192} /> : <span aria-hidden="true">AL</span>}</div><h3>{member.name}</h3><p className="text-[#e0b48b]">{member.role}</p><p>{member.bio}</p><ul className="mt-6 flex flex-wrap gap-3">{member.skills.map(skill => <li className="rounded-full border border-white/30 px-3 py-2 text-sm" key={skill}>{skill}</li>)}</ul><a className="home-button mt-8 text-white border-white/40" href={member.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn ↗</a></article>)}
    </div></div></section>
    <section className="site-section home-container"><p className="home-eyebrow">How we think</p><h2 className="site-section-title">Clear thinking.<br /><em>Better foundations.</em></h2><div className="site-editorial-rows">{principles.map(([title, body], index) => <article className="site-editorial-row" key={title}><span className="site-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
  </div>;
}
