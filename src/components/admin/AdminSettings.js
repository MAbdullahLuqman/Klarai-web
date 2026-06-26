"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "./PageHeader";

export default function AdminSettings() {
  return (
    <div className="space-y-6 p-5 md:p-8">
      <PageHeader
        eyebrow="Settings"
        title="Admin safety rules"
        description="Operational notes for keeping routes, slugs, and Firebase documents stable while editing content."
      />
      <Card className="max-w-3xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Publishing guardrails</CardTitle>
              <CardDescription>These conventions protect existing ranking pages.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>Ranking page routes and section order are preserved. Admin tools save with merge-style updates and keep unknown fields where possible.</p>
          <p>Published slugs should stay locked. If a slug must change, store the old path in legacyPaths and add a redirect before publishing.</p>
          <p>Case studies are additive. Existing blog, industry, niche and service templates should only render related case studies when the optional field exists.</p>
        </CardContent>
      </Card>
    </div>
  );
}
