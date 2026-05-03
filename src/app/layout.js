import { Inter } from "next/font/google";
import "./globals.css";
import GlobalHeader from '@/components/GlobalHeader'; 
import GlobalFooter from '@/components/GlobalFooter'; 

// THE FIX: Import the provider
import { AdminModeProvider } from '@/context/AdminModeContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KlarAI | Engineered Search Visibility",
  description: "Advanced Technical SEO and AI Answer Engine Optimization for UK businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#030303] text-white flex flex-col min-h-screen antialiased`}>
        
        {/* THE FIX: Wrap your app inside the AdminModeProvider */}
        <AdminModeProvider>
          
          <GlobalHeader />

          <main className="flex-grow flex flex-col relative w-full">
            {children}
          </main>

          <GlobalFooter />
          
        </AdminModeProvider>

      </body>
    </html>
  );
}