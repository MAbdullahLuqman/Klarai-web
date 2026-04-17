import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ServiceLayout from '@/components/ServiceLayout';

export async function generateMetadata() {
  const docSnap = await getDoc(doc(db, 'pages', 'aeo'));
  return { title: docSnap.data()?.meta?.title || 'Klarai', description: docSnap.data()?.meta?.description };
}
export default function Page() { return <ServiceLayout serviceId="aeo" />; }