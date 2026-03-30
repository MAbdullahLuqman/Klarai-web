import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const revalidate = 0;

export async function generateMetadata() {
  try {
    const docRef = doc(db, "pages", "web");
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;

    const metaTitle = data?.meta?.title || 'High-Converting Web Design in the UK | Klarai';
    const metaDesc = data?.meta?.description || 'Expert Web Design & Development services for UK businesses. Fast, SEO-ready, and built to convert.';

    return {
      title: metaTitle,
      description: metaDesc,
      alternates: { canonical: 'https://www.klarai.uk/web-development' },
      robots: 'index, follow',
      openGraph: { title: metaTitle, description: metaDesc, url: 'https://www.klarai.uk/web-development', type: 'website' }
    };
  } catch (error) {
    return { title: 'Web Development | Klarai', alternates: { canonical: 'https://www.klarai.uk/web-development' } };
  }
}

async function getPageData() {
  try {
    const docRef = doc(db, "pages", "web");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return null;
  }
}

export default async function WebDevelopmentPage() {
  const data = await getPageData();
  return <ServicePageTemplate data={data} />;
}