"use client";

import React from "react";
import { ArrowRight, BookOpenText, ClipboardList, FileText, FolderKanban, Inbox, Layers3, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StatCard({ label, value, icon: Icon, helper }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard({ counts = {}, onNavigate }) {
  const quickActions = [
    ["New blog post", "blogBuilder", BookOpenText],
    ["New industry page", "industryBuilder", FileText],
    ["Edit services", "servicesHub", Layers3],
    ["New case study", "caseStudies", FolderKanban],
    ["Review leads", "leads", Users],
    ["Import content", "jsonUpload", ClipboardList],
  ];

  const statusItems = [
    ["Published content", Math.max((counts.contentLibrary || 0) - (counts.drafts || 0), 0)],
    ["Drafts", counts.drafts || 0],
    ["Core services", counts.servicesHub || 0],
  ];

  return (
    <div className="space-y-6 p-5 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total content" value={counts.contentLibrary || 0} icon={Inbox} helper="Across all managed collections" />
        <StatCard label="Blog posts" value={counts.blogPosts || 0} icon={BookOpenText} helper={`${counts.guides || 0} guide-style posts`} />
        <StatCard label="Case studies" value={counts.caseStudies || 0} icon={FolderKanban} helper="Outcome proof pages" />
        <StatCard label="Open drafts" value={counts.drafts || 0} icon={FileText} helper="Needs review before publishing" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Common publishing tasks for non-technical editing.</CardDescription>
            </div>
            <Badge variant="secondary">{counts.drafts || 0} drafts</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map(([label, view, Icon]) => (
              <Button key={view} type="button" variant="outline" className="h-auto justify-between px-4 py-4" onClick={() => onNavigate?.(view)}>
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content status</CardTitle>
            <CardDescription>Simple publishing health summary.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusItems.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-md border bg-background px-4 py-3">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest leads</CardTitle>
            <CardDescription>Open the Leads section to view captured form submissions and scans.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="secondary" onClick={() => onNavigate?.("leads")}>
              <Users className="h-4 w-4" />
              Review leads
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Use Content Library for sorted, searchable updates across all content.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="secondary" onClick={() => onNavigate?.("contentLibrary")}>
              <Plus className="h-4 w-4" />
              Open content library
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
