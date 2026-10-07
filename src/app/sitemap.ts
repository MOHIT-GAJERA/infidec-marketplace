import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { infoPages } from "@/data/pages";
import { absUrl } from "@/lib/site";

const toDate = (d: string) => {
  const [dd, mm, yy] = d.split("-").map(Number);
  return new Date(Date.UTC(yy, mm - 1, dd));
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const core: MetadataRoute.Sitemap = [
    { url: absUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absUrl("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absUrl("/installation"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absUrl("/contact-us"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: absUrl("/faqs"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: absUrl(`/products/${p.slug}`),
    lastModified: toDate(p.lastUpdate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const info: MetadataRoute.Sitemap = Object.keys(infoPages).map((slug) => ({
    url: absUrl(`/${slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));
  return [...core, ...productUrls, ...info];
}
