"use client";

import { usePathname } from "next/navigation";
import HomepageNavigation from "./HomepageNavigation";

export default function GlobalHeader() {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") ? null : <HomepageNavigation key={pathname} />;
}
