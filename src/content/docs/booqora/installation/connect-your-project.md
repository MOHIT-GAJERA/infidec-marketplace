---
title: Connect the Code to Your Project
description: Point the Booqora Rental Platform, Mobile App, Cloud Functions and Marketing Website at your own Firebase project and Hosting sites.
---

The package ships configured for the author's Firebase project **`booqora-infidec`**, with the Rental Platform on the Hosting site **`booqora-platform`** and the Marketing Website on **`booqora-infidec`**. This page replaces every one of those references with your own. Do it once, before the first deploy.

:::note What is and is not secret
The values in `firebase_options.dart`, `google-services.json` and `GoogleService-Info.plist` are **public identifiers**, not secrets. Access is enforced by the security rules. Secret keys (payments, SMTP) never go in these files; see [Secrets & Environment](doc:installation/environment-configuration).
:::

## 1. Select your project in `.firebaserc`

Edit `booqora_platform/.firebaserc`. Replace the project ID and map the `platform` Hosting target to the site you created in [Create the Firebase Project](doc:installation/firebase-project#6-create-the-hosting-sites):

```json title="booqora_platform/.firebaserc"
{
  "projects": {
    "default": "<your-project-id>"
  },
  "targets": {
    "<your-project-id>": {
      "hosting": {
        "platform": ["<your-platform-site-id>"]
      }
    }
  }
}
```

Or let the CLI write it for you:

```bash title="Terminal"
cd booqora_platform
firebase use --add                     # pick your project, alias "default"
firebase target:apply hosting platform <your-platform-site-id>
```

Do the same in `booqora_website/.firebaserc`, mapping the `website` target to the site that will serve the Marketing Website:

```bash title="Terminal"
cd booqora_website
firebase use --add
firebase target:apply hosting website <your-website-site-id>
```

## 2. Generate `firebase_options.dart` for the platform

The Rental Platform is web-only. Its `lib/firebase_options.dart` contains a single `web` configuration. Regenerate it for your project:

```bash title="Terminal"
cd booqora_platform
flutterfire configure --project=<your-project-id> --platforms=web
```

When asked, choose an existing web app or let the CLI create one. The command overwrites `lib/firebase_options.dart`; `main.dart` already calls `Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform)`, so nothing else changes.

You can also copy the values by hand from **Project settings → Your apps → Web app → SDK setup and configuration** into the `FirebaseOptions(...)` block: `apiKey`, `appId`, `messagingSenderId`, `projectId`, `authDomain` and `storageBucket`.

## 3. Configure the Mobile App

Change the package name and bundle ID **first** ([Change Package Name](doc:app/change-package-name)), then run FlutterFire in the app folder:

```bash title="Terminal"
cd booqora_mobile
flutterfire configure --project=<your-project-id> --platforms=android,ios
```

This registers the Android and iOS apps (if they do not exist yet) and rewrites:

| File | What it holds |
|---|---|
| `booqora_mobile/lib/firebase_options.dart` | `android`, `ios` and `web` options; the app initialises Firebase from this file |
| `booqora_mobile/android/app/google-services.json` | Android client config |
| `booqora_mobile/ios/Runner/GoogleService-Info.plist` | iOS client config |

More detail in [Mobile App → Firebase Setup](doc:app/firebase-setup).

## 4. Replace the hard-coded web addresses

A few places contain the author's public URLs. Change them to your platform address (your `*.web.app` site now, or your custom domain later):

| File | What to change |
|---|---|
| `booqora_platform/functions/index.js` | `ALLOWED_RETURN`: the origins allowed as Stripe/PayPal return URLs. Replace `https://booqora-platform.web.app` and `https://booqora-platform.firebaseapp.com` with your platform origins; keep `http://localhost` for local testing |
| `booqora_mobile/lib/core/browser.dart` | `Browser.origin`: used for store links, product share links and calendar links in the app |
| `booqora_mobile/lib/data/payments.dart` | `Payments.returnUrl`: `https://<your-platform-domain>/pay/return` |
| `booqora_website/src/lib/site.ts` | `PLATFORM_URL` (log-in, sign-up and privacy links) and the default `url` (or set `NEXT_PUBLIC_SITE_URL`) |
| `booqora_website/scripts/postbuild-seo.mjs` | The default `SITE` (used for `sitemap.xml` and `robots.txt`) unless you set `NEXT_PUBLIC_SITE_URL` |
| `booqora_website/src/app/not-found.tsx`, `src/app/page.tsx`, `src/components/ui-kit.tsx` | Display links and mock-up URLs that mention `booqora-platform.web.app` |
| `.github/workflows/deploy.yml` | `--project booqora-infidec`, `projectId: booqora-infidec` and the environment `url`. See [Auto-Deploy with GitHub Actions](doc:installation/ci-cd) |

The Rental Platform itself builds its links from the browser's current address (`window.location.origin`), so it needs no change.

:::warning Forgetting `ALLOWED_RETURN` breaks Stripe and PayPal
`createPayment` rejects any `returnUrl` that does not start with an allowed origin, with the error *"returnUrl is not allowed"*. Razorpay is unaffected because it does not redirect.
:::

## 5. Check for leftovers

Search the source for the old IDs. Ignore `build/`, `out/`, `node_modules/` and `.dart_tool/`:

```bash title="Terminal"
grep -rn "booqora-infidec\|booqora-platform" \
  --exclude-dir={node_modules,build,out,.dart_tool,.git} .
```

Only comments should remain.

**Next:** [Secrets & Environment →](doc:installation/environment-configuration)
