import { qwikmartProduct } from "./qwikmart.ts"; // explicit extension: scripts/generate-thumbs.mts loads this file with Node
import { go4foodieProduct } from "./go4foodie.ts";
import { go4rideProduct } from "./go4ride.ts";
import { classiadshubProduct } from "./classiadshub.ts";
import { go4marketProduct } from "./go4market.ts";

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
  | "headphones"
  | "taxi"
  | "megaphone";

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

export const products: Product[] = [
  qwikmartProduct,
  go4marketProduct,
  go4foodieProduct,
  go4rideProduct,
  classiadshubProduct,
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const discountOf = (p: Product) =>
  p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

export const featuredApps = products.filter((p) => p.featured && p.type === "app").slice(0, 8);
/** Home "Our Kits" row: ready-made app kits that aren't already in Featured Products. */
export const productKits = products.filter((p) => !p.featured && p.type === "app").slice(0, 4);

export const categoryLabel = (key: CategoryKey) => categories.find((c) => c.key === key)?.label ?? key;
