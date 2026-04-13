"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function PageBuilder() {
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // STRICT AEO/SEO DATA STRUCTURE
  const [formData, setFormData] = useState({
    metaTitle: '', metaDescription: '', 
    h1: '', subheadline: '', trustLine: '', 
    tldr: '',
    statCards: [{ number: '', label: '', source: '' }],
    h2Sections: [{ question: '', directAnswer: '', expansion: '' }],
    deliverables: [{ action: '', outcome: '' }],
    caseStudy: { location: '', before: '', after: '', time: '', kwBefore: '', kwAfter: '' },
    process: ['Audit & Discovery', 'Strategic Blueprint', 'Execution & Deployment', 'Scaling & Growth'],
    faqs: [{ q: '', a: '' }],
    relatedLinks: [{ title: '', url: '' }],
    authorName: 'Abdullah Luqman', authorRole: 'Lead System Architect'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Array Handlers
  const updateArray = (key, index, field, value) => {
    const newArr = [...formData[key]];
    newArr[index][field] = value;
    setFormData({ ...formData, [key]: newArr });
  };
  const addArrayItem = (key, emptyObj) => setFormData({ ...formData, [key]: [...formData[key], emptyObj] });
  const updateProcess = (index, value) => {
    const newProcess = [...formData.process];
    newProcess[index] = value;
    setFormData({ ...formData, process: newProcess });
  };
  
  // Case Study Handler
  const handleCaseStudy = (e) => setFormData({ ...formData, caseStudy: { ...formData.caseStudy, [e.target.name]: e.target.value }});

  // --- LLM.MD FILE GENERATOR ---
  const downloadLLMFile = () => {
    const mdContent = `
# KlarAI Knowledge Base: ${formData.h1 || 'Niche SEO'}

## Services
SEO, AEO, Web Development

## Audience
UK small businesses, local service providers, ${formData.caseStudy.location || 'Specific Sector'}

## Overview / TL;DR
${formData.tldr || 'No overview provided.'}

## Core Concepts & Queries
${formData.h2Sections.map(s => `### ${s.question}\n**Direct Answer:** ${s.directAnswer}\n\n**Context:** ${s.expansion}`).join('\n\n')}

## Deliverables & Outcomes
${formData.deliverables.map(d => `- **Action:** ${d.action} -> **Result:** ${d.outcome}`).join('\n')}

## Proof / Case Study
- **Location/Sector:** ${formData.caseStudy.location}
- **Metrics:** ${formData.caseStudy.before} improved to ${formData.caseStudy.after}
- **Timeframe:** ${formData.caseStudy.time}
- **Keywords on Page 1:** ${formData.caseStudy.kwBefore} -> ${formData.caseStudy.kwAfter}

## Process
${formData.process.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Frequently Asked Questions
${formData.faqs.map(f => `**Q: ${f.q}**\nA: ${f.a}`).join('\n\n')}

## Tone
Clear, factual, no fluff.
    `.trim();

    // Create a Blob and trigger a download
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug || 'klarai-niche'}-llm.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const finalSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const docRef = doc(db, 'niche_pages', finalSlug);
      await setDoc(docRef, { ...formData, slug: finalSlug, updatedAt: new Date() }, { merge: true });
      setMessage('Strict System Architecture Deployed Successfully.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-black uppercase text-[#0A101D]">Strict Niche Page Builder</h2>
        {/* LLM DOWNLOAD BUTTON */}
        <button type="button" onClick={downloadLLMFile} className="bg-[#008dd8] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download llm.md
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BASICS */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">1. System Config & Hero</h3>
          <input className="w-full p-3 border rounded-xl" placeholder="URL Slug (e.g., seo-for-plumbers)" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <input className="w-full p-3 border rounded-xl" name="metaTitle" placeholder="Meta Title" onChange={handleChange} />
            <input className="w-full p-3 border rounded-xl" name="metaDescription" placeholder="Meta Description" onChange={handleChange} />
          </div>
          <input className="w-full p-3 border rounded-xl font-bold" name="h1" placeholder="H1 (Keyword + Outcome)" onChange={handleChange} required />
          <input className="w-full p-3 border rounded-xl" name="subheadline" placeholder="Subline (Proof + Timeframe)" onChange={handleChange} />
          <input className="w-full p-3 border rounded-xl" name="trustLine" placeholder="Trust Line (e.g., 20+ UK clients · No contracts · Results-focused)" onChange={handleChange} />
        </div>

        {/* TL;DR */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">2. TL;DR Block (50-60 words MAX)</h3>
          <textarea className="w-full p-3 border rounded-xl h-24" name="tldr" placeholder="Direct, factual answer optimized for Featured Snippets/AEO..." onChange={handleChange} />
        </div>

        {/* STATS */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">3. Stat Cards (Max 3)</h3>
          {formData.statCards.map((stat, i) => (
            <div key={i} className="flex gap-4">
              <input className="w-1/4 p-3 border rounded-xl font-bold text-[#008dd8]" placeholder="Number (e.g., 300%)" value={stat.number} onChange={(e) => updateArray('statCards', i, 'number', e.target.value)} />
              <input className="w-1/2 p-3 border rounded-xl" placeholder="Label (e.g., more leads in top 3)" value={stat.label} onChange={(e) => updateArray('statCards', i, 'label', e.target.value)} />
              <input className="w-1/4 p-3 border rounded-xl text-sm" placeholder="Source" value={stat.source} onChange={(e) => updateArray('statCards', i, 'source', e.target.value)} />
            </div>
          ))}
          {formData.statCards.length < 3 && <button type="button" onClick={() => addArrayItem('statCards', {number:'', label:'', source:''})} className="text-sm text-blue-600 font-bold">+ Add Stat</button>}
        </div>

        {/* H2 SECTIONS */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">4. Question-Based H2s</h3>
          {formData.h2Sections.map((sec, i) => (
            <div key={i} className="space-y-3 border p-5 bg-white rounded-xl shadow-sm">
              <input className="w-full p-3 border rounded-xl font-bold" placeholder="H2 Question (e.g., How does Google rank plumbers?)" value={sec.question} onChange={(e) => updateArray('h2Sections', i, 'question', e.target.value)} />
              <textarea className="w-full p-3 border rounded-xl bg-blue-50 font-medium" placeholder="Direct Answer (40-60 words)" value={sec.directAnswer} onChange={(e) => updateArray('h2Sections', i, 'directAnswer', e.target.value)} />
              <textarea className="w-full p-3 border rounded-xl h-24" placeholder="Expansion (100-150 words)" value={sec.expansion} onChange={(e) => updateArray('h2Sections', i, 'expansion', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('h2Sections', {question:'', directAnswer:'', expansion:''})} className="text-sm text-blue-600 font-bold">+ Add H2 Section</button>
        </div>

        {/* DELIVERABLES */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">5. Deliverables (Action → Outcome)</h3>
          {formData.deliverables.map((del, i) => (
            <div key={i} className="flex gap-4">
              <input className="flex-1 p-3 border rounded-xl" placeholder="Action (e.g., FAQ Schema)" value={del.action} onChange={(e) => updateArray('deliverables', i, 'action', e.target.value)} />
              <input className="flex-1 p-3 border rounded-xl" placeholder="Outcome (e.g., appear in snippets)" value={del.outcome} onChange={(e) => updateArray('deliverables', i, 'outcome', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('deliverables', {action:'', outcome:''})} className="text-sm text-blue-600 font-bold">+ Add Deliverable</button>
        </div>

        {/* CASE STUDY */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">6. Niche Case Study</h3>
          <div className="grid grid-cols-2 gap-4">
            <input className="p-3 border rounded-xl" name="location" placeholder="Location/Type (e.g., UK Plumber)" onChange={handleCaseStudy} />
            <input className="p-3 border rounded-xl" name="time" placeholder="Timeframe (e.g., 4 months)" onChange={handleCaseStudy} />
            <input className="p-3 border rounded-xl" name="before" placeholder="Metric Before (e.g., 15 calls/mo)" onChange={handleCaseStudy} />
            <input className="p-3 border rounded-xl" name="after" placeholder="Metric After (e.g., 70 calls/mo)" onChange={handleCaseStudy} />
            <input className="p-3 border rounded-xl" name="kwBefore" placeholder="Page 1 KWs Before (e.g., 2)" onChange={handleCaseStudy} />
            <input className="p-3 border rounded-xl" name="kwAfter" placeholder="Page 1 KWs After (e.g., 19)" onChange={handleCaseStudy} />
          </div>
        </div>

        {/* PROCESS */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">7. Simple Process (4 Steps)</h3>
          <div className="grid grid-cols-2 gap-4">
            {formData.process.map((step, i) => (
              <input key={i} className="p-3 border rounded-xl" value={step} onChange={(e) => updateProcess(i, e.target.value)} />
            ))}
          </div>
        </div>

        {/* FAQS */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">8. FAQ Section (Feeds JSON-LD)</h3>
          {formData.faqs.map((faq, i) => (
            <div key={i} className="space-y-3 border p-5 bg-white rounded-xl shadow-sm">
              <input className="w-full p-3 border rounded-xl font-bold" placeholder="Question" value={faq.q} onChange={(e) => updateArray('faqs', i, 'q', e.target.value)} />
              <textarea className="w-full p-3 border rounded-xl h-20" placeholder="Answer (Include numbers, clear outcomes)" value={faq.a} onChange={(e) => updateArray('faqs', i, 'a', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('faqs', {q:'', a:''})} className="text-sm text-blue-600 font-bold">+ Add FAQ</button>
        </div>

        {/* RELATED LINKS */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-black text-lg text-[#0A101D]">9. Related Guides (Internal Linking)</h3>
          <p className="text-xs text-gray-500 mb-2">You can paste ANY valid URL here (e.g. /seo-london or https://google.com)</p>
          {formData.relatedLinks.map((link, i) => (
            <div key={i} className="flex gap-4">
              <input className="flex-1 p-3 border rounded-xl" placeholder="Link Title" value={link.title} onChange={(e) => updateArray('relatedLinks', i, 'title', e.target.value)} />
              <input className="flex-1 p-3 border rounded-xl" placeholder="URL (e.g. /blog/seo-guide)" value={link.url} onChange={(e) => updateArray('relatedLinks', i, 'url', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('relatedLinks', {title:'', url:''})} className="text-sm text-blue-600 font-bold">+ Add Link</button>
        </div>

        {/* AUTHOR & SUBMIT */}
        <div className="p-6 bg-gray-900 rounded-2xl space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input className="p-3 border border-gray-700 bg-gray-800 text-white rounded-xl" name="authorName" placeholder="Author Name" value={formData.authorName} onChange={handleChange} />
            <input className="p-3 border border-gray-700 bg-gray-800 text-white rounded-xl" name="authorRole" placeholder="Author Role" value={formData.authorRole} onChange={handleChange} />
          </div>
          
          <div className="flex items-center gap-4 border-t border-gray-700 pt-6">
            <button type="submit" disabled={loading} className="bg-[#008dd8] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition-colors shadow-lg w-full md:w-auto">
              {loading ? 'Deploying...' : 'Deploy System to Firebase'}
            </button>
            {message && <p className="font-bold text-sm text-green-400">{message}</p>}
          </div>
        </div>

      </form>
    </div>
  );
}