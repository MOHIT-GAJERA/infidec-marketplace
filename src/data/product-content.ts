import type { FaqItem } from "@/components/Faq";
import type { Product } from "./products";
import { QWIKMART_SLUG, qwikmartContent } from "./qwikmart";
import { GO4FOODIE_SLUG, go4foodieContent } from "./go4foodie";
import { GO4RIDE_SLUG, go4rideContent } from "./go4ride";

export type Card = { title: string; text: string };

export type ProductContent = {
  overview: string[];
  demos: { label: string; sub: string }[];
  credentials: { panel: string; email: string; password: string }[];
  why: Card[];
  problems: { problem: string; solution: string }[];
  ecosystem: Card[];
  requirements: Card[];
  youGet: string[];
  revenue: Card[];
  faqs: FaqItem[];
  /** Optional per-product extras (QwikMart): feature list per app/panel, screenshots, docs links, demo note. */
  features?: { title: string; subtitle?: string; items: Card[] }[];
  screens?: { src: string; alt: string; wide?: boolean }[];
  docsUrl?: string;
  changelogUrl?: string;
  demoNote?: string;
  /** Live demo links (replace the "Request … Demo" buttons when present). */
  demoLinks?: { label: string; href: string }[];
  /** Demo request buttons shown when there are no public demo links (default: Website, Admin Panel). */
  demoRequests?: string[];
  /**
   * Image-led product story (premium layout). When present it replaces the text feature sections
   * (why / screens / features / problems / ecosystem / requirements / you-get) on the product page.
   */
  showcase?: ShowcaseSection[];
};

export type ShowcaseImage = { src: string; alt: string; width: number; height: number };
export type ShowcaseSection = { id: string; label: string; title: string; intro?: string; images: ShowcaseImage[] };

export const licenseRows: { label: string; regular: boolean; extended: boolean }[] = [
  { label: "Lifetime License Validity & FREE Update", regular: true, extended: true },
  { label: "Permitted for 1 Domain", regular: true, extended: true },
  { label: "6 Months of Basic Support (Guidance Only)", regular: true, extended: true },
  { label: "All Premium Features", regular: true, extended: true },
  { label: "For Personal Project", regular: true, extended: true },
  { label: "Ready-to-Launch Configuration (Android, iOS, Web & Admin Panel (If Applicable))", regular: false, extended: true },
  { label: "6 Months of Dedicated Support", regular: false, extended: true },
];

