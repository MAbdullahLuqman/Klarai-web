"use client";
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Tiptap v3 Named Exports
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';

// ==========================================
// FIX: MOVE EXTENSIONS OUTSIDE THE COMPONENT
// This stops the "Duplicate extension" warning and 
// saves massive memory by sharing one instance across all editors!
// ==========================================
const TIPTAP_EXTENSIONS = [
  StarterKit.configure({ link: false }),
  Image.configure({ inline: true, HTMLAttributes: { class: 'w-full rounded-2xl my-6 border-2 border-gray-100 shadow-sm object-cover' } }),
  Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#008dd8] hover:underline font-bold transition-colors' } }),
  Table.configure({ resizable: true, HTMLAttributes: { class: 'w-full border-collapse border border-white/20 my-4 text-sm' } }),
  TableRow,
  TableHeader.configure({ HTMLAttributes: { class: 'border border-white/20 bg-white/5 p-2 font-bold text-left' } }),
  TableCell.configure({ HTMLAttributes: { class: 'border border-white/20 p-2' } }),
];

export default function TipTapEditor({ label, value, onChange, name, placeholder }) {
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
        class: 'prose max-w-none focus:outline-none min-h-[120px] p-4 text-[#182235] text-sm leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextValue = value || '';
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, false);
    }
  }, [editor, value]);

  if (!editor) return null;

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
        </div>
      </div>

      {/* LIVE EDITING CANVAS */}
      <div className={editor.isEmpty ? 'before:content-[attr(data-placeholder)] before:text-gray-600 before:absolute before:p-4 before:pointer-events-none relative' : ''} data-placeholder={placeholder}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
