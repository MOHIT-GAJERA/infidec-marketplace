---
title: Deployment
description: Build the static export, understand the flatten-segments step, and deploy to the Firebase Hosting target `web` with its rewrites and your own domain.
---

The website is plain static files. There is no Node.js server to run: you build `web/out` and upload it to Firebase Hosting. The API stays in the `api` Cloud Function, reached through a Hosting rewrite on the same domain.

## 1. Build

```bash
cd web
npm run build
```

`npm run build` runs two commands:

| Step | Output |
|---|---|
| `next build` | Static export (`output: "export"` in `next.config.ts`) to `web/out`: one `.html` per page, the `_` placeholder pages for dynamic routes, `sitemap.xml`, `robots.txt`, `404.html`, and `_next/static/` assets |
| `node scripts/flatten-segments.mjs` | Copies the router's segment files to the file names the browser asks for (see below). Prints `flatten-segments: wrote N dotted segment file(s)` |

Before building, check `src/lib/firebase.ts` (your Firebase config), and `FUNCTION_API` and `SITE_URL` in `src/lib/config.ts` — the sitemap is generated from them at build time ([Installation Steps](doc:web/installation-steps)).

### Why flatten-segments is needed

With a static export, Next.js 16 writes client-navigation payloads as nested folders, e.g. `__next.dashboard/verification/__PAGE__.txt`, while the client router requests the dotted form `__next.dashboard.verification.__PAGE__.txt`. Without the dotted copies, every in-app link click falls back to a full page reload. The script walks `out/`, finds every `__next.*` folder and writes the dotted copies next to it. Always deploy the output of `npm run build`, not of `next build` alone.

## 2. Firebase Hosting target

Hosting is configured in the root `firebase.json` with two targets, `web` and `admin`. `.firebaserc` maps each target to a Hosting site:

```json title=".firebaserc"
{
  "projects": { "default": "your-project-id" },
  "targets": {
    "your-project-id": {
      "hosting": {
        "web": ["your-web-site-id"],
        "admin": ["your-admin-site-id"]
      }
    }
  }
}
```

If you have not set this up yet (also covered in [Hosting, Domain & SSL](doc:installation/hosting)):

```bash
# from the project root
firebase use your-project-id
firebase hosting:sites:create your-web-site-id          # skip if you use the default site
firebase target:apply hosting web your-web-site-id
```

The default site of a project has the same id as the project, e.g. `your-project-id.web.app`.

## 3. Hosting configuration

```json title="firebase.json (hosting target web)"
{
  "target": "web",
  "public": "web/out",
  "cleanUrls": true,
  "trailingSlash": false,
  "ignore": ["firebase.json", "**/.*", "**/debug.log", "**/node_modules/**"],
  "rewrites": [
    { "source": "/api/**", "function": { "functionId": "api", "region": "us-central1" } },
    { "source": "/ad/**", "destination": "/ad/_.html" },
    { "source": "/category/**", "destination": "/category/_.html" },
    { "source": "/blog/**", "destination": "/blog/_.html" },
    { "source": "/jobs/**", "destination": "/jobs/_.html" },
    { "source": "/seller/**", "destination": "/seller/_.html" },
    { "source": "/page/**", "destination": "/page/_.html" },
    { "source": "/dashboard/ads/**", "destination": "/dashboard/ads/_/edit.html" }
  ],
  "headers": [
    { "source": "/_next/static/**",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }
  ]
}
```

### Hosting rewrites

| Rule | Purpose |
|---|---|
| `/api/**` → function `api` | The website calls same-origin `/api/v1/...`. No CORS, no separate API domain |
| `/ad/**`, `/category/**`, `/blog/**`, `/jobs/**`, `/seller/**`, `/page/**` | Serve the `_` placeholder page for every slug ([File Structure](doc:web/file-structure#dynamic-routes)) |
| `/dashboard/ads/**` | Serves the edit page for `/dashboard/ads/<id>/edit` |

Static files win over rewrites, so `/blog` (the list, `blog.html`) and `/jobs` still load their own pages. `cleanUrls` serves `login.html` at `/login`. Hashed assets under `/_next/static/` are cached for a year.

:::warning Keep the function region in sync
The rewrite targets `api` in `us-central1`. If you deploy the function to another region, change `region` here (and in the `admin` target) to match.
:::

## 4. Deploy

```bash
# from the project root
firebase deploy --only hosting:web
```

Deploy the backend first if it changed (`firebase deploy --only functions`). The Admin Panel is deployed separately with `hosting:admin` ([Admin Panel Installation](doc:installation/admin-panel)).

Every deploy creates a new Hosting release. Roll back from **Firebase console → Hosting → (site) → Release history**.

### Test the build locally

```bash
firebase emulators:start --only hosting     # serves web/out on http://localhost:5000
```

## Custom domain

:::steps
### Add the domain in Firebase Hosting

**Firebase console → Hosting → your web site → Add custom domain** — add `www.yourcompany.com` (and the bare `yourcompany.com`, set to redirect to `www` if you like). Create the DNS records Firebase shows. The SSL certificate is issued automatically, usually within an hour.

### Authorize the domain for sign-in

**Authentication → Settings → Authorized domains → Add domain** — add every domain the website runs on. Google sign-in popups only work on authorized domains.

### Point the site URL and payment returns to it

- Set `SITE_URL` in `src/lib/config.ts` (or `NEXT_PUBLIC_SITE_URL`) to `https://www.yourcompany.com`, then rebuild and deploy so the sitemap, `robots.txt` and JSON-LD use the new domain.
- Set `frontend_url` in Firestore `settings/general` to `https://www.yourcompany.com`, so Stripe, Razorpay and PayPal return buyers to your domain ([Plans, Featured Ads & Checkout](doc:web/checkout)).
:::

## After deploying

- The home page shows your categories and ads.
- Open an ad, then reload the page: it still loads (rewrite works).
- Click around the header and dashboard: pages change without a full reload (flatten-segments worked).
- `https://www.yourcompany.com/api/v1/health` returns `{ "success": true, … }`.
- `https://www.yourcompany.com/sitemap.xml` lists your own domain.
- Buy a plan with a live gateway (or the sandbox on a test project) and come back to *Payment successful*.
- Disable **Sandbox (Test)** in **Settings → Payment Gateways** before launch.

**Next:** [App Prerequisites →](doc:app/prerequisites)
