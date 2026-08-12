import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { canonical, removedNicheSlugs } from '@/lib/seo-config';
import { safeGetDocs } from '@/lib/firestore-safe';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let mdContent = `# Klarai - Global System Architecture & Knowledge Base\n\n`;
    mdContent += `Klarai is a premium digital architecture firm based in the UK, specializing in advanced SEO, Answer Engine Optimization (AEO), High-Converting Web Design, and Predictable Revenue Scaling.\n\n`;
    
    // CORE SERVICES
    mdContent += `## Core Systems & Capabilities\n`;
    mdContent += `- **Advanced SEO:** [Read Architecture](/services/seo-services/llms.txt)\n`;
    mdContent += `- **AEO (Answer Engine Optimization):** [Read Architecture](/services/aeo-services/llms.txt)\n`;
    mdContent += `- **Web Design:** [Read Architecture](/services/web-development/llms.txt)\n`;
    mdContent += `\n`;

    // NICHE SECTORS
    const nicheQuery = await safeGetDocs(collection(db, 'niche_pages'), 'niche_pages llms');
    mdContent += `## Active Industry & Sector Modules\n`;
    if (!nicheQuery || nicheQuery.empty) {
      mdContent += `*(No specific industry modules currently active.)*\n\n`;
    } else {
      nicheQuery.forEach(doc => {
        const data = doc.data();
        if (removedNicheSlugs.has(data.slug || doc.id)) return;
        mdContent += `- **${data.niche || data.slug}**: ${data.subheadline || ''} [Read Full Architecture](/niche/${data.slug}/llms.txt)\n`;
      });
      mdContent += `\n`;
    }

    // LATEST BLOGS / INTELLIGENCE REPORTS
    try {
      const blogQ = query(collection(db, 'blog_posts'), orderBy('updatedAt', 'desc'), limit(10));
      const blogDocs = await safeGetDocs(blogQ, 'blog_posts llms');
      
      mdContent += `## Latest Intelligence & Technical Reports\n`;
      if (!blogDocs || blogDocs.empty) {
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
    mdContent += `**Contact & Audits:** We offer deep technical analysis and system audits. Visit [Klarai Free Audit](${canonical('/seoauditor')}) to initiate a sequence.`;

    return new Response(mdContent.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'Link': `<${canonical('/')}>; rel="canonical"` 
      },
    });

  } catch (error) {
    return new Response('Error compiling global knowledge base.', { status: 500 });
  }
}
