"use client";

import { useEffect } from "react";

export default function HomepageScroll() {
  useEffect(() => {
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let destroy = () => {};
    let generation = 0;
    const configure = async () => {
      const current = ++generation;
      destroy();
      if (!preference.matches) return;
      const { default: Lenis } = await import("lenis");
      if (current !== generation) return;
      const scroll = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true, syncTouch: false, prevent: node => Boolean(node.closest("dialog")) });
      const menu = document.querySelector("#home-menu");
      const syncMenu = () => menu?.open ? scroll.stop() : scroll.start();
      const observer = new MutationObserver(syncMenu);
      if (menu) observer.observe(menu, { attributes: true, attributeFilter: ["open"] });
      syncMenu();
      destroy = () => { observer.disconnect(); scroll.destroy(); };
    };
    configure();
    preference.addEventListener("change", configure);
    return () => { ++generation; preference.removeEventListener("change", configure); destroy(); };
  }, []);
  return null;
}
