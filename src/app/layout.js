import "./globals.css";
import "./home.css";
import "./site.css";
import PublicSiteFrame from "@/components/PublicSiteFrame";
import GlobalHeader from '@/components/GlobalHeader'; 
import GlobalFooter from '@/components/GlobalFooter'; 
import { canonical, jsonLd, organizationSchema, SITE_URL, websiteSchema } from '@/lib/seo-config';

// THE FIX: Import the provider
import { AdminModeProvider } from '@/context/AdminModeContext';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Klarai | Engineered Search Visibility",
  description: "Advanced Technical SEO and AI Answer Engine Optimization for UK businesses.",
  alternates: {
    canonical: canonical("/"),
  },
  openGraph: {
    url: canonical("/"),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#030303] text-white flex flex-col min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema()) }}
        />
        
        {/* THE FIX: Wrap your app inside the AdminModeProvider */}
        <AdminModeProvider>
          
          <PublicSiteFrame>
          <GlobalHeader />

          <main className="flex-grow flex flex-col relative w-full">
            {children}
          </main>

          <GlobalFooter />
          </PublicSiteFrame>
          
        </AdminModeProvider>

      </body>
    </html>
  );
}
