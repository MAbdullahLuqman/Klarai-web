"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const COLLECTIONS = [
  { id: "pages", label: "Service pages (pages)" },
  { id: "blog_posts", label: "Blog posts (blog_posts)" },
  { id: "industry_pages", label: "Industry hubs (industry_pages)" },
  { id: "niche_pages", label: "Niche pages (niche_pages)" },
  { id: "static_pages", label: "Static pages (static_pages)" },
];

// Required-field hints (renderer expectations). Missing fields warn, not block.
const COLLECTION_SCHEMAS = {
  pages: ["meta.title", "meta.description", "hero.h1", "hero.sub", "cta.h2"],
  blog_posts: [
    "slug",
    "seoMeta.title",
    "seoMeta.metaDescription",
    "hero.title",
    "hero.description",
    "intro",
    "sections[].heading",
    "sections[].content",
    "faqs[].question",
    "faqs[].answer",
  ],
  industry_pages: [
    "slug",
    "meta.title",
    "meta.description",
    "hero.h1",
    "hero.sub",
    "tldr.text",
    "sections[].h2",
    "faqs[].q",
    "faqs[].a",
    "cta.heading",
  ],
  niche_pages: ["slug", "niche", "h1", "subheadline", "metaTitle", "metaDescription"],
  static_pages: ["slug", "title", "content"],
};

const hasPath = (obj, path) => {
  if (!obj) return false;
  if (path.includes("[].")) {
    const [arrKey, rest] = path.split("[].");
    const arr = arrKey.split(".").reduce((acc, k) => acc && acc[k], obj);
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.every((item) => hasPath(item, rest));
  }
  return path.split(".").reduce((acc, k) => (acc != null ? acc[k] : undefined), obj) !== undefined;
};

const checkRequired = (collectionId, data) => {
  const required = COLLECTION_SCHEMAS[collectionId] || [];
  return required.filter((p) => !hasPath(data, p));
};

const PLACEHOLDER_SINGLE = `{
  "slug": "example-slug",
  "meta": { "title": "Page title", "description": "..." },
  "hero": { "h1": "Heading", "sub": "Subheading" }
}`;

const PLACEHOLDER_BULK = `[
  { "collection": "industry_pages", "id": "seo-for-plumbers", "data": { "...": "..." } },
  { "collection": "blog_posts", "id": "plumbing-keywords-list", "data": { "...": "..." } }
]`;

