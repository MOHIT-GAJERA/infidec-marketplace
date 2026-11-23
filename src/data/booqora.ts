/**
 * Booqora — Rental management, online booking & invoicing platform (Firebase backend).
 * Product card data + product-page content. Documentation: /docs/booqora
 */
import type { Product } from "./products";
import type { ProductContent } from "./product-content";

export const BOOQORA_SLUG = "booqora-rental-management-booking-platform";

export const booqoraProduct: Product = {
  slug: BOOQORA_SLUG,
  name: "Booqora",
  title: "Booqora - Rental Management, Online Booking & Invoicing Platform with Web, Android & iOS Apps",
  type: "app",
  category: "business-service",
  featured: true,
  isNew: true,
  price: 1799,
  oldPrice: 8299,
  theme: { from: "#1A0638", to: "#6431DD", ink: "light" },
  icon: "calendar",
  tagline: "Rental Management & Online Booking Platform",
  chips: ["Rental Platform", "Mobile App", "Online Store", "Website", "Payments", "Invoices"],
  summary:
    "Run any rental business — cameras, events, bikes, tools, outdoor gear or furniture — with live availability, orders, payments, quotes, contracts and invoices, a customer booking store and a Flutter app for Android and iOS, on a serverless Firebase backend.",
  version: "1.0.0",
  releaseDate: "20-11-2026",
  lastUpdate: "23-11-2026",
  platform: "Flutter 3.x",
  techStack: ["Flutter", "Flutter Web", "Next.js", "Firebase", "Cloud Functions", "Cloud Firestore"],
  integrations: [
    "Firebase Auth (Email & Password)",
    "Razorpay (Native & Web Checkout)",
    "Stripe",
    "PayPal",
    "SMTP Email",
    "Barcode Scanning (Camera)",
    "PDF Generation, Share & Print",
  ],
  image: "/images/booqora-banner-923x470.webp",
  bannerArt: true,
};

/** Premium product-page image (public/images/booqora, 1848 px wide). */
const sc = (name: string, height: number, alt: string) => ({ src: `/images/booqora/${name}.webp`, alt, width: 1848, height });

