"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const titles = {
  dashboard: "Dashboard",
  contentLibrary: "Content Library",
  homepage: "Homepage",
  servicesHub: "Services",
  core: "Services",
  industriesHub: "Industries",
  industryBuilder: "Industries",
  industryEdit: "Industries",
  builder: "Niche Pages",
  nicheEdit: "Niche Pages",
  blogGuidesHub: "Blog & Guides",
  blogBuilder: "Blog & Guides",
  blogEdit: "Blog & Guides",
  caseStudies: "Case Studies",
  caseStudyEdit: "Case Studies",
  portfolioAdmin: "Portfolio",
  toolsAudit: "Tools / SEO Audit",
  internalLinks: "Internal Link Studio",
  leads: "Leads & Scans",
  staticBuilder: "Static Pages",
  staticEdit: "Static Pages",
  jsonUpload: "JSON Import",
  settings: "Settings",
};

const subtitles = {
  dashboard: "Monitor content health, leads, quick actions, and recent publishing work.",
  contentLibrary: "Search and manage pages across the existing Firebase collections.",
  blogGuidesHub: "Create and edit blog posts, guides, checklists, and supporting content.",
  caseStudies: "Manage proof pages and outcomes without changing public templates.",
  servicesHub: "Edit the fixed service pages that power the live Services section.",
  leads: "Review captured leads and SEO audit scans from Firestore.",
  settings: "Admin safety notes, route rules, and publishing conventions.",
};

export default function AdminShell({ activeView, onChangeView, onLogout, counts, children }) {
  return (
    <div className="admin-theme flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <AdminSidebar activeView={activeView} onChangeView={onChangeView} counts={counts} onLogout={onLogout} />
      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar
          title={titles[activeView] || "Content OS"}
          subtitle={subtitles[activeView] || "Existing ranking pages stay intact. Edit fields safely and add optional content only where enabled."}
          activeView={activeView}
          onChangeView={onChangeView}
          onLogout={onLogout}
        />
        <div className="min-h-0 flex-1 overflow-y-auto bg-background">{children}</div>
      </main>
    </div>
  );
}
