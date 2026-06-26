import { arrayUnion, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const registryFieldByCollection = {
  blog_posts: "blogSlugs",
  industry_pages: "industrySlugs",
  niche_pages: "nicheSlugs",
  case_studies: "caseStudySlugs",
};

export async function addSlugToRegistry(collection, slug) {
  const field = registryFieldByCollection[collection];
  if (!field || !slug) return;
  await setDoc(doc(db, "_meta", "slugs"), {
    [field]: arrayUnion(slug),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
