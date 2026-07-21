"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function BlogClient({ initialPosts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(["All"]);
    initialPosts.forEach((post) => {
      if (post.serviceTag && post.serviceTag !== "general") cats.add(post.serviceTag.toUpperCase());
    });
    return Array.from(cats);
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const postCategory = post.serviceTag ? post.serviceTag.toUpperCase() : "";
      const matchesCategory = selectedCategory === "All" || postCategory === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        (post.hero?.title || "").toLowerCase().includes(searchLower) ||
        (post.hero?.description || "").toLowerCase().includes(searchLower) ||
        postCategory.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0] || null;
  const gridPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2f3438]">
      <section className="px-5 pb-16 pt-32 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.24em] text-black/36">
              Insights
            </p>
            <h1 className="font-serif text-5xl font-medium leading-[0.96] tracking-tight sm:text-7xl lg:text-8xl">
              Search architecture, explained clearly.
            </h1>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-black/58 lg:justify-self-end">
            Practical notes on SEO, AEO, web architecture, and the systems that help businesses become easier to find and trust.
          </p>
        </div>
      </section>

      {featuredPost && (
        <section className="px-5 pb-14 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1480px]">
            <Link href={`/blog/${featuredPost.slug || featuredPost.id}`} className={`group grid overflow-hidden rounded-[1.25rem] border border-black/8 bg-white shadow-[0_28px_90px_rgba(0,0,0,0.06)] ${featuredPost.displayImage ? "md:grid-cols-[0.44fr_0.56fr]" : ""}`}>
              <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
                <div className="mb-6 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-black/36">
                  <span>{featuredPost.hero?.publishDate}</span>
                  <span>{featuredPost.hero?.readTime} read</span>
                </div>
                <h2 className="text-3xl font-black leading-tight tracking-tight transition group-hover:text-[#ad5b2b] sm:text-4xl md:text-5xl">
                  {featuredPost.hero?.title}
                </h2>
                <p className="mt-5 text-base font-medium leading-relaxed text-black/56 line-clamp-3">
                  {featuredPost.hero?.description}
                </p>
                {featuredPost.serviceTag && featuredPost.serviceTag !== "general" && (
                  <span className="mt-8 w-fit rounded-full bg-[#2f3438] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                    {featuredPost.serviceTag}
                  </span>
                )}
              </div>
              {featuredPost.displayImage && (
                <div className="relative min-h-[340px] bg-[#151b1e]">
                  <img src={featuredPost.displayImage} alt={featuredPost.hero?.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_52%,rgba(0,0,0,0.32)_100%)]" />
                </div>
              )}
            </Link>
          </div>
        </section>
      )}

      <section className="sticky top-0 z-30 border-y border-black/8 bg-[#f4efe4]/88 px-5 py-5 backdrop-blur-xl sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition ${
                  selectedCategory === cat
                    ? "bg-[#2f3438] text-white"
                    : "border border-black/10 bg-white text-black/46 hover:border-[#ad5b2b] hover:text-[#ad5b2b]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search insights"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#2f3438] outline-none transition placeholder:text-black/28 focus:border-[#ad5b2b] md:w-80"
          />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1480px] gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="group flex flex-col overflow-hidden rounded-[1.1rem] border border-black/8 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:border-[#ad5b2b]/45">
              {post.displayImage && (
                <div className="relative h-56 bg-[#151b1e]">
                  <img src={post.displayImage} alt={post.hero?.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-7">
                <div className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-black/34">
                  <span>{post.hero?.publishDate}</span>
                  <span>{post.hero?.readTime} read</span>
                </div>
                <h2 className="text-2xl font-black leading-tight tracking-tight transition group-hover:text-[#ad5b2b]">
                  {post.hero?.title}
                </h2>
                <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-black/54 line-clamp-3">
                  {post.hero?.description}
                </p>
                <div className="mt-8 border-t border-black/8 pt-5 text-sm font-black text-[#9b542a]">
                  Read insight
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
