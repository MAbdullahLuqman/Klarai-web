import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Web Design & Development for UK Businesses — Fast, SEO-Ready',
  description: 'Klarai builds clean, conversion-focused websites for UK businesses. SEO-optimised from day one — fast loading, mobile-friendly, designed to rank on Google.',
  alternates: { canonical: 'https://klaraiweb.com/web-development' },
  robots: 'index, follow'
};

export default function WebDevelopment() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How long does it take to build a business website?", "acceptedAnswer": { "@type": "Answer", "text": "It takes 2-6 weeks depending on requirements and front end web dev complexity." } },
      { "@type": "Question", "name": "Does my website design affect my SEO ranking?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. A digital commerce agency knows that page speed and code structure directly impact rankings." } },
      { "@type": "Question", "name": "What is an SEO-ready website?", "acceptedAnswer": { "@type": "Answer", "text": "A website optimized for speed, mobile responsiveness, and schema markup from launch." } }
    ]
  };

  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="w-full p-6 md:p-10 flex justify-between items-center border-b border-white/5">
        <Link href="/"><img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" /></Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Web Design & Development for UK Businesses — Fast, SEO-Ready Websites</h1>
        <p className="text-xl mb-12 max-w-3xl leading-relaxed">Searching for <strong className="text-white">web designing near me</strong>? We build high-converting, <strong className="text-white">web design seo</strong> architectures.</p>

        <section className="mb-20 grid md:grid-cols-2 gap-6">
            {['Business Websites', 'E-commerce', 'Landing Pages', 'WordPress Search Engine Optimisation'].map(item => (
                <div key={item} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#185FA5] transition-colors"><h3 className="text-xl font-bold text-white">{item}</h3></div>
            ))}
        </section>

        <section className="mb-20 bg-white/5 p-10 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border-b border-white/10 pb-4"><h3 className="text-lg font-bold text-white mb-2">{faq.name}</h3><p className="text-gray-400">{faq.acceptedAnswer.text}</p></div>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center text-center mt-20">
          <Link href="/#audit" className="bg-[#185FA5] hover:bg-[#144d85] text-white px-10 py-4 rounded-full font-bold text-lg mb-8 transition-all">Get a free website quote</Link>
          <Link href="/seo-services" className="text-[#185FA5] hover:text-white font-semibold transition-colors border-b border-[#185FA5] hover:border-white pb-1">
            Every Klarai website is built SEO-ready from day one. See our SEO services →
          </Link>
        </div>
      </div>
    </main>
  );
}