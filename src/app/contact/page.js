import Link from "next/link";
import { canonical } from "@/lib/seo-config";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Klarai | SEO, AEO and Web Development",
  description: "Contact Klarai to discuss SEO, answer engine optimisation, web development, or a practical visibility audit.",
  alternates: {
    canonical: canonical("/contact"),
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-36 text-[#2f3438] sm:px-8 lg:px-12">
      <section className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.88fr_0.82fr] lg:items-start">
        <div>
          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
            Contact
          </p>
          <h1 className="font-serif text-5xl font-medium leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            Talk to Klarai about search visibility.
          </h1>
          <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-black/58">
            Send the site, the goal, and what is blocking growth. We will reply with the shortest useful next step.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:hello@klarai.uk?subject=Klarai%20project%20enquiry"
              className="rounded-md bg-[#ad5b2b] px-7 py-4 text-center text-sm font-black text-white transition hover:bg-[#8d4822]"
            >
              Email hello@klarai.uk
            </a>
            <Link
              href="/seoauditor"
              className="rounded-md border border-[#ad5b2b] px-7 py-4 text-center text-sm font-black text-[#9b542a] transition hover:bg-white"
            >
              Run SEO Audit
            </Link>
          </div>
          <div className="mt-10 grid gap-3 text-sm font-bold text-black/54 sm:grid-cols-3">
            <div className="rounded-md border border-black/8 bg-white/60 p-4">Short form</div>
            <div className="rounded-md border border-black/8 bg-white/60 p-4">No hard sell</div>
            <div className="rounded-md border border-black/8 bg-white/60 p-4">Clear next step</div>
          </div>
        </div>

        <ContactForm />
      </section>
    </main>
  );
}
