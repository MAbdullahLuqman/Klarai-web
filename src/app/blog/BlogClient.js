"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export default function BlogClient({ initialPosts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories from the posts dynamically
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    initialPosts.forEach(post => {
      if (post.serviceTag && post.serviceTag !== 'general') cats.add(post.serviceTag.toUpperCase());
    });
    return Array.from(cats);
  }, [initialPosts]);

  // Live Filtering Logic
  const filteredPosts = useMemo(() => {
    return initialPosts.filter(post => {
      // 1. Filter by Category
      const postCategory = post.serviceTag ? post.serviceTag.toUpperCase() : '';
      const matchesCategory = selectedCategory === 'All' || postCategory === selectedCategory;

      // 2. Filter by Search Query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (post.hero?.title || '').toLowerCase().includes(searchLower) ||
        (post.hero?.description || '').toLowerCase().includes(searchLower) ||
        postCategory.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  // Separate the first post as the "Featured" post, the rest go to the grid
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <main className="bg-[#fafafa] min-h-screen font-sans selection:bg-[#ccff00] selection:text-[#0A101D]">
      
      {/* 1. BRUTALIST EDITORIAL HEADER (Dark Mode) */}
      <section className="bg-[#141414] text-white pt-[140px] md:pt-[180px] pb-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8 gap-6">
            <h1 className="text-[12vw] md:text-[7rem] lg:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] text-white">
              DIGITAL <br/> ARCHITECTURE
            </h1>
            <div className="md:text-right pb-2 shrink-0">
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed">
                Intelligence / Strategy <br/> Engineering & AEO.
              </p>
              <div className="flex gap-3 justify-start md:justify-end mt-4 text-[#ccff00]">
                {/* Decorative Tech Icons */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M4 7v10c0 2 1.5 3 3.5 3S11 19 11 17V7c0-2 1.5-3 3.5-3S18 5 18 7v10"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE FEATURED POST (Horizontal Editorial Layout) */}
      <section className="bg-[#141414] px-6 pb-20">
        <div className="max-w-[1200px] mx-auto">
          {featuredPost ? (
            <Link href={`/blog/${featuredPost.slug}`} className="group flex flex-col md:flex-row bg-[#e8e8e8] rounded-[1.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(204,255,0,0.1)] transition-all duration-500 border border-transparent hover:border-[#ccff00]/30">
              
              {/* Left Side: Content */}
              <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col justify-center relative bg-[#f4f4f4]">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span>{featuredPost.hero?.publishDate}</span>
                  <span className="text-[#008dd8]">•</span>
                  <span>{featuredPost.hero?.readTime} read</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-[#0A101D] leading-tight mb-4 tracking-tight group-hover:text-[#008dd8] transition-colors">
                  {featuredPost.hero?.title}
                </h2>
                
                <p className="text-gray-600 font-medium text-sm leading-relaxed mb-8 line-clamp-3">
                  {featuredPost.hero?.description}
                </p>
                
                <div className="flex gap-2 mt-auto">
                  {featuredPost.serviceTag && featuredPost.serviceTag !== 'general' && (
                    <span className="bg-[#0A101D] text-white text-[9px] px-4 py-2 rounded-full uppercase tracking-widest font-black shadow-md">
                      {featuredPost.serviceTag}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Massive Image */}
              <div className="w-full md:w-7/12 h-[300px] md:h-auto bg-[#0A101D] relative overflow-hidden">
                {featuredPost.displayImage ? (
                  // Uses a slight grayscale filter that turns to full color on hover for that vintage editorial feel
                  <img src={featuredPost.displayImage} alt={featuredPost.hero?.title} className="absolute inset-0 w-full h-full object-cover object-center grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                )}
              </div>

            </Link>
          ) : (
            <div className="text-gray-500 text-center py-10 font-mono text-sm uppercase tracking-widest">No matching intelligence found.</div>
          )}
        </div>
      </section>

      {/* 3. FUNCTIONAL SEARCH & FILTER BAR */}
      <section className="pt-16 pb-8 px-6 border-b border-gray-200 sticky top-0 bg-[#fafafa]/90 backdrop-blur-xl z-40">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Live Category Filters */}
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#0A101D] text-white shadow-md' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-[#0A101D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <input 
              type="text" 
              placeholder="Search architecture..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 px-5 py-3 rounded-full text-xs font-bold text-[#0A101D] outline-none focus:border-[#008dd8] focus:ring-2 focus:ring-[#008dd8]/10 transition-all shadow-sm placeholder-gray-400"
            />
            <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

        </div>
      </section>

      {/* 4. THE REMAINING GRID */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:border-[#008dd8]/30 hover:shadow-[0_20px_40px_rgba(0,141,216,0.06)] transition-all duration-500">
                
                <div className="w-full h-[220px] bg-[#141414] relative overflow-hidden">
                    {post.displayImage ? (
                      <img src={post.displayImage} alt={post.hero?.title} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 opacity-[0.15] group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    )}
                    
                    {post.serviceTag && post.serviceTag !== 'general' && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                          <span className="bg-black/60 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            {post.serviceTag.toUpperCase()}
                          </span>
                      </div>
                    )}
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-4">
                      <span>{post.hero?.publishDate}</span>
                      <span className="text-gray-300">•</span>
                      <span>{post.hero?.readTime} read</span>
                    </div>

                    <h2 className="text-xl font-black tracking-tight text-[#0A101D] mb-3 group-hover:text-[#008dd8] transition-colors leading-snug">
                      {post.hero?.title}
                    </h2>
                    
                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">
                      {post.hero?.description}
                    </p>
                    
                    <div className="mt-auto pt-5 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A101D] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {post.authorInfo?.name?.charAt(0) || 'K'}
                      </div>
                      <span className="text-sm font-bold text-[#0A101D]">
                        {post.authorInfo?.name || 'KlarAI Team'}
                      </span>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}