"use client";

import React, { useMemo, useState } from "react";
import { normalizeAnyContentForAdmin } from "@/lib/adminContentAdapters";
import { getContentHtmlForLinks, getInternalLinkIssues, suggestInternalLinks } from "@/lib/internalLinking";

function flattenContent(collections) {
  return Object.entries(collections || {}).flatMap(([collection, docs]) =>
    Object.entries(docs || {}).map(([id, doc]) => normalizeAnyContentForAdmin(collection, id, doc))
  );
}

export default function InternalLinkStudio({ collections = {} }) {
  const items = useMemo(() => flattenContent(collections), [collections]);
  const [sourceKey, setSourceKey] = useState("");
  const source = items.find((item) => `${item.collection}:${item.id}` === sourceKey) || items[0];
  const html = source ? getContentHtmlForLinks(source) : "";
  const issues = source ? getInternalLinkIssues(html, items) : [];
  const suggestions = source ? suggestInternalLinks(source, items) : [];

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="p-6 md:p-8">
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6]">Source page</p>
          <select value={sourceKey || (source ? `${source.collection}:${source.id}` : "")} onChange={(event) => setSourceKey(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-[#111] px-3 py-3 text-sm text-white">
            {items.map((item) => (
              <option key={`${item.collection}:${item.id}`} value={`${item.collection}:${item.id}`}>
                {item.title} ({item.collection})
              </option>
            ))}
          </select>
          {source && (
            <div className="mt-5 rounded-xl bg-white/5 p-4">
              <p className="font-black text-white">{source.title}</p>
              <p className="mt-1 text-xs text-gray-500">{source.canonicalPath}</p>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-300">Detected issues</p>
            <div className="mt-4 space-y-2">
              {issues.length === 0 ? (
                <p className="text-sm text-gray-500">No internal link issues detected in indexed fields.</p>
              ) : (
                issues.map((issue, index) => (
                  <div key={index} className="rounded-xl border border-red-400/20 bg-red-400/8 p-3 text-sm text-red-100">
                    <strong>{issue.type}</strong>: {issue.link?.href || issue.path}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Suggestions</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {suggestions.map(({ target, reason }) => {
                const htmlLink = `<a href="${target.canonicalPath}">${target.title}</a>`;
                return (
                  <div key={`${target.collection}:${target.id}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-sm font-black text-white">{target.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{reason}</p>
                    <code className="mt-3 block break-all rounded-lg bg-black/40 p-2 text-[11px] text-[#7db2ff]">{target.canonicalPath}</code>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => copy(target.title)} className="rounded-md bg-white/8 px-2 py-1 text-[10px] font-bold text-gray-200">Copy anchor</button>
                      <button type="button" onClick={() => copy(htmlLink)} className="rounded-md bg-white/8 px-2 py-1 text-[10px] font-bold text-gray-200">Copy HTML</button>
                      <button type="button" onClick={() => copy(`[${target.title}](${target.canonicalPath})`)} className="rounded-md bg-white/8 px-2 py-1 text-[10px] font-bold text-gray-200">Copy Markdown</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
