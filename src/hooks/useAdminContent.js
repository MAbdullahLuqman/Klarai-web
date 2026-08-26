"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { INITIAL_DATA } from "@/lib/adminConfig";
import { mergeServicePageContent } from "@/lib/service-page-content";

const AUTH_MESSAGES = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-not-found": "No Firebase Auth user exists for this email.",
  "auth/wrong-password": "Wrong password for this admin email.",
  "auth/invalid-email": "Enter a valid admin email address.",
  "auth/too-many-requests": "Too many failed attempts. Wait a few minutes or reset the password.",
  "auth/operation-not-allowed": "Email/password login is disabled in Firebase Authentication.",
  "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication settings.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "Firebase API key is invalid or missing.",
};

async function getCollectionMap(collectionName) {
  const query = await getDocs(collection(db, collectionName));
  const docs = {};
  query.forEach((snapshot) => {
    docs[snapshot.id] = snapshot.data();
  });
  return docs;
}

const fieldFromObject = (item = {}, titleKeys = ["title", "name", "heading"], descKeys = ["desc", "description", "text"]) => {
  const title = titleKeys.map((key) => item[key]).find(Boolean) || "";
  const desc = descKeys.map((key) => item[key]).find(Boolean) || "";
  return [title, desc];
};

const delimitedText = (value, delimiter, titleKeys, descKeys) => (
  Array.isArray(value)
    ? value.map((item) => fieldFromObject(item, titleKeys, descKeys).filter(Boolean).join(delimiter)).join("\n")
    : value
);

function normalizeServiceImport(page = {}) {
  return {
    ...page,
    included: page.included ? {
      ...page.included,
      items: delimitedText(page.included.items, ": ", ["title", "name", "heading"], ["desc", "description", "text"]),
    } : page.included,
    process: page.process ? {
      ...page.process,
      steps: delimitedText(page.process.steps, ": ", ["title", "name", "heading"], ["desc", "description", "text"]),
    } : page.process,
    faq: page.faq || page.faqs ? {
      ...(page.faq || {}),
      qas: Array.isArray(page.faq?.qas || page.faqs)
        ? (page.faq?.qas || page.faqs).map((faq) => ({
          question: faq.question || faq.q || faq.title || "",
          answer: faq.answer || faq.a || faq.desc || "",
        }))
        : page.faq?.qas,
    } : page.faq,
  };
}

