/**
 * Documentation registry: one entry per product that has docs.
 * Routes:  /docs/<product>                      → landing page
 *          /docs/<product>/docs/<section>/<page> → a Markdown file in src/content/docs/<product>/<section>/<page>.md
 * The sidebar order below is the reading order (it also drives Previous / Next links).
 */

export type NavItem = {
  title: string;
  /** Page slug relative to /docs/<product>/docs/ (e.g. "admin/overview"). Groups without a slug only expand. */
  slug?: string;
  children?: NavItem[];
};

export type DocsSection = {
  key: string;
  title: string;
  /** Short text for the landing-page card. */
  description: string;
  /** lucide icon name used on the landing page / top bar. */
  icon: "LayoutDashboard" | "Smartphone" | "Bike" | "Globe" | "LifeBuoy" | "CircleHelp" | "BookOpen" | "History" | "Code";
  badge?: string;
  /** Show as a tab in the docs top bar. */
  tab?: boolean;
  items: NavItem[];
};

export type DocsProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  version: string;
  updated: string;
  /** Brand colours: accent (buttons, markers), ink (AA text on white), soft (active backgrounds). */
  colors: { accent: string; ink: string; soft: string };
  logo: string;
  /** Marketplace product page or live demo (optional). */
  productUrl?: string;
  /** Landing-page "Quick start" steps (default: the QwikMart Firebase → panels → apps steps). */
  quickStart?: { title: string; text: string; slug: string }[];
  /** Target of the landing-page "Installation Guide" button (default "installation/requirements"). */
  installSlug?: string;
  sections: DocsSection[];
};

const qwikmart: DocsProduct = {
  slug: "qwikmart",
  name: "QwikMart",
  tagline:
    "Complete guide for the QwikMart quick-commerce & grocery delivery platform",
  description:
    "Install, configure, brand and publish QwikMart: Firebase backend, Admin & Store panels, Next.js website, Flutter customer app and Flutter delivery partner app.",
  version: "1.0.1",
  updated: "21 October 2026",
  colors: { accent: "#0E9623", ink: "#0B6B1B", soft: "#E6F4E9" },
  logo: "/docs/qwikmart/logo.png",
  productUrl: "/products/qwikmart-all-in-one-quick-commerce-ecommerce-platform",
  sections: [
    {
      key: "intro",
      title: "Introduction",
      description:
        "What QwikMart is, what is included in the package and how the pieces fit together.",
      icon: "BookOpen",
      items: [{ title: "Introduction", slug: "intro" }],
    },
    {
      key: "admin",
      title: "Admin Panel",
      description:
        "Set up Firebase, deploy the backend and manage products, orders, riders, payments and settings.",
      icon: "LayoutDashboard",
      badge: "Start here",
      tab: true,
      items: [
        { title: "Overview", slug: "admin/overview" },
        { title: "Demo Instructions", slug: "admin/demo-instructions" },
        { title: "Third-Party Service Costs", slug: "admin/third-party-costs" },
        {
          title: "Installation",
          children: [
            { title: "Installation Overview", slug: "installation/overview" },
            { title: "Requirements", slug: "installation/requirements" },
            {
              title: "Create the Firebase Project",
              slug: "installation/firebase-project",
            },
            {
              title: "Deploy the Backend",
              slug: "installation/backend-deploy",
            },
            {
              title: "Admin Panel Installation",
              slug: "installation/admin-panel",
            },
            {
              title: "Environment Configuration",
              slug: "installation/environment-configuration",
            },
            {
              title: "Create the Super Admin",
              slug: "installation/super-admin",
            },
            { title: "Hosting, Domain & SSL", slug: "installation/hosting" },
            {
              title: "Setup Guide (First 10 Steps)",
              slug: "installation/setup-guide",
            },
            { title: "Localhost Setup", slug: "installation/localhost-setup" },
            { title: "Backups & Monitoring", slug: "installation/backups" },
          ],
        },
        {
          title: "Core Setup",
          children: [
            { title: "Countries & Currency", slug: "admin/countries" },
            { title: "Delivery Zones", slug: "admin/zones" },
            { title: "Stores", slug: "admin/stores" },
            { title: "Catalogue & Products", slug: "admin/catalog" },
            { title: "Home Builder", slug: "admin/home-builder" },
            { title: "Pages, Blog & FAQs", slug: "admin/pages" },
          ],
        },
        {
          title: "Settings",
          children: [
            { title: "General Settings", slug: "admin/general-settings" },
            { title: "Payment Gateways", slug: "admin/payment-gateways" },
            { title: "SMTP / Email", slug: "admin/smtp-settings" },
            { title: "SMS Gateway & OTP", slug: "admin/sms-settings" },
            {
              title: "Push Notifications (FCM)",
              slug: "admin/push-notifications",
            },
            { title: "AI (Google Gemini)", slug: "admin/ai-settings" },
            {
              title: "Wallet, Referral & Delivery",
              slug: "admin/wallet-referral-delivery",
            },
          ],
        },
        {
          title: "Modules",
          children: [
            { title: "Orders & Order Flow", slug: "admin/orders" },
            { title: "Delivery Boys", slug: "admin/delivery-boys" },
            { title: "Customers & Wallet", slug: "admin/customers" },
            { title: "Returns & Refunds", slug: "admin/returns" },
            { title: "Promo Codes", slug: "admin/promo-codes" },
            { title: "Notifications & Email", slug: "admin/notifications" },
            { title: "Chat & Contact Messages", slug: "admin/chat-contact" },
            { title: "Reports", slug: "admin/reports" },
            {
              title: "Staff, Roles & Permissions",
              slug: "admin/roles-permissions",
            },
            { title: "Store Panel", slug: "admin/store-panel" },
          ],
        },
      ],
    },
    {
      key: "app-customer",
      title: "Customer App",
      description:
        "Configure, re-brand and publish the Flutter customer app for Android (and iOS).",
      icon: "Smartphone",
      badge: "Android & iOS",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app-customer/prerequisites" },
        { title: "Firebase Setup", slug: "app-customer/firebase-setup" },
        {
          title: "Change Package Name",
          slug: "app-customer/change-package-name",
        },
        { title: "Change App Name", slug: "app-customer/change-app-name" },
        {
          title: "Change App Logo & Splash",
          slug: "app-customer/change-app-logo",
        },
        {
          title: "Change Theme Colour & Font",
          slug: "app-customer/change-theme",
        },
        { title: "Onboarding Images & Text", slug: "app-customer/onboarding" },
        { title: "Configure Home Screen", slug: "app-customer/home-screen" },
        {
          title: "Login Methods & Phone OTP",
          slug: "app-customer/auth-methods",
        },
        { title: "Maps & Location", slug: "app-customer/maps-location" },
        {
          title: "Payment Gateway (Razorpay)",
          slug: "app-customer/payment-gateway",
        },
        { title: "Push Notifications", slug: "app-customer/notifications" },
        { title: "Manage Languages", slug: "app-customer/languages" },
        {
          title: "About, Policy & Contact Pages",
          slug: "app-customer/content-pages",
        },
        {
          title: "App Version & Store Links",
          slug: "app-customer/app-version",
        },
        { title: "Run the App", slug: "app-customer/run-the-app" },
        { title: "Release & Play Store", slug: "app-customer/deployment" },
      ],
    },
    {
      key: "app-delivery",
      title: "Delivery Boy App",
      description:
        "Set up and publish the Flutter delivery partner app: registration, live location and the delivery workflow.",
      icon: "Bike",
      badge: "Android & iOS",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app-delivery/prerequisites" },
        { title: "Firebase Setup", slug: "app-delivery/firebase-setup" },
        {
          title: "Change Package Name",
          slug: "app-delivery/change-package-name",
        },
        {
          title: "Change App Name, Logo & Colour",
          slug: "app-delivery/branding",
        },
        {
          title: "Rider Registration & Approval",
          slug: "app-delivery/registration",
        },
        {
          title: "Live Location (Foreground Service)",
          slug: "app-delivery/location-tracking",
        },
        { title: "Delivery Workflow & OTP", slug: "app-delivery/workflow" },
        { title: "Earnings, Cash & Wallet", slug: "app-delivery/earnings" },
        { title: "Run the App", slug: "app-delivery/run-the-app" },
        { title: "Release & Play Store", slug: "app-delivery/deployment" },
      ],
    },
    {
      key: "web",
      title: "Web Portal",
      description:
        "Install, configure and deploy the Next.js customer website on Firebase App Hosting or a VPS.",
      icon: "Globe",
      badge: "Next.js",
      tab: true,
      items: [
        { title: "Overview", slug: "web/overview" },
        { title: "Installation Steps", slug: "web/installation-steps" },
        { title: "Firebase Setup", slug: "web/firebase-setup" },
        { title: "File Structure", slug: "web/file-structure" },
        { title: "Configuration & Theming", slug: "web/configuration" },
        { title: "Deployment Guide", slug: "web/deployment" },
      ],
    },
    {
      key: "changelog",
      title: "Changelog",
      description: "Release history of QwikMart.",
      icon: "History",
      items: [{ title: "Changelog", slug: "changelog" }],
    },
    {
      key: "support",
      title: "Support",
      description:
        "How to get help, what support covers and how to report an issue.",
      icon: "LifeBuoy",
      tab: true,
      items: [{ title: "Support", slug: "support" }],
    },
    {
      key: "faqs",
      title: "FAQs",
      description:
        "Answers to the most common setup, Firebase, payment and Play Store questions.",
      icon: "CircleHelp",
      tab: true,
      items: [{ title: "FAQs", slug: "faqs" }],
    },
  ],
};

