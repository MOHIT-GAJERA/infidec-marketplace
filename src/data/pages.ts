import type { Block } from "@/components/ContentPage";

export type PageDef = { label: string; title: string; metaTitle: string; description: string; updated?: string; blocks: Block[] };

const UPDATED = "28 September 2026";

export const infoPages = {
  "privacy-policy": {
    label: "Privacy Policy",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy",
    description: "How Infidec Marketplace collects, uses and protects your personal information when you browse or buy from our store.",
    updated: UPDATED,
    blocks: [
      {
        heading: "Information We Collect",
        body: ["We collect the information you provide when you contact us, create an account or make a purchase, such as your name, email address, phone number and billing details."],
        list: ["Contact and account details", "Order and licence history", "Technical data such as browser type and pages visited"],
      },
      {
        heading: "How We Use Your Information",
        body: ["We use your information to deliver products, provide support, process payments, send important product updates and improve our website. We never sell your personal data."],
      },
      {
        heading: "Payments",
        body: ["Payments are processed by trusted third-party gateways. We do not store your full card details on our servers."],
      },
      {
        heading: "Your Rights",
        body: ["You can request access to, correction of, or deletion of your personal data at any time by emailing contact@infidec.com."],
      },
    ],
  },
  "cookies-policy": {
    label: "Cookies Policy",
    title: "Cookies Policy",
    metaTitle: "Cookies Policy",
    description: "Which cookies Infidec Marketplace uses, why we use them, and how you can control them.",
    updated: UPDATED,
    blocks: [
      {
        heading: "What Are Cookies?",
        body: [
          "Cookies are small text files stored on your device when you visit a website. Similar technologies such as local storage work in the same way. They help a site remember your actions and preferences.",
        ],
      },
      {
        heading: "Strictly Necessary Cookies (always on)",
        body: ["These are required for the website to work and cannot be switched off. They do not track you across other sites."],
        list: [
          "bow_session – keeps you securely logged in (HTTP-only, expires after 1 or 30 days)",
          "bow_uname – shows your first name in the header while you are logged in",
          "bow_cart (local storage) – remembers the products in your cart",
          "bow_currency (local storage) – remembers your USD / INR display preference",
          "bow_cookie_consent (local storage) – remembers your cookie choice",
        ],
      },
      {
        heading: "Analytics Cookies (off until you accept)",
        body: [
          "With your consent we may use analytics tools to understand which pages are visited and how the site performs, so we can improve it. Data is aggregated and not used to identify you personally.",
        ],
      },
      {
        heading: "Marketing Cookies (off until you accept)",
        body: [
          "With your consent we may use marketing pixels to measure the results of our advertising campaigns and show relevant offers on other platforms.",
        ],
      },
      {
        heading: "Managing Your Choice",
        body: [
          "When you first visit, you can Accept or Decline analytics and marketing cookies. If you decline, only strictly necessary cookies are used. To change your choice, clear this site's data in your browser settings and reload the page – the banner will appear again.",
          "You can also block or delete cookies in your browser settings, although some features such as login and the cart may stop working.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about cookies or your data? Email contact@infidec.com."],
      },
    ],
  },
  "refund-policy": {
    label: "Refund Policy",
    title: "Refund Policy",
    metaTitle: "Refund Policy",
    description: "Understand when Infidec Marketplace digital products and installation services are eligible for a refund.",
    updated: UPDATED,
    blocks: [
      {
        heading: "Digital Products",
        body: ["Because source code and product kits are delivered digitally and cannot be returned, all sales are final once the download link has been accessed, except in the cases listed below."],
        list: ["The product is materially different from its description", "A critical bug cannot be fixed by our team within 14 days", "You were charged twice for the same order"],
      },
      {
        heading: "Installation Services",
        body: ["Installation fees are refundable in full before work begins. Once our team has started configuring your server, a partial refund may be offered based on the work completed."],
      },
      {
        heading: "How to Request a Refund",
        body: ["Email contact@infidec.com with your order ID and a description of the issue. We respond to every request within 2 business days."],
      },
    ],
  },
  "license-terms": {
    label: "License Terms",
    title: "License Terms",
    metaTitle: "License Terms – Regular & Extended License",
    description: "What you can and cannot do with a Infidec Marketplace Regular or Extended License.",
    updated: UPDATED,
    blocks: [
      {
        heading: "Regular License",
        body: ["A Regular License lets you use the product to create one end product for yourself or one client, deployed on one domain."],
        list: ["Lifetime licence validity & free updates", "Permitted for 1 domain", "6 months of basic support (guidance only)"],
      },
      {
        heading: "Extended License",
        body: ["An Extended License includes everything in the Regular License plus ready-to-launch configuration and dedicated support."],
        list: ["Android, iOS, web & admin panel configuration (if applicable)", "6 months of dedicated support", "Free setup assistance"],
      },
      {
        heading: "Restrictions",
        body: ["You may not resell, redistribute or share the source code as a stand-alone product, template or starter kit, whether modified or unmodified."],
      },
    ],
  },
  "terms-and-conditions": {
    label: "Terms and Conditions",
    title: "Terms and Conditions",
    metaTitle: "Terms and Conditions",
    description: "The terms that apply when you use the Infidec Marketplace website, products and installation services.",
    updated: UPDATED,
    blocks: [
      {
        heading: "Use of the Website",
        body: ["By using this website you agree to these terms. Please do not misuse the site, attempt to gain unauthorised access or interfere with its normal operation."],
      },
      {
        heading: "Installation & Reskinning",
        body: ["Installation and reskinning services require the access details listed on the Installation page. Timelines begin once all required access has been provided."],
      },
      {
        heading: "Third-Party Services",
        body: ["Our products integrate with third-party services such as Firebase, payment gateways and map providers. Their fees and terms are your responsibility."],
      },
      {
        heading: "Limitation of Liability",
        body: ["Products are provided as described. Infidec Marketplace is not liable for indirect losses arising from the use of our products or services."],
      },
    ],
  },
  "help-center": {
    label: "Help Center",
    title: "Help Center",
    metaTitle: "Help Center – Product Support & Guides",
    description: "Find answers about downloads, installation, updates, licences and support for Infidec Marketplace products.",
    blocks: [
      {
        heading: "Getting Started",
        body: ["After purchase you'll receive a download link and your licence key by email. Follow the documentation included with each product to set up the admin panel first, then the apps."],
      },
      {
        heading: "Updating Your Product",
        body: ["All products include free lifetime updates. Download the latest version from your account and follow the update guide to migrate safely."],
      },
      {
        heading: "Opening a Support Ticket",
        body: ["Contact us with your order ID, product name and a clear description or screenshot of the issue. Our team replies within 1-2 business days."],
      },
    ],
  },
  documentation: {
    label: "Documentation",
    title: "Documentation",
    metaTitle: "Documentation – Setup Guides for Every Product",
    description: "Step-by-step setup guides for Infidec Marketplace Flutter apps, Laravel admin panels, Next.js storefronts and product kits.",
    blocks: [
      {
        heading: "Admin Panel (Laravel)",
        body: ["Upload the admin panel to your server, create a MySQL database, run the web installer and configure your .env settings for mail, storage and payments."],
      },
      {
        heading: "Mobile Apps (Flutter)",
        body: ["Install the Flutter SDK, update the base URL and Firebase configuration, change the package name and app icon, then build for Android and iOS."],
      },
      {
        heading: "Web Storefront (Next.js)",
        body: ["Install dependencies, set the API URL in your environment file, build the project and deploy it to any Node.js host or Vercel."],
      },
      {
        heading: "Change Logs",
        body: ["Each product page lists the current version and last update date. Detailed change logs are included in the download package."],
      },
    ],
  },
  blogs: {
    label: "Blogs",
    title: "Blogs",
    metaTitle: "Blog – Guides for Launching Food, Fitness & Wellness Apps",
    description: "Practical guides on launching and growing grocery delivery, diet planner, fitness and wellness app businesses.",
    blocks: [
      {
        heading: "How to Launch a Grocery Delivery App in 30 Days",
        body: ["Using ready-made source code, you can go from idea to live app in weeks. Start with your delivery zones, onboard stores, configure payments and publish to the stores."],
      },
      {
        heading: "5 Features Every Diet Planner App Needs",
        body: ["Personalised meal plans, easy food logging, progress tracking, reminders and access to experts keep users engaged and subscribed."],
      },
      {
        heading: "Monetisation Models for Wellness Apps",
        body: ["Subscriptions, commissions, featured listings, in-app purchases and advertising can be combined to create a sustainable wellness business."],
      },
    ],
  },
  "exclusive-license": {
    label: "Exclusive License",
    title: "Exclusive License",
    metaTitle: "Exclusive License – Own a Product Exclusively",
    description: "Buy exclusive rights to a Infidec Marketplace product so that no one else can purchase the same code.",
    blocks: [
      {
        heading: "What Is an Exclusive License?",
        body: ["An Exclusive License removes the product from public sale and grants you sole commercial rights to the source code, including full white-labelling."],
      },
      {
        heading: "Who Is It For?",
        body: ["Funded startups, enterprises and agencies that want a unique product foundation without competitors using the same code."],
      },
      {
        heading: "How to Apply",
        body: ["Contact our team with the product you are interested in. We'll share pricing, a transfer agreement and a delivery timeline."],
      },
    ],
  },
} satisfies Record<string, PageDef>;

export type InfoSlug = keyof typeof infoPages;
