import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Klarai',
  description: 'Terms and conditions for using KLARAI digital marketing services.',
  robots: 'noindex, nofollow'
};

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-[#030303] text-gray-300 font-sans flex flex-col pb-20">
      
      {/* Top Navigation */}
      <nav className="w-full p-6 md:p-10 flex justify-between items-center border-b border-white/5">
        <Link href="/">
          <img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 md:h-10 w-auto object-contain cursor-pointer" />
        </Link>
        <Link href="https://www.linkedin.com/in/abdullahluqman/" target="_blank" className="text-sm text-gray-300 hover:text-white transition-colors">
          Connect with Founder
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-16 flex-1 w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Terms & Conditions</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
                <h2 className="text-xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                <p>By accessing our website and utilizing our digital marketing, SEO, AEO, and Web Development services, you agree to be bound by these Terms and Conditions and agree that you are responsible for the agreement with any applicable local laws.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">2. Services & Deliverables</h2>
                <p>KLARAI provides digital marketing agency services. Specific deliverables, timelines, and costs will be outlined in individual Client Agreements or Statements of Work (SOW) provided prior to the commencement of any project.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">3. Intellectual Property Rights</h2>
                <p>Unless otherwise stated, KLARAI and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from KLARAI for your own personal use subjected to restrictions set in these terms and conditions.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">4. Limitations of Liability</h2>
                <p>KLARAI or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on KLARAI's Website, even if KLARAI or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.</p>
            </section>
        </div>
      </div>
    </main>
  );
}