export function productContent(p: Product): ProductContent {
  const n = p.name;
  if (p.slug === QWIKMART_SLUG) return qwikmartContent;
  if (p.slug === GO4FOODIE_SLUG) return go4foodieContent;
  if (p.slug === GO4RIDE_SLUG) return go4rideContent;

  if (p.type === "addon") {
    return {
      overview: [
        `${p.title} extends your existing Infidec Marketplace platform with a secure, fully integrated payment experience. ${p.summary}`,
        "The add-on installs through the admin panel in minutes, supports test and live modes, and works with subscription plans, wallet top-ups and regular orders.",
      ],
      demos: [],
      credentials: [],
      why: [
        { title: "Plug & Play", text: "Upload the add-on from the admin panel and enter your API keys – no code changes needed." },
        { title: "Secure by Design", text: "Server-side signature verification and webhooks protect every transaction." },
        { title: "Subscription Ready", text: "Collect recurring payments for plans and memberships automatically." },
      ],
      problems: [],
      ecosystem: [],
      requirements: [
        { title: "Requires:", text: "An active licence of the parent product on the latest version" },
        { title: "Account:", text: "A verified merchant account with the payment provider" },
      ],
      youGet: ["Add-on Package", "Installation Guide", "Lifetime Updates", "6 Months Support"],
      revenue: [],
      faqs: [
        { q: "Will the add-on work with older versions?", a: "Please update the parent product to the latest version before installing the add-on." },
        { q: "Is there any transaction fee from Infidec Marketplace?", a: "No. You only pay the standard fees charged by your payment provider." },
      ],
    };
  }

  // Partner-side roles (e.g. "Delivery Boy App", "Kitchen Panel") – excludes the admin/customer/web chips so
  // every generated panel name is distinct (used as React keys for the demo credential cards).
  const roles = [...new Set(p.chips.filter((c) => !/admin|customer|user|website|application|web version/i.test(c)))];
  const partner = roles[0] ?? "Partner App";
  const partnerShort = partner.replace(/ (App|Panel)$/, "");
  const asPanel = (r: string) => (r.endsWith("Panel") ? r : `${r.replace(/ App$/, "")} Panel`);
  const firstPanel = `${partnerShort} Panel`;
  const secondPanel =
    [roles[1], "Store Panel", "Partner Panel", "Manager Panel"].filter(Boolean).map((r) => asPanel(r as string)).find((r) => r !== firstPanel) ??
    "Manager Panel";

  return {
    overview: [
      `${n} is a complete ${p.tagline.toLowerCase()} solution built to help health, food and wellness businesses launch, manage and scale from a single powerful ecosystem. ${p.summary}`,
      `Whether you're an entrepreneur, startup, agency or enterprise, ${n} provides everything you need to launch faster, simplify daily operations, reduce manual work and deliver exceptional customer experiences.`,
      `Instead of building multiple applications from scratch, ${n} gives you a scalable, customisable and production-ready source code that reduces development time, lowers costs and helps you grow your business with confidence.`,
    ],
    demos: [
      { label: "Customer", sub: "Android Demo" },
      { label: partnerShort, sub: "Android Demo" },
      { label: "Customer", sub: "iOS Demo" },
      { label: partnerShort, sub: "iOS Demo" },
    ],
    credentials: [
      { panel: "Admin Panel", email: "admin@demo.com", password: "123456" },
      { panel: firstPanel, email: "partner@demo.com", password: "Partner@1234" },
      { panel: secondPanel, email: "store@demo.com", password: "Store@1" },
    ],
    why: [
      { title: "Dual Experience, One Platform", text: `Run your mobile apps and website from a single ${n} backend, eliminating the need to manage separate systems.` },
      { title: "Complete Ecosystem", text: "Launch faster with a fully integrated ecosystem that includes customer apps, a web storefront, partner apps and a Laravel admin panel." },
      { title: "Built to Scale", text: "Expand confidently with multi-store, multi-branch, multi-country, multi-language and multi-currency support." },
      { title: "Complete Business Control", text: "Manage products, orders, partners, customers and payments effortlessly through one centralised dashboard." },
      { title: "Increase Revenue Faster", text: "Boost engagement with built-in promotions, coupons, cashback, referral rewards and loyalty features." },
      { title: "Future-Proof Technology", text: "Powered by Laravel, Next.js, Flutter and Firebase for exceptional performance, security and long-term scalability." },
    ],
    problems: [
      { problem: "Disconnected apps & systems", solution: "Everything connected through one powerful ecosystem." },
      { problem: "Managing multiple outlets manually", solution: "Centralised control from a single admin dashboard." },
      { problem: "Delayed deliveries & unhappy customers", solution: "Faster fulfilment with intelligent delivery workflows." },
      { problem: "Limited growth opportunities", solution: "Expand confidently across cities, countries and currencies." },
      { problem: "Weak customer engagement", solution: "Build loyalty with rewards, referrals, wallets and personalised offers." },
      { problem: "Too much operational complexity", solution: "Simplify orders, products, payments and delivery in one platform." },
    ],
    ecosystem: [
      { title: "Admin Panel", text: "Manage products, orders, partners, promotions & settings" },
      { title: "Backend API (Laravel)", text: "Secure business logic & data synchronisation" },
      { title: "Customer Web App (Next.js)", text: "Browse, order & track from any browser" },
      { title: "Customer Mobile App (Flutter)", text: "Shop, pay, track & manage orders" },
      { title: `${partnerShort} App (Flutter)`, text: "Accept orders, navigate & complete deliveries" },
      { title: "Real-Time Services", text: "Firebase • Live notifications • Live chat • Order tracking" },
    ],
    requirements: [
      { title: "Built In:", text: "Laravel, Next.js, Flutter" },
      { title: "Server Required", text: "VPS Server" },
      { title: "Third-Party Accounts Required", text: "Firebase, SMTP Mail Service, Payment Gateway Account, SMS Gateway, Google Map and OSM" },
    ],
    youGet: [
      "Full Flutter Customer & Partner App",
      "Next.js Storefront",
      "Laravel Admin Panel",
      "MySQL Database",
      "Complete Documentation",
      "Lifetime Product Updates",
      "Dedicated Technical Support",
    ],
    revenue: [
      { title: "Commission Revenue", text: "Earn consistent income by charging commission on every successful order placed through your platform." },
      { title: "Delivery & Service Fees", text: "Increase profitability by collecting delivery charges, convenience fees and surge pricing." },
      { title: "Subscription Plans", text: "Generate recurring revenue with monthly or yearly plans for partners with different features and limits." },
      { title: "Promotions & Featured Listings", text: "Monetise featured products, sponsored stores, homepage banners and promotional placements." },
      { title: "Advertising Revenue", text: "Create additional income through in-app advertisements, brand campaigns and partnerships." },
      { title: "Loyalty Campaigns", text: "Drive repeat purchases with coupons, cashback offers, referral rewards and personalised campaigns." },
    ],
    faqs: [
      { q: `What do I get when I buy ${n}?`, a: `You get the complete source code for the ${p.chips.join(", ")}, along with documentation and lifetime updates.` },
      { q: `Can I rebrand ${n} with my own logo and colours?`, a: "Yes. You can change the app name, package name, logo, colours and fonts. Our installation plans can do this for you." },
      { q: "Which payment gateways are supported?", a: "Razorpay, Stripe, PayPal, Paystack, Flutterwave and Cashfree are supported, with more available as add-ons." },
      { q: "Do you help publish the apps to the stores?", a: "Yes. Our Advanced, Premium and Super installation plans include publishing to Google Play and the Apple App Store." },
    ],
  };
}
