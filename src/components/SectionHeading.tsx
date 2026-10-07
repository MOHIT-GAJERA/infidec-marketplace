import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  cta?: { href: string; label: string };
};

/** Left-aligned section title with optional round icon and black CTA (as in the design). */
export function SectionHeading({ id, title, description, icon, cta }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id={id} className="flex items-center gap-3 text-2xl font-semibold text-ink sm:text-[30px]">
          {icon && (
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-600 text-white">
              {icon}
            </span>
          )}
          {title}
        </h2>
        <p className="mt-2.5 max-w-xl text-base leading-6 text-body">{description}</p>
      </div>
      {cta && (
        <Link href={cta.href} className="btn-dark shrink-0 self-start px-5 py-3 text-base sm:self-auto sm:text-lg">
          {cta.label}
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      )}
    </div>
  );
}

export function CenterHeading({
  id,
  title,
  description,
  eyebrow,
  tone = "light",
}: {
  id: string;
  title: string;
  description?: string;
  eyebrow?: string;
  /** "dark" renders white text for use over dark backgrounds. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow && (
        <p className={`mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase ${dark ? "text-brand-200" : "text-brand-600"}`}>
          <span aria-hidden="true">✦</span>
          {eyebrow}
          <span aria-hidden="true">✦</span>
        </p>
      )}
      <h2 id={id} className={`text-2xl font-semibold sm:text-[32px] sm:leading-tight ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {description && <p className={`mt-4 text-base leading-7 ${dark ? "text-white/85" : "text-body"}`}>{description}</p>}
    </div>
  );
}
