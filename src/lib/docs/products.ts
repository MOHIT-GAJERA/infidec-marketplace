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
  icon: "LayoutDashboard" | "Smartphone" | "Bike" | "Globe" | "LifeBuoy" | "CircleHelp" | "BookOpen" | "History";
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

export const docsProducts: Record<string, DocsProduct> = { qwikmart };

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
