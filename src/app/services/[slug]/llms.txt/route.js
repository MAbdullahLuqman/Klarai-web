import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { getServiceBySlug } from "@/lib/service-routing";
import { canonical } from "@/lib/seo-config";
import { mergeServicePageContent, servicePageContent } from "@/lib/service-page-content";
import { safeGetDoc } from "@/lib/firestore-safe";

export const dynamic = "force-dynamic";

const hardcodedServiceIds = new Set(["aeo", "seo", "web"]);

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) {
      return new Response("Service architecture not found.", { status: 404 });
    }

    const data = hardcodedServiceIds.has(service.id)
      ? servicePageContent[service.id]
      : mergeServicePageContent(service.id, (await safeGetDoc(doc(db, "pages", service.id), `pages/${service.id} llms`))?.data?.() || {});
    if (!data.hero?.h1) return new Response("Service data not found.", { status: 404 });

    let mdContent = `# Klarai Core Architecture: ${data.hero?.h1 || service.label}\n\n`;

    if (data.hero?.sub) mdContent += `## System Overview\n${data.hero.sub}\n\n`;

    if (data.tldr?.visible !== false && data.tldr?.text) {
      mdContent += `## ${data.tldr.h2 || "TL;DR"}\n${data.tldr.text}\n\n`;
    }

    if (data.problem?.visible !== false && data.problem?.paras?.length > 0) {
      mdContent += `## ${data.problem.h2 || "Problem and Solution"}\n${data.problem.paras.join("\n\n")}\n\n`;
    }

    if (data.definition?.visible !== false && data.definition?.para) {
      mdContent += `## What It Is\n${data.definition.para}\n\n`;
      if (data.definition.bullets) {
        data.definition.bullets.split("\n").forEach((bullet) => {
          if (bullet) mdContent += `- ${bullet}\n`;
        });
        mdContent += "\n";
      }
    }

    if (data.included?.visible !== false && data.included?.items) {
      mdContent += `## ${data.included.h2 || "What's Included"}\n`;
      data.included.items.split("\n").forEach((item) => {
        if (item) mdContent += `- ${item}\n`;
      });
      mdContent += "\n";
    }

    if (data.audience?.visible !== false && data.audience?.text) {
      mdContent += `## ${data.audience.h2 || "Who This Is For"}\n${data.audience.text}\n\n`;
    }

    if (data.process?.visible !== false && data.process?.steps) {
      mdContent += "## Deployment Protocol\n";
      data.process.steps.split("\n").forEach((step, index) => {
        if (step) mdContent += `${index + 1}. ${step}\n`;
      });
      mdContent += "\n";
    }

    if (data.results?.visible !== false && data.results?.caseStudy) {
      mdContent += "## Proof of Concept\n";
      mdContent += `- **Result:** ${data.results.caseStudy}\n`;
      if (data.results.quote) mdContent += `- **Testimonial:** ${data.results.quote} (${data.results.author})\n\n`;
    }

    if (data.results?.visible !== false && data.results?.text) {
      mdContent += `## ${data.results.h2 || "Proof"}\n${data.results.text}\n`;
      if (data.results.note) mdContent += `${data.results.note}\n`;
      mdContent += "\n";
    }

    if (data.engagement?.visible !== false && data.engagement?.text) {
      mdContent += `## ${data.engagement.h2 || "Engagement Models"}\n${data.engagement.text}\n\n`;
    }

    if (data.faq?.visible !== false && data.faq?.qas) {
      mdContent += "## Frequently Asked Questions\n";
      data.faq.qas.split("\n").forEach((qa) => {
        const parts = qa.split("|");
        if (parts.length >= 2) mdContent += `**Q: ${parts[0]}**\nA: ${parts[1]}\n\n`;
      });
    }

    return new Response(mdContent.trim(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        Link: `<${canonical(`/services/${slug}`)}>; rel="canonical"`,
      },
    });
  } catch (error) {
    console.error("Error generating service llms.txt:", error);
    return new Response("Error compiling system knowledge base.", { status: 500 });
  }
}