export default function JsonUploader() {
  const [mode, setMode] = useState("single"); // 'single' | 'bulk'
  const [collectionId, setCollectionId] = useState("blog_posts");
  const [docId, setDocId] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const parsedSingle = (() => {
    if (mode !== "single") return null;
    try {
      const v = jsonText.trim() ? JSON.parse(jsonText) : null;
      return v;
    } catch (e) {
      return { __error: e.message };
    }
  })();

  const parsedBulk = (() => {
    if (mode !== "bulk") return null;
    try {
      const v = jsonText.trim() ? JSON.parse(jsonText) : null;
      if (v && !Array.isArray(v)) return { __error: "Bulk payload must be a JSON array." };
      return v;
    } catch (e) {
      return { __error: e.message };
    }
  })();

  const handleValidate = () => {
    setParseError(null);
    setWarnings([]);
    setPreview(null);
    if (mode === "single") {
      if (!parsedSingle) return setParseError("JSON is empty.");
      if (parsedSingle.__error) return setParseError(parsedSingle.__error);
      if (!docId.trim()) return setParseError("Doc ID/slug is required.");
      const missing = checkRequired(collectionId, parsedSingle);
      setWarnings(missing);
    } else {
      if (!parsedBulk) return setParseError("JSON is empty.");
      if (parsedBulk.__error) return setParseError(parsedBulk.__error);
      const allMissing = [];
      parsedBulk.forEach((row, i) => {
        if (!row.collection || !row.id || !row.data) {
          allMissing.push(`Row ${i}: missing collection|id|data`);
          return;
        }
        const m = checkRequired(row.collection, row.data);
        if (m.length) allMissing.push(`Row ${i} (${row.collection}/${row.id}): missing ${m.join(", ")}`);
      });
      setWarnings(allMissing);
    }
  };

  const handlePreview = async () => {
    handleValidate();
    if (mode !== "single") return;
    if (!parsedSingle || parsedSingle.__error || !docId.trim()) return;
    try {
      const snap = await getDoc(doc(db, collectionId, docId.trim()));
      const current = snap.exists() ? snap.data() : null;
      const changedKeys = [];
      for (const k of Object.keys(parsedSingle)) {
        const before = current?.[k];
        const after = parsedSingle[k];
        if (JSON.stringify(before) !== JSON.stringify(after)) changedKeys.push(k);
      }
      setPreview({ exists: snap.exists(), changedKeys, current });
    } catch (e) {
      setParseError(`Preview failed: ${e.message}`);
    }
  };

  const handleUpload = async () => {
    setStatusMsg("");
    setResults([]);
    setUploading(true);
    try {
      if (mode === "single") {
        if (!parsedSingle || parsedSingle.__error || !docId.trim()) {
          throw new Error("Fix JSON and Doc ID first.");
        }
        await setDoc(
          doc(db, collectionId, docId.trim()),
          { ...parsedSingle, updatedAt: serverTimestamp() },
          { merge: true }
        );
        setStatusMsg(`✓ ${collectionId}/${docId.trim()} uploaded.`);
      } else {
        if (!parsedBulk || parsedBulk.__error) throw new Error("Bulk JSON invalid.");
        const out = [];
        for (let i = 0; i < parsedBulk.length; i++) {
          const row = parsedBulk[i];
          try {
            await setDoc(
              doc(db, row.collection, row.id),
              { ...row.data, updatedAt: serverTimestamp() },
              { merge: true }
            );
            out.push({ i, status: "ok", path: `${row.collection}/${row.id}` });
          } catch (e) {
            out.push({ i, status: "error", path: `${row.collection}/${row.id}`, error: e.message });
          }
          setResults([...out]);
        }
        const okCount = out.filter((r) => r.status === "ok").length;
        setStatusMsg(`Bulk done: ${okCount}/${parsedBulk.length} succeeded.`);
      }
    } catch (e) {
      setStatusMsg(`✗ Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-200 space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-gray-900">JSON Upload</h2>
        <p className="mt-1 text-sm text-gray-600">Paste JSON to upsert any Firestore page document. Uses <code className="bg-gray-100 px-1 rounded">setDoc(merge:true)</code>, so unspecified fields are preserved.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setMode("single"); setResults([]); setPreview(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold border ${mode === "single" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300"}`}
        >
          Single doc
        </button>
        <button
          type="button"
          onClick={() => { setMode("bulk"); setResults([]); setPreview(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold border ${mode === "bulk" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300"}`}
        >
          Bulk (array of rows)
        </button>
      </div>

      {mode === "single" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-600">Collection</span>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {COLLECTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-600">Doc ID / slug</span>
            <input
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              placeholder="e.g. plumbing-keywords-list"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
            />
          </label>
        </div>
      )}

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
          JSON {mode === "bulk" ? "(array of { collection, id, data })" : "(document body)"}
        </span>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={mode === "single" ? PLACEHOLDER_SINGLE : PLACEHOLDER_BULK}
          rows={18}
          className="mt-1 w-full border border-gray-300 rounded-lg p-3 text-xs font-mono leading-relaxed"
        />
      </label>

      {parseError && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <strong>JSON error:</strong> {parseError}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
          <strong>Warnings (renderer may show blanks):</strong>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {preview && (
        <div className="rounded-lg border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900">
          <strong>{preview.exists ? "Doc exists." : "New doc."}</strong>{" "}
          {preview.exists && (
            <>Top-level keys that will change: {preview.changedKeys.length ? preview.changedKeys.join(", ") : "none"}</>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleValidate}
          className="px-4 py-2 rounded-lg text-sm font-bold border border-gray-300 bg-white hover:bg-gray-50"
        >
          Validate
        </button>
        {mode === "single" && (
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
          >
            Preview diff
          </button>
        )}
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="px-5 py-2 rounded-lg text-sm font-black bg-gray-900 text-white hover:bg-black disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload to Firestore"}
        </button>
      </div>

      {statusMsg && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
          {statusMsg}
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Path</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.i} className="border-t border-gray-200">
                  <td className="px-3 py-2 font-mono">{r.i}</td>
                  <td className="px-3 py-2 font-mono">{r.path}</td>
                  <td className={`px-3 py-2 font-bold ${r.status === "ok" ? "text-green-700" : "text-red-700"}`}>
                    {r.status}{r.error ? `: ${r.error}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
