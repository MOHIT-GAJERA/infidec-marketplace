/**
 * Go4Foodie — All-in-One Restaurant POS, QR Table Ordering & Online Food Ordering platform (Firebase backend).
 * Product card data + product-page content. Documentation: /docs/go4foodie
 */
import type { Product } from "./products";
import type { ProductContent } from "./product-content";

export const GO4FOODIE_SLUG = "go4foodie-restaurant-pos-qr-online-ordering-platform";

export const go4foodieProduct: Product = {
  slug: GO4FOODIE_SLUG,
  name: "Go4Foodie",
  title:
    "Go4Foodie - All-in-One Restaurant POS, QR Table Ordering & Online Food Ordering Platform on Firebase",
  type: "app",
  category: "ecommerce-marketplace",
  featured: true,
  isNew: true,
  price: 1799,
  oldPrice: 8299,
  rating: 4.8,
  sales: 986,
  theme: { from: "#0B5E46", to: "#E8640F", ink: "light" },
  icon: "chef",
  tagline: "All-in-One Restaurant POS, QR Ordering & Online Food Ordering",
  chips: [
    "Customer App",
    "Restaurant App",
    "Owner App",
    "Website",
    "Admin Panel",
    "QR Table Ordering",
  ],
  summary:
    "Run dine-in, QR table ordering, take-away and reservations from one platform — a live floor plan and table POS, a Next.js ordering website, a Flutter app with Customer, Restaurant and Owner modes, and a Flutter Web admin panel on a serverless Firebase backend.",
  version: "1.0.0",
  releaseDate: "22-10-2026",
  lastUpdate: "22-10-2026",
  platform: "Flutter 3.x",
  techStack: ["Flutter", "Next.js", "Firebase", "Cloud Functions", "Cloud Firestore"],
  integrations: [
    "Razorpay",
    "Stripe",
    "PayPal",
    "SMTP Email",
    "Firebase Authentication",
    "Cloud Storage",
    "QR Codes",
  ],
  image: "/images/go4foodie-banner-923x470.webp",
  bannerArt: true,
};

const IMG = "/docs/go4foodie/images";
/** Premium product-page image (public/images/go4foodie, 1848 px wide). */
const sc = (name: string, height: number, alt: string) => ({ src: `/images/go4foodie/${name}.webp`, alt, width: 1848, height });

