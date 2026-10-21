import Image from "next/image";
import type { ShowcaseSection } from "@/data/product-content";

/**
 * Image-led product story for premium product pages: a sticky chip navigation and one block per section
 * (label, heading, intro and full-width marketing images). Images are 1848 px wide and lazy-loaded.
 */
export function ProductShowcase({ name, sections }: { name: string; sections: ShowcaseSection[] }) {
  return (
    <div id="features" className="scroll-mt-24">
      <nav aria-label={`${name} feature sections`} className="sticky top-20 z-20 -mx-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <ul className="flex gap-2 overflow-x-auto">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="inline-flex rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-brand-600 hover:text-brand-600"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 space-y-14">
        {sections.map((s, si) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-40">
            <p className="text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">{s.label}</p>
            <h2 id={`${s.id}-title`} className="mt-2 text-2xl leading-tight font-semibold text-ink sm:text-[28px]">
              {s.title}
            </h2>
            {s.intro && <p className="mt-2 max-w-3xl text-[15px] leading-7 text-body">{s.intro}</p>}
            <div className="mt-5 space-y-5">
              {s.images.map((im, ii) => (
                <figure key={im.src}>
                  <Image
                    src={im.src}
                    alt={im.alt}
                    width={im.width}
                    height={im.height}
                    quality={75}
                    sizes="(min-width: 1480px) 920px, (min-width: 1024px) 62vw, 100vw"
                    loading={si === 0 && ii === 0 ? "eager" : "lazy"}
                    className="h-auto w-full rounded-[22px] shadow-card ring-1 ring-black/5"
                  />
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