const go4foodie: DocsProduct = {
  slug: "go4foodie",
  name: "Go4Foodie",
  tagline:
    "Complete guide for the Go4Foodie restaurant POS, QR table ordering & online food ordering platform",
  description:
    "Install, configure, brand and publish Go4Foodie: Firebase backend, Flutter Web Admin Panel, Next.js customer website and the Flutter mobile app with Customer, Restaurant (POS) and Owner modes.",
  version: "1.0.0",
  updated: "22 October 2026",
  colors: { accent: "#E8640F", ink: "#B4500A", soft: "#FDEDDF" },
  logo: "/docs/go4foodie/logo.png",
  productUrl: "/products/go4foodie-restaurant-pos-qr-online-ordering-platform",
  installSlug: "installation/requirements",
  quickStart: [
    {
      title: "Create Firebase & deploy the backend",
      text: "Create your Firebase project on the Blaze plan, store the secrets and deploy the api Cloud Function, rules and Hosting.",
      slug: "installation/firebase-project",
    },
    {
      title: "Install the Admin Panel & website",
      text: "Build the Flutter Web admin, create your Owner login and put the Next.js website on Firebase App Hosting.",
      slug: "installation/admin-panel",
    },
    {
      title: "Brand & publish the mobile app",
      text: "Point the app at your backend, change package name, logo and colours, then upload it to Google Play.",
      slug: "app/prerequisites",
    },
  ],
  sections: [
    {
      key: "intro",
      title: "Introduction",
      description: "What Go4Foodie is, what is included in the package and how the pieces fit together.",
      icon: "BookOpen",
      items: [{ title: "Introduction", slug: "intro" }],
    },
    {
      key: "admin",
      title: "Admin Panel",
      description:
        "Set up Firebase, deploy the backend and run the restaurant: floor, POS, orders, reservations, menu, staff, reports and settings.",
      icon: "LayoutDashboard",
      badge: "Start here",
      tab: true,
      items: [
        { title: "Overview", slug: "admin/overview" },
        { title: "Demo Instructions", slug: "admin/demo-instructions" },
        { title: "Third-Party Service Costs", slug: "admin/third-party-costs" },
        {
          title: "Installation",
          children: [
            { title: "Installation Overview", slug: "installation/overview" },
            { title: "Requirements", slug: "installation/requirements" },
            { title: "Create the Firebase Project", slug: "installation/firebase-project" },
            { title: "Deploy the Backend", slug: "installation/backend-deploy" },
            { title: "Secrets & Environment", slug: "installation/environment-configuration" },
            { title: "Admin Panel Installation", slug: "installation/admin-panel" },
            { title: "Import Existing Data", slug: "installation/data-migration" },
            { title: "Create Admin Users", slug: "installation/admin-users" },
            { title: "Hosting, Domains & SSL", slug: "installation/hosting" },
            { title: "Setup Guide (First 10 Steps)", slug: "installation/setup-guide" },
            { title: "Localhost Setup", slug: "installation/localhost-setup" },
            { title: "Backups & Monitoring", slug: "installation/backups" },
          ],
        },
        {
          title: "Restaurant Setup",
          children: [
            { title: "Restaurant Profile & Settings", slug: "admin/settings" },
            { title: "Outlets", slug: "admin/outlets" },
            { title: "Menu & Categories", slug: "admin/menu" },
            { title: "Tables & QR Codes", slug: "admin/tables" },
          ],
        },
        {
          title: "Front of House",
          children: [
            { title: "Live Floor Plan", slug: "admin/floor" },
            { title: "POS & Table Billing", slug: "admin/pos" },
            { title: "Orders & Order Flow", slug: "admin/orders" },
            { title: "Reservations", slug: "admin/reservations" },
          ],
        },
        {
          title: "Business",
          children: [
            { title: "Dashboard", slug: "admin/dashboard" },
            { title: "Staff & Duty Status", slug: "admin/staff" },
            { title: "Customers", slug: "admin/customers" },
            { title: "Gift Cards & Coupons", slug: "admin/gift-cards" },
            { title: "Inventory", slug: "admin/inventory" },
            { title: "Transactions", slug: "admin/transactions" },
            { title: "Reports", slug: "admin/reports" },
            { title: "Table Analytics & History", slug: "admin/table-analytics" },
            { title: "Notifications", slug: "admin/notifications" },
            { title: "Audit Log", slug: "admin/audit-log" },
            { title: "Roles & Permissions", slug: "admin/roles-permissions" },
          ],
        },
        {
          title: "Integrations",
          children: [
            { title: "Payment Gateways", slug: "admin/payment-gateways" },
            { title: "SMTP / Email", slug: "admin/smtp-settings" },
            { title: "Customer Emails", slug: "admin/emails" },
          ],
        },
      ],
    },
    {
      key: "app",
      title: "Mobile App",
      description:
        "One Flutter app with Customer, Restaurant (POS) and Owner modes: connect it to your backend, re-brand it and publish it.",
      icon: "Smartphone",
      badge: "Android & iOS",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app/prerequisites" },
        { title: "Connect to Your Backend", slug: "app/api-configuration" },
        { title: "Change Package Name", slug: "app/change-package-name" },
        { title: "App Name, Logo & Splash", slug: "app/branding" },
        { title: "Theme Colours & Fonts", slug: "app/change-theme" },
        { title: "Customer App", slug: "app/customer" },
        { title: "Restaurant App (POS)", slug: "app/restaurant" },
        { title: "Owner App", slug: "app/owner" },
        { title: "In-App Payments", slug: "app/payments" },
        { title: "Run the App", slug: "app/run-the-app" },
        { title: "Release & Play Store", slug: "app/deployment" },
      ],
    },
    {
      key: "web",
      title: "Web Portal",
      description:
        "Install, configure and deploy the Next.js customer website — online ordering, QR table ordering, bookings and gift cards.",
      icon: "Globe",
      badge: "Next.js",
      tab: true,
      items: [
        { title: "Overview", slug: "web/overview" },
        { title: "Installation Steps", slug: "web/installation-steps" },
        { title: "File Structure", slug: "web/file-structure" },
        { title: "Configuration & Theming", slug: "web/configuration" },
        { title: "Online Ordering & QR Tables", slug: "web/ordering" },
        { title: "Checkout & Payments", slug: "web/payments" },
        { title: "Deployment Guide", slug: "web/deployment" },
      ],
    },
    {
      key: "api",
      title: "API Reference",
      description:
        "The REST API behind the website, mobile app and admin panel: authentication, every endpoint, the Firestore data model and errors.",
      icon: "Code",
      badge: "Developers",
      tab: true,
      items: [
        { title: "API Overview & Auth", slug: "api/overview" },
        { title: "Public Website API", slug: "api/public" },
        { title: "Mobile API", slug: "api/mobile" },
        { title: "Admin API", slug: "api/admin" },
        { title: "Data Model (Firestore)", slug: "api/data-model" },
        { title: "Errors & Status Codes", slug: "api/errors" },
      ],
    },
    {
      key: "changelog",
      title: "Changelog",
      description: "Release history of Go4Foodie.",
      icon: "History",
      items: [{ title: "Changelog", slug: "changelog" }],
    },
    {
      key: "support",
      title: "Support",
      description: "How to get help, what support covers and how to report an issue.",
      icon: "LifeBuoy",
      tab: true,
      items: [{ title: "Support", slug: "support" }],
    },
    {
      key: "faqs",
      title: "FAQs",
      description: "Answers to the most common setup, Firebase, payment, POS and Play Store questions.",
      icon: "CircleHelp",
      tab: true,
      items: [{ title: "FAQs", slug: "faqs" }],
    },
  ],
};

