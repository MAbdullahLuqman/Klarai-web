import { canonical } from "@/lib/seo-config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Free Technical SEO Audit | Klarai",
  description: "Request a free technical SEO audit from Klarai.",
  alternates: {
    canonical: canonical("/free-audit"),
  },
};

export default function FreeAuditLayout({ children }) {
  return children;
}
