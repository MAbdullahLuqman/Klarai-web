import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Social Media Marketing Agency for UK & European Brands — Grow Organically',
  description: 'Klarai manages your social media on Instagram, LinkedIn, and TikTok. Strategy, content creation, and community management for UK and European brands.',
  alternates: { canonical: 'https://klaraiweb.com/social-media-marketing' },
  robots: 'index, follow'
};

export default function SocialMediaMarketing() {
  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans pb-20">
      <nav className="w-full p-6 md:p-10 flex justify-between items-center border-b border-white/5">
        <Link href="/"><img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" /></Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Social Media Marketing Agency for UK & European Brands — Grow Organically</h1>
        <p className="text-xl mb-12 max-w-3xl leading-relaxed">As top tier <strong className="text-white">social marketing agencies</strong>, we handle <strong className="text-white">digital marketing social media marketing</strong> strategies that actually convert followers to clients.</p>

        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {['Content Creation', 'Community Management', 'Strategy & Planning', 'Analytics & Reporting'].map(service => (
              <div key={service} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-[#185FA5] transition-all"><h3 className="text-lg font-bold text-white">{service}</h3></div>
            ))}
          </div>
        </section>

        <div className="flex flex-col items-center text-center mt-20">
          <Link href="/#audit" className="bg-[#185FA5] hover:bg-[#144d85] text-white px-10 py-4 rounded-full font-bold text-lg mb-8 transition-all">Get a free social audit</Link>
          <Link href="/meta-ads" className="text-[#185FA5] hover:text-white font-semibold transition-colors border-b border-[#185FA5] hover:border-white pb-1">
            Want to amplify your social reach with paid ads? Explore our Meta Ads service →
          </Link>
        </div>
      </div>
    </main>
  );
}