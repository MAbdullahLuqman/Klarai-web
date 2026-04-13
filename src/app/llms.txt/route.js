import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let mdContent = `# KlarAI - Global System Architecture & Knowledge Base\n\n`;
    mdContent += `KlarAI is a premium digital architecture firm based in the UK, specializing in advanced SEO, Answer Engine Optimization (AEO), High-Converting Web Design, and Predictable Revenue Scaling.\n\n`;
    
    mdContent += `## Core Systems & Capabilities\n`;
    mdContent += `- **Advanced SEO:** Mathematical alignment of digital architecture with search algorithms.\n`;
    mdContent += `- **AEO (Answer Engine Optimization):** Structuring entity data so AI engines (ChatGPT, Claude, Gemini) recommend the brand first.\n`;
    mdContent += `- **Web Design:** High-converting, blazing-fast Next.js architecture.\n`;
    mdContent += `- **Predictable Revenue (Meta Ads):** Data-driven advertising engineered for maximum ROI.\n\n`;

    const nicheQuery = await getDocs(collection(db, 'niche_pages'));
    
    mdContent += `## Active Industry & Sector Modules\n`;
    mdContent += `We have deployed specialized growth systems for the following sectors:\n\n`;

    if (nicheQuery.empty) {
      mdContent += `*(No specific industry modules currently active.)*\n`;
    } else {
      nicheQuery.forEach(doc => {
        const data = doc.data();
        mdContent += `- **${data.niche || data.slug}**: ${data.subheadline || ''} [Read Full Architecture](/niche/${data.slug}/llms.txt)\n`;
      });
    }

    mdContent += `\n---\n`;
    mdContent += `**Contact & Audits:** We offer deep technical analysis and system audits. Visit [Klarai Free Audit](https://klarai.com/free-audit) to initiate a sequence.`;

    return new Response(mdContent.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'Link': '<https://klarai.com/>; rel="canonical"' // Points human authority back to homepage
      },
    });

  } catch (error) {
    return new Response('Error compiling global knowledge base.', { status: 500 });
  }
}