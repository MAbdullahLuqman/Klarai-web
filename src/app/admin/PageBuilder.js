"use client";
import React, { useState } from 'react';
import { db } from '@/lib/firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function PageBuilder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  // Initial State matching your exact SEO Manager structure
  const [formData, setFormData] = useState({
    slug: '',
    metaTitle: '',
    metaDescription: '',
    service: '',
    niche: '',
    h1: '',
    subheadline: '',
    definition: '',
    deliverables: ['', '', '', '', '', ''], // 6 items
    steps: ['', '', '', ''], // 4 items
    whyNeeds: ['', '', ''], // 3 paragraphs
    faqs: [
      { q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' },
      { q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' }
    ],
    ctaText: ''
  });

  // Basic Text Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Array Input Handler (for Deliverables, Steps, WhyNeeds)
  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  // FAQ Input Handler
  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][key] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Deploying page to database...');

    try {
      // Use the slug as the Document ID for easy fetching later
      const pageRef = doc(db, 'niche_pages', formData.slug.toLowerCase().replace(/\s+/g, '-'));
      
      await setDoc(pageRef, {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      setStatus('Success: Page generated and live.');
      // Optional: Reset form here
    } catch (error) {
      console.error("Error creating page:", error);
      setStatus('Error: Could not deploy page.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] p-8 rounded-xl border border-white/10 text-white font-tech">
      <h2 className="text-2xl font-nothing mb-6 uppercase tracking-widest text-blue-400">Niche Page Generator</h2>
      
      {status && <div className="mb-4 p-4 border border-blue-500/50 bg-blue-500/10">{status}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Settings & Meta */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">1. Core & SEO Metadata</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="slug" placeholder="URL Slug (e.g., seo-for-plumbers)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2" />
            <input name="service" placeholder="Service (e.g., Advanced SEO)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2" />
            <input name="niche" placeholder="Niche (e.g., Plumbers)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2" />
          </div>
          <input name="metaTitle" placeholder="Meta Title (Max 60 chars)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2" />
          <textarea name="metaDescription" placeholder="Meta Description (Max 160 chars)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2 h-20" />
        </div>

        {/* Header Section */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">2. Header & Definition</h3>
          <input name="h1" placeholder="H1: [Service] for [Niche] in the UK | Klarai" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2" />
          <input name="subheadline" placeholder="Subheadline (Outcome focused)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2" />
          <textarea name="definition" placeholder="Definition block (50 words, snippet-ready)" required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2 h-24" />
        </div>

        {/* What's Included (6 Items) */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">3. What's Included (6 Deliverables)</h3>
          {formData.deliverables.map((item, i) => (
            <input key={i} placeholder={`Deliverable ${i + 1}`} required value={item} onChange={(e) => handleArrayChange(i, 'deliverables', e.target.value)} className="w-full bg-transparent border border-white/20 p-2" />
          ))}
        </div>

        {/* How It Works (4 Steps) */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">4. How It Works (4 Steps)</h3>
          {formData.steps.map((item, i) => (
            <input key={i} placeholder={`Step ${i + 1}`} required value={item} onChange={(e) => handleArrayChange(i, 'steps', e.target.value)} className="w-full bg-transparent border border-white/20 p-2" />
          ))}
        </div>

        {/* Why Niche Needs Service (3 Paragraphs) */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">5. Why [Niche] Needs It (UK Context)</h3>
          {formData.whyNeeds.map((item, i) => (
            <textarea key={i} placeholder={`Paragraph ${i + 1}`} required value={item} onChange={(e) => handleArrayChange(i, 'whyNeeds', e.target.value)} className="w-full bg-transparent border border-white/20 p-2 h-20" />
          ))}
        </div>

        {/* FAQs (6 Q&As) */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">6. FAQs (6 Items)</h3>
          {formData.faqs.map((faq, i) => (
            <div key={i} className="flex gap-2">
              <input placeholder={`Q${i + 1}`} required value={faq.q} onChange={(e) => handleFaqChange(i, 'q', e.target.value)} className="w-1/3 bg-transparent border border-white/20 p-2" />
              <input placeholder={`A${i + 1} (40-60 words)`} required value={faq.a} onChange={(e) => handleFaqChange(i, 'a', e.target.value)} className="w-2/3 bg-transparent border border-white/20 p-2" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4 border border-white/10 p-4 rounded bg-black/50">
          <h3 className="text-blue-400 uppercase tracking-widest text-sm">7. Closing CTA</h3>
          <textarea name="ctaText" placeholder="Get a Free Audit closing paragraph..." required onChange={handleChange} className="w-full bg-transparent border border-white/20 p-2 h-20" />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 uppercase tracking-widest transition-colors">
          {isSubmitting ? 'Generating...' : 'Deploy Landing Page'}
        </button>

      </form>
    </div>
  );
}