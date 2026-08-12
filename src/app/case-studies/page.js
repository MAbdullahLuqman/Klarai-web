import React from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { canonical } from "@/lib/seo-config";
import { safeGetDocs } from "@/lib/firestore-safe";
import { defaultCaseStudies } from "@/lib/case-study-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Case Studies | Klarai",
  description: "Klarai case studies across SEO, AEO and web development.",
  alternates: { canonical: canonical("/case-studies") },
};

async function getPublishedCaseStudies() {
  const q = query(collection(db, "case_studies"), where("status", "==", "published"));
  const snap = await safeGetDocs(q, "case_studies index");
  const firebaseStudies = snap ? snap.docs.map((item) => ({ id: item.id, ...item.data() })) : [];
  const defaults = Object.entries(defaultCaseStudies).map(([id, study]) => ({ id, ...study }));
  return Object.values(Object.fromEntries([...defaults, ...firebaseStudies].map((study) => [study.slug || study.id, study])));
}

export default async function CaseStudiesPage() {
  const studies = await getPublishedCaseStudies();

  return (
    <main className="min-h-screen bg-[#f4efe4] px-5 pb-24 pt-32 text-[#2f3438] sm:px-8 lg:px-12">
      <section className="mx-auto max-w-[1180px]">
        <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">Case studies</p>
        <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">
          Proof from real search and website systems.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-black/60">
          Selected Klarai projects across technical SEO, answer-engine readiness and high-converting web development.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-[1180px] gap-5 md:grid-cols-2 lg:grid-cols-3">
        {studies.map((study) => {
          const slug = study.slug || study.id;
          const metric = Array.isArray(study.metrics) && study.metrics[0] ? study.metrics[0] : null;
          return (
            <Link key={study.id} href={`/case-studies/${slug}`} className="rounded-[1.15rem] border border-black/8 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:border-[#ad5b2b]/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#9b542a]">{study.industry || "Case study"}</p>
              <h2 className="mt-4 text-2xl font-black tracking-tight">{study.title || study.heroTitle}</h2>
              <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-black/56">{study.excerpt || study.heroSubtitle}</p>
              {metric && (
                <div className="mt-7 rounded-xl bg-[#f9f5ec] p-4">
                  <p className="font-serif text-4xl font-medium text-[#ad5b2b]">{metric.value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-black/42">{metric.label}</p>
                </div>
              )}
            </Link>
          );
        })}
      </section>

      {studies.length === 0 && (
        <div className="mx-auto mt-14 max-w-[1180px] rounded-[1.1rem] border border-black/8 bg-white p-8 text-black/56">
          No published case studies yet.
        </div>
      )}
    </main>
  );
}
