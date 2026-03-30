import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const revalidate = 0;

export async function generateMetadata() {
  try {
    const docRef = doc(db, "pages", "aeo");
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;

    const metaTitle = data?.meta?.title || 'Answer Engine Optimisation (AEO) in the UK | Klarai';
    const metaDesc = data?.meta?.description || 'Expert AEO services for UK businesses. Dominate AI search engines like ChatGPT and Gemini. Book a free audit today.';

    return {
      title: metaTitle,
      description: metaDesc,
      alternates: { canonical: 'https://www.klarai.uk/aeo-services' },
      robots: 'index, follow',
      openGraph: { title: metaTitle, description: metaDesc, url: 'https://www.klarai.uk/aeo-services', type: 'website' }
    };
  } catch (error) {
    return { title: 'AEO Services | Klarai', alternates: { canonical: 'https://www.klarai.uk/aeo-services' } };
  }
}

async function getPageData() {
  try {
    const docRef = doc(db, "pages", "aeo");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return null;
  }
}

export default async function AeoServicesPage() {
  const data = await getPageData();
  return <ServicePageTemplate data={data} />;
}