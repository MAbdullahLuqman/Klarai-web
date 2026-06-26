"use client";

import React from "react";

export const EMPTY_DOWNLOAD_ASSET = {
  enabled: false,
  title: "",
  description: "",
  fileUrl: "",
  buttonText: "Download",
  leadGateEnabled: false,
  leadGateFormTitle: "",
  successMessage: "",
};

export default function DownloadAssetEditor({ value, onChange }) {
  const asset = { ...EMPTY_DOWNLOAD_ASSET, ...(value || {}) };
  const update = (field, fieldValue) => onChange?.({ ...asset, [field]: fieldValue });

  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-5 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">Download asset</p>
          <p className="mt-1 text-xs text-gray-500">Optional for blog guides/checklists. Renders only when enabled.</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <input type="checkbox" checked={asset.enabled} onChange={(event) => update("enabled", event.target.checked)} />
          Enabled
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input value={asset.title} onChange={(event) => update("title", event.target.value)} placeholder="Download title" className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white" />
        <input value={asset.buttonText} onChange={(event) => update("buttonText", event.target.value)} placeholder="Button text" className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white" />
      </div>
      <textarea value={asset.description} onChange={(event) => update("description", event.target.value)} placeholder="Description" rows={2} className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white" />
      <input value={asset.fileUrl} onChange={(event) => update("fileUrl", event.target.value)} placeholder="File URL" className="w-full rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white" />
      <label className="flex items-center gap-2 text-xs font-bold text-gray-300">
        <input type="checkbox" checked={asset.leadGateEnabled} onChange={(event) => update("leadGateEnabled", event.target.checked)} />
        Lead gate enabled
      </label>
      {asset.leadGateEnabled && (
        <div className="grid gap-3 md:grid-cols-2">
          <input value={asset.leadGateFormTitle} onChange={(event) => update("leadGateFormTitle", event.target.value)} placeholder="Lead gate form title" className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white" />
          <input value={asset.successMessage} onChange={(event) => update("successMessage", event.target.value)} placeholder="Success message" className="rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm text-white" />
        </div>
      )}
    </div>
  );
}
