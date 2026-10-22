---
title: API Configuration
description: Point the mobile app at your backend with API_BASE_URL, set SITE_ORIGIN for in-app payments, and use the in-app Server settings sheet.
---

The app needs two addresses:

1. **API base URL**: the host that serves `/api/mobile/*`, `/api/menu`, `/api/payment` and `/api/reservations/availability`. On Firebase this is your **API Hosting site** (for example `https://yourrestaurant-1a2b3.web.app`), where Firebase Hosting rewrites `/api/**` to the `api` Cloud Function. The admin site serves the same `/api/**` paths, so you can use either host.
2. **Site origin**: your public website (for example `https://www.yourrestaurant.com`). The app loads the Razorpay / Stripe payment page under this origin.

Every request path in the app is absolute (`/api/mobile/auth/login`, `/api/menu`, …). Set the base URL to the **host only**, with no `/api` suffix and no trailing slash.

## Set the default in code

Both values are compile-time constants in **`lib/core/api.dart`**:

```dart title="lib/core/api.dart"
/// Default backend = the Firebase `api` function behind Hosting (same /api/mobile/* contract as before).
const kDefaultBaseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: 'https://yourrestaurant-1a2b3.web.app');

/// Public website origin — the payment page is loaded under it (gateways check the domain).
const kSiteOrigin = String.fromEnvironment('SITE_ORIGIN', defaultValue: 'https://www.yourrestaurant.com');
```

The source code ships with `defaultValue`s that point to **our demo backend and demo website**. Replace both with your own hosts before you build a release. Otherwise your app will show our demo restaurant.

## Or pass them at build time

`--dart-define` overrides the `defaultValue` for one build. You do not need to edit the file:

```bash
flutter build appbundle --release \
  --dart-define=API_BASE_URL=https://yourrestaurant-1a2b3.web.app \
  --dart-define=SITE_ORIGIN=https://www.yourrestaurant.com
```

The same flags work with `flutter run` (see [Run the App](doc:app/run-the-app)).

:::tip Use HTTPS in production
Firebase Hosting serves HTTPS only. Keep `http://` for local testing against your PC. The Android manifest allows cleartext traffic (`usesCleartextTraffic="true"`) only so that LAN tests work. You may remove it for production builds.
:::

## In-app Server settings

Testers can switch servers without a new build. Tap the **Server settings** icon (tune icon, top right) on the first screen or on the login screen, or open **Profile → Server address**. This opens the **Server address** sheet (*"The admin backend shared by all three apps."*):

| Control | What it does |
|---|---|
| **Base URL** | Full URL of the backend, e.g. `http://192.168.1.10:8787` |
| **Use default server** | Puts the built-in `API_BASE_URL` back into the field |
| **Save** | Trailing slashes are removed. A value without a scheme is rejected: *"Enter a full URL, e.g. http://192.168.1.10:33664"* |

The saved value is stored on the phone (`SharedPreferences` key `baseUrl`). It **takes priority over the built-in default**, even after an app update. If a phone keeps talking to an old server, open the sheet, tap **Use default server** and then **Save**.

:::warning One backend for all three apps
Customer, Restaurant and Owner modes share the same base URL. A tester who changes it on the Customer login also changes it for the Restaurant and Owner apps on that phone.
:::

## SITE_ORIGIN and payments

When a customer pays online, the app calls `POST /api/payment` on the API host. It then shows the gateway's checkout page in a WebView whose base URL is `SITE_ORIGIN`. Use the domain that you registered with Razorpay and Stripe (your website domain). The domain does not have to serve any special page. See [In-App Payments](doc:app/payments).

## Images

Menu images come from each item's **Image URL**. The app also rewrites two kinds of address. A relative path (`/api/uploads/…`) is loaded from the configured base URL. A `localhost` or `127.0.0.1` host is replaced with the configured server. Images uploaded in the Admin Panel (`/api/uploads/<file>` on your API host) therefore work without any extra setting.

## Error messages you may see

| Message | Meaning |
|---|---|
| *Cannot reach the server at … Check your connection or server address.* | Wrong base URL, no network, or a LAN server that the phone cannot reach |
| *The server is taking too long to respond. Please try again.* | Timeout. The first call after an idle period can be slow while the function starts (cold start) |
| *Request failed (404)* | The URL is reachable but has no `/api/**` rewrite (for example the website domain) |

**Next:** [Change Package Name →](doc:app/change-package-name)
