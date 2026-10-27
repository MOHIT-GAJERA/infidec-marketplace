---
title: File Structure
description: Find your way around the website codebase, and understand how dynamic routes work in a static export.
---

```text title="web/"
src/
  app/                        Routes (App Router) — one folder per URL
    layout.tsx                Root layout: Geist font, AuthProvider, Header, Footer, default metadata
    globals.css               Tailwind 4 import + brand colour tokens
    page.tsx                  Home
    search/                   page.tsx (metadata) + view.tsx (results, filters, sort)
    category/[slug]/          page.tsx (exports "_") + view.tsx
    nearby/page.tsx           Ads near you
    ad/[slug]/                Ad detail (exports "_") + JSON-LD Product
    seller/[id]/              Seller profile (exports "_")
    post-ad/page.tsx          Post an Ad form
    login/ register/ verify-otp/ forgot-password/
    dashboard/
      layout.tsx              Login guard + left menu
      page.tsx                Overview
      ads/page.tsx            My Ads
      ads/[id]/edit/          Edit Ad (exports "_")
      favorites/ chat/ notifications/ subscriptions/ transactions/
      reviews/ applications/ verification/ profile/
    checkout/page.tsx         Plan / gateway selection
    checkout/result/page.tsx  Payment verification and result
    blog/ jobs/ page/[key]/   Content pages
    sitemap.ts robots.ts      Generated at build time
    not-found.tsx error.tsx global-error.tsx loading.tsx
  components/
    layout/header.tsx footer.tsx
    home/hero.tsx category-row.tsx app-promo.tsx
    ad-card.tsx               Ad card + grid (used everywhere)
    ad/                       ad-gallery, ad-actions (chat/offer/favourite), report-ad, custom-field-input
    search-filters.tsx        Filter sidebar + sort select
    pagination.tsx            Link-based pagination
    follow-button.tsx  seller/review-form.tsx  job/apply-button.tsx
    auth/auth-shell.tsx       Auth card layout, Field, inputClass
    category-icon.tsx         Emoji per category slug
    ui/                       button.tsx (Button, ButtonLink, Spinner), misc.tsx (Container, Badge, EmptyState…), avatar.tsx
  context/auth-context.tsx    AuthProvider: login, register, Google popup, logout, /auth/me
  lib/
    config.ts                 APP_NAME, FUNCTION_API, API_BASE, SITE_URL
    firebase.ts               Firebase app + Auth (local persistence), authReady
    api.ts                    apiRequest(): envelope unwrap, Bearer token, ApiError
    api.client.ts             clientApi() wrapper
    use-api.ts                useApi() GET hook with loading / error / reload
    use-route-param.ts        Reads a dynamic segment from the browser URL
    types.ts                  Response types (Ad, Category, User, Package…)
    utils.ts                  cn(), mediaUrl(), timeAgo(), routeParam()
public/                       Logos, hero banners, store badges
scripts/flatten-segments.mjs  Post-build fix for client-side navigation
next.config.ts                output: "export", images unoptimized, no trailing slash
```

## Dynamic routes

A static export cannot pre-render every ad or seller. Each dynamic route exports **one** placeholder page with the parameter `_`:

```tsx title="web/src/app/ad/[slug]/page.tsx"
// Exported once as `_`; Firebase Hosting rewrites every /ad/* URL to it.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: "_" }];
}
```

The view then reads the real value from the browser address with `useRouteParam(index)`:

| Route | Placeholder file in `out/` | Segment read |
|---|---|---|
| `/ad/<slug>` | `ad/_.html` | `useRouteParam(1)` |
| `/category/<slug>` | `category/_.html` | `useRouteParam(1)` |
| `/seller/<id>` | `seller/_.html` | `useRouteParam(1)` |
| `/blog/<slug>` | `blog/_.html` | `useRouteParam(1)` |
| `/jobs/<slug>` | `jobs/_.html` | `useRouteParam(1)` |
| `/page/<key>` | `page/_.html` | `useRouteParam(1)` |
| `/dashboard/ads/<id>/edit` | `dashboard/ads/_/edit.html` | `useRouteParam(2)` |

The matching rewrites are in the root `firebase.json` ([Deployment](doc:web/deployment#hosting-rewrites)). To add a new dynamic route, follow the same three steps: export `_` from `page.tsx`, read the segment with `useRouteParam`, and add a rewrite.

:::note Not-found pages return HTTP 200
Because every `/ad/*` URL is served by the same placeholder, an unknown slug loads the page and then shows *Listing not found* (from `PageState`). The HTTP status is 200, not 404.
:::

## Calling the API

```tsx
import { useApi } from "@/lib/use-api";
import { clientApi } from "@/lib/api.client";

const { data, loading, error, reload } = useApi<Ad[]>("/my/ads");          // GET
await clientApi(`/ads/${id}/sold`, { method: "POST" });                   // action
await clientApi("/verification", { method: "POST", formData: fd });       // file upload
```

`apiRequest()` waits for Firebase to restore the session, adds the ID token, sends JSON (or `FormData`), and throws `ApiError` with `status`, `message` and `errors` on failure. `ApiError.fieldError("email")` returns the first error for one field.

## Where to change common things

| Change | File |
|---|---|
| Colours | `src/app/globals.css` |
| Font | `src/app/layout.tsx` |
| Header menu, search, account menu | `src/components/layout/header.tsx` |
| Footer links, contact details, social icons | `src/components/layout/footer.tsx` |
| Hero banners | `public/banner*.png`, `src/components/home/hero.tsx` |
| Ad card | `src/components/ad-card.tsx` |
| Dashboard menu | `NAV` in `src/app/dashboard/layout.tsx` |
| Search filters and sort options | `src/components/search-filters.tsx` |
| API base / site URL | `src/lib/config.ts` |
| Firebase project | `src/lib/firebase.ts` |

**Next:** [Browsing, Search & Nearby →](doc:web/browsing)
