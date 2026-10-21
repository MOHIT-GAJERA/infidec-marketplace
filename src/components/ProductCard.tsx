import Image from "next/image";
import Link from "next/link";
import { BadgePercent, ShoppingCart, Star } from "lucide-react";
import { discountOf, type Product } from "@/data/products";
import { Price } from "./Price";

type Props = {
  product: Product;
  /** Heading level used for the card title so the page outline stays sequential. */
  headingLevel?: "h2" | "h3";
  eager?: boolean;
  /** Optional inline (data URI) source for above-the-fold cards. */
  src?: string;
};

export function ProductCard({ product: p, headingLevel = "h3", eager = false, src }: Props) {
  const off = discountOf(p);
  const Heading = headingLevel;
  const href = `/products/${p.slug}`;

  return (
    <article className="group relative flex flex-col [contain-intrinsic-size:auto_420px] [content-visibility:auto] overflow-hidden rounded-xl border border-line bg-white shadow-card transition-shadow hover:shadow-float">
      <div className="relative aspect-[2/1] overflow-hidden bg-gray-100">
        {/* A finished marketing banner (bannerArt) always wins over the generated inline thumbnail */}
        {p.image && (!src || p.bannerArt) ? (
          <>
            <Image
              src={p.image}
              alt={`${p.name} – ${p.tagline}`}
              width={p.bannerArt ? 923 : 1280}
              height={p.bannerArt ? 470 : 723}
              quality={60}
              sizes="(min-width: 1280px) 340px, (min-width: 640px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
            />
            {!p.bannerArt && (
              <>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                <span
                  aria-hidden="true"
                  className="absolute bottom-2.5 left-2.5 rounded-lg bg-white/95 px-2.5 py-1 text-[13px] font-semibold text-brand-800 shadow-sm"
                >
                  {p.name}
                </span>
              </>
            )}
          </>
        ) : (
          <Image
            src={src ?? `/thumbs/${p.slug}.svg`}
            alt={`${p.name} preview`}
            width={680}
            height={340}
            sizes="(min-width: 1280px) 340px, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            decoding={eager ? "sync" : "async"}
          />
        )}
        {off > 0 && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-lg bg-sale px-2.5 py-1 text-[13px] font-semibold text-white shadow-sm">
            <BadgePercent aria-hidden="true" className="size-3.5" />
            {off}% off
          </span>
        )}
        {p.isNew && (
          <span className="absolute bottom-0 left-0 rounded-tr-lg bg-brand-600 px-2.5 py-1 text-[13px] font-semibold text-white">
            + New
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-3">
        <Heading className="line-clamp-2 min-h-[3.5rem] text-lg leading-7 font-semibold text-ink">
          <Link href={href} prefetch={false} className="after:absolute after:inset-0 hover:text-brand-600 focus-visible:outline-none">
            {p.title}
          </Link>
        </Heading>
        {p.rating ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Star aria-hidden="true" className="size-4 fill-rating text-rating" />
            <span className="font-semibold text-ink">
              <span className="sr-only">Rated </span>
              {p.rating.toFixed(1)}
              <span className="sr-only"> out of 5</span>
            </span>
            <span aria-hidden="true" className="size-1 rounded-full bg-gray-300" />
            <span>{p.sales} sales</span>
          </p>
        ) : (
          <p className="mt-2 h-5" aria-hidden="true" />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-4">
        <p className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-brand-600">
            <span className="sr-only">Price </span>
            <Price inr={p.price} />
          </span>
          {p.oldPrice && (
            <s className="text-sm text-muted">
              <span className="sr-only">Original price </span>
              <Price inr={p.oldPrice} />
            </s>
          )}
        </p>
        <Link
          href={href}
          prefetch={false}
          className="btn-dark relative z-10 px-3.5 py-2 text-[15px]"
        >
          <ShoppingCart aria-hidden="true" className="size-[18px]" />
          Buy Now<span className="sr-only">: {p.name}</span>
        </Link>
      </div>
    </article>
  );
}
