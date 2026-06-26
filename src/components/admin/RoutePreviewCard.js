"use client";

import React from "react";
import Link from "next/link";

export default function RoutePreviewCard({ path, status, label = "Route preview" }) {
  const displayPath = path || "No route yet";
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <code className="break-all rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-[#7db2ff]">{displayPath}</code>
        {path && (
          <Link href={path} target="_blank" className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">
            Open
          </Link>
        )}
      </div>
      {status && <p className="mt-3 text-xs text-gray-500">Status: {status}</p>}
    </div>
  );
}
