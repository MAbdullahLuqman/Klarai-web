#!/usr/bin/env node
/**
 * Generates content/week1-content-pack.json — a bulk-mode payload
 * ready to paste into the admin /admin → JSON Upload tab (Bulk).
 *
 * Includes: 3 industry hubs + 4 new blog posts + 4 existing blog posts
 * + 3 service pages (existing pages collection).
 *
 * Usage:  node scripts/build-content-pack.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { industries, blogs } from "./seed-firestore.mjs";

// ------------------------------------------------------------
// Updates for the 4 EXISTING blog posts (Part A of master file).
// Schema: matches src/app/blog/[slug]/page.js renderer:
//   seoMeta:{title,metaDescription}, hero:{title,description,coverImage},
//   intro:[], sections:[{heading, content:[], subheadings?:[{title,content:[]}], list?:[]}],
//   faqs:[{question, answer}], cta:{...}
// ------------------------------------------------------------

const existingBlogs = {
  "seo-for-plumbers": {
    slug: "seo-for-plumbers",
    seoMeta: {
      title: "SEO for Plumbers UK: The Complete 2026 Guide | Klarai",
      metaDescription:
        "Complete SEO guide for UK plumbers. How to rank for emergency searches, local Map Pack, and service keywords that bring calls. Founder led, free audit.",
      primaryKeyword: "seo for plumbers",
    },
    hero: {
      title: "SEO for Plumbers UK: The Complete 2026 Guide",
      description:
        "Get found when local customers need you most. We rank plumbers for emergency searches, service keywords and local Map Pack results that bring real calls.",
      coverImage: "",
    },
    quickAnswer:
      "SEO for plumbers means getting found on Google and in the local Map Pack when customers search for your services nearby. The fastest results come from a fully optimised Google Business Profile, focused service pages, high intent local keywords, and steady reviews. Klarai helps plumbers rank for the emergency and service searches that actually bring calls, not vanity traffic.",
    intro: [],
    sections: [
      { heading: "Why most plumbers stay invisible to customers who are looking", content: [
        "When a pipe bursts on a Friday night, nobody scrolls Google results. They search \"emergency plumber near me\" on their phone and call whoever appears first. If that is not you, it is the competitor down the road who understands how local search works. Most plumbing websites are built like brochures, with no service pages, no local structure, and no understanding of how Google matches searches to businesses. So they sit invisible while customers call someone else.",
        "The second problem is structure and intent matching. Many plumbers have one overloaded homepage trying to rank for everything from boiler repair to drain unblocking across five towns at once. Google cannot match that to specific searches, so it ranks for nothing. A customer searching \"boiler repair Manchester\" needs to find a page about boiler repair in Manchester, not a generic homepage.",
      ]},
      { heading: "How SEO for plumbers actually works", content: [
        "Klarai builds SEO foundations that turn searches into booked jobs. We start by fixing your technical health and Google Business Profile, because if Google cannot crawl your site or find your business details, nothing else matters. Then we map real high intent keywords to focused pages, so each service and each area you cover has a dedicated, optimisable page. Finally we build the local citations, reviews and authority that make Google trust you as the best option for that search.",
      ]},
      { heading: "The three pillars of plumber SEO", content: [], subheadings: [
        { title: "Technical SEO and crawlability", content: ["Google cannot rank pages it cannot crawl. We fix site speed, mobile responsiveness, internal linking structure, schema markup and canonicals so Google finds and understands your content. A fast, clean site is the foundation everything else builds on."] },
        { title: "Local SEO and Google Business Profile", content: ["For most plumbers, your Google Business Profile ranks in the local Map Pack above the organic results. We fully build and optimise your profile, choose the right categories, keep it active with posts and updates, and build consistent listings across UK plumbing directories. This is often where most of your enquiries come from."] },
        { title: "Content and keyword matching", content: ["We create a dedicated page for each core service and each area you cover, so Google can match \"emergency plumber Birmingham\" to a page about emergency plumbing in Birmingham, not a generic homepage. We target high intent keywords, not vague broad terms that do not convert. One clear page per search intent is what Google rewards."] },
      ]},
      { heading: "The plumbing keywords that actually bring calls", content: [
        "High intent searches matter far more than high volume ones. A plumber searching \"how to become a plumber\" is a student, not a customer. Someone searching \"emergency plumber near me\" at 11 PM is a stressed customer ready to pay. We target:",
        "Emergency and urgent: emergency plumber near me, burst pipe repair, no hot water, boiler not working. Service plus location: boiler repair Manchester, drain unblocking Leeds, bathroom fitting London. Specific services: boiler repair, boiler installation, drain unblocking, radiator repair, tap repair. Local and near me: plumber near me, plumber plus your town, local 24 hour plumber.",
        "These are the searches that fill your diary.",
      ]},
      { heading: "How fast can a plumber expect results", content: [
        "Honestly, it depends on your starting point and how competitive your area is. If you already have a website, fixing the technical foundations and building missing service pages can start moving rankings within a few weeks. More competitive local searches take longer, usually two to three months as your authority and reviews build. We always prioritise the fastest wins first, so you feel momentum early rather than waiting half a year to see anything.",
      ]},
      { heading: "How we work with plumbers", content: [], list: [
        "Audit. We scan your website, Google Business Profile, local citations and rankings, then give you a prioritised list of what to fix first.",
        "Fix foundations. We resolve technical blockers, optimise your Google Business Profile, and build the service and location pages you are missing.",
        "Target high intent. We optimise for the emergency and service searches you are closest to ranking for.",
        "Build authority. We help you gather reviews, build consistent local citations, and strengthen your presence in directories.",
        "Grow. We track rankings and enquiries, refine what works, and expand into more competitive terms over time.",
      ]},
      { heading: "Why Klarai for plumber SEO", content: [
        "We are founder led by Abdullah Luqman, who builds the work directly rather than outsourcing. We work month to month with no lock in contracts, we focus on the fastest wins so you see enquiries early, and we will tell you honestly if SEO is not the right spend for your business yet. We have built SEO for plumbers across the UK and understand the local variations and seasonal patterns.",
      ]},
    ],
    faqs: [
      { question: "How much does SEO cost for a plumber?", answer: "It depends on how competitive your area is and what needs fixing. Rather than a fixed package, we audit first and recommend the lightest engagement that gets results. We work month to month with no lock in, so you only pay for what you need." },
      { question: "How long until I see plumbing leads from SEO?", answer: "Searches you already rank close to page one for can move within a few weeks. More competitive local searches usually take two to three months as your profile and authority build. We prioritise fast wins first." },
      { question: "Do you work with emergency plumber services?", answer: "Yes, especially. Emergency searches are the highest value and highest intent in plumbing. We build specific pages and strategies around capturing them." },
      { question: "Is local SEO or Google Ads better for plumbers?", answer: "Ads bring instant visibility but you pay for every click and they stop when you pause the budget. SEO takes longer but keeps bringing enquiries without paying per click. Most plumbers benefit from SEO as the long term foundation, with ads as an optional boost." },
      { question: "Do I need a new website or just SEO?", answer: "Not always a new one. If your site is fast and can be structured with proper service and location pages, we optimise what you have. If it is slow, outdated or cannot support proper structure, a rebuild pays for itself. The audit tells you which." },
      { question: "Should I optimise for emergency searches or routine services?", answer: "Both, but in order. Emergency searches bring faster results and higher intent, so start there. Routine service searches are more competitive but have higher volume long term. We do both." },
    ],
    toolBlock: {
      title: "See exactly which plumbing searches you are losing right now",
      description: "Run our free audit and we will show you your technical gaps, your missing service pages, your Map Pack position, and the quickest wins to start getting more calls this month.",
      ctaLink: "/seoauditor",
      ctaText: "Get my free plumbing SEO audit",
    },
  },

  "seo-for-garages-uk": {
    slug: "seo-for-garages-uk",
    seoMeta: {
      title: "SEO for Garages and MOT Centres UK: 2026 Complete Guide | Klarai",
      metaDescription: "Complete SEO guide for UK garages and MOT centres. Rank on Google Maps for MOT, servicing and repair searches. Free audit, founder led, no lock in.",
      primaryKeyword: "seo for garages uk",
    },
    hero: {
      title: "SEO for Garages and MOT Centres UK: Complete 2026 Guide",
      description: "Be the garage drivers find first. We rank you on Google Maps for MOT, servicing and repair searches that keep your ramps busy all year.",
      coverImage: "",
    },
    quickAnswer:
      "SEO for garages and MOT centres is about appearing at the top of Google Maps and organic results when local drivers search for an MOT, a service or a repair. Because these searches are local and high intent, the biggest wins come from a fully optimised Google Business Profile, dedicated service pages for MOT and repairs, and timing content around seasonal demand. Most garages have done almost no SEO, so the opportunity to outrank local competitors is real and fast.",
    intro: [],
    sections: [
      { heading: "Why most garages are invisible when drivers search", content: [
        "Picture a driver whose car fails its MOT on a Friday. They have ten working days to get it retested or they cannot drive legally. They type \"MOT retest near me\" on their phone and call the first garage that shows up. They do not compare five options or read reviews. They call whoever appears first and pays whatever is quoted. That search happens hundreds of times every day in every town in the UK.",
        "And in most towns, the garages showing up first are not the best garages or the most experienced. They are just the ones who did the basic SEO. The good news is most garages have done almost nothing, so the bar to outrank your local competitors is genuinely low right now.",
      ]},
      { heading: "How SEO for garages actually works", content: [
        "Klarai gets your garage appearing in the local Map Pack and the searches that drive bookings. We fix your Google Business Profile, build the service pages for MOT, servicing and repairs that customers and Google expect, and time your content around the seasonal spikes you can predict. We also make sure your site loads fast on mobile, because most garage searches happen on a phone when someone needs help fast.",
      ]},
      { heading: "The three pillars of garage SEO", content: [], subheadings: [
        { title: "Google Business Profile and the local Map Pack", content: ["For garages, your Google Business Profile often matters more than your website in the short term, because the Map Pack appears first on mobile. We build your profile completely, add every genuine service, write a compelling description, and keep it active with posts and updates so Google ranks you in local results."] },
        { title: "Mobile speed and conversion", content: ["Garage customers are usually searching on their phone, and they need to book fast. A slow site loses the booking before the customer even reads it. We build fast, mobile first websites that let customers tap to call or book instantly."] },
        { title: "Service pages and local keywords", content: ["We create a dedicated page for each core service (MOT, servicing, repairs, tyres) and each town or area you cover. This lets Google match \"car service Birmingham\" to your Birmingham service page, not guess from a generic homepage."] },
      ]},
      { heading: "The garage keywords that actually drive bookings", content: [
        "MOT keywords are different from servicing keywords, and both are different from make and model specialist terms. The highest intent searches are the most time sensitive ones.",
        "MOT and urgent: MOT near me, MOT retest, MOT plus town, urgent MOT, quick MOT. Servicing: car service, full service, interim service, service plus town. Repairs: brake repair, clutch repair, exhaust repair, diagnostics, repair near me. Specialist: BMW specialist, VW service, Mercedes repair, Audi specialist.",
        "These are the searches that fill your diary.",
      ]},
      { heading: "Seasonal MOT demand and timing", content: [
        "MOT searches are date driven and repeat every year. You can predict when the spikes are coming. We help you rank prominently in the weeks leading up to when local MOTs are due, so you capture the surge of drivers searching \"MOT near me\" at the same time every year. Preparing content and optimisation in advance is what wins those spikes.",
      ]},
      { heading: "How fast can a garage expect results", content: [
        "Because competition among garages is usually low and search intent is high, results often come faster than in more crowded industries. Terms you are close on can move within weeks. A well built Google Business Profile can start appearing in the Map Pack quickly. More competitive city centre areas take longer. We always chase the fastest wins first.",
      ]},
      { heading: "How we work with garages", content: [], list: [
        "Audit. We review your website, Google Business Profile, local citations and rankings.",
        "Fix profile. We build your Google Business Profile completely and accurately.",
        "Build pages. We create focused service pages for MOT, servicing, repairs and each area you serve.",
        "Optimise for local. We target the high intent local searches you are closest to winning.",
        "Seasonal timing. We prepare content and optimisation around predictable MOT spikes.",
        "Grow. We track bookings, refine, and expand into more competitive terms.",
      ]},
      { heading: "Why Klarai for garage SEO", content: [
        "We are founder led by Abdullah Luqman, who builds the work directly. We understand automotive SEO specifically and have worked with garages and MOT centres across the UK. We work month to month with no lock in, and we focus on the fastest wins so you see more bookings early.",
      ]},
    ],
    faqs: [
      { question: "How do I get my garage to the top of Google Maps?", answer: "Claim and fully build your Google Business Profile, add every genuine service you offer, write a clear description, keep it active with posts, collect steady reviews, and maintain consistent listings across UK directories. We handle all of this in a garage SEO engagement." },
      { question: "How much does garage SEO cost?", answer: "It depends on your area and what needs fixing. We run a free audit first and recommend the lightest engagement that gets results, working month to month with no lock in." },
      { question: "What keywords should an MOT centre target?", answer: "High intent local searches like \"MOT near me\", \"MOT retest\", \"MOT and service\", plus town specific terms like \"MOT Manchester\". Make and model specialist terms capture the premium segment. We map these to your specific area in the audit." },
      { question: "When should I prepare for MOT season?", answer: "MOT demand is date driven and repeats yearly. Content and optimisation should be in place in the weeks before local MOTs are due. We plan this in advance so you rank when the searches spike." },
      { question: "Do I need a website or just a Google Business Profile?", answer: "In the short term the profile drives most bookings. But a fast website with proper service pages is what lets you rank for the full range of searches and convert clicks. The strongest results come from both working together." },
      { question: "Is Google Ads or SEO better for a garage?", answer: "Ads bring instant calls but you pay for every one. SEO takes longer but keeps bringing calls without paying per click. Most garages benefit from SEO as the foundation, with ads as an optional boost for MOT season." },
    ],
    toolBlock: {
      title: "See why drivers are booking your competitors instead",
      description: "Run our free audit and we will show you your Map Pack gaps, your missing service pages, and the quickest wins to fill your diary this month.",
      ctaLink: "/seoauditor",
      ctaText: "Get my free garage SEO audit",
    },
  },

  "what-is-answer-engine-optimisation": {
    slug: "what-is-answer-engine-optimisation",
    seoMeta: {
      title: "What is Answer Engine Optimisation? AEO Explained for UK Businesses | Klarai",
      metaDescription: "Answer engine optimisation explained: how it differs from SEO, why your business needs it, and how to get cited by ChatGPT, Gemini and Google AI Overviews.",
      primaryKeyword: "what is answer engine optimisation",
    },
    hero: {
      title: "What is Answer Engine Optimisation? AEO Explained",
      description: "Your customers now ask AI before they ask Google. Answer engine optimisation gets you cited as the answer instead of buried in a list.",
      coverImage: "",
    },
    quickAnswer:
      "Answer engine optimisation, or AEO, is the practice of structuring your content so AI engines like ChatGPT, Gemini, Perplexity and Google AI Overviews quote your business directly when someone asks a relevant question. It builds on traditional SEO rather than replacing it. For UK businesses, it means being the one the AI recommends when a customer asks for the best option in your area or industry.",
    intro: [],
    sections: [
      { heading: "The shift from search to answer engines", content: [
        "Search has changed. For decades, being on page one meant you got traffic. Now an AI engine can rank your page highly and still quote a competitor, because your content is not structured in a way it trusts. Around a third of UK Google searches now return an AI generated answer. ChatGPT, Gemini, Perplexity and Copilot are first stops for millions of buyers. If the AI names a competitor when asked a question in your space, you have lost the customer before they ever reached your website.",
      ]},
      { heading: "What answer engine optimisation actually is", content: [
        "AEO is not a replacement for SEO. It is a layer on top of SEO. An AI engine cannot cite a page it cannot find or understand, so strong search fundamentals come first. But once your page ranks on Google, AEO ensures that when an AI assembles a response, it pulls from your page rather than a competitor's.",
        "AEO focuses on: clear, self contained answers to specific questions; proper schema markup that helps engines parse your content; authority signals that tell engines they can trust you as a source; entity consistency so engines recognise who you are across the web.",
      ]},
      { heading: "AEO vs SEO vs GEO: what is the difference", content: [
        "SEO (Search Engine Optimisation) gets your page ranked in traditional Google search results. It focuses on keywords, backlinks, page speed and user experience.",
        "AEO (Answer Engine Optimisation) structures your content so AI engines quote it in their answers. It focuses on quotable answer blocks, schema, entity strength and source credibility.",
        "GEO (Generative Engine Optimisation) is the broader goal of appearing across all generative platforms: ChatGPT, Gemini, Perplexity, Copilot and others. It is essentially AEO applied to multiple AI tools instead of just Google.",
        "In practice they overlap heavily. Strong SEO is the foundation. AEO and GEO build on that foundation by ensuring your content is cited by AI. You need all three, not one instead of the others.",
      ]},
      { heading: "How AI engines choose what to cite", content: [
        "When an AI generates an answer to a question, it does not read the entire internet. It works from the search index it has access to (usually Google's). It looks for pages that rank well, are clearly structured, have authoritative content, and explicitly answer the question asked. Then it quotes that content in the answer it generates.",
        "So the page that ranks first for a search is the page most likely to be cited in an AI answer. But ranking is not enough. The page needs to have the right structure, the right markup, and the right authority signals for the AI to trust it as a quote source.",
      ]},
      { heading: "What a quotable answer looks like", content: [
        "An AI can only quote what is clear and self contained. A wall of text means nothing. A page structured like this is quotable: a direct answer of 40 to 80 words at the top, written as a complete sentence or two. Clear headings that match common questions. Lists of points rather than paragraphs. Specific data backed by credible sources. Schema markup that explicitly labels the answer. Entity information that proves who wrote it.",
        "A page without these structures is much less likely to be quoted, even if it ranks well.",
      ]},
      { heading: "Why AEO matters for UK businesses", content: [
        "AI is shifting buyer behaviour faster than most businesses realise. When someone asks an AI for a recommendation in your industry or area, that recommendation often becomes the decision. Being quoted by ChatGPT or Google AI Overviews is a credibility boost that drives action. Not appearing in AI answers, while a competitor does, is losing business you did not even know was there.",
      ]},
      { heading: "How we do answer engine optimisation", content: [], list: [
        "Audit. We check how AI engines currently represent your brand and which questions in your market they are answering with other sources.",
        "Structure. We rewrite priority pages into clear, quotable answers with the right headings, lists, data and markup.",
        "Authority. We strengthen the signals that make engines trust you: consistent business information, credible references, entity strength.",
        "Track. We monitor your citations across AI platforms and refine what works month on month.",
      ]},
      { heading: "AEO is not a trick, it is good writing", content: [
        "The best part of AEO is that it aligns with what users actually want. Clear answers. Direct information. Useful structure. Pages optimised for AEO are also pages that convert better with humans, because they are easier to read and understand. You are not optimising for a machine. You are optimising for clarity, which both machines and humans reward.",
      ]},
    ],
    faqs: [
      { question: "What is answer engine optimisation?", answer: "Answer engine optimisation is the practice of structuring your content so AI engines like ChatGPT, Gemini and Google AI Overviews quote your business directly inside their answers, rather than you appearing only as a link in a list." },
      { question: "How is AEO different from SEO?", answer: "SEO gets you ranked in traditional search results. AEO gets you cited inside AI generated answers. They share foundations, so you need both. AEO builds on strong SEO, it does not replace it." },
      { question: "Can a small business benefit from AEO?", answer: "Yes. When someone asks an AI for a recommendation in your field or area, you want to be the one it names. AEO gives small businesses a real chance to be that recommendation instead of invisible." },
      { question: "How long does AEO take to work?", answer: "Pages you already rank near the top for can start appearing in AI answers within weeks. Newer or competitive topics take two to three months as your authority builds. The foundations matter more than speed here." },
      { question: "Do I need to create new content for AEO?", answer: "Usually not. We restructure your existing top ranking pages into clear answers, then fill the question gaps you are missing. New content comes after the core pages are optimised." },
      { question: "Does AEO cost extra or is it part of SEO?", answer: "We treat AEO as an evolution of SEO, not a separate product. The fundamentals overlap. If you are doing strong SEO, you can add AEO work on top. We recommend AEO once your basic SEO foundations are solid." },
    ],
    toolBlock: {
      title: "See how AI currently describes your business",
      description: "Run our free audit and we will show you where you appear in AI answers, where you are missing, and what to fix first.",
      ctaLink: "/seoauditor",
      ctaText: "Run my free AI visibility audit",
    },
  },

  "plumbing-seo-keywords": {
    slug: "plumbing-seo-keywords",
    seoMeta: {
      title: "Top Plumbing Keywords That Bring Jobs (2026 UK List) | Klarai",
      metaDescription: "The plumbing keywords that actually bring calls and jobs, ranked by intent and local search volume. 2026 UK plumbing keyword list and how to use them.",
      primaryKeyword: "plumbing seo keywords",
    },
    hero: {
      title: "Top Plumbing Keywords That Bring Real Jobs (2026)",
      description: "Stop chasing vanity terms. We rank plumbers for the emergency and service keywords that customers search when they are ready to book, not browsing.",
      coverImage: "",
    },
    quickAnswer:
      "The best plumbing keywords are the ones showing urgent high intent need, not the highest search volume. \"Emergency plumber near me\" brings more jobs than \"plumber\" ever will, because the person searching is in trouble and ready to call immediately. This guide groups the plumbing keywords that actually drive bookings by intent, with local variations and how to target them. Focus on the high intent terms first.",
    intro: [],
    sections: [
      { heading: "Why keyword volume does not equal booking intent", content: [
        "The word \"plumber\" gets searched thousands of times a month. But most of those searches are from people comparing prices, reading blogs or checking reviews, not people ready to book. An emergency plumber search at 11 PM is someone with a burst pipe who will call within minutes. That is the search that matters.",
        "We group keywords by intent because intent is what converts to jobs.",
      ]},
      { heading: "Emergency and high intent plumbing keywords", content: ["These are your most valuable searches. The person searching is stressed and ready to pay."], list: [
        "emergency plumber near me", "emergency plumber plus town", "24 hour plumber", "burst pipe repair", "leaking pipe", "no hot water", "boiler not working", "frozen pipes", "blocked drain",
      ]},
      { heading: "Service based plumbing keywords", content: ["These show someone knows what they need and is looking for a provider. Each deserves its own focused page."], list: [
        "boiler repair", "boiler installation", "boiler servicing", "bathroom installation", "bathroom fitting", "shower installation", "drain unblocking", "radiator repair", "tap repair", "toilet repair", "water heater repair", "central heating repair", "pipe repair",
      ]},
      { heading: "Local plumbing keywords", content: ["Local intent is where most plumbers win. Add your town or area to any service to create local keywords.", "Examples: emergency plumber Manchester, boiler repair Leeds, bathroom fitting Bristol."], list: [
        "plumber near me", "plumber plus town", "local plumber", "emergency plumber plus town", "boiler repair plus town", "bathroom fitter plus town",
      ]},
      { heading: "Question based and long tail keywords", content: ["These have lower search volume but are easier to rank for. They are perfect for blog content that builds authority and feeds AI answers."], list: [
        "what should I do if my pipe bursts", "how much does a boiler repair cost", "why is my boiler losing pressure", "how to find a reliable plumber", "how often should a boiler be serviced", "what causes a blocked drain",
      ]},
      { heading: "How to turn these keywords into pages and rankings", content: ["One keyword needs one focused page. You do not rank a single page for boiler repair, drain unblocking, emergency calls and three towns all at once. Instead:"], list: [
        "Create a dedicated page for each core service",
        "Create a page or section for each area you serve",
        "Group the question keywords into blog posts that build authority",
        "Link these pages together so Google sees a connected topical structure",
        "Point them all up to your main plumber service page",
      ]},
      { heading: "Local variations matter", content: [
        "Plumbing demand varies by season and location. Winter brings boiler and heating searches. Summer brings drainage and garden tap searches. Urban areas search differently than rural. New build areas need different keywords than older terraces. We map this for your specific area in the audit.",
      ]},
    ],
    faqs: [
      { question: "What are the best keywords for plumbers?", answer: "The best keywords show high intent and local need. Emergency searches like \"emergency plumber near me\" and specific service searches like \"boiler repair plus town\" bring more jobs than broad terms like \"plumber\"." },
      { question: "How many keywords should a plumber target?", answer: "Rather than a count, aim for one focused page per core service and per area you serve. That is usually a handful of service pages and a few location pages, not a count of keywords." },
      { question: "What is the most searched plumbing term?", answer: "Broad terms like \"plumber\" and \"plumber near me\" get high volume, but they are competitive and less likely to convert than emergency or specific service searches. Intent matters more than volume." },
      { question: "Should I target national terms or just local?", answer: "Most plumbers should focus on local first, because that is where the customers are. National terms take longer and are more competitive. Build local dominance first." },
    ],
    toolBlock: {
      title: "Get a keyword to page plan for your area",
      description: "Run our free audit and we will map the highest value keywords for your specific town and services into a clear page strategy.",
      ctaLink: "/seoauditor",
      ctaText: "Get my free plumbing SEO audit",
    },
  },
};

// ------------------------------------------------------------
// SERVICE PAGE UPDATES (collection: pages, IDs: seo, aeo, web)
// Shape matches src/lib/service-page-content.js (kept the same;
// only the text inside fields is replaced from Part A of the
// master content file). FAQ items use the pipe-delimited 'qas'
// string the existing renderer expects.
// ------------------------------------------------------------

const services = {
  seo: {
    meta: {
      title: "SEO Services UK | Technical, Local and Content SEO | Klarai",
      description:
        "SEO services that fix your foundations and target the terms you are closest to winning first. Technical, local and keyword SEO for UK businesses. Free audit, no lock in.",
    },
    hero: {
      visible: true,
      h1: "SEO Services UK",
      sub: "The foundations that make you findable. We fix the technical health and content strategy that decide whether you rank, then build the visibility that brings real enquiries.",
      btn1Text: "Get my free SEO audit",
      btn1Link: "/seoauditor",
      btn2Text: "Talk to us",
      btn2Link: "/contact",
    },
    tldr: {
      visible: true,
      h2: "TL;DR",
      text:
        "SEO services that build the technical foundations and content strategy that get UK businesses ranking and found locally. We fix site speed, architecture and schema first, then target the high intent keywords you are closest to winning. Start with a free audit to see your fastest wins.",
    },
    problem: {
      visible: true,
      h2: "The problem with most SEO services",
      paras: [
        "Most SEO agencies treat SEO as either a technical project or a content project, never both at once. So the site gets fast but still has broken internal linking. Or the content improves but the site stays slow. Clients pay for something called \"SEO\" but get incomplete work that does not move rankings because the foundations were never fixed.",
        "The other mistake is chasing broad, competitive keywords while ignoring the high intent terms you could win quickly. Ranking for \"plumber\" is expensive and slow. Ranking for \"emergency plumber near me\" is faster and brings actual jobs.",
        "We fix the foundations first, then target the quick wins. Technical health and content work happen in parallel, not one after the other. We read your actual Search Console data and prioritise the terms you already rank near page one for, because pushing those from position eleven to position one produces traffic far faster than starting new topics from zero.",
      ],
    },
    included: {
      visible: true,
      h2: "What SEO services include",
      items:
        "Technical SEO: Site speed, mobile responsiveness, internal linking structure, canonicals, schema markup, crawlability. If Google cannot understand your site, content does not matter.\nLocal SEO: Google Business Profile optimisation, local citations and directories, Map Pack visibility, local landing pages. For businesses selling to an area, local SEO often matters more than national rankings.\nContent and keyword SEO: Mapping real search demand to focused pages, building content around high intent keywords, internal linking for topical authority. One clear intent per page is what Google rewards.\nAuthority building: Reviews, citations, backlinks and entity strength. This is what tells Google you are a credible source worth ranking.",
    },
    audience: {
      visible: true,
      h2: "Who benefits from SEO services",
      text:
        "UK service businesses and trades that depend on local search. Growing brands competing nationally. SaaS and software companies trying to be found for product searches. Professional services like law, accounting and health. Any business where being found online directly drives revenue.",
    },
    process: {
      visible: true,
      h2: "How we work",
      steps:
        "Audit: We scan your technical health, current rankings, content gaps and authority.\nFix: We resolve technical blockers and build the missing pages.\nTarget: We optimise for the high intent terms you are closest to winning.\nGrow: We track results, refine, and expand into harder terms over time.",
    },
    engagement: {
      visible: true,
      h2: "How fast can you expect SEO results",
      text:
        "Realistic timeline: terms you already rank near page one for can move within a few weeks. Competitive new terms take two to three months. Very competitive national terms take six months or longer. We prioritise the fast wins so you see momentum early rather than waiting half a year for anything.",
    },
    results: {
      visible: true,
      h2: "Why Klarai for SEO services",
      text:
        "Founder led by Abdullah Luqman who builds the work directly. Month to month with no lock in contracts. We read your data and tell you honestly what is realistic for your market. We focus on the fastest wins so you feel momentum early.",
      note: "Real client testimonials will be added as they are approved.",
    },
    faq: {
      visible: true,
      h2: "Frequently asked questions",
      qas:
        "How much do SEO services cost?|It depends on how competitive your market is. Rather than a fixed price, we audit first and recommend what your specific situation needs, month to month with no lock in.\nHow long until I see SEO results?|Terms you rank close on can move within weeks. Harder terms take months. We chase fast wins first so you see progress.\nDo you do local SEO?|Yes. We optimise Google Business Profile, local citations and Map Pack visibility.\nWill you tell me if SEO is not right for my business?|Yes. The free audit tells you honestly whether SEO will pay back before you commit.",
    },
    cta: {
      visible: true,
      h2: "Find out exactly why you are not ranking",
      text: "Run the free audit and see your technical health, content gaps and quickest wins.",
      btnText: "Get my free SEO audit",
      btnLink: "/seoauditor",
    },
  },

  aeo: {
    meta: {
      title: "Answer Engine Optimisation Services UK | Get Cited by AI | Klarai",
      description:
        "AEO services that get your business cited by ChatGPT, Gemini, Perplexity and Google AI Overviews. UK based, founder led, free audit.",
    },
    hero: {
      visible: true,
      h1: "Answer Engine Optimisation Services UK",
      sub: "Your customers ask AI before they ask Google. We structure your content so ChatGPT, Gemini and Google AI Overviews name your business when they answer.",
      btn1Text: "Run my free AI visibility audit",
      btn1Link: "/seoauditor",
      btn2Text: "Talk to us",
      btn2Link: "/contact",
    },
    tldr: {
      visible: true,
      h2: "TL;DR",
      text:
        "Answer engine optimisation services that restructure your content so AI engines quote your business when customers ask relevant questions. Built on strong SEO foundations. For UK businesses, it means being the one the AI recommends in your industry and area.",
    },
    problem: {
      visible: true,
      h2: "Why AEO matters now",
      paras: [
        "Around a third of UK Google searches now return an AI generated answer. Tools like ChatGPT and Perplexity are a first stop for millions of people researching services, products and advice. If an AI names a competitor when someone asks a question in your space, you have lost that customer to a quote. You need to be the one the AI recommends.",
        "AEO is not a replacement for SEO, it builds on it. An AI engine draws from the same search index Google uses. It looks for pages that rank well, are clearly structured, have authority, and directly answer the question asked. Then it quotes from those pages.",
        "We make sure your pages are not just ranked, but structured to be quoted. That means clear answer blocks, proper schema, entity strength, and credibility signals.",
      ],
    },
    included: {
      visible: true,
      h2: "What AEO services include",
      items:
        "Content restructuring: We rewrite your key pages so each important question has a tight, quotable answer the engines can lift directly.\nSchema and markup: We add the structured data that helps AI engines understand and confidently quote your content.\nAuthority building: We strengthen how you are understood across the web through consistent information, credible references and source signals.\nTracking and refinement: We monitor how AI platforms cite you and refine the approach month by month.",
    },
    audience: {
      visible: true,
      h2: "Who benefits from AEO services",
      text:
        "Any UK business whose customers now research through AI before or instead of Google. Local trades, professional services, SaaS, retail, health, finance. If your buyer asks an AI for a recommendation, you want to be that recommendation.",
    },
    process: {
      visible: true,
      h2: "How we work",
      steps:
        "Audit: We check how AI currently describes you and where the gaps are.\nStructure: We rewrite pages into citable answers with proper markup.\nAuthorise: We build entity and authority signals across the web.\nTrack: We monitor citations and refine monthly.",
    },
    engagement: {
      visible: true,
      h2: "How fast does AEO work",
      text:
        "Pages you already rank near the top for can start appearing in AI answers within weeks. Newer topics take two to three months as authority builds. The foundations matter more than speed.",
    },
    results: {
      visible: true,
      h2: "The difference between SEO, AEO and GEO",
      text:
        "SEO equals traditional Google rankings. AEO equals AI citations in answers. GEO equals appearing across all generative platforms (ChatGPT, Gemini, Perplexity etc). They overlap and build on each other. You need all three.",
      note: "Real client testimonials will be added as they are approved.",
    },
    faq: {
      visible: true,
      h2: "Frequently asked questions",
      qas:
        "What is answer engine optimisation?|Answer engine optimisation is structuring your content so AI engines quote your business inside their answers, rather than only appearing as a link in results.\nHow is AEO different from SEO?|SEO ranks you in results. AEO gets you cited in answers. They share foundations so you need both.\nDoes AEO cost extra?|We treat AEO as an evolution of SEO. Once your basic SEO is solid, we add AEO work on top. Not a separate product, a natural progression.\nCan a small business benefit from AEO?|Yes. When someone asks AI for a recommendation in your field, you want to be the one named.",
    },
    cta: {
      visible: true,
      h2: "See how AI describes your business today",
      text: "Run our free audit and we will show you where you appear in AI answers and what to fix first.",
      btnText: "Run my free AI visibility audit",
      btnLink: "/seoauditor",
    },
  },

  web: {
    meta: {
      title: "Web Development and Design UK | Built to Rank | Klarai",
      description:
        "Fast, modern websites engineered to rank from day one and convert visitors into enquiries. SEO and AEO foundations built in. You own the site, no lock in.",
    },
    hero: {
      visible: true,
      h1: "Web Development and Design UK",
      sub: "A website that looks sharp and actually performs. We build fast, modern sites engineered to rank from launch and turn visitors into enquiries, not just impress them.",
      btn1Text: "Get a free site audit",
      btn1Link: "/seoauditor",
      btn2Text: "Talk to us",
      btn2Link: "/contact",
    },
    tldr: {
      visible: true,
      h2: "TL;DR",
      text:
        "Web development and design that builds fast, modern websites engineered to rank from launch and convert visitors into enquiries. Technical SEO and answer engine foundations are baked in from the first line of code. You fully own the site with no proprietary lock in.",
    },
    problem: {
      visible: true,
      h2: "Why most websites fail to deliver",
      paras: [
        "Most websites are built to look good and nothing else. They load slowly, they are invisible to search engines, they give visitors no clear reason to act. A beautiful website that nobody finds and nobody contacts is an expensive brochure.",
        "The deeper issue is design and SEO are treated as separate jobs. A designer ships something attractive, then SEO is bolted on months later fighting against architecture already baked in. By then speed, structure and markup are working against you.",
        "We build sites the way both search engines and customers reward. SEO and answer engine foundations are designed in from the first line of code, not added later. Speed and mobile responsiveness are non negotiable. Clear conversion paths guide visitors toward enquiring. You fully own the final site with no proprietary cages or lock in.",
      ],
    },
    included: {
      visible: true,
      h2: "What our web development includes",
      items:
        "Architecture and structure: Clean, logical URL structure that tells Google what matters. Proper internal linking. Focused pages per intent, not one overloaded homepage.\nSpeed and performance: Built on fast frameworks. Optimised images and assets. Mobile first design that loads instantly. Core Web Vitals that actually pass.\nSEO foundations: Schema markup baked in. Canonicals set correctly. Crawlable, indexable structure. Technical foundations that let the site climb.\nConversion design: Clear calls to action. Logical user journeys. Form optimisation. Fast click to call. Everything designed to turn visitors into enquiries.\nAnswer engine ready: Pages structured with quotable answer blocks, proper headings, lists and data. Schema that helps AI engines understand and cite you.",
    },
    audience: {
      visible: true,
      h2: "Who needs a website rebuild",
      text:
        "If your current site is slow, outdated, cannot support proper service pages, or was built on a restrictive platform, a rebuild pays for itself. If your site is fast, clean and can be properly structured, we optimise what you have.",
    },
    process: {
      visible: true,
      h2: "The web development process",
      steps:
        "Plan: We map your goals, audience, and the page structure search engines reward.\nDesign: Modern, conversion focused design that works on every device.\nBuild: Fast, clean code with SEO and AEO foundations included.\nOptimise: Speed, on page elements, schema, conversion paths.\nLaunch and support: Go live, then ongoing refinement and ranking growth.",
    },
    engagement: {
      visible: true,
      h2: "Technology we use",
      text:
        "Modern frameworks that actually perform. Proper hosting. Real CDN. Security that matters. Tools you can use and understand, not locked into one vendor.",
    },
    results: {
      visible: false,
      h2: "",
      text: "",
      note: "",
    },
    faq: {
      visible: true,
      h2: "Frequently asked questions",
      qas:
        "Will my new website actually rank?|A build is a foundation, not a guarantee. We engineer the technical SEO in so the site is rankable from day one. Then ongoing SEO does the climbing.\nHow long does a build take?|It depends on size and complexity, but we scope a clear timeline before starting.\nDo I own the website?|Yes, fully. No lock in, no proprietary platform, no cage.\nCan you redesign without losing rankings?|Yes. We migrate carefully with redirects and structure preserved, so you keep the visibility you have earned.",
    },
    cta: {
      visible: true,
      h2: "See what your current website is costing you",
      text: "Run a free audit and we will show you the speed, structure and SEO gaps holding it back.",
      btnText: "Get a free site audit",
      btnLink: "/seoauditor",
    },
  },
};

// ------------------------------------------------------------
// COMPOSE BULK PAYLOAD
// ------------------------------------------------------------

const rows = [];

for (const [id, data] of Object.entries(industries)) {
  rows.push({ collection: "industry_pages", id, data });
}
for (const [id, data] of Object.entries(blogs)) {
  rows.push({ collection: "blog_posts", id, data });
}
for (const [id, data] of Object.entries(existingBlogs)) {
  rows.push({ collection: "blog_posts", id, data });
}
for (const [id, data] of Object.entries(services)) {
  rows.push({ collection: "pages", id, data });
}

const outPath = join(process.cwd(), "content", "week1-content-pack.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(rows, null, 2));
console.log(`Wrote ${rows.length} rows to ${outPath}`);
console.log("Breakdown:");
console.log(`  industry_pages: ${Object.keys(industries).length}`);
console.log(`  blog_posts (new): ${Object.keys(blogs).length}`);
console.log(`  blog_posts (existing): ${Object.keys(existingBlogs).length}`);
console.log(`  pages (services): ${Object.keys(services).length}`);
