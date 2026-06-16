import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Free AI SEO Audit Tool | Klarai",
  description: "Run a free AI-powered SEO audit on any UK website with Klarai.",
  alternates: {
    canonical: canonical("/seoauditor"),
  },
};

export default function SeoAuditorLayout({ children }) {
  return children;
}
