"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, SlidersHorizontal, Star, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useStore } from "./store/StoreProvider";
import { USD_RATE, currencies } from "@/lib/site";
import { categories, type CategoryKey, type Product } from "@/data/products";

type CatFilter = "all" | "featured" | CategoryKey;
type Sort = "newest" | "popular" | "rating" | "price-asc" | "price-desc";

const toTime = (d: string) => {
  const [dd, mm, yy] = d.split("-").map(Number);
  return new Date(yy, mm - 1, dd).getTime();
};

const sortLabels: Record<Sort, string> = {
  newest: "Newest First",
  popular: "Best Selling",
  rating: "Top Rated",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export function ProductsExplorer({
  products,
  inlineThumbs = {},
}: {
  products: Product[];
  /** slug -> data URI for the first cards in the default order (LCP). */
  inlineThumbs?: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CatFilter>("all");
  const [minIn, setMinIn] = useState("");
  const [maxIn, setMaxIn] = useState("");
  const [range, setRange] = useState<{ min?: number; max?: number }>({});
  const [ratings, setRatings] = useState<number[]>([]);
  const [sort, setSort] = useState<Sort>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const { currency } = useStore();
  const symbol = currencies.find((c) => c.code === currency)?.symbol ?? "₹";
  /** Product prices are stored in INR; the price range is typed in the display currency. */
  const toInr = (v: string) => (v ? Number(v) * (currency === "USD" ? USD_RATE : 1) : undefined);

  // Amounts typed in one currency mean nothing in the other, so clear the range on switch.
  /* eslint-disable react-hooks/set-state-in-effect -- reset derived filter state when the currency changes */
  useEffect(() => {
    setMinIn("");
    setMaxIn("");
    setRange({});
  }, [currency]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Read ?q= and ?category= once on mount (keeps the page statically rendered).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const qp = sp.get("q");
    const cp = sp.get("category");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after hydration */
    if (qp) setQ(qp);
    if (cp && (cp === "featured" || categories.some((c) => c.key === cp))) setCat(cp as CatFilter);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Keep the URL shareable (other params such as ?auth= are left untouched).
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (q) sp.set("q", q);
    else sp.delete("q");
    if (cat !== "all") sp.set("category", cat);
    else sp.delete("category");
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, cat]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: products.length, featured: products.filter((p) => p.featured).length };
    for (const c of categories) m[c.key] = products.filter((p) => p.category === c.key).length;
    return m;
  }, [products]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = products.filter((p) => {
      if (cat === "featured" && !p.featured) return false;
      if (cat !== "all" && cat !== "featured" && p.category !== cat) return false;
      if (term && !`${p.title} ${p.name} ${p.tagline} ${p.summary}`.toLowerCase().includes(term)) return false;
      if (range.min !== undefined && p.price < range.min) return false;
      if (range.max !== undefined && p.price > range.max) return false;
      if (ratings.length && !(p.rating && ratings.includes(Math.floor(p.rating)))) return false;
      return true;
    });
    return out.sort((a, b) => {
      switch (sort) {
        case "popular":
          return (b.sales ?? 0) - (a.sales ?? 0);
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return toTime(b.releaseDate) - toTime(a.releaseDate);
      }
    });
  }, [products, q, cat, range, ratings, sort]);

  const applyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    setRange({ min: toInr(minIn), max: toInr(maxIn) });
  };

  const reset = () => {
    setQ("");
    setCat("all");
    setMinIn("");
    setMaxIn("");
    setRange({});
    setRatings([]);
  };

  const catOptions: { key: CatFilter; label: string }[] = [
    { key: "all", label: "All Products" },
    ...categories,
    { key: "featured", label: "Featured Products" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Filters */}
      <aside aria-labelledby="filter-title" className={`${showFilters ? "block" : "hidden"} lg:block`}>
        <div className="rounded-xl border border-line bg-white lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 id="filter-title" className="flex items-center gap-2 text-base font-semibold text-ink">
              <Filter aria-hidden="true" className="size-4" />
              Filter
            </h2>
            <button type="button" onClick={reset} className="text-sm font-medium text-brand-600 hover:underline">
              Reset all
            </button>
          </div>

          <div className="border-b border-line px-5 py-5">
            <h3 className="text-base font-medium text-ink">
              <label htmlFor="filter-search">Search Product</label>
            </h3>
            <input
              id="filter-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Grocery"
              className="field mt-3 py-2.5 text-sm"
            />
          </div>

          <fieldset className="border-b border-line px-5 py-5">
            <legend className="sr-only">Categories</legend>
            <h3 aria-hidden="true" className="text-base font-medium text-ink">
              Categories
            </h3>
            <ul className="mt-3 space-y-2">
              {catOptions.map((c) => {
                const active = cat === c.key;
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCat(c.key)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-[15px] transition-colors ${
                        active
                          ? "border-brand-600 bg-brand-600 font-medium text-white"
                          : "border-line text-ink hover:border-brand-300 hover:bg-brand-50"
                      }`}
                    >
                      {c.label}
                      <span
                        className={`ml-2 rounded-md px-2 py-0.5 text-xs font-semibold ${
                          active ? "bg-white text-brand-700" : "bg-gray-100 text-muted"
                        }`}
                      >
                        {counts[c.key]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <form onSubmit={applyPrice} className="border-b border-line px-5 py-5">
            <h3 className="text-base font-medium text-ink">Price Range ({currency})</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="min-price" className="text-sm text-body">
                  Min
                </label>
                <input
                  id="min-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minIn}
                  onChange={(e) => setMinIn(e.target.value)}
                  placeholder={`${symbol} 0`}
                  className="field mt-1.5 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="text-sm text-body">
                  Max
                </label>
                <input
                  id="max-price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxIn}
                  onChange={(e) => setMaxIn(e.target.value)}
                  placeholder={`${symbol} ${currency === "USD" ? "120" : "9999"}`}
                  className="field mt-1.5 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <button type="submit" className="btn-dark mt-4 w-full">
              Apply
            </button>
          </form>

          <fieldset className="px-5 py-5">
            <legend className="float-left mb-3 w-full text-base font-medium text-ink">Ratings</legend>
            <ul className="clear-both space-y-2.5">
              {[5, 4, 3, 2, 1].map((r) => (
                <li key={r}>
                  <label className="flex cursor-pointer items-center gap-3 py-0.5">
                    <input
                      type="checkbox"
                      checked={ratings.includes(r)}
                      onChange={(e) =>
                        setRatings((prev) => (e.target.checked ? [...prev, r] : prev.filter((x) => x !== r)))
                      }
                      className="size-5 rounded border-gray-400 accent-brand-600"
                    />
                    <span aria-hidden="true" className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${i < r ? "fill-rating text-rating" : "fill-gray-200 text-gray-200"}`}
                        />
                      ))}
                    </span>
                    <span className="text-sm text-ink">
                      ({r})<span className="sr-only"> stars</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>
      </aside>

      {/* Results */}
      <section aria-labelledby="results-title">
        <h2 id="results-title" className="sr-only">
          Products
        </h2>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
          <p className="text-sm text-ink" aria-live="polite">
            Showing <strong className="font-semibold">{list.length}</strong> of{" "}
            <strong className="font-semibold">{products.length}</strong> Products
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="btn-outline px-3 py-2 lg:hidden"
            >
              {showFilters ? <X aria-hidden="true" className="size-4" /> : <SlidersHorizontal aria-hidden="true" className="size-4" />}
              Filters
            </button>
            <label htmlFor="sort" className="hidden text-sm text-ink sm:inline">
              Sort By :
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-brand-600 focus:outline-none sm:w-52"
              aria-label="Sort products"
            >
              {(Object.keys(sortLabels) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  {sortLabels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} eager={i < 2} src={i < 2 ? inlineThumbs[p.slug] : undefined} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-ink">No products match your filters.</p>
            <p className="mt-2 text-body">Try a different keyword or reset the filters.</p>
            <button type="button" onClick={reset} className="btn-primary mt-6">
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
