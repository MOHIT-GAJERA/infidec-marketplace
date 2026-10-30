---
title: Seed Demo Data
description: Load modules, categories, demo sellers, products with WebP images, marketing content, settings and demo accounts into your project with the Node seed script.
---

A new Firestore database is empty, and the website and apps need at least the **modules**, **categories** and **settings** documents to start. The seed script in `tools/seed` creates them, plus a full demo catalogue you can keep, edit or delete.

The script is **idempotent**: it uses stable IDs, so you can run it again safely. Re-runs keep runtime data (stock, sold counts, ratings, balances, wallet) and never overwrite settings you have changed in the panel.

## What it creates

| Area | Data |
|---|---|
| Accounts | 9 Auth users with role claims: admin, 4 sellers, 3 riders, 1 customer (see [Demo Instructions](doc:admin/demo-instructions)) |
| Catalogue | 4 modules, nested categories, brands, global attributes, products with variants, add-ons, barcodes and reviews |
| Images | Product, category, slider, offer, blog and seller images, downloaded, converted to **WebP** with `sharp` and uploaded to Storage under `catalog/…` |
| Marketing | Home sliders, offer banners, featured sections, a popup, coupons, membership plans |
| Content | Blogs and categories, FAQs, policy pages (about, terms, privacy, refund, shipping, cancellation, seller policy), e-mail templates, admin roles |
| Lookups | GST tax classes, countries (IN, AE, US, GB), cities, languages |
| Settings | `settings/platform` (fees, slots, quick-delivery radius, COD, referral, app versions, SEO, maps) and `settings/payments` |
| Demo records | A wallet credit, two product requests, a paused subscription, the order counter |

## 1. Create a service account key

1. Firebase console → ⚙ **Project settings → Service accounts → Generate new private key**.
2. Save the file as `secret/<your-project-id>-firebase-adminsdk.json` at the repository root. Create the `secret/` folder if needed; it is git-ignored.

:::danger Treat this file like a password
A service-account key has full admin access to your project. Never commit it, e-mail it or put it in an app. Delete the key in the console when you no longer need it.
:::

## 2. Create `secret/.env`

The seed copies the **public** payment keys into `settings/payments`. It reads them from `secret/.env`, which must exist even if it is empty:

```bash title="secret/.env"
RAZORPAY_KEY_ID=rzp_test_<your-key-id>
RAZORPAY_CURRENCY=INR
STRIPE_PUBLISHABLE_KEY=pk_test_<your-publishable-key>
STRIPE_CURRENCY=usd
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_ENV=sandbox
PAYPAL_CURRENCY=USD
```

You can also leave these out and fill them in later in Admin → Settings → Payment gateways.

## 3. Point the script at your project

Edit the top of `tools/seed/seed.mjs`:

```js title="tools/seed/seed.mjs"
const sa = JSON.parse(fs.readFileSync(path.join(root, 'secret/<your-project-id>-firebase-adminsdk.json'), 'utf8'));
const BUCKET = '<your-project-id>.firebasestorage.app';
// …
initializeApp({ credential: cert(sa), storageBucket: BUCKET, projectId: '<your-project-id>' });
```

Also review the `settings/platform` defaults near the end of the file (`appName`, `contactEmail`, `contactPhone`, `address`, `social`, `storeUrls`, `seo`). They are only written when the keys do not exist yet.

## 4. Run it

```bash
cd tools/seed
npm install
node seed.mjs            # full seed, waits 60 s for triggers, then recounts
# node seed.mjs --no-wait  # skip the final wait and recount
```

The first run downloads and converts every image, which takes a few minutes. Downloads are cached in your temp folder (`go4market-seed-cache`; override with `SEED_CACHE`), so later runs are fast.

:::note Deploy functions first
Seed **after** [deploying the functions](doc:installation/backend-deploy). Triggers such as `onProductWritten` build search keywords and category counts while the data is written; the script waits 60 seconds and then recounts.
:::

## 5. Check the result

- Firestore now has `modules`, `categories`, `products`, `sellers`, `settings`, `pages` and more.
- Storage has a `catalog/` folder with WebP images.
- Authentication lists the demo users.

## Other scripts in `tools/seed`

| Script | Purpose |
|---|---|
| `gen-indexes.mjs` | Regenerates `firestore.indexes.json` from the query list. Only needed if you add queries |
| `smoke.mjs` | End-to-end smoke test of checkout and order callables against your project |
| `smoke-notify.mjs` | Sends a test notification to check FCM |
| `verify-order.mjs`, `lookup-partner.mjs` | Debug helpers for one order or rider |

:::warning Going live without demo data
You can delete the demo sellers, products and coupons in the Admin panel. Keep the **modules**, the **categories** you need, the **settings** documents, the **pages** and the **email templates**. Then delete or re-password the demo Auth users and turn **Demo mode** off.
:::

**Next:** [Build & Deploy the Web Apps →](doc:installation/hosting)
