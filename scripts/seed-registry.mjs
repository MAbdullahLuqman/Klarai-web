import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
if (!email || !password) {
  console.error("Usage: KLARAI_ADMIN_EMAIL=... KLARAI_ADMIN_PASSWORD=... node scripts/seed-registry.mjs");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await signInWithEmailAndPassword(auth, email, password);

await setDoc(doc(db, "_meta", "slugs"), {
  blogSlugs: [
    "seo-for-plumbers",
    "seo-for-garages-uk",
    "what-is-answer-engine-optimisation",
    "plumbing-seo-keywords",
    "plumbing-keywords-list",
    "best-keywords-for-car-garages",
    "how-many-keywords-plumber-website",
    "emergency-plumber-seo",
    "how-to-do-seo-for-dentists",
    "how-to-do-seo-for-accountants",
  ],
  industrySlugs: [
    "seo-for-plumbers",
    "seo-for-garages",
    "aeo-for-local-business",
    "seo-for-dentists",
    "seo-for-accountants",
  ],
  nicheSlugs: [],
  updatedAt: serverTimestamp(),
});

console.log("Registry seeded.");
process.exit(0);
