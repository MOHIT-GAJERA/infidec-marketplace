---
title: Connect the Code to Your Project
description: Replace the default go4market project ID, Firebase options, Google client ID and site URLs with your own before you build anything.
---

The package is pre-configured for the original `go4market` Firebase project. Before you deploy or build, point every part of it at **your** project. This takes about 15 minutes. Use your editor's *Find in files* for `go4market` to double-check at the end.

## 1. Firebase CLI project and hosting sites

Edit `.firebaserc` at the repository root. The keys under `targets` must be your project ID, and each hosting target maps to a **site ID**:

```json title=".firebaserc"
{
  "projects": { "default": "<your-project-id>" },
  "targets": {
    "<your-project-id>": {
      "hosting": {
        "website": ["<your-project-id>"],
        "admin": ["<your-project-id>-admin"],
        "seller": ["<your-project-id>-seller"],
        "delivery": ["<your-project-id>-delivery"]
      }
    }
  }
}
```

You create the three extra sites in [Build & Deploy the Web Apps](doc:installation/hosting#1-create-the-hosting-sites). Site IDs are global across Firebase; if one is taken, pick another (for example `yourmarket-admin-panel`) and use it here and in the URLs below.

Also update the `--project` flag in `functions/package.json` (`deploy` and `logs` scripts).

## 2. Firebase options for every Flutter client

All Flutter clients (website, panels and both apps) initialise Firebase from **one file**:

```dart title="packages/g4m_core/lib/src/firebase_options.dart"
class G4MFirebaseOptions {
  static const _apiKeyWeb = '<web apiKey>';
  static const _apiKeyAndroid = '<Android API key from google-services.json>';
  static const _projectId = '<your-project-id>';
  static const _senderId = '<messagingSenderId>';
  static const _bucket = '<your-project-id>.firebasestorage.app';

  static const web = FirebaseOptions(
    apiKey: _apiKeyWeb,
    appId: '<web appId 1:…:web:…>',
    messagingSenderId: _senderId,
    projectId: _projectId,
    authDomain: '<your-project-id>.firebaseapp.com',
    storageBucket: _bucket,
  );

  static const androidCustomer = FirebaseOptions(
    apiKey: _apiKeyAndroid,
    appId: '<customer app id 1:…:android:…>',
    // …
  );

  static const androidPartner = FirebaseOptions(
    apiKey: _apiKeyAndroid,
    appId: '<partner app id 1:…:android:…>',
    // …
  );
}
```

Take the web values from the web app's `firebaseConfig`. Take the Android `appId` (`mobilesdk_app_id`) and API key (`current_key`) from each app's `google-services.json`.

:::note iOS is not pre-configured
`forClient()` returns the web options in the browser and the Android options everywhere else. To ship on iOS, register iOS apps in Firebase, add `GoogleService-Info.plist` to each `ios/Runner`, and add iOS `FirebaseOptions` to this file.
:::

## 3. Web push service workers

Browsers read the Firebase config for background push from a service worker at the site root. Update the `firebase.initializeApp({...})` block in **both** files with your web config:

- `apps/website/web/firebase-messaging-sw.js`
- `apps/panel/web/firebase-messaging-sw.js` (copied into each panel build by `tool/build_all.ps1`)

## 4. Google sign-in client ID

The apps need the **Web client ID** from Authentication → Sign-in method → Google (or Google Cloud → Credentials → *Web client (auto created by Google Service)*):

| File | Constant |
|---|---|
| `apps/customer_app/lib/core/social_auth.dart` | `webClientId` |
| `apps/partner_app/lib/core/social_auth.dart` | `kGoogleServerClientId` |

Use the **web** client ID, not an Android client ID. Android uses it as `serverClientId` so that the ID token is issued for Firebase Auth.

## 5. Site URLs

The default addresses are `https://go4market.web.app`, `https://go4market-admin.web.app`, `https://go4market-seller.web.app` and `https://go4market-delivery.web.app`. Replace them with yours (the `*.web.app` addresses now, or your custom domains later):

| File | What to change |
|---|---|
| `functions/.env` | `WEBSITE_URL`, `ADMIN_URL`, `SELLER_URL`, `DELIVERY_URL` (payment return URLs and push links). See [Secrets & functions/.env](doc:installation/environment-configuration) |
| `functions/src/seo/index.ts` | `const SITE` (sitemap URLs) |
| `functions/src/triggers/orders.ts` | `orderUrl` in the order e-mails (two places) |
| `apps/website/lib/core/web_bridge.dart` | `kSiteUrl` (canonical URLs, share links) |
| `apps/website/lib/ui/shell.dart` | `kSellerUrl`, `kDeliveryUrl` ("Sell on Go4Market" / "Join as a rider" links) |
| `apps/website/web/index.html` | `og:url`, `og:image`, canonical and JSON-LD URLs, title and description |
| `apps/website/web/robots.txt` | `Sitemap:` line |
| `apps/panel/lib/features/seller/seller_pages.dart` | `_registerUrl` (rider invite link: Delivery panel `/register`) |
| `apps/panel/lib/features/shared/a_invoice.dart` | Footer text on printed invoices |
| `apps/customer_app/lib/screens/link_router.dart` | Host that opens internally instead of in a browser |
| `apps/customer_app/lib/screens/product/product_detail_screen.dart` | Product share URL |
| `apps/customer_app/lib/screens/profile/info_screens.dart` | Refer & Earn share text |

## 6. Seed script

Edit `tools/seed/seed.mjs` (see [Seed Demo Data](doc:installation/seed-data)): `BUCKET`, `projectId` in `initializeApp`, the service-account file name, and the default `settings/platform` values (app name, contact e-mail and phone, address, `storeUrls`).

## 7. Checklist

- [x] `.firebaserc` and `functions/package.json` use `<your-project-id>`
- [x] `firebase_options.dart` has your web and Android values
- [x] Both `firebase-messaging-sw.js` files have your web config
- [x] Both `social_auth.dart` files have your web client ID
- [x] Site URLs replaced (functions, website, panel, customer app)
- [x] A search for `go4market.web.app` and `'go4market'` finds only text you intend to keep

**Next:** [Secrets & functions/.env →](doc:installation/environment-configuration)
