import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Meta Ads Management — Facebook & Instagram Advertising That Converts',
  description: 'Klarai runs high-ROI Meta Ads campaigns on Facebook and Instagram. Ad creative, Meta Ads Manager setup, and full campaign management for UK businesses.',
  alternates: { canonical: 'https://klaraiweb.com/meta-ads' },
  robots: 'index, follow'
};

export default function MetaAds() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much should I spend on Meta Ads per month?", "acceptedAnswer": { "@type": "Answer", "text": "It depends on your goals, but a healthy starting budget allows the fb meta ads algorithms to test and optimize." } },
      { "@type": "Question", "name": "What is Meta Ads Manager and how does it work?", "acceptedAnswer": { "@type": "Answer", "text": "It is the backend platform where we configure facebook meta advertising targeting, budgets, and creative." } },
      { "@type": "Question", "name": "Are Facebook ads still effective in 2025?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. When integrated with strong creative, meta adverts remain a top acquisition channel." } },
      { "@type": "Question", "name": "What is the difference between Facebook and Instagram ads?", "acceptedAnswer": { "@type": "Answer", "text": "They run from the same manager but perform differently based on demographic and creative format (e.g., Reels vs Feed)." } }
    ]
  };

  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="w-full p-6 md:p-10 flex justify-between items-center border-b border-white/5">
        <Link href="/"><img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" /></Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Meta Ads Management — Facebook & Instagram Advertising That Converts</h1>
        <p className="text-xl mb-12 max-w-3xl leading-relaxed">We handle your <strong className="text-white">meta ads manager</strong> and <strong className="text-white">facebook meta advertising</strong> to scale your revenue predictably.</p>

        <section className="mb-20 grid md:grid-cols-3 gap-6">
            {['Campaign Setup', 'Ad Creative', 'Audience Targeting', 'Retargeting', 'Pixel Setup', 'Reporting'].map(item => (
                <div key={item} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-[#185FA5] transition-colors"><h3 className="text-lg font-bold text-white">{item}</h3></div>
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
          <Link href="/#audit" className="bg-[#185FA5] hover:bg-[#144d85] text-white px-10 py-4 rounded-full font-bold text-lg mb-8 transition-all">Get a free Meta Ads audit</Link>
          <Link href="/social-media-marketing" className="text-[#185FA5] hover:text-white font-semibold transition-colors border-b border-[#185FA5] hover:border-white pb-1">
            Pair your ads with strong organic social. See our Social Media Marketing service →
          </Link>
        </div>
      </div>
    </main>
  );
}