export const booqoraContent: ProductContent = {
  docsUrl: "/docs/booqora",
  changelogUrl: "/docs/booqora/docs/changelog",

  overview: [
    "Booqora is a complete rental management platform for businesses that rent things out: camera and AV houses, party and event rentals, bike and scooter hire, tool and equipment rental, outdoor gear and furniture. It connects bookings, inventory, payments, documents and an online booking store, so stock is never rented twice and every rupee is accounted for.",
    "The package includes a Flutter Web Rental Platform for the business team, a customer-facing Online Store (booking page) with rental dates, cart, checkout and online payment, a Flutter mobile app for Android and iOS with the same data, and a Next.js marketing website with SEO-ready feature, industry, pricing and guide pages. Everything runs on Google Firebase: Authentication, Cloud Firestore, Cloud Functions, Storage and Hosting. There is no PHP, MySQL or VPS to maintain.",
    "Availability is calculated from real stock and every reserved and started order — late returns keep holding stock and maintenance downtime is excluded. Payments with Razorpay, Stripe and PayPal are created and verified in Cloud Functions, where the secret keys stay. Orders produce branded quotes, contracts, invoices and packing slips, and the app adds native Razorpay checkout, barcode scanning and PDF sharing.",
  ],

  demos: [
    { label: "Rental Platform", sub: "Web Demo" },
    { label: "Online Store", sub: "Web Demo" },
    { label: "Mobile App", sub: "Android (on request)" },
    { label: "Mobile App", sub: "iOS (on request)" },
  ],
  demoLinks: [
    { label: "Website Demo", href: "https://booqora-infidec.web.app/" },
    { label: "Rental Platform Demo", href: "https://booqora-platform.web.app/login" },
  ],
  demoNote:
    "Browse the live marketing website and open the Rental Platform demo. Platform demo login details and the Android demo app are shared on request.",
  credentials: [],

  showcase: [
    {
      id: "platform",
      label: "Platform",
      title: "One platform for the whole rental business",
      intro: "Bookings, inventory, payments, documents and an online store — on the web and on your phone, always in sync.",
      images: [
        sc("01-platform", 1120, "Booqora rental platform dashboard on the web and the Booqora mobile app with orders, inventory, payments and online store"),
        sc("02-ecosystem", 1280, "Booqora ecosystem: Rental Platform, Online Store, Mobile App and Marketing Website on one serverless Firebase backend"),
      ],
    },
    {
      id: "tech-stack",
      label: "Tech Stack & Workflow",
      title: "Serverless tech stack and a clear rental workflow",
      intro: "Flutter for every screen your team uses, Next.js for marketing, Firebase behind it all — and how a booking travels from reservation to return.",
      images: [
        sc("03-tech-stack", 1800, "Booqora tech stack: Flutter, Flutter Web, Next.js, Tailwind CSS, Firebase Authentication, Firestore, Cloud Functions, Storage, Hosting, Razorpay, Stripe, PayPal, SMTP and GitHub Actions"),
        sc("04-workflow", 1580, "Booqora order workflow: customer books, reserved, picked up, returned, invoiced and paid, reported"),
      ],
    },
    {
      id: "operations",
      label: "Orders & Inventory",
      title: "Orders, inventory and calendar",
      intro: "Automatic rental pricing, exact availability for any period and a calendar of every pickup and return.",
      images: [
        sc("05-orders", 1360, "Booqora orders with automatic pricing, deposits, coupons, taxes, late and shortage alerts and documents from the order"),
        sc("06-inventory", 1360, "Booqora inventory with bulk and trackable stock, bundles, collections, maintenance downtime and late returns holding stock"),
        sc("07-calendar", 1200, "Booqora rental calendar with a timeline per product, agenda of pickups and returns and colour-coded status"),
      ],
    },
    {
      id: "online-store",
      label: "Online Store & Payments",
      title: "Online store, payments and documents",
      intro: "Customers book 24/7 on a branded booking page and pay online; every order turns into professional paperwork.",
      images: [
        sc("08-online-store", 1400, "Booqora online store booking page with rental dates, cart, brand colour, booking requests and online payment at checkout"),
        sc("09-payments", 1400, "Booqora payments: native Razorpay checkout in the app, Stripe and PayPal payment links and cash, bank and UPI records"),
        sc("10-documents", 1240, "Booqora quotes, contracts, invoices and packing slips as branded PDFs on the web and in the app"),
      ],
    },
    {
      id: "mobile-app",
      label: "Mobile App",
      title: "Your rental counter, in your pocket",
      intro: "A Flutter app for Android and iOS with orders, inventory, calendar, payments, barcode scanning and PDF invoices.",
      images: [sc("11-mobile-app", 1280, "Booqora mobile app screens: home dashboard, orders, inventory, barcode scan result and more")],
    },
    {
      id: "admin",
      label: "Reports & Settings",
      title: "Reports, settings, integrations and website",
      intro: "Decide with real numbers, configure Booqora around your business and market it with an SEO-ready website.",
      images: [
        sc("12-reports", 1200, "Booqora reports: company performance, product ROI, availability, customers, coupons and activity log"),
        sc("13-settings", 1400, "Booqora settings for rental, pricing, taxes, emails, payments and team, plus an integration catalogue and the Bora assistant"),
        sc("14-website", 1240, "Booqora Next.js marketing website with features, industries, pricing and guides, SEO metadata and sitemap"),
      ],
    },
    {
      id: "scale",
      label: "Requirements",
      title: "What you need — and what you get",
      images: [
        sc("15-requirements", 1280, "Requirements: Firebase Blaze plan, Flutter SDK, Node.js 22 and Firebase CLI, payment gateway, SMTP mailbox, Google Play Console, optional Apple Developer account and domain"),
        sc("16-what-you-get", 1200, "Everything included: rental platform, online store, mobile app, marketing website, Cloud Functions, security rules, Play Store kit, documentation and updates"),
      ],
    },
  ],

  why: [
    { title: "Built for Rentals", text: "Pickup and return times, deposits, late returns, shortages and maintenance are first-class — not retail workarounds." },
    { title: "No Double Bookings", text: "Availability is calculated per period from real stock and every reserved and started order." },
    { title: "No Server to Maintain", text: "Firebase Authentication, Firestore, Cloud Functions, Storage and Hosting scale automatically. No VPS, PHP or MySQL." },
    { title: "Web + Mobile in Sync", text: "The Flutter Web platform and the Android/iOS app share one workspace and update in real time." },
    { title: "Secure Payments", text: "Razorpay, Stripe and PayPal payments are created and verified in Cloud Functions; secret keys never reach the browser or app." },
    { title: "Sell From Day One", text: "A customer booking store, a marketing website and a Play Store listing kit are included." },
  ],

  features: [
    {
      title: "Rental Platform (Flutter Web)",
      subtitle: "The control centre for your team: every module of the rental business in one workspace.",
      items: [
        { title: "Dashboard", text: "Revenue, orders, active rentals, outstanding balances, today's pickups and returns and top products." },
        { title: "Orders", text: "Draft, reserved, started, returned and archived orders with automatic pricing, deposits, coupons and taxes." },
        { title: "Rental Calendar", text: "Timeline per product, agenda view and colour-coded reserved, started, late and downtime blocks." },
        { title: "Inventory", text: "Rental, sale and service products, bulk or trackable stock items, bundles, collections and downtime." },
        { title: "Pricing Structures", text: "Hourly, daily and weekly rates, tiered pricing and flat fees assigned per product." },
        { title: "Customers", text: "Customer profiles with order history, balances, custom fields and marketing opt-in." },
        { title: "Documents", text: "Quotes, contracts, invoices and packing slips with numbering, payment status and PDFs." },
        { title: "Coupons", text: "Percentage or fixed discount codes with a live preview and redemption reports." },
        { title: "Reports", text: "Company and product performance, availability, fulfilment, customers, coupons and activity logs." },
        { title: "Settings", text: "General, rental, pricing, taxes, locations, custom fields, documents, emails, payments, team, translations and security." },
        { title: "Integration Catalogue", text: "An in-app catalogue of 16 apps (Google Analytics, Meta Pixel, Mailchimp, QuickBooks, Slack, Zapier and more) that stores each app's configuration, ready for you to wire up." },
        { title: "Bora Assistant", text: "Ask quick questions about orders, revenue, stock or setup and jump to the right screen." },
      ],
    },
    {
      title: "Online Store",
      subtitle: "A branded customer booking page for every workspace at /s/your-store.",
      items: [
        { title: "Rental Dates & Cart", text: "Customers choose pickup and return times, browse products and add them to a cart." },
        { title: "Checkout & Terms", text: "Contact details, optional terms acceptance and an automatic confirmation email." },
        { title: "Pickup or Delivery", text: "Set the default fulfilment method for online bookings." },
        { title: "Online Payments", text: "Pay at checkout with Razorpay, Stripe or PayPal, verified on the server." },
        { title: "Your Branding", text: "Store name, logo and brand colour, plus show-prices and add-to-cart preferences." },
        { title: "Requests Become Orders", text: "Bookings land in the platform as draft orders with the customer and items filled in — reserve them to hold stock." },
      ],
    },
    {
      title: "Mobile App (Android & iOS)",
      subtitle: "The same workspace on your phone, built with Flutter.",
      items: [
        { title: "Animated Onboarding", text: "Splash, onboarding illustrations and an intro screen before sign-in." },
        { title: "Orders & Quick Create", text: "Create orders, customers and products from the centre + button." },
        { title: "Native Razorpay Checkout", text: "Collect UPI, card and netbanking payments at the counter." },
        { title: "Stripe & PayPal Links", text: "Create a payment link and open it in a secure in-app browser." },
        { title: "Barcode Scanning", text: "Find products with the camera or by typing the code." },
        { title: "PDF Share & Print", text: "Generate invoices and share or print them from the phone." },
      ],
    },
    {
      title: "Marketing Website (Next.js)",
      subtitle: "An SEO-ready static website that sends visitors to sign up on the platform.",
      items: [
        { title: "31 Pages", text: "Home, features, industries, pricing, integrations, mobile app, about, contact and guides." },
        { title: "SEO Built In", text: "Per-page metadata, canonical URLs, JSON-LD, sitemap.xml and robots.txt." },
        { title: "Content in Code", text: "Features, industries, plans, integrations and blog posts edited in simple TypeScript files." },
        { title: "Firebase Hosting", text: "Static export deployed with one command." },
      ],
    },
  ],

  problems: [
    { problem: "Bookings in spreadsheets, diaries and chat threads", solution: "One workspace for orders, calendar and customers on web and mobile." },
    { problem: "The same item rented twice", solution: "Availability per period, with late returns and downtime taken into account." },
    { problem: "Deposits and balances mixed up", solution: "Deposits tracked separately from payments; paid and due update automatically." },
    { problem: "Invoices typed by hand", solution: "Quotes, contracts, invoices and packing slips generated from the order as PDFs." },
    { problem: "Customers can only book by phone", solution: "A branded online store where customers request bookings and pay online." },
    { problem: "Servers and databases to maintain", solution: "A serverless Firebase backend that scales automatically." },
  ],

  ecosystem: [
    { title: "Rental Platform (Flutter Web)", text: "Orders, calendar, inventory, customers, documents, reports and settings" },
    { title: "Online Store (Flutter Web)", text: "Customer booking page with cart, checkout and payments" },
    { title: "Mobile App (Flutter)", text: "Android & iOS with Razorpay checkout, barcode scanning and PDFs" },
    { title: "Marketing Website (Next.js)", text: "SEO-ready pages with login and free-trial links to the platform" },
    { title: "Serverless Backend (Firebase)", text: "Auth, Firestore rules, Cloud Functions for payments and email, Storage" },
    { title: "Real-Time Sync", text: "Changes appear instantly across web and mobile" },
  ],

  requirements: [
    { title: "Built In:", text: "Flutter, Flutter Web, Next.js, Firebase (Cloud Functions on Node 22, Cloud Firestore)" },
    { title: "Server Required:", text: "No VPS needed — Firebase Blaze plan (pay as you go) with Firebase Hosting" },
    {
      title: "Third-Party Accounts Required:",
      text: "Firebase / Google Cloud, Google Play Console (and Apple Developer for iOS), a payment gateway (Razorpay, Stripe or PayPal) and an SMTP mailbox for emails.",
    },
  ],

  youGet: [
    "Flutter Web Rental Platform",
    "Customer Online Store (booking page)",
    "Flutter Mobile App (Android & iOS)",
    "Next.js Marketing Website",
    "Firebase Backend: Cloud Functions, Rules & Indexes",
    "GitHub Actions Auto-Deploy Workflow",
    "Play Store Listing Kit & Screenshots",
    "Complete Online Documentation",
    "Lifetime Product Updates",
  ],

  revenue: [
    { title: "Offer It as SaaS", text: "Multi-workspace by design, with Starter, Pro and Business plan tiers as a starting point for selling Booqora to other rental businesses." },
    { title: "Run Your Own Rentals", text: "Use Booqora to run your own rental business with online bookings from day one." },
    { title: "Online Payments", text: "Take payments and deposits upfront with Razorpay, Stripe or PayPal." },
    { title: "Fees & Services", text: "Add flat fees, sales items and services to rental orders." },
    { title: "Coupons & Repeat Business", text: "Discount codes and customer history bring renters back." },
    { title: "Setup & Customisation", text: "Offer branded setups, custom domains and integrations to clients." },
  ],

  faqs: [
    {
      q: "What do I get when I buy Booqora?",
      a: "The complete source code of the Flutter Web Rental Platform (including the customer Online Store), the Flutter mobile app for Android and iOS, the Next.js marketing website and the Firebase backend (Cloud Functions, Firestore and Storage rules), plus a GitHub Actions workflow, a Play Store listing kit, online documentation and lifetime updates.",
    },
    {
      q: "Do I need a VPS or hosting server?",
      a: "No. Booqora runs on Google Firebase (Blaze pay-as-you-go plan). The platform and the marketing website are deployed to Firebase Hosting, and payments and email run in Cloud Functions.",
    },
    {
      q: "Which payment gateways are supported?",
      a: "Razorpay (UPI, cards, netbanking and wallets, with native checkout in the app), Stripe and PayPal, plus recorded cash, bank and UPI payments. Payments are created and verified in Cloud Functions. PayPal processes USD, so Razorpay is recommended for INR stores.",
    },
    {
      q: "Can my customers book online?",
      a: "Yes. Every workspace has an Online Store booking page where customers choose rental dates, add items to a cart and pay online. Each booking arrives in the platform as a draft order that your team reserves, which is when availability is checked.",
    },
    {
      q: "Does it prevent double bookings?",
      a: "Yes. Availability is calculated for the exact rental period from your stock and every reserved and started order. Late returns keep holding stock and maintenance downtime is excluded.",
    },
    {
      q: "Is the mobile app included for both Android and iOS?",
      a: "Yes. The Flutter app builds for Android and iOS. Publishing to the App Store needs a Mac and an Apple Developer account.",
    },
    {
      q: "Which types of rental business is it for?",
      a: "Any business that rents items by the hour, day, week or longer: cameras and AV, party and event equipment, bikes and scooters, tools, sports and outdoor gear, furniture and decor.",
    },
  ],
};
