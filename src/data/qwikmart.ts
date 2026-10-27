/**
 * QwikMart — All-in-One quick-commerce & eCommerce platform (Firebase backend).
 * Product card data + product-page content. Documentation: /docs/qwikmart
 */
import type { Product } from "./products";
import type { ProductContent } from "./product-content";

export const QWIKMART_SLUG = "qwikmart-all-in-one-quick-commerce-ecommerce-platform";

export const qwikmartProduct: Product = {
  slug: QWIKMART_SLUG,
  name: "QwikMart",
  title:
    "QwikMart - All-in-One Quick Commerce & eCommerce Platform with Multi-Store & Multi-Country",
  type: "app",
  category: "ecommerce-marketplace",
  featured: true,
  isNew: true,
  price: 1799,
  oldPrice: 8299,
  rating: 4.9,
  sales: 1248,
  theme: { from: "#0B7A1C", to: "#22B03A", ink: "light" },
  icon: "cart",
  tagline: "All-in-One Quick Commerce & eCommerce Platform",
  chips: [
    "Customer App",
    "Delivery Boy App",
    "Website",
    "Admin Panel",
    "Store Panel",
    "Delivery Boy Panel",
  ],
  summary:
    "Launch 10-minute grocery delivery and a full online store from one platform — Flutter customer & rider apps, Next.js website and Admin, Store & Rider panels on a serverless Firebase backend.",
  version: "1.0.1",
  releaseDate: "14-10-2026",
  lastUpdate: "20-10-2026",
  platform: "Flutter 3.x",
  techStack: [
    "Flutter",
    "Next.js",
    "Firebase",
    "Cloud Functions",
    "Cloud Firestore",
  ],
  integrations: [
    "Firebase Cloud Messaging",
    "Firebase Phone Auth (OTP)",
    "Razorpay + 8 Payment Gateways",
    "SMTP Email",
    "SMS Gateway Integration",
    "Google Gemini AI",
    "OpenStreetMap",
  ],
  image: "/images/qwikmart-banner-923x470.webp",
  bannerArt: true,
};

const IMG = "/docs/qwikmart/images";
/** Premium product-page image (public/images/qwikmart, 1848 px wide). */
const sc = (name: string, height: number, alt: string) => ({ src: `/images/qwikmart/${name}.webp`, alt, width: 1848, height });