const go4ride: DocsProduct = {
  slug: "go4ride",
  name: "Go4Ride",
  tagline: "Complete guide for the Go4Ride taxi, intercity, rental & parcel booking platform",
  description:
    "Install, configure, brand and publish Go4Ride: Firebase backend with Cloud Functions, the Flutter Web Admin Panel, and the Flutter Customer and Driver apps for Android and iOS.",
  version: "1.0.0",
  updated: "24 October 2026",
  colors: { accent: "#F5A800", ink: "#8A5A00", soft: "#FFF4D6" },
  logo: "/docs/go4ride/logo.png",
  productUrl: "/products/go4ride-taxi-booking-ride-hailing-platform",
  installSlug: "installation/requirements",
  quickStart: [
    {
      title: "Create Firebase & deploy the backend",
      text: "Create your Firebase project on the Blaze plan, then deploy Cloud Functions, security rules, indexes and the Realtime Database rules.",
      slug: "installation/firebase-project",
    },
    {
      title: "Install the Admin Panel",
      text: "Connect the Flutter Web admin to your project, create the first admin and load the default catalogue.",
      slug: "installation/admin-panel",
    },
    {
      title: "Brand & publish the apps",
      text: "Change package names, logo, splash and colours of the Customer and Driver apps, add your Maps key and upload to Google Play.",
      slug: "app-customer/prerequisites",
    },
  ],
  sections: [
    {
      key: "intro",
      title: "Introduction",
      description: "What Go4Ride is, what is included in the package and how the pieces fit together.",
      icon: "BookOpen",
      items: [{ title: "Introduction", slug: "intro" }],
    },
    {
      key: "admin",
      title: "Admin Panel",
      description:
        "Set up Firebase, deploy the backend and run the platform: bookings, dispatch, drivers & KYC, pricing, zones, offers, payouts and settings.",
      icon: "LayoutDashboard",
      badge: "Start here",
      tab: true,
      items: [
        { title: "Overview", slug: "admin/overview" },
        { title: "Demo Instructions", slug: "admin/demo-instructions" },
        { title: "Third-Party Service Costs", slug: "admin/third-party-costs" },
        {
          title: "Installation",
          children: [
            { title: "Installation Overview", slug: "installation/overview" },
            { title: "Requirements", slug: "installation/requirements" },
            { title: "Create the Firebase Project", slug: "installation/firebase-project" },
            { title: "Deploy the Backend", slug: "installation/backend-deploy" },
            { title: "Keys & Environment", slug: "installation/environment-configuration" },
            { title: "Admin Panel Installation", slug: "installation/admin-panel" },
            { title: "Create the First Admin", slug: "installation/super-admin" },
            { title: "Hosting, Domain & SSL", slug: "installation/hosting" },
            { title: "Setup Guide (First 10 Steps)", slug: "installation/setup-guide" },
            { title: "Localhost & Emulators", slug: "installation/localhost-setup" },
            { title: "Backups & Monitoring", slug: "installation/backups" },
          ],
        },
        {
          title: "Catalogue",
          children: [
            { title: "Services", slug: "admin/services" },
            { title: "Zones, Fares & Surge", slug: "admin/zones" },
            { title: "Rental Packages", slug: "admin/rental-packages" },
            { title: "Vehicle Types, Brands & Models", slug: "admin/vehicles" },
            { title: "Driver Documents", slug: "admin/driver-documents" },
          ],
        },
        {
          title: "Operations",
          children: [
            { title: "Dashboard", slug: "admin/dashboard" },
            { title: "Bookings", slug: "admin/bookings" },
            { title: "Dispatch & Dispatch Users", slug: "admin/dispatch" },
            { title: "SOS Alerts", slug: "admin/sos-alerts" },
            { title: "Support Tickets", slug: "admin/support" },
          ],
        },
        {
          title: "People",
          children: [
            { title: "Customers & Wallet", slug: "admin/customers" },
            { title: "Drivers & KYC", slug: "admin/drivers" },
            { title: "Online Drivers Map", slug: "admin/online-drivers" },
            { title: "Employees, Roles & Permissions", slug: "admin/roles-permissions" },
          ],
        },
        {
          title: "Growth",
          children: [
            { title: "Offers & Coupons", slug: "admin/offers" },
            { title: "Banners & Onboarding", slug: "admin/banners-onboarding" },
            { title: "Push Notifications", slug: "admin/push-notifications" },
            { title: "Email Templates", slug: "admin/email-templates" },
            { title: "Achievement Badges", slug: "admin/badges" },
          ],
        },
        {
          title: "Finance",
          children: [
            { title: "Commission, Wallet & Settlement", slug: "admin/commission-wallet" },
            { title: "Driver Subscriptions", slug: "admin/subscriptions" },
            { title: "Payout Requests", slug: "admin/payouts" },
            { title: "Payment Gateways", slug: "admin/payment-gateways" },
          ],
        },
        {
          title: "Settings",
          children: [
            { title: "General & App Settings", slug: "admin/settings" },
            { title: "Maps & Location", slug: "admin/map-settings" },
            { title: "Maintenance Mode & App Versions", slug: "admin/maintenance" },
          ],
        },
      ],
    },
    {
      key: "app-customer",
      title: "Customer App",
      description:
        "Brand, configure and publish the rider app: phone login, booking for cab, intercity, rental and parcel, live tracking, wallet and payments.",
      icon: "Smartphone",
      badge: "Android & iOS",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app-customer/prerequisites" },
        { title: "Firebase Setup", slug: "app-customer/firebase-setup" },
        { title: "Change Package Name", slug: "app-customer/change-package-name" },
        { title: "App Name, Logo & Splash", slug: "app-customer/branding" },
        { title: "Theme Colours & Fonts", slug: "app-customer/change-theme" },
        { title: "Google Maps & Location", slug: "app-customer/maps-location" },
        { title: "Phone Login (OTP)", slug: "app-customer/auth" },
        { title: "Booking a Ride", slug: "app-customer/booking" },
        { title: "Live Tracking, OTP & SOS", slug: "app-customer/ride-tracking" },
        { title: "Cancellation & Fees", slug: "app-customer/cancellation" },
        { title: "Wallet & Payments", slug: "app-customer/payments" },
        { title: "Help & Support Tickets", slug: "app-customer/support" },
        { title: "Push Notifications", slug: "app-customer/notifications" },
        { title: "Run the App", slug: "app-customer/run-the-app" },
        { title: "Release & Play Store", slug: "app-customer/deployment" },
      ],
    },
    {
      key: "app-driver",
      title: "Driver App",
      description:
        "Brand and publish the driver app: registration and KYC documents, going online, the ride workflow with OTP, earnings, subscriptions and payouts.",
      icon: "Bike",
      badge: "Android & iOS",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app-driver/prerequisites" },
        { title: "Firebase Setup", slug: "app-driver/firebase-setup" },
        { title: "Change Package Name", slug: "app-driver/change-package-name" },
        { title: "App Name, Logo & Colour", slug: "app-driver/branding" },
        { title: "Registration & KYC Documents", slug: "app-driver/registration" },
        { title: "Going Online & Live Location", slug: "app-driver/going-online" },
        { title: "Ride Workflow & OTP", slug: "app-driver/ride-workflow" },
        { title: "Earnings, Wallet & Payouts", slug: "app-driver/earnings" },
        { title: "Subscription Plans", slug: "app-driver/subscriptions" },
        { title: "Run the App", slug: "app-driver/run-the-app" },
        { title: "Release & Play Store", slug: "app-driver/deployment" },
      ],
    },
    {
      key: "api",
      title: "Backend Reference",
      description:
        "The Firebase backend: Cloud Functions (callables, triggers, schedules), the Firestore data model, security rules and the payment flow.",
      icon: "Code",
      badge: "Developers",
      tab: true,
      items: [
        { title: "Architecture", slug: "api/overview" },
        { title: "Callable Functions", slug: "api/callable-functions" },
        { title: "Triggers & Scheduled Jobs", slug: "api/triggers" },
        { title: "Ride Lifecycle", slug: "api/ride-lifecycle" },
        { title: "Payment Flow", slug: "api/payments" },
        { title: "Data Model (Firestore)", slug: "api/data-model" },
        { title: "Security Rules", slug: "api/security-rules" },
        { title: "Testing", slug: "api/testing" },
      ],
    },
    {
      key: "changelog",
      title: "Changelog",
      description: "Release history of Go4Ride.",
      icon: "History",
      items: [{ title: "Changelog", slug: "changelog" }],
    },
    {
      key: "support",
      title: "Support",
      description: "How to get help, what support covers and how to report an issue.",
      icon: "LifeBuoy",
      tab: true,
      items: [{ title: "Support", slug: "support" }],
    },
    {
      key: "faqs",
      title: "FAQs",
      description: "Answers to the most common setup, Firebase, Maps, payment, KYC and Play Store questions.",
      icon: "CircleHelp",
      tab: true,
      items: [{ title: "FAQs", slug: "faqs" }],
    },
  ],
};

