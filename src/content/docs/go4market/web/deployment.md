---
title: Build & Deploy
description: Build the website with Flutter Web and deploy it to Firebase Hosting, including caching headers, the sitemap rewrite and custom domains.
---

## Build

```bash
cd apps/website
flutter pub get
flutter build web --release
# → apps/website/build/web
```

## Deploy

From the repository root:

```bash
firebase deploy --only hosting:website --project <your-project-id>
```

The `website` target in `firebase.json` serves `apps/website/build/web` with:

| Rule | Purpose |
|---|---|
| `cleanUrls: true` and `** → /index.html` | Single-page app routing (deep links such as `/p/toned-milk` work) |
| `/sitemap.xml → function sitemap (asia-south1)` | Live XML sitemap |
| Long cache (`max-age=31536000, immutable`) for JS, WASM, images, fonts, JSON | Fast repeat visits |
| `no-cache` for `index.html`, `flutter_bootstrap.js`, `flutter_service_worker.js`, `firebase-messaging-sw.js`, `main.dart.js`, `version.json` | New releases are picked up on the next load |
| `X-Content-Type-Options`, `Referrer-Policy` | Security headers |

## Preview channels

Test a build at a temporary URL before going live:

```bash
firebase hosting:channel:deploy preview --only website --expires 7d --project <your-project-id>
```

Add the preview domain to Authentication → Authorized domains if you want to test sign-in there.

## Custom domain

Connect `yourmarket.com` to the default Hosting site and update the URLs as described in [Custom Domains & SSL](doc:installation/domains).

## Release checklist

- [x] `web/index.html` meta tags, `og-image.jpg`, favicon and manifest are yours
- [x] `kSiteUrl`, `kSellerUrl`, `kDeliveryUrl` point to your domains
- [x] `firebase-messaging-sw.js` has your Firebase config
- [x] `WEBSITE_URL` in `functions/.env` matches the live domain
- [x] Sitemap submitted in Google Search Console

**Next:** [Changelog →](doc:changelog)
