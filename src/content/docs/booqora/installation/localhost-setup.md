---
title: Localhost Setup
description: Run the Booqora Rental Platform, the Marketing Website and optionally the Cloud Functions emulator on your own computer.
---

You can run every part of Booqora locally while you customise it. By default the local platform talks to your **real** Firebase project (Firestore, Auth, Storage and the deployed functions), which is the quickest way to see your changes with real data.

## Run the Rental Platform

```bash title="Terminal"
cd booqora_platform
flutter pub get
flutter run -d chrome
```

Flutter opens Chrome on a random `localhost` port. Hot reload (<kbd>r</kbd>) and hot restart (<kbd>R</kbd>) work in the terminal. To keep the same port between runs, which is handy for bookmarks:

```bash title="Terminal"
flutter run -d chrome --web-port 5000
```

Useful URLs on your local run:

| URL | Page |
|---|---|
| `http://localhost:5000/login` | Sign in |
| `http://localhost:5000/signup` | Create an account and workspace |
| `http://localhost:5000/s/<store-slug>` | Your Online Store |
| `http://localhost:5000/?a11y` | Any page with the accessibility tree switched on (used for automated QA) |

:::note Payments on localhost
`http://localhost` is in the functions' `ALLOWED_RETURN` list, so Stripe and PayPal test payments return to your local `/pay/return` page. Razorpay Checkout opens in the page and works locally too. Use **test keys** while developing.
:::

`localhost` is an authorised domain in Firebase Authentication by default, so sign-in works without extra setup.

## Run a release build locally

To check performance and the exact production behaviour, build and serve the release output:

```bash title="Terminal"
flutter build web --release
firebase serve --only hosting:platform --port 5000
```

`firebase serve` uses the same rewrites and headers as the live site.

## Run the Marketing Website

```bash title="Terminal"
cd booqora_website
npm install
npm run dev
```

Next.js serves the site at `http://localhost:3000` with fast refresh. See [Marketing Website Overview](doc:web/overview).

## Run the Mobile App

Connect a phone or start an emulator, then:

```bash title="Terminal"
cd booqora_mobile
flutter pub get
flutter run
```

See [Run the App](doc:app/run-the-app).

## Optional: the Functions emulator

You only need the emulator if you change `functions/index.js` and want to test before deploying. The client code calls the **deployed** functions in `asia-south1`; it does not switch to the emulator on its own.

:::steps
### Add local secrets
Create `booqora_platform/functions/.secret.local` with your **test** values, one `NAME=value` per line, for the eight secrets in [Secrets & Environment](doc:installation/environment-configuration). It is git-ignored and never deployed.

### Start the emulator
```bash title="Terminal"
cd booqora_platform
firebase emulators:start --only functions
```
The functions are served on port `5001`.

### Point the platform at it
Temporarily change the `_fn` line in the `Payments` class of `lib/data/payments.dart`:

```dart title="lib/data/payments.dart (local testing only)"
static final _fn = FirebaseFunctions.instanceFor(region: 'asia-south1')
  ..useFunctionsEmulator('localhost', 5001);
```

Remove it before you build for production.
:::

:::warning The emulator still writes to your real Firestore
With only the Functions emulator running, `verifyPayment`, `sendEmail` and `onOnlineOrder` use the Admin SDK against your **live** Firestore project. Use a test workspace, or also start the Firestore emulator and connect the platform to it with `FirebaseFirestore.instance.useFirestoreEmulator('localhost', 8080)`.
:::

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank page, console shows a Firebase `projectId` error | Regenerate `lib/firebase_options.dart` for your project ([Connect the Code](doc:installation/connect-your-project)) |
| "Missing or insufficient permissions" | Deploy the Firestore rules ([Deploy Functions, Rules & Indexes](doc:installation/backend-deploy)) |
| Payment buttons say keys are not configured | The secrets are missing or the functions were not redeployed after setting them |
| "returnUrl is not allowed" | Add your origin to `ALLOWED_RETURN` in `functions/index.js` and redeploy |

**Next:** [Auto-Deploy with GitHub Actions →](doc:installation/ci-cd)
