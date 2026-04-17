import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    // Fetch the specific blog post from Firebase
    const docRef = doc(db, 'blog_posts', slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response('Intelligence report not found.', { status: 404 });
    }

    const data = docSnap.data();

    // 1. Build the Header & Metadata
    let mdContent = `# KlarAI Intelligence Report: ${data.hero?.title || data.seoMeta?.title || slug}\n\n`;
    
    if (data.hero?.description) {
      mdContent += `> ${data.hero.description}\n\n`;
    }

    mdContent += `**Author:** ${data.authorInfo?.name || 'KlarAI Architect'} | **Published:** ${data.hero?.publishDate || 'N/A'} | **Read Time:** ${data.hero?.readTime || 'N/A'}\n\n`;

    // 2. AEO Quick Answer (Highly prioritized by AI)
    if (data.quickAnswer) {
      mdContent += `## Executive Answer Engine Snippet\n${data.quickAnswer}\n\n`;
    }

    // 3. TL;DR Summary
    if (data.tldr && data.tldr.length > 0 && data.tldr[0] !== '') {
      mdContent += `## Core Takeaways (TL;DR)\n`;
      data.tldr.forEach(item => {
        if (item) mdContent += `- ${item}\n`;
      });
      mdContent += `\n`;
    }

    // 4. Introduction
    if (data.intro && data.intro.length > 0 && data.intro[0] !== '') {
      mdContent += `## Introduction\n`;
      data.intro.forEach(para => {
        if (para) mdContent += `${para}\n\n`;
      });
    }

    // 5. Dynamic Content Sections (H2 & H3)
    if (data.sections && data.sections.length > 0) {
      data.sections.forEach(sec => {
        if (!sec.heading) return;
        mdContent += `## ${sec.heading}\n\n`;

        // Definition Type formatting
        if (sec.contentType === 'definition' && sec.content[0]) {
           mdContent += `**Definition:** ${sec.content[0]}\n\n`;
           sec.content.slice(1).forEach(para => { if (para) mdContent += `${para}\n\n`; });
        } else if (sec.content && sec.content.length > 0) {
           // Standard Paragraphs
           sec.content.forEach(para => { if (para) mdContent += `${para}\n\n`; });
        }

        // Lists (Handles standard bullets vs numbered How-To steps)
        if (sec.list && sec.list.length > 0 && sec.list[0] !== '') {
          sec.list.forEach((item, index) => {
            if (item) {
              if (sec.contentType === 'howto') {
                mdContent += `${index + 1}. ${item}\n`;
              } else {
                mdContent += `- ${item}\n`;
              }
            }
          });
          mdContent += `\n`;
        }

        // Subheadings (H3s)
        if (sec.subheadings && sec.subheadings.length > 0) {
          sec.subheadings.forEach(sub => {
            if (!sub.title) return;
            mdContent += `### ${sub.title}\n\n`;
            if (sub.content && sub.content.length > 0) {
              sub.content.forEach(para => {
                if (para) mdContent += `${para}\n\n`;
              });
            }
          });
        }
      });
    }

    // 6. Frequently Asked Questions
    if (data.faqs && data.faqs.length > 0 && data.faqs[0].question) {
      mdContent += `## Frequently Asked Questions\n\n`;
      data.faqs.forEach(faq => {
        if (faq.question && faq.answer) {
          mdContent += `**Q: ${faq.question}**\nA: ${faq.answer}\n\n`;
        }
      });
    }

    // 7. Embedded CTA / Recommended Action
    if (data.toolBlock && data.toolBlock.title) {
      mdContent += `## Recommended System Action: ${data.toolBlock.title}\n`;
      mdContent += `${data.toolBlock.description}\n`;
      mdContent += `Initiate Sequence here: https://klarai.com${data.toolBlock.ctaLink || '/free-audit'}\n\n`;
    }

    // Return the response configured exactly for AI consumption with Canonical human-link
    return new Response(mdContent.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'Link': `<https://klarai.com/blog/${slug}>; rel="canonical"` 
      },
    });

  } catch (error) {
    console.error("Error generating blog llms.txt:", error);
    return new Response('Error compiling intelligence report.', { status: 500 });
  }
}