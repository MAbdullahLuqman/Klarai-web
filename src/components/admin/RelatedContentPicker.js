"use client";

import React, { useMemo, useState } from "react";
import { normalizeAnyContentForAdmin } from "@/lib/adminContentAdapters";

export default function RelatedContentPicker({ collections = {}, selected = [], onChange, allowedCollections }) {
  const [query, setQuery] = useState("");
  const options = useMemo(() => {
    return Object.entries(collections).flatMap(([collection, docs]) => {
      if (allowedCollections && !allowedCollections.includes(collection)) return [];
      return Object.entries(docs || {}).map(([id, doc]) => normalizeAnyContentForAdmin(collection, id, doc));
    });
  }, [collections, allowedCollections]);

  const filtered = options.filter((item) => `${item.title} ${item.slug} ${item.collection}`.toLowerCase().includes(query.toLowerCase())).slice(0, 20);

  const toggle = (item) => {
    const value = { collection: item.collection, id: item.id, slug: item.slug, title: item.title, path: item.canonicalPath };
    const exists = selected.some((entry) => entry.collection === value.collection && entry.id === value.id);
    onChange?.(exists ? selected.filter((entry) => !(entry.collection === value.collection && entry.id === value.id)) : [...selected, value]);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Related content</p>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search related content..." className="mt-3 w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white outline-none" />
      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
        {filtered.map((item) => {
          const active = selected.some((entry) => entry.collection === item.collection && entry.id === item.id);
          return (
            <button key={`${item.collection}-${item.id}`} type="button" onClick={() => toggle(item)} className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${active ? "border-[#3b82f6]/50 bg-[#3b82f6]/12 text-white" : "border-white/10 bg-white/[0.02] text-gray-400 hover:text-white"}`}>
              <strong>{item.title}</strong>
              <span className="mt-1 block text-[10px] text-gray-500">{item.collection} / {item.slug}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
