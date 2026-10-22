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

export const docsProducts: Record<string, DocsProduct> = { qwikmart, go4foodie };

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