const classiadshub: DocsProduct = {
  slug: "classiadshub",
  name: "ClassiAds-Hub",
  tagline: "Complete guide for the ClassiAds-Hub classified ads & buy-sell marketplace platform",
  description:
    "Install, configure, brand and publish ClassiAds-Hub: Firebase backend with Cloud Functions, the Next.js Admin Panel, the Next.js website and the Flutter app for Android and iOS.",
  version: "1.0.0",
  updated: "27 October 2026",
  colors: { accent: "#272757", ink: "#272757", soft: "#ECECF6" },
  logo: "/docs/classiadshub/logo.png",
  productUrl: "/products/classiads-hub-classified-ads-buy-sell-marketplace-platform",
  installSlug: "installation/requirements",
  quickStart: [
    {
      title: "Create Firebase & deploy the backend",
      text: "Create your Firebase project on the Blaze plan, then deploy the Cloud Functions API, security rules, indexes and the two Hosting sites.",
      slug: "installation/firebase-project",
    },
    {
      title: "Install the Admin Panel & website",
      text: "Build the Next.js Admin Panel and website, create the first super admin and load categories, locations and settings.",
      slug: "installation/admin-panel",
    },
    {
      title: "Brand & publish the app",
      text: "Change the package name, logo, splash and colours of the Flutter app, add your Maps key and upload it to Google Play.",
      slug: "app/prerequisites",
    },
  ],
  sections: [
    {
      key: "intro",
      title: "Introduction",
      description: "What ClassiAds-Hub is, what is included in the package and how the pieces fit together.",
      icon: "BookOpen",
      items: [{ title: "Introduction", slug: "intro" }],
    },
    {
      key: "admin",
      title: "Admin Panel",
      description:
        "Set up Firebase, deploy the backend and run the marketplace: ad moderation, categories, custom fields, content, packages, sellers, customers, locations and settings.",
      icon: "LayoutDashboard",
      badge: "Start here",
      tab: true,
      items: [
        { title: "Overview", slug: "admin/overview" },
        { title: "Demo Instructions", slug: "admin/demo-instructions" },
        { title: "Third-Party Service Costs", slug: "admin/third-party-costs" },
        {
          title: "Installation",
          children: [
            { title: "Installation Overview", slug: "installation/overview" },
            { title: "Requirements", slug: "installation/requirements" },
            { title: "Create the Firebase Project", slug: "installation/firebase-project" },
            { title: "Deploy the Backend", slug: "installation/backend-deploy" },
            { title: "Keys & Environment", slug: "installation/environment-configuration" },
            { title: "Admin Panel Installation", slug: "installation/admin-panel" },
            { title: "Create the First Admin", slug: "installation/super-admin" },
            { title: "Hosting, Domain & SSL", slug: "installation/hosting" },
            { title: "Setup Guide (First 10 Steps)", slug: "installation/setup-guide" },
            { title: "Localhost Setup", slug: "installation/localhost-setup" },
            { title: "Data Migration (MySQL → Firestore)", slug: "installation/data-migration" },
            { title: "Backups & Monitoring", slug: "installation/backups" },
          ],
        },
        {
          title: "Ads & Catalogue",
          children: [
            { title: "Dashboard", slug: "admin/dashboard" },
            { title: "Ads & Moderation", slug: "admin/ads" },
            { title: "Categories", slug: "admin/categories" },
            { title: "Custom Fields", slug: "admin/custom-fields" },
            { title: "Job Listings", slug: "admin/jobs" },
          ],
        },
        {
          title: "Content",
          children: [
            { title: "Sliders & Home Screen", slug: "admin/home-content" },
            { title: "Feature Sections", slug: "admin/featured-sections" },
            { title: "Offer Item Tips", slug: "admin/tips" },
            { title: "Banner Ads", slug: "admin/banner-ads" },
            { title: "Blogs & FAQs", slug: "admin/blogs" },
            { title: "CMS Pages", slug: "admin/pages" },
          ],
        },
        {
          title: "Chat & Trust",
          children: [
            { title: "Chats & Chat Templates", slug: "admin/chat" },
            { title: "Seller Verification", slug: "admin/seller-verification" },
            { title: "Seller Reviews & Reports", slug: "admin/reviews" },
            { title: "Report Reasons & User Reports", slug: "admin/reports" },
          ],
        },
        {
          title: "Monetization",
          children: [
            { title: "Subscription Packages", slug: "admin/packages" },
            { title: "Featured Ad Plans", slug: "admin/featured-plans" },
            { title: "Subscriptions & Transactions", slug: "admin/transactions" },
            { title: "Payment Gateways", slug: "admin/payment-gateways" },
            { title: "AdMob, AdSense & Video Ads", slug: "admin/ad-networks" },
          ],
        },
        {
          title: "People",
          children: [
            { title: "Customers & User Queries", slug: "admin/customers" },
            { title: "Roles, Staff & Permissions", slug: "admin/roles-permissions" },
            { title: "Push Notifications", slug: "admin/push-notifications" },
          ],
        },
        {
          title: "Location",
          children: [{ title: "Countries, States, Cities, Areas & Currencies", slug: "admin/locations" }],
        },
        {
          title: "Settings",
          children: [
            { title: "General, Web & SEO", slug: "admin/settings" },
            { title: "Languages & Currency", slug: "admin/languages" },
            { title: "Login, OTP & Notification Settings", slug: "admin/otp-notifications" },
            { title: "Email Templates & SMTP", slug: "admin/email-templates" },
            { title: "Firebase Settings", slug: "admin/firebase-settings" },
            { title: "Watermark & File Manager", slug: "admin/media-settings" },
            { title: "Gemini AI", slug: "admin/ai-settings" },
            { title: "System Status, Logs & Dummy Data", slug: "admin/system-status" },
          ],
        },
      ],
    },
    {
      key: "web",
      title: "Website",
      description:
        "Install, configure and deploy the Next.js website: browsing and search, ad details, posting ads, the user dashboard, plans and checkout, blog, jobs and SEO.",
      icon: "Globe",
      badge: "Next.js",
      tab: true,
      items: [
        { title: "Overview", slug: "web/overview" },
        { title: "Installation Steps", slug: "web/installation-steps" },
        { title: "Configuration", slug: "web/configuration" },
        { title: "File Structure", slug: "web/file-structure" },
        { title: "Browsing, Search & Nearby", slug: "web/browsing" },
        { title: "Ad Details & Sellers", slug: "web/ad-detail" },
        { title: "Posting & Managing Ads", slug: "web/post-ad" },
        { title: "Accounts & Login", slug: "web/accounts" },
        { title: "User Dashboard", slug: "web/dashboard" },
        { title: "Plans, Featured Ads & Checkout", slug: "web/checkout" },
        { title: "Blog, Jobs & Pages", slug: "web/content" },
        { title: "SEO & Sitemap", slug: "web/seo" },
        { title: "Deployment", slug: "web/deployment" },
      ],
    },
    {
      key: "app",
      title: "Mobile App",
      description:
        "Brand, configure and publish the Flutter app: login, home and search, ad details, posting ads, chat and offers, profile and account deletion, notifications and Play Store release.",
      icon: "Smartphone",
      badge: "Android & iOS",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app/prerequisites" },
        { title: "Firebase Setup", slug: "app/firebase-setup" },
        { title: "Change Package Name", slug: "app/change-package-name" },
        { title: "App Name, Logo & Splash", slug: "app/branding" },
        { title: "Theme Colours & Fonts", slug: "app/change-theme" },
        { title: "API Configuration", slug: "app/api-configuration" },
        { title: "Google Maps & Location", slug: "app/maps-location" },
        { title: "Login, Register & OTP", slug: "app/auth" },
        { title: "Onboarding & Home", slug: "app/home" },
        { title: "Search, Categories & Nearby", slug: "app/search" },
        { title: "Ad Details, Favorites & Sharing", slug: "app/ad-detail" },
        { title: "Post & Manage Ads", slug: "app/post-ad" },
        { title: "Chat, Offers & Reviews", slug: "app/chat-offers" },
        { title: "Profile, Verification & Account Deletion", slug: "app/profile" },
        { title: "Push Notifications", slug: "app/notifications" },
        { title: "Run the App", slug: "app/run-the-app" },
        { title: "Release & Play Store", slug: "app/deployment" },
      ],
    },
    {
      key: "api",
      title: "Backend Reference",
      description:
        "The Firebase backend: the Cloud Functions REST API (envelope, auth, endpoints), the Firestore data model, security rules, payments and scheduled jobs.",
      icon: "Code",
      badge: "Developers",
      tab: true,
      items: [
        { title: "Architecture", slug: "api/overview" },
        { title: "Conventions & Errors", slug: "api/conventions" },
        { title: "Auth Endpoints", slug: "api/auth" },
        { title: "Catalogue & Content Endpoints", slug: "api/catalog" },
        { title: "Ads Endpoints", slug: "api/ads" },
        { title: "Chat, Offers & Social Endpoints", slug: "api/social" },
        { title: "Billing & Payments", slug: "api/billing" },
        { title: "Jobs Endpoints", slug: "api/jobs" },
        { title: "Admin Endpoints", slug: "api/admin" },
        { title: "Data Model (Firestore)", slug: "api/data-model" },
        { title: "Security Rules & Storage", slug: "api/security-rules" },
        { title: "Scheduled Jobs", slug: "api/scheduled-jobs" },
        { title: "Testing & QA Tools", slug: "api/testing" },
      ],
    },
    {
      key: "changelog",
      title: "Changelog",
      description: "Release history of ClassiAds-Hub.",
      icon: "History",
      items: [{ title: "Changelog", slug: "changelog" }],
    },
    {
      key: "support",
      title: "Support",
      description: "How to get help, what support covers and how to report an issue.",
      icon: "LifeBuoy",
      tab: true,
      items: [{ title: "Support", slug: "support" }],
    },
    {
      key: "faqs",
      title: "FAQs",
      description: "Answers to the most common setup, Firebase, payment, moderation, Maps and Play Store questions.",
      icon: "CircleHelp",
      tab: true,
      items: [{ title: "FAQs", slug: "faqs" }],
    },
  ],
};

const go4market: DocsProduct = {
  slug: "go4market",
  name: "Go4Market",
  tagline: "Complete guide for the Go4Market multi-vendor quick-commerce & eCommerce platform",
  description:
    "Install, configure, brand and publish Go4Market: Firebase backend, Flutter Web Admin, Seller and Delivery panels, Flutter Web customer website, the Customer app and the Partner app (Seller + Delivery).",
  version: "1.0.0",
  updated: "29 October 2026",
  colors: { accent: "#0B8A4F", ink: "#0A4A33", soft: "#E6F4EC" },
  logo: "/docs/go4market/logo.png",
  productUrl: "/products/go4market-multi-vendor-quick-commerce-ecommerce-platform",
  installSlug: "installation/requirements",
  quickStart: [
    {
      title: "Create Firebase & deploy the backend",
      text: "Create your Firebase project on the Blaze plan, connect the code to it, store the secrets and deploy Cloud Functions, rules and indexes.",
      slug: "installation/firebase-project",
    },
    {
      title: "Publish the four web sites",
      text: "Seed the demo catalogue, build the Flutter Web website and the Admin, Seller and Delivery panels, deploy them to Firebase Hosting and create your Super Admin.",
      slug: "installation/hosting",
    },
    {
      title: "Brand & publish the two apps",
      text: "Add google-services.json, change package names, logo and colours, then upload the Customer and Partner apps to Google Play.",
      slug: "app-customer/prerequisites",
    },
  ],
  sections: [
    {
      key: "intro",
      title: "Introduction",
      description: "What Go4Market is, what is included in the package and how the pieces fit together.",
      icon: "BookOpen",
      items: [{ title: "Introduction", slug: "intro" }],
    },
    {
      key: "admin",
      title: "Admin Panel",
      description:
        "Set up Firebase, deploy the backend and run the marketplace: modules, catalogue, sellers, riders, orders, POS, finance, marketing and settings.",
      icon: "LayoutDashboard",
      badge: "Start here",
      tab: true,
      items: [
        { title: "Overview", slug: "admin/overview" },
        { title: "Demo Instructions", slug: "admin/demo-instructions" },
        { title: "Third-Party Service Costs", slug: "admin/third-party-costs" },
        {
          title: "Installation",
          children: [
            { title: "Installation Overview", slug: "installation/overview" },
            { title: "Requirements", slug: "installation/requirements" },
            { title: "Create the Firebase Project", slug: "installation/firebase-project" },
            { title: "Connect the Code to Your Project", slug: "installation/connect-your-project" },
            { title: "Secrets & functions/.env", slug: "installation/environment-configuration" },
            { title: "Deploy Functions, Rules & Indexes", slug: "installation/backend-deploy" },
            { title: "Seed Demo Data", slug: "installation/seed-data" },
            { title: "Build & Deploy the Web Apps", slug: "installation/hosting" },
            { title: "Create the Super Admin", slug: "installation/super-admin" },
            { title: "Custom Domains & SSL", slug: "installation/domains" },
            { title: "Setup Guide (First 10 Steps)", slug: "installation/setup-guide" },
            { title: "Localhost Setup", slug: "installation/localhost-setup" },
            { title: "Backups & Monitoring", slug: "installation/backups" },
          ],
        },
        {
          title: "Core Setup",
          children: [
            { title: "Modules", slug: "admin/modules" },
            { title: "Platform Settings", slug: "admin/platform-settings" },
            { title: "Delivery Settings & Slots", slug: "admin/delivery-settings" },
            { title: "Cities, Countries & Taxes", slug: "admin/cities-countries" },
            { title: "Categories, Brands & Attributes", slug: "admin/catalog" },
            { title: "Products, Variants & Stock", slug: "admin/products" },
            { title: "Homepage: Sliders, Offers & Popups", slug: "admin/homepage" },
            { title: "Blogs, FAQs & Pages", slug: "admin/content-pages" },
          ],
        },
        {
          title: "Settings & Integrations",
          children: [
            { title: "Payment Gateways", slug: "admin/payment-gateways" },
            { title: "Email (SMTP) & Templates", slug: "admin/email-smtp" },
            { title: "SMS Gateway", slug: "admin/sms-gateway" },
            { title: "Push Notifications & Campaigns", slug: "admin/push-notifications" },
            { title: "AI Descriptions (Gemini)", slug: "admin/ai-descriptions" },
            { title: "Languages & Translations", slug: "admin/languages" },
            { title: "SEO, Sitemap & Social Links", slug: "admin/seo-social" },
            { title: "App Versions & Force Update", slug: "admin/app-versions" },
            { title: "Demo, Maintenance & System Health", slug: "admin/system" },
          ],
        },
        {
          title: "Orders & Operations",
          children: [
            { title: "Dashboard", slug: "admin/dashboard" },
            { title: "Orders & Order Flow", slug: "admin/orders" },
            { title: "Point of Sale & Barcode", slug: "admin/pos" },
            { title: "Live Rider Map", slug: "admin/live-map" },
            { title: "Returns & Refunds", slug: "admin/returns" },
          ],
        },
        {
          title: "People",
          children: [
            { title: "Sellers", slug: "admin/sellers" },
            { title: "Delivery Partners", slug: "admin/delivery-partners" },
            { title: "Cash Collection & Salary", slug: "admin/cash-salary" },
            { title: "Customers & Product Requests", slug: "admin/customers" },
            { title: "Staff, Roles & Permissions", slug: "admin/staff-roles" },
          ],
        },
        {
          title: "Money & Growth",
          children: [
            { title: "Finance: Withdrawals & Transfers", slug: "admin/finance" },
            { title: "Coupons & Abandoned Carts", slug: "admin/coupons" },
            { title: "Wallet, Refer & Earn, Membership", slug: "admin/wallet-membership" },
            { title: "Reports & Analytics", slug: "admin/reports" },
          ],
        },
      ],
    },
    {
      key: "seller",
      title: "Seller Panel",
      description: "The Seller Hub on the web: onboarding, orders, products, POS, own riders, coupons, earnings and reports.",
      icon: "LayoutDashboard",
      badge: "Flutter Web",
      tab: true,
      items: [
        { title: "Seller Panel Overview", slug: "seller/overview" },
        { title: "Seller Registration & Approval", slug: "seller/registration" },
        { title: "Orders, Pickup & Rider Assignment", slug: "seller/orders" },
        { title: "Products, Stock & Reviews", slug: "seller/products" },
        { title: "Own Riders (Store Fleet)", slug: "seller/riders" },
        { title: "Earnings, Coupons & Reports", slug: "seller/finance-reports" },
      ],
    },
    {
      key: "delivery",
      title: "Delivery Panel",
      description: "The web panel for delivery partners: registration, going online, accepting and completing deliveries, cash and earnings.",
      icon: "Bike",
      badge: "Flutter Web",
      tab: true,
      items: [
        { title: "Delivery Panel Overview", slug: "delivery/overview" },
        { title: "Deliveries, OTP & Cash", slug: "delivery/deliveries" },
        { title: "Earnings & Withdrawals", slug: "delivery/earnings" },
      ],
    },
    {
      key: "app-customer",
      title: "Customer App",
      description: "Configure, re-brand and publish the Flutter shopping app (com.go4market.customer).",
      icon: "Smartphone",
      badge: "Android",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app-customer/prerequisites" },
        { title: "Firebase Setup", slug: "app-customer/firebase-setup" },
        { title: "Run the App", slug: "app-customer/run-the-app" },
        { title: "Change Package Name", slug: "app-customer/change-package-name" },
        { title: "Change App Name", slug: "app-customer/change-app-name" },
        { title: "Change Logo & App Icon", slug: "app-customer/change-app-logo" },
        { title: "Splash Screen", slug: "app-customer/splash-screen" },
        { title: "Theme Colours & Font", slug: "app-customer/change-theme" },
        { title: "Languages", slug: "app-customer/languages" },
        { title: "Sign-in: Email, Google & Phone OTP", slug: "app-customer/auth-methods" },
        { title: "Payment Gateways", slug: "app-customer/payment-gateway" },
        { title: "Push Notifications", slug: "app-customer/notifications" },
        { title: "Maps & Location", slug: "app-customer/maps-location" },
        { title: "Shopping Features Tour", slug: "app-customer/shopping-features" },
        { title: "Release Build & Keystore", slug: "app-customer/deployment" },
        { title: "Google Play Listing & Review", slug: "app-customer/play-console" },
      ],
    },
    {
      key: "app-partner",
      title: "Partner App",
      description: "One Flutter app (com.go4market.partner) for sellers and delivery partners: configure, brand and publish it.",
      icon: "Bike",
      badge: "Seller + Delivery",
      tab: true,
      items: [
        { title: "App Prerequisites", slug: "app-partner/prerequisites" },
        { title: "Firebase Setup", slug: "app-partner/firebase-setup" },
        { title: "Run the App", slug: "app-partner/run-the-app" },
        { title: "Change Package Name", slug: "app-partner/change-package-name" },
        { title: "App Name, Logo, Icon & Splash", slug: "app-partner/branding" },
        { title: "Theme Colours & Languages", slug: "app-partner/change-theme" },
        { title: "Seller Mode", slug: "app-partner/seller-mode" },
        { title: "Delivery Mode", slug: "app-partner/delivery-mode" },
        { title: "Live Location (Foreground Service)", slug: "app-partner/location-tracking" },
        { title: "Push Notifications", slug: "app-partner/notifications" },
        { title: "Release & Play Store", slug: "app-partner/deployment" },
      ],
    },
    {
      key: "web",
      title: "Website",
      description: "The Flutter Web customer storefront on Firebase Hosting: configuration, languages and RTL, payments, push and SEO.",
      icon: "Globe",
      badge: "Flutter Web",
      tab: true,
      items: [
        { title: "Website Overview", slug: "web/overview" },
        { title: "File Structure", slug: "web/file-structure" },
        { title: "Configuration & Branding", slug: "web/configuration" },
        { title: "Languages & RTL", slug: "web/languages-rtl" },
        { title: "Checkout & Payment Return", slug: "web/payments" },
        { title: "Web Push & SEO", slug: "web/push-seo" },
        { title: "Build & Deploy", slug: "web/deployment" },
      ],
    },
    {
      key: "changelog",
      title: "Changelog",
      description: "Release history of Go4Market.",
      icon: "History",
      items: [{ title: "Changelog", slug: "changelog" }],
    },
    {
      key: "support",
      title: "Support",
      description: "How to get help, what support covers and how to report an issue.",
      icon: "LifeBuoy",
      tab: true,
      items: [{ title: "Support", slug: "support" }],
    },
    {
      key: "faqs",
      title: "FAQs",
      description: "Answers to the most common Firebase, deployment, sign-in, payment, SMS and Play Store questions.",
      icon: "CircleHelp",
      tab: true,
      items: [{ title: "FAQs", slug: "faqs" }],
    },
  ],
};

export const docsProducts: Record<string, DocsProduct> = { qwikmart, go4foodie, go4ride, classiadshub, go4market };

export const getDocsProduct = (slug: string): DocsProduct | undefined => docsProducts[slug];

export type FlatPage = { slug: string; title: string; section: DocsSection; trail: string[] };

/** Every page in reading order. */
export function flatPages(product: DocsProduct): FlatPage[] {
  const out: FlatPage[] = [];
  const walk = (items: NavItem[], section: DocsSection, trail: string[]) => {
    for (const it of items) {
      if (it.slug) out.push({ slug: it.slug, title: it.title, section, trail });
      if (it.children) walk(it.children, section, [...trail, it.title]);
    }
  };
  for (const s of product.sections) walk(s.items, s, []);
  return out;
}

export const docHref = (product: string, slug: string) => `/docs/${product}/docs/${slug}`;

/** First page of a section (tabs and landing cards link here). */
export const sectionHref = (product: DocsProduct, section: DocsSection) => {
  const first = flatPages(product).find((p) => p.section.key === section.key);
  return first ? docHref(product.slug, first.slug) : `/docs/${product.slug}`;
};
