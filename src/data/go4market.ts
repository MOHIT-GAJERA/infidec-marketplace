/**
 * Go4Market — Multi-vendor quick commerce & eCommerce platform with Grocery, Food, Pharmacy & Shopping modules
 * (Firebase backend). Product card data + product-page content. Documentation: /docs/go4market
 */
import type { Product } from "./products";
import type { ProductContent } from "./product-content";

export const GO4MARKET_SLUG = "go4market-multi-vendor-quick-commerce-ecommerce-platform";

export const go4marketProduct: Product = {
  slug: GO4MARKET_SLUG,
  name: "Go4Market",
  title:
    "Go4Market - Multi-Vendor Quick Commerce & eCommerce Platform with Grocery, Food, Pharmacy & Shopping",
  type: "app",
  category: "ecommerce-marketplace",
  featured: true,
  isNew: true,
  price: 1999,
  oldPrice: 8999,
  rating: 4.9,
  sales: 368,
  theme: { from: "#0A4A33", to: "#0B8A4F", ink: "light" },
  icon: "store",
  tagline: "Multi-Vendor Quick Commerce & eCommerce Platform",
  chips: [
    "Customer App",
    "Partner App (Seller + Delivery)",
    "Website",
    "Admin Panel",
    "Seller Panel",
    "Delivery Panel",
  ],
  summary:
    "Launch a multi-vendor marketplace for groceries, food, medicines and shopping with 15/30-minute delivery — Flutter Customer & Partner apps, a Flutter Web storefront and Admin, Seller & Delivery panels on a serverless Firebase backend.",
  version: "1.0.0",
  releaseDate: "28-10-2026",
  lastUpdate: "29-10-2026",
  platform: "Flutter 3.x",
  techStack: ["Flutter", "Flutter Web", "Firebase", "Cloud Functions", "Cloud Firestore"],
  integrations: [
    "Firebase Cloud Messaging (App & Web Push)",
    "Firebase Auth (Email, Google & Phone OTP)",
    "Razorpay",
    "Stripe",
    "PayPal",
    "Google Gemini AI",
    "OpenStreetMap",
    "SMTP Email",
    "Twilio / MSG91 / Fast2SMS (optional)",
  ],
  image: "/images/go4market-banner-923x470.webp",
  bannerArt: true,
};

/** Premium product-page image (public/images/go4market, 1848 px wide). */
const sc = (name: string, height: number, alt: string) => ({ src: `/images/go4market/${name}.webp`, alt, width: 1848, height });

