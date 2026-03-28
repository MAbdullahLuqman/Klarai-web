"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function GlobalFooter() {
  const pathname = usePathname();
  const [footerData, setFooterData] = useState({
    trademark: `© ${new Date().getFullYear()} KLARAI™ All Rights Reserved.`,
    privacyText: "Privacy Policy",
    termsText: "Terms & Conditions"
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const docRef = doc(db, "pages", "footer");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFooterData((prev) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (e) {
        console.error("Footer fetch error", e);
      }
    };
    fetchFooter();
  }, []);

  // Hides the footer on the homepage so it doesn't break SolarSystem.js
  if (pathname === "/") return null;

  return (
    <footer className="w-full bg-[#050505] border-t border-white/10 py-8 px-6 mt-auto relative z-50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img src="/klarailogo.webp" alt="KLARAI Logo" className="h-6 object-contain opacity-80" />
        </div>
        
        <p className="text-xs text-gray-500 font-medium tracking-wider text-center md:text-left">
          {footerData.trademark}
        </p>

        <div className="flex gap-6 text-xs font-bold tracking-widest uppercase text-gray-400">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            {footerData.privacyText}
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
            {footerData.termsText}
          </Link>
        </div>
      </div>
    </footer>
  );
}