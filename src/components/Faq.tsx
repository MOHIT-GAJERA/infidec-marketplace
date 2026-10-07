import { ChevronDown } from "lucide-react";
import { JsonLd } from "./JsonLd";

export type FaqItem = { q: string; a: string };

/** Zero-JS accordion built on <details>, with FAQPage structured data. */
export function Faq({ items, withSchema = true }: { items: FaqItem[]; withSchema?: boolean }) {
  return (
    <>
      <div className="space-y-4">
        {items.map((f, i) => (
          <details
            key={f.q}
            open={i === 0}
            className="group rounded-xl border border-line bg-white shadow-card [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink">
              <h3 className="text-base font-semibold">{f.q}</h3>
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-line px-5 py-4 text-[15px] leading-7 text-body">{f.a}</div>
          </details>
        ))}
      </div>
      {withSchema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
      )}
    </>
  );
}
