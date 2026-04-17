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

// ==========================================
// UPGRADED RICH TEXT AREA (LINKS & IMAGES)
// ==========================================
const RichTextArea = ({ label, value, onChange, name, rows = 3, placeholder = "" }) => {
  const inputRef = useRef(null);

  const handleInsertLink = () => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const url = window.prompt("Enter link URL (e.g., /seo-services or https://...):", "");
    if (!url) return;
    
    const textToWrap = selectedText || window.prompt("Enter text to display:", "Click here");
    if (!textToWrap) return;
    
    const linkHtml = `<a href="${url}" class="text-[#008dd8] hover:underline font-bold transition-colors">${textToWrap}</a>`;
    const newValue = value.substring(0, start) + linkHtml + value.substring(end);
    onChange({ target: { name: name || el.name, value: newValue } });
  };

  const handleInsertImage = () => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    
    const url = window.prompt("Enter Image URL (e.g., /images/chart.jpg or https://...):", "");
    if (!url) return;
    
    const alt = window.prompt("Enter Image Alt Text (Important for SEO):", "Klarai Architecture");
    
    // Injects a beautifully styled responsive image tag
    const imgHtml = `\n\n<img src="${url}" alt="${alt}" class="w-full rounded-2xl my-8 border-2 border-gray-100 shadow-sm object-cover" />\n\n`;
    const newValue = value.substring(0, start) + imgHtml + value.substring(end);
    onChange({ target: { name: name || el.name, value: newValue } });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {label ? <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</label> : <div></div>}
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={handleInsertLink} 
            className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/20 border border-blue-500/30 transition-colors flex items-center gap-1 font-bold uppercase"
          >
            🔗 Link
          </button>
          <button 
            type="button" 
            onClick={handleInsertImage} 
            className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors flex items-center gap-1 font-bold uppercase"
          >
            🖼️ Image
          </button>
        </div>
      </div>
      <textarea 
        name={name}
        ref={inputRef} 
        rows={rows} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-200 resize-y focus:border-blue-500 outline-none leading-relaxed" 
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
  const [blogPagesList, setBlogPagesList] = useState({});
  const [activeNicheId, setActiveNicheId] = useState(null);
  const [activeBlogId, setActiveBlogId] = useState(null);

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
    } catch (error) {} 
    
    try {
      const nicheQuery = await getDocs(collection(db, "niche_pages"));
      let fetchedNiches = {};
      nicheQuery.forEach(doc => { fetchedNiches[doc.id] = doc.data(); });
      setNichePagesList(fetchedNiches);
    } catch (error) {}

    try {
      const blogQuery = await getDocs(collection(db, "blog_posts"));
      let fetchedBlogs = {};
      blogQuery.forEach(doc => { fetchedBlogs[doc.id] = doc.data(); });
      setBlogPagesList(fetchedBlogs);
    } catch (error) {}

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
              <button onClick={() => setViewMode("leads")} className={`text-left px-4 py-2 text-sm font-medium rounded hover:bg-white/5 transition-colors ${viewMode === "leads" ? "text-[#3b82f6]" : "text-gray-400 hover:text-white"}`}>Leads Tracker</button>
              <button onClick={() => setViewMode("builder")} className={`text-left px-4 py-2 text-sm font-medium rounded hover:bg-white/5 transition-colors ${viewMode === "builder" ? "text-[#10b981]" : "text-[#10b981]/70 hover:text-[#10b981]"}`}>+ New Niche Page</button>
              <button onClick={() => setViewMode("blogBuilder")} className={`text-left px-4 py-2 text-sm font-medium rounded hover:bg-white/5 transition-colors ${viewMode === "blogBuilder" ? "text-purple-400" : "text-purple-400/70 hover:text-purple-400"}`}>+ New Blog Post</button>
            </nav>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Core Pages</p>
            <nav className="flex flex-col gap-2">
              {[ { id: "seo", name: "SEO Services" }, { id: "aeo", name: "AEO Services" }, { id: "web", name: "Web Development" }, { id: "ads", name: "Meta Ads" }, { id: "smma", name: "Social Media" }, { id: "footer", name: "Global Footer" } ].map((tab) => (
                <button key={tab.id} onClick={() => { setViewMode("core"); setActiveTab(tab.id); }} className={`text-left px-4 py-2 text-sm font-medium rounded hover:bg-white/5 transition-colors ${viewMode === "core" && activeTab === tab.id ? "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "text-gray-400 hover:text-white"}`}>{tab.name}</button>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Active Blog Posts</p>
            <nav className="flex flex-col gap-2">
              {Object.keys(blogPagesList).length === 0 ? (
                <p className="px-4 text-xs text-gray-600 italic">No posts published yet.</p>
              ) : (
                Object.keys(blogPagesList).map((blogId) => (
                  <button key={blogId} onClick={() => { setViewMode("blogEdit"); setActiveBlogId(blogId); }} className={`text-left px-4 py-2 text-sm font-medium rounded hover:bg-white/5 transition-colors truncate ${viewMode === "blogEdit" && activeBlogId === blogId ? "bg-purple-500/10 text-purple-400 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}>
                    /blog/{blogId}
                  </button>
                ))
              )}
            </nav>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Active Niche Pages</p>
            <nav className="flex flex-col gap-2">
              {Object.keys(nichePagesList).length === 0 ? (
                <p className="px-4 text-xs text-gray-600 italic">No custom pages built yet.</p>
              ) : (
                Object.keys(nichePagesList).map((nicheId) => (
                  <button key={nicheId} onClick={() => { setViewMode("nicheEdit"); setActiveNicheId(nicheId); }} className={`text-left px-4 py-2 text-sm font-medium rounded hover:bg-white/5 transition-colors truncate ${viewMode === "nicheEdit" && activeNicheId === nicheId ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30" : "text-gray-400 hover:text-white"}`}>
                    /niche/{nicheId}
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

        {viewMode === "blogBuilder" && <BlogBuilderView isEditing={false} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}
        {viewMode === "blogEdit" && <BlogBuilderView key={activeBlogId} isEditing={true} pageId={activeBlogId} initialData={blogPagesList[activeBlogId]} refreshData={fetchAllLiveContent} setViewMode={setViewMode} />}

        {viewMode === "core" && (
          <>
            <header className="h-20 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">Editing: <span className="text-[#fcd34d] bg-[#fcd34d]/10 px-3 py-1 rounded-md text-sm border border-[#fcd34d]/20 uppercase">{activeTab}</span></h2>
                
                <Link href="/llms.txt" target="_blank" className="text-[10px] bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded uppercase tracking-widest font-bold transition-colors">
                  Global llms.txt
                </Link>

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
      tldr: base.tldr || '', // Now a string to use RichText
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
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to permanently delete /niche/${pageId}?`);
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'niche_pages', pageId));
      alert(`Niche page /niche/${pageId} deleted successfully.`);
      await refreshData();
      setViewMode('core'); 
    } catch (error) { alert('Error: Could not delete page.'); setIsDeleting(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className={`font-black text-2xl uppercase tracking-widest ${isEditing ? 'text-[#10b981]' : 'text-green-400'}`}>
            {isEditing ? `Editing Niche: /${pageId}` : 'Strict Niche Architecture Builder'}
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

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">3. TL;DR Block (50-60 words MAX)</h3>
            <RichTextArea 
              name="tldr" 
              value={formData.tldr || ''} 
              onChange={handleChange} 
              placeholder="Direct, factual answer optimized for Featured Snippets/AEO..." 
              rows={4} 
            />
          </div>

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

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">5. Question-Based H2s</h3>
            {formData.h2Sections.map((sec, i) => (
              <div key={i} className="space-y-3 p-4 bg-[#111] border border-white/5 rounded">
                <input placeholder="H2 Question (e.g., How does Google rank plumbers?)" value={sec.question || ''} onChange={(e) => updateArray('h2Sections', i, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                
                <RichTextArea 
                  label="Direct Answer (40-60 words)" 
                  value={sec.directAnswer || ''} 
                  onChange={(e) => updateArray('h2Sections', i, 'directAnswer', e.target.value)} 
                  rows={2} 
                />
                
                <RichTextArea 
                  label="Expansion (100-150 words)" 
                  value={sec.expansion || ''} 
                  onChange={(e) => updateArray('h2Sections', i, 'expansion', e.target.value)} 
                  rows={4} 
                />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('h2Sections', {question:'', directAnswer:'', expansion:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add H2 Section</button>
          </div>

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

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">8. Simple Process (4 Steps)</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.process.map((step, i) => (
                <input key={i} placeholder={`Step ${i+1}`} value={step || ''} onChange={(e) => updateProcess(i, e.target.value)} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-[#0a0a0a] border border-white/10 p-6 rounded-lg">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">9. FAQ Section (Feeds JSON-LD)</h3>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 border border-white/5 bg-[#111] rounded">
                <input placeholder="Question" value={faq.q || ''} onChange={(e) => updateArray('faqs', i, 'q', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:border-blue-500 outline-none text-white" />
                <RichTextArea 
                  placeholder="Answer (Include numbers, clear outcomes)" 
                  value={faq.a || ''} 
                  onChange={(e) => updateArray('faqs', i, 'a', e.target.value)} 
                  rows={3} 
                />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('faqs', {q:'', a:''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add FAQ</button>
          </div>

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

          <div className="p-6 bg-[#111] rounded-lg border border-white/10 space-y-6">
            <h3 className="text-blue-400 uppercase tracking-widest text-[10px] font-bold">11. Author Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="authorName" placeholder="Author Name" value={formData.authorName || ''} onChange={handleChange} className="p-3 border border-white/10 bg-black text-white rounded focus:border-blue-500 outline-none text-sm" />
              <input name="authorRole" placeholder="Author Role" value={formData.authorRole || ''} onChange={handleChange} className="p-3 border border-white/10 bg-black text-white rounded focus:border-blue-500 outline-none text-sm" />
            </div>
            
            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
              <button type="submit" disabled={isSubmitting || isDeleting} className={`px-10 py-4 rounded font-black uppercase tracking-widest text-sm transition-all shadow-lg w-full md:w-auto ${isEditing ? 'bg-[#10b981] hover:bg-emerald-400 text-white' : 'bg-[#10b981] hover:bg-emerald-400 text-white'}`}>
                {isSubmitting ? 'Transmitting...' : (isEditing ? 'Update Live Niche Architecture' : 'Deploy Niche Architecture')}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: BLOG BUILDER (THE MASSIVE CMS)
// ==========================================
function BlogBuilderView({ isEditing, pageId, initialData, refreshData, setViewMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const parseArray = (arr, defaultVal) => (!Array.isArray(arr) || arr.length === 0) ? [defaultVal] : arr;

  const [formData, setFormData] = useState(() => {
    const b = initialData || {};
    return {
      slug: b.slug || '',
      seoMeta: b.seoMeta || { title: '', metaDescription: '', canonicalUrl: '' },
      breadcrumbs: parseArray(b.breadcrumbs, { name: 'Home', url: '/' }),
      hero: b.hero || { title: '', description: '', authorName: 'Abdullah Luqman', authorProfileUrl: '/about', publishDate: new Date().toISOString().split('T')[0], readTime: '5 Min' },
      tldr: parseArray(b.tldr, ''),
      quickAnswer: b.quickAnswer || '',
      intro: parseArray(b.intro, ''),
      sections: parseArray(b.sections, { id: 'section-1', heading: '', contentType: 'default', content: [''], list: [], subheadings: [] }),
      toolBlock: b.toolBlock || { title: 'Free System Audit', description: 'Find out exactly where your digital architecture is failing.', ctaText: 'Start Audit', ctaLink: '/free-audit' },
      faqs: parseArray(b.faqs, { question: '', answer: '' }),
      authorInfo: b.authorInfo || { name: 'Abdullah Luqman', role: 'Lead Architect', bio: 'Architecting digital systems for absolute scale.', profileUrl: '/about' }
    };
  });

  const handleChange = (e, objKey) => {
    if(objKey) {
       setFormData({...formData, [objKey]: {...formData[objKey], [e.target.name]: e.target.value}});
    } else {
       setFormData({...formData, [e.target.name]: e.target.value});
    }
  };

  const updateSimpleArray = (key, index, value) => {
    const newArr = [...formData[key]];
    newArr[index] = value;
    setFormData({...formData, [key]: newArr});
  };
  const addSimpleArrayItem = (key) => setFormData({...formData, [key]: [...formData[key], '']});

  const updateComplexArray = (key, index, field, value) => {
    const newArr = [...formData[key]];
    newArr[index] = { ...newArr[index], [field]: value };
    setFormData({...formData, [key]: newArr});
  };
  const addComplexArrayItem = (key, obj) => setFormData({...formData, [key]: [...formData[key], obj]});

  const updateSectionArray = (secIndex, field, arrIndex, value) => {
    const newSecs = [...formData.sections];
    newSecs[secIndex][field][arrIndex] = value;
    setFormData({...formData, sections: newSecs});
  };

  const addSubheading = (secIndex) => {
    const newSecs = [...formData.sections];
    if(!newSecs[secIndex].subheadings) newSecs[secIndex].subheadings = [];
    newSecs[secIndex].subheadings.push({ title: '', content: [''] });
    setFormData({...formData, sections: newSecs});
  };

  const updateSubheading = (secIndex, subIndex, field, value, contentIndex = -1) => {
    const newSecs = [...formData.sections];
    if (field === 'content') {
      newSecs[secIndex].subheadings[subIndex].content[contentIndex] = value;
    } else {
      newSecs[secIndex].subheadings[subIndex][field] = value;
    }
    setFormData({...formData, sections: newSecs});
  };

  const addSubheadingContent = (secIndex, subIndex) => {
     const newSecs = [...formData.sections];
     newSecs[secIndex].subheadings[subIndex].content.push('');
     setFormData({...formData, sections: newSecs});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetSlug = isEditing ? pageId : formData.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await setDoc(doc(db, 'blog_posts', targetSlug), { ...formData, slug: targetSlug, updatedAt: serverTimestamp() });
      alert('Success! Blog Post Published to Live Architecture.');
      refreshData();
      window.scrollTo(0, 0);
    } catch (err) { alert('Error: ' + err.message); }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`WARNING: Are you sure you want to permanently delete /blog/${pageId}?`);
    if (!confirmDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'blog_posts', pageId));
      alert(`Blog page /blog/${pageId} deleted successfully.`);
      await refreshData();
      setViewMode('core'); 
    } catch (error) { alert('Error: Could not delete post.'); setIsDeleting(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 h-full">
      <div className="max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="font-black text-2xl uppercase tracking-widest text-purple-400">
            {isEditing ? `Editing Blog: /${pageId}` : 'Strict Article Architecture'}
          </h2>
          {isEditing && (
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest rounded hover:bg-red-500/10 transition-colors disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">1. URL & Meta Architecture</h3>
            <input name="slug" placeholder="URL Slug (e.g., local-seo-guide)" required disabled={isEditing} value={formData.slug} onChange={(e)=>handleChange(e)} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded disabled:opacity-50" />
            <input name="title" placeholder="Meta Title" value={formData.seoMeta.title} onChange={(e)=>handleChange(e, 'seoMeta')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            <textarea name="metaDescription" placeholder="Meta Description" value={formData.seoMeta.metaDescription} onChange={(e)=>handleChange(e, 'seoMeta')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded h-20" />
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">2. Hero Data</h3>
            <input name="title" placeholder="H1 Headline" required value={formData.hero.title} onChange={(e)=>handleChange(e, 'hero')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white font-bold rounded" />
            <textarea name="description" placeholder="Hero Subtext / Hook" required value={formData.hero.description} onChange={(e)=>handleChange(e, 'hero')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded h-20" />
            <div className="grid grid-cols-2 gap-4">
               <input name="publishDate" type="date" value={formData.hero.publishDate} onChange={(e)=>handleChange(e, 'hero')} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
               <input name="readTime" placeholder="Read Time (e.g. 5 Min)" value={formData.hero.readTime} onChange={(e)=>handleChange(e, 'hero')} className="bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">3. AEO Snippet & TLDR</h3>
            <div>
              <RichTextArea 
                label="AEO Quick Answer (40-60 words)" 
                name="quickAnswer" 
                value={formData.quickAnswer} 
                onChange={handleChange} 
                rows={4} 
              />
            </div>
            <div className="pt-4 border-t border-white/10">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">TL;DR Bullets</label>
              {formData.tldr.map((pt, i) => (
                <input key={i} value={pt} onChange={(e)=>updateSimpleArray('tldr', i, e.target.value)} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded mb-2" placeholder={`Bullet ${i+1}`} />
              ))}
              <button type="button" onClick={()=>addSimpleArrayItem('tldr')} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">+ Add Bullet</button>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">4. Introduction</h3>
            {formData.intro.map((para, i) => (
              <RichTextArea 
                key={i} 
                value={para} 
                onChange={(e)=>updateSimpleArray('intro', i, e.target.value)} 
                rows={3} 
                placeholder={`Paragraph ${i+1}`} 
              />
            ))}
            <button type="button" onClick={()=>addSimpleArrayItem('intro')} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">+ Add Paragraph</button>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
               <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">5. Core Content Sections (H2s)</h3>
               <button type="button" onClick={()=>addComplexArrayItem('sections', { id: `sec-${formData.sections.length+1}`, heading: '', contentType: 'default', content: [''], list: [], subheadings: [] })} className="text-[10px] bg-white/10 px-2 py-1 rounded text-white uppercase tracking-widest font-bold hover:bg-white/20">+ Add H2 Section</button>
            </div>
            
            {formData.sections.map((sec, i) => (
              <div key={i} className="p-5 bg-[#111] border border-white/10 rounded-xl shadow-lg space-y-4">
                <div className="flex gap-2">
                  <input placeholder="ID (e.g. what-is-seo)" value={sec.id} onChange={(e)=>updateComplexArray('sections', i, 'id', e.target.value)} className="w-1/4 bg-transparent border-b border-white/10 p-2 text-sm focus:border-blue-500 outline-none text-gray-400" />
                  <input placeholder="H2 Heading" value={sec.heading} onChange={(e)=>updateComplexArray('sections', i, 'heading', e.target.value)} className="w-3/4 bg-transparent border-b border-blue-500/50 p-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                </div>
                
                <select value={sec.contentType} onChange={(e)=>updateComplexArray('sections', i, 'contentType', e.target.value)} className="bg-black border border-white/10 focus:border-blue-500 outline-none text-white text-xs p-2 rounded">
                  <option value="default">Default Article</option>
                  <option value="howto">How-To (Numbered Steps)</option>
                  <option value="definition">Definition Block</option>
                </select>

                <div className="space-y-4 border-l-2 border-white/10 pl-4">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Paragraphs</label>
                  {sec.content.map((para, pIdx) => (
                    <RichTextArea 
                      key={pIdx} 
                      value={para} 
                      onChange={(e)=>updateSectionArray(i, 'content', pIdx, e.target.value)} 
                      rows={3} 
                    />
                  ))}
                  <button type="button" onClick={()=> { const n=[...formData.sections]; n[i].content.push(''); setFormData({...formData, sections: n}); }} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">+ Para</button>
                </div>

                <div className="space-y-2 border-l-2 border-white/10 pl-4 mt-4">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">List Items</label>
                  {sec.list.map((li, lIdx) => (
                    <input key={lIdx} value={li} onChange={(e)=>updateSectionArray(i, 'list', lIdx, e.target.value)} className="w-full bg-black/50 border border-white/5 p-3 text-sm focus:border-blue-500 outline-none text-gray-300 rounded" />
                  ))}
                  <button type="button" onClick={()=> { const n=[...formData.sections]; n[i].list.push(''); setFormData({...formData, sections: n}); }} className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">+ List Item</button>
                </div>

                <div className="space-y-6 border-l-2 border-purple-500/30 pl-4 mt-8">
                  <div className="flex justify-between items-center">
                     <label className="text-[10px] uppercase tracking-widest text-purple-400 font-bold">H3 Subheadings</label>
                     <button type="button" onClick={() => addSubheading(i)} className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-bold uppercase tracking-widest">+ Add H3</button>
                  </div>
                  
                  {sec.subheadings && sec.subheadings.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-black/50 p-4 border border-white/5 rounded space-y-4">
                      <input placeholder="H3 Title" value={sub.title} onChange={(e) => updateSubheading(i, sIdx, 'title', e.target.value)} className="w-full bg-transparent border-b border-purple-500/50 p-2 text-sm focus:border-purple-500 outline-none text-white font-bold" />
                      {sub.content.map((subPara, spIdx) => (
                         <RichTextArea 
                           key={spIdx} 
                           value={subPara} 
                           onChange={(e) => updateSubheading(i, sIdx, 'content', e.target.value, spIdx)} 
                           rows={3} 
                         />
                      ))}
                      <button type="button" onClick={() => addSubheadingContent(i, sIdx)} className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">+ H3 Para</button>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">6. Embedded Tool CTA</h3>
            <input name="title" placeholder="Tool Title" value={formData.toolBlock.title} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white font-bold rounded" />
            <input name="description" placeholder="Tool Description" value={formData.toolBlock.description} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
            <div className="grid grid-cols-2 gap-4">
              <input name="ctaText" placeholder="Button Text" value={formData.toolBlock.ctaText} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-white rounded" />
              <input name="ctaLink" placeholder="Button URL" value={formData.toolBlock.ctaLink} onChange={(e)=>handleChange(e, 'toolBlock')} className="w-full bg-[#111] border border-white/10 p-3 text-sm focus:border-blue-500 outline-none text-[#3b82f6] rounded" />
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-lg space-y-4">
            <h3 className="text-blue-400 uppercase text-[10px] font-bold tracking-widest">7. FAQ Section (Generates JSON-LD)</h3>
            {formData.faqs.map((faq, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 border border-white/5 bg-[#111] rounded">
                <input placeholder="Question" value={faq.question} onChange={(e)=>updateComplexArray('faqs', i, 'question', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-sm focus:border-blue-500 outline-none text-white font-bold" />
                <RichTextArea 
                  value={faq.answer} 
                  onChange={(e)=>updateComplexArray('faqs', i, 'answer', e.target.value)} 
                  rows={3} 
                />
              </div>
            ))}
            <button type="button" onClick={()=>addComplexArrayItem('faqs', {question: '', answer: ''})} className="text-[10px] text-blue-400 uppercase tracking-widest font-bold hover:text-blue-300">+ Add FAQ</button>
          </div>

          <div className="p-6 bg-[#111] rounded-lg border border-white/10 space-y-6">
              <button type="submit" disabled={isSubmitting || isDeleting} className="w-full bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded font-black uppercase tracking-widest text-sm shadow-lg transition-colors">
                {isSubmitting ? 'Transmitting...' : (isEditing ? 'Update Live Blog Post' : 'Publish Blog Post')}
              </button>
          </div>

        </form>
      </div>
    </div>
  );
}