export const go4marketContent: ProductContent = {
  docsUrl: "/docs/go4market",
  changelogUrl: "/docs/go4market/docs/changelog",

  overview: [
    "Go4Market is a multi-vendor quick commerce and eCommerce platform that brings four businesses into one marketplace: Grocery, Food, Pharmacy and Shopping. Local sellers list their products, customers order from one cart, and orders arrive in 15 or 30 minutes, in a scheduled slot or ready for self-pickup at the store.",
    "The package includes two Flutter mobile apps — the Customer App and the Partner App, where sellers and delivery partners pick their role at sign-up — plus a Flutter Web customer website and Flutter Web Admin, Seller and Delivery panels. Everything runs on Google Firebase: Cloud Functions (TypeScript), Cloud Firestore, Authentication, Storage and Cloud Messaging. There is no PHP, MySQL, VPS or cron job to maintain.",
    "Prices, coupons, wallet, stock and payments are calculated on the server. Riders are tracked live on OpenStreetMap, every hand-over is verified with a delivery OTP, and COD cash, seller commissions, rider earnings, withdrawals, fund transfers and salaries are settled automatically. Sellers also get a POS with barcode scanning for walk-in customers.",
  ],

  demos: [
    { label: "Customer", sub: "Android Demo" },
    { label: "Partner (Seller + Delivery)", sub: "Android Demo" },
    { label: "Customer", sub: "iOS (on request)" },
    { label: "Partner", sub: "iOS (on request)" },
  ],
  demoLinks: [
    { label: "Website Demo", href: "https://go4market.web.app/" },
    { label: "Admin Panel Demo", href: "https://go4market-admin.web.app/" },
    { label: "Seller Panel Demo", href: "https://go4market-seller.web.app/" },
    { label: "Delivery Panel Demo", href: "https://go4market-delivery.web.app/" },
  ],
  demoNote:
    "Browse the live website and open the Admin, Seller and Delivery panel demos above. Panel login details and the Android demo apps are shared on request.",
  credentials: [],

  showcase: [
    {
      id: "platform",
      label: "Platform",
      title: "Four businesses, one multi-vendor marketplace",
      intro: "Grocery, Food, Pharmacy and Shopping share one cart, one checkout, one wallet and one admin panel.",
      images: [
        sc("01-four-modules", 1120, "Go4Market runs Grocery, Food, Pharmacy and Shopping modules in one multi-vendor app with one cart and one admin panel"),
        sc("02-ecosystem", 1240, "Go4Market ecosystem: Customer App, Partner App for sellers and delivery partners, website and Admin, Seller and Delivery panels"),
      ],
    },
    {
      id: "tech-stack",
      label: "Tech Stack & Workflow",
      title: "Serverless tech stack and realtime order workflow",
      intro: "Flutter apps, Flutter Web storefront and panels and a Firebase backend — and how an order travels from cart to doorstep.",
      images: [
        sc("03-tech-stack", 2020, "Go4Market tech stack: Flutter, Flutter Web, Firebase Cloud Functions, Firestore, Authentication, Storage, Cloud Messaging, Hosting, Razorpay, Stripe, PayPal and COD"),
        sc("04-workflow", 1440, "Go4Market order workflow: customer orders, seller confirms and packs, rider assigned, live tracking, OTP delivery and automatic settlement"),
      ],
    },
    {
      id: "customer-app",
      label: "Customer App & Website",
      title: "Customer App & Website",
      intro: "A fast shopping experience on Android and the web, sharing one account, cart, wallet and order history.",
      images: [
        sc("05-shopping", 1404, "Grocery, food, pharmacy and shopping on the Go4Market website and customer app"),
        sc("06-search", 1200, "Smart search, voice search for several items at once, filters, food add-ons and product pages"),
        sc("07-payments", 1200, "Checkout with 15 or 30-minute, scheduled or self-pickup delivery and Razorpay, Stripe, PayPal, wallet or COD"),
        sc("08-tracking", 1200, "Live order tracking with the rider on OpenStreetMap and a quick-delivery countdown"),
        sc("09-otp", 1120, "Secure delivery with a 4-digit OTP shown only to the customer"),
        sc("10-wallet", 1120, "Go4Market wallet with partial payment, refunds, Refer & Earn, membership plans and subscriptions"),
      ],
    },
    {
      id: "partner-app",
      label: "Partner App",
      title: "Partner App & Delivery Panel",
      intro: "One app for sellers and delivery partners. Riders go online, accept nearby orders and follow a swipe-to-confirm delivery flow.",
      images: [
        sc("11-rider", 1200, "Go4Market Partner App for delivery partners: go online, accept nearby deliveries and swipe through pickup to delivery"),
        sc("12-earnings", 1120, "Rider earnings, COD cash in hand, delivery history and withdrawals in the Partner App"),
      ],
    },
    {
      id: "admin-panel",
      label: "Admin & Seller Panel",
      title: "Admin Panel & Seller Panel",
      intro: "Run the whole marketplace from one realtime panel — and give every seller a panel and a POS of their own.",
      images: [
        sc("13-dashboard", 1406, "Go4Market admin dashboard with revenue, orders, order status and module switcher"),
        sc("14-orders", 1282, "Unified order management with rider assignment, live map, cash collection and invoices"),
        sc("15-modules", 1282, "Modules with their own colours, cities with delivery radius and live rider map"),
        sc("16-featured-sections", 1602, "Home sliders, offer banners, popups and featured sections for a dynamic home page per module"),
        sc("17-catalogue", 1282, "Product catalogue with infinite categories, variants, food add-ons, bulk upload and Google Gemini AI descriptions"),
        sc("18-seller-pos", 1250, "Seller panel and Partner App with POS and barcode scanning, plus roles and permissions for staff"),
        sc("19-settings", 1370, "Settings for payments, delivery, communication, SEO, app versions and force update"),
      ],
    },
    {
      id: "scale",
      label: "Requirements",
      title: "Built to grow — and what you need to launch",
      images: [
        sc("20-languages", 1040, "Website and panels in English, Hindi, Gujarati and Arabic with right-to-left layout; apps in English and Hindi; light and dark mode"),
        sc("21-requirements", 1280, "Requirements: Firebase Blaze plan, Flutter SDK, Node.js 22, Google Play Console, payment gateway and SMTP; optional SMS gateway and Gemini key; OpenStreetMap maps"),
        sc("22-what-you-get", 1120, "Everything included: Customer App, Partner App, website, Admin, Seller and Delivery panels, Firebase backend, docs and updates"),
      ],
    },
  ],

  why: [
    {
      title: "Four Modules, One Marketplace",
      text: "Grocery, Food, Pharmacy and Shopping in one app with one cart, one checkout and module-themed colours.",
    },
    {
      title: "True Multi-Vendor",
      text: "Seller onboarding and approval, per-seller commission, seller coupons, own rider fleets and automatic settlements.",
    },
    {
      title: "No Server to Maintain",
      text: "Built on Firebase: Cloud Functions, Firestore, Authentication, Storage and Hosting scale automatically. No VPS, PHP, MySQL or cron jobs.",
    },
    {
      title: "Fast, Flexible Delivery",
      text: "15 and 30-minute quick delivery, scheduled slots, self-pickup, live rider tracking on OpenStreetMap and OTP-verified hand-overs.",
    },
    {
      title: "Secure by Design",
      text: "Prices, coupons, wallet, stock and payments are calculated on the server; role claims and Firestore rules scope every user to their own data.",
    },
    {
      title: "Increase Revenue Faster",
      text: "Commission, delivery fees, membership plans, product subscriptions, coupons, wallet and Refer & Earn are ready on day one.",
    },
  ],

  features: [
    {
      title: "Customer App & Website",
      subtitle: "Flutter app for Android and a Flutter Web storefront that share the same account, cart, orders and wallet.",
      items: [
        { title: "Four Shopping Modules", text: "Grocery, Food, Pharmacy and Shopping, each with its own home page and colours." },
        { title: "Quick, Scheduled & Pickup Delivery", text: "15 or 30-minute delivery with a live countdown, scheduled slots or self-pickup at the store." },
        { title: "Smart & Voice Search", text: "Live suggestions, trending searches and voice search for several items at once, with filters, sorting and grid or list view." },
        { title: "Food Add-ons & Veg Marks", text: "Optional add-ons on dishes, veg/non-veg marks and custom product fields." },
        { title: "Flexible Payments", text: "Razorpay (UPI, cards, net banking), Stripe, PayPal, wallet with partial payment, or cash on delivery." },
        { title: "Live Order Tracking", text: "Order journey and the rider moving on OpenStreetMap, with a call-rider shortcut." },
        { title: "Delivery OTP", text: "A one-time code shown only to the customer confirms every hand-over." },
        { title: "Wallet, Membership & Subscriptions", text: "Refunds and cashback to the wallet, membership plans with free delivery, and daily, weekly or monthly product subscriptions." },
        { title: "Coupons & Refer-Earn", text: "Platform and seller coupons, daily offers and wallet credit for both referrer and friend." },
        { title: "Returns & Reorder", text: "Request returns with photos, refunds to the wallet, and one-tap reorder." },
        { title: "Email, Google & Phone OTP Login", text: "Three sign-in methods, plus guest browsing before checkout." },
        { title: "Languages & Themes", text: "Website in English, Hindi, Gujarati and Arabic (RTL); apps in English and Hindi; light and dark mode." },
      ],
    },
    {
      title: "Partner App & Delivery Panel",
      subtitle: "One Flutter app for sellers and delivery partners, plus browser panels for both roles.",
      items: [
        { title: "Role Choice at Sign-up", text: "Sell on Go4Market or Deliver with Go4Market — admins approve each partner." },
        { title: "Go Online & Live Location", text: "Riders share their location only while online; going offline stops tracking." },
        { title: "Nearby Deliveries", text: "Accept orders from the available pool or get auto-assigned as the nearest online rider." },
        { title: "Swipe-to-Confirm Flow", text: "Picked up → out for delivery → delivered with customer OTP and COD confirmation." },
        { title: "Earnings & Cash in Hand", text: "Per-order or monthly pay, daily earnings, COD cash in hand and settlement history." },
        { title: "Withdrawals", text: "Riders and sellers request payouts by bank or UPI; admins approve them." },
      ],
    },
    {
      title: "Admin Panel",
      subtitle: "The control centre for the whole marketplace — realtime and role-based.",
      items: [
        { title: "Live Dashboard & Module Switcher", text: "Revenue, orders, order status and top sellers, re-themed and filtered per module." },
        { title: "Unified Order Management", text: "Status changes, rider assignment, live map, invoices, self-pickup and POS orders." },
        { title: "Catalogue & AI Content", text: "Infinite categories, brands, attributes, taxes, variants, bulk upload and Google Gemini descriptions." },
        { title: "Sellers & Delivery Partners", text: "Requests, approvals, commission, seller policies, rider fleets, cash collection and salary." },
        { title: "Dynamic Home Page", text: "Home sliders, offer banners, popups and featured sections per module." },
        { title: "Finance", text: "Wallet transactions, withdrawals, fund transfers, payouts and payment transactions." },
        { title: "Marketing", text: "Coupons, push campaigns, membership plans, subscriptions and abandoned carts." },
        { title: "Reports", text: "Sales, product, category, seller, commission and POS reports." },
        { title: "Content & SEO", text: "Blogs, FAQs, policy pages, email templates, SEO settings and an XML sitemap." },
        { title: "Roles & Permissions", text: "Staff users with permission-based navigation." },
        { title: "Force Update", text: "Set minimum and latest app versions for the Customer and Partner apps." },
        { title: "System Health", text: "Integration status, counts and backups from one screen." },
      ],
    },
    {
      title: "Seller Panel",
      subtitle: "A dedicated panel and app section for every store, scoped to its own data by security rules.",
      items: [
        { title: "Orders & Self-Pickup", text: "Accept, pack and hand over orders, or serve pickups with secure codes." },
        { title: "POS with Barcode", text: "Bill walk-in customers by cash, card or UPI, with barcode scanning and receipts." },
        { title: "Products & Stock", text: "Add products with photos, variants, price, MRP and AI descriptions; restock in a tap." },
        { title: "Own Riders, Coupons & Reports", text: "Run your own delivery fleet or request a Go4Market rider, create store coupons and view sales reports." },
      ],
    },
  ],

  problems: [
    {
      problem: "Separate apps for groceries, food and medicines",
      solution: "Four modules in one app with one cart, one wallet and one admin panel.",
    },
    {
      problem: "Servers, databases and cron jobs to babysit",
      solution: "Serverless Firebase backend that scales automatically.",
    },
    {
      problem: "Riders' location and delivery proof are unclear",
      solution: "Live rider tracking on OpenStreetMap and an OTP-verified hand-over.",
    },
    {
      problem: "Sellers juggle a till and an online store",
      solution: "Built-in POS with barcode scanning, sharing stock with online orders.",
    },
    {
      problem: "Commissions, COD cash and payouts in spreadsheets",
      solution: "Automatic settlements, cash collection, withdrawals, fund transfers and salaries.",
    },
    {
      problem: "Writing product content for every listing",
      solution: "One-click product descriptions with Google Gemini AI.",
    },
  ],

  ecosystem: [
    { title: "Admin, Seller & Delivery Panels (Flutter Web)", text: "Catalogue, orders, sellers, riders, finance, marketing and settings" },
    { title: "Serverless Backend (Firebase)", text: "Cloud Functions, Firestore security rules, Authentication, Storage" },
    { title: "Customer Website (Flutter Web)", text: "Browse four modules, order, pay and track from any browser" },
    { title: "Customer App (Flutter)", text: "Shop, pay, track live and manage the wallet" },
    { title: "Partner App (Flutter)", text: "Sellers run their store and POS; riders accept and deliver with OTP" },
    { title: "Real-Time Services", text: "Live tracking • App & web push • Live dashboards • Email & SMS" },
  ],

  requirements: [
    { title: "Built In:", text: "Flutter, Flutter Web, Firebase (Cloud Functions in TypeScript, Firestore)" },
    { title: "Server Required:", text: "No VPS needed — Firebase Blaze plan (pay as you go) with Firebase Hosting" },
    {
      title: "Third-Party Accounts Required:",
      text: "Firebase / Google Cloud, Google Play Console, payment gateway (Razorpay, Stripe or PayPal), SMTP mail service; optional SMS gateway (Twilio, MSG91 or Fast2SMS) and Gemini API key. Maps use OpenStreetMap — no Google Maps key needed.",
    },
  ],

  youGet: [
    "Flutter Customer App",
    "Flutter Partner App (Seller + Delivery)",
    "Flutter Web Customer Website",
    "Flutter Web Admin, Seller & Delivery Panels",
    "Firebase Backend: Cloud Functions, Rules & Indexes",
    "Seed Script with Demo Data",
    "Complete Online Documentation",
    "Lifetime Product Updates",
  ],

  revenue: [
    { title: "Seller Commission", text: "Earn a commission per seller on every delivered order, settled automatically." },
    { title: "Delivery & Quick Fees", text: "Base and per-km delivery fees plus a quick-delivery fee for 15 and 30-minute orders." },
    { title: "Membership Plans", text: "Sell plans with free delivery and extra discounts for loyal customers." },
    { title: "Featured Placements", text: "Sell home sliders, offer banners, popups and featured sections per module." },
    { title: "Wallet & Subscriptions", text: "Keep money in your ecosystem with wallet balances and recurring product subscriptions." },
    { title: "Promotions & Referrals", text: "Coupons, offers and Refer & Earn campaigns that drive repeat orders." },
  ],

  faqs: [
    {
      q: "What do I get when I buy Go4Market?",
      a: "The complete source code of the Customer App, Partner App, Flutter Web website, Admin/Seller/Delivery panels and the Firebase backend, plus a demo-data seed script, online documentation and lifetime updates.",
    },
    {
      q: "Do I need a VPS or hosting server?",
      a: "No. Go4Market runs on Google Firebase (Blaze pay-as-you-go plan). The website and the three panels are deployed to Firebase Hosting.",
    },
    {
      q: "Is the website built with Next.js?",
      a: "No. The customer website and the Admin, Seller and Delivery panels are all built with Flutter Web, so the apps and the web share one language (Dart) and one shared core package.",
    },
    {
      q: "Which payment gateways are supported?",
      a: "Razorpay, Stripe and PayPal, plus the Go4Market wallet (with partial payment) and cash on delivery. Every online payment is verified on the server.",
    },
    {
      q: "How do sellers and delivery partners work?",
      a: "Both use the same Partner App and choose their role at sign-up. Sellers manage orders, products, POS and earnings; delivery partners go online, accept orders and deliver with the customer's OTP.",
    },
    {
      q: "Is Google Maps required?",
      a: "No. Maps, address pins and live tracking use OpenStreetMap, so there is no Google Maps API key or bill. Riders can still open navigation in Google Maps.",
    },
    {
      q: "Which languages are supported?",
      a: "The website and the Admin, Seller and Delivery panels support English, Hindi, Gujarati and Arabic with a right-to-left layout. The mobile apps ship in English and Hindi. Languages are managed from the Admin Panel.",
    },
  ],
};
