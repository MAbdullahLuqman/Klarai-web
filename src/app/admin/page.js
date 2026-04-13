"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase"; 
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import Link from 'next/link';

// --- SERVICE URL MAP FOR LLMS.TXT ---
const SERVICE_URL_MAP = {
  seo: '/seo-services',
  aeo: '/aeo-services',
  web: '/web-development',
  ads: '/meta-ads',
  smma: '/social-media-marketing'
};

// --- ORIGINAL BASE SCHEMA ---
const generateBaseSchema = (serviceName, keyword) => ({
  meta: { title: `${keyword} Services in the UK | Klarai`, description: `Expert ${keyword} services for UK businesses. More patients, more calls, more revenue. Book a free audit today.` },
  hero: { visible: true, h1: `${keyword} for Ambitious Brands in the UK`, sub: "More traffic. More calls. More revenue. Stop guessing and start scaling.", trust: "UK-based team | 50+ businesses helped | No long-term contracts", btn1Text: "Get Your Free Audit →", btn1Link: "/#audit", btn2Text: "See How It Works ↓", btn2Link: "#what-is" },
  definition: { visible: true, h2: `What Is ${serviceName} — And Why It Matters for UK Businesses`, para: `${serviceName} is the mathematical alignment of your digital architecture with search engine algorithms. It ensures that when your customers search for your services, your business appears first.`, bullets: "Captures high-intent local traffic\nBuilds long-term brand authority\nOutperforms paid ads in ROI" },
  included: { visible: true, h2: `What's Included in Our ${serviceName} Package`, items: "Keyword Research & Strategy: We find the exact terms your buyers are searching for.\nTechnical Optimisation: We make your site lightning fast and perfectly readable by bots.\nMonthly Reporting: Transparent, plain-English reports on your growth." },
  process: { visible: true, h2: `How Our ${serviceName} Process Works`, steps: "Free Audit & Discovery: We analyze your current architecture and competitors.\nStrategy & Roadmap: We build a bespoke 6-month growth plan.\nImplementation: Our engineers and writers execute the strategy flawlessly.\nReporting & Refinement: We track rankings and optimize for maximum ROI." },
  results: { visible: true, h2: "Real Results for UK Businesses", caseStudy: "UK Private Dental Clinic | +340% organic traffic in 4 months | Generated £40k+ in new patient bookings", quote: '"Klarai completely transformed our lead generation. We had to hire more staff just to handle the calls."', author: "Dr. Sarah J. - Clinic Director" },
  pricing: { visible: true, h2: `Transparent ${serviceName} Pricing — No Hidden Fees`, starter: "Starter|£499/mo|/#audit|Basic Keyword Strategy, Monthly Audit, Standard Reporting", growth: "Growth|£899/mo|/#audit|Advanced AEO/SEO, Content Creation, Backlink Building, Priority Support", premium: "Premium|£1,499/mo|/#audit|Full Domination, AI Entity Mapping, Technical Overhaul, Dedicated Account Manager" },
  faq: { visible: true, h2: `Frequently Asked Questions About ${serviceName} in the UK`, qas: "How long does it take to see results?|Typically, you will see initial movement within 3-6 months, with compounding ROI after 6-12 months.\nDo I need to sign a long-term contract?|No. We believe in earning your business every single month. No hidden lock-ins." },
  cta: { visible: true, h2: "Ready to Grow Your Business? Let's Talk.", text: "Stop losing customers to your competitors. Get your free, comprehensive technical audit today.", btnText: "Book a Free Consultation", btnLink: "mailto:founder@klarai.uk" }
});

const INITIAL_DATA = {
  seo: generateBaseSchema("Search Engine Optimisation", "Next-Gen SEO"),
  aeo: generateBaseSchema("Answer Engine Optimisation", "AEO"),
  web: generateBaseSchema("Web Design & Development", "High-Converting Web Design"),
  ads: generateBaseSchema("Meta Ads Management", "High-ROI Meta Ads"),
  smma: generateBaseSchema("Social Media Marketing", "Organic Social Media"),
  footer: { trademark: `© ${new Date().getFullYear()} KLARAI™ All Rights Reserved.`, privacyText: "Privacy Policy", termsText: "Terms & Conditions" }
};

