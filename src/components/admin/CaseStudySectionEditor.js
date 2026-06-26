"use client";

import React from "react";

export default function CaseStudySectionEditor({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
      <textarea
        value={value || ""}
        onChange={(event) => onChange?.(event.target.value)}
        rows={rows}
        className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[#3b82f6]/60"
      />
    </label>
  );
}
