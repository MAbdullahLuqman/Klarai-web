"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalHeader from '@/components/GlobalHeader';

const CATEGORIES = ["All", "SEO", "AEO", "Web Design", "Meta Ads", "Strategy"];

export default function BlogHubPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'blog_posts'), orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedPosts = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug || doc.id,
            title: data.hero?.title || 'System Architecture Report',
            excerpt: data.hero?.description || data.seoMeta?.metaDescription || 'Explore this technical digital architecture system.',
            date: data.hero?.publishDate || new Date().toLocaleDateString(),
            readTime: data.hero?.readTime || '5 Min',
            author: data.authorInfo?.name || 'Klarai Architect',
            category: deriveCategory(data.hero?.title || data.slug || '')
          };
        });

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const deriveCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('seo') || lower.includes('search')) return 'SEO';
    if (lower.includes('aeo') || lower.includes('answer engine') || lower.includes('ai')) return 'AEO';
    if (lower.includes('web') || lower.includes('design') || lower.includes('development')) return 'Web Design';
    if (lower.includes('ads') || lower.includes('meta') || lower.includes('facebook')) return 'Meta Ads';
    return 'Strategy';
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-[#0A101D] min-h-screen pb-32">
      <GlobalHeader />

      {/* 1. PREMIUM WHITESPACE HERO */}
      <section className="pt-[200px] pb-16 px-6 max-w-[1200px] mx-auto border-b border-gray-200/60">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <span className="text-[#008dd8] font-black tracking-[0.2em] uppercase text-xs mb-6 block">
              Intelligence Hub
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-[6rem] leading-[0.95] font-black tracking-tighter text-[#0A101D] uppercase">
              The <br /> Architecture
            </h1>
          </div>
          <div className="max-w-md pb-2">
            <p className="text-md md:text-xl text-gray-500 font-medium leading-relaxed">
              Strict, data-driven frameworks, technical guides, and sector-specific strategies to dominate search engines and scale revenue.
            </p>
          </div>
        </div>
      </section>

      {/* 2. MINIMALIST SEARCH & FILTER */}
      <section className="sticky top-20 z-30 bg-[#fafafa]/90 backdrop-blur-xl border-b border-gray-200/60 py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Swipeable Clean Pills */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0 -mb-2 md:mb-0">
            <div className="flex gap-2 w-max">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
                    activeCategory === cat 
                    ? 'bg-[#0A101D] text-white shadow-[0_4px_15px_rgba(10,16,29,0.2)] scale-105' 
                    : 'bg-transparent text-gray-400 hover:text-[#0A101D] hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal Search Input */}
          <div className="relative w-full md:w-80 group">
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#008dd8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Search frameworks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-200 py-2 pl-8 pr-4 text-sm font-bold text-gray-900 focus:border-[#008dd8] focus:outline-none transition-colors rounded-none"
            />
          </div>

        </div>
      </section>

      {/* 3. ELEGANT GRID WITH MASSIVE WHITESPACE */}
      <main className="max-w-[1200px] mx-auto px-6 pt-20">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-6">
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-[2rem]"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-10 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-40">
            <h3 className="text-4xl font-black text-gray-300 mb-4 uppercase tracking-tighter">No Intel Found.</h3>
            <button onClick={() => {setSearchQuery(""); setActiveCategory("All");}} className="text-[#008dd8] font-bold text-sm uppercase tracking-widest hover:text-[#0A101D] transition-colors border-b-2 border-[#008dd8] hover:border-[#0A101D] pb-1">Clear Filters</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            <AnimatePresence>
              {filteredPosts.map((post, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  key={post.id}
                  className={`group flex flex-col ${i === 0 ? 'lg:col-span-3 md:col-span-2 lg:flex-row gap-12 lg:gap-20 items-center mb-10' : 'gap-8'}`}
                >
                  
                  {/* Ultra-Clean Image Placeholder */}
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className={`block relative overflow-hidden bg-gray-100 rounded-[2.5rem] shrink-0 transform transition-transform duration-700 group-hover:scale-[1.02] ${
                      i === 0 ? 'w-full lg:w-[55%] aspect-[16/10] lg:aspect-[4/3]' : 'w-full aspect-[4/3]'
                    }`}
                  >
                    {/* Subtle grid pattern for "Architecture" feel instead of heavy colors */}
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
                    
                    <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md text-[#0A101D] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {post.category}
                    </div>
                  </Link>

                  {/* Minimalist Text Content */}
                  <div className={`flex flex-col flex-1 ${i === 0 ? 'py-6' : ''}`}>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-5">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[#008dd8]">{post.readTime} Read</span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`} className="block mb-6">
                      <h2 className={`font-black tracking-tighter text-[#0A101D] group-hover:text-[#008dd8] transition-colors leading-[1.1] ${i === 0 ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl'}`}>
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className={`text-gray-500 font-medium leading-relaxed ${i === 0 ? 'text-lg md:text-xl mb-10' : 'mb-8 line-clamp-3'}`}>
                      {post.excerpt}
                    </p>

                    <div className={`mt-auto flex items-center justify-between pt-6 border-t border-gray-200/60 ${i === 0 ? 'w-full max-w-md' : ''}`}>
                      <div className="flex items-center gap-3 text-xs font-bold text-[#0A101D]">
                        <div className="w-8 h-8 bg-[#0A101D] text-white rounded-full flex items-center justify-center shadow-md">
                          {post.author.charAt(0)}
                        </div>
                        {post.author}
                      </div>
                      
                      <Link href={`/blog/${post.slug}`} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#008dd8] group-hover:bg-[#008dd8] group-hover:text-white transition-all duration-300">
                        <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </Link>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

    </div>
  );
}