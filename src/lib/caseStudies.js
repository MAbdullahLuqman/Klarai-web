import { doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { safeGetDoc } from "@/lib/firestore-safe";

export async function hydrateCaseStudyRefs(refs = []) {
  const list = Array.isArray(refs) ? refs : [];
  const studies = await Promise.all(
    list.map(async (ref) => {
      if (!ref) return null;
      if (ref.title && (ref.slug || ref.id)) return ref;
      const id = ref.id || ref.slug;
      if (!id) return null;
      const snap = await safeGetDoc(doc(db, "case_studies", id), `case_studies/${id}`);
      if (!snap?.exists?.()) return null;
      return { id: snap.id, ...snap.data() };
    })
  );
  return studies.filter((study) => study && study.status !== "archived");
}
