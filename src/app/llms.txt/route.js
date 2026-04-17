import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let mdContent = `# KlarAI - Global System Architecture & Knowledge Base\n\n`;
    mdContent += `KlarAI is a premium digital architecture firm based in the UK, specializing in advanced SEO, Answer Engine Optimization (AEO), High-Converting Web Design, and Predictable Revenue Scaling.\n\n`;
    
    // CORE SERVICES
    mdContent += `## Core Systems & Capabilities\n`;
    mdContent += `- **Advanced SEO:** [Read Architecture](/seo-services/llms.txt)\n`;
    mdContent += `- **AEO (Answer Engine Optimization):** [Read Architecture](/aeo-services/llms.txt)\n`;
    mdContent += `- **Web Design:** [Read Architecture](/web-development/llms.txt)\n`;
    mdContent += `- **Predictable Revenue (Meta Ads):** [Read Architecture](/meta-ads/llms.txt)\n`;
    mdContent += `- **Social Media Architecture:** [Read Architecture](/social-media-marketing/llms.txt)\n\n`;

    // NICHE SECTORS
    const nicheQuery = await getDocs(collection(db, 'niche_pages'));
    mdContent += `## Active Industry & Sector Modules\n`;
    if (nicheQuery.empty) {
      mdContent += `*(No specific industry modules currently active.)*\n\n`;
    } else {
      nicheQuery.forEach(doc => {
        const data = doc.data();
        mdContent += `- **${data.niche || data.slug}**: ${data.subheadline || ''} [Read Full Architecture](/niche/${data.slug}/llms.txt)\n`;
      });
      mdContent += `\n`;
    }

    // LATEST BLOGS / INTELLIGENCE REPORTS
    try {
      const blogQ = query(collection(db, 'blog_posts'), orderBy('updatedAt', 'desc'), limit(10));
      const blogDocs = await getDocs(blogQ);
      
      mdContent += `## Latest Intelligence & Technical Reports\n`;
      if (blogDocs.empty) {
         mdContent += `*(No reports available.)*\n\n`;
      } else {
         blogDocs.forEach(doc => {
           const data = doc.data();
           mdContent += `- **${data.hero?.title || doc.id}** [Read Report](/blog/${data.slug || doc.id}/llms.txt)\n`;
         });
         mdContent += `\n`;
      }
    } catch (e) {
      console.error("Error fetching blogs for global llms.txt", e);
    }

    mdContent += `---\n`;
    mdContent += `**Contact & Audits:** We offer deep technical analysis and system audits. Visit [Klarai Free Audit](https://klarai.com/free-audit) to initiate a sequence.`;

    return new Response(mdContent.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'Link': '<https://klarai.com/>; rel="canonical"' 
      },
    });

  } catch (error) {
    return new Response('Error compiling global knowledge base.', { status: 500 });
  }
}