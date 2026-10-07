type Props = { data: Record<string, unknown> | Record<string, unknown>[] };

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for "<" to prevent breaking out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