const RichTextArea = ({ label, value, onChange, rows = 3, placeholder = "" }) => {
  const inputRef = useRef(null);

  const handleInsertLink = () => {
    const el = inputRef.current;
    if (!el) return;
    
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const url = window.prompt("Enter link URL (e.g., /seo-services):", "");
    if (!url) return;
    
    const textToWrap = selectedText || window.prompt("Enter text to display:", "Click here");
    if (!textToWrap) return;
    
    const linkHtml = `<a href="${url}" class="text-blue-400 hover:text-blue-300 underline transition-colors">${textToWrap}</a>`;
    const newValue = value.substring(0, start) + linkHtml + value.substring(end);
    onChange({ target: { value: newValue } });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {label ? <label className="block text-xs text-gray-500 font-bold uppercase">{label}</label> : <div></div>}
        <button 
          type="button" 
          onClick={handleInsertLink} 
          className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 border border-blue-500/30 transition-colors flex items-center gap-1 font-bold tracking-widest uppercase"
        >
          🔗 Make Link
        </button>
      </div>
      <textarea 
        ref={inputRef} 
        rows={rows} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white resize-none focus:border-blue-500 outline-none" 
      />
    </div>
  );
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [viewMode, setViewMode] = useState("core"); 
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("seo");
  const [content, setContent] = useState(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const [nichePagesList, setNichePagesList] = useState({});
  const [activeNicheId, setActiveNicheId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) fetchAllLiveContent();
    });
    return () => unsubscribe();
  }, []);

  const fetchAllLiveContent = async () => {
    setIsDataLoading(true);
    const pages = ["aeo", "seo", "web", "ads", "smma", "footer"];
    let liveData = { ...INITIAL_DATA };
    try {
      for (let p of pages) {
        const docRef = doc(db, "pages", p);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          liveData[p] = { ...liveData[p], ...docSnap.data() };
        }
      }
      setContent(liveData);
    } catch (error) { console.error("Error fetching core data:", error); } 
    
    try {
      const nicheQuery = await getDocs(collection(db, "niche_pages"));
      let fetchedNiches = {};
      nicheQuery.forEach(doc => { fetchedNiches[doc.id] = doc.data(); });
      setNichePagesList(fetchedNiches);
    } catch (error) { console.error("Error fetching niche pages:", error); }

    setIsDataLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (error) { setLoginError("Invalid email or password. Access Denied."); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (error) { console.error("Logout Error:", error); }
  };

  const handleNestedChange = (section, field, value) => {
    setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [section]: { ...prev[activeTab]?.[section], [field]: value } } }));
  };
  const handleFlatChange = (field, value) => {
    setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
  };
  const handleSaveToFirebase = async () => {
    setIsSaving(true);
    try {
      const dataToSave = content[activeTab];
      const docRef = doc(db, "pages", activeTab);
      await setDoc(docRef, dataToSave, { merge: true });
      alert(`Success! ${activeTab.toUpperCase()} content synced to Firebase live database.`);
    } catch (error) { alert("Failed to save. Check your Firebase connection."); } 
    finally { setIsSaving(false); }
  };

  const SectionHeader = ({ sectionKey, title }) => {
    const isVisible = content[activeTab][sectionKey]?.visible !== false;
    return (
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 bg-[#0a0a0a] rounded-t-2xl z-10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400">{title}</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <span className={`text-xs font-bold uppercase transition-colors ${isVisible ? 'text-[#10b981]' : 'text-red-500'}`}>
            {isVisible ? 'LIVE ON SITE' : 'HIDDEN ON SITE'}
          </span>
          <div className={`w-11 h-6 rounded-full transition-colors relative ${isVisible ? 'bg-[#10b981]' : 'bg-red-500/40'}`}>
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isVisible ? 'translate-x-5' : ''}`}></div>
          </div>
          <input type="checkbox" className="hidden" checked={isVisible} onChange={(e) => handleNestedChange(sectionKey, 'visible', e.target.checked)} />
        </label>
      </div>
    );
  };

  if (isAuthLoading) return <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">Authenticating...</div>;
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 font-sans selection:bg-[#185FA5] selection:text-white">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="flex justify-center mb-8"><img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 object-contain" /></div>
          <h1 className="text-xl font-bold text-white text-center mb-2 tracking-wide">Admin Portal</h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Admin Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6]" required /></div>
            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6]" required /></div>
            {loginError && <p className="text-xs text-red-500 text-center font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-[#185FA5] hover:bg-[#144d85] text-white font-bold py-3 rounded-xl mt-4">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  if (isDataLoading) return <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">Loading Secure Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 flex font-sans selection:bg-[#3b82f6] selection:text-white">
      
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="h-20 flex items-center px-8 border-b border-white/10 shrink-0"><span className="text-xl font-bold tracking-widest text-white">KLARAI <span className="text-[#3b82f6]">ADMIN</span></span></div>
        <div className="p-4 flex-1 overflow-y-auto space-y-8">
          
          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Workspace</p>
            <nav className="flex flex-col gap-2">
              <button onClick={() => setViewMode("leads")} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${viewMode === "leads" ? "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>Leads Tracker</button>
              <button onClick={() => setViewMode("builder")} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${viewMode === "builder" ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>+ New Niche Page</button>
            </nav>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Core Pages</p>
            <nav className="flex flex-col gap-2">
              {[ { id: "seo", name: "SEO Services" }, { id: "aeo", name: "AEO Services" }, { id: "web", name: "Web Development" }, { id: "ads", name: "Meta Ads" }, { id: "smma", name: "Social Media" }, { id: "footer", name: "Global Footer" } ].map((tab) => (
                <button key={tab.id} onClick={() => { setViewMode("core"); setActiveTab(tab.id); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${viewMode === "core" && activeTab === tab.id ? "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>{tab.name}</button>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Active Niche Pages</p>
            <nav className="flex flex-col gap-2">
              {Object.keys(nichePagesList).length === 0 ? (
                <p className="px-4 text-xs text-gray-600 italic">No custom pages built yet.</p>
              ) : (
                Object.keys(nichePagesList).map((nicheId) => (
                  <button key={nicheId} onClick={() => { setViewMode("nicheEdit"); setActiveNicheId(nicheId); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${viewMode === "nicheEdit" && activeNicheId === nicheId ? "bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                    /{nicheId}
                  </button>
                ))
              )}
            </nav>
          </div>

        </div>
        <div className="p-4 border-t border-white/10 shrink-0">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg font-bold">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {viewMode === "leads" && <LeadsView />}
        {viewMode === "builder" && <NicheBuilderView isEditing={false} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}
        {viewMode === "nicheEdit" && <NicheBuilderView key={activeNicheId} isEditing={true} pageId={activeNicheId} initialData={nichePagesList[activeNicheId]} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}

        {viewMode === "core" && (
          <>
            <header className="h-20 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">Editing: <span className="text-[#fcd34d] bg-[#fcd34d]/10 px-3 py-1 rounded-md text-sm border border-[#fcd34d]/20 uppercase">{activeTab}</span></h2>
                
                <Link href="/llms.txt" target="_blank" className="text-[10px] bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded uppercase tracking-widest font-bold transition-colors">
                  Global llms.txt
                </Link>

                {/* --- NEW BUTTON: Dynamically points to the active core service llms.txt --- */}
                {activeTab !== 'footer' && (
                  <Link 
                    href={`${SERVICE_URL_MAP[activeTab]}/llms.txt`} 
                    target="_blank" 
                    className="bg-[#3b82f6] text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Service llms.txt
                  </Link>
                )}
              </div>
              <button onClick={handleSaveToFirebase} disabled={isSaving} className="bg-[#185FA5] hover:bg-[#144d85] text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(24,95,165,0.4)] disabled:opacity-50 flex items-center gap-2 text-sm">
                {isSaving ? "Pushing to Live..." : "Save Core to Firebase"}
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto space-y-8 pb-32">
                  {activeTab !== "footer" ? (
                    <>
                      <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                          <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Meta Data & SEO</h3>
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Title</label><input type="text" value={content[activeTab].meta?.title || ""} onChange={(e) => handleNestedChange('meta', 'title', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Description</label><textarea rows="2" value={content[activeTab].meta?.description || ""} onChange={(e) => handleNestedChange('meta', 'description', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white resize-none" /></div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].hero?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="hero" title="Block 1: Hero Section" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Main H1 Headline</label><input type="text" value={content[activeTab].hero?.h1 || ""} onChange={(e) => handleNestedChange('hero', 'h1', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-bold" /></div>
                              <RichTextArea label="Subheadline" value={content[activeTab].hero?.sub || ""} onChange={(e) => handleNestedChange('hero', 'sub', e.target.value)} rows={2} />
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Trust Bar (Separate with | )</label><input type="text" value={content[activeTab].hero?.trust || ""} onChange={(e) => handleNestedChange('hero', 'trust', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Primary Button Text</label><input type="text" value={content[activeTab].hero?.btn1Text || ""} onChange={(e) => handleNestedChange('hero', 'btn1Text', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Primary Button Link URL</label><input type="text" value={content[activeTab].hero?.btn1Link || ""} onChange={(e) => handleNestedChange('hero', 'btn1Link', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#3b82f6]" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Secondary Button Text</label><input type="text" value={content[activeTab].hero?.btn2Text || ""} onChange={(e) => handleNestedChange('hero', 'btn2Text', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Secondary Button Link URL</label><input type="text" value={content[activeTab].hero?.btn2Link || ""} onChange={(e) => handleNestedChange('hero', 'btn2Link', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#3b82f6]" /></div>
                              </div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].definition?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="definition" title="Block 2: Definition (Snippet Target)" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].definition?.h2 || ""} onChange={(e) => handleNestedChange('definition', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <RichTextArea label="Paragraph (40-60 words)" value={content[activeTab].definition?.para || ""} onChange={(e) => handleNestedChange('definition', 'para', e.target.value)} />
                              <RichTextArea label="Bullet Points (One per line)" value={content[activeTab].definition?.bullets || ""} onChange={(e) => handleNestedChange('definition', 'bullets', e.target.value)} placeholder="Point 1&#10;Point 2" />
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].included?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="included" title="Block 3: What's Included" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].included?.h2 || ""} onChange={(e) => handleNestedChange('included', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <RichTextArea label="Items (Format: Title: Description) - One per line" value={content[activeTab].included?.items || ""} onChange={(e) => handleNestedChange('included', 'items', e.target.value)} rows={4} />
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].process?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="process" title="Block 4: Process" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].process?.h2 || ""} onChange={(e) => handleNestedChange('process', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <RichTextArea label="Steps (Format: Step Title: Description) - One per line" value={content[activeTab].process?.steps || ""} onChange={(e) => handleNestedChange('process', 'steps', e.target.value)} rows={4} />
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].results?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="results" title="Block 5: Results / Social Proof" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].results?.h2 || ""} onChange={(e) => handleNestedChange('results', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Case Study (Format: Niche | Metric | Outcome)</label><input type="text" value={content[activeTab].results?.caseStudy || ""} onChange={(e) => handleNestedChange('results', 'caseStudy', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <RichTextArea label="Testimonial Quote" value={content[activeTab].results?.quote || ""} onChange={(e) => handleNestedChange('results', 'quote', e.target.value)} rows={2} />
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Testimonial Author</label><input type="text" value={content[activeTab].results?.author || ""} onChange={(e) => handleNestedChange('results', 'author', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].pricing?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="pricing" title="Block 6: Pricing" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].pricing?.h2 || ""} onChange={(e) => handleNestedChange('pricing', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Starter Tier (Format: Name | Price | Link URL | Feature 1, Feature 2)</label><input type="text" value={content[activeTab].pricing?.starter || ""} onChange={(e) => handleNestedChange('pricing', 'starter', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Growth Tier (Format: Name | Price | Link URL | Feature 1, Feature 2)</label><input type="text" value={content[activeTab].pricing?.growth || ""} onChange={(e) => handleNestedChange('pricing', 'growth', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Premium Tier (Format: Name | Price | Link URL | Feature 1, Feature 2)</label><input type="text" value={content[activeTab].pricing?.premium || ""} onChange={(e) => handleNestedChange('pricing', 'premium', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                          </div>
                      </section>

                      <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].faq?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="faq" title="Block 7: FAQ" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].faq?.h2 || ""} onChange={(e) => handleNestedChange('faq', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <RichTextArea label="Questions & Answers (Format: Question?|Answer) - One per line" value={content[activeTab].faq?.qas || ""} onChange={(e) => handleNestedChange('faq', 'qas', e.target.value)} rows={4} />
                          </div>
                      </section>

                       <section className={`bg-[#0a0a0a] p-6 rounded-2xl border ${content[activeTab].cta?.visible !== false ? 'border-white/10' : 'border-red-500/30'} shadow-xl`}>
                          <SectionHeader sectionKey="cta" title="Block 8: Final CTA" />
                          <div className="space-y-4">
                              <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">H2 Headline</label><input type="text" value={content[activeTab].cta?.h2 || ""} onChange={(e) => handleNestedChange('cta', 'h2', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                              <RichTextArea label="Description Text" value={content[activeTab].cta?.text || ""} onChange={(e) => handleNestedChange('cta', 'text', e.target.value)} rows={2} />
                              <div className="grid grid-cols-2 gap-4">
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Button Text</label><input type="text" value={content[activeTab].cta?.btnText || ""} onChange={(e) => handleNestedChange('cta', 'btnText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                                  <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Button Link URL</label><input type="text" value={content[activeTab].cta?.btnLink || ""} onChange={(e) => handleNestedChange('cta', 'btnLink', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-[#3b82f6]" /></div>
                              </div>
                          </div>
                      </section>
                    </>
                  ) : (
                    <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Global Footer Settings</h3>
                        <div className="space-y-5">
                            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Trademark Text</label><input type="text" value={content[activeTab].trademark || ""} onChange={(e) => handleFlatChange('trademark', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Privacy Policy Link Text</label><input type="text" value={content[activeTab].privacyText || ""} onChange={(e) => handleFlatChange('privacyText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                            <div><label className="block text-xs text-gray-500 font-bold uppercase mb-2">Terms & Conditions Link Text</label><input type="text" value={content[activeTab].termsText || ""} onChange={(e) => handleFlatChange('termsText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white" /></div>
                        </div>
                    </section>
                  )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ==========================================
// COMPONENT: LEADS DASHBOARD
// ==========================================
function LeadsView() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(leadsData);
      } catch (err) { console.error("Error fetching leads:", err); } 
      finally { setLoading(false); }
    };
    fetchLeads();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <h2 className="font-nothing text-3xl uppercase tracking-widest text-white">Incoming Audit Requests</h2>
        {loading ? (
          <div className="text-blue-500 animate-pulse tracking-widest uppercase text-sm">Fetching Secure Data...</div>
        ) : (
          <div className="grid gap-4">
            {leads.length === 0 ? (
              <p className="text-gray-500 uppercase tracking-widest text-xs">No active leads in the database.</p>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-lg flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:border-blue-500/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-bold text-white uppercase tracking-widest text-sm">{lead.name || 'Anonymous'}</p>
                    <p className="text-gray-400 text-xs tracking-wider">{lead.email} | {lead.phone}</p>
                    {lead.website && <p className="text-blue-400 text-xs tracking-wider">{lead.website}</p>}
                  </div>
                  <div className="text-left md:text-right space-y-1">
                    <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] uppercase tracking-widest rounded-full">
                      Goal: {lead.goal}
                    </span>
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest">
                      {lead.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: NICHE PAGE BUILDER (AEO/SEO STRICT)
// ==========================================
function NicheBuilderView({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const parseArray = (arr, defaultObj, stringMapKey) => {
    if (!Array.isArray(arr) || arr.length === 0) return [{ ...defaultObj }];
    return arr.map(item => {
       if (typeof item === 'string') return { ...defaultObj, [stringMapKey]: item };
       if (typeof item === 'object' && item !== null) return { ...defaultObj, ...item };
       return { ...defaultObj };
    });
  };

  const [formData, setFormData] = useState(() => {
    const base = initialData || {};
    return {
      slug: base.slug || '',
      service: base.service || '',
      niche: base.niche || '',
      imageUrl: base.imageUrl || '',
      metaTitle: base.metaTitle || '',
      metaDescription: base.metaDescription || '',
      h1: base.h1 || '',
      subheadline: base.subheadline || '',
      trustLine: base.trustLine || '',
      tldr: base.tldr || '',
      statCards: parseArray(base.statCards, { number: '', label: '', source: '' }, 'label'),
      h2Sections: parseArray(base.h2Sections, { question: '', directAnswer: '', expansion: '' }, 'question'),
      deliverables: parseArray(base.deliverables, { action: '', outcome: '' }, 'action'),
      faqs: parseArray(base.faqs, { q: '', a: '' }, 'q'),
      relatedLinks: parseArray(base.relatedLinks, { title: '', url: '' }, 'title'),
      caseStudy: base.caseStudy || { location: '', before: '', after: '', time: '', kwBefore: '', kwAfter: '' },
      process: Array.isArray(base.process) && base.process.length > 0 
        ? base.process 
        : ['Audit & Discovery', 'Strategic Blueprint', 'Execution & Deployment', 'Scaling & Growth'],
      authorName: base.authorName || 'Abdullah Luqman',
      authorRole: base.authorRole || 'Lead System Architect'
    };
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateArray = (key, index, field, value) => {
    const currentArray = formData[key] || [];
    const newArr = [...currentArray];
    let obj = newArr[index];
    if (typeof obj !== 'object' || obj === null) {
      obj = {};
    } else {
      obj = { ...obj };
    }
    obj[field] = value;
    newArr[index] = obj;
    setFormData({ ...formData, [key]: newArr });
  };

  const addArrayItem = (key, emptyObj) => {
    const currentArray = formData[key] || [];
    setFormData({ ...formData, [key]: [...currentArray, emptyObj] });
  };

  const updateProcess = (index, value) => {
    const newProcess = formData.process ? [...formData.process] : ['', '', '', ''];
    newProcess[index] = value;
    setFormData({ ...formData, process: newProcess });
  };

  const handleCaseStudy = (e) => setFormData({ ...formData, caseStudy: { ...(formData.caseStudy || {}), [e.target.name]: e.target.value }});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Deploying to database...');
    try {
      const targetSlug = isEditing ? pageId : formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const pageRef = doc(db, 'niche_pages', targetSlug);
      await setDoc(pageRef, { ...formData, slug: targetSlug, updatedAt: serverTimestamp() });
      setStatus(`Success: Niche Page ${isEditing ? 'updated' : 'generated'} and is now live!`);
      refreshData();
      window.scrollTo(0, 0);
    } catch (error) { setStatus(`Error: ${error.message}`); } 
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to permanently delete /${pageId}?`);
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'niche_pages', pageId));
      alert(`Niche page /${pageId} deleted successfully.`);
      await refreshData();
      setViewMode('core'); 
    } catch (error) { alert('Error: Could not delete page.'); setIsDeleting(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className={`font-black text-2xl uppercase tracking-widest ${isEditing ? 'text-purple-400' : 'text-green-400'}`}>
            {isEditing ? `Editing: /${pageId}` : 'Strict Niche Architecture Builder'}
          </h2>
          <div className="flex items-center gap-3">
            <Link 
               href={`/niche/${formData.slug || pageId || 'draft'}/llms.txt`} 
               target="_blank"
               className="bg-[#3b82f6] text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              View Live Niche llms.txt
            </Link>
            
            {isEditing && (
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10 transition-colors disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
        
        {status && <div className={`mb-8 p-4 border text-xs tracking-widest uppercase font-bold rounded ${status.includes('Success') ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* BASICS */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">1. System Config & Hub Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="slug" placeholder="URL Slug (e.g., seo-for-plumbers)" required disabled={isEditing} value={formData.slug || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white disabled:opacity-50 rounded" />
              <input name="service" placeholder="Hub Service (e.g., Advanced SEO)" required value={formData.service || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="niche" placeholder="Hub Niche (e.g., Plumbers)" required value={formData.niche || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
            <input name="imageUrl" placeholder="Hub Card Image URL (/1.jpg)" required value={formData.imageUrl || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">2. Page Hero & Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="metaTitle" placeholder="Meta Title" value={formData.metaTitle || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="metaDescription" placeholder="Meta Description" value={formData.metaDescription || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
            <input name="h1" placeholder="H1 (Keyword + Outcome)" required value={formData.h1 || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white font-bold rounded" />
            <input name="subheadline" placeholder="Subline (Proof + Timeframe)" value={formData.subheadline || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            <input name="trustLine" placeholder="Trust Line (e.g., No contracts · Results-focused)" value={formData.trustLine || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
          </div>

          {/* TL;DR */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">3. TL;DR Block (50-60 words MAX)</h3>
            <textarea name="tldr" placeholder="Direct, factual answer optimized for Featured Snippets/AEO..." value={formData.tldr || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white h-24 rounded" />
          </div>

          {/* STATS */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">4. Stat Cards (Max 3)</h3>
            {formData.statCards.map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Number (e.g., 300%)" value={stat.number || ''} onChange={(e) => updateArray('statCards', i, 'number', e.target.value)} className="w-1/4 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-[#3b82f6] font-bold rounded" />
                <input placeholder="Label (e.g., more leads)" value={stat.label || ''} onChange={(e) => updateArray('statCards', i, 'label', e.target.value)} className="w-1/2 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
                <input placeholder="Source" value={stat.source || ''} onChange={(e) => updateArray('statCards', i, 'source', e.target.value)} className="w-1/4 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-gray-400 rounded" />
              </div>
            ))}
            {formData.statCards.length < 3 && <button type="button" onClick={() => addArrayItem('statCards', {number:'', label:'', source:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add Stat</button>}
          </div>

          {/* H2 SECTIONS */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">5. Question-Based H2s</h3>
            {formData.h2Sections.map((sec, i) => (
              <div key={i} className="space-y-3 p-4 bg-[#111] border border-white/5 rounded">
                <input placeholder="H2 Question (e.g., How does Google rank plumbers?)" value={sec.question || ''} onChange={(e) => updateArray('h2Sections', i, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                <textarea placeholder="Direct Answer (40-60 words)" value={sec.directAnswer || ''} onChange={(e) => updateArray('h2Sections', i, 'directAnswer', e.target.value)} className="w-full bg-blue-900/20 border border-blue-500/20 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
                <textarea placeholder="Expansion (100-150 words)" value={sec.expansion || ''} onChange={(e) => updateArray('h2Sections', i, 'expansion', e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded h-24" />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('h2Sections', {question:'', directAnswer:'', expansion:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add H2 Section</button>
          </div>

          {/* DELIVERABLES */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">6. Deliverables (Action → Outcome)</h3>
            {formData.deliverables.map((del, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Action (e.g., FAQ Schema)" value={del.action || ''} onChange={(e) => updateArray('deliverables', i, 'action', e.target.value)} className="flex-1 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
                <input placeholder="Outcome (e.g., appear in snippets)" value={del.outcome || ''} onChange={(e) => updateArray('deliverables', i, 'outcome', e.target.value)} className="flex-1 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('deliverables', {action:'', outcome:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add Deliverable</button>
          </div>

          {/* CASE STUDY */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">7. Niche Case Study</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="location" placeholder="Location/Type (e.g., UK Plumber)" value={formData.caseStudy?.location || ''} onChange={handleCaseStudy} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="time" placeholder="Timeframe (e.g., 4 months)" value={formData.caseStudy?.time || ''} onChange={handleCaseStudy} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="before" placeholder="Metric Before (e.g., 15 calls/mo)" value={formData.caseStudy?.before || ''} onChange={handleCaseStudy} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="after" placeholder="Metric After (e.g., 70 calls/mo)" value={formData.caseStudy?.after || ''} onChange={handleCaseStudy} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="kwBefore" placeholder="Page 1 KWs Before (e.g., 2)" value={formData.caseStudy?.kwBefore || ''} onChange={handleCaseStudy} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="kwAfter" placeholder="Page 1 KWs After (e.g., 19)" value={formData.caseStudy?.kwAfter || ''} onChange={handleCaseStudy} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
          </div>

          {/* PROCESS */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">8. Simple Process (4 Steps)</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.process.map((step, i) => (
                <input key={i} placeholder={`Step ${i+1}`} value={step || ''} onChange={(e) => updateProcess(i, e.target.value)} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              ))}
            </div>
          </div>

          {/* FAQS */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">9. FAQ Section (Feeds JSON-LD)</h3>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 border border-white/5 bg-[#111] rounded">
                <input placeholder="Question" value={faq.q || ''} onChange={(e) => updateArray('faqs', i, 'q', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:border-blue-500 outline-none text-white" />
                <textarea placeholder="Answer (Include numbers, clear outcomes)" value={faq.a || ''} onChange={(e) => updateArray('faqs', i, 'a', e.target.value)} className="w-full bg-transparent p-2 text-sm focus:border-blue-500 outline-none text-gray-300 h-20" />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('faqs', {q:'', a:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add FAQ</button>
          </div>

          {/* RELATED LINKS */}
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">10. Related Guides (Internal Linking)</h3>
            {formData.relatedLinks.map((link, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Link Title" value={link.title || ''} onChange={(e) => updateArray('relatedLinks', i, 'title', e.target.value)} className="flex-1 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
                <input placeholder="Absolute or Relative URL" value={link.url || ''} onChange={(e) => updateArray('relatedLinks', i, 'url', e.target.value)} className="flex-1 bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-[#3b82f6] rounded" />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('relatedLinks', {title:'', url:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add Link</button>
          </div>

          {/* AUTHOR & SUBMIT */}
          <div className="p-6 bg-[#111] rounded-lg border border-white/10 space-y-6">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">11. Author Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="authorName" placeholder="Author Name" value={formData.authorName || ''} onChange={handleChange} className="p-3 border border-white/10 bg-black text-white rounded focus:border-blue-500 outline-none text-sm" />
              <input name="authorRole" placeholder="Author Role" value={formData.authorRole || ''} onChange={handleChange} className="p-3 border border-white/10 bg-black text-white rounded focus:border-blue-500 outline-none text-sm" />
            </div>
            
            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
              <button type="submit" disabled={isSubmitting || isDeleting} className={`px-10 py-4 rounded font-black uppercase tracking-widest text-sm transition-all shadow-lg w-full md:w-auto ${isEditing ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}>
                {isSubmitting ? 'Transmitting...' : (isEditing ? 'Update Live Architecture' : 'Deploy Architecture')}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}