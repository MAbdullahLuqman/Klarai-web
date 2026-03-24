import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

// Initialize the modern fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. KLARAI SEO METADATA
export const metadata = {
  title: 'KLARAI | Advanced AI Growth Engine',
  description: 'We build AI-powered growth systems. Answer Engine Optimization, SEO, and 3D Web Development for modern agencies.',
  keywords: 'AEO, SEO, Performance Marketing, 3D Web Design, AI Agency',
  openGraph: {
    title: 'KLARAI | AI-Powered Growth',
    description: 'We build AI-powered growth systems.',
    url: 'https://klarai.com',
    siteName: 'KLARAI',
    images: [
      {
        url: '/og-image.png', // Add this image to your public folder later
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

// 2. ROOT LAYOUT
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // Combine the dark theme class with the font variables
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-[#030303] text-white antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}