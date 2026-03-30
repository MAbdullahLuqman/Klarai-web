import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ServicePageTemplate from "@/components/ServicePageTemplate";

export const revalidate = 0;

export async function generateMetadata() {
  try {
    const docRef = doc(db, "pages", "ads");
    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : null;

    const metaTitle = data?.meta?.title || 'High-ROI Meta Ads Services in the UK | Klarai';
    const metaDesc = data?.meta?.description || 'Expert Meta Ads Management for UK businesses. Scale your revenue predictably on Facebook and Instagram.';

    return {
      title: metaTitle,
      description: metaDesc,
      alternates: { canonical: 'https://www.klarai.uk/meta-ads' },
      robots: 'index, follow',
      openGraph: { title: metaTitle, description: metaDesc, url: 'https://www.klarai.uk/meta-ads', type: 'website' }
    };
  } catch (error) {
    return { title: 'Meta Ads | Klarai', alternates: { canonical: 'https://www.klarai.uk/meta-ads' } };
  }
}

async function getPageData() {
  try {
    const docRef = doc(db, "pages", "ads");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return null;
  }
}

export default async function MetaAdsPage() {
  const data = await getPageData();
  return <ServicePageTemplate data={data} />;
}