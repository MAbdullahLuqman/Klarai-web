"use client";

import React, { useState } from "react";
import CaseStudyBuilder from "./CaseStudyBuilder";
import SectionContentHub from "./SectionContentHub";

const toCaseStudyItems = (caseStudies = {}) =>
  Object.entries(caseStudies).map(([id, study]) => ({
    id,
    title: study.title || study.heroTitle || id,
    subtitle: study.excerpt || study.heroSubtitle || study.clientName || "Case study",
    path: study.canonicalPath || (study.slug ? `/case-studies/${study.slug}` : `/case-studies/${id}`),
    status: study.status || "draft",
    type: study.projectType || "case study",
    service: study.primaryService,
    industry: study.industry,
  }));

export default function CaseStudyManager({ collections = {}, onSaved }) {
  const [mode, setMode] = useState("list");
  const [activeStudyId, setActiveStudyId] = useState("");
  const caseStudies = collections.case_studies || {};

  if (mode === "editor") {
    return (
      <CaseStudyBuilder
        collections={collections}
        initialStudyId={activeStudyId}
        showList={false}
        onBack={() => {
          setActiveStudyId("");
          setMode("list");
        }}
        onSaved={onSaved}
      />
    );
  }

  return (
    <SectionContentHub
      eyebrow="Proof library"
      title="Case Studies"
      description="Create outcome-led proof pages without mixing them into blog, industry, or service templates."
      items={toCaseStudyItems(caseStudies)}
      createLabel="New case study"
      emptyText="No case studies yet. Create the first proof page from here."
      onCreate={() => {
        setActiveStudyId("");
        setMode("editor");
      }}
      onEdit={(item) => {
        setActiveStudyId(item.id);
        setMode("editor");
      }}
    />
  );
}
