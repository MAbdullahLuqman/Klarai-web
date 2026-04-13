import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    const docRef = doc(db, 'niche_pages', slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response('Industry module not found.', { status: 404 });
    }

    const data = docSnap.data();

    let mdContent = `# KlarAI Architecture: ${data.h1 || data.slug}\n\n`;
    mdContent += `## Services & Target Audience\n`;
    mdContent += `- **Core Service:** ${data.service || 'Advanced Digital Architecture'}\n`;
    mdContent += `- **Target Sector:** ${data.niche || 'UK Businesses'}\n\n`;

    if (data.tldr) {
      mdContent += `## Executive Summary\n${data.tldr}\n\n`;
    }

    if (data.statCards && data.statCards.length > 0) {
      mdContent += `## Verified Statistics & Metrics\n`;
      data.statCards.forEach(stat => {
        if(stat.number) mdContent += `- **${stat.number}** ${stat.label} (Source: ${stat.source})\n`;
      });
      mdContent += `\n`;
    }

    if (data.h2Sections && data.h2Sections.length > 0) {
      mdContent += `## Core Concepts & Queries\n`;
      data.h2Sections.forEach(sec => {
        if(sec.question) {
          mdContent += `### ${sec.question}\n**Answer:** ${sec.directAnswer}\n\n*Context:* ${sec.expansion}\n\n`;
        }
      });
    }

    if (data.deliverables && data.deliverables.length > 0) {
      mdContent += `## Technical Deliverables\n`;
      data.deliverables.forEach(del => {
        if(del.action) mdContent += `- **${del.action}** → ${del.outcome}\n`;
      });
      mdContent += `\n`;
    }

    if (data.caseStudy && data.caseStudy.location) {
      mdContent += `## Case Study: ${data.caseStudy.location}\n`;
      mdContent += `- **Timeframe:** ${data.caseStudy.time}\n`;
      mdContent += `- **Core Metric:** ${data.caseStudy.before} ➡️ ${data.caseStudy.after}\n`;
      mdContent += `- **Keywords on Page 1:** ${data.caseStudy.kwBefore} ➡️ ${data.caseStudy.kwAfter}\n\n`;
    }

    if (data.faqs && data.faqs.length > 0) {
      mdContent += `## Frequently Asked Questions\n`;
      data.faqs.forEach(faq => {
        if(faq.q) mdContent += `**Q: ${faq.q}**\nA: ${faq.a}\n\n`;
      });
    }

    return new Response(mdContent.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'Link': `<https://klarai.com/niche/${slug}>; rel="canonical"` // Points human authority back to the specific niche page
      },
    });

  } catch (error) {
    console.error("Error generating niche llms.txt:", error);
    return new Response('Error compiling knowledge base.', { status: 500 });
  }
}