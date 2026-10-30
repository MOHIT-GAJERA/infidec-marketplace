---
title: Deploy Functions, Rules & Indexes
description: Build and deploy the Go4Market Cloud Functions, Firestore rules and composite indexes, and Storage rules to your Firebase project.
---

With the project connected and the secrets in place, deploy the backend from the **repository root** (the folder that contains `firebase.json`).

## 1. Install and build the functions

```bash
cd functions
npm ci
npm run build        # tsc → functions/lib
cd ..
```

`firebase.json` also runs `npm --prefix functions run build` as a predeploy step, so the build runs again on every deploy.

## 2. Deploy rules and indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage --project <your-project-id>
```

- `firestore.rules`: who can read and write each collection. Orders, wallet and stats are written **only** by functions.
- `firestore.indexes.json`: about 130 composite indexes (products, orders, wallet, withdrawals, returns and more) plus field overrides. Indexes build in the background, which can take 5 to 20 minutes on a new project. Until they are ready, some lists show "The query requires an index".
- `storage.rules`: images up to 10 MB, WebP accepted. Sellers can upload only their own logo and banner; riders upload only their own photo and documents.

:::note Panel index file
`apps/panel/firestore.indexes.panel.json` is a reference subset. Every index in it is already in the root `firestore.indexes.json`, which is the file that gets deployed.
:::

## 3. Deploy the functions

```bash
firebase deploy --only functions --project <your-project-id>
```

The first deploy takes 5 to 10 minutes. Firebase may ask to enable APIs (Cloud Build, Artifact Registry, Eventarc, Cloud Scheduler, Secret Manager); answer **yes**.

### Discovery timeout

Before uploading, the CLI loads your code to discover the functions. On a slow disk this can exceed the default 10 seconds and fail with *"User code failed to load. Cannot determine backend specification"*. Raise the limit:

```bash
# macOS / Linux
FUNCTIONS_DISCOVERY_TIMEOUT=300 firebase deploy --only functions --project <your-project-id>
```

```powershell
# Windows PowerShell
$env:FUNCTIONS_DISCOVERY_TIMEOUT = "300"
firebase deploy --only functions --project <your-project-id>
```

:::tip Deploying from a slow drive
If builds are still slow, copy `functions/` (`src`, `package.json`, `package-lock.json`, `tsconfig.json`, `.env`) together with `.firebaserc` and a `firebase.json` that contains only the `functions` block to a folder on your SSD. Then run `npm ci && npx tsc -p .` and deploy from there.
:::

:::warning "Secret … not found" errors
Every secret a function binds must exist in Secret Manager. Create any missing one with the value `unset` (see [Secrets & functions/.env](doc:installation/environment-configuration#2-create-the-secrets)) and deploy again.
:::

## What gets deployed

| Group | Functions |
|---|---|
| Checkout & orders | `getCheckoutQuote`, `placeOrder`, `validateCoupon`, `updateOrderStatus`, `assignDeliveryPartner`, `acceptDelivery`, `posCheckout` |
| Payments | `confirmPayment`, `walletTopup`, `confirmWalletTopup`, `paymentWebhook` (HTTP) |
| Wallet & membership | `adjustWallet`, `transferFunds`, `purchaseMembership` |
| Users | `onUserCreated` (Auth trigger), `setUserRole`, `createStaffUser`, `registerPushToken`, `unregisterPushToken`, `completeProfile` |
| Sellers | `registerSeller`, `reviewSeller`, `requestWithdrawal`, `processWithdrawal` |
| Delivery | `registerDeliveryPartner`, `reviewDeliveryPartner`, `settleCash`, `createSellerRider` |
| Returns | `requestReturn`, `processReturn` |
| Marketing | `sendCampaign`, `generateDescription`, `submitReview` |
| Catalogue | `searchProducts`, `getRecommendations`, `getNearbyStores` |
| Reports & admin | `salesReport`, `abandonedCarts`, `getSystemStatus` |
| SEO | `sitemap` (HTTP, served at `/sitemap.xml` on the website) |
| Triggers | `onOrderWritten`, `onMailCreated`, `onSmsQueued`, `onProductWritten`, `onReviewWritten`, `onUserWritten`, `onDeliveryPartnerWritten`, `onAttributeWritten` |
| Schedules (IST) | `runSubscriptions` (daily 07:00), `cleanupPendingOrders` (hourly), `remindAbandonedCarts` (daily 18:00), `runMonthlySalaries` (1st, 09:00), `backupFirestore` (Sunday 02:30) |

Global options (`functions/src/index.ts`): region `asia-south1`, 256 MiB, 60 s timeout, max 20 instances.

## 4. Register the payment webhook

The webhook URL is:

```text
https://asia-south1-<your-project-id>.cloudfunctions.net/paymentWebhook
```

Add it in the Razorpay dashboard (Webhooks: `payment.captured`, `order.paid`), in Stripe (Developers → Webhooks: `checkout.session.completed`, `checkout.session.async_payment_succeeded`) and in PayPal (your REST app → Webhooks: `CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED`). The function **re-verifies every event against the provider's API** with your secret key, so no separate signing secret is needed. See [Payment Gateways](doc:admin/payment-gateways).

## 5. Check the deploy

```bash
firebase functions:list --project <your-project-id>
firebase functions:log --project <your-project-id>
```

Open `https://asia-south1-<your-project-id>.cloudfunctions.net/sitemap`. You get an XML sitemap (nearly empty until you seed data).

**Next:** [Seed Demo Data →](doc:installation/seed-data)
