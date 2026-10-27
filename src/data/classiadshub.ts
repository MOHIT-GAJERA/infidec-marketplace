/**
 * ClassiAds-Hub — Classified ads & buy-sell marketplace (Firebase backend).
 * Product card data + product-page content. Documentation: /docs/classiadshub
 */
import type { Product } from "./products";
import type { ProductContent } from "./product-content";

export const CLASSIADSHUB_SLUG = "classiads-hub-classified-ads-buy-sell-marketplace-platform";

export const classiadshubProduct: Product = {
  slug: CLASSIADSHUB_SLUG,
  name: "ClassiAds-Hub",
  title: "ClassiAds-Hub - Classified Ads & Buy-Sell Marketplace with Flutter App, Next.js Website and Admin Panel on Firebase",
  type: "app",
  category: "ecommerce-marketplace",
  featured: true,
  isNew: true,
  price: 1599,
  oldPrice: 7499,
  rating: 4.7,
  sales: 615,
  theme: { from: "#14143A", to: "#FFBF00", ink: "light" },
  icon: "megaphone",
  tagline: "Classified Ads & Buy-Sell Marketplace — Website, Mobile App & Admin Panel",
  chips: ["Website", "Mobile App", "Admin Panel", "Chat & Offers", "Seller Verification", "Online Payments"],
  summary:
    "Launch your own OLX-style marketplace: a Next.js website and a Flutter app where people post ads with photos and category fields, search and filter, chat and make offers, and a Next.js Admin Panel to moderate ads, manage categories, content, sellers and packages — all on a serverless Firebase backend with Stripe, Razorpay and PayPal checkout on the website.",
  version: "1.0.0",
  releaseDate: "27-10-2026",
  lastUpdate: "27-10-2026",
  platform: "Flutter 3.x & Next.js 16",
  techStack: ["Flutter", "Next.js", "Firebase", "Cloud Functions", "Cloud Firestore"],
  integrations: [
    "Firebase Authentication",
    "Firebase Cloud Messaging",
    "Cloud Storage",
    "Stripe",
    "Razorpay",
    "PayPal",
    "Google Maps Platform",
  ],
  image: "/images/classiadshub-banner-923x470.webp",
  bannerArt: true,
};

const IMG = "/docs/classiadshub/images";
/** Premium product-page image (public/images/classiadshub, 1848 px wide). */
const sc = (name: string, height: number, alt: string) => ({ src: `/images/classiadshub/${name}.webp`, alt, width: 1848, height });

