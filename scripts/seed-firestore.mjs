#!/usr/bin/env node
/**
 * Seeds Firestore with Week 1 content:
 *  - 3 new industry hub pages (collection: industry_pages)
 *  - 4 new blog posts (collection: blog_posts)
 *
 * Usage:
 *   1. Put NEXT_PUBLIC_FIREBASE_* in .env.local (already present for the app).
 *   2. export KLARAI_ADMIN_EMAIL=... KLARAI_ADMIN_PASSWORD=...
 *      (a Firebase Auth user with write access per your Firestore rules)
 *   3. node scripts/seed-firestore.mjs
 *
 * Re-runnable: uses setDoc with merge:true so it upserts.
 */
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const email = process.env.KLARAI_ADMIN_EMAIL;
const password = process.env.KLARAI_ADMIN_PASSWORD;
if (isMain && (!email || !password)) {
  console.error("Missing KLARAI_ADMIN_EMAIL / KLARAI_ADMIN_PASSWORD env vars.");
  process.exit(1);
}

// ============================================================
// INDUSTRY HUB PAGES
// ============================================================

const industries = {
  "seo-for-plumbers": {
    slug: "seo-for-plumbers",
    meta: {
      title: "SEO for Plumbers UK: Get More Plumbing Leads | Klarai",
      description:
        "SEO for plumbers that brings real jobs, not vanity rankings. Local SEO, Google Business Profile and the plumbing keywords that drive calls. Free audit, no lock in.",
    },
    hero: {
      h1: "SEO for Plumbers UK",
      sub:
        "Get found by local customers the moment their pipe bursts. We build the local SEO, Google Business Profile and service pages that turn searches into booked jobs, not just visits.",
      cta: "Get my free plumbing SEO audit",
      ctaHref: "/seoauditor",
    },
    tldr: {
      text:
        "SEO for plumbers means getting your business found on Google and in the local Map Pack when someone nearby searches for a plumber. The fastest results come from a fully built Google Business Profile, a separate page for each service and area, and the high intent keywords that lead to calls. Klarai fixes your foundations first, then targets the terms you are closest to ranking for. Start with a free audit to see your quickest wins.",
    },
    sections: [
      {
        h2: "Why plumbers lose jobs they should be winning",
        paras: [
          "When a pipe bursts or a boiler dies, nobody scrolls for ten minutes. They search \"emergency plumber near me\" on their phone and call whoever appears first. If that is not you, it is the plumber down the road. Most plumbing websites are built like brochures and never appear in those urgent searches, so they sit invisible while competitors take the calls.",
          "The other problem is structure. Many plumbers have a single page that lists every service at once, which gives Google nothing specific to rank. A search for \"boiler repair Manchester\" needs a page about boiler repair in Manchester, not a general homepage.",
        ],
      },
      {
        h2: "How we get plumbers found",
        paras: [
          "Klarai fixes the foundations that decide whether you appear in local searches, then targets the exact terms your future customers type when they are ready to book. We start with the fastest wins, the searches you are already close to ranking for, so you see more enquiries early rather than waiting months.",
        ],
      },
      {
        h2: "What plumber SEO actually includes",
        sub: [
          { h3: "Local SEO and your Google Business Profile", text: "For most plumbers, your Google Business Profile matters more than your homepage, because the Map Pack often appears above the normal results on mobile. We fully build and optimise your profile, choose the right categories, and keep it active so Google trusts it." },
          { h3: "Service and location pages that rank", text: "We give each core service and each area you cover its own focused page, so Google can match you to specific searches like \"blocked drain Leeds\" or \"emergency plumber Bristol\"." },
          { h3: "The plumbing keywords that bring calls", text: "We target high intent searches that lead to bookings, not vague terms nobody buys from. The difference between \"plumber\" and \"emergency plumber near me\" is the difference between a browser and a customer with their card ready." },
          { h3: "Reviews and local citations", text: "We help you build consistent listings across trusted UK directories and a steady flow of reviews, both of which strengthen your local rankings and your credibility with cautious customers." },
        ],
      },
      {
        h2: "How fast can a plumber expect results",
        paras: [
          "Honestly, it depends on your starting point and your area. Terms you already sit just off page one for can move within a few weeks. More competitive local searches usually take two to three months as your profile and authority build. We always chase the fastest wins first, so you feel momentum early rather than waiting for everything at once.",
        ],
      },
      {
        h2: "How we work",
        list: [
          "Audit. We review your website, Google Business Profile and local citations, then give you a prioritised list of what to fix.",
          "Fix. We clear the technical blockers and build the service and location pages you are missing.",
          "Target. We optimise for the high intent local keywords you are closest to winning.",
          "Grow. We track rankings and calls, refine, and expand into more competitive terms over time.",
        ],
      },
      {
        h2: "Why Klarai",
        paras: [
          "We are founder led by Abdullah Luqman, who builds the work directly rather than passing it to a junior. We work month to month with no lock in, we prioritise the fastest wins so you see returns early, and we will tell you honestly if SEO is not the right spend for your business yet.",
        ],
      },
    ],
    related: [
      { label: "The Complete Plumbing Keywords List for UK Plumbers", href: "/blog/plumbing-keywords-list" },
      { label: "How Many Keywords Should a Plumber's Website Target", href: "/blog/how-many-keywords-plumber-website" },
      { label: "Emergency Plumber SEO: How to Rank for Urgent Searches", href: "/blog/emergency-plumber-seo" },
      { label: "SEO for Plumbers UK: The Complete 2026 Guide", href: "/blog/seo-for-plumbers" },
      { label: "Top Plumbing Keywords That Bring Real Jobs", href: "/blog/plumbing-seo-keywords" },
      { label: "SEO Services", href: "/services/seo-services" },
    ],
    faqs: [
      { q: "How much does SEO cost for a plumber?", a: "It depends on how competitive your area is and how much needs fixing. Rather than quote a fixed package, we run a free audit first and recommend the lightest engagement that gets you results. We work month to month with no lock in." },
      { q: "How long until I get more plumbing leads?", a: "Searches you already rank near page one for can move within a few weeks. More competitive local terms usually take two to three months. We prioritise the fast wins so you see enquiries sooner." },
      { q: "Is local SEO or Google Ads better for plumbers?", a: "Ads bring instant calls but stop the moment you stop paying. Local SEO takes longer to build but keeps bringing jobs without paying for every click. Most plumbers benefit from SEO as the long term foundation, with ads as an optional top up." },
      { q: "Do I need a new website or just SEO?", a: "Not always a new one. If your current site is fast and can be structured properly, we optimise what you have. If it is slow or cannot support proper service and location pages, a rebuild pays for itself. The audit tells you which." },
      { q: "Which plumbing keywords matter most?", a: "The ones that show someone is ready to book, like \"emergency plumber near me\", \"boiler repair\" and service plus town searches. We map these to your specific area in the audit." },
    ],
    cta: {
      heading: "See exactly why local customers are not finding you",
      sub: "Run our free audit and we will show you your Google Business Profile gaps, your missing pages, and the quickest wins to start getting more calls.",
      primary: "Get my free plumbing SEO audit",
      primaryHref: "/seoauditor",
      secondary: "Talk to us",
      secondaryHref: "/contact",
    },
  },

  "seo-for-garages": {
    slug: "seo-for-garages",
    meta: {
      title: "SEO for Garages and MOT Centres UK | Klarai",
      description:
        "SEO for garages and MOT centres that fills your diary. Rank on Google Maps for MOT, servicing and repair searches. Free audit, no lock in, UK based.",
    },
    hero: {
      h1: "SEO for Garages and MOT Centres UK",
      sub:
        "Be the garage drivers find first when their MOT is due. We rank you on Google Maps for MOT, servicing and repair searches that keep your ramps busy all year.",
      cta: "Get my free garage SEO audit",
      ctaHref: "/seoauditor",
    },
    tldr: {
      text:
        "SEO for garages and MOT centres means appearing at the top of Google and Google Maps when local drivers search for an MOT, a service or a repair. Because these searches are local and high intent, the biggest wins come from a fully optimised Google Business Profile, dedicated service pages, and timing content around MOT demand. Most UK garages have almost no SEO, so the bar to outrank them is low. Start with a free audit.",
    },
    sections: [
      {
        h2: "Why most garages are invisible when drivers search",
        paras: [
          "Picture a driver whose car fails its MOT on a Friday. They have ten days to get it retested or they cannot drive legally. They type \"MOT retest near me\" and call the first garage that shows up. They do not compare prices or read every review. They call whoever appears first. That search happens hundreds of times a day in every town, and in most towns the garages showing up first are not the best ones, just the ones that did the basics of SEO.",
          "The good news is that most garages have done almost nothing, so the bar to outrank your local competitors is genuinely low right now.",
        ],
      },
      {
        h2: "How we get garages found",
        paras: [
          "Klarai gets your garage appearing in the local Map Pack and the searches that drive bookings, from urgent MOT retests to routine servicing. We fix your Google Business Profile, build the service pages drivers and Google both expect, and time your content around the seasonal MOT spikes you can predict in advance.",
        ],
      },
      {
        h2: "What garage and MOT SEO includes",
        sub: [
          { h3: "Google Business Profile and the Map Pack", text: "For garages, your Google Business Profile is often more important than your website in the short term, because the map results appear first on mobile. We build it out properly, pick the right categories, and keep it active so you rank in the local pack." },
          { h3: "MOT, servicing and repair service pages", text: "We create a dedicated, bookable page for each core service, so Google can match you to specific searches like \"car service Birmingham\" or \"brake repair near me\" rather than guessing from one general page." },
          { h3: "Seasonal MOT demand and timing", text: "MOT searches are highly date driven. We help you rank prominently in the weeks before local MOTs are due, and prepare content for the seasonal spikes you can see coming." },
          { h3: "The garage keywords that drive bookings", text: "We target the searches that lead to a booked job, including make and model specialist terms like \"BMW specialist\" or \"VW service\" that capture the premium end of your local market." },
        ],
      },
      {
        h2: "How fast can a garage expect results",
        paras: [
          "Because competition among garages is usually low, results often come faster than in more crowded industries. Terms you are close on can move within weeks, and a well built Google Business Profile can start appearing in the Map Pack quickly. More competitive city centre areas take longer. We focus on the fastest wins first.",
        ],
      },
      {
        h2: "How we work",
        list: [
          "Audit. We review your website, Google Business Profile and local presence, and hand you a prioritised fix list.",
          "Fix. We resolve the technical issues and build the missing service pages.",
          "Target. We optimise for the local MOT, servicing and repair keywords you are closest to winning.",
          "Grow. We track bookings and rankings, refine, and expand into more terms.",
        ],
      },
      {
        h2: "Why Klarai",
        paras: [
          "Founder led by Abdullah Luqman, month to month with no lock in, and focused on the fastest wins so you see bookings early. We build a fast, mobile first site because most garage searches happen on a phone, and a slow site loses the booking before the driver even reads it.",
        ],
      },
    ],
    related: [
      { label: "Best Keywords for Car Garages and MOT Centres UK", href: "/blog/best-keywords-for-car-garages" },
      { label: "SEO for Garages and MOT Centres UK: Complete Guide", href: "/blog/seo-for-garages-uk" },
      { label: "SEO Services", href: "/services/seo-services" },
    ],
    faqs: [
      { q: "How do I get my garage to the top of Google Maps?", a: "Claim and fully build your Google Business Profile, choose the most accurate primary category, add every genuine service, keep it active, and collect steady reviews. Consistent listings across UK directories help too. We handle all of this in a garage SEO engagement." },
      { q: "How much does garage SEO cost?", a: "It depends on your area and what needs fixing. We run a free audit first and recommend the lightest engagement that gets results, month to month with no lock in." },
      { q: "What keywords should an MOT centre target?", a: "High intent local searches like \"MOT near me\", \"MOT retest\", \"MOT plus town\", and service terms like \"car service\" and \"brake repair\". Make and model specialist terms capture the premium segment. We map these to your area in the audit." },
      { q: "When should I prepare for MOT season searches?", a: "MOT demand is date driven and repeats yearly, so the content and profile updates should be in place in the weeks before local MOTs are due. We plan this in advance so you are visible when the searches spike." },
      { q: "Do I need a website or just a Google Business Profile?", a: "In the short term the profile drives most bookings, but a fast website with proper service pages is what lets you rank for the full range of searches and convert the clicks. The strongest results come from both working together." },
    ],
    cta: {
      heading: "See why drivers are booking your competitors instead",
      sub: "Run our free audit and we will show you your Map Pack gaps, your missing service pages, and the quickest wins to fill your diary.",
      primary: "Get my free garage SEO audit",
      primaryHref: "/seoauditor",
      secondary: "Talk to us",
      secondaryHref: "/contact",
    },
  },

  "aeo-for-local-business": {
    slug: "aeo-for-local-business",
    meta: {
      title: "Answer Engine Optimisation for UK Businesses | Klarai",
      description:
        "Answer engine optimisation that gets your business cited by ChatGPT, Gemini and Google AI Overviews. Built for UK local and service businesses. Free AI visibility audit.",
    },
    hero: {
      h1: "Answer Engine Optimisation for UK Businesses",
      sub:
        "Your customers now ask AI before they ask anyone. We structure your content so ChatGPT, Gemini and Google AI Overviews name your business when they answer.",
      cta: "Run my free AI visibility audit",
      ctaHref: "/seoauditor",
    },
    tldr: {
      text:
        "Answer engine optimisation, or AEO, structures your content so AI engines like ChatGPT, Gemini, Perplexity and Google AI Overviews quote your business directly when customers ask a question. It is not a replacement for SEO, it builds on the same foundations. For local and service businesses, it means being the one the AI recommends when someone asks for the best option in your area. Start with a free audit to see how AI describes you today.",
    },
    sections: [
      {
        h2: "Your customers ask AI before they ask Google",
        paras: [
          "Search has changed. Instead of scrolling results, people increasingly ask an AI assistant a direct question and act on the single answer they get. Around a third of UK Google searches already return an AI generated answer, and tools like ChatGPT and Perplexity are now a first stop for many buyers. If the AI names a competitor and never mentions you, you have lost the customer before they reached your website.",
        ],
      },
      {
        h2: "How we make AI recommend you",
        paras: [
          "Klarai restructures your content into the clear, quotable answers these engines prefer, marks it up so they can read it, and builds the authority signals that make them trust you as a source. When an AI assembles a response in your category or your area, it pulls from your business.",
        ],
      },
      {
        h2: "What AEO includes",
        sub: [
          { h3: "Quotable answer blocks", text: "We rewrite your key pages so each important question has a tight, factual answer an engine can lift cleanly. This is the single change most sites are missing." },
          { h3: "Schema and structured data", text: "We add the structured markup that helps engines understand and confidently quote your content." },
          { h3: "Entity and authority signals", text: "We strengthen how you are understood across the web through consistent business information and credible references, not just edits on your own site." },
          { h3: "How AEO builds on your existing SEO", text: "An engine cannot cite a page it cannot find or understand, so we make sure your SEO foundations are solid first, then layer the answer engineering on top." },
        ],
      },
      {
        h2: "AEO vs SEO vs GEO",
        paras: [
          "SEO ranks your pages in traditional results. AEO structures your content so AI engines cite it in their answers. GEO, or generative engine optimisation, is the broader goal of appearing across all generative platforms. In practice they overlap heavily and share the same foundations, so we treat them as one connected discipline rather than three separate products.",
        ],
      },
      {
        h2: "How fast does AEO work",
        paras: [
          "Pages you already rank near the top for can start appearing in AI answers within weeks, because the engines draw on the existing search index. Newer or more competitive topics take longer as your authority and citations build, usually two to three months.",
        ],
      },
      {
        h2: "How we work",
        list: [
          "Audit. We check how AI engines currently describe your brand and where the gaps are.",
          "Structure. We rewrite priority pages into citable answers with schema.",
          "Authorise. We build the entity and authority signals that earn citations.",
          "Track. We monitor your AI citations and refine month on month.",
        ],
      },
    ],
    related: [
      { label: "What is Answer Engine Optimisation", href: "/blog/what-is-answer-engine-optimisation" },
      { label: "Answer Engine Optimisation Services", href: "/services/aeo-services" },
    ],
    faqs: [
      { q: "What is answer engine optimisation?", a: "Answer engine optimisation is the practice of structuring your content so AI answer engines like ChatGPT, Gemini and Google AI Overviews quote your business directly when they answer a relevant question, rather than only ranking you in a list of links." },
      { q: "How is AEO different from SEO?", a: "SEO focuses on ranking your page in traditional search results. AEO focuses on getting your content cited inside AI generated answers. They share foundations, so you need both, because AI answers are built on the same index that powers normal search." },
      { q: "Can a small local business benefit from AEO?", a: "Yes. When someone asks an AI for the best plumber, garage or service in their area, you want to be the business it names. AEO gives local businesses a real chance to be that recommendation." },
      { q: "How do I get cited by ChatGPT or Google AI Overviews?", a: "By giving clear, factual answers to the questions your customers ask, marking them up with the right structure, and building authority signals across the web. That combination is what these engines look for when choosing a source." },
      { q: "Does AEO replace SEO?", a: "No. AEO builds on SEO. Strong search foundations are what make your content eligible to be cited in the first place, so the two work together." },
    ],
    cta: {
      heading: "See how AI describes your business today",
      sub: "Run our free audit and we will show you where you appear in AI answers, where you do not, and what to fix first.",
      primary: "Run my free AI visibility audit",
      primaryHref: "/seoauditor",
      secondary: "Talk to us",
      secondaryHref: "/contact",
    },
  },
};

