---
title: Backend Overview
description: How Booqora's Firebase backend is organised: direct Firestore access under security rules, five Cloud Functions for payments and e-mail, and Cloud Storage for media.
---

Booqora's backend is **Firebase only**. There is no REST API server to host. The Rental Platform, the Online Store and the Mobile App talk to Firebase directly through the FlutterFire SDKs, and a small set of Cloud Functions handles the work that needs secret keys.

## The building blocks

| Service | What Booqora uses it for | Defined in |
|---|---|---|
| **Firebase Authentication** | Staff accounts (e-mail/password); anonymous sessions for Online Store visitors | Firebase console |
| **Cloud Firestore** | All business data, one workspace per business | `lib/data/schema.dart`, `firestore.rules` |
| **Cloud Storage** | Product, bundle and collection images, logos, avatars | `storage.rules` |
| **Cloud Functions v2** | Payments (Razorpay, Stripe, PayPal) and SMTP e-mail | `booqora_platform/functions/index.js` |
| **Secret Manager** | Payment keys and SMTP credentials | `defineSecret()` in `index.js` |
| **Firebase Hosting** | Rental Platform + Online Store; Marketing Website | `firebase.json` in each project |

## How a request flows

| Action | Path |
|---|---|
| Staff open the orders list | Client → Firestore query on `workspaces/{wid}/orders` → rules check membership |
| Staff create an order | Client calculates prices with `lib/data/pricing.dart`, takes the next number from `workspaces/{wid}.counters` in a transaction, writes the order |
| A customer books online | Client signs in anonymously → creates an order with `source: online`, `status: draft`, `paid: 0` → rules validate the shape → `onOnlineOrder` e-mails the customer and the store |
| Someone pays online | Client → `paymentConfig` → `createPayment` → provider checkout → `verifyPayment` → payment recorded on the order. See [Payment Flow](doc:api/payment-flow) |
| Staff e-mail a document | Client → `sendEmail` → SMTP → `emailLog` |

## Why most logic runs in the client

Booqora is designed for small and medium rental businesses, where one workspace holds hundreds or a few thousand orders. That makes a simple model possible:

- **Multi-tenancy by path.** Every tenant document is under `workspaces/{wid}/…`, and the rules allow access only when `workspaces/{wid}/members/{uid}` exists. One rule protects every collection.
- **No composite indexes.** Each query uses a single `orderBy('createdAt')` or a single equality `where()`. Further filtering and sorting happen in the client, so `firestore.indexes.json` is empty and deploys stay fast.
- **Offline cache.** The platform enables Firestore persistence with an unlimited cache, so lists reopen instantly and repeat reads are cheap.
- **Shared pricing code.** `lib/data/pricing.dart` (rental periods, tiered pricing structures, totals, availability) is used by the platform, the Online Store and, as a copy, by the Mobile App.

The trade-off is that a workspace member is trusted with the workspace's data. Anything involving money from outside, or a secret key, runs in Cloud Functions and is verified there.

## Code layout

| Path | What |
|---|---|
| `booqora_platform/lib/data/schema.dart` | Collection names and the field contract for every document. See [Data Model](doc:api/data-model) |
| `booqora_platform/lib/data/db.dart` | Firestore helpers: workspace-scoped collections, `create` / `update` with automatic `createdAt`, `updatedAt`, `createdBy`, activity logging, sequential numbers, Storage uploads |
| `booqora_platform/lib/data/session.dart` | Auth state, current workspace and member, sign-up, workspace creation, invites |
| `booqora_platform/lib/data/pricing.dart` | Rental pricing, totals and availability |
| `booqora_platform/lib/data/payments.dart` | Client for the payment and e-mail functions, Razorpay Checkout loader |
| `booqora_platform/functions/index.js` | The five Cloud Functions. See [Cloud Functions Reference](doc:api/cloud-functions) |
| `booqora_platform/firestore.rules`, `storage.rules` | See [Security Rules](doc:api/security-rules) |
| `booqora_mobile/lib/data/` | The same data layer copied into the Mobile App, with native Razorpay instead of the web script |

:::note Keep the two data layers in step
The Mobile App has its own copy of `lib/data/`. If you add a field or change pricing in the platform, make the same change in `booqora_mobile/lib/data/` so both apps calculate the same totals.
:::

## Region

Cloud Functions run in **`asia-south1` (Mumbai)**, set by `setGlobalOptions` in `index.js`. The clients call `FirebaseFunctions.instanceFor(region: 'asia-south1')`. Keep Firestore in the same region for the lowest latency. To move, see the warning in [Create the Firebase Project](doc:installation/firebase-project#3-create-the-firestore-database).

**Next:** [Data Model (Firestore) →](doc:api/data-model)
