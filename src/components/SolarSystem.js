"use client";
import dynamic from 'next/dynamic';

// Load the 3D Hub client-side only
const CyberpunkHub = dynamic(() => import("@/components/SolarSystem"), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-[#020202] flex items-center justify-center">
      <div className="text-[#00ffcc] tracking-[0.5em] text-sm animate-pulse uppercase font-mono">
        Booting Interface...
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#020202] font-sans">
      <CyberpunkHub />

      {/* SEO CONTENT (Hidden from users, visible to Google bots) */}
      <div className="sr-only">
        <h1>Klarai - Advanced Digital Marketing & SEO Agency</h1>
        <p>We build AI-powered growth systems. Answer Engine Optimization (AEO), Search Engine Optimization (SEO), Performance Marketing, and 3D Web Development for ambitious modern brands in the UK.</p>
        <h2>Our Core Services</h2>
        <ul>
          <li>Advanced Search Engine Optimization</li>
          <li>Answer Engine Optimization for AI</li>
          <li>High-Converting Web Design</li>
          <li>Meta Ads & Predictable Revenue Scaling</li>
          <li>Organic Social Media Growth</li>
        </ul>
        <p>Trusted by UK dental clinics, solicitors, cosmetic clinics, and estate agents to deliver creative digital marketing and advertising agency results.</p>
      </div>
    </main>
  );
}