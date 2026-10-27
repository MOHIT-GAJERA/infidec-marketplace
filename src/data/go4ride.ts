/**
 * Go4Ride — Taxi, Intercity, Rental & Parcel booking platform (Firebase backend).
 * Product card data + product-page content. Documentation: /docs/go4ride
 */
import type { Product } from "./products";
import type { ProductContent } from "./product-content";

export const GO4RIDE_SLUG = "go4ride-taxi-booking-ride-hailing-platform";

export const go4rideProduct: Product = {
  slug: GO4RIDE_SLUG,
  name: "Go4Ride",
  title: "Go4Ride - Taxi Booking, Ride Hailing, Intercity, Rental & Parcel Platform with Driver App and Admin Panel on Firebase",
  type: "app",
  category: "business-service",
  featured: true,
  isNew: true,
  price: 1799,
  oldPrice: 8299,
  rating: 4.8,
  sales: 742,
  theme: { from: "#0B0B0B", to: "#F5A800", ink: "light" },
  icon: "taxi",
  tagline: "Taxi, Intercity, Rental & Parcel Booking — Customer App, Driver App & Admin Panel",
  chips: ["Customer App", "Driver App", "Admin Panel", "Live Tracking", "Driver KYC", "Online Payments"],
  summary:
    "Launch your own ride-hailing business: a Flutter Customer App for cab, intercity, rental and parcel bookings, a Flutter Driver App with KYC, live location, OTP-verified trips and earnings, and a premium Flutter Web Admin Panel — all on a serverless Firebase backend with Razorpay, Stripe, PayPal, cash and wallet payments.",
  version: "1.0.0",
  releaseDate: "24-10-2026",
  lastUpdate: "24-10-2026",
  platform: "Flutter 3.x",
  techStack: ["Flutter", "Firebase", "Cloud Functions", "Cloud Firestore", "Realtime Database"],
  integrations: [
    "Google Maps Platform",
    "Razorpay",
    "Stripe",
    "PayPal",
    "Firebase Cloud Messaging",
    "Firebase Authentication (Phone OTP)",
    "Cloud Storage",
  ],
  image: "/images/go4ride-banner-923x470.webp",
  bannerArt: true,
};

const IMG = "/docs/go4ride/images";
/** Premium product-page image (public/images/go4ride, 1848 px wide). */
const sc = (name: string, height: number, alt: string) => ({ src: `/images/go4ride/${name}.webp`, alt, width: 1848, height });

export const go4rideContent: ProductContent = {
  docsUrl: "/docs/go4ride",
  changelogUrl: "/docs/go4ride/docs/changelog",

  overview: [
    "Go4Ride is a complete ride-hailing platform for taxi operators, fleet owners and agencies. Riders book a city cab, an intercity seat or a private intercity trip, rent a car by the hour or send a parcel; nearby approved drivers get the request instantly, the rider follows the driver live on the map and the trip starts only after the rider's 4-digit OTP is verified.",
    "The package includes two Flutter mobile apps (Android & iOS) — the Customer App and the Driver App — and a premium black-and-white Flutter Web Admin Panel with light and dark mode. Everything runs on Google Firebase: Authentication with phone OTP, Cloud Firestore, the Realtime Database for live driver locations, Cloud Storage, Cloud Messaging and Cloud Functions. There is no VPS, PHP, MySQL or cron job to maintain.",
    "Money is handled on the server. Commission is booked once per completed trip, cash trips deduct the commission from the driver wallet, wallet and online trips credit the driver's share, late cancellations charge a fee to the rider and pay it to the driver, and every online payment through Razorpay, Stripe or PayPal is verified with the gateway before the trip is marked paid or the wallet is credited.",
  ],

  demos: [
    { label: "Customer App", sub: "Android Demo" },
    { label: "Driver App", sub: "Android Demo" },
    { label: "Admin Panel", sub: "Web Demo" },
    { label: "Both apps", sub: "iOS (on request)" },
  ],
  demoLinks: [],
  demoRequests: ["Admin Panel", "Android Apps"],
  demoNote:
    "The Admin Panel demo and the Android demo builds of the Customer and Driver apps are shared on request — contact us and we will send the links and demo logins. You can also run the whole platform on your own computer with the Firebase Emulator Suite; see Demo Instructions in the documentation.",
  credentials: [],

  showcase: [
    {
      id: "platform",
      label: "Platform",
      title: "Cab, intercity, rental & parcel — one platform",
      intro: "One backend, one admin panel and two apps run every kind of trip your business offers.",
      images: [
        sc("01-platform", 1320, "Go4Ride runs city cabs, intercity sharing and personal trips, hourly rentals and parcel delivery on one platform"),
        sc("02-ecosystem", 1260, "Go4Ride ecosystem: Customer App, Driver App and Admin Panel on one Firebase backend"),
      ],
    },
    {
      id: "tech-stack",
      label: "Tech Stack & Ride Flow",
      title: "Serverless tech stack and a verified ride flow",
      intro: "Flutter on Firebase — and how a trip goes from request to settlement.",
      images: [
        sc("03-tech-stack", 1440, "Go4Ride tech stack: Flutter, Firebase Authentication, Firestore, Realtime Database, Storage, Cloud Messaging, Cloud Functions, Google Maps, Razorpay, Stripe and PayPal"),
        sc("04-ride-flow", 1560, "Go4Ride ride flow: request, driver matching, accept, arriving, arrived with waiting timer, OTP, trip, completion and settlement"),
      ],
    },
    {
      id: "customer-app",
      label: "Customer App",
      title: "Book, track and pay in a few taps",
      intro: "Phone login, five services, live tracking with OTP and SOS, wallet and online payments.",
      images: [
        sc("05-customer-app", 1360, "Go4Ride Customer App: phone login, home with services and offers, booking, live ride with driver details and OTP"),
        sc("06-payments", 1460, "Pay by cash, Go4Ride Wallet or online with Razorpay, Stripe or PayPal — verified on the server"),
        sc("07-support-safety", 1360, "Cancel with reasons, SOS during the ride, help topics and support chat with photo attachments"),
      ],
    },
    {
      id: "driver-app",
      label: "Driver App",
      title: "Everything a driver needs to earn",
      intro: "Self-registration with KYC documents, online/offline, ride requests, OTP-verified trips, earnings and plans.",
      images: [
        sc("08-driver-onboarding", 1360, "Driver registration: vehicle details from the admin catalogue and KYC document upload with review and re-upload"),
        sc("09-driver-trips", 1360, "Driver trip flow: request card with countdown, accept, navigate to pickup, waiting timer, rider OTP and complete trip"),
        sc("10-driver-earnings", 1360, "Driver earnings, wallet, payout requests and subscription plans"),
      ],
    },
    {
      id: "admin-panel",
      label: "Admin Panel",
      title: "Admin Panel — run the whole fleet from one console",
      intro: "A realtime, role-based Flutter Web panel with a collapsible sidebar, global search and light & dark mode.",
      images: [
        sc("11-dashboard", 1560, "Go4Ride admin dashboard: revenue, completed and active rides, online drivers, customers, ride mix and fleet KYC"),
        sc("12-bookings", 1560, "Bookings for cab, intercity, rental and parcel with filters, status and payment, dispatch monitor and SOS alerts"),
        sc("13-drivers", 1560, "Drivers and KYC review with document approval or rejection, online drivers on a live map"),
        sc("14-catalogue", 1560, "Services, zones on a map, rental packages, vehicle types, brands and models, driver document types"),
        sc("15-growth", 1560, "Offers and coupons, home banners, onboarding slides, push notifications, email templates and badges"),
        sc("16-finance", 1560, "Driver subscription plans and history, payout requests and payment gateway settings"),
        sc("17-access-settings", 1560, "Employees, roles and permissions, support tickets and platform settings including maintenance mode"),
      ],
    },
    {
      id: "scale",
      label: "Requirements",
      title: "What you need to launch — and what you get",
      images: [
        sc("18-requirements", 1100, "Requirements: Firebase Blaze plan, Google Maps API key, Flutter SDK, Node.js 20, Google Play Console, optional Razorpay, Stripe or PayPal"),
        sc("19-what-you-get", 1300, "Everything included: Customer App, Driver App, Admin Panel, Firebase backend, security rules, tests, documentation and updates"),
      ],
    },
  ],

  screens: [
    { src: `${IMG}/app-customer-home.webp`, alt: "Customer home" },
    { src: `${IMG}/app-customer-ride.webp`, alt: "Live ride with OTP" },
    { src: `${IMG}/app-customer-pay-picker.webp`, alt: "Online payment options" },
    { src: `${IMG}/app-customer-wallet.webp`, alt: "Wallet" },
    { src: `${IMG}/app-driver-documents.webp`, alt: "Driver KYC documents" },
    { src: `${IMG}/app-driver-request.webp`, alt: "Ride request" },
    { src: `${IMG}/app-driver-otp.webp`, alt: "Rider OTP check" },
    { src: `${IMG}/app-driver-plans.webp`, alt: "Driver subscription plans" },
    { src: `${IMG}/admin-dashboard.jpg`, alt: "Admin dashboard", wide: true },
    { src: `${IMG}/admin-bookings.jpg`, alt: "Bookings", wide: true },
    { src: `${IMG}/admin-drivers.jpg`, alt: "Drivers & KYC", wide: true },
    { src: `${IMG}/admin-online-drivers.jpg`, alt: "Online drivers map", wide: true },
  ],

  why: [
    {
      title: "Five Services, One Platform",
      text: "City cab, intercity sharing, intercity personal, hourly rental and parcel delivery share one catalogue, one driver fleet and one admin panel.",
    },
    {
      title: "OTP-Verified Trips",
      text: "Every trip starts only after the driver enters the rider's 4-digit OTP, and both sides can raise an SOS alert during the ride.",
    },
    {
      title: "No Server to Maintain",
      text: "Built on Firebase: Firestore, Realtime Database, Storage, Cloud Messaging and Cloud Functions scale automatically. No VPS, PHP, MySQL or cron jobs.",
    },
    {
      title: "Driver KYC Built In",
      text: "Admin-managed document types, front/back photos with expiry dates, approve or reject with a reason, and re-upload — drivers can never approve themselves.",
    },
    {
      title: "Secure Money Handling",
      text: "Commission, wallets, cancellation fees and payment status are written only by Cloud Functions; online payments are verified with the gateway and settled exactly once.",
    },
    {
      title: "Premium Admin Panel",
      text: "A black-and-white Flutter Web console with a collapsible sidebar, global menu search, live counters, CSV export and light & dark mode.",
    },
  ],

  features: [
    {
      title: "Customer App",
      subtitle: "Flutter app for riders on Android and iOS.",
      items: [
        { title: "Phone OTP Login", text: "Sign in with a phone number and a one-time code; first-time riders add their name and e-mail." },
        { title: "Five Services", text: "Cab, Intercity Sharing, Intercity Personal, Rental and Parcel — enabled and ordered from the admin panel." },
        { title: "Vehicle Choice", text: "Bike, Auto, Mini, Sedan, SUV or your own types, each with its own base fare and per-km rate." },
        { title: "Live Tracking & OTP", text: "Driver name, rating, car and plate, live position on the map, trip progress and the 4-digit start OTP." },
        { title: "Cancel, SOS & Support", text: "Cancel with admin-managed reasons, raise an SOS with location, and chat with support with photo attachments." },
        { title: "Wallet & Payments", text: "Cash, Go4Ride Wallet top-up and online trip payments with Razorpay, Stripe or PayPal." },
      ],
    },
    {
      title: "Driver App",
      subtitle: "Flutter app for drivers on Android and iOS.",
      items: [
        { title: "Self-Registration", text: "Vehicle type, brand and model from the admin catalogue, plate, colour and year." },
        { title: "KYC Documents", text: "Upload front and back photos with expiry dates; see pending, approved or rejected status with the reason." },
        { title: "Go Online", text: "Online only when KYC is approved, location is allowed and the wallet holds the admin's minimum balance." },
        { title: "Ride Requests", text: "Request card with pickup, drop, fare and a countdown; accept or decline." },
        { title: "Trip Workflow", text: "Navigate to pickup, arrive with a free-waiting timer, verify the rider OTP, hold, complete, SOS and call." },
        { title: "Earnings & Plans", text: "Wallet, lifetime earnings, payout requests and subscription plans that waive commission." },
      ],
    },
    {
      title: "Admin Panel",
      subtitle: "Flutter Web control centre — realtime, role-based, light & dark mode.",
      items: [
        { title: "Live Dashboard", text: "Revenue, completed and active rides, online drivers, customers, ride mix and fleet KYC at a glance." },
        { title: "Bookings & Dispatch", text: "Cab, intercity, rental and parcel bookings with status and payment filters, dispatch monitor and dispatch users." },
        { title: "Drivers & KYC", text: "Approve or reject documents, block drivers, see online drivers on a live map and export CSV." },
        { title: "Catalogue & Pricing", text: "Services, zones on a map, rental packages, vehicle types with fares, brands, models and driver document types." },
        { title: "Customers & Support", text: "Customer profiles and wallets, support tickets with chat, support overview and SOS alerts." },
        { title: "Growth Tools", text: "Offers and coupons, home banners, onboarding slides, push notifications to riders or drivers, email templates and badges." },
        { title: "Finance", text: "Commission and cancellation rules, driver subscription plans and history, payout requests and payment gateways." },
        { title: "Roles & Employees", text: "Admin, staff and dispatcher accounts with per-module permissions." },
        { title: "Settings", text: "Platform identity and region, app versions with update prompts, wallet thresholds, driver & ride rules, maps and maintenance mode." },
      ],
    },
    {
      title: "Firebase Backend",
      subtitle: "Cloud Functions, security rules and data model included.",
      items: [
        { title: "Driver Matching", text: "New requests notify online, approved, unblocked drivers inside the search radius; no driver means 'No drivers available'." },
        { title: "Auto-Expiry", text: "A scheduled job closes requests nobody accepted within the admin's time limit." },
        { title: "Settlement", text: "Commission, driver share, wallet moves and ledger entries booked once per completed trip." },
        { title: "Verified Payments", text: "Hosted checkouts for Razorpay, Stripe and PayPal, verified server-side, idempotent and live in the app." },
      ],
    },
  ],

  problems: [
    { problem: "Separate tools for cabs, rentals, outstation and parcels", solution: "Five services on one platform with one fleet and one panel." },
    { problem: "Servers, databases and cron jobs to babysit", solution: "Serverless Firebase backend that scales automatically." },
    { problem: "Riders getting into the wrong car", solution: "Driver, car and plate in the app, and a rider OTP before every trip starts." },
    { problem: "Unverified drivers on the road", solution: "Document-based KYC with admin approval before a driver can go online." },
    { problem: "Commission disputes and cash leakage", solution: "Server-side settlement with a wallet ledger for every trip and fee." },
    { problem: "Fake payment confirmations", solution: "Every online payment verified with Razorpay, Stripe or PayPal on the server." },
  ],

  ecosystem: [
    { title: "Admin Panel (Flutter Web)", text: "Bookings, dispatch, drivers & KYC, catalogue, growth, finance and settings" },
    { title: "Serverless Backend (Firebase)", text: "Cloud Functions, Firestore, Realtime Database, Storage, Cloud Messaging" },
    { title: "Customer App (Flutter)", text: "Book, track, pay and get support on Android and iOS" },
    { title: "Driver App (Flutter)", text: "Register, verify, go online, run trips and track earnings" },
    { title: "Maps & Payments", text: "Google Maps Platform, Razorpay, Stripe and PayPal" },
    { title: "Real-Time Services", text: "Live driver locations • Ride status • Push notifications • Live dashboard" },
  ],

  requirements: [
    { title: "Built In:", text: "Flutter, Firebase (Cloud Functions, Firestore, Realtime Database)" },
    { title: "Server Required:", text: "No VPS needed — Firebase Blaze plan (pay as you go) with Firebase Hosting for the admin panel" },
    {
      title: "Third-Party Accounts Required:",
      text: "Firebase / Google Cloud with a Google Maps Platform API key, Google Play Console (Apple Developer for iOS); optional Razorpay, Stripe or PayPal account for online payments.",
    },
  ],

  youGet: [
    "Flutter Customer App (Android & iOS)",
    "Flutter Driver App (Android & iOS)",
    "Flutter Web Admin Panel",
    "Firebase Backend: Cloud Functions, Security Rules & Indexes",
    "Shared Dart Packages, Unit & Security-Rules Tests",
    "Complete Online Documentation",
    "Lifetime Product Updates",
  ],

  revenue: [
    { title: "Commission per Trip", text: "A percentage or fixed commission on every completed ride, booked automatically." },
    { title: "Driver Subscriptions", text: "Sell plans that waive commission for a period or a number of rides." },
    { title: "Cancellation Fees", text: "Charge riders who cancel late, outside the free window, and pay the driver." },
    { title: "Rentals & Intercity", text: "Higher-value hourly rentals and outstation trips alongside city rides." },
    { title: "Parcel Delivery", text: "Use the same fleet for same-city parcel deliveries." },
    { title: "Promotions", text: "Coupons, banners and push campaigns to win riders and keep them booking." },
  ],

  faqs: [
    {
      q: "What do I get when I buy Go4Ride?",
      a: "The complete source code of the Flutter Customer App, the Flutter Driver App, the Flutter Web Admin Panel and the Firebase backend (Cloud Functions, security rules, indexes), plus shared packages, tests, online documentation and lifetime updates.",
    },
    {
      q: "Do I need a VPS or hosting server?",
      a: "No. Go4Ride runs on Google Firebase (Blaze pay-as-you-go plan). The admin panel is hosted on Firebase Hosting and all server logic runs in Cloud Functions.",
    },
    {
      q: "Which services can riders book?",
      a: "City cab, intercity sharing, intercity personal, hourly rental and parcel delivery. You switch services on or off, rename them and set their order in the admin panel.",
    },
    {
      q: "Which payment methods are supported?",
      a: "Cash, the Go4Ride Wallet, and online payments through Razorpay (UPI, cards, netbanking), Stripe and PayPal using hosted checkout pages verified on the server.",
    },
    {
      q: "How are drivers verified?",
      a: "Drivers upload the documents you define (licence, RC, insurance, ID and more) with photos and expiry dates. Your team approves or rejects each one; only approved drivers can go online.",
    },
    {
      q: "Can I rebrand Go4Ride with my own name, logo and colours?",
      a: "Yes. The documentation explains how to change the package names, app names, launcher icons, splash screens, colours and texts for both apps and the admin panel.",
    },
    {
      q: "Do you help publish the apps to Google Play?",
      a: "Yes. The documentation covers signing, building the app bundle and the Play Console steps for both apps, and our installation plans include publishing.",
    },
  ],
};
