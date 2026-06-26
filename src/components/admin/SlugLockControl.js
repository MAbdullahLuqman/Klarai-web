"use client";

import React, { useState } from "react";
import { isReservedSlug, slugify } from "@/lib/slugUtils";

export default function SlugLockControl({ slug, status, onSlugChange, allowServiceSlug = false }) {
  const [unlocked, setUnlocked] = useState(status !== "published");
  const normalized = slugify(slug);
  const reserved = normalized && isReservedSlug(normalized, { allowServiceSlug });
  const locked = status === "published" && !unlocked;

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Slug safety</p>
        {status === "published" && (
          <button
            type="button"
            onClick={() => setUnlocked((value) => !value)}
            className={`rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
              unlocked ? "bg-red-500/15 text-red-300" : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {unlocked ? "Unlocked" : "Locked"}
          </button>
        )}
      </div>
      <input
        value={slug || ""}
        disabled={locked}
        onChange={(event) => onSlugChange?.(slugify(event.target.value))}
        className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm font-bold text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      {locked && <p className="mt-2 text-xs text-gray-500">Published slugs are locked. Unlock only if you plan to preserve the old path.</p>}
      {reserved && <p className="mt-2 text-xs font-bold text-red-400">This slug is reserved. Pick another slug.</p>}
    </div>
  );
}
