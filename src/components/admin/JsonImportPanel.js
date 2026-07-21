"use client";

import React, { useMemo, useState } from "react";
import { Check, Clipboard, FileJson, Upload } from "lucide-react";

export default function JsonImportPanel({
  title,
  description,
  example,
  onImport,
  className = "",
}) {
  const [jsonText, setJsonText] = useState("");
  const [status, setStatus] = useState("");

  const exampleText = useMemo(() => JSON.stringify(example, null, 2), [example]);

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(exampleText);
      setStatus("Example JSON copied.");
    } catch {
      setStatus("Copy failed. Select and copy the example manually.");
    }
  };

  const importJson = () => {
    setStatus("");
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
        setStatus("JSON must be one object, not an array.");
        return;
      }
      onImport(parsed);
      setStatus("JSON imported into the form. Review, then save.");
    } catch (error) {
      setStatus(`Invalid JSON: ${error.message}`);
    }
  };

  const handleJsonKeyDown = (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const { selectionStart, selectionEnd } = event.currentTarget;
    const nextText = `${jsonText.slice(0, selectionStart)}  ${jsonText.slice(selectionEnd)}`;
    setJsonText(nextText);
    window.requestAnimationFrame(() => {
      event.currentTarget.selectionStart = selectionStart + 2;
      event.currentTarget.selectionEnd = selectionStart + 2;
    });
  };

  return (
    <section className={`space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm ${className}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
            <FileJson className="h-4 w-4" />
            JSON import
          </p>
          <h3 className="text-lg font-black tracking-tight text-foreground">{title}</h3>
          {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}
        </div>
        <button
          type="button"
          onClick={copyExample}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-accent"
        >
          <Clipboard className="h-4 w-4" />
          Copy example
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Paste JSON</label>
          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            onKeyDown={handleJsonKeyDown}
            placeholder="Paste copied JSON here, edit values, then import."
            className="min-h-[520px] w-full rounded-md border border-input bg-background p-4 font-mono text-xs leading-5 text-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={importJson}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#185FA5] px-4 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#144d85]"
          >
            <Upload className="h-4 w-4" />
            Import into form
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Example pattern</label>
          <pre className="max-h-[420px] overflow-auto rounded-md border border-input bg-[#f8fafc] p-4 text-xs leading-5 text-[#12385f]">
            {exampleText}
          </pre>
        </div>
      </div>

      {status && (
        <p className="flex items-center gap-2 rounded-md border bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground">
          <Check className="h-4 w-4 text-emerald-400" />
          {status}
        </p>
      )}
    </section>
  );
}
