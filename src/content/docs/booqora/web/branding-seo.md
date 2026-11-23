---
title: Branding, Images & SEO
description: Change the Marketing Website colours, fonts, logo, icons and URLs, and understand its metadata, JSON-LD, sitemap, robots.txt and Open Graph image.
---

The Marketing Website ships with the Booqora purple brand, which is shared with the Rental Platform and the Mobile App. This page lists every place you need to touch to make it yours.

## Site settings — `src/lib/site.ts`

```ts title="src/lib/site.ts"
export const PLATFORM_URL = "https://<your-platform-site>.web.app";

export const site = {
  name: "Booqora",
  legalName: "Booqora",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://<your-project-id>.web.app").replace(/\/$/, ""),
  tagline: "Rental software, beautifully simple",
  description: "Booqora is rental management software for rental businesses. …",
  email: "support@yourdomain.com",
  loginUrl: `${PLATFORM_URL}/login`,
  signupUrl: `${PLATFORM_URL}/signup`,
  privacyUrl: `${PLATFORM_URL}/privacy`,
  trialDays: 14,
  currency: "INR",
} as const;
```

| Key | What it does |
|---|---|
| `PLATFORM_URL` | Base of the **Log in**, **Start free trial** and **Privacy policy** links. Set it to your Rental Platform URL or custom domain ([Custom Domains & SSL](doc:installation/domains)) |
| `url` | Public URL of the website, used for canonical links, Open Graph URLs, JSON-LD and the sitemap. Comes from `NEXT_PUBLIC_SITE_URL`, falling back to the default shown |
| `name`, `legalName`, `tagline`, `description` | Organisation name and default description (meta tags and JSON-LD) |
| `email` | Footer and contact page address, and the target of the contact form |
| `trialDays` | Shown on the contact page ("Start a 14-day free trial") |
| `currency` | `priceCurrency` of the plan offers in JSON-LD |

The package ships with the author's URLs (`booqora-platform.web.app` and `booqora-infidec.web.app`). Replace both with yours.

### NEXT_PUBLIC_SITE_URL

Set it when you build, so canonical tags and the sitemap use your real domain:

```bash title="Terminal"
# macOS / Linux
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com npm run build
```

```powershell title="PowerShell"
$env:NEXT_PUBLIC_SITE_URL = "https://www.yourdomain.com"; npm run build
```

The value is baked into the static files at build time, so **rebuild and redeploy** after changing it. `scripts/postbuild-seo.mjs` reads the same variable for `sitemap.xml` and `robots.txt`.

:::note Set it in the shell, not only in a .env file
`next build` would also read a `.env.production` file, but the post-build script runs with plain Node and only sees real environment variables. Set the variable in the shell (as above) so pages, sitemap and robots.txt agree — or simply change the fallback URL in both `src/lib/site.ts` and `scripts/postbuild-seo.mjs`.
:::

:::warning Hard-coded URLs
Three places show the platform address directly instead of reading `site.ts`. Update them too:
- `src/app/not-found.tsx` — the "Log in here" link.
- `src/app/page.tsx` — the example store address shown in the online-store section.
- `src/components/ui-kit.tsx` — the default address bar text of `BrowserFrame`.
:::

## Colours and fonts

Colours are Tailwind 4 theme tokens in `src/app/globals.css`:

| Token | Default | Used for |
|---|---|---|
| `--color-violet` / `--primary` | `#6431dd` | Buttons, links, accents |
| `--color-violet-bright` | `#7b3ff2` | Button shine, gradients |
| `--color-indigo` | `#351db1` | Deep accent, secondary text |
| `--color-lavender` | `#c2a3f9` | Highlights on dark backgrounds, selection |
| `--color-ink` / `--foreground` | `#1c0938` | Body text |
| `--color-night`, `--color-night-2` | `#120526`, `#1b0a4a` | Dark sections |
| `--color-haze`, `--color-mist`, `--color-line` | `#efe9fd`, `#f7f5fc`, `#e6e1f0` | Soft backgrounds and borders |

The hero background (`.bg-aurora`), gradient text (`.text-gradient`, `.text-gradient-light`) and the button shine (`.btn-shine`) have their colours written inside the class in the same file. Search `globals.css` for `#6431dd` and `#7b3ff2` to catch them all. The browser theme colour is `themeColor: "#1a0638"` in `viewport` in `src/app/layout.tsx`.

Fonts are loaded in `src/app/layout.tsx` with `next/font/google`: **Plus Jakarta Sans** for headings (`--font-jakarta`) and **Inter** for body text (`--font-inter`). To change a font, import a different Google font there and keep the same variable names, or update `--font-sans`, `--font-heading` and `--font-display` in `globals.css`.

## Logo and icons

| File | Used for |
|---|---|
| `public/logo-mark.png` | Header and footer logo (36 × 36 next to the word "Booqora"), Organization and Article JSON-LD logo |
| `src/app/icon.png` | Favicon |
| `src/app/apple-icon.png` | Apple touch icon |
| `public/og.png` | Social sharing image, 1200 × 630 |

The word next to the logo is text in the `Logo` component in `src/components/ui-kit.tsx`. Next.js picks up `icon.png` and `apple-icon.png` automatically; keep the file names.

## Metadata

`src/app/layout.tsx` sets the defaults for every page: the title template `"%s | Booqora"`, description, keywords, Open Graph (`locale: "en_IN"`, `og.png`), Twitter `summary_large_image` card and robots rules. Each page then sets its own `title`, `description` and `alternates.canonical`. Feature, industry and blog pages build theirs from the content files with `generateMetadata`.

If you rename the product, search the whole `src/` folder for "Booqora": the name also appears in page titles, Open Graph titles and copy.

## Structured data (JSON-LD)

| Where | Types |
|---|---|
| Every page (`layout.tsx`) | `Organization`, `WebSite`, `SoftwareApplication` with one `Offer` per plan |
| Every inner page | `BreadcrumbList` (`breadcrumbLd()` in `sections.tsx`) |
| Pages with FAQs (home, pricing, mobile app, feature and industry pages) | `FAQPage` (`faqLd()`, added by `FaqSection`) |
| Blog posts | `Article` with date, keywords and publisher logo |

Test a page with Google's Rich Results Test after you deploy.

## Sitemap and robots.txt

There is no `sitemap.ts` route. After `next build`, `scripts/postbuild-seo.mjs` walks `out/`, collects every exported `.html` page (skipping the 404 page) and writes:

- `out/sitemap.xml` — one `<url>` per page with today's date and a priority: home `1.0`, `/pricing` and `/features` `0.9`, feature, industry and mobile-app pages `0.8`, blog `0.6`, everything else `0.5`.
- `out/robots.txt` — allows all crawlers and points to `<site URL>/sitemap.xml`.

New pages are included automatically. Submit `https://www.yourdomain.com/sitemap.xml` in Google Search Console once the site is live.

**Next:** [Build & Deploy →](doc:web/deployment)
