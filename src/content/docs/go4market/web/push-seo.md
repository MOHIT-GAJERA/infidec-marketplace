---
title: Web Push & SEO
description: Browser push notifications on the website with firebase-messaging-sw.js and registerPushToken, plus the website's SEO setup.
---

## Web push

1. Signed-in customers see a small **Turn on notifications** card. Tapping it shows the browser's permission prompt; dismissing it is remembered.
2. With permission granted, the site gets an FCM token (Firebase's default VAPID key) and calls `registerPushToken` with `platform: 'web'`. The server subscribes it to the `all` and `customers` topics, because browsers cannot subscribe to topics themselves.
3. While the tab is open, messages show in the page. When it is closed, `web/firebase-messaging-sw.js` shows them, and clicking opens `/orders/<id>` (or the campaign link).

Requirements:

- `web/firebase-messaging-sw.js` contains **your** web Firebase config and is served from the site root (it is, by default, with `no-cache` headers).
- The site is served over **HTTPS** (Firebase Hosting always is).
- The domain is in Authentication → Authorized domains.

:::note Browser support
Push works in Chrome, Edge, Firefox and Android browsers. Safari on iOS supports web push only for sites added to the Home Screen.
:::

## SEO

| Piece | Where |
|---|---|
| Default title, description, Open Graph and Twitter tags, JSON-LD | `apps/website/web/index.html` |
| Per-page titles and canonical URLs | Set at runtime by `web_bridge.dart` as visitors navigate |
| SEO defaults stored for the platform | Admin → Settings → SEO |
| Category SEO | Admin → Catalogue → Categories (meta title, description, keywords) |
| Sitemap | `/sitemap.xml`, rewritten to the `sitemap` Cloud Function ([SEO, Sitemap & Social Links](doc:admin/seo-social)) |
| Robots | `web/robots.txt` with the sitemap URL |

:::tip Flutter Web and search engines
Google renders JavaScript and indexes Flutter Web pages, but some social networks and smaller crawlers read only the static HTML. That is why the tags in `index.html` matter: make them describe your marketplace well.
:::

**Next:** [Build & Deploy →](doc:web/deployment)
