import AuditorClient from './AuditorClient';
import { canonical } from "@/lib/seo-config";

// 1. THIS RUNS 100% ON THE SERVER FOR GOOGLE/CRAWLERS
export const metadata = {
  title: 'Free AI SEO Audit Tool | Instant SEO Report | KLARAI',
  description: 'Run a free SEO audit in about 30 seconds. Check technical SEO, page content, schema, local signals and AI search readiness with clear fixes.',
  alternates: {
    canonical: canonical('/seoauditor'),
  },
  openGraph: {
    url: canonical('/seoauditor'),
  },
};

// 2. THIS PASSES THE PAGE OFF TO THE CLIENT
export default function SeoAuditorPage() {
  return <AuditorClient />;
}
