"use client";
import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase"; 
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

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

// ==========================================
// COMPONENT: RICH TEXT AREA (Handles Internal Linking)
// ==========================================
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
    
    // Injects an anchor tag with your blue hover styling
    const linkHtml = `<a href="${url}" class="text-blue-400 hover:text-blue-300 underline transition-colors">${textToWrap}</a>`;
    const newValue = value.substring(0, start) + linkHtml + value.substring(end);
    
    // Fire the onChange event with the newly injected HTML
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

// ==========================================
// MAIN ADMIN DASHBOARD
// ==========================================
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
              <div><h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">Editing: <span className="text-[#fcd34d] bg-[#fcd34d]/10 px-3 py-1 rounded-md text-sm border border-[#fcd34d]/20 uppercase">{activeTab}</span></h2></div>
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
// COMPONENT: NICHE PAGE BUILDER
// ==========================================
function NicheBuilderView({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState(initialData || {
    slug: '', metaTitle: '', metaDescription: '', service: '', niche: '', h1: '', subheadline: '', definition: '',
    imageUrl: '', deliverables: ['', '', '', '', '', ''], steps: ['', '', '', ''], whyNeeds: ['', '', ''],
    faqs: [ { q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' }, { q: '', a: '' } ],
    ctaText: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  const handleFaqChange = (index, key, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index][key] = value;
    setFormData({ ...formData, faqs: newFaqs });
  };

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
    } catch (error) { setStatus('Error: Could not save page. Check database connection.'); } 
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to permanently delete the /${pageId} landing page? This action cannot be undone.`);
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
        <div className="flex justify-between items-center mb-2">
          <h2 className={`font-nothing text-3xl uppercase tracking-widest ${isEditing ? 'text-purple-400' : 'text-green-400'}`}>
            {isEditing ? `Editing: /${pageId}` : 'Create New Niche Page'}
          </h2>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10 transition-colors disabled:opacity-50">
              {isDeleting ? 'Deleting...' : 'Delete Page'}
            </button>
          )}
        </div>
        
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-8">Programmatic Landing Page Architecture</p>
        
        {status && <div className={`mb-8 p-4 border text-xs tracking-widest uppercase font-bold ${status.includes('Success') ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>{status}</div>}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">1. Core URL & Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="slug" placeholder="URL Slug (e.g., seo-for-plumbers)" required disabled={isEditing} value={formData.slug} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white disabled:opacity-50" />
              <input name="service" placeholder="Service (e.g., Advanced SEO)" required value={formData.service} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
              <input name="niche" placeholder="Niche (e.g., Plumbers)" required value={formData.niche} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
            </div>
            <input name="metaTitle" placeholder="Meta Title (Max 60 chars)" required value={formData.metaTitle} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
            <textarea name="metaDescription" placeholder="Meta Description (Max 160 chars)" required value={formData.metaDescription} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none h-20 text-white" />
            <input name="imageUrl" placeholder="Hero Image URL (e.g., /1.jpg or https://...)" required value={formData.imageUrl} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">2. Header & Definition Block</h3>
            <input name="h1" placeholder="H1: [Service] for [Niche] in the UK | Klarai" required value={formData.h1} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
            <input name="subheadline" placeholder="Subheadline (1 sentence, outcome-focused)" required value={formData.subheadline} onChange={handleChange} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
            <RichTextArea label="Definition Block" value={formData.definition} onChange={(e) => setFormData({...formData, definition: e.target.value})} rows={4} />
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">3. What's Included (6 Deliverables)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.deliverables.map((item, i) => (
                <input key={i} placeholder={`Deliverable 0${i + 1}`} required value={item} onChange={(e) => handleArrayChange(i, 'deliverables', e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">4. How It Works (4 Steps)</h3>
            {formData.steps.map((item, i) => (
              <input key={i} placeholder={`Step 0${i + 1}`} required value={item} onChange={(e) => handleArrayChange(i, 'steps', e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white" />
            ))}
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">5. Why [Niche] Needs [Service]</h3>
            {formData.whyNeeds.map((item, i) => (
              <RichTextArea key={i} label={`Paragraph 0${i + 1}`} value={item} onChange={(e) => handleArrayChange(i, 'whyNeeds', e.target.value)} rows={3} />
            ))}
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">6. FAQs (6 Q&As)</h3>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 border border-white/5 bg-[#111] rounded">
                <input placeholder={`Q${i + 1}: Question...`} required value={faq.q} onChange={(e) => handleFaqChange(i, 'q', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:border-blue-500 outline-none text-blue-400" />
                <RichTextArea value={faq.a} onChange={(e) => handleFaqChange(i, 'a', e.target.value)} rows={2} placeholder={`A${i + 1}: Answer...`} />
              </div>
            ))}
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">7. Closing CTA</h3>
            <RichTextArea label="Get a Free Audit CTA" value={formData.ctaText} onChange={(e) => setFormData({...formData, ctaText: e.target.value})} rows={3} />
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={isSubmitting || isDeleting} className={`flex-1 text-white font-bold py-5 uppercase tracking-[0.3em] transition-all hover:scale-[1.01] ${isEditing ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'}`}>
              {isSubmitting ? 'Transmitting...' : (isEditing ? 'Update Live Page' : 'Deploy Landing Page')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}