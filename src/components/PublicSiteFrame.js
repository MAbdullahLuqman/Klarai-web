"use client";

import { usePathname } from "next/navigation";
import { homepageFonts } from "@/lib/homepage-fonts";
import HomepageScroll from "./HomepageScroll";

export default function PublicSiteFrame({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  return <div className={isAdmin ? "contents" : `site-theme ${homepageFonts}`}>
    {!isAdmin && <HomepageScroll key={pathname} />}
    {children}
  </div>;
}
