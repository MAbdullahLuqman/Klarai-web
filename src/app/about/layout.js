import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "About | Klarai",
  description: "Klarai is a founder-led UK visibility studio for SEO, AEO, and high-converting web development.",
  alternates: {
    canonical: canonical("/about"),
  },
  openGraph: {
    url: canonical("/about"),
  },
};

export default function AboutLayout({ children }) {
  return children;
}
