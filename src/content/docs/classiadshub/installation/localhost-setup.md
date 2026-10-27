---
title: Localhost Setup
description: Run the ClassiAds-Hub website and Admin Panel on your own computer against your deployed backend, serve the static builds locally, and use the Firebase emulators for backend work.
---

The quickest way to work on ClassiAds-Hub locally is to run the **website and the Admin Panel** with the Next.js dev servers, connected to the **`api` function you deployed**. Changes to pages appear instantly, and you see real data. For backend changes you can also run the functions in the Firebase emulator, with the limits listed below.

## Prerequisites

- Node.js 22 and the Firebase CLI ([Requirements](doc:installation/requirements))
- The backend deployed to your project ([Deploy the Backend](doc:installation/backend-deploy))
- Your Firebase web config and project ID in `web/src/lib/firebase.ts`, `web/src/lib/config.ts`, `admin/src/lib/firebase.ts` and `admin/src/lib/api.ts` ([Keys & Environment](doc:installation/environment-configuration))

## 1. Website and Admin Panel dev servers

```bash
cd web
npm install
npm run dev          # http://localhost:3000

cd admin
npm install
npm run dev          # next dev -p 3001 → http://localhost:3001
```

On `localhost` (and `127.0.0.1` for the website) both apps call the function URL directly instead of `/api/v1`:

| App | API address on localhost | Set in |
|---|---|---|
| Website | `https://us-central1-your-project-id.cloudfunctions.net/api/v1` | `FUNCTION_API` in `web/src/lib/config.ts` |
| Admin Panel | `https://us-central1-your-project-id.cloudfunctions.net/api/v1` | The fallback in `admin/src/lib/api.ts` |

The API allows any origin, and Firebase lists `localhost` as an authorized domain by default, so login, Google sign-in and uploads all work. To point an app at another API (for example the emulator), set `NEXT_PUBLIC_API_BASE` in its `.env.local` and restart the dev server.

:::warning You are working on live data
The dev servers use your real Firestore, Auth and Storage through the deployed API. Use a separate **staging** Firebase project for experiments, or create clearly named test records and delete them afterwards.
:::

## 2. Test the static builds

Before you deploy, check the exported sites the way Hosting serves them. `tools/qa/serve.mjs` is a small static server with clean URLs and rewrites:

```bash
(cd web && npm run build)
(cd admin && npm run build)

cd tools/qa
node serve.mjs ../../admin/out 4100
node serve.mjs ../../web/out 4200 '[{"source":"^/ad/","destination":"/ad/_.html"},{"source":"^/category/","destination":"/category/_.html"},{"source":"^/seller/","destination":"/seller/_.html"},{"source":"^/blog/","destination":"/blog/_.html"},{"source":"^/jobs/","destination":"/jobs/_.html"},{"source":"^/page/","destination":"/page/_.html"}]'
```

On `localhost:4100` / `localhost:4200` the apps again call the function URL directly. The browser QA scripts in `tools/qa/` use these ports by default. See [Testing & QA Tools](doc:api/testing).

You can also use the Hosting emulator, which reads the real `firebase.json` rewrites:

```bash
firebase emulators:start --only hosting     # http://127.0.0.1:5000 (target web)
```

## 3. Backend in the Functions emulator

`firebase.json` defines these emulator ports:

| Emulator | Port |
|---|---|
| Emulator UI | `http://127.0.0.1:4000` (default) |
| Functions | 5001 |
| Firestore | 8080 |
| Authentication | 9099 |
| Storage | 9199 |
| Hosting | 5000 |

```bash
cd functions
npm run serve        # npm run build && firebase emulators:start --only functions,firestore,auth,storage
```

The emulated API is at `http://127.0.0.1:5001/your-project-id/us-central1/api/v1`. Try `curl http://127.0.0.1:5001/your-project-id/us-central1/api/v1/health`. Keep `npm run build:watch` running in a second terminal: the emulator reloads on every build.

Emulated functions read the secrets from `functions/.secret.local` (git-ignored by `*.local`) instead of Secret Manager:

```env title="functions/.secret.local"
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
```

:::note Limits of the emulator setup
- **Login doesn't work against the Auth emulator.** `POST /auth/login` checks the password with the real Identity Toolkit REST API (`identitytoolkit.googleapis.com`) and `WEB_API_KEY`, which never talks to the emulator. The website and the panel also have no emulator wiring (`connectAuthEmulator`), so their Firebase sign-in always goes to your real project.
- Public endpoints (`/health`, `/categories`, `/ads`, `/config`…) and Admin SDK scripts work fine against the emulator.
- **Push notifications** aren't sent: FCM isn't emulated.
- The **`housekeeping`** schedule doesn't run on a timer. Trigger it from the Emulator UI or the functions shell.
- Hosted **payments** redirect buyers to `settings/general.frontend_url`, not to your local site.
:::

For most backend work it is simpler to deploy to a **staging project** (`firebase use staging && firebase deploy --only functions`) and point the dev servers at it with `NEXT_PUBLIC_API_BASE`.

## Admin SDK scripts against the emulator

To run a one-off Admin SDK script (for example the [make-super-admin script](doc:installation/super-admin)) against the emulators, point it at them first:

```bash
export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
node functions/make-super-admin.mjs admin@yourcompany.com your-project-id
```

## The mobile app

Run the Flutter app against the deployed API, or against another address with `--dart-define=API_BASE_URL=…`. See [Run the App](doc:app/run-the-app).

**Next:** [Data Migration (MySQL → Firestore) →](doc:installation/data-migration)
