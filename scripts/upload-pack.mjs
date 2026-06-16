import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuSGwTcIXiOF2vO8Xuv5I0CbYvHt5vrA0",
  authDomain: "klarai-database.firebaseapp.com",
  projectId: "klarai-database",
  storageBucket: "klarai-database.firebasestorage.app",
  messagingSenderId: "35670944637",
  appId: "1:35670944637:web:f96c735e3565ca5fd63a14",
};

const email = process.env.KLARAI_ADMIN_EMAIL;
const password = process.env.KLARAI_ADMIN_PASSWORD;
const packPath = process.argv[2];
if (!email || !password || !packPath) {
  console.error("Usage: KLARAI_ADMIN_EMAIL=... KLARAI_ADMIN_PASSWORD=... node scripts/upload-pack.mjs <pack.json>");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

await signInWithEmailAndPassword(auth, email, password);
console.log("Signed in.");

const pack = JSON.parse(readFileSync(packPath, "utf8"));
for (const row of pack) {
  const ref = doc(db, row.collection, row.id);
  await setDoc(ref, { ...row.data, updatedAt: serverTimestamp() }, { merge: true });
  console.log("OK", row.collection, row.id);
}

// Auto-update the slug registry so sitemap stays current
const blogSlugs = pack.filter(r => r.collection === "blog_posts").map(r => r.id);
const industrySlugs = pack.filter(r => r.collection === "industry_pages").map(r => r.id);
const nicheSlugs = pack.filter(r => r.collection === "niche_pages").map(r => r.id);

if (blogSlugs.length || industrySlugs.length || nicheSlugs.length) {
  const registryRef = doc(db, "_meta", "slugs");
  const update = { updatedAt: serverTimestamp() };
  if (blogSlugs.length) update.blogSlugs = arrayUnion(...blogSlugs);
  if (industrySlugs.length) update.industrySlugs = arrayUnion(...industrySlugs);
  if (nicheSlugs.length) update.nicheSlugs = arrayUnion(...nicheSlugs);
  await setDoc(registryRef, update, { merge: true });
  console.log("Registry updated — blog:", blogSlugs, "industry:", industrySlugs, "niche:", nicheSlugs);
}

console.log("Done:", pack.length, "docs.");
process.exit(0);
