"use client";
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Tiptap v3 Named Exports
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';

// Firebase imports to fetch dynamic URLs for AI Linking
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ==========================================
// FIX: MOVE EXTENSIONS OUTSIDE THE COMPONENT
// This stops the "Duplicate extension" warning and 
// saves massive memory by sharing one instance across all editors!
// ==========================================
const TIPTAP_EXTENSIONS = [
  StarterKit,
  Image.configure({ inline: true, HTMLAttributes: { class: 'w-full rounded-2xl my-6 border-2 border-gray-100 shadow-sm object-cover' } }),
  Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#008dd8] hover:underline font-bold transition-colors' } }),
  Table.configure({ resizable: true, HTMLAttributes: { class: 'w-full border-collapse border border-white/20 my-4 text-sm' } }),
  TableRow,
  TableHeader.configure({ HTMLAttributes: { class: 'border border-white/20 bg-white/5 p-2 font-bold text-left' } }),
  TableCell.configure({ HTMLAttributes: { class: 'border border-white/20 p-2' } }),
];

// Map of your site for Gemini to use for internal linking
const SITE_MAP = [
  "https://klarai.uk/seo-services - Core SEO Agency Services",
  "https://klarai.uk/aeo-services - Answer Engine Optimization for AI Search",
  "https://klarai.uk/web-development - High Performance Web Design",
  "https://klarai.uk/meta-ads - Paid Facebook/Instagram Ads",
  "https://klarai.uk/social-media-marketing - Organic Social Media"
];

export default function TipTapEditor({ label, value, onChange, name, placeholder }) {
  const [isAiLoading, setIsAiLoading] = useState(false);

  const editor = useEditor({
    // Prevents Next.js SSR hydration mismatch errors
    immediatelyRender: false, 
    
    // REFERENCE THE OUTSIDE ARRAY HERE
    extensions: TIPTAP_EXTENSIONS,
    
    content: value || '',
    onUpdate: ({ editor }) => {
      // Simulate standard React onChange event to sync perfectly with your parent state
      onChange({ target: { name, value: editor.getHTML() } });
    },
    editorProps: {
      attributes: {
        // Tailwind classes for the live editing canvas
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[120px] p-4 text-gray-200 text-sm leading-relaxed',
      },
    },
  });

  if (!editor) return null;

  // --- GEMINI 1-CLICK DYNAMIC INTERNAL LINKING ---
// --- GEMINI 1-CLICK DYNAMIC INTERNAL LINKING ---
  const handleAiLink = async () => {
    setIsAiLoading(true);
    try {
      let dynamicSiteMap = [...SITE_MAP];

      try {
        const blogsSnap = await getDocs(collection(db, 'blog_posts'));
        blogsSnap.forEach(doc => {
          const data = doc.data();
          const title = data.seoMeta?.title || data.hero?.title || doc.id;
          dynamicSiteMap.push(`https://klarai.uk/blog/${doc.id} - Blog Post: ${title}`);
        });

        const nichesSnap = await getDocs(collection(db, 'niche_pages'));
        nichesSnap.forEach(doc => {
          const data = doc.data();
          const title = data.h1 || data.metaTitle || doc.id;
          dynamicSiteMap.push(`https://klarai.uk/niche/${doc.id} - Niche Service: ${title}`);
        });
      } catch (dbError) {
        console.warn("Failed to fetch dynamic links, falling back to core URLs.", dbError);
      }

      const currentHtml = editor.getHTML();
      const response = await fetch('/api/ai-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentHtml, urls: dynamicSiteMap })
      });

      // 🚨 FIX: Parse the response JSON FIRST before throwing an error 🚨
      const data = await response.json();

      if (!response.ok) {
        // Now it will throw the REAL error from Google (e.g., "API Key Invalid", etc.)
        throw new Error(data.details || data.error || "AI Request Failed");
      }
      
      editor.commands.setContent(data.updatedText, false);
      onChange({ target: { name, value: data.updatedText } });
      
    } catch (error) {
      console.error(error);
      // This will pop up a browser alert with the EXACT Google API error!
      alert(`AI Auto-Link Failed:\n\n${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const setLink = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else if (url === '') editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="w-full bg-[#111] border border-white/10 rounded-lg overflow-hidden focus-within:border-[#008dd8] transition-colors">
      
      {/* TOOLBAR */}
      <div className="bg-[#0a0a0a] border-b border-white/10 p-2 flex flex-wrap gap-2 items-center justify-between">
        {label && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">{label}</span>}
        
        <div className="flex flex-wrap gap-1 items-center">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 text-xs rounded font-bold ${editor.isActive('bold') ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}>B</button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 text-xs rounded italic ${editor.isActive('italic') ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10'}`}>I</button>
          
          <div className="w-px h-4 bg-white/20 mx-1"></div>

          {/* Table Controls */}
          <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400 hover:bg-white/10 rounded">Insert Table</button>
          {editor.isActive('table') && (
            <>
              <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400 hover:bg-white/10 rounded">+ Col</button>
              <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400 hover:bg-white/10 rounded">+ Row</button>
              <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 py-1 text-[10px] uppercase font-bold text-red-400 hover:bg-red-500/20 rounded">Del Table</button>
            </>
          )}

          <div className="w-px h-4 bg-white/20 mx-1"></div>

          <button type="button" onClick={setLink} className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${editor.isActive('link') ? 'bg-[#008dd8]/20 text-[#008dd8]' : 'text-gray-400 hover:bg-white/10'}`}>🔗 Link</button>
          <button type="button" onClick={addImage} className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400 hover:bg-white/10 rounded">🖼️ Img</button>

          {/* MAGIC AI LINK BUTTON */}
          <button 
            type="button" 
            onClick={handleAiLink}
            disabled={isAiLoading}
            className="ml-2 px-3 py-1 text-[10px] uppercase font-black bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1"
          >
            {isAiLoading ? 'Analyzing...' : '✨ Auto-Link'}
          </button>
        </div>
      </div>

      {/* LIVE EDITING CANVAS */}
      <div className={editor.isEmpty ? 'before:content-[attr(data-placeholder)] before:text-gray-600 before:absolute before:p-4 before:pointer-events-none relative' : ''} data-placeholder={placeholder}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}