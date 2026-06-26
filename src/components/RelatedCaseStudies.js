import React from "react";
import Link from "next/link";

export default function RelatedCaseStudies({ studies = [], title = "Related case studies" }) {
  const visible = (studies || []).filter(Boolean);
  if (visible.length === 0) return null;

  return (
    <section className="mt-16 rounded-[1.2rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b542a]">Proof</p>
      <h2 className="font-serif text-3xl font-medium tracking-tight text-[#2f3438]">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((study) => {
          const slug = study.slug || study.id;
          const metric = Array.isArray(study.metrics) && study.metrics[0] ? study.metrics[0] : null;
          return (
            <Link key={slug} href={`/case-studies/${slug}`} className="rounded-[1rem] border border-black/8 bg-[#f9f5ec] p-5 transition hover:border-[#ad5b2b]/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/36">{study.industry || "Case study"}</p>
              <h3 className="mt-3 text-xl font-black tracking-tight text-[#2f3438]">{study.title || study.heroTitle}</h3>
              {metric && (
                <p className="mt-5 text-sm font-bold text-[#9b542a]">
                  {metric.value} <span className="text-black/46">{metric.label}</span>
                </p>
              )}
              <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-black/56">{study.excerpt || study.heroSubtitle}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
