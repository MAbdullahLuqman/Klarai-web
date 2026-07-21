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
  PanelLeftClose,
  PanelLeftOpen,
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

export default function AdminSidebar({ activeView, onChangeView, counts = {}, onLogout, isOpen = true, onToggle }) {
  return (
    <aside className={cn("hidden h-screen shrink-0 flex-col border-r border-[#183454] bg-[#0f2340] text-white shadow-sm transition-[width] duration-200 md:flex", isOpen ? "w-72" : "w-[84px]")}>
      <div className={cn("flex h-20 items-center border-b border-white/10 px-4", isOpen ? "justify-between gap-3" : "justify-center")}>
        <div className={cn("flex min-w-0 items-center gap-3", !isOpen && "justify-center")}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#20b7c8] text-sm font-semibold text-[#07192c]">K</div>
          {isOpen && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Klarai Admin</p>
              <p className="truncate text-xs text-white/60">Content operations</p>
            </div>
          )}
        </div>
        {isOpen && (
          <button type="button" onClick={onToggle} className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Collapse sidebar">
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        <div className="space-y-1">
          {isOpen ? <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-white/45">Core</p> : (
            <button type="button" onClick={onToggle} className="mb-2 flex h-10 w-full items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white" aria-label="Expand sidebar">
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavButton key={item.id} item={item} activeView={activeView} onChangeView={onChangeView} count={counts[item.id]} isOpen={isOpen} />
          ))}
        </div>
        <div className="space-y-1">
          {isOpen && <p className="px-3 pb-2 text-xs font-medium uppercase tracking-widest text-white/45">Advanced</p>}
          {secondaryNavItems.map((item) => (
            <NavButton key={item.id} item={item} activeView={activeView} onChangeView={onChangeView} count={counts[item.id]} isOpen={isOpen} />
          ))}
        </div>
      </nav>
      <div className="border-t border-white/10 p-4">
        <Button type="button" variant="ghost" onClick={onLogout} className={cn("w-full text-red-200 hover:bg-red-500/15 hover:text-white", isOpen ? "justify-start" : "justify-center px-0")} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
          {isOpen && "Sign out"}
        </Button>
      </div>
    </aside>
  );
}

function NavButton({ item, activeView, onChangeView, count, isOpen }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onChangeView(item.id)}
      title={!isOpen ? item.label : undefined}
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2.5 text-left text-sm font-medium transition",
        isOpen ? "justify-between" : "justify-center",
        activeView === item.id ? "bg-[#20b7c8] text-[#07192c] shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        {isOpen && <span className="truncate">{item.label}</span>}
      </span>
      {isOpen && count != null && <Badge variant={activeView === item.id ? "secondary" : "outline"} className="ml-2 px-1.5 py-0 text-[10px]">{count}</Badge>}
    </button>
  );
}
