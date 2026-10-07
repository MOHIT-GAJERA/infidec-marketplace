import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Returns a product thumbnail as an inline data URI (read at build time).
 * Used only for above-the-fold (LCP) images so they paint with the first frame
 * instead of waiting on a separate request.
 */
export function thumbDataUri(slug: string): string {
  try {
    const svg = readFileSync(join(process.cwd(), "public", "thumbs", `${slug}.svg`), "utf8");
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  } catch {
    return `/thumbs/${slug}.svg`;
  }
}
