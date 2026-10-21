import { redirect } from "next/navigation";

/** /docs/<product>/docs has no page of its own – start at the introduction. */
export default async function DocsIndex({ params }: PageProps<"/docs/[product]/docs">) {
  const { product } = await params;
  redirect(`/docs/${product}/docs/intro`);
}
