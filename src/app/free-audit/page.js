"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// FIREBASE IMPORTS
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CleanAuditGateway() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    service: 'Free Technical SEO Audit',
    website: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) setStep(step + 1);
    else submitForm();
  };

  const handlePrev = () => { if (step > 1) setStep(step - 1); };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        source: 'Clean Centered Gateway',
        capturedAt: serverTimestamp()
      });

      if (formData.service === 'Free Technical SEO Audit' && formData.website) {
        let formattedUrl = formData.website.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) formattedUrl = 'https://' + formattedUrl;
        router.push(`/seoauditor?url=${encodeURIComponent(formattedUrl)}&auto=true`);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setStep(1);
          setFormData({ fullName: '', company: '', service: 'Free Technical SEO Audit', website: '', email: '', phone: '', message: '' });
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("System error. Please check your connection or Adblocker.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const firstName = formData.fullName ? formData.fullName.split(' ')[0] : '';
  const inputClass = "w-full bg-transparent border-b border-black/16 hover:border-[#ad5b2b]/50 py-3 text-[#2f3438] text-xl sm:text-2xl text-center focus:outline-none focus:border-[#ad5b2b] transition-all placeholder:text-black/24 font-medium";
  const labelClass = "text-[10px] font-black text-black/36 uppercase tracking-[0.2em] block mb-4 transition-colors group-focus-within:text-[#ad5b2b] text-center";

  return (
    <main className="bg-[#f4efe4] text-[#2f3438] font-sans selection:bg-[#ad5b2b] selection:text-white flex flex-col">
      {/* --- HERO: CENTERED MULTI-STEP MODAL --- */}
      <section className="relative w-full pt-32 pb-24 px-4 sm:px-6 flex items-center justify-center min-h-screen border-b border-black/8 overflow-hidden">
        
        {/* Ambient Page Glow */}
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(224,180,139,0.26)_0%,rgba(244,239,228,0)_100%)] pointer-events-none"></div>

        {/* Centered Modal Container */}
        <div className="w-full max-w-[820px] bg-white/92 backdrop-blur-2xl border border-black/8 rounded-[1.35rem] shadow-[0_35px_110px_rgba(47,52,56,0.14)] flex flex-col min-h-[500px] relative overflow-hidden">
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-black/8 z-20">
            <motion.div 
              className="h-full bg-[#ad5b2b]"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />
          </div>

          {/* Form Content */}
          <div className="w-full h-full p-8 sm:p-12 md:p-16 relative flex flex-col justify-center flex-grow">
            
            {isSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-[#6f8fa3]/10 border border-[#6f8fa3]/24 text-[#6f8fa3] rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-black text-[#2f3438] mb-2">Request secured.</h2>
                <p className="text-black/54">Our engineering team has received your details, {firstName}.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleNext} className="w-full h-full flex flex-col">
                <div className="flex-grow flex flex-col justify-center items-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full flex flex-col items-center"
                    >
                      {/* STEP 1: NAME */}
                      {step === 1 && (
                        <>
                          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-[#2f3438] mb-12 tracking-tight text-center">Let's build together.</h2>
                          <div className="w-full max-w-sm group">
                            <label className={labelClass}>Your Full Name *</label>
                            <input required autoFocus type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                          </div>
                        </>
                      )}

                      {/* STEP 2: COMPANY & SERVICE */}
                      {step === 2 && (
                        <>
                          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#2f3438] mb-10 tracking-tight text-center">Nice to meet you, {firstName}.</h2>
                          <div className="w-full max-w-sm group mb-10">
                            <label className={labelClass}>Your Company *</label>
                            <input required autoFocus type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" className={inputClass} />
                          </div>
                          <div className="w-full max-w-lg">
                            <label className={labelClass}>What do you need? *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {['Free Technical SEO Audit', 'AI Answer Engine Optimization', 'Web Architecture', 'General Inquiry'].map((srv) => (
                                <button
                                  type="button"
                                  key={srv}
                                  onClick={() => setFormData({ ...formData, service: srv })}
                                  className={`p-4 rounded-md border text-[10px] uppercase tracking-widest font-black transition-all duration-300 ${formData.service === srv ? 'bg-[#ad5b2b] border-[#ad5b2b] text-white shadow-[0_18px_34px_rgba(173,91,43,0.18)]' : 'bg-transparent border-black/10 text-black/46 hover:border-[#ad5b2b]/45 hover:text-[#9b542a]'}`}
                                >
                                  {srv}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* STEP 3: WEBSITE */}
                      {step === 3 && (
                        <>
                          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#2f3438] mb-12 tracking-tight text-center">
                            {formData.service === 'Free Technical SEO Audit' ? 'Target acquired.' : 'Where are we working?'}
                          </h2>
                          <div className="w-full max-w-lg group">
                            <label className={labelClass}>
                              Website URL {formData.service === 'Free Technical SEO Audit' && <span className="text-[#ad5b2b]">(Required)</span>}
                            </label>
                            <input required={formData.service === 'Free Technical SEO Audit'} autoFocus type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.co.uk" className={inputClass} />
                          </div>
                        </>
                      )}

                      {/* STEP 4: CONTACT INFO */}
                      {step === 4 && (
                        <>
                          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#2f3438] mb-10 tracking-tight text-center">Comm channel.</h2>
                          <div className="w-full max-w-sm group mb-8">
                            <label className={labelClass}>Work Email *</label>
                            <input required autoFocus type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" className={inputClass} />
                          </div>
                          <div className="w-full max-w-sm group">
                            <label className={labelClass}>Phone (Optional)</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 7000 000000" className={inputClass} />
                          </div>
                        </>
                      )}

                      {/* STEP 5: MESSAGE */}
                      {step === 5 && (
                        <>
                          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#2f3438] mb-12 tracking-tight text-center">Final parameters.</h2>
                          <div className="w-full max-w-xl group">
                            <label className={labelClass}>Project Notes (Optional)</label>
                            <input autoFocus type="text" name="message" value={formData.message} onChange={handleChange} placeholder="Current challenges..." className={inputClass} />
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* BOTTOM NAVIGATION */}
                <div className="pt-10 flex justify-between items-center mt-8 relative z-20 w-full max-w-2xl mx-auto border-t border-black/8">
                  <div className="w-1/3">
                    {step > 1 && (
                      <button type="button" onClick={handlePrev} className="text-black/42 hover:text-[#ad5b2b] text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                        Back
                      </button>
                    )}
                  </div>
                  <div className="w-1/3 text-center text-[10px] text-black/32 font-mono tracking-widest">
                    0{step} / 0{totalSteps}
                  </div>
                  <div className="w-1/3 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-[#2f3438] hover:bg-[#ad5b2b] text-white px-6 py-3 rounded-md font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                      {isSubmitting ? 'Processing...' : (step === totalSteps ? (formData.service === 'Free Technical SEO Audit' ? 'Start Scan' : 'Transmit') : 'Next')}
                    </button>
                  </div>
                </div>

              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- EDUCATIONAL CONTENT RESTORED --- */}
      <section className="w-full py-24 px-6 border-b border-black/8 bg-[#f4efe4]">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white border-l-2 border-[#ad5b2b] p-6 rounded-r-md mb-12 shadow-[0_20px_70px_rgba(0,0,0,0.05)]">
            <h3 className="text-[10px] font-black text-[#ad5b2b] uppercase tracking-widest mb-2">AEO Quick Answer</h3>
            <p className="text-sm text-black/58 font-medium leading-relaxed">
              Klarai's free AI SEO audit tool analyses any website in 30 seconds using Google Gemini. It checks technical SEO health, on-page signals, Core Web Vitals, local SEO consistency, schema markup, and AI search visibility, then delivers a prioritised, plain-English action plan.
            </p>
          </div>
          <h2 className="font-serif text-4xl font-medium leading-tight text-[#2f3438] mb-6">Most websites have SEO problems hiding in plain sight.</h2>
          <div className="space-y-4 text-sm text-black/58 leading-relaxed font-medium">
            <p>A title tag duplicated across a dozen pages. A robots.txt accidentally blocking Google from your most important service section. A site loading in 6 seconds on mobile while a competitor loads in 1.4. These are not rare edge cases.</p>
            <p>The traditional fix was to hire an agency, wait two weeks for a PDF, and pay several hundred pounds. Klarai's SEO auditor does the same analysis in 30 seconds, powered by Google Gemini.</p>
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-6 border-b border-black/8 bg-[#f9f5ec]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#2f3438] mb-4">What makes this SEO auditor different?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[1.1rem] border border-black/8">
              <h3 className="text-sm font-black text-black/42 mb-6 uppercase tracking-widest">Standard Free Checkers</h3>
              <ul className="space-y-4">
                {["Scan one page in isolation", "Return a score with no priority ranking", "Generic advice that applies to every site", "No AI visibility or GEO checks"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-black/48 font-medium"><span className="text-black/26 mt-0.5">x</span> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#2f3438] p-8 rounded-[1.1rem] border border-[#2f3438]">
              <h3 className="text-sm font-black mb-6 uppercase tracking-widest text-[#e0b48b]">Klarai SEO Auditor</h3>
              <ul className="space-y-4">
                {["Gemini-powered analysis in 30 seconds", "Findings prioritised by revenue impact", "Specific, actionable recommendations", "AI Overview eligibility checks built in"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/76 font-medium"><span className="text-[#e0b48b] mt-0.5">✓</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-6 border-b border-black/8 bg-[#f4efe4]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#2f3438] mb-4">What the Klarai auditor checks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Technical SEO health", desc: "Crawlability, indexability, robots.txt, redirect chains, broken links." },
              { num: "02", title: "On-page signals", desc: "Title tags, meta descriptions, heading structure, and keyword density." },
              { num: "03", title: "Core Web Vitals", desc: "Largest Contentful Paint, Layout Shift, and Interaction to Next Paint." },
              { num: "04", title: "Local SEO signals", desc: "Google Business Profile consistency and UK directory citations." },
              { num: "05", title: "Schema Data", desc: "LocalBusiness, Article, and BreadcrumbList schema markup." },
              { num: "06", title: "AI Readiness", desc: "LLM accessibility and entity clarity for ChatGPT & Perplexity." }
            ].map((item, i) => (
               <div key={i} className="bg-white p-8 rounded-[1.1rem] border border-black/8 hover:border-[#ad5b2b]/45 transition-colors group shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                 <span className="text-2xl font-black text-[#ad5b2b]/32 group-hover:text-[#ad5b2b] transition-colors block mb-4">{item.num}</span>
                 <h3 className="text-lg font-black text-[#2f3438] mb-2">{item.title}</h3>
                 <p className="text-sm text-black/54 font-medium leading-relaxed">{item.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-24 px-6 bg-[#f9f5ec]">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-serif text-4xl font-medium text-[#2f3438] mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is an AI SEO audit tool?", a: "An AI SEO audit tool uses artificial intelligence to analyse your website for technical errors, on-page issues, and visibility problems. Klarai's auditor is powered by Gemini." },
              { q: "Is the Klarai SEO audit tool completely free?", a: "Yes. The SEO audit is free to run with no account creation and no credit card required." },
              { q: "How long does the SEO audit take?", a: "The audit delivers results in approximately 30 seconds." }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-black/8 rounded-[1.1rem] p-6">
                <h4 className="text-sm font-black text-[#2f3438] mb-2">{faq.q}</h4>
                <p className="text-sm text-black/54 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
