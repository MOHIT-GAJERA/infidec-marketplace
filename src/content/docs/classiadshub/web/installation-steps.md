---
title: Installation Steps
description: Point the website at your Firebase project, install the dependencies and run it on localhost.
---

The website has no `.env` file to fill in for a normal install. The Firebase web config and the API address are set in two small source files. You change them once, then build.

:::note Before you start
Finish [Create the Firebase Project](doc:installation/firebase-project) and [Deploy the Backend](doc:installation/backend-deploy) first. The website needs a running `api` Cloud Function and at least a few categories to show anything.
:::

## Requirements

| Tool | Version |
|---|---|
| Node.js | 22 (same as the Cloud Functions runtime) |
| npm | 10 or newer |
| Firebase CLI | Latest (`npm install -g firebase-tools`) — needed for deployment only |

:::steps
### Install the dependencies

```bash
cd web
npm install
```

### Add your Firebase web app config

In the Firebase console open **Project settings → General → Your apps → Web app** (create one if needed) and copy the `firebaseConfig` values into `src/lib/firebase.ts`:

```ts title="web/src/lib/firebase.ts"
const config = {
  apiKey: "YOUR_FIREBASE_WEB_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_WEB_APP_ID",
};
```

Use the same web app as the Admin Panel. Both sites share one Firebase Authentication user pool.

### Point the website at your API

Edit `src/lib/config.ts`:

```ts title="web/src/lib/config.ts"
export const APP_NAME = "ClassiAds_Hub";
export const APP_TAGLINE = "Buy and Sell Anything in Just One Click";

/** Cloud Function base used at build time (sitemap) and during local development. */
export const FUNCTION_API = "https://us-central1-your-project-id.cloudfunctions.net/api/v1";

/** Public site URL (for canonical/SEO). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yourcompany.com";
```

| Constant | Used for |
|---|---|
| `FUNCTION_API` | API calls when the site runs on `localhost` or `127.0.0.1`, and the build-time fetch that fills `sitemap.xml` |
| `API_BASE` | Chosen automatically: `NEXT_PUBLIC_API_BASE` if set, otherwise same-origin `/api/v1` on any real host, otherwise `FUNCTION_API` |
| `SITE_URL` | `metadataBase`, sitemap URLs, `robots.txt` host, JSON-LD offer URLs |

### (Optional) environment overrides

`web/.env.local` is optional. It only overrides the defaults above:

```env title="web/.env.local"
# Leave unset on Firebase Hosting — the site calls same-origin /api/v1.
# NEXT_PUBLIC_API_BASE=https://us-central1-your-project-id.cloudfunctions.net/api/v1

# Your public domain, no trailing slash
NEXT_PUBLIC_SITE_URL=https://www.yourcompany.com
```

### Run it locally

```bash
npm run dev          # http://localhost:3000
```

On `localhost` the site calls `FUNCTION_API` directly. The API allows any origin (`cors({ origin: true })`), so no extra CORS setup is needed.
:::

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | `next build` (static export to `web/out`) then `node scripts/flatten-segments.mjs` |
| `npm run start` | `next start` — not used for production; the site is served as static files |
| `npm run lint` | ESLint (`eslint-config-next`) |

To preview the production build with the real Hosting rewrites, build and run the Hosting emulator from the project root:

```bash
cd web && npm run build && cd ..
firebase emulators:start --only hosting     # http://localhost:5000
```

The emulator serves `web/out` with the same rewrites as production. API calls from `localhost` still go to `FUNCTION_API`.

## First check

1. The home page shows your categories under **Popular Categories** and in the second header row.
2. **Register** a test account. With the OTP provider in test mode (**Admin → Settings → OTP Provider Settings**, provider *Test mode (show code in app)*) the verification page shows a yellow *Dev mode — code: …* box.
3. Click **Ad Listing**, post an ad, and approve it in **Admin → Ads Listing → All Ads** (if approval is on).
4. Open the ad page, then log in as a second user and press **Chat**.

:::tip Authorized domains
`localhost` is in Firebase **Authentication → Settings → Authorized domains** by default. Add your production domain there before going live. See [Deployment](doc:web/deployment#custom-domain).
:::

**Next:** [Configuration →](doc:web/configuration)
