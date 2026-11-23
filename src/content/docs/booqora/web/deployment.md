---
title: Build & Deploy
description: Run the Marketing Website locally, build the static export to out/ and deploy it to Firebase Hosting, including the prefetch-file mirroring, headers and a custom domain.
---

## Requirements

- **Node.js 20 or newer** and npm.
- **Firebase CLI** (`npm install -g firebase-tools`), signed in with `firebase login` to the account that owns your Firebase project.
- The Firebase project you created for the Rental Platform ([Create the Firebase Project](doc:installation/firebase-project)). The website can live in the same project.

## Run locally

```bash title="Terminal"
cd booqora_website
npm install
npm run dev
# → http://localhost:3000
```

Edits to pages, components and `src/content/*.ts` reload instantly. `npm run lint` runs ESLint.

## Build

```bash title="Terminal"
cd booqora_website
npm run build
# → booqora_website/out
```

`npm run build` runs two things:

1. `next build` — pre-renders every route to HTML in `out/`, including one file per feature, industry and blog post (`generateStaticParams`).
2. `node scripts/postbuild-seo.mjs` — writes `out/sitemap.xml` and `out/robots.txt` and mirrors the prefetch files (below). It prints how many files it mirrored and how many URLs went into the sitemap.

Set `NEXT_PUBLIC_SITE_URL` in the same shell **before** you build if the site has a custom domain ([Branding, Images & SEO](doc:web/branding-seo#nextpublicsiteurl)).

## Why a static export?

`next.config.ts` sets `output: "export"`. Every page is plain HTML, CSS and JavaScript, so:

- Firebase Hosting serves it from its CDN with no server, Cloud Run service or function to pay for or maintain.
- The site cannot go down because of a backend problem, and it loads fast everywhere.

The trade-off is that server-only Next.js features are not available: no API routes, server actions, middleware or on-demand image optimisation (`images.unoptimized: true`). The site does not need them — content is compiled in at build time and the contact form uses `mailto:`.

## The prefetch-file mirroring

When a visitor hovers a link, the Next.js client router prefetches the next page's data with a **dotted** file name, for example `/pricing/__next.pricing.__PAGE__.txt`. The static export writes those files **nested** instead (`/pricing/__next.pricing/__PAGE__.txt`). On Firebase Hosting the dotted request would return 404 and the router would fall back to a full page load.

The second half of `postbuild-seo.mjs` fixes this: it finds every `__next.*` folder in `out/` and copies each file inside it to the dotted name next to it. Always build with `npm run build` (not `npx next build` alone) so this step runs.

## Connect it to your Firebase project

The website has its own `firebase.json` and `.firebaserc` in `booqora_website/`. The package points at the author's project, so change it to yours.

:::steps
### Choose the Hosting site
Use your project's default site (its ID is your project ID, `<your-project-id>.web.app`) or create a new one:

```bash title="Terminal"
firebase hosting:sites:create <your-website-site-id> --project <your-project-id>
```

### Update .firebaserc
```json title="booqora_website/.firebaserc"
{
  "projects": { "default": "<your-project-id>" },
  "targets": {
    "<your-project-id>": {
      "hosting": { "website": ["<your-website-site-id>"] }
    }
  }
}
```
You can also let the CLI write the mapping: `firebase target:apply hosting website <your-website-site-id>`.

### Make sure the platform uses a different site
The Rental Platform's own `.firebaserc` maps the `platform` target to its site. The two must be **different** sites, or one deploy will replace the other ([Build & Deploy to Hosting](doc:installation/hosting)).
:::

## Deploy

From `booqora_website/`:

```bash title="Terminal"
npm run build
firebase deploy --only hosting:website --project <your-project-id>
```

The CLI prints the Hosting URL when it finishes. The repository's GitHub Actions workflow builds and deploys only the Rental Platform ([Auto-Deploy with GitHub Actions](doc:installation/ci-cd)), so deploy the website with this command whenever you change it.

The `website` target in `firebase.json` serves `out/` with:

| Rule | Purpose |
|---|---|
| `cleanUrls: true`, `trailingSlash: false` | `/pricing` serves `pricing.html`; no trailing slashes |
| `/_next/static/**` → `max-age=31536000, immutable` | Hashed JS and CSS are cached for a year |
| Images and fonts → `max-age=604800` | One-week cache for `.png`, `.jpg`, `.webp`, `.svg`, `.ico`, `.woff`, `.woff2` |
| `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` | Security headers on every response |

There is no catch-all rewrite: unknown URLs get the exported 404 page.

### Preview channels

Test a build at a temporary URL before going live:

```bash title="Terminal"
firebase hosting:channel:deploy preview --only website --expires 7d --project <your-project-id>
```

## Custom domain

1. In the Firebase console open **Hosting**, choose the website's site and click **Add custom domain** (for example `www.yourdomain.com`). Add the DNS records it shows and wait for the SSL certificate ([Custom Domains & SSL](doc:installation/domains)).
2. Rebuild with `NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com` so canonical tags, JSON-LD and `sitemap.xml` use the domain, then deploy again.
3. If the Rental Platform also moves to its own domain (for example `app.yourdomain.com`), update `PLATFORM_URL` in `src/lib/site.ts` and the hard-coded links listed in [Branding, Images & SEO](doc:web/branding-seo).

## Release checklist

- [x] `src/lib/site.ts`: `PLATFORM_URL`, `email` and the fallback `url` are yours
- [x] Logo, `icon.png`, `apple-icon.png` and `og.png` replaced
- [x] Plans in `catalog.ts` match **Settings → Account and billing** in the platform
- [x] Screenshots in `public/shots` show your brand
- [x] `.firebaserc` points at your project and website site
- [x] Built with `NEXT_PUBLIC_SITE_URL` set to the live domain
- [x] `sitemap.xml` submitted in Google Search Console

**Next:** [Backend Overview →](doc:api/overview)
