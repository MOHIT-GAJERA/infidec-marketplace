---
title: File Structure
description: Where everything lives in apps/website, covering the router, pages, shared UI, data layer, localisation and the web folder.
---

```text title="apps/website/"
lib/
  main.dart                 Firebase init (initG4MFirebase(G4MClient.website)), language controller, MaterialApp.router
  app/router.dart           go_router routes, redirects and deferred (lazy-loaded) pages
  core/
    shop.dart               session, cart, settings and modules state (guest vs signed in)
    data.dart               Firestore queries used by pages
    cart_merge.dart         merge a guest cart into the account on sign-in
    payment_flow.dart       Razorpay / Stripe / PayPal hand-off and confirmPayment
    push.dart               web push permission card, registerPushToken
    web_bridge.dart         JS interop: Razorpay Checkout.js, page title/canonical, local storage; kSiteUrl
  pages/                    home, catalog (categories, category), product, search, store, cart,
                            orders, wallet, account, wishlist, content (blog, FAQ, pages), auth,
                            payment_return, not_found
  ui/
    shell.dart              header, module tabs, footer, language picker; kSellerUrl, kDeliveryUrl
    kit.dart, product_widgets.dart, address_form.dart, maps.dart, voice.dart, markdown.dart, gate.dart, lazy.dart
  l10n/
    l10n.dart               languages (en, hi, gu, ar), RTL, formatting, runtime overrides
    s_*.dart                strings per area (account, auth, cart, catalog, common, content, home, orders, product)
assets/fonts/               Plus Jakarta Sans (bundled for the web)
web/
  index.html                title, meta, Open Graph, JSON-LD, splash
  firebase-messaging-sw.js  background push (your web Firebase config goes here)
  manifest.json, favicon.png, icons/, og-image.jpg, robots.txt
pubspec.yaml
```

Shared models, repositories, the brand theme and the Firebase options come from `packages/g4m_core`.

## Where to change common things

| To change… | Edit |
|---|---|
| Brand colours, font | `packages/g4m_core/lib/src/theme/brand.dart`, `theme.dart` |
| Logo in the header/footer | `lib/ui/shell.dart` (and the images you reference) |
| Footer links, social icons | `lib/ui/shell.dart`; social URLs come from Admin → Settings → Social links |
| A text | The matching `lib/l10n/s_*.dart` file (all four languages) |
| Site URL used for canonical/share links | `kSiteUrl` in `lib/core/web_bridge.dart` |
| Page title, description, share image for crawlers | `web/index.html`, `web/og-image.jpg` |
| A route | `lib/app/router.dart` |

**Next:** [Configuration & Branding →](doc:web/configuration)
