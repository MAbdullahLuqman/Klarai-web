import { getDoc, getDocs } from "firebase/firestore";

export async function safeGetDoc(ref, label = "document") {
  try {
    return await getDoc(ref);
  } catch (error) {
    console.warn(`Firestore read skipped for ${label}:`, error?.code || error?.message || error);
    return null;
  }
}

export async function safeGetDocs(ref, label = "query") {
  try {
    return await getDocs(ref);
  } catch (error) {
    console.warn(`Firestore query skipped for ${label}:`, error?.code || error?.message || error);
    return null;
  }
}

