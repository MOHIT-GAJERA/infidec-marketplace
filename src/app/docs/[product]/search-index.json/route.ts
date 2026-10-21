import { searchIndex } from "@/lib/docs/content";
import { docsProducts, getDocsProduct } from "@/lib/docs/products";

/** Static search index for the docs search dialog: /docs/<product>/search-index.json */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(docsProducts).map((product) => ({ product }));
}

export async function GET(_req: Request, ctx: RouteContext<"/docs/[product]/search-index.json">) {
  const product = getDocsProduct((await ctx.params).product);
  if (!product) return new Response("Not found", { status: 404 });
  return Response.json(searchIndex(product), { headers: { "Cache-Control": "public, max-age=3600" } });
}
