"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const INITIAL_DATA = {
  aeo: { title: "Answer Engine Optimisation (AEO)", subtitle: "Dominate AI search engines like ChatGPT, Gemini, and Claude.", body: "Traditional SEO is no longer enough. We optimize your brand to be the definitive answer provided by Next-Gen AI engines.", meta: "Klarai AEO Services - Rank in AI Search" },
  seo: { title: "Search Engine Optimisation Services That Rank UK Businesses Faster", subtitle: "Stop guessing. We are a premier seo optimisation agency providing comprehensive search engine optimisation service to dominate Google rankings.", body: "Search Engine Optimisation is the mathematical alignment of your digital architecture with Google's core algorithms. It ensures that when your customers search for your services, your business appears first.", meta: "Expert SEO and search engine optimisation for UK businesses. On-page audits, off-page backlinks, affordable packages. Transparent and results-focused." },
  web: { title: "Web Design & Development for UK Businesses — Fast, SEO-Ready Websites", subtitle: "Searching for web designing near me? We build high-converting, web design seo architectures.", body: "", meta: "Klarai builds clean, conversion-focused websites for UK businesses. SEO-optimised from day one — fast loading, mobile-friendly, designed to rank on Google." },
  ads: { title: "Meta Ads Management — Facebook & Instagram Advertising That Converts", subtitle: "We handle your meta ads manager and facebook meta advertising to scale your revenue predictably.", body: "", meta: "Klarai runs high-ROI Meta Ads campaigns on Facebook and Instagram. Ad creative, Meta Ads Manager setup, and full campaign management for UK businesses." },
  smma: { title: "Social Media Marketing Agency for UK & European Brands — Grow Organically", subtitle: "As top tier social marketing agencies, we handle digital marketing social media marketing strategies that actually convert followers to clients.", body: "", meta: "Klarai manages your social media on Instagram, LinkedIn, and TikTok. Strategy, content creation, and community management for UK and European brands." },
  footer: { trademark: `© ${new Date().getFullYear()} KLARAI™ All Rights Reserved.`, privacyText: "Privacy Policy", termsText: "Terms & Conditions" }
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("seo");
  const [content, setContent] = useState(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) fetchLiveContent();
    });
    return () => unsubscribe();
  }, []);

  const fetchLiveContent = async () => {
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
    } catch (error) {
      console.error("Error fetching live data:", error);
    } finally {
      setIsDataLoading(false);
    }
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

  const handleInputChange = (field, value) => {
    setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
  };

  const handleSaveToFirebase = async () => {
    setIsSaving(true);
    try {
      const dataToSave = content[activeTab];
      const docRef = doc(db, "pages", activeTab);
      await setDoc(docRef, dataToSave, { merge: true });
      alert(`Success! ${activeTab.toUpperCase()} content synced to Firebase live database.`);
    } catch (error) {
      alert("Failed to save. Check your Firebase connection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading) return <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">Authenticating...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 font-sans selection:bg-[#185FA5] selection:text-white">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="flex justify-center mb-8">
            <img src="/klarailogo.webp" alt="KLARAI Logo" className="h-8 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-2 tracking-wide">Admin Portal</h1>
          <p className="text-xs text-gray-400 text-center mb-8 uppercase tracking-widest">Restricted Access Only</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Admin Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all" required />
            </div>
            {loginError && <p className="text-xs text-red-500 text-center font-bold">{loginError}</p>}
            <button type="submit" className="w-full bg-[#185FA5] hover:bg-[#144d85] text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(24,95,165,0.4)] mt-4">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  if (isDataLoading) return <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">Loading Secure Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-200 flex font-sans selection:bg-[#3b82f6] selection:text-white">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <span className="text-xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">KLARAI <span className="text-[#3b82f6]">ADMIN</span></span>
        </div>
        
        <div className="p-4 flex-1">
          <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4 px-4">Pages Overview</p>
          <nav className="flex flex-col gap-2">
            {[
              { id: "seo", name: "SEO Services" },
              { id: "aeo", name: "AEO Services" },
              { id: "web", name: "Web Development" },
              { id: "ads", name: "Meta Ads" },
              { id: "smma", name: "Social Media" },
              { id: "footer", name: "Global Footer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === tab.id ? "bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Sign Out
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className="h-20 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
          <div><h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">Editing: <span className="text-[#fcd34d] bg-[#fcd34d]/10 px-3 py-1 rounded-md text-sm border border-[#fcd34d]/20 uppercase">{activeTab}</span></h2></div>
          <button onClick={handleSaveToFirebase} disabled={isSaving} className="bg-[#185FA5] hover:bg-[#144d85] text-white font-bold px-6 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(24,95,165,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
            {isSaving ? "Pushing to Live..." : "Save to Firebase"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                
                {/* Regular Pages Settings */}
                {activeTab !== "footer" ? (
                  <>
                    <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">SEO & Meta Data</h3>
                        <div>
                            <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Meta Description (For Google)</label>
                            <textarea rows="2" value={content[activeTab]?.meta || ""} onChange={(e) => handleInputChange('meta', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all resize-none" />
                        </div>
                    </section>

                    <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                        <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Page Content</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Main H1 Title</label>
                                <input type="text" value={content[activeTab]?.title || ""} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Hero Subtitle</label>
                                <textarea rows="3" value={content[activeTab]?.subtitle || ""} onChange={(e) => handleInputChange('subtitle', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#3b82f6] transition-all resize-none" />
                            </div>
                            {(activeTab === "seo" || activeTab === "aeo") && (
                              <div>
                                  <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Main Body Paragraph</label>
                                  <textarea rows="4" value={content[activeTab]?.body || ""} onChange={(e) => handleInputChange('body', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#3b82f6] transition-all resize-none" />
                              </div>
                            )}
                        </div>
                    </section>
                  </>
                ) : (
                  /* Footer Specific Settings */
                  <section className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-xl">
                      <h3 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6">Global Footer Settings</h3>
                      <div className="space-y-5">
                          <div>
                              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Trademark Text</label>
                              <input type="text" value={content[activeTab]?.trademark || ""} onChange={(e) => handleInputChange('trademark', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all" />
                          </div>
                          <div>
                              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Privacy Policy Link Text</label>
                              <input type="text" value={content[activeTab]?.privacyText || ""} onChange={(e) => handleInputChange('privacyText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all" />
                          </div>
                          <div>
                              <label className="block text-xs text-gray-500 font-bold uppercase mb-2">Terms & Conditions Link Text</label>
                              <input type="text" value={content[activeTab]?.termsText || ""} onChange={(e) => handleInputChange('termsText', e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3b82f6] transition-all" />
                          </div>
                      </div>
                  </section>
                )}

            </div>
        </div>
      </main>
    </div>
  );
}