import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Free AI SEO Audit Tool | Instant SEO Report | KLARAI",
  description: "Run a free SEO audit in about 30 seconds. Check technical SEO, page content, schema, local signals and AI search readiness with clear fixes.",
  alternates: {
    canonical: canonical("/seoauditor"),
  },
};

export default function SeoAuditorLayout({ children }) {
  return children;
}