export function useAdminContent() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [viewMode, setViewMode] = useState("dashboard");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("seo");
  const [content, setContent] = useState(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const [nichePagesList, setNichePagesList] = useState({});
  const [blogPagesList, setBlogPagesList] = useState({});
  const [industryPagesList, setIndustryPagesList] = useState({});
  const [staticPagesList, setStaticPagesList] = useState({});
  const [caseStudiesList, setCaseStudiesList] = useState({});
  const [activeNicheId, setActiveNicheId] = useState(null);
  const [activeBlogId, setActiveBlogId] = useState(null);
  const [activeIndustryId, setActiveIndustryId] = useState(null);
  const [activeStaticPageId, setActiveStaticPageId] = useState(null);

  const fetchAllLiveContent = useCallback(async () => {
    setIsDataLoading(true);
    const liveData = { ...INITIAL_DATA };

    await Promise.all(
      ["aeo", "seo", "web", "technicalAudit", "contentWriting", "whiteLabel", "footer"].map(async (pageId) => {
        try {
          const docSnap = await getDoc(doc(db, "pages", pageId));
          if (docSnap.exists()) {
            liveData[pageId] = mergeServicePageContent(pageId, docSnap.data());
          }
        } catch {}
      })
    );
    setContent(liveData);

    const collectionSetters = [
      ["niche_pages", setNichePagesList],
      ["blog_posts", setBlogPagesList],
      ["industry_pages", setIndustryPagesList],
      ["static_pages", setStaticPagesList],
      ["case_studies", setCaseStudiesList],
    ];

    await Promise.all(
      collectionSetters.map(async ([collectionName, setter]) => {
        try {
          setter(await getCollectionMap(collectionName));
        } catch {
          setter({});
        }
      })
    );

    setIsDataLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser) fetchAllLiveContent();
      else setIsDataLoading(false);
    });
    return () => unsubscribe();
  }, [fetchAllLiveContent]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error("Admin login failed:", error?.code, error?.message);
      setLoginError(AUTH_MESSAGES[error?.code] || `Login failed: ${error?.code || error?.message || "unknown error"}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleNestedChange = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [section]: {
          ...prev[activeTab]?.[section],
          [field]: value,
        },
      },
    }));
  };

  const handleFlatChange = (field, value) => {
    setContent((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
  };

  const handleServiceJsonImport = (payload) => {
    const rawPage = payload?.[activeTab] || payload;
    if (!rawPage || Array.isArray(rawPage) || typeof rawPage !== "object") return;
    const page = normalizeServiceImport(rawPage);
    setContent((prev) => ({
      ...prev,
      [activeTab]: mergeServicePageContent(activeTab, page),
    }));
  };

  const handleSaveToFirebase = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "pages", activeTab), content[activeTab], { merge: true });
      alert(`Success! ${activeTab.toUpperCase()} content synced to Firebase live database.`);
    } catch {
      alert("Failed to save. Check your Firebase connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const allAdminCollections = useMemo(() => ({
    pages: content,
    niche_pages: nichePagesList,
    blog_posts: blogPagesList,
    industry_pages: industryPagesList,
    static_pages: staticPagesList,
    case_studies: caseStudiesList,
  }), [blogPagesList, caseStudiesList, content, industryPagesList, nichePagesList, staticPagesList]);

  const adminCounts = useMemo(() => ({
    dashboard: Object.keys(blogPagesList).length + Object.keys(industryPagesList).length + Object.keys(caseStudiesList).length,
    contentLibrary: Object.values(allAdminCollections).reduce((total, docs) => total + Object.keys(docs || {}).length, 0),
    servicesHub: Object.keys(content).filter((key) => key !== "footer").length,
    industriesHub: Object.keys(industryPagesList).length,
    blogGuidesHub: Object.keys(blogPagesList).length,
    blogPosts: Object.keys(blogPagesList).length,
    guides: Object.values(blogPagesList).filter((post) => ["guide", "checklist", "keyword-list"].includes(post.postType)).length,
    industries: Object.keys(industryPagesList).length,
    caseStudies: Object.keys(caseStudiesList).length,
    drafts: [
      ...Object.values(blogPagesList),
      ...Object.values(industryPagesList),
      ...Object.values(staticPagesList),
      ...Object.values(caseStudiesList),
    ].filter((item) => item?.status === "draft").length,
  }), [allAdminCollections, blogPagesList, caseStudiesList, content, industryPagesList, staticPagesList]);

  const handleLibraryEdit = (item) => {
    if (item.collection === "blog_posts") {
      setActiveBlogId(item.id);
      setViewMode("blogEdit");
    } else if (item.collection === "industry_pages") {
      setActiveIndustryId(item.id);
      setViewMode("industryEdit");
    } else if (item.collection === "niche_pages") {
      setActiveNicheId(item.id);
      setViewMode("nicheEdit");
    } else if (item.collection === "static_pages") {
      setActiveStaticPageId(item.id);
      setViewMode("staticEdit");
    } else if (item.collection === "case_studies") {
      setViewMode("caseStudies");
    } else if (item.collection === "pages") {
      setActiveTab(item.id);
      setViewMode("core");
    }
  };

  return {
    user,
    isAuthLoading,
    email,
    setEmail,
    password,
    setPassword,
    loginError,
    isLoggingIn,
    handleLogin,
    handleLogout,
    viewMode,
    setViewMode,
    isDataLoading,
    activeTab,
    setActiveTab,
    content,
    isSaving,
    handleNestedChange,
    handleFlatChange,
    handleServiceJsonImport,
    handleSaveToFirebase,
    nichePagesList,
    blogPagesList,
    industryPagesList,
    staticPagesList,
    activeNicheId,
    activeBlogId,
    setActiveBlogId,
    activeIndustryId,
    setActiveIndustryId,
    activeStaticPageId,
    allAdminCollections,
    adminCounts,
    handleLibraryEdit,
    fetchAllLiveContent,
  };
}
