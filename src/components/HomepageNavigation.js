"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { homepageFonts } from "@/lib/homepage-fonts";

const links = [["Home", "/"], ["Services", "/services"], ["Industries", "/industries"], ["About", "/about"], ["Projects", "/portfolio"], ["Case studies", "/case-studies"], ["Insights", "/blog"], ["Contact", "/contact"]];

export default function HomepageNavigation() {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const previousOverflow = useRef("");
  useEffect(() => {
    const element = dialog.current;
    return () => { if (element?.open) document.body.style.overflow = previousOverflow.current; };
  }, []);
  const open = () => {
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    dialog.current.close();
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus();
  };
  return <header className={`home-navigation ${homepageFonts}`}>
    <div className="home-container home-nav-bar"><Link href="/" aria-label="Klarai home"><Image src="/klarai-logo-transparent.png" alt="Klarai" width={96} height={28} /></Link><button ref={trigger} onClick={open} className="home-menu-toggle" aria-label="Open navigation" aria-haspopup="dialog" aria-controls="home-menu"><span /><span /></button></div>
    <dialog ref={dialog} id="home-menu" className="home-menu" aria-labelledby="home-menu-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <div className="home-menu-heading"><span id="home-menu-title">Explore Klarai</span><button onClick={close} aria-label="Close navigation">×</button></div><nav aria-label="Main navigation">{links.map(([label, href]) => <Link href={href} key={href} onClick={close}>{label}</Link>)}</nav><Link href="/seoauditor" onClick={close} className="home-button home-button-solid">Run your free audit ↗</Link>
    </dialog>
  </header>;
}
