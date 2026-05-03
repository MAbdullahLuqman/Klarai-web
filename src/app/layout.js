import { Inter } from "next/font/google";
import "./globals.css";

import { AdminModeProvider } from '@/context/AdminModeContext';
import AdminToggle from '@/components/AdminToggle';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Klarai",
  description: "Next-Gen SEO for UK Businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#030303] text-white antialiased`}>
        <AdminModeProvider>
          
          {children}
          
          <AdminToggle />
          
        </AdminModeProvider>
      </body>
    </html>
  );
}