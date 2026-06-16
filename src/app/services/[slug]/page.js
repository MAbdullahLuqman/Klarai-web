import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import ServiceLayout from "@/components/ServiceLayout";
import { getServiceBySlug } from "@/lib/service-routing";
import { canonical } from "@/lib/seo-config";
import { mergeServicePageContent } from "@/lib/service-page-content";
import { safeGetDoc } from "@/lib/firestore-safe";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Klarai" };

  const docSnap = await safeGetDoc(doc(db, "pages", service.id), `pages/${service.id}`);
  const page = mergeServicePageContent(service.id, docSnap?.data?.() || {});

  return {
    title: page.meta?.title || `${service.label} | Klarai`,
    description: page.meta?.description || page.hero?.sub || "Klarai service architecture.",
    alternates: {
      canonical: canonical(service.path),
    },
  };
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return <ServiceLayout serviceId={service.id} slug={slug} />;
}
