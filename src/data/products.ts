import { qwikmartProduct } from "./qwikmart.ts"; // explicit extension: scripts/generate-thumbs.mts loads this file with Node
import { go4foodieProduct } from "./go4foodie.ts";

export type ProductType = "app" | "addon";

export type CategoryKey =
  | "add-ons"
  | "business-service"
  | "ecommerce-marketplace"
  | "education-lms"
  | "health-fitness";

export type ThumbIcon =
  | "cart"
  | "salad"
  | "chef"
  | "store"
  | "brain"
  | "yoga"
  | "clinic"
  | "news"
  | "recipe"
  | "pill"
  | "leaf"
  | "card"
  | "cup"
  | "dumbbell"
  | "spa"
  | "bike"
  | "sprout"
  | "droplet"
  | "moon"
  | "cookie"
  | "headphones";

export type Product = {
  slug: string;
  name: string;
  title: string;
  type: ProductType;
  category: CategoryKey;
  featured?: boolean;
  isNew?: boolean;
  price: number;
  oldPrice?: number;
  rating?: number;
  sales?: number;
  theme: { from: string; to: string; ink: "light" | "dark" };
  icon: ThumbIcon;
  tagline: string;
  chips: string[];
  summary: string;
  version: string;
  releaseDate: string;
  lastUpdate: string;
  platform: string;
  techStack: string[];
  integrations: string[];
  /** Photo cover generated with Higgsfield (falls back to the SVG thumbnail). */
  image?: string;
  /** `image` is a finished 923×470 marketing banner (shown uncropped, without the name/chip overlay). */
  bannerArt?: boolean;
};

export const categories: { key: CategoryKey; label: string }[] = [
  { key: "add-ons", label: "Add-ons" },
  { key: "business-service", label: "Business and Service" },
  { key: "ecommerce-marketplace", label: "eCommerce and Marketplace" },
  { key: "education-lms", label: "Education and LMS" },
  { key: "health-fitness", label: "Health and Fitness" },
];

const appStack = ["Flutter", "Laravel", "Next.js", "MySQL", "Firebase"];
const appIntegrations = ["Firebase Cloud Messaging", "SMTP Email", "SMS Gateway Integration", "Google Gemini AI"];

