"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SiteHero from "@/components/SiteHero";

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

  return <div className="site-page">
    <SiteHero eyebrow="Insights" description="Practical notes on SEO, AI answers, and building websites that people can find and use.">Useful ideas.<br /><em>Clearly explained.</em></SiteHero>
    <section className="home-container site-blog-filters" aria-label="Filter insights"><div className="flex flex-wrap gap-2">{categories.map(cat => <button key={cat} onClick={() => setSelectedCategory(cat)} aria-pressed={selectedCategory === cat} className={`home-button ${selectedCategory === cat ? "home-button-solid" : ""}`}>{cat}</button>)}</div><label><span className="sr-only">Search insights</span><input type="search" placeholder="Search insights" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} /></label></section>
    <section className="home-container site-work-grid" aria-live="polite">{filteredPosts.length === 0 && <p className="text-lg py-10">{initialPosts.length ? "No insights match your search. Try another term or category." : "New insights are on their way. Explore our services in the meantime."}</p>}{filteredPosts.map(post => <article key={post.id} className="site-work-card">
      {post.displayImage && <Link href={`/blog/${post.slug || post.id}`} className="site-work-image"><img src={post.displayImage} alt={post.hero?.title || "Article preview"} loading="lazy" className="h-full w-full object-cover" /></Link>}
      <div className="site-work-body"><span className="site-number">{[post.hero?.publishDate, post.hero?.readTime].filter(Boolean).join(" · ")}</span><h2><Link href={`/blog/${post.slug || post.id}`}>{post.hero?.title}</Link></h2><p>{post.hero?.description}</p><div className="home-actions"><Link href={`/blog/${post.slug || post.id}`} className="home-button">Read insight ↗</Link></div></div>
    </article>)}</section>
  </div>;
}