// ============================================================
// BLOG POSTS
// Schema compatible with src/app/blog/[slug]/page.js usage:
//   { seoMeta:{title,metaDescription}, hero:{title,description,coverImage},
//     intro:[paragraphs], sections:[{h2, content:[paragraphs], subheadings?:[{h3,content:[]}]}],
//     faqs:[{q,a}], cta:{heading,sub,primary,primaryHref,secondary,secondaryHref}, slug }
// ============================================================

const blogs = {
  "plumbing-keywords-list": {
    slug: "plumbing-keywords-list",
    seoMeta: {
      title: "The Complete Plumbing Keywords List for UK Plumbers (2026) | Klarai",
      metaDescription:
        "The plumbing keywords that actually bring jobs, grouped by intent, plus how to turn them into pages that rank. A practical UK plumber keyword list for 2026.",
      primaryKeyword: "plumbing keywords list",
    },
    hero: {
      title: "The Complete Plumbing Keywords List for UK Plumbers (2026)",
      description:
        "The keywords that actually bring jobs, grouped by intent, plus how to turn each group into a page that ranks.",
      coverImage: "",
    },
    author: "Klarai Team",
    publishedDate: new Date().toISOString(),
    intro: [
      "The best plumbing keywords are the ones that show someone is ready to book, not the highest volume terms. Emergency and service plus location searches like \"emergency plumber near me\" and \"boiler repair Leeds\" bring more jobs than broad words like \"plumber\". This list groups the most valuable UK plumbing keywords by intent and shows you how to turn each group into a page that ranks. Prioritise high intent local terms first.",
    ],
    sections: [
      { heading: "How to use this plumbing keywords list", content: ["Volume is a trap. The word \"plumber\" gets searched a lot, but most of those people are not ready to book, and you are competing with everyone. The keywords that actually fill your diary are the specific, high intent ones, often with a service and a location attached. Use this list to pick the terms that match what you offer and where you work, then build a focused page for each important one. Intent beats volume every time."] },
      { heading: "Emergency and high intent plumbing keywords", content: ["These are your most valuable searches because the person needs a plumber now and will call quickly.", "Emergency plumber near me, emergency plumber plus town, 24 hour plumber, burst pipe repair, blocked drain, leaking pipe repair, no hot water, boiler not working"] },
      { heading: "Service based plumbing keywords", content: ["These match people searching for a specific job. Each one deserves its own service page.", "Boiler repair, boiler installation, boiler replacement, bathroom installation, bathroom fitting, drain unblocking, radiator repair, tap repair, toilet repair, water heater repair, underfloor heating installation"] },
      { heading: "Local plumbing keywords", content: ["Local intent is where most plumbers win, because your customers are nearby. Combine a service with your town or area.", "Plumber plus town, plumber near me, local plumber, boiler repair plus town, emergency plumber plus town, bathroom fitter plus town"] },
      { heading: "Long tail and question keywords", content: ["These are lower competition and ideal for blog posts that build authority and feed AI answers.", "How much does it cost to fix a leaking pipe, why is my boiler losing pressure, how to find a reliable plumber, what to do when a pipe bursts, how often should a boiler be serviced"] },
      { heading: "Which plumbing keywords to prioritise first", content: ["Start with the high intent local terms that match services you already offer, because they are closest to becoming booked jobs. Then add service pages for each core job. Save the question based keywords for blog content once your main pages are live. The goal is one focused page per important search, not a single page crammed with keywords."] },
      { heading: "Turning keywords into pages that rank", content: ["A keyword only helps when it has a home. Give each core service its own page, each area you cover its own page, and group the question keywords into helpful blog posts. Link them together, and link them up to your main plumbing service page, so Google sees a connected set of content rather than scattered pages. If you want this mapped out for your specific area, our free audit does exactly that. See our SEO for Plumbers hub for the full strategy."] },
    ],
    faqs: [
      { question: "What are the best keywords for plumbers?", answer: "The best keywords are high intent local searches that show someone is ready to book, such as \"emergency plumber near me\", \"boiler repair plus town\" and specific service terms. They bring more jobs than broad, high volume words like \"plumber\"." },
      { question: "How many keywords should a plumber target?", answer: "There is no single number. The right approach is one focused page for each core service and each area you cover, rather than cramming many keywords onto one page. Most plumbers need a handful of service pages and a few location pages to start. See our deeper guide: How Many Keywords Should a Plumber's Website Target." },
      { question: "What is the most searched plumbing term?", answer: "Broad terms like \"plumber\" and \"plumber near me\" get the most searches, but they are highly competitive and less likely to convert than specific service and emergency searches. Targeting intent rather than raw volume gives better results." },
    ],
    cta: {
      heading: "Want a keyword to page plan for your area",
      sub: "Run a free audit and we will map it for you. See also our full SEO for Plumbers guide and hub.",
      primary: "Get my free plumbing SEO audit",
      primaryHref: "/seoauditor",
      secondary: "See SEO for Plumbers",
      secondaryHref: "/industries/seo-for-plumbers",
    },
    related: [
      { label: "How Many Keywords Should a Plumber's Website Target", href: "/blog/how-many-keywords-plumber-website" },
      { label: "SEO for Plumbers hub", href: "/industries/seo-for-plumbers" },
    ],
  },

  "best-keywords-for-car-garages": {
    slug: "best-keywords-for-car-garages",
    seoMeta: {
      title: "Best Keywords for Car Garages and MOT Centres UK (2026) | Klarai",
      metaDescription:
        "The keywords that drive MOT, servicing and repair bookings for UK garages, grouped by intent, plus how to build pages around them. A practical 2026 garage keyword list.",
      primaryKeyword: "best keywords for car garages",
    },
    hero: {
      title: "Best Keywords for Car Garages and MOT Centres UK (2026)",
      description: "The keywords that drive MOT, servicing and repair bookings, plus how to build pages around them.",
      coverImage: "",
    },
    author: "Klarai Team",
    publishedDate: new Date().toISOString(),
    intro: [
      "The best keywords for car garages are local, high intent searches tied to MOTs, servicing and repairs, like \"MOT near me\" and \"car service plus town\". Make and model specialist terms capture the premium market. Because garage searches are almost always local and ready to book, targeting the right terms and a strong Google Business Profile beats chasing broad words. This list groups the most valuable garage keywords and shows how to use them.",
    ],
    sections: [
      { heading: "Why keyword choice makes or breaks a garage website", content: ["Garage searches are different from most industries. They are almost entirely local and high intent, because someone searching for an MOT or a repair usually needs it soon and will book quickly. That means the right keyword is rarely the broadest one. \"Garage\" is vague and competitive. \"MOT retest near me\" is a driver with a deadline and a card ready. Choosing the searches that show booking intent is what fills your diary."] },
      { heading: "MOT keywords", content: ["MOT searches are date driven and repeat every year, which makes them predictable and valuable.", "MOT near me, MOT plus town, MOT test plus town, MOT retest, MOT and service, cheap MOT plus town, class 7 MOT"] },
      { heading: "Servicing and repair keywords", content: ["These match drivers looking for routine or urgent work. Each deserves its own service page.", "Car service plus town, full service, interim service, brake repair, clutch replacement, exhaust repair, timing belt replacement, diagnostics, car repair near me"] },
      { heading: "Make and model specialist keywords", content: ["If you specialise, these capture the premium end of your local market and face less competition.", "BMW specialist plus town, VW service plus town, Mercedes repair plus town, Audi specialist, Land Rover servicing"] },
      { heading: "Local and near me keywords", content: ["Local intent drives garage bookings, so combine each service with your town or postcode area.", "Car garage near me, garage plus town, mechanic near me, tyre fitting plus town"] },
      { heading: "Which garage keywords to target first", content: ["Start with MOT and near me searches, because they carry the strongest booking intent and repeat seasonally. Add a page for each core service next. If you specialise in certain makes, build those specialist pages early, since they are valuable and less contested. Leave broad single word terms alone, they rarely convert."] },
      { heading: "How to build pages around these keywords", content: ["Give each service its own bookable page, each town you serve its own page, and your specialisms their own pages. Make sure your Google Business Profile lists every genuine service, because for garages the Map Pack often drives more bookings than the website in the short term. Link these pages together and up to your main garage page so Google sees a connected set. Our SEO for Garages hub maps this for your specific area."] },
    ],
    faqs: [
      { question: "What are the best keywords for a car garage?", answer: "The best keywords are local, high intent searches tied to MOTs, servicing and repairs, like \"MOT near me\", \"car service plus town\" and specific repair terms. Make and model specialist terms are valuable and less competitive." },
      { question: "How many keywords should a garage target?", answer: "Rather than a fixed count, aim for one focused page per core service, per town you serve, and per specialism. That usually means a handful of service pages plus location and specialist pages, not one page trying to rank for everything." },
      { question: "What keywords do MOT centres rank for?", answer: "MOT centres rank best for date driven local searches such as \"MOT near me\", \"MOT plus town\", \"MOT retest\" and \"MOT and service\", especially when paired with a fully optimised Google Business Profile." },
    ],
    cta: {
      heading: "Want these mapped to pages for your garage",
      sub: "Run a free audit. See also our full SEO for Garages and MOT Centres guide and hub.",
      primary: "Get my free garage SEO audit",
      primaryHref: "/seoauditor",
      secondary: "See SEO for Garages",
      secondaryHref: "/industries/seo-for-garages",
    },
    related: [
      { label: "SEO for Garages hub", href: "/industries/seo-for-garages" },
    ],
  },

  "how-many-keywords-plumber-website": {
    slug: "how-many-keywords-plumber-website",
    seoMeta: {
      title: "How Many Keywords Should a Plumber's Website Target? | Klarai",
      metaDescription:
        "The honest answer to how many keywords a plumber's website should target, why keyword stuffing fails, and how to map keywords to pages the way Google rewards.",
      primaryKeyword: "how many keywords should you target on a plumber's website",
    },
    hero: {
      title: "How Many Keywords Should a Plumber's Website Target?",
      description: "Stop counting keywords and start counting pages. Here is the honest answer.",
      coverImage: "",
    },
    author: "Klarai Team",
    publishedDate: new Date().toISOString(),
    intro: [
      "There is no magic number. A plumber's website should target one primary search per page, with a focused page for each core service and each area served. That usually means a handful of service pages and a few location pages, not one page crammed with keywords. Mapping one clear intent to each page is what Google rewards, and it brings more jobs than chasing a keyword count.",
    ],
    sections: [
      { heading: "The short answer", content: ["Stop counting keywords and start counting pages. The right approach is one focused page for each service you offer and each area you cover, with each page built around a single clear search intent. A plumber offering boiler repair, drain unblocking and bathroom fitting across three towns does not need one page stuffed with keywords. They need focused pages, each answering one specific search well."] },
      { heading: "Why stuffing keywords onto one page fails", content: ["When you try to rank a single page for boiler repair, drain unblocking, emergency call outs and three towns at once, you give Google nothing specific to match. The page is about everything, so it ranks for nothing. Search engines reward pages that answer one intent clearly. Keyword stuffing also reads badly to customers, which lowers the chance they call."] },
      { heading: "How to map keywords to pages", content: ["Group your keywords by intent, then give each group a home.", "One page per core service, such as boiler repair or drain unblocking. One page per area you cover, such as plumber in your town. Question based keywords grouped into blog posts. Each page targets one primary keyword and a few close variations, not a long list of unrelated terms.", "Our Complete Plumbing Keywords List groups the highest value terms by intent so you can map them straight to pages."] },
      { heading: "How many pages a typical plumber needs", content: ["A typical local plumber starts well with a homepage, three to six core service pages, a page for each main area served, and a few blog posts answering common questions. That is usually enough to cover the high intent searches that bring jobs, without spreading thin. You expand from there as you target more areas."] },
      { heading: "Common mistakes plumbers make with keywords", content: ["One overloaded services page trying to rank for everything. Chasing the word \"plumber\" instead of high intent local terms. No separate pages for the towns they actually cover. Repeating the same keyword across many pages, so those pages compete with each other."] },
    ],
    faqs: [
      { question: "How many keywords per page is ideal?", answer: "Aim for one primary keyword per page, plus a few closely related variations. A page built around a single clear intent ranks far better than one targeting many unrelated terms." },
      { question: "Should each plumbing service have its own page?", answer: "Yes. Each core service like boiler repair or drain unblocking should have its own focused page, so Google can match it to specific searches and customers find exactly what they need." },
      { question: "How many location pages should a plumber have?", answer: "One for each genuine area you serve, with unique, useful content for each. Do not create dozens of near identical pages for places you do not really cover, as thin duplicate pages can hurt rather than help." },
    ],
    cta: {
      heading: "Want a keyword to page map for your plumbing business",
      sub: "Run a free audit and we will build it. See also our Complete Plumbing Keywords List and our SEO for Plumbers hub.",
      primary: "Get my free plumbing SEO audit",
      primaryHref: "/seoauditor",
      secondary: "See plumbing keywords list",
      secondaryHref: "/blog/plumbing-keywords-list",
    },
    related: [
      { label: "The Complete Plumbing Keywords List", href: "/blog/plumbing-keywords-list" },
      { label: "SEO for Plumbers hub", href: "/industries/seo-for-plumbers" },
    ],
  },

  "emergency-plumber-seo": {
    slug: "emergency-plumber-seo",
    seoMeta: {
      title: "Emergency Plumber SEO: How to Rank for Urgent Searches UK | Klarai",
      metaDescription:
        "How to rank for emergency plumber searches in the UK, capture urgent ready to call leads, and win the Map Pack. A practical emergency plumber SEO guide for 2026.",
      primaryKeyword: "emergency plumber seo",
    },
    hero: {
      title: "Emergency Plumber SEO: How to Rank for Urgent Searches UK",
      description: "The biggest levers for ranking when customers need help right now.",
      coverImage: "",
    },
    author: "Klarai Team",
    publishedDate: new Date().toISOString(),
    intro: [
      "Emergency plumber SEO is about being the first business someone finds when they search \"emergency plumber near me\" at eleven at night. The biggest levers are a fully optimised Google Business Profile, a dedicated emergency page, fast mobile load speed, and a click to call button. These searches carry the highest booking intent in plumbing, because the customer needs help now and will call whoever appears first.",
    ],
    sections: [
      { heading: "Why emergency searches are the most valuable plumbing leads", content: ["When a pipe bursts or a boiler fails late at night, the customer is not browsing. They are stressed, they want it fixed now, and they will call the first credible result. There is almost no price shopping and almost no hesitation. That makes emergency searches the highest intent, highest value leads in plumbing. Ranking for them is often worth more than ranking for anything else."] },
      { heading: "How emergency plumber searches actually work", content: ["These searches are overwhelmingly mobile, local, and immediate. The Map Pack usually appears first, so your Google Business Profile often matters more than your website in the moment. Speed matters too, both how fast your page loads and how fast the customer can tap to call. A slow page or a buried phone number loses the job to the next result."] },
      {
        h2: "Ranking for emergency plumber near me",
        content: [],
        subheadings: [
          { title: "Google Business Profile for emergencies", content: ["Make sure your profile shows you as available, lists emergency and 24 hour services if you offer them, and has steady recent reviews. An active, complete profile is what gets you into the Map Pack for urgent searches."] },
          { title: "A dedicated emergency plumber page", content: ["Create a focused page for emergency and 24 hour plumbing, separate from your general services page. Give it the specific language people search for and a clear promise of fast response."] },
          { title: "Speed, click to call, and mobile", content: ["A prominent click to call button at the top, a fast loading mobile page, and a phone number that is impossible to miss. In an emergency, every extra second or tap costs you the booking."] },
        ],
      },
      { heading: "Local and 24 hour keyword targeting", content: ["Target the urgent terms directly: emergency plumber near me, emergency plumber plus town, 24 hour plumber, burst pipe repair, and no hot water. Build these into your emergency page and your profile so you appear exactly when the search happens."] },
      { heading: "How fast can you start ranking for these", content: ["A well optimised Google Business Profile can start appearing in local emergency searches within weeks, which is often faster than ranking a website page. The website side builds alongside it. Because many local plumbers neglect emergency specific optimisation, the opportunity to appear quickly is real. See our SEO for Plumbers hub for the full local SEO playbook."] },
    ],
    faqs: [
      { question: "How do I rank for emergency plumber near me?", answer: "Fully optimise your Google Business Profile, create a dedicated emergency plumbing page, make your site fast on mobile, and add a clear click to call button. Steady reviews and consistent local listings strengthen your position in the Map Pack." },
      { question: "Do I need a separate emergency plumbing page?", answer: "Yes. A focused emergency and 24 hour page ranks better for urgent searches than a general services page, because it matches the specific intent and language customers use in an emergency." },
      { question: "Is Google Ads or SEO better for emergency plumbing?", answer: "Ads can put you at the top instantly, which suits emergencies, but they cost for every click and stop when you pause them. SEO and a strong Google Business Profile keep bringing urgent leads without paying per click. Many plumbers use both, with SEO as the long term foundation." },
    ],
    cta: {
      heading: "Want to capture more urgent, ready to call leads",
      sub: "Run a free audit and we will show you your Map Pack and emergency page gaps. See also our SEO for Plumbers hub and Complete Plumbing Keywords List.",
      primary: "Get my free plumbing SEO audit",
      primaryHref: "/seoauditor",
      secondary: "See SEO for Plumbers",
      secondaryHref: "/industries/seo-for-plumbers",
    },
    related: [
      { label: "SEO for Plumbers hub", href: "/industries/seo-for-plumbers" },
      { label: "Complete Plumbing Keywords List", href: "/blog/plumbing-keywords-list" },
    ],
  },
};

// ============================================================
// EXPORTS (re-used by scripts/build-content-pack.mjs)
// ============================================================
export { industries, blogs };

// ============================================================
// RUN (skipped when imported as a module)
// ============================================================
async function run() {
  console.log("Signing in...");
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Signed in.");

  console.log("\nSeeding industry_pages...");
  for (const [slug, data] of Object.entries(industries)) {
    await setDoc(doc(db, "industry_pages", slug), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    console.log(`  ✓ industry_pages/${slug}`);
  }

  console.log("\nSeeding blog_posts...");
  for (const [slug, data] of Object.entries(blogs)) {
    await setDoc(doc(db, "blog_posts", slug), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    console.log(`  ✓ blog_posts/${slug}`);
  }

  console.log("\nDone. New Firestore docs:");
  console.log("  industry_pages:", Object.keys(industries).join(", "));
  console.log("  blog_posts:", Object.keys(blogs).join(", "));
  console.log("\nExisting service pages (in `pages` collection) and the 4 existing blog posts");
  console.log("should be updated via the /admin panel using the markdown content file:");
  console.log("  /home/abdullah/Downloads/klarai-master-content-file.md");
  process.exit(0);
}

if (isMain) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
