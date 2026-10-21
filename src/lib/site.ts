export const site = {
  name: "Infidec Marketplace",
  legalName: "Infidec Marketplace",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.infidec-marketplace.in").replace(/\/$/, ""),
  title: "Infidec Marketplace – Ready-Made Health, Food & Wellness App Source Code & Product Kits",
  description:
    "Buy ready-made food delivery, diet planner, fitness and wellness app source code with admin panels, plus ready-to-launch product kits and expert installation. Launch your health business faster.",
  email: "contact@infidec.com",
  phone: "+91 8128974378",
  whatsapp: "918128974378",
  address: {
    street: "C1-1207, Pragati Infra IT Park, Uttran",
    city: "Surat",
    postalCode: "394105",
    region: "Gujarat",
    country: "IN",
  },
  hours: "Mon - Fri: 9:00 AM - 6:00 PM",
  locale: "en_IN",
  currency: "INR",
  keywords: [
    "food delivery app source code",
    "grocery app source code",
    "diet planner app",
    "fitness app source code",
    "wellness app product kit",
    "Flutter app source code",
    "Laravel admin panel",
    "Next.js storefront",
    "health app template",
    "Infidec Marketplace",
  ],
} as const;

/** Replace with your real profile URLs. */
export const social = [
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/infidec-marketplace" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/infidec-marketplace" },
  { key: "x", label: "X (Twitter)", href: "https://x.com/infidec-marketplace" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@infidec-marketplace" },
  { key: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/infidec-marketplace" },
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/918128974378" },
] as const;

export type Currency = "INR" | "USD";
/** INR per 1 USD used for display conversion. Update periodically (or fetch from an FX API). */
export const USD_RATE = 84;

export const currencies: { code: Currency; symbol: string; label: string; name: string }[] = [
  { code: "USD", symbol: "$", label: "USD - $", name: "US Dollar" },
  { code: "INR", symbol: "₹", label: "INR - ₹", name: "Indian Rupee" },
];

/** Format an INR amount in the chosen display currency. */
export const formatPrice = (amountInr: number, currency: Currency) => {
  if (currency === "USD") {
    const usd = amountInr / USD_RATE;
    return "$" + usd.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return inr(amountInr);
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/installation", label: "Installation" },
  { href: "/contact-us", label: "Contact Us" },
] as const;

export const footerNav = [
  {
    title: "Marketplace",
    links: [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/blogs", label: "Blogs" },
      { href: "/installation", label: "Installation" },
      { href: "/exclusive-license", label: "Exclusive License" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/contact-us", label: "Contact Us" },
      { href: "/help-center", label: "Help Center" },
      { href: "/docs", label: "Documentation" },
      { href: "/faqs", label: "FAQs" },
    ],
  },
  {
    title: "Terms & Policies",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/license-terms", label: "License Terms" },
      { href: "/terms-and-conditions", label: "Terms and Conditions" },
      { href: "/cookies-policy", label: "Cookies Policy" },
    ],
  },
] as const;

/** Deterministic Indian grouping (1,09,990) so server and client output always match. */
export const inr = (n: number) => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return "₹" + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${rest},${last3}`;
};

export const absUrl = (path = "/") => `${site.url}${path === "/" ? "" : path}`;
