"use client";

import React from "react";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Home,
  Images,
  LayoutDashboard,
  Library,
  Link2,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ADMIN_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "contentLibrary", label: "Pages", icon: Library },
  { id: "blogGuidesHub", label: "Blog Posts", icon: BookOpenText },
  { id: "caseStudies", label: "Case Studies", icon: FolderKanban },
  { id: "servicesHub", label: "Services", icon: BriefcaseBusiness },
  { id: "toolsAudit", label: "SEO / Metadata", icon: Search },
  { id: "jsonUpload", label: "Media / Images", icon: Images },
  { id: "leads", label: "Leads / Forms", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

const secondaryNavItems = [
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "industriesHub", label: "Industries", icon: BarChart3 },
  { id: "staticBuilder", label: "Static Pages", icon: FileText },
  { id: "internalLinks", label: "Internal Links", icon: Link2 },
  { id: "portfolioAdmin", label: "Portfolio", icon: BriefcaseBusiness },
];

export default function AdminSidebar({ activeView, onChangeView, counts = {}, onLogout }) {
  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r bg-card md:flex">
      <div className="flex h-20 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">K</div>
        <div>
          <p className="text-sm font-semibold text-foreground">Klarai Admin</p>
          <p className="text-xs text-muted-foreground">Content operations</p>
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="space-y-1">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">Core</p>
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavButton key={item.id} item={item} activeView={activeView} onChangeView={onChangeView} count={counts[item.id]} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">Advanced</p>
          {secondaryNavItems.map((item) => (
            <NavButton key={item.id} item={item} activeView={activeView} onChangeView={onChangeView} count={counts[item.id]} />
          ))}
        </div>
      </nav>
      <div className="border-t p-4">
        <Button type="button" variant="ghost" onClick={onLogout} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

function NavButton({ item, activeView, onChangeView, count }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onChangeView(item.id)}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition",
        activeView === item.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.label}</span>
      </span>
      {count != null && <Badge variant={activeView === item.id ? "secondary" : "outline"} className="ml-2 px-1.5 py-0 text-[10px]">{count}</Badge>}
    </button>
  );
}
