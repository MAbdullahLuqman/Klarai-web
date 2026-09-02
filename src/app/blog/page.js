import React from 'react';
import { db } from '@/lib/firebase';
import { collection } from 'firebase/firestore';
import BlogClient from './BlogClient';
import { canonical } from '@/lib/seo-config';
import { stripHtml } from '@/lib/html';
import { safeGetDocs } from '@/lib/firestore-safe';

export const metadata = {
  title: 'Intelligence & Architecture Insights | Klarai',
  description: 'Advanced strategies for Answer Engine Optimization, Search Dominance, and High-Converting Digital Ecosystems.',
  alternates: {
    canonical: canonical('/blog'),
  },
  openGraph: {
    url: canonical('/blog'),
  },
};

export const dynamic = 'force-dynamic';

const extractBlogCoverImage = (post) => {
  if (post.hero?.coverImage && post.hero.coverImage.trim() !== '') return post.hero.coverImage;
  return null;
};

async function getBlogPosts() {
  try {
    const querySnapshot = await safeGetDocs(collection(db, 'blog_posts'), 'blog_posts index');
    if (!querySnapshot) return [];
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const displayImage = extractBlogCoverImage(data);
      
      // CRITICAL FIX: Sanitize Firebase objects before passing to Client Component
      let sanitizedData = { ...data };
      
      // Convert Firebase Timestamps to plain ISO Strings
      if (sanitizedData.updatedAt && typeof sanitizedData.updatedAt.toDate === 'function') {
        sanitizedData.updatedAt = sanitizedData.updatedAt.toDate().toISOString();
      }
      if (sanitizedData.createdAt && typeof sanitizedData.createdAt.toDate === 'function') {
        sanitizedData.createdAt = sanitizedData.createdAt.toDate().toISOString();
      }

      sanitizedData.hero = {
        ...sanitizedData.hero,
        title: stripHtml(sanitizedData.hero?.title),
        description: stripHtml(sanitizedData.hero?.description),
      };
      sanitizedData.seoMeta = {
        ...sanitizedData.seoMeta,
        title: stripHtml(sanitizedData.seoMeta?.title),
        metaDescription: stripHtml(sanitizedData.seoMeta?.metaDescription),
      };

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
    <BlogClient initialPosts={posts} />
  );
}
