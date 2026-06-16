import { canonical } from "@/lib/seo-config";

export const metadata = {
  title: "Portfolio | Klarai",
  description: "Selected Klarai web experiences, search foundations, and interface systems.",
  alternates: {
    canonical: canonical("/portfolio"),
  },
};

export default function PortfolioLayout({ children }) {
  return children;
}
