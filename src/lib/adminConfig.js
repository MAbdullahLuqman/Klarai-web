import { servicePageContent } from "@/lib/service-page-content";

export const SERVICE_URL_MAP = {
  seo: "/services/seo-services",
  aeo: "/services/aeo-services",
  web: "/services/web-development",
};

export const cleanAdminText = (value) => String(value || "").replace(/<[^>]*>/g, "").trim();

const generateBaseSchema = (serviceName, keyword) => ({
  meta: { title: `${keyword} Services in the UK | Klarai`, description: `Expert ${keyword} services for UK businesses. More patients, more calls, more revenue. Book a free audit today.` },
  hero: { visible: true, h1: `${keyword} for Ambitious Brands in the UK`, sub: "More traffic. More calls. More revenue. Stop guessing and start scaling.", trust: "UK-based team | 50+ businesses helped | No long-term contracts", btn1Text: "Get Your Free Audit ->", btn1Link: "/#audit", btn2Text: "See How It Works", btn2Link: "#what-is" },
  definition: { visible: true, h2: `What Is ${serviceName} - And Why It Matters for UK Businesses`, para: `${serviceName} is the mathematical alignment of your digital architecture with search engine algorithms. It ensures that when your customers search for your services, your business appears first.`, bullets: "Captures high-intent local traffic\nBuilds long-term brand authority\nOutperforms paid ads in ROI" },
  included: { visible: true, h2: `What's Included in Our ${serviceName} Package`, items: "Keyword Research & Strategy: We find the exact terms your buyers are searching for.\nTechnical Optimisation: We make your site lightning fast and perfectly readable by bots.\nMonthly Reporting: Transparent, plain-English reports on your growth." },
  process: { visible: true, h2: `How Our ${serviceName} Process Works`, steps: "Free Audit & Discovery: We analyze your current architecture and competitors.\nStrategy & Roadmap: We build a bespoke 6-month growth plan.\nImplementation: Our engineers and writers execute the strategy flawlessly.\nReporting & Refinement: We track rankings and optimize for maximum ROI." },
  results: { visible: true, h2: "Real Results for UK Businesses", caseStudy: "UK Private Dental Clinic | +340% organic traffic in 4 months | Generated GBP40k+ in new patient bookings", quote: '"Klarai completely transformed our lead generation. We had to hire more staff just to handle the calls."', author: "Dr. Sarah J. - Clinic Director" },
  pricing: { visible: true, h2: `Transparent ${serviceName} Pricing - No Hidden Fees`, starter: "Starter|GBP499/mo|/#audit|Basic Keyword Strategy, Monthly Audit, Standard Reporting", growth: "Growth|GBP899/mo|/#audit|Advanced AEO/SEO, Content Creation, Backlink Building, Priority Support", premium: "Premium|GBP1,499/mo|/#audit|Full Domination, AI Entity Mapping, Technical Overhaul, Dedicated Account Manager" },
  faq: { visible: true, h2: `Frequently Asked Questions About ${serviceName} in the UK`, qas: "How long does it take to see results?|Typically, you will see initial movement within 3-6 months, with compounding ROI after 6-12 months.\nDo I need to sign a long-term contract?|No. We believe in earning your business every single month. No hidden lock-ins." },
  cta: { visible: true, h2: "Ready to Grow Your Business? Let's Talk.", text: "Stop losing customers to your competitors. Get your free, comprehensive technical audit today.", btnText: "Book a Free Consultation", btnLink: "mailto:founder@klarai.uk" },
});

export const INITIAL_DATA = {
  seo: servicePageContent.seo || generateBaseSchema("Search Engine Optimisation", "Next-Gen SEO"),
  aeo: servicePageContent.aeo || generateBaseSchema("Answer Engine Optimisation", "AEO"),
  web: servicePageContent.web || generateBaseSchema("Web Design & Development", "High-Converting Web Design"),
  footer: { trademark: `(c) ${new Date().getFullYear()} Klarai(TM) All Rights Reserved.`, privacyText: "Privacy Policy", termsText: "Terms & Conditions" },
};

export const INITIAL_HOME_CONTENT = {
  eyebrow: "3D visibility systems for ambitious brands",
  headline: "Grow what\ndeserves to\nbe seen.",
  intro: "Klarai designs search, answer-engine, and WebGL experiences that make trust visible before the first conversation.",
  projects: [
    {
      name: "Pitchside.ai",
      type: "AI sports tracking",
      accent: "#ccff00",
      line: "A dark performance system for owning every movement on the pitch.",
      href: "/portfolio",
      metrics: ["Spatial AI", "Zero wearables", "Highlight data"],
    },
    {
      name: "Atelier",
      type: "Architecture studio",
      accent: "#d7ae35",
      line: "A calm editorial presence for spaces designed to outlast fashion.",
      href: "/portfolio",
      metrics: ["Editorial", "Spatial", "Premium"],
    },
  ],
};
