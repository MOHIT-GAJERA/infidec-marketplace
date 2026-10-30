---
title: Configuration & Branding
description: Point the website at your Firebase project, set its URLs, and re-brand the index.html, icons, manifest and splash.
---

The website has **no `.env` file**. Its configuration is compiled in from a few Dart files and the static `web/` folder; business settings come live from Firestore.

## 1. Firebase project

The Firebase web config is in `packages/g4m_core/lib/src/firebase_options.dart` (`G4MFirebaseOptions.web`), shared with the panels. Put your web app's values there ([Connect the Code](doc:installation/connect-your-project#2-firebase-options-for-every-flutter-client)), and the same values in `apps/website/web/firebase-messaging-sw.js`.

## 2. URLs

| Constant | File | Default |
|---|---|---|
| `kSiteUrl` | `lib/core/web_bridge.dart` | `https://go4market.web.app` |
| `kSellerUrl`, `kDeliveryUrl` | `lib/ui/shell.dart` | `https://go4market-seller.web.app`, `https://go4market-delivery.web.app` |

The server-side `WEBSITE_URL` in `functions/.env` must match the address customers use, because Stripe and PayPal return to `<WEBSITE_URL>/payment/return`.

## 3. `web/index.html`

Edit these before your first public build:

- `<title>` and `<meta name="description">`;
- Open Graph and Twitter tags (`og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`);
- the JSON-LD blocks (Organization, WebSite with search action) with your name, URL and logo;
- the splash colours and label.

Replace `web/og-image.jpg` (1200 × 630), `web/favicon.png`, the PWA icons in `web/icons/` and the names and colours in `web/manifest.json`.

## 4. Live settings (no rebuild)

Everything else comes from Firestore and changes instantly:

| What | Admin page |
|---|---|
| App name, contact details, address | Settings → Platform settings |
| Modules, colours, order | Settings → Modules |
| Home sliders, offers, featured sections, popups | Marketing |
| Payment methods | Settings → Payment gateways |
| Delivery speeds, fees, slots | Delivery → Delivery settings |
| Social icons | Settings → Social links |
| Languages offered | Settings → Languages |
| Legal pages, blog, FAQ | Content |

## 5. Rebuild

```bash
cd apps/website
flutter build web --release
firebase deploy --only hosting:website --project <your-project-id>
```

**Next:** [Languages & RTL →](doc:web/languages-rtl)