export const classiadshubContent: ProductContent = {
  docsUrl: "/docs/classiadshub",
  changelogUrl: "/docs/classiadshub/docs/changelog",

  overview: [
    "ClassiAds-Hub is a complete classified ads and buy-sell marketplace for any city, country or niche — cars, phones, property, electronics, jobs and anything else. Sellers post an ad with photos, price, location and category-specific details; buyers search, filter, save favourites, chat with the seller and make price offers; and when the item is sold the buyer can rate the seller.",
    "The package includes a Next.js website, a Flutter app for Android and iOS and a Next.js Admin Panel. Everything runs on Google Firebase: a Cloud Functions REST API, Cloud Firestore, Firebase Authentication (email, phone and Google), Cloud Storage, Cloud Messaging and Firebase Hosting. There is no VPS, PHP, MySQL or cron job to maintain.",
    "Your team runs the marketplace from the Admin Panel: approve or reject ads, build unlimited nested categories with custom fields, manage sliders, feature sections and blog content, verify sellers, handle reviews and reports, and sell posting packages and featured-ad plans on the website through Stripe, Razorpay or PayPal hosted checkout that is verified on the server.",
  ],

  demos: [
    { label: "Website", sub: "Web Demo" },
    { label: "Admin Panel", sub: "Web Demo" },
    { label: "Mobile App", sub: "Android Demo" },
    { label: "Mobile App", sub: "iOS (on request)" },
  ],
  demoLinks: [
    { label: "Website Demo", href: "https://classiadshub.web.app" },
    { label: "Admin Panel Demo", href: "https://classiadshub-admin.web.app/" },
  ],
  demoRequests: ["Admin Panel", "Android App"],
  demoNote:
    "The website and Admin Panel demos are online. The Admin Panel demo login and the Android demo build are shared on request — contact us and we will send the demo accounts and the app link.",
  credentials: [],

  showcase: [
    {
      id: "platform",
      label: "Platform",
      title: "Website, mobile app & admin panel — one marketplace",
      intro: "Three apps on one serverless Firebase backend.",
      images: [
        sc("01-platform", 1340, "ClassiAds-Hub website, Flutter mobile app and Admin Panel on one Firebase backend"),
        sc("02-ecosystem", 1400, "ClassiAds-Hub ecosystem: website, mobile app, admin panel and payments around one Firebase Cloud Functions API"),
      ],
    },
    {
      id: "tech-stack",
      label: "Tech Stack & Ad Flow",
      title: "Serverless tech stack and a moderated ad flow",
      intro: "Next.js and Flutter on Firebase — and how an ad goes from photo to sold.",
      images: [
        sc("03-tech-stack", 1660, "ClassiAds-Hub tech stack: Next.js, Flutter, Cloud Functions, Firestore, Firebase Auth, Storage, Cloud Messaging, Hosting, Stripe, Razorpay, PayPal and Google Maps"),
        sc("04-ad-flow", 1360, "Ad lifecycle: post, admin review, live, chat and offers, mark as sold and seller review"),
      ],
    },
    {
      id: "website",
      label: "Website",
      title: "A fast marketplace website",
      intro: "Category menus, search and filters, rich ad pages, posting, chat and a full user dashboard.",
      images: [
        sc("05-website", 1400, "ClassiAds-Hub website home, search results and responsive mobile layout"),
        sc("06-ad-detail", 1400, "Ad detail page with photo gallery, price, specs, verified seller card and ratings, on the website and in the app"),
        sc("07-post-ad", 1400, "Post an ad with category fields, photos and location, and manage it from My Ads"),
        sc("08-chat-offers", 1400, "Chat between buyer and seller with price offers and push notifications"),
      ],
    },
    {
      id: "mobile-app",
      label: "Mobile App",
      title: "Your marketplace in every pocket",
      intro: "A Flutter app for Android and iOS that shares accounts, ads and chats with the website.",
      images: [
        sc("09-mobile-app", 1500, "ClassiAds-Hub Flutter app: home, categories, ad detail and My Ads"),
        sc("10-trust-safety", 1460, "Seller verification badges, ratings and reviews, and reports with admin moderation"),
      ],
    },
    {
      id: "admin-panel",
      label: "Admin Panel",
      title: "Admin Panel — run the marketplace from one console",
      intro: "A role-based Next.js panel with live KPIs, moderation, catalogue, content, monetization and settings.",
      images: [
        sc("11-dashboard", 1560, "Admin dashboard with ad counts, users, subscriptions, reviews and a revenue chart"),
        sc("12-moderation", 1560, "Ads moderation list with status filters and the ad review screen"),
        sc("13-catalogue", 1560, "Nested categories with icons and ordering, and custom fields per category"),
        sc("14-content", 1560, "Home screen sections, sliders, feature sections and the blog editor"),
        sc("15-monetization", 1560, "Subscription packages and featured-ad plans sold on the website with invoices"),
        sc("16-payments", 1520, "Website checkout with Stripe, Razorpay, PayPal and bank transfer, verified on the server"),
        sc("17-people-settings", 1560, "Roles and staff permissions, push campaigns and settings sections"),
      ],
    },
    {
      id: "scale",
      label: "Requirements",
      title: "What you need to launch — and what you get",
      images: [
        sc("18-requirements", 1320, "Requirements: Firebase Blaze plan, Node.js 22 and Firebase CLI, Flutter SDK, Google Play Console, Google Maps API key, optional Stripe, Razorpay or PayPal"),
        sc("19-what-you-get", 1420, "Everything included: website, mobile app, admin panel, Firebase backend, payment integrations, migration and QA tools, documentation and updates"),
      ],
    },
  ],

  screens: [
    { src: `${IMG}/app-home.webp`, alt: "App home" },
    { src: `${IMG}/app-ad-detail.webp`, alt: "Ad details" },
    { src: `${IMG}/app-chat.webp`, alt: "Chat with the seller" },
    { src: `${IMG}/app-post-ad.webp`, alt: "Post an ad" },
    { src: `${IMG}/web-home.jpg`, alt: "Website home", wide: true },
    { src: `${IMG}/web-ad-detail.jpg`, alt: "Ad page", wide: true },
    { src: `${IMG}/admin-dashboard.jpg`, alt: "Admin dashboard", wide: true },
    { src: `${IMG}/admin-ads.jpg`, alt: "Ads moderation", wide: true },
  ],

  why: [
    {
      title: "Website, App & Admin",
      text: "A Next.js website, a Flutter app for Android and iOS and a Next.js Admin Panel share one account system, one catalogue and one backend.",
    },
    {
      title: "No Server to Maintain",
      text: "Built on Firebase: Cloud Functions, Firestore, Auth, Storage, Cloud Messaging and Hosting scale automatically. No VPS, PHP, MySQL or cron jobs.",
    },
    {
      title: "Categories Your Way",
      text: "Unlimited nested categories with icons, ordering, bulk upload and custom fields per category — text, number, dropdown, checkbox, radio and more.",
    },
    {
      title: "Moderation Built In",
      text: "Every ad can be reviewed before it goes live, with approve, reject with a reason, feature and auto-approve for trusted sellers.",
    },
    {
      title: "Trust & Safety",
      text: "Seller verification with document upload, verified badges, seller ratings and reviews, and reports with admin-managed reasons.",
    },
    {
      title: "Earn From Listings",
      text: "Sell posting packages and featured-ad plans on the website through Stripe, Razorpay or PayPal hosted checkout, verified on the server.",
    },
  ],

  features: [
    {
      title: "Website",
      subtitle: "Next.js 16 website, deployed to Firebase Hosting.",
      items: [
        { title: "Browse & Search", text: "Category menus, keyword search with filters and sorting, category pages and nearby ads." },
        { title: "Rich Ad Pages", text: "Photo gallery, price, category fields, seller card with verified badge and rating, favourite, share and report." },
        { title: "Post & Manage Ads", text: "Post with photos, category fields and location; edit, mark as sold, renew or delete from My Ads." },
        { title: "Chat & Offers", text: "Message sellers from any ad and make price offers." },
        { title: "User Dashboard", text: "Favourites, chats, notifications, reviews, job applications, verification and profile with account deletion." },
        { title: "Plans & Checkout", text: "Buy posting packages and featured-ad plans with Stripe, Razorpay, PayPal or bank transfer." },
      ],
    },
    {
      title: "Mobile App",
      subtitle: "Flutter app for Android and iOS.",
      items: [
        { title: "Login Options", text: "Email and password, phone number and Google sign-in through Firebase Authentication." },
        { title: "Home & Discovery", text: "Sliders, popular categories, featured and most-viewed listings, search and nearby ads." },
        { title: "Post Ads", text: "Category picker, custom fields, multiple photos, price and location." },
        { title: "Chat & Offers", text: "Buying and selling inboxes, conversations, price offers and seller reviews." },
        { title: "Push Notifications", text: "New messages, offers, ad status and admin campaigns via Firebase Cloud Messaging." },
        { title: "Profile & Privacy", text: "Edit profile, verification badge request, language, followers and in-app account deletion." },
      ],
    },
    {
      title: "Admin Panel",
      subtitle: "Next.js 16 control centre with role-based access.",
      items: [
        { title: "Dashboard", text: "Total, featured, active, expired and sold ads, users, subscriptions, reviews and a revenue chart." },
        { title: "Ads & Moderation", text: "Status filters, review screen, approve, reject with reason, feature and create ads for users." },
        { title: "Categories & Fields", text: "Nested categories, drag-to-order, bulk upload and custom fields per category." },
        { title: "Content", text: "Sliders, home screen sections, feature sections, tips, banner ads, blog, FAQs and CMS pages." },
        { title: "Sellers & Trust", text: "Verification fields and requests, seller reviews, review reports, report reasons and user reports." },
        { title: "Monetization", text: "Subscription packages, featured-ad plans, user subscriptions, transactions, bank transfers and payment gateways." },
        { title: "People", text: "Customers, user queries, custom roles with per-module permissions, staff and push notifications." },
        { title: "Locations", text: "Countries, states, cities, areas and currencies." },
        { title: "Settings", text: "General, web and SEO, languages and currency, OTP, notifications, email templates, Firebase, watermark, AI and system status." },
      ],
    },
    {
      title: "Firebase Backend",
      subtitle: "Cloud Functions REST API, security rules and data model included.",
      items: [
        { title: "REST API", text: "One Express API on Cloud Functions with a consistent JSON envelope for the website, app and admin." },
        { title: "Verified Payments", text: "Stripe Checkout, Razorpay Payment Links and PayPal Orders, verified with the gateway before anything is activated." },
        { title: "Housekeeping", text: "An hourly job expires ads, featured flags and subscriptions and settles unfinished payments." },
        { title: "Migration & QA", text: "A MySQL-to-Firestore import tool and automated QA scripts with 190+ API checks." },
      ],
    },
  ],

  problems: [
    { problem: "Separate tools for the website, app and back office", solution: "One platform with a website, app and admin on the same backend." },
    { problem: "Servers, databases and cron jobs to babysit", solution: "Serverless Firebase backend that scales automatically." },
    { problem: "Spam and scam listings", solution: "Admin moderation, reports with reasons and seller verification." },
    { problem: "Buyers who don't trust sellers", solution: "Verified badges, ratings and reviews after a sale." },
    { problem: "Generic forms that don't fit every category", solution: "Custom fields per category for cars, property, phones and more." },
    { problem: "Fake payment confirmations", solution: "Every online payment verified with Stripe, Razorpay or PayPal on the server." },
  ],

  ecosystem: [
    { title: "Website (Next.js)", text: "Browse, post, chat, plans, checkout and user dashboard" },
    { title: "Serverless Backend (Firebase)", text: "Cloud Functions API, Firestore, Auth, Storage, Cloud Messaging" },
    { title: "Mobile App (Flutter)", text: "Browse, post, chat and get notified on Android and iOS" },
    { title: "Admin Panel (Next.js)", text: "Moderation, catalogue, content, sellers, monetization and settings" },
    { title: "Payments", text: "Stripe, Razorpay and PayPal hosted checkout plus bank transfer" },
    { title: "Real-Time Services", text: "Push notifications • Chat • Live dashboard counters" },
  ],

  requirements: [
    { title: "Built In:", text: "Next.js, Flutter, Firebase (Cloud Functions, Firestore, Authentication, Storage)" },
    { title: "Server Required:", text: "No VPS needed — Firebase Blaze plan (pay as you go) with Firebase Hosting for the website and Admin Panel" },
    {
      title: "Third-Party Accounts Required:",
      text: "Firebase / Google Cloud with a Google Maps Platform API key, Google Play Console (Apple Developer for iOS); optional Stripe, Razorpay or PayPal account for online payments.",
    },
  ],

  youGet: [
    "Next.js Website",
    "Flutter Mobile App (Android & iOS)",
    "Next.js Admin Panel",
    "Firebase Backend: Cloud Functions API, Security Rules & Indexes",
    "Stripe, Razorpay & PayPal Integrations",
    "MySQL Import Tool & Automated QA Scripts",
    "Complete Online Documentation",
    "Lifetime Product Updates",
  ],

  revenue: [
    { title: "Posting Packages", text: "Sell packages that set how many ads a user can post, for how long and in which categories." },
    { title: "Featured Ads", text: "Charge sellers to feature an ad at the top of search and the home feed for a number of days." },
    { title: "Paid Posting Mode", text: "Switch off free listing so every ad needs an active package." },
    { title: "Banner Ads", text: "Sell your own banner placements to local businesses." },
    { title: "Job Listings", text: "Run a jobs board alongside the marketplace." },
    { title: "Promotions", text: "Push campaigns, sliders and feature sections to drive traffic to paid listings." },
  ],

  faqs: [
    {
      q: "What do I get when I buy ClassiAds-Hub?",
      a: "The complete source code of the Next.js website, the Flutter mobile app, the Next.js Admin Panel and the Firebase backend (Cloud Functions API, security rules, indexes), plus the MySQL import tool, QA scripts, online documentation and lifetime updates.",
    },
    {
      q: "Do I need a VPS or hosting server?",
      a: "No. ClassiAds-Hub runs on Google Firebase (Blaze pay-as-you-go plan). The website and Admin Panel are hosted on Firebase Hosting and all server logic runs in Cloud Functions.",
    },
    {
      q: "Which payment methods are supported?",
      a: "On the website: Stripe, Razorpay and PayPal hosted checkout pages verified on the server, and manual bank transfer confirmed by an admin. The mobile app has no in-app purchases, so Google Play Billing rules do not apply — sellers buy packages and featured ads on the website.",
    },
    {
      q: "Can I add my own categories and ad fields?",
      a: "Yes. Create unlimited nested categories with icons, and attach custom fields (text, number, dropdown, checkbox, radio and more) to any category from the Admin Panel.",
    },
    {
      q: "How are ads and sellers moderated?",
      a: "New ads can wait for admin approval; admins approve, reject with a reason or feature them. Users can report ads and sellers, and sellers can request a verified badge by uploading documents for review.",
    },
    {
      q: "Can I rebrand ClassiAds-Hub with my own name, logo and colours?",
      a: "Yes. The documentation explains how to change the app's package name, name, launcher icon, splash and colours, and how to update the website and Admin Panel branding.",
    },
    {
      q: "I already run the older MySQL version. Can I move my data?",
      a: "Yes. The included import tool copies users (with their passwords), categories, ads, chats and settings from MySQL into Firestore and Firebase Authentication.",
    },
  ],
};
