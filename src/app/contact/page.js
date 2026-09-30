import Link from "next/link";
import SiteHero from "@/components/SiteHero";
import { canonical } from "@/lib/seo-config";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Klarai | SEO, AEO and Web Development",
  description: "Contact Klarai to discuss SEO, answer engine optimisation, web development, or a practical visibility audit.",
  alternates: {
    canonical: canonical("/contact"),
  },
  openGraph: {
    url: canonical("/contact"),
  },
};

export default function ContactPage() {
  return <div className="site-page">
    <SiteHero eyebrow="Contact" description="A question, a project, or an idea. Tell us where you want to go and we’ll work out the next step together.">Let’s make<br /><em>something happen.</em></SiteHero>
    <section className="home-container site-contact-layout"><address><p className="home-eyebrow">Say hello</p><p>Talk directly to the person<br />building your next chapter.</p><p><a className="site-contact-email" href="mailto:abdullah@klarai.uk">abdullah@klarai.uk ↗</a></p><p>Prefer to start with your website?<br />An audit is a useful first look.</p><Link href="/seoauditor" className="home-button">Run an SEO audit ↗</Link></address><ContactForm /></section>
  </div>;
}
