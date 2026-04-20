import React from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import GlobalHeader from '@/components/GlobalHeader';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Intelligence & Architecture Insights | Klarai',
  description: 'Advanced strategies for Answer Engine Optimization, Search Dominance, and High-Converting Digital Ecosystems.',
};

export const dynamic = 'force-dynamic';

const extractFirstImage = (post) => {
  if (post.hero?.coverImage && post.hero.coverImage.trim() !== '') return post.hero.coverImage;
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  
  if (post.intro) {
    for (const para of post.intro) {
      if (!para) continue;
      const match = para.match(imgRegex);
      if (match) return match[1]; 
    }
  }
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
  return null;
};

async function getBlogPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'blog_posts'));
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const displayImage = extractFirstImage(data);
      
      // CRITICAL FIX: Sanitize Firebase objects before passing to Client Component
      let sanitizedData = { ...data };
      
      // Convert Firebase Timestamps to plain ISO Strings
      if (sanitizedData.updatedAt && typeof sanitizedData.updatedAt.toDate === 'function') {
        sanitizedData.updatedAt = sanitizedData.updatedAt.toDate().toISOString();
      }
      if (sanitizedData.createdAt && typeof sanitizedData.createdAt.toDate === 'function') {
        sanitizedData.createdAt = sanitizedData.createdAt.toDate().toISOString();
      }

      posts.push({ id: doc.id, ...sanitizedData, displayImage });
    });
    
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

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <GlobalHeader />
      <BlogClient initialPosts={posts} />
    </>
  );
}