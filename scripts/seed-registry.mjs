import { config } from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
