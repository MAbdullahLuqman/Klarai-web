"use client";

import React from "react";
import { buildSeoChecklist } from "@/lib/adminValidation";

export default function SeoChecklist({ item }) {
  const checks = buildSeoChecklist(item || {});
  const passed = checks.filter((check) => check.ok).length;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6]">SEO checklist</p>
          <h3 className="mt-1 text-lg font-black text-white">{passed}/{checks.length} checks passed</h3>
        </div>
        <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-center text-sm font-black leading-[3rem] text-white">
          {Math.round((passed / checks.length) * 100)}%
        </div>
      </div>
      <ul className="space-y-2">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${check.ok ? "bg-emerald-400" : "bg-red-400"}`} />
            <span className={check.ok ? "text-gray-300" : "text-red-200"}>{check.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
