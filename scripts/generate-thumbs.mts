/**
 * Generates lightweight vector product thumbnails into /public/thumbs.
 * Rendering the artwork as <img> (instead of DOM text) keeps tiny decorative
 * copy out of Lighthouse's "legible font sizes" audit and costs ~3 KB per card.
 *
 * Runs automatically via the `predev` / `prebuild` npm scripts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as lucide from "lucide-static";
import { products, type Product, type ThumbIcon } from "../src/data/products.ts";

const iconMap: Record<ThumbIcon, keyof typeof lucide> = {
  cart: "ShoppingCart",
  salad: "Salad",
  chef: "ChefHat",
  store: "Store",
  brain: "Brain",
  yoga: "PersonStanding",
  clinic: "Stethoscope",
  news: "Newspaper",
  recipe: "CookingPot",
  pill: "Pill",
  leaf: "Leaf",
  card: "CreditCard",
  cup: "CupSoda",
  dumbbell: "Dumbbell",
  spa: "Flower2",
  bike: "Bike",
  sprout: "Sprout",
  droplet: "Droplet",
  moon: "Moon",
  cookie: "Cookie",
  headphones: "Headphones",
  taxi: "CarTaxiFront",
  megaphone: "Megaphone",
};

const W = 680;
const H = 340;
const FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const iconInner = (name: ThumbIcon) => {
  const svg = lucide[iconMap[name]] as string;
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
};

function wrap(text: string, maxChars: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function phone(x: number, y: number, rot: number, p: Product, variant: number) {
  const w = 128;
  const h = 256;
  const c1 = p.theme.ink === "light" ? p.theme.from : "#1e6b16";
  const c2 = p.theme.ink === "light" ? p.theme.to : "#6cb42c";
  const rows = [0, 1, 2, 3]
    .map((i) => {
      const ry = 104 + i * 34;
      return `<rect x="14" y="${ry}" width="26" height="26" rx="6" fill="${i % 2 ? c2 : c1}" opacity=".85"/>
      <rect x="46" y="${ry + 4}" width="${60 - ((i + variant) % 3) * 10}" height="7" rx="3.5" fill="#1f2937" opacity=".75"/>
      <rect x="46" y="${ry + 15}" width="${44 + ((i + variant) % 2) * 12}" height="6" rx="3" fill="#9ca3af"/>`;
    })
    .join("");
  return `<g transform="translate(${x} ${y}) rotate(${rot} ${w / 2} ${h / 2})">
    <rect x="4" y="9" width="${w}" height="${h}" rx="22" fill="#000" opacity=".18"/>
    <rect width="${w}" height="${h}" rx="20" fill="#0b0f19"/>
    <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="16" fill="#ffffff"/>
    <rect x="${w / 2 - 18}" y="10" width="36" height="8" rx="4" fill="#0b0f19"/>
    <rect x="5" y="5" width="${w - 10}" height="86" rx="16" fill="${c1}"/>
    <rect x="5" y="60" width="${w - 10}" height="31" fill="${c1}"/>
    <rect x="14" y="30" width="${variant ? 52 : 70}" height="8" rx="4" fill="#fff" opacity=".95"/>
    <rect x="14" y="44" width="${variant ? 80 : 56}" height="6" rx="3" fill="#fff" opacity=".7"/>
    <rect x="14" y="62" width="${w - 28}" height="18" rx="9" fill="#fff" opacity=".95"/>
    ${rows}
    <rect x="5" y="${h - 32}" width="${w - 10}" height="27" rx="0" fill="#f3f4f6"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${22 + i * 28}" cy="${h - 18}" r="5" fill="${i === 0 ? c1 : "#9ca3af"}"/>`).join("")}
  </g>`;
}

function render(p: Product) {
  const light = p.theme.ink === "light";
  const ink = light ? "#ffffff" : "#0f172a";
  const sub = light ? "rgba(255,255,255,.88)" : "#334155";
  const chipBg = light ? "#ffffff" : "#1e6b16";
  const chipInk = light ? "#0f172a" : "#ffffff";

  const lines = wrap(p.tagline, 24, 3);
  const tagY = 104;
  const tag = lines
    .map((l, i) => `<text x="26" y="${tagY + i * 28}" font-size="22" font-weight="600" fill="${sub}">${esc(l)}</text>`)
    .join("");

  // chips
  let cx = 26;
  let cy = tagY + lines.length * 28 + 6;
  const maxX = 350;
  let chipRows = 1;
  const chips = p.chips
    .map((c) => {
      const w = Math.round(c.length * 8.4 + 22);
      if (cx + w > maxX) {
        if (chipRows >= 2) return "";
        cx = 26;
        cy += 36;
        chipRows++;
      }
      const out = `<rect x="${cx}" y="${cy}" width="${w}" height="28" rx="5" fill="${chipBg}"/>
        <text x="${cx + 11}" y="${cy + 19}" font-size="14.5" font-weight="500" fill="${chipInk}">${esc(c)}</text>`;
      cx += w + 8;
      return out;
    })
    .join("");

  // bottom tool strip
  const strip = Array.from({ length: 12 })
    .map((_, i) => {
      const x = 26 + i * 30;
      const colors = ["#16a34a", "#111827", "#2563eb", "#f97316", "#7c3aed", "#0ea5e9"];
      return `<rect x="${x}" y="296" width="24" height="24" rx="5" fill="#ffffff"/>
        <rect x="${x + 6}" y="302" width="12" height="12" rx="${i % 2 ? 6 : 2}" fill="${colors[i % colors.length]}"/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.theme.from}"/><stop offset="1" stop-color="${p.theme.to}"/>
    </linearGradient>
    <clipPath id="c"><rect width="${W}" height="${H}"/></clipPath>
  </defs>
  <g clip-path="url(#c)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="${W - 60}" cy="-20" r="170" fill="#ffffff" opacity="${light ? 0.08 : 0.5}"/>
    <circle cx="340" cy="${H + 60}" r="140" fill="#ffffff" opacity="${light ? 0.06 : 0.4}"/>
    <rect x="26" y="24" width="42" height="42" rx="11" fill="${light ? "#ffffff" : p.theme.from === "#eef2f7" ? "#1e6b16" : "#ffffff"}"/>
    <g transform="translate(35 33)" fill="none" stroke="${light ? p.theme.from : p.theme.from === "#eef2f7" ? "#ffffff" : "#1e6b16"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconInner(p.icon)}</g>
    <text x="80" y="55" font-size="27" font-weight="700" fill="${ink}">${esc(p.name)}</text>
    ${tag}
    ${chips}
    ${strip}
    ${phone(392, 44, -9, p, 0)}
    ${phone(518, 70, 7, p, 1)}
  </g>
</svg>`;
}

const out = join(import.meta.dirname, "..", "public", "thumbs");
mkdirSync(out, { recursive: true });
for (const p of products) writeFileSync(join(out, `${p.slug}.svg`), render(p).replace(/\n\s*/g, ""));
console.log(`✓ Generated ${products.length} product thumbnails`);
