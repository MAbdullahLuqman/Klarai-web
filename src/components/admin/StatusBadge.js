import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles = {
  published: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  draft: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  scheduled: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  archived: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

export default function StatusBadge({ status = "draft", className }) {
  const normalized = String(status || "draft").toLowerCase();
  return (
    <Badge variant="outline" className={cn("capitalize", styles[normalized] || styles.draft, className)}>
      {normalized}
    </Badge>
  );
}