export const go4foodieContent: ProductContent = {
  docsUrl: "/docs/go4foodie",
  changelogUrl: "/docs/go4foodie/docs/changelog",

  overview: [
    "Go4Foodie is an all-in-one restaurant platform for dine-in, QR table ordering, take-away and reservations. Guests order on the website or by scanning the QR code on their table, staff run the floor and the bill from a live POS, and owners follow revenue, tables and team from anywhere — all on one menu, one set of tables and one order history.",
    "The package includes a Next.js customer website, a Flutter Web Admin Panel, and one Flutter mobile app (Android & iOS) with three modes chosen on the first screen: Customer App, Restaurant App for waiters and cashiers, and Owner App. Everything runs on Google Firebase — one Cloud Function API, Cloud Firestore, Authentication, Storage, Hosting and App Hosting — so there is no VPS, PHP, MySQL or cron job to maintain.",
    "Open a table, send items to the kitchen with a printed KOT, void, add discount, tax, service and tip, split the payment across cash, card and UPI, merge tables and close the bill — the floor updates live for everyone. Online payments with Razorpay, Stripe or PayPal, gift cards and coupons, branded e-mails, inventory alerts, table analytics, reports and an audit log are built in.",
  ],

  demos: [
    { label: "Customer", sub: "Android Demo" },
    { label: "Restaurant (POS)", sub: "Android Demo" },
    { label: "Owner", sub: "Android Demo" },
    { label: "All modes", sub: "iOS (on request)" },
  ],
  demoLinks: [
    { label: "Website Demo", href: "https://go4foodies-web--go4foodies.asia-southeast1.hosted.app/" },
    { label: "Admin Panel Demo", href: "https://go4foodies-admin.web.app/" },
  ],
  demoNote:
    "Browse the live website demo and open the Admin Panel demo above — the demo login is shown on the admin login screen. The Android demo app (Customer, Restaurant and Owner modes) is shared on request. You can also run the whole platform on your own computer with the sample data import — see Demo Instructions in the documentation.",
  credentials: [],

  showcase: [
    {
      id: "platform",
      label: "Platform",
      title: "Dine-in, QR ordering & online orders — one platform",
      intro: "One menu, one set of tables and one admin panel power the dining room, QR table ordering and online take-away.",
      images: [
        sc("01-platform", 1130, "Go4Foodie runs dine-in POS, QR table ordering and online take-away on one platform"),
        sc("02-ecosystem", 1260, "Go4Foodie ecosystem: customer website, Admin Panel and the mobile app with Customer, Restaurant and Owner modes"),
      ],
    },
    {
      id: "tech-stack",
      label: "Tech Stack & Workflow",
      title: "Serverless tech stack and a realtime service workflow",
      intro: "Flutter and Next.js on a Firebase backend — and how a table goes from first order to Close & Pay.",
      images: [
        sc("03-tech-stack", 1800, "Go4Foodie tech stack: Flutter, Next.js 16, Firebase Cloud Functions, Firestore, Authentication, Storage, Hosting, App Hosting, Razorpay, Stripe, PayPal and SMTP"),
        sc("04-workflow", 1490, "Go4Foodie service workflow: order online or scan the table QR, kitchen KOT, serve, split the bill, Close & Pay, table cleaning"),
      ],
    },
    {
      id: "website",
      label: "Website & QR Ordering",
      title: "Online ordering, QR tables & reservations",
      intro: "A premium ordering website for take-away, table QR ordering, bookings and gift cards — with secure online payments.",
      images: [
        sc("05-website", 1330, "Go4Foodie online ordering website with menu, cart and scheduled pickup"),
        sc("06-qr-ordering", 1280, "Scan the table QR code, order from the menu and send it straight to the kitchen"),
        sc("07-reservations", 1340, "Table bookings and private events with live slot availability"),
        sc("08-payments", 1200, "Razorpay, Stripe and PayPal checkout, or pay at the restaurant"),
      ],
    },
    {
      id: "mobile-app",
      label: "Mobile App",
      title: "One app, three modes",
      intro: "Customers, waiters and owners use the same Flutter app — each mode signs in with its own role.",
      images: [
        sc("09-customer-app", 1020, "Go4Foodie Customer App: order, book a table, pay and track orders"),
        sc("10-restaurant-app", 1020, "Go4Foodie Restaurant App: live floor, table bill, add items, split payments and close tables"),
        sc("11-owner-app", 1020, "Go4Foodie Owner App: dashboard, live floor, reports and full management"),
      ],
    },
    {
      id: "admin-panel",
      label: "Admin Panel",
      title: "Admin Panel — floor, POS and the whole business",
      intro: "A realtime, role-based panel for the dining room and the back office, in light and dark mode.",
      images: [
        sc("12-dashboard", 1360, "Go4Foodie admin dashboard with KPIs, outlet cost vs revenue, top categories and POS activities"),
        sc("13-floor", 1320, "Live floor plan with table states, open sessions and running bills updating in real time"),
        sc("14-pos", 1330, "Table POS: KOT printing, void, discount, tax, service, tip, split payments, merge tables and invoice"),
        sc("15-menu", 1380, "Menu and category availability, image upload and inventory with low-stock alerts"),
        sc("16-analytics", 1360, "Table analytics: busy hours, occupancy, rankings and session history with CSV, Excel and PDF export"),
        sc("17-reports", 1360, "Reports and transactions across orders, gift cards and table payments"),
        sc("18-team", 1420, "Staff duty status, roles and permissions for Owner, Manager and Staff, and the audit log"),
        sc("19-guests", 1420, "Customers with lifetime spend, gift cards and coupons, and branded e-mails"),
      ],
    },
    {
      id: "scale",
      label: "Requirements",
      title: "What you need to launch — and what you get",
      images: [
        sc("20-requirements", 1220, "Requirements: Firebase Blaze plan, Flutter SDK, Node.js 22, Google Play Console, optional payment gateway and SMTP"),
        sc("21-what-you-get", 1100, "Everything included: website, Admin Panel, mobile app with three modes, Firebase backend, data migration tool, documentation and updates"),
      ],
    },
  ],

  screens: [
    { src: `${IMG}/app-customer-home.webp`, alt: "Customer home" },
    { src: `${IMG}/app-customer-menu.webp`, alt: "Menu" },
    { src: `${IMG}/app-customer-cart.webp`, alt: "Checkout & payment options" },
    { src: `${IMG}/app-customer-booking.webp`, alt: "Book a table" },
    { src: `${IMG}/app-restaurant-floor.webp`, alt: "Restaurant App — live floor" },
    { src: `${IMG}/app-restaurant-picker.webp`, alt: "Add items to a table" },
    { src: `${IMG}/app-restaurant-payment.webp`, alt: "Split / part payment" },
    { src: `${IMG}/app-owner-dashboard.webp`, alt: "Owner dashboard" },
    { src: `${IMG}/web-home.jpg`, alt: "Customer website", wide: true },
    { src: `${IMG}/admin-dashboard.jpg`, alt: "Admin dashboard", wide: true },
    { src: `${IMG}/admin-floor-table.jpg`, alt: "Live floor plan", wide: true },
    { src: `${IMG}/admin-pos.jpg`, alt: "Table POS", wide: true },
  ],

  why: [
    {
      title: "Dining Room + Online, One Platform",
      text: "Dine-in POS, QR table ordering, take-away and reservations share one menu, one set of tables and one order history.",
    },
    {
      title: "Live Floor for Everyone",
      text: "Table states, open sessions and running bills update in real time on the admin panel and the Restaurant App.",
    },
    {
      title: "No Server to Maintain",
      text: "Built on Firebase: one Cloud Function API, Firestore, Authentication, Hosting and App Hosting scale automatically. No VPS, PHP, MySQL or cron jobs.",
    },
    {
      title: "Three Apps in One",
      text: "One Flutter app with Customer, Restaurant (POS) and Owner modes — one codebase to brand and publish.",
    },
    {
      title: "Secure by Design",
      text: "Prices, payments and totals are calculated on the server; every payment is verified with the gateway; role-based permissions and an audit log for every table action.",
    },
    {
      title: "Bring Your Existing Data",
      text: "A migration tool imports an existing MySQL restaurant database — menu, tables, orders, customers, staff and logins — into Firestore.",
    },
  ],

  features: [
    {
      title: "Customer Website & App",
      subtitle: "Next.js website and the Customer mode of the Flutter app share the same menu, orders and bookings.",
      items: [
        { title: "Online Take-Away", text: "Order for pickup now or schedule a later slot with lead time and cut-off." },
        { title: "QR Table Ordering", text: "Guests scan the table QR, order from the menu and the table session opens automatically." },
        { title: "Table Bookings & Events", text: "Live slot availability for table bookings and enquiries for private events." },
        { title: "Gift Cards & Coupons", text: "Buy gift cards and coupons online; codes are e-mailed instantly." },
        { title: "Online Payments", text: "Razorpay, Stripe and PayPal with a provider chooser, or pay at the restaurant." },
        { title: "Order & Booking History", text: "Customers follow their orders and bookings and manage their profile in the app." },
      ],
    },
    {
      title: "Restaurant App (POS)",
      subtitle: "The staff mode of the mobile app for waiters, cashiers and managers.",
      items: [
        { title: "Live Floor", text: "Every table with its state, guests, waiter and running bill." },
        { title: "Table Bill & KOT", text: "Add items, send a kitchen order ticket and void items." },
        { title: "Split & Part Payments", text: "Take cash, card, UPI or wallet payments in parts and close the table." },
        { title: "Kitchen & Service Board", text: "Move orders from pending to preparing, ready and completed." },
        { title: "Reservations & Menu", text: "Confirm bookings and switch dishes on or off during service." },
        { title: "Duty Status", text: "Staff set their own duty status; managers see the team at a glance." },
      ],
    },
    {
      title: "Admin Panel",
      subtitle: "Flutter Web control centre — realtime, role-based, light & dark mode.",
      items: [
        { title: "Live Dashboard", text: "KPIs, outlet cost vs revenue, top categories, employee status, POS activities and a featured dish." },
        { title: "Floor Plan & POS", text: "Open and close tables, set states, KOT and invoice printing, discount, tax, service, tip, split payments and merge tables." },
        { title: "Orders & Reservations", text: "Status steppers for online, QR and POS orders and for bookings, with completion e-mails." },
        { title: "Menu & Tables", text: "Dishes, categories and availability with image upload; tables with downloadable and printable QR codes." },
        { title: "Staff, Customers & Gift Cards", text: "Team directory and duty status, customer history and lifetime spend, gift cards and coupons." },
        { title: "Inventory", text: "Stock levels, quick adjustments and low-stock alerts." },
        { title: "Analytics & Reports", text: "Table analytics with busy hours and occupancy, reports and a unified transactions feed with exports." },
        { title: "Notifications & Audit Log", text: "New orders, booking requests, low stock and table alerts; every POS and table action logged with who and when." },
        { title: "Roles & Permissions", text: "Owner, Manager and Staff with 13 permissions; settings are owner-only." },
      ],
    },
    {
      title: "Owner App",
      subtitle: "The owner mode of the mobile app — the business in your pocket.",
      items: [
        { title: "Dashboard & POS Summary", text: "Orders, revenue, bills, peak hour and payment mix." },
        { title: "Live Floor & Reports", text: "Watch the floor live and open sales, table and transaction reports." },
        { title: "Full Management", text: "Orders, reservations, menu, inventory, staff, customers, gift cards and tables." },
        { title: "Settings", text: "Restaurant profile and account settings from the phone." },
      ],
    },
  ],

  problems: [
    { problem: "Separate tools for the dining room, online orders and bookings", solution: "POS, QR ordering, take-away and reservations on one platform." },
    { problem: "Servers, databases and cron jobs to babysit", solution: "Serverless Firebase backend that scales automatically." },
    { problem: "Nobody knows which table is free or still waiting to pay", solution: "A live floor plan shared by the admin panel and the staff app." },
    { problem: "Split bills and mixed payments done on paper", solution: "Part payments by method, automatic remaining amount and Close & Pay." },
    { problem: "Guests wait to order", solution: "Table QR codes let guests order straight to the kitchen." },
    { problem: "No record of who changed what", solution: "An audit log of every POS and table action with user and time." },
  ],

  ecosystem: [
    { title: "Admin Panel (Flutter Web)", text: "Floor, POS, orders, reservations, menu, staff, analytics and settings" },
    { title: "Serverless Backend (Firebase)", text: "Cloud Function API, Firestore, Authentication, Storage, Hosting" },
    { title: "Customer Website (Next.js)", text: "Order online, scan the table QR, book a table and buy gift cards" },
    { title: "Customer App (Flutter)", text: "Order, pay, book and track from Android and iOS" },
    { title: "Restaurant & Owner Apps (Flutter)", text: "Live floor, table billing, kitchen board, reports and management" },
    { title: "Real-Time Services", text: "Live floor • Notifications • Branded e-mails • Live dashboards" },
  ],

  requirements: [
    { title: "Built In:", text: "Flutter, Next.js, Firebase (Cloud Functions, Firestore)" },
    { title: "Server Required:", text: "No VPS needed — Firebase Blaze plan (pay as you go) with Hosting and App Hosting" },
    {
      title: "Third-Party Accounts Required:",
      text: "Firebase / Google Cloud, Google Play Console (Apple Developer for iOS), SMTP mail service; optional Razorpay, Stripe or PayPal account for online payments.",
    },
  ],

  youGet: [
    "Next.js Customer Website",
    "Flutter Web Admin Panel",
    "Flutter Mobile App — Customer, Restaurant & Owner modes",
    "Firebase Backend: Cloud Function API, Rules & Hosting Config",
    "MySQL → Firestore Data Migration Tool",
    "Complete Online Documentation",
    "Lifetime Product Updates",
  ],

  revenue: [
    { title: "Faster Table Turns", text: "QR ordering and a live floor plan seat more guests per evening." },
    { title: "Online Take-Away", text: "Take orders for pickup now or later, paid online before they reach the kitchen." },
    { title: "Gift Cards & Coupons", text: "Sell gift cards and coupons online and redeem them at the table." },
    { title: "Private Events", text: "Capture private-event and corporate booking enquiries from the website." },
    { title: "Service Charge & Tips", text: "Add service charge and tips to every table bill." },
    { title: "Data-Driven Menu", text: "Top items, category mix and busy hours show what to promote and when to staff up." },
  ],

  faqs: [
    {
      q: "What do I get when I buy Go4Foodie?",
      a: "The complete source code of the Next.js customer website, the Flutter Web Admin Panel, the Flutter mobile app (Customer, Restaurant and Owner modes) and the Firebase backend, plus the MySQL-to-Firestore migration tool, online documentation and lifetime updates.",
    },
    {
      q: "Do I need a VPS or hosting server?",
      a: "No. Go4Foodie runs on Google Firebase (Blaze pay-as-you-go plan): the API is a Cloud Function, the admin panel is on Firebase Hosting and the website on Firebase App Hosting.",
    },
    {
      q: "Can guests order from their table?",
      a: "Yes. Every table has a QR code (download or print it from the admin panel). Guests scan it, order from the menu and the order lands on that table's bill.",
    },
    {
      q: "Which payment gateways are supported?",
      a: "Razorpay, Stripe and PayPal online, plus pay at the restaurant. At the table, staff record cash, card, UPI and wallet payments — including split and part payments.",
    },
    {
      q: "Can I rebrand Go4Foodie with my own name, logo and colours?",
      a: "Yes. The documentation explains how to change the package name, app name, logo, splash, colours and texts. Our installation plans can do it for you.",
    },
    {
      q: "Can I move my existing restaurant data?",
      a: "Yes. The included migration tool imports a MySQL dump — menu, tables, orders, customers, reservations, staff and their logins — into Firestore, and can re-run for the final cut-over.",
    },
    {
      q: "Do you help publish the app to Google Play?",
      a: "Yes. The documentation covers the Play Console process, and our installation plans include publishing.",
    },
  ],
};