export const products: Product[] = [
  qwikmartProduct,
  go4foodieProduct,
  {
    slug: "freshcart-All-in-One-grocery-organic-food-delivery",
    name: "FreshCart",
    title: "FreshCart - All-in-One Grocery & Organic Food Delivery Platform with Multi-Store & Multi-Country",
    type: "app",
    category: "ecommerce-marketplace",
    featured: true,
    price: 1799,
    oldPrice: 9149,
    rating: 4.7,
    sales: 134,
    theme: { from: "#1556e0", to: "#3d86ff", ink: "light" },
    icon: "cart",
    tagline: "Quick Commerce & Organic Grocery Platform with Multi-Store",
    chips: ["Customer App", "Delivery Boy App", "Website", "Admin Panel", "Store Panel"],
    summary:
      "Launch a All-in-One organic grocery and healthy food delivery business with customer app, delivery app, Next.js storefront and Laravel admin panel.",
    version: "1.3.1",
    releaseDate: "10-08-2026",
    lastUpdate: "26-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "nutriplan-ai-diet-planner-calorie-tracker",
    name: "NutriPlan",
    title: "NutriPlan - AI Diet Planner & Calorie Tracker Flutter App with Admin Panel",
    type: "app",
    category: "health-fitness",
    featured: true,
    price: 3799,
    oldPrice: 4749,
    rating: 4.9,
    sales: 1007,
    theme: { from: "#0f766e", to: "#14a39a", ink: "light" },
    icon: "salad",
    tagline: "Personalised AI Meal Plans & Calorie Tracking",
    chips: ["User App", "Dietitian Panel", "Admin Panel", "Website"],
    summary:
      "An AI-powered diet planner and calorie tracker with barcode food logging, macro goals, dietitian consultations and a subscription-ready admin panel.",
    version: "2.1.0",
    releaseDate: "14-03-2025",
    lastUpdate: "18-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "fitbite-healthy-meal-subscription-tiffin-service",
    name: "FitBite",
    title: "FitBite - Healthy Meal Subscription & Tiffin Service App with Kitchen Panel",
    type: "app",
    category: "business-service",
    featured: true,
    price: 3799,
    oldPrice: 4749,
    rating: 4.9,
    sales: 1178,
    theme: { from: "#c2410c", to: "#f47b0a", ink: "light" },
    icon: "chef",
    tagline: "Build Your Own Healthy Meal Subscription Business",
    chips: ["Customer App", "Kitchen Panel", "Rider App", "Website"],
    summary:
      "Run weekly and monthly healthy meal subscriptions with menu planning, kitchen production reports, delivery routing and pause/skip controls.",
    version: "1.8.4",
    releaseDate: "02-11-2024",
    lastUpdate: "12-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "homechef-multi-vendor-home-cooked-food-marketplace",
    name: "HomeChef",
    title: "HomeChef - Multi Vendor Home-Cooked Food Marketplace with Chef, Rider & Admin Apps",
    type: "app",
    category: "ecommerce-marketplace",
    featured: true,
    price: 3799,
    oldPrice: 4749,
    rating: 4.9,
    sales: 792,
    theme: { from: "#1e3a8a", to: "#2f5fd0", ink: "light" },
    icon: "store",
    tagline: "On-Demand Home-Cooked Food Marketplace",
    chips: ["Customer App", "Chef App", "Admin Panel", "Rider Panel"],
    summary:
      "A multi-vendor marketplace connecting home chefs with nearby customers, with commissions, live order tracking and chef onboarding.",
    version: "3.0.2",
    releaseDate: "21-06-2024",
    lastUpdate: "05-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "wellness-quiz-nutrition-trivia-game",
    name: "Wellness Quiz",
    title: "Wellness Quiz - Nutrition & Health Trivia Quiz Game - Flutter Full App + Admin Panel",
    type: "app",
    category: "education-lms",
    featured: true,
    price: 3799,
    oldPrice: 4749,
    rating: 4.8,
    sales: 2187,
    theme: { from: "#be185d", to: "#ec4899", ink: "light" },
    icon: "brain",
    tagline: "Nutrition Trivia Quiz App with Admin Panel",
    chips: ["Quiz App", "Web Version", "Admin Panel"],
    summary:
      "A gamified nutrition and health trivia app with daily contests, battles, leaderboards, coins and an admin panel to manage questions.",
    version: "4.2.0",
    releaseDate: "08-01-2023",
    lastUpdate: "20-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "eyoga-online-yoga-fitness-course-lms",
    name: "eYoga",
    title: "eYoga - Online Yoga & Fitness Course Learning Management System LMS | Flutter App",
    type: "app",
    category: "education-lms",
    featured: true,
    price: 2799,
    oldPrice: 9449,
    rating: 5.0,
    sales: 110,
    theme: { from: "#4c1d95", to: "#7c3aed", ink: "light" },
    icon: "yoga",
    tagline: "Smart Learning for Yoga & Fitness Instructors",
    chips: ["Application", "Website", "Admin Panel"],
    summary:
      "Sell yoga, pilates and fitness courses online with video lessons, live classes, certificates and instructor revenue sharing.",
    version: "1.4.0",
    releaseDate: "19-02-2026",
    lastUpdate: "15-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "cliniccare-saas-dietitian-clinic-management",
    name: "ClinicCare SaaS",
    title: "ClinicCare SaaS - Dietitian & Wellness Clinic Management System with Patient App",
    type: "app",
    category: "business-service",
    featured: true,
    price: 6599,
    oldPrice: 7585,
    rating: 4.9,
    sales: 1009,
    theme: { from: "#134e4a", to: "#0f766e", ink: "light" },
    icon: "clinic",
    tagline: "Multi-Clinic Management for Dietitians & Coaches",
    chips: ["Patient App", "Staff App", "Clinic Web", "Super Admin"],
    summary:
      "A SaaS platform for dietitians and wellness clinics: appointments, diet charts, progress tracking, invoicing and multi-branch subscriptions.",
    version: "2.6.1",
    releaseDate: "11-05-2024",
    lastUpdate: "22-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "healthfeed-health-news-blog-app",
    name: "HealthFeed",
    title: "HealthFeed - Health News & Wellness Blog App for Android and iOS with Website",
    type: "app",
    category: "health-fitness",
    featured: true,
    price: 2799,
    oldPrice: 3749,
    rating: 4.8,
    sales: 1079,
    theme: { from: "#0b1f4b", to: "#1e3a8a", ink: "light" },
    icon: "news",
    tagline: "Stay Informed, Stay Healthy. News App & Website",
    chips: ["Admin Panel", "Application", "Website"],
    summary:
      "Publish health news, wellness articles and expert videos with breaking alerts, categories, bookmarks and AdMob monetisation.",
    version: "3.4.0",
    releaseDate: "30-09-2023",
    lastUpdate: "10-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "razorpay-payment-gateway-addon-freshcart",
    name: "Razorpay Add-on",
    title: "Razorpay Payment Gateway Add-on for FreshCart",
    type: "addon",
    category: "add-ons",
    isNew: true,
    price: 999,
    theme: { from: "#eef2f7", to: "#f8fafc", ink: "dark" },
    icon: "card",
    tagline: "Configure Razorpay for Subscription Plans & Paid Orders",
    chips: ["Secure Payment", "Fast Transaction", "Grow your Business"],
    summary: "Accept UPI, cards and wallets in FreshCart with the Razorpay add-on, including subscription payments.",
    version: "1.0.0",
    releaseDate: "12-09-2026",
    lastUpdate: "12-09-2026",
    platform: "Laravel 11",
    techStack: ["Laravel", "PHP 8.2"],
    integrations: ["Razorpay API"],
  },
  {
    slug: "cashfree-payment-gateway-addon-homechef",
    name: "Cashfree Add-on",
    title: "Cashfree Payment Gateway Add-on for HomeChef",
    type: "addon",
    category: "add-ons",
    isNew: true,
    price: 999,
    theme: { from: "#eef2f7", to: "#f8fafc", ink: "dark" },
    icon: "card",
    tagline: "Enable Cashfree for Chef Payouts & Customer Orders",
    chips: ["Secure Payment", "Fast Transaction", "Grow your Business"],
    summary: "Add Cashfree payments and automated chef payouts to your HomeChef marketplace.",
    version: "1.0.0",
    releaseDate: "18-09-2026",
    lastUpdate: "18-09-2026",
    platform: "Laravel 11",
    techStack: ["Laravel", "PHP 8.2"],
    integrations: ["Cashfree API"],
  },
  {
    slug: "recipebox-recipe-sharing-cooking-community",
    name: "RecipeBox",
    title: "RecipeBox - Healthy Recipe Sharing & Cooking Community Flutter App",
    type: "app",
    category: "health-fitness",
    price: 1799,
    oldPrice: 3599,
    rating: 4.5,
    sales: 280,
    theme: { from: "#1c1917", to: "#44403c", ink: "light" },
    icon: "recipe",
    tagline: "The Healthy Recipe Community App",
    chips: ["Recipes", "Meal Planner", "Shopping List"],
    summary: "A recipe-sharing community with nutrition facts per serving, meal planner, shopping lists and creator profiles.",
    version: "1.2.0",
    releaseDate: "04-04-2025",
    lastUpdate: "02-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "meddose-pharmacy-medicine-delivery",
    name: "MedDose",
    title: "MedDose | Single and Multi Pharmacy Medicine Delivery App with Flutter, PWA & Admin",
    type: "app",
    category: "ecommerce-marketplace",
    price: 1799,
    oldPrice: 9149,
    rating: 5.0,
    sales: 52,
    theme: { from: "#0369a1", to: "#0ea5e9", ink: "light" },
    icon: "pill",
    tagline: "Your Multi-Pharmacy Marketplace, Simplified",
    chips: ["Customer App", "Website", "Admin Panel", "Partner Panel"],
    summary: "Prescription upload, medicine search, refill reminders and multi-pharmacy delivery in one platform.",
    version: "1.1.0",
    releaseDate: "22-07-2026",
    lastUpdate: "20-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "juicebar-smoothie-juice-ordering-app",
    name: "JuiceBar",
    title: "JuiceBar - Complete Smoothie & Juice Ordering Solution with Flutter Customer App",
    type: "app",
    category: "business-service",
    price: 1799,
    oldPrice: 9149,
    rating: 5.0,
    sales: 103,
    theme: { from: "#ca8a04", to: "#f59e0b", ink: "dark" },
    icon: "cup",
    tagline: "Order-Ahead App for Juice & Smoothie Bars",
    chips: ["Customer App", "Store App", "Admin Panel"],
    summary: "Let customers build custom smoothies, order ahead, earn loyalty points and pick up without the queue.",
    version: "1.0.5",
    releaseDate: "15-05-2026",
    lastUpdate: "08-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "greenmart-multi-vendor-organic-marketplace",
    name: "GreenMart",
    title: "GreenMart - All-in-One Multi-Vendor Multi-Module Organic Products Marketplace",
    type: "app",
    category: "ecommerce-marketplace",
    price: 3799,
    oldPrice: 4749,
    rating: 4.8,
    sales: 835,
    theme: { from: "#b45309", to: "#f59e0b", ink: "light" },
    icon: "leaf",
    tagline: "Multi-Vendor, Multi-Module Organic eCommerce Platform",
    chips: ["Customer App", "Seller App", "Admin Panel", "Website"],
    summary: "A multi-vendor organic marketplace for farm produce, supplements and eco products with seller payouts.",
    version: "2.3.0",
    releaseDate: "09-12-2024",
    lastUpdate: "14-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
  {
    slug: "gympro-gym-membership-trainer-booking",
    name: "GymPro",
    title: "GymPro - Gym Membership & Personal Trainer Booking System with Member | Trainer Apps",
    type: "app",
    category: "health-fitness",
    price: 3799,
    oldPrice: 4749,
    rating: 4.9,
    sales: 505,
    theme: { from: "#065f46", to: "#10b981", ink: "light" },
    icon: "dumbbell",
    tagline: "Streamline Gym Management. Engage Every Member",
    chips: ["Member App", "Trainer App", "Admin Panel", "Front Desk"],
    summary: "Memberships, class schedules, trainer bookings, attendance via QR and workout plans for gyms and studios.",
    version: "1.6.2",
    releaseDate: "27-08-2025",
    lastUpdate: "16-09-2026",
    platform: "Flutter 3.x",
    techStack: appStack,
    integrations: appIntegrations,
  },
];

/** Product → Higgsfield photo (public/images). Add-ons keep their SVG artwork. */
const productImages: Record<string, string> = {
  "freshcart-All-in-One-grocery-organic-food-delivery": "grocery",
  "nutriplan-ai-diet-planner-calorie-tracker": "diet",
  "fitbite-healthy-meal-subscription-tiffin-service": "tiffin",
  "homechef-multi-vendor-home-cooked-food-marketplace": "cooking",
  "wellness-quiz-nutrition-trivia-game": "rainbow",
  "eyoga-online-yoga-fitness-course-lms": "yoga",
  "cliniccare-saas-dietitian-clinic-management": "clinic",
  "healthfeed-health-news-blog-app": "morning",
  "recipebox-recipe-sharing-cooking-community": "hero",
  "meddose-pharmacy-medicine-delivery": "clinic",
  "juicebar-smoothie-juice-ordering-app": "juice",
  "greenmart-multi-vendor-organic-marketplace": "farm",
  "gympro-gym-membership-trainer-booking": "gym",
};
for (const p of products) {
  const img = productImages[p.slug];
  if (img) p.image = `/images/${img}.webp`;
}

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const discountOf = (p: Product) =>
  p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

export const featuredApps = products.filter((p) => p.featured && p.type === "app").slice(0, 8);
/** Home "Our Kits" row: ready-made app kits that aren't already in Featured Products. */
export const productKits = products.filter((p) => !p.featured && p.type === "app").slice(0, 4);

export const categoryLabel = (key: CategoryKey) => categories.find((c) => c.key === key)?.label ?? key;