export const qwikmartContent: ProductContent = {
  docsUrl: "/docs/qwikmart",
  changelogUrl: "/docs/qwikmart/docs/changelog",

  overview: [
    "QwikMart is a multi-store Quick Commerce and eCommerce solution for launching, managing and scaling All-in-One grocery, retail, pharmacy and marketplace businesses from one system. Customers order daily essentials for delivery in minutes from the nearest store, or shop a wider catalogue delivered in 1–4 days — in the same app, with one toggle.",
    "The platform includes a Flutter Customer App and Delivery Boy App (Android & iOS), a Next.js customer website and three web panels — Super Admin, Store and Delivery Boy — all running on Google Firebase. There is no PHP, MySQL, cron job or VPS to maintain: Cloud Functions, Firestore and App Hosting scale automatically and you pay only for what you use.",
    "Draw delivery zones on a map, assign stores, design the home screen per zone, take payments with native Razorpay checkout, track riders live on the map and verify every hand-over with a delivery OTP. Wallet, refunds, Refer & Earn, coupons, returns, support chat and AI-generated product content are built in.",
  ],

  demos: [
    { label: "Customer", sub: "Android Demo" },
    { label: "Delivery Boy", sub: "Android Demo" },
    { label: "Customer", sub: "iOS (on request)" },
    { label: "Delivery Boy", sub: "iOS (on request)" },
  ],
  demoLinks: [
    { label: "Website Demo", href: "https://qwikmart-web--qwikmart-37299.asia-southeast1.hosted.app/" },
    { label: "Admin Panel Demo", href: "https://qwikmart-admin--qwikmart-37299.asia-southeast1.hosted.app/" },
  ],
  demoNote:
    "Browse the live website demo and open the Admin Panel demo above. Admin Panel login details and the Android demo apps are shared on request. You can also run the complete platform on your own computer in about 10 minutes with the sample data included in the package — see Demo Instructions in the documentation.",
  credentials: [],

  showcase: [
    {
      id: "platform",
      label: "Platform",
      title: "Quick commerce & eCommerce — one platform",
      intro: "One catalogue, one checkout and one admin panel power 10-minute delivery and a full online store.",
      images: [
        sc("01-two-in-one", 1120, "QwikMart runs hyperlocal quick commerce and eCommerce in one app with one catalogue and one admin panel"),
        sc("02-ecosystem", 1240, "QwikMart ecosystem: customer website, Admin, Store and Delivery Boy panels, Customer App and Delivery Boy App"),
      ],
    },
    {
      id: "tech-stack",
      label: "Tech Stack & Workflow",
      title: "Serverless tech stack and realtime order workflow",
      intro: "Flutter apps, Next.js web and a Firebase backend — and how an order flows from tap to doorstep.",
      images: [
        sc("03-tech-stack", 2020, "QwikMart tech stack: Flutter, Next.js 15, Firebase Cloud Functions, Firestore, Authentication, Storage, Cloud Messaging, App Hosting, Razorpay and 8 payment gateways"),
        sc("04-workflow", 1440, "QwikMart order workflow: customer orders, store packs, rider assigned, live tracking, OTP delivery"),
      ],
    },
    {
      id: "customer-app",
      label: "Customer App & Website",
      title: "Customer App & Website",
      intro: "A fast shopping experience on Android, iOS and the web — sharing one cart, wallet and order history.",
      images: [
        sc("05-shopping", 1404, "Quick commerce and eCommerce shopping on the QwikMart website and app"),
        sc("06-search", 1200, "Smart search, category rails, filters and product detail pages in the QwikMart app"),
        sc("07-payments", 1200, "Native Razorpay checkout plus Stripe, PayPal, PhonePe, Cashfree, Paystack, PayTabs, Midtrans, Wallet and COD"),
        sc("08-tracking", 1200, "Live order tracking with the rider on the map in the QwikMart customer app"),
        sc("09-otp", 1120, "Secure delivery with a 6-digit OTP shown only to the customer"),
        sc("10-wallet", 1120, "QwikMart wallet with instant refunds, cashback and Refer & Earn rewards"),
      ],
    },
    {
      id: "delivery-app",
      label: "Delivery Boy App",
      title: "Delivery Boy App & Panel",
      intro: "Riders register, go online and follow a guided pickup-to-delivery workflow with earnings and COD cash tracking.",
      images: [
        sc("11-rider", 1200, "QwikMart Delivery Boy App: registration, go online with live location and guided delivery workflow"),
        sc("12-earnings", 1120, "Rider earnings, COD cash in hand and withdrawals in the QwikMart Delivery Boy App"),
      ],
    },
    {
      id: "admin-panel",
      label: "Admin & Store Panel",
      title: "Admin Panel & Store Panel",
      intro: "Run the whole business from one realtime, role-based panel — and give every store its own.",
      images: [
        sc("13-dashboard", 1406, "QwikMart admin dashboard with revenue, orders and order-status analytics"),
        sc("14-orders", 1282, "Unified order management with rider assignment, live map and invoices"),
        sc("15-zones", 1282, "Delivery zones drawn on the map with base, per-km, free-delivery and surge pricing"),
        sc("16-home-builder", 1602, "Visual Home Builder for zone-wise Quick and eCommerce home layouts"),
        sc("17-catalogue", 1282, "Product catalogue with variants, bulk upload and Google Gemini AI product content"),
        sc("18-roles", 1250, "Roles, permissions and the dedicated Store panel"),
        sc("19-settings", 1370, "System settings for payment gateways, SMTP, SMS, push, AI, wallet, referral and delivery"),
      ],
    },
    {
      id: "scale",
      label: "Requirements",
      title: "Built to scale — and what you need to launch",
      images: [
        sc("20-multi-country", 1040, "Multi-store, multi-zone, multi-country and multi-language support with RTL"),
        sc("21-requirements", 1280, "Requirements: Firebase Blaze plan, Flutter, Google Play Console, optional payment gateway, SMTP and SMS; OpenStreetMap maps"),
        sc("22-what-you-get", 1120, "Everything included: Customer App, Delivery Boy App, website, Admin, Store and Delivery Boy panels, Firebase backend, docs and updates"),
      ],
    },
  ],

  screens: [
    { src: `${IMG}/app-customer-home.webp`, alt: "Quick commerce home" },
    { src: `${IMG}/app-customer-ecommerce.webp`, alt: "eCommerce mode" },
    { src: `${IMG}/app-customer-product.webp`, alt: "Product detail" },
    { src: `${IMG}/app-customer-cart.webp`, alt: "Cart & checkout" },
    { src: `${IMG}/app-customer-tracking.webp`, alt: "Live order tracking" },
    { src: `${IMG}/app-customer-wallet.webp`, alt: "Wallet & rewards" },
    { src: `${IMG}/app-delivery-home.webp`, alt: "Rider home — go online" },
    {
      src: `${IMG}/app-delivery-workflow.webp`,
      alt: "Guided delivery workflow",
    },
    { src: `${IMG}/app-delivery-otp.webp`, alt: "Delivery OTP" },
    { src: `${IMG}/app-delivery-earnings.webp`, alt: "Rider earnings" },
    { src: `${IMG}/web-home.jpg`, alt: "Customer website", wide: true },
    { src: `${IMG}/admin-dashboard.jpg`, alt: "Admin dashboard", wide: true },
    {
      src: `${IMG}/admin-order-detail.jpg`,
      alt: "Order detail with live map",
      wide: true,
    },
    { src: `${IMG}/admin-zones.jpg`, alt: "Delivery zones", wide: true },
  ],

  why: [
    {
      title: "Dual Commerce, One Platform",
      text: "Run 10-minute quick commerce and 1–4 day eCommerce side by side — one catalogue, one checkout, one admin panel.",
    },
    {
      title: "Complete Commerce Ecosystem",
      text: "Customer app, rider app, website and Admin, Store & Delivery Boy panels — every piece you need to launch, already connected.",
    },
    {
      title: "No Server to Maintain",
      text: "Built on Firebase: Cloud Functions, Firestore, Authentication and App Hosting scale automatically. No VPS, PHP, MySQL or cron jobs.",
    },
    {
      title: "Built to Scale",
      text: "Multi-store, multi-zone, multi-country and multi-currency, with English, Hindi and Arabic (RTL) out of the box.",
    },
    {
      title: "Secure by Design",
      text: "Prices, coupons, payments, wallet and refunds are calculated on the server; Firestore security rules scope every role to its own data.",
    },
    {
      title: "Increase Revenue Faster",
      text: "Delivery fees, surge pricing, coupons, cashback, wallet top-ups and Refer & Earn are ready on day one.",
    },
  ],

  features: [
    {
      title: "Customer App & Website",
      subtitle:
        "Flutter app for Android & iOS and a Next.js website that share the same cart, orders and wallet.",
      items: [
        {
          title: "Quick & eCommerce Shopping",
          text: "Switch between minutes-delivery from the nearest store and the wider eCommerce catalogue with one toggle.",
        },
        {
          title: "Dynamic Home Screen",
          text: "Banners, category rows, product sliders and brands published per zone from the Admin Home Builder.",
        },
        {
          title: "Smart Search & Discovery",
          text: "Live suggestions, trending searches, filters by category, brand and price, and sorting.",
        },
        {
          title: "Guest & Synced Cart",
          text: "Shop as a guest; the cart is kept when the customer logs in with phone OTP or e-mail.",
        },
        {
          title: "Native Razorpay Checkout",
          text: "UPI apps, cards, net banking and wallets in the app, plus COD, Wallet and 8 online gateways.",
        },
        {
          title: "Live Order Tracking",
          text: "Real-time order status and the rider moving on the map, with call and chat shortcuts.",
        },
        {
          title: "Secure Delivery OTP",
          text: "A 6-digit code shown only to the customer confirms every hand-over.",
        },
        {
          title: "Cancellations & Returns",
          text: "Cancel before packing; request returns with photos and get refunds to the wallet instantly.",
        },
        {
          title: "Wallet, Cashback & Refer-Earn",
          text: "Top up, pay, receive refunds and referral rewards, and withdraw added money to the bank.",
        },
        {
          title: "Ratings, Reviews & Support Chat",
          text: "Photo reviews on delivered products and realtime chat with support from any order.",
        },
        {
          title: "Multi-Language & RTL",
          text: "English, Hindi and Arabic (right-to-left), light and dark mode.",
        },
        {
          title: "Blog, FAQ & Policy Pages",
          text: "Content managed in the Admin Panel, including the pages Google Play requires.",
        },
      ],
    },
    {
      title: "Delivery Boy App & Panel",
      subtitle:
        "Flutter rider app plus a browser panel for riders who prefer the web.",
      items: [
        {
          title: "Self Registration",
          text: "Riders sign up with vehicle, zone, driving licence, ID proof and bank details; admins approve them.",
        },
        {
          title: "Go Online & Live Location",
          text: "A location foreground service shares the rider's position while online — and stops when they go offline.",
        },
        {
          title: "Guided Delivery Workflow",
          text: "Accept → picked up → out for delivery → deliver with OTP, with Google Maps navigation.",
        },
        {
          title: "Auto or Manual Assignment",
          text: "Nearest online rider is assigned automatically, or riders pick orders from the zone's available list.",
        },
        {
          title: "Earnings & COD Cash",
          text: "Commission per delivery, cash in hand from COD orders, deposits and payout history.",
        },
        {
          title: "Wallet & Withdrawals",
          text: "Riders request withdrawals to their bank account; admins approve with a receipt.",
        },
      ],
    },
    {
      title: "Admin Panel",
      subtitle:
        "The control centre for the whole business — role-based and realtime.",
      items: [
        {
          title: "Live Dashboard & Analytics",
          text: "Revenue, orders, returns, order-status breakdown and trends, filterable by country, zone and date.",
        },
        {
          title: "Complete Catalogue Management",
          text: "Categories, brands, attributes, taxes, products with variants, stock per store, bulk upload & update.",
        },
        {
          title: "AI Product Content",
          text: "Generate descriptions and SEO text and translate into every language with Google Gemini.",
        },
        {
          title: "Unified Order Management",
          text: "Status changes, rider assignment, payment status, invoices, self-pickup and support chat from the order.",
        },
        {
          title: "Zones & Flexible Delivery Pricing",
          text: "Map-drawn zones with base and per-km fees, free delivery threshold, minimum order and surge hours.",
        },
        {
          title: "Multi-Store & Multi-Country",
          text: "Stores per zone with opening hours and commission; countries with their own currency and dial code.",
        },
        {
          title: "Visual Home Builder",
          text: "Drag-and-drop sections with a device preview; drafts stay private until you publish.",
        },
        {
          title: "Coupons & Promotions",
          text: "Percent, fixed, free-delivery and cashback codes with limits, validity and zone/store/product targeting.",
        },
        {
          title: "Returns, Refunds & Withdrawals",
          text: "Approve returns, schedule rider pickups and refund to wallet or the original payment method.",
        },
        {
          title: "Notifications & E-mail",
          text: "Push campaigns, bulk e-mail with templates and a full mail log.",
        },
        {
          title: "Website Contact Messages",
          text: "Contact-us form submissions with ticket numbers, notes and status.",
        },
        {
          title: "Roles & Permissions",
          text: "Staff users with fine-grained permissions per module; secrets visible to the Super Admin only.",
        },
      ],
    },
    {
      title: "Store Panel",
      subtitle:
        "A dedicated panel for every store owner, scoped to their own store by security rules.",
      items: [
        {
          title: "Own Orders & Self-Pickup",
          text: "Process the store's orders and pickups in real time.",
        },
        {
          title: "Products, Stock & Prices",
          text: "Add products (with admin approval) and override stock and prices per store.",
        },
        {
          title: "Store Staff & Roles",
          text: "Create packers and managers with limited permissions.",
        },
        {
          title: "Store Promotions & Reports",
          text: "Store-specific coupons, notifications and sales reports.",
        },
      ],
    },
  ],

  problems: [
    {
      problem: "Separate systems for quick delivery and online store",
      solution:
        "Quick commerce and eCommerce in one app, one catalogue, one panel.",
    },
    {
      problem: "Servers, databases and cron jobs to babysit",
      solution: "Serverless Firebase backend that scales automatically.",
    },
    {
      problem: "Riders' location and delivery proof are unclear",
      solution: "Live rider tracking and an OTP-verified hand-over.",
    },
    {
      problem: "Expanding to a new city takes weeks",
      solution:
        "Draw a zone, add a store, publish a home layout — live in an afternoon.",
    },
    {
      problem: "Refunds and payouts handled in spreadsheets",
      solution:
        "Automatic wallet refunds, rider earnings, cash collection and withdrawal approvals.",
    },
    {
      problem: "Writing product content in several languages",
      solution:
        "One-click AI descriptions and translations with Google Gemini.",
    },
  ],

  ecosystem: [
    {
      title: "Admin, Store & Delivery Boy Panels (Next.js)",
      text: "Catalogue, orders, zones, stores, riders, payments and settings",
    },
    {
      title: "Serverless Backend (Firebase)",
      text: "Cloud Functions, Firestore security rules, Authentication, Storage",
    },
    {
      title: "Customer Website (Next.js)",
      text: "Browse, order, pay and track from any browser",
    },
    {
      title: "Customer App (Flutter)",
      text: "Shop, pay with Razorpay, track live and manage the wallet",
    },
    {
      title: "Delivery Boy App (Flutter)",
      text: "Go online, accept, navigate and deliver with OTP",
    },
    {
      title: "Real-Time Services",
      text: "Live tracking • Push notifications • Support chat • Live dashboards",
    },
  ],

  requirements: [
    {
      title: "Built In:",
      text: "Flutter, Next.js, Firebase (Cloud Functions, Firestore)",
    },
    {
      title: "Server Required:",
      text: "No VPS needed — Firebase Blaze plan (pay as you go) with App Hosting",
    },
    {
      title: "Third-Party Accounts Required:",
      text: "Firebase / Google Cloud, Google Play Console (Apple Developer for iOS), payment gateway (e.g. Razorpay), SMTP mail service; optional SMS gateway and Gemini API key. Maps use OpenStreetMap — no Google Maps key needed.",
    },
  ],

  youGet: [
    "Flutter Customer App (Android & iOS)",
    "Flutter Delivery Boy App (Android & iOS)",
    "Next.js Customer Website",
    "Next.js Admin, Store & Delivery Boy Panels",
    "Firebase Backend: Cloud Functions, Rules & Indexes",
    "Sample Data for Local Demo",
    "Complete Online Documentation",
    "Lifetime Product Updates",
  ],

  revenue: [
    {
      title: "Store Commission",
      text: "Earn a commission on every order fulfilled by partner stores.",
    },
    {
      title: "Delivery & Service Fees",
      text: "Base and per-km delivery charges, surge hours, handling and small-cart fees.",
    },
    {
      title: "Featured Placements",
      text: "Sell home-screen banners, product sliders and top-brand slots per zone.",
    },
    {
      title: "Wallet Top-ups",
      text: "Keep money in your ecosystem with wallet balances, cashback and refunds to wallet.",
    },
    {
      title: "Promotions & Loyalty",
      text: "Coupons, cashback and Refer & Earn campaigns that drive repeat orders.",
    },
    {
      title: "Own-Brand Dark Stores",
      text: "Run your own inventory with full margin alongside partner stores.",
    },
  ],

  faqs: [
    {
      q: "What do I get when I buy QwikMart?",
      a: "The complete source code of the Customer App, Delivery Boy App, Next.js website, Admin/Store/Delivery Boy panels and the Firebase backend, plus sample data, online documentation and lifetime updates.",
    },
    {
      q: "Do I need a VPS or hosting server?",
      a: "No. QwikMart runs on Google Firebase (Blaze pay-as-you-go plan). The website and panels are hosted on Firebase App Hosting; a VPS is optional if you prefer self-hosting.",
    },
    {
      q: "Which payment gateways are supported?",
      a: "Razorpay (native checkout in the app), Stripe, PayPal, Cashfree, PhonePe, Paystack, PayTabs and Midtrans, plus Wallet and Cash on Delivery.",
    },
    {
      q: "Can I rebrand QwikMart with my own name, logo and colours?",
      a: "Yes. The documentation explains how to change the package name, app name, logo, splash, colours, fonts and texts. Our installation plans can do it for you.",
    },
    {
      q: "Does it support multiple stores and countries?",
      a: "Yes — unlimited stores, map-drawn delivery zones, multiple countries with their own currency, and English, Hindi and Arabic (RTL).",
    },
    {
      q: "Is Google Maps required?",
      a: "No. Maps, address pins and live tracking use OpenStreetMap, so there is no Google Maps API key or bill.",
    },
    {
      q: "Do you help publish the apps to Google Play?",
      a: "Yes. The documentation covers the full Play Console process (Data safety, foreground-service declaration, signing), and our installation plans include publishing.",
    },
  ],
};
