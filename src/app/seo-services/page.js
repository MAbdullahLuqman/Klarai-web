import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Search Engine Optimisation Services That Rank UK Businesses Faster | Klarai',
  description: 'Expert SEO and search engine optimisation for UK businesses. On-page audits, off-page backlinks, affordable packages. Transparent and results-focused.',
  alternates: { canonical: 'https://klaraiweb.com/seo-services' },
  robots: 'index, follow',
  openGraph: {
    title: 'Search Engine Optimisation Services That Rank UK Businesses Faster',
    description: 'Expert SEO and search engine optimisation for UK businesses. On-page audits, off-page backlinks, affordable packages.',
    url: 'https://klaraiweb.com/seo-services',
    type: 'website',
  }
};

export default function SeoServices() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is search engine optimisation and why does it matter for UK businesses?", "acceptedAnswer": { "@type": "Answer", "text": "Search engine optimisation is the process of improving your website's visibility on Google. For UK businesses, it means capturing local high-intent traffic before your competitors do." } },
      { "@type": "Question", "name": "How long does SEO take to show results?", "acceptedAnswer": { "@type": "Answer", "text": "Typically, you will see initial movement within 3-6 months, with compounding ROI after 6-12 months." } },
      { "@type": "Question", "name": "How much do SEO services cost in the UK?", "acceptedAnswer": { "@type": "Answer", "text": "Costs vary based on competition, but we offer affordable seo services starting with clear, transparent pricing packages." } },
      { "@type": "Question", "name": "What is the difference between on-page and off-page SEO?", "acceptedAnswer": { "@type": "Answer", "text": "On-page involves optimizing your actual website content and code. Off-page involves building authority through external backlinks." } },
      { "@type": "Question", "name": "Do I need an SEO agency or can I do SEO myself?", "acceptedAnswer": { "@type": "Answer", "text": "While basic tweaks can be done yourself, competing with search engine optimisation companies near me requires dedicated expertise, tools, and constant algorithm monitoring." } }
    ]
  };

  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans selection:bg-[#185FA5] selection:text-white pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* Navigation */}
      <nav className="w-full p-6 md:p-10 flex justify-between items-center z-40 border-b border-white/5">
        <Link href="/">
          <img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-lg cursor-pointer" />
        </Link>
        <Link href="https://www.linkedin.com/in/abdullahluqman/" target="_blank" className="text-sm text-gray-300 hover:text-white transition-colors">Connect with Founder</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Search Engine Optimisation Services That Rank UK Businesses Faster</h1>
        <p className="text-xl mb-12 max-w-3xl leading-relaxed">Stop guessing. We are a premier <strong className="text-white">seo optimisation agency</strong> providing comprehensive <strong className="text-white">search engine optimisation service</strong> to dominate Google rankings.</p>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-6">What is SEO?</h2>
          <p className="leading-relaxed bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">Search Engine Optimisation is the mathematical alignment of your digital architecture with Google's core algorithms. It ensures that when your customers search for your services, your business appears first.</p>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Our SEO Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['On-Page & Off-Page SEO', 'Local SEO Experts', 'SEO Audit Services', 'E-commerce SEO Services', 'SEO Keyword Analysis', 'Technical Optimization'].map(service => (
              <div key={service} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#185FA5] transition-all">
                <h3 className="text-xl font-bold text-white">{service}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Our Process</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {['1. Audit', '2. Strategy', '3. Execution', '4. Reporting'].map(step => (
              <div key={step} className="flex-1 bg-[#0a0a0a] border border-[#185FA5]/30 p-6 rounded-2xl text-center"><h3 className="font-bold text-white">{step}</h3></div>
            ))}
          </div>
        </section>

        <section className="mb-20 bg-white/5 p-10 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white mb-2">{faq.name}</h3>
                <p className="text-gray-400">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center text-center mt-20">
          <Link href="/#audit" className="bg-[#185FA5] hover:bg-[#144d85] text-white px-10 py-4 rounded-full font-bold text-lg mb-8 transition-all shadow-[0_0_20px_rgba(24,95,165,0.4)]">Get a free SEO audit</Link>
          <Link href="/aeo-services" className="text-[#185FA5] hover:text-white font-semibold transition-colors border-b border-[#185FA5] hover:border-white pb-1">
            Looking to go beyond SEO? Read our guide to Answer Engine Optimisation →
          </Link>
        </div>
      </div>
    </main>
  );
}