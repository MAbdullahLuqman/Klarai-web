import React from 'react';
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const revalidate = 0;

// 1. DYNAMIC METADATA: Pulls the AEO description from Firebase
export async function generateMetadata() {
  try {
    const docRef = doc(db, "pages", "aeo");
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;

    const metaTitle = data?.title ? `${data.title} | Klarai` : 'Answer Engine Optimisation (AEO) | Klarai';
    const metaDesc = data?.meta || 'Traditional SEO is no longer enough. We optimize your brand to be the definitive answer provided by Next-Gen AI engines like ChatGPT, Gemini, and Claude.';

    return {
      title: metaTitle,
      description: metaDesc,
      alternates: { canonical: 'https://www.klarai.uk/aeo-services' },
      robots: 'index, follow',
      openGraph: {
        title: metaTitle,
        description: metaDesc,
        url: 'https://www.klarai.uk/aeo-services',
        type: 'website',
      }
    };
  } catch (error) {
    return {
      title: 'Answer Engine Optimisation (AEO) | Klarai',
      description: 'Optimize your brand to be the definitive answer provided by Next-Gen AI engines.',
      alternates: { canonical: 'https://www.klarai.uk/aeo-services' },
      robots: 'index, follow',
    };
  }
}

// 2. DATA FETCHER
async function getPageData() {
  try {
    const docRef = doc(db, "pages", "aeo");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return null;
  }
}

export default async function AeoServices() {
  // 3. WAIT FOR FIREBASE DATA
  const data = await getPageData();

  // 4. SET FALLBACKS: Uses the exact text from your Admin Panel baseline
  const pageTitle = data?.title || "Answer Engine Optimisation (AEO)";
  const pageSubtitle = data?.subtitle || "Dominate AI search engines like ChatGPT, Gemini, and Claude.";
  const pageBody = data?.body || "Traditional SEO is no longer enough. We optimize your brand to be the definitive answer provided by Next-Gen AI engines.";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is Answer Engine Optimisation (AEO)?", "acceptedAnswer": { "@type": "Answer", "text": "AEO is the process of optimizing your digital content to be cited as the primary answer by AI models like ChatGPT, Perplexity, and Google's AI Overviews." } },
      { "@type": "Question", "name": "How is AEO different from traditional SEO?", "acceptedAnswer": { "@type": "Answer", "text": "SEO focuses on ranking web links on a traditional search engine results page. AEO focuses on providing direct, structured facts and entities so AI models confidently use your brand as the definitive answer." } },
      { "@type": "Question", "name": "Which AI engines do you optimize for?", "acceptedAnswer": { "@type": "Answer", "text": "We optimize for the leading Large Language Models (LLMs), including ChatGPT (OpenAI), Google Gemini / AI Overviews, Claude (Anthropic), and Perplexity AI." } },
      { "@type": "Question", "name": "How long does it take to see AEO results?", "acceptedAnswer": { "@type": "Answer", "text": "Because LLMs scrape and update their training data at different intervals, AEO requires a sustained strategy of entity building. Initial citations often appear within 3 to 6 months." } }
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
        
        {/* DYNAMIC TEXT INTEGRATION */}
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-[#111] border border-white/10 text-[#3b82f6] text-[9px] md:text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#3b82f6] animate-pulse"></span>
            The Future of Search
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          {pageTitle}
        </h1>
        
        <p className="text-xl mb-12 max-w-3xl leading-relaxed">
          {pageSubtitle}
        </p>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-6">Why AEO Matters</h2>
          <p className="leading-relaxed bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            {pageBody}
          </p>
        </section>

        {/* Hardcoded Architecture for AEO Services */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Our AEO Architecture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['AI Readiness Audit', 'Conversational Keyword Strategy', 'Entity & Semantic Structuring', 'LLM Citation Building', 'Schema Markup Injection', 'Knowledge Graph Optimization'].map(service => (
              <div key={service} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#185FA5] transition-all">
                <h3 className="text-xl font-bold text-white">{service}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Our Process</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {['1. Analysis', '2. Entity Mapping', '3. Content Structuring', '4. AI Indexing'].map(step => (
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
          <Link href="/#audit" className="bg-[#185FA5] hover:bg-[#144d85] text-white px-10 py-4 rounded-full font-bold text-lg mb-8 transition-all shadow-[0_0_20px_rgba(24,95,165,0.4)]">Get a free AEO Readiness Audit</Link>
          <Link href="/seo-services" className="text-[#185FA5] hover:text-white font-semibold transition-colors border-b border-[#185FA5] hover:border-white pb-1">
            Need traditional Google rankings too? See our standard SEO services →
          </Link>
        </div>
      </div>
    </main>
  );
}