"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function AdminTopbar({ title = "Content OS", subtitle, activeView, onChangeView, onLogout }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-20 shrink-0 flex-col gap-3 border-b bg-background/90 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Klarai Admin</p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={activeView}
          onChange={(event) => onChangeView(event.target.value)}
          className="md:hidden"
          aria-label="Admin navigation"
        >
          <option value="dashboard">Dashboard</option>
          <option value="contentLibrary">Content Library</option>
          <option value="homepage">Homepage</option>
          <option value="servicesHub">Services</option>
          <option value="core">Services Editor</option>
          <option value="industriesHub">Industries</option>
          <option value="industryBuilder">New Industry Page</option>
          <option value="industryEdit">Industry Editor</option>
          <option value="blogGuidesHub">Blog & Guides</option>
          <option value="blogBuilder">New Blog / Guide</option>
          <option value="blogEdit">Blog / Guide Editor</option>
          <option value="caseStudies">Case Studies</option>
          <option value="portfolioAdmin">Portfolio</option>
          <option value="toolsAudit">Tools / SEO Audit</option>
          <option value="internalLinks">Internal Link Studio</option>
          <option value="leads">Leads & Scans</option>
          <option value="staticBuilder">Static Pages</option>
          <option value="jsonUpload">JSON Import</option>
          <option value="settings">Settings</option>
        </Select>
        <Button asChild variant="outline" size="sm">
          <Link href="/" target="_blank">
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/llms.txt" target="_blank">
            llms.txt
          </Link>
        </Button>
        <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={onLogout} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
