---
title: Testing & QA Tools
description: The automated QA scripts that ship with ClassiAds-Hub (194 API checks, browser checks for the website and the Admin Panel, end-to-end runs) and how to point them at your own project.
---

ClassiAds-Hub ships with **end-to-end QA scripts** in `tools/qa/` instead of unit tests. They run against a **deployed** backend, sign in real Firebase users, exercise every route, check the website and the Admin Panel in Chrome, and clean up after themselves. Run them on a staging project before every release.

:::note No unit-test suite
`functions/`, `web/` and `admin/` have no `test` script. Type checking (`npm run build` runs `tsc` in `functions/` and `next build` in the two sites) and the QA scripts below are the safety net.
:::

## Setup

```bash
cd tools/qa
npm install          # playwright-core
```

The browser scripts drive your installed **Google Chrome** (`chromium.launch({ channel: "chrome" })`). No separate browser download is needed.

:::warning Point the scripts at your project first
The scripts were written for the demo project. Before you run them, change in `api-qa.mjs`, `lib.mjs` and `qa-lib.mjs`:

- the default API address `https://us-central1-classiadshub.cloudfunctions.net/api/v1` → your project (or pass it as an argument / `QA_API`),
- `API_KEY` → your Firebase **Web API key** (used to sign in through the Identity Toolkit REST API),
- the hard-coded test logins (a seller and an admin of the demo data, passed to `signIn(…)` and filled into the login forms) → a seller and an admin account in your project.

`qa-fs.mjs` and `cleanup-qa-data.js` also load a service-account file and the demo project ID / bucket. Change those paths and names too.
:::

## The scripts

| Script | What it checks | Run |
|---|---|---|
| `api-qa.mjs` | **194 API checks** across every route group: health, catalogue, locations, config, home, ads (create with custom fields and images, update, favourites, saved searches, nearby), auth (register, OTP verify, login, profile, password reset, account deletion), chat, offers, follows, reviews, reports, notifications, billing (sandbox checkout), jobs, verification, and the admin area (dashboard, moderation, users, staff, every CRUD resource, settings, files, push, audit logs, AI, blog). It registers its own buyer and deletes everything it created. Prints `PASS` / `FAIL` per check and `N/194 passed`; exit code 1 on any failure | `node api-qa.mjs [baseUrl]` |
| `admin-ui-qa.mjs` | Signs in to the Admin Panel, opens about 60 pages (every module and every settings section), records console errors and failed API calls, saves a screenshot per page to `shots/admin` | `node admin-ui-qa.mjs [baseUrl] [outDir]` (default `http://localhost:4100`) |
| `web-ui-qa.mjs` | Browser QA of the public website: pages load, no console errors, no API 5xx. Screenshots to `shots/web` | `node web-ui-qa.mjs [baseUrl] [outDir]` (default `http://localhost:4200`) |
| `admin-e2e-qa.mjs` | Drives the real Admin Panel UI: creates `QA-ADMIN …` entries in every module, verifies them through the API and directly in Firestore, edits, toggles, reorders and deletes them, and checks the public side effects | `node admin-e2e-qa.mjs [module …]` (env `QA_UI`, `QA_API`) |
| `web-e2e.mjs` | Full website run against the live backend: registers a user, posts and edits ads, chats, makes offers, and more. Creates and cleans up real data | `node web-e2e.mjs [baseUrl] [only=phase1,phase2]` |
| `nav-check.mjs` | Client-side navigation through dynamic routes (home → ad → seller → ad → category) and whether each hop stayed a single-page navigation | `node nav-check.mjs [baseUrl]` |
| `live-smoke.mjs` | A quick smoke test of the live sites (an ad page, a CMS page, the admin login with `ADMIN_PW` from the environment) | `ADMIN_PW=… node live-smoke.mjs` |
| `serve.mjs` | A small static server that mimics Firebase Hosting (clean URLs and rewrites) for the browser scripts | `node serve.mjs <dir> <port> [rewritesJson]` |
| `cleanup-qa-data.js` | Removes data left by interrupted QA runs from Firestore, Auth and Storage. Keeps every id up to the migrated maximum per collection (`MIGRATED_MAX`) and a few demo records | `node cleanup-qa-data.js --dry`, then without `--dry` |

The other files in `tools/qa/` (`adb-ui.mjs`, `cap*.mjs`, `video.mjs`, `login*.mjs`, `switch*.mjs`…) are helpers that captured the Play Store screenshots and promo video on an Android emulator. You don't need them to test the platform.

## A typical run

:::steps
### Deploy to a staging project
`firebase use staging && firebase deploy --only functions,firestore:rules,firestore:indexes,storage`. Load the sample data there ([Data Migration](doc:installation/data-migration)) so the scripts find categories, a seller and an admin.

### Enable the Sandbox gateway on staging
The billing checks pay with the **Sandbox (Test)** gateway. Keep it on staging only (see [Billing & Payments](doc:api/billing#sandbox-and-the-public-webhook)).

### Run the API checks
```bash
node api-qa.mjs https://us-central1-your-staging-id.cloudfunctions.net/api/v1
```

### Build and serve the sites
```bash
(cd ../../admin && npm run build) && node serve.mjs ../../admin/out 4100
(cd ../../web && npm run build) && node serve.mjs ../../web/out 4200 '<rewrites JSON>'
```
See [Localhost Setup](doc:installation/localhost-setup#2-test-the-static-builds) for the rewrites.

### Run the browser checks
```bash
node admin-ui-qa.mjs
node web-ui-qa.mjs
```
Open the screenshots in `shots/` and read the list of problems each script prints.

### Clean up
`node cleanup-qa-data.js --dry` shows what would be removed. Adjust `MIGRATED_MAX` to your data first.
:::

## Testing payments by hand

| Gateway | Test details |
|---|---|
| Stripe (test keys `sk_test_…`) | Card `4242 4242 4242 4242`, any future expiry, any CVC |
| Razorpay (test keys `rzp_test_…`) | Razorpay's test-mode checkout page |
| PayPal (`PAYPAL_ENV=sandbox`) | A PayPal sandbox buyer account from the PayPal developer dashboard |
| Bank Transfer | Upload any image as the receipt, then confirm in **Package Management → Bank Transfer** |

After each payment, check **Package Management → Payment Transactions** (status `completed`, an invoice number) and the buyer's dashboard. To test the hourly settlement, close the browser on the gateway page after paying and run the job with **Force run** in Cloud Scheduler ([Scheduled Jobs](doc:api/scheduled-jobs)).

**Next:** [Changelog →](doc:changelog)
