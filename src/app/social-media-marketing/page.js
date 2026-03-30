import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const revalidate = 0;

export async function generateMetadata() {
  try {
    const docRef = doc(db, "pages", "smma");
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;

    const metaTitle = data?.meta?.title || 'Organic Social Media Marketing in the UK | Klarai';
    const metaDesc = data?.meta?.description || 'Expert Social Media Marketing for UK businesses. Grow organically on Instagram, LinkedIn, and TikTok.';

    return {
      title: metaTitle,
      description: metaDesc,
      alternates: { canonical: 'https://www.klarai.uk/social-media-marketing' },
      robots: 'index, follow',
      openGraph: { title: metaTitle, description: metaDesc, url: 'https://www.klarai.uk/social-media-marketing', type: 'website' }
    };
  } catch (error) {
    return { title: 'Social Media Marketing | Klarai', alternates: { canonical: 'https://www.klarai.uk/social-media-marketing' } };
  }
}

async function getPageData() {
  try {
    const docRef = doc(db, "pages", "smma");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return null;
  }
}

export default async function SocialMediaPage() {
  const data = await getPageData();
  return <ServicePageTemplate data={data} />;
}