import AuditorClient from './AuditorClient';

// 1. THIS RUNS 100% ON THE SERVER FOR GOOGLE/CRAWLERS
export const metadata = {
  title: 'Free AI SEO Audit Tool — Instant Results in 30 Seconds | Klarai',
  description: 'Run a free AI-powered SEO audit on any UK website. Powered by Gemini, Klarai SEO auditor delivers instant results in 30 seconds covering technical, on-page, local, and AI visibility.',
};

// 2. THIS PASSES THE PAGE OFF TO THE CLIENT
export default function SeoAuditorPage() {
  return <AuditorClient />;
}