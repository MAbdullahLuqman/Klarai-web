import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader';

export const metadata = {
  title: 'Intelligence & Architecture Insights | Klarai',
  description: 'Advanced strategies for Answer Engine Optimization, Search Dominance, and High-Converting Digital Ecosystems.',
};

async function getBlogPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'blog_posts'));
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by publish date (newest first)
    return posts.sort((a, b) => {
      const dateA = new Date(a.hero?.publishDate || 0);
      const dateB = new Date(b.hero?.publishDate || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// HELPER: Auto-extract the first image found anywhere in the blog content
const extractFirstImage = (post) => {
  // 1. Check if explicit cover image is set
  if (post.hero?.coverImage && post.hero.coverImage.trim() !== '') {
    return post.hero.coverImage;
  }

  const imgRegex = /<img[^>]+src="([^">]+)"/i;

  // 2. Scan Intro Paragraphs
  if (post.intro) {
    for (const para of post.intro) {
      if (!para) continue;
      const match = para.match(imgRegex);
      if (match) return match[1]; // Returns the URL inside the src=""
    }
  }

  // 3. Scan Main Sections & Subheadings
  if (post.sections) {
    for (const sec of post.sections) {
      if (sec.content) {
        for (const para of sec.content) {
          if (!para) continue;
          const match = para.match(imgRegex);
          if (match) return match[1];
        }
      }
      if (sec.subheadings) {
        for (const sub of sec.subheadings) {
          if (sub.content) {
            for (const para of sub.content) {
              if (!para) continue;
              const match = para.match(imgRegex);
              if (match) return match[1];
            }
          }
        }
      }
    }
  }

  // 4. Return null if no images exist anywhere in the blog
  return null;
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-[#fafafa] text-gray-900 font-sans selection:bg-[#ccff00] selection:text-[#0A101D] min-h-screen">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="pt-[160px] pb-16 px-6 relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#008dd8]/[0.03] blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 text-center flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-black tracking-[0.25em] uppercase shadow-sm">
            KlarAI Intelligence
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#0A101D] uppercase leading-[0.95] mb-6">
            Digital <br/> <span className="text-[#008dd8]">Architecture.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-xl">
            Strategies, insights, and technical breakdowns on how to build systems that dominate algorithms and print predictable revenue.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          
          {posts.length === 0 ? (
            <div className="text-center text-gray-400 font-medium py-20">
               No intelligence reports deployed yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                
                // Format Tags
                const tags = [];
                if (post.serviceTag && post.serviceTag !== 'general') tags.push(post.serviceTag.toUpperCase());
                if (post.industryTag && post.industryTag !== 'none') tags.push(post.industryTag.charAt(0).toUpperCase() + post.industryTag.slice(1));
                
                // Run the auto-extractor
                const displayImage = extractFirstImage(post);

                return (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white rounded-[2rem] border border-gray-200 overflow-hidden hover:border-[#008dd8]/50 hover:shadow-[0_20px_40px_rgba(0,141,216,0.08)] transition-all duration-500">
                    
                    {/* Cover Image Area */}
                    <div className="w-full h-[240px] bg-[#0A101D] relative overflow-hidden">
                       {displayImage ? (
                         <img src={displayImage} alt={post.hero?.title || 'Blog post cover'} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                       ) : (
                         /* Premium Geometric Fallback if absolutely no image is found */
                         <div className="absolute inset-0 opacity-[0.15] group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D]/80 to-transparent"></div>
                       
                       {/* Floating Badges */}
                       {tags.length > 0 && (
                         <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
                           {tags.map((tag, i) => (
                             <span key={i} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                               {tag}
                             </span>
                           ))}
                         </div>
                       )}
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-1 justify-between">
                       <div>
                         <h2 className="text-2xl font-black tracking-tight text-[#0A101D] mb-3 group-hover:text-[#008dd8] transition-colors leading-tight">
                           {post.hero?.title}
                         </h2>
                         <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6">
                           {post.hero?.description}
                         </p>
                       </div>
                       
                       <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                           {post.hero?.publishDate}
                         </div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-[#008dd8]">
                           {post.hero?.readTime} Read
                         </div>
                       </div>
                    </div>

                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}