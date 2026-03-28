import React from 'react';
import Link from 'next/link';
export const revalidate = 0;
export const metadata = {
  title: 'Privacy Policy | Klarai',
  description: 'How KLARAI collects, uses, and protects your data.',
  robots: 'noindex, nofollow' // We usually hide legal pages from search engines to keep SEO focused on your services
};

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-400">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
                <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
                <p>Welcome to KLARAI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">2. The Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                    <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: Where we need to perform the contract we are about to enter into or have entered into with you; Where it is necessary for our legitimate interests; Where we need to comply with a legal obligation.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-4">4. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at founder@klarai.uk.</p>
            </section>
        </div>
      </div>
    </main>
  );
}