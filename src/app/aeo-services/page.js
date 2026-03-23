import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Answer Engine Optimisation (AEO) — Get Found on ChatGPT & AI Search | Klarai',
  description: 'AEO optimises your content to appear in AI-generated answers on ChatGPT, Perplexity, and Google AI Overviews. Klarai builds structured content AI trusts.',
  alternates: { canonical: 'https://klaraiweb.com/aeo-services' },
  robots: 'index, follow',
  openGraph: {
    title: 'Answer Engine Optimisation (AEO) — Get Found on ChatGPT & AI Search',
    description: 'AEO optimises your content to appear in AI-generated answers on ChatGPT, Perplexity, and Google AI Overviews.',
    url: 'https://klaraiweb.com/aeo-services',
    type: 'website',
  }
};

export default function AeoServices() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is Answer Engine Optimisation (AEO)?", "acceptedAnswer": { "@type": "Answer", "text": "AEO is the process of structuring your digital content so that AI models like ChatGPT and Perplexity confidently cite your brand as the definitive answer." } },
      { "@type": "Question", "name": "How is AEO different from traditional SEO?", "acceptedAnswer": { "@type": "Answer", "text": "SEO focuses on ranking links on a search page. AEO focuses on content optimization and structured entity data so an AI directly outputs your information." } },
      { "@type": "Question", "name": "How do I get my business cited in ChatGPT and Perplexity answers?", "acceptedAnswer": { "@type": "Answer", "text": "By executing a strategy that blends ai and seo, primarily using schema markup and direct, structured Q&A content." } },
      { "@type": "Question", "name": "Does AEO replace SEO or work alongside it?", "acceptedAnswer": { "@type": "Answer", "text": "They work alongside each other. AI search visibility complements traditional search." } },
      { "@type": "Question", "name": "What content format works best for AI search engines?", "acceptedAnswer": { "@type": "Answer", "text": "Structured content for AI search relies on clear syntax, schema markup, and direct, authoritative answers to specific queries." } }
    ]
  };

  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      <nav className="w-full p-6 md:p-10 flex justify-between items-center z-40 border-b border-white/5">
        <Link href="/"><img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" /></Link>
        <Link href="https://www.linkedin.com/in/abdullahluqman/" target="_blank" className="text-sm text-gray-300 hover:text-white transition-colors">Connect with Founder</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Answer Engine Optimisation (AEO) — Get Found on ChatGPT, Perplexity & AI Search</h1>
        <p className="text-xl mb-12 max-w-3xl leading-relaxed">Traditional search is evolving. As an expert in <strong className="text-white">answer engine optimisation</strong>, we ensure your brand is cited by modern AI tools.</p>

        <section className="mb-20 grid md:grid-cols-2 gap-10">
          <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Traditional SEO</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400"><li>Focuses on 10 blue links</li><li>Keyword stuffing</li><li>Navigational intent</li></ul>
          </div>
          <div className="bg-[#185FA5]/10 border border-[#185FA5] p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4">Next-Gen AEO</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300"><li>Focuses on <strong className="text-white">seo writing ai</strong></li><li>Structured data & entities</li><li>Conversational intent</li></ul>
          </div>
        </section>

        <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8">Where AEO gets you cited</h2>
            <div className="flex flex-wrap gap-4">
                {['ChatGPT', 'Perplexity AI', 'Google AI Overviews', 'Bing Copilot'].map(ai => (
                    <span key={ai} className="px-6 py-3 bg-white/5 border border-white/20 rounded-full font-bold text-white">{ai}</span>
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
          <Link href="/#audit" className="bg-[#185FA5] hover:bg-[#144d85] text-white px-10 py-4 rounded-full font-bold text-lg mb-8 transition-all">Get an AEO audit</Link>
          <Link href="/seo-services" className="text-[#185FA5] hover:text-white font-semibold transition-colors border-b border-[#185FA5] hover:border-white pb-1">
            Want to rank on Google too? See our SEO services →
          </Link>
        </div>
      </div>
    </main>
  );
}