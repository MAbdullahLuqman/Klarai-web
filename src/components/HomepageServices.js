"use client";

import { useRef } from "react";
import Link from "next/link";

export default function HomepageServices({ services }) {
  const cursor = useRef(null);
  const grid = useRef(null);
  const moveCursor = event => {
    if (event.pointerType !== "mouse") return;
    const bounds = grid.current.getBoundingClientRect();
    cursor.current.style.transform = `translate(${event.clientX - bounds.left - 64}px, ${event.clientY - bounds.top - 64}px)`;
  };
  return <div ref={grid} className="home-services-grid" onPointerMove={moveCursor}>
    {services.map((service, index) => {
      const Card = service.href ? Link : "article";
      return <Card key={service.href || service.title || index} {...(service.href ? { href: service.href } : {})} className="home-service-card">
      <div className="home-service-surface"><div className="home-card-top"><span>0{index + 1}</span><span aria-hidden="true">↗</span></div><h3>{service.title}</h3><p>{service.body}</p>{service.cta && <span className="home-service-cta">{service.cta} <span aria-hidden="true">↗</span></span>}</div>
    </Card>;
    })}
    <span ref={cursor} className="home-service-cursor" aria-hidden="true" />
  </div>;
}
