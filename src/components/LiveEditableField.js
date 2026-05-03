"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import TipTapEditor from './TipTapEditor';
import { useAdminMode } from '@/context/AdminModeContext';

export default function LiveEditableField({ collectionName = 'blog_posts', docId, fieldPath, initialHtml, isHeading = false }) {
  const { isAdminLoggedIn, viewMode, authLoading } = useAdminMode(); 
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialHtml || "");
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, collectionName, docId);
      
      // THE FIX: Fetch the document, update it in memory, and push it back.
      // This prevents Firebase from destroying arrays!
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Document not found");
      
      const data = docSnap.data();
      
      // Navigate deep into the object/array and safely update the exact text
      const keys = fieldPath.split('.');
      let current = data;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === undefined) {
          current[key] = isNaN(keys[i + 1]) ? {} : [];
        }
        current = current[key];
      }
      current[keys[keys.length - 1]] = content;

      // Save the properly structured document back to Firebase
      await updateDoc(docRef, data);
      setIsEditing(false);

    } catch (error) {
      console.error("Failed to save live edit:", error);
      alert("Save failed. Check console.");
    }
    setIsSaving(false);
  };

  if (!mounted || authLoading) return <div className="opacity-0">{content}</div>; 

  // VERSION 1: PUBLIC VIEW
  if (!isAdminLoggedIn || viewMode === 'user') {
    if (isHeading) {
      // Upgraded regex so it strips outer <p> tags without destroying your HTML Links!
      const cleanHeading = content.replace(/^<\/?p[^>]*>/g, '').replace(/<\/?p[^>]*>$/g, '');
      return <span dangerouslySetInnerHTML={{ __html: cleanHeading }} />;
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // VERSION 2: ADMIN EDIT VIEW
  return (
    <div className={`relative group ${isEditing ? 'z-50' : ''}`}>
      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="absolute -top-4 -right-4 bg-[#008dd8] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 text-[10px] font-black uppercase tracking-widest cursor-pointer">
          ✏️ Edit
        </button>
      )}

      {isEditing ? (
        <div className="bg-[#111] p-4 rounded-xl border-2 border-[#008dd8] shadow-2xl mt-4 mb-4">
          <TipTapEditor value={content} onChange={(e) => setContent(e.target.value)} placeholder="Edit text here..." />
          <div className="flex justify-end gap-3 mt-4">
             {/* Cancel button now reverts any unsaved typing */}
            <button onClick={() => { setIsEditing(false); setContent(initialHtml || ""); }} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest">Cancel</button>
            <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 text-xs bg-[#008dd8] text-white font-black uppercase tracking-widest rounded shadow-lg hover:bg-blue-500 disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Live'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-transparent group-hover:border-[#008dd8]/50 rounded p-1 transition-colors cursor-pointer" onClick={() => setIsEditing(true)}>
          {isHeading ? (
            <span dangerouslySetInnerHTML={{ __html: content.replace(/^<\/?p[^>]*>/g, '').replace(/<\/?p[^>]*>$/g, '') }} />
          ) : (
             <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      )}
    </div>
  );
}