---
title: Build & Deploy to Hosting
description: Build the Booqora Rental Platform (with the Online Store) as a Flutter Web release and deploy it to Firebase Hosting, then publish the Marketing Website.
---

Booqora has two web front ends, each on its own Firebase Hosting site:

| Front end | Hosting target | Folder | Output |
|---|---|---|---|
| **Rental Platform** + **Online Store** + `/pay/return` + `/privacy` | `platform` | `booqora_platform/` | `build/web` |
| **Marketing Website** | `website` | `booqora_website/` | `out/` |

Make sure you have mapped both targets to your own sites in [Connect the Code](doc:installation/connect-your-project#1-select-your-project-in-firebaserc).

## 1. Build the Rental Platform

```bash title="Terminal"
cd booqora_platform
flutter pub get
flutter analyze --no-fatal-infos     # optional, the same check CI runs
flutter build web --release
```

The build lands in `booqora_platform/build/web`. It includes everything in `web/`, so the privacy policy (`web/privacy.html`) is published at `/privacy`. Edit that file with your company's details before going live.

:::tip Path URLs
The platform uses clean path URLs (`/orders/12`, `/s/my-store`) through `usePathUrlStrategy()` in `main.dart`. The Hosting config rewrites every path to `index.html`, so deep links and page refreshes work.
:::

## 2. Deploy the Rental Platform

```bash title="Terminal"
firebase deploy --only hosting:platform --project <your-project-id>
```

The platform is now live at `https://<your-platform-site-id>.web.app`. Your Online Store will be at `https://<your-platform-site-id>.web.app/s/<store-slug>` once a workspace exists.

What `firebase.json` configures for this site:

| Setting | Value |
|---|---|
| `public` | `build/web` |
| `rewrites` | `**` → `/index.html` (single-page app) |
| `cleanUrls` / `trailingSlash` | `true` / `false` |
| Long cache | `js`, `wasm`, `css`, fonts and images: `public, max-age=31536000, immutable` |
| No cache | `index.html`, `flutter_service_worker.js`, `flutter_bootstrap.js`, `version.json`, `manifest.json`, `main.dart.js` |
| Security headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |

The no-cache rule on the entry files means users get a new release on their next page load without clearing the browser cache.

## 3. Build and deploy the Marketing Website

The website is a **Next.js static export**. Set its public URL, build and deploy from its own folder:

```bash title="Terminal"
cd ../booqora_website
npm install
NEXT_PUBLIC_SITE_URL=https://<your-website-domain> npm run build
firebase deploy --only hosting:website --project <your-project-id>
```

On Windows PowerShell set the variable first with `$env:NEXT_PUBLIC_SITE_URL = "https://<your-website-domain>"`.

`npm run build` runs `next build` and then `scripts/postbuild-seo.mjs`, which writes `sitemap.xml` and `robots.txt` into `out/`. Full details, including editing content and branding, are in [Marketing Website → Build & Deploy](doc:web/deployment).

## 4. Check the result

- [ ] `https://<your-platform-site-id>.web.app/login` shows the Booqora sign-in page
- [ ] `https://<your-platform-site-id>.web.app/signup` shows **Start your 14-day free trial**
- [ ] `https://<your-platform-site-id>.web.app/privacy` shows the privacy policy
- [ ] The Marketing Website's **Log in** and **Start free trial** buttons open your platform (they use `PLATFORM_URL` in `src/lib/site.ts`)

:::warning A blank page or "permission denied" after sign-in
Check that you deployed the Firestore rules ([Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#2-deploy-the-security-rules-and-indexes)) and that `lib/firebase_options.dart` points at your project. A wrong `projectId` signs users into one project and reads data from another.
:::

## Rolling back

Every deploy is a release. In **Hosting → your site → Release history**, choose an earlier release and click **Rollback** to restore it instantly.

**Next:** [Create Your First Workspace →](doc:installation/first-workspace)
