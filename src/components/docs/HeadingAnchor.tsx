import { Link2 } from "lucide-react";

/** "#" link shown next to a heading on hover / focus, so a section can be shared. */
export function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      className="ml-2 inline-flex translate-y-[-1px] align-middle text-gray-400 opacity-0 transition group-hover:opacity-100 hover:text-[var(--doc-accent-ink)] focus-visible:opacity-100"
      aria-label="Link to this section"
    >
      <Link2 aria-hidden="true" className="size-4" />
    </a>
  );
}
