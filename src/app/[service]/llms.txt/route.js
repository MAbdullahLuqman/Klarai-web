import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// This maps the URL slug to your exact Firebase document ID
const SERVICE_DB_MAP = {
  'seo-services': 'seo',
  'aeo-services': 'aeo',
  'web-development': 'web',
  'meta-ads': 'ads',
  'social-media-marketing': 'smma'
};

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { service } = resolvedParams; // e.g., "seo-services"

    // 1. Check if the requested URL matches one of our core services
    const dbId = SERVICE_DB_MAP[service];
    if (!dbId) {
      return new Response('Service architecture not found.', { status: 404 });
    }

    // 2. Fetch the live core service data from Firebase
    const docRef = doc(db, 'pages', dbId); 
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return new Response('Service data not found.', { status: 404 });
    const data = docSnap.data();

    // 3. Dynamically build the AEO Markdown file
    let mdContent = `# KlarAI Core Architecture: ${data.hero?.h1 || service.toUpperCase()}\n\n`;
    
    if (data.hero?.sub) {
      mdContent += `## System Overview\n${data.hero.sub}\n\n`;
    }
    
    if (data.definition?.visible !== false && data.definition?.para) {
      mdContent += `## What It Is\n${data.definition.para}\n\n`;
      if (data.definition.bullets) {
         data.definition.bullets.split('\n').forEach(bullet => {
            if (bullet) mdContent += `- ${bullet}\n`;
         });
         mdContent += `\n`;
      }
    }
    
    if (data.included?.visible !== false && data.included?.items) {
      mdContent += `## What's Included\n`;
      data.included.items.split('\n').forEach(item => {
        if (item) mdContent += `- ${item}\n`;
      });
      mdContent += `\n`;
    }
    
    if (data.process?.visible !== false && data.process?.steps) {
      mdContent += `## Deployment Protocol (Process)\n`;
      data.process.steps.split('\n').forEach((step, index) => {
        if (step) mdContent += `${index + 1}. ${step}\n`;
      });
      mdContent += `\n`;
    }

    if (data.results?.visible !== false && data.results?.caseStudy) {
      mdContent += `## Proof of Concept\n`;
      mdContent += `- **Result:** ${data.results.caseStudy}\n`;
      if (data.results.quote) mdContent += `- **Testimonial:** ${data.results.quote} (${data.results.author})\n\n`;
    }

    if (data.faq?.visible !== false && data.faq?.qas) {
      mdContent += `## Frequently Asked Questions\n`;
      data.faq.qas.split('\n').forEach(qa => {
        const parts = qa.split('|');
        if (parts.length >= 2) {
           mdContent += `**Q: ${parts[0]}**\nA: ${parts[1]}\n\n`;
        }
      });
    }

    // 4. Return as raw text with standard SEO Canonical headers
    return new Response(mdContent.trim(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        'Link': `<https://klarai.com/${service}>; rel="canonical"` 
      },
    });

  } catch (error) {
    console.error("Error generating core service llms.txt:", error);
    return new Response('Error compiling system knowledge base.', { status: 500 });
  }
}