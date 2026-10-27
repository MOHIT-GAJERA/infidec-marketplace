---
title: Scheduled Jobs
description: The hourly housekeeping function. It expires ads, featured periods and subscriptions, and settles hosted payments whose buyer never returned to the website.
---

ClassiAds-Hub has **one** scheduled function, `housekeeping`, defined in `functions/src/index.ts`. Its expiry code is in `functions/src/jobs/scheduled.ts`, the payment part in `reconcileHostedPayments()` in `functions/src/routes/billing.ts`.

| Setting | Value |
|---|---|
| Schedule | `every 60 minutes` (Cloud Scheduler job `firebase-schedule-housekeeping-us-central1`) |
| Region | `us-central1` |
| Timeout | 300 seconds |
| Secrets | `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET` (to ask the gateways for payment status) |

## What it does

Each run performs four steps, in this order.

### 1. Expire ads

Finds ads with `status == "approved"` and `expires_at <= now`, and for each one:

- sets `status: "expired"`,
- notifies the seller: **Ad expired** — *"<title>" has expired. Renew it to keep it live.* (type `ad.expired`, with `ad_id`).

`expires_at` is set when an ad is posted or renewed: now + **Settings → General → Ad expiry (days)** (default 30). Sellers renew with `POST /ads/{id}/renew`.

The public listings already hide ads past `expires_at` before the job runs, so an ad never shows after its expiry time. The job makes the status visible to the seller and the admin.

### 2. End featured periods

Finds ads with `is_featured == true` and `featured_until <= now` and sets `is_featured: false`, `featured_until: null`. `featured_until` comes from a featured-ad plan purchase (+ the plan's `duration_days`) or from the admin **feature** toggle (+ `days`, default 30).

### 3. Expire subscriptions

Finds subscriptions with `status == "active"` and `ends_at <= now` and sets `status: "expired"`. Posting checks `ends_at` itself, so an expired package stops counting at once; the job updates the stored status for the dashboard and the lists.

Steps 2 and 3 are written in one batch. The function logs `housekeeping { expiredAds, unfeatured, expiredSubs }`.

### 4. Settle hosted payments

Finds `pending` transactions from the last **2 days** whose `gateway` is `stripe`, `razorpay` or `paypal` and that have a `gateway_reference`. For each one it asks the gateway for the status (the same check as `POST /payments/{id}/confirm`):

| Gateway answer | Result |
|---|---|
| Paid, with the right amount and currency | `fulfil()`: the subscription becomes active or the ad featured, an invoice is written, the buyer is notified |
| Failed, cancelled or expired (or a wrong amount) | `failed` |
| Still open | Left `pending`, checked again next hour |

It logs `housekeeping: settled N hosted payment(s)` when it settled any. A hosted payment that stays pending for more than 2 days is no longer checked automatically: confirm it by hand in **Package Management → Payment Transactions** after checking the gateway dashboard.

## Indexes

The three expiry queries need composite indexes, which ship in `firebase/firestore.indexes.json`:

| Query | Index |
|---|---|
| `ads` where `status ==` and `expires_at <=` | `status`, `expires_at` |
| `ads` where `is_featured ==` and `featured_until <=` | `is_featured`, `featured_until` |
| `subscriptions` where `status ==` and `ends_at <=` | `status`, `ends_at` |

If you deploy the functions without the indexes, the job fails with a *FAILED_PRECONDITION: The query requires an index* error. Deploy them with `firebase deploy --only firestore:indexes`.

## Monitoring and running it by hand

- **Logs**: Firebase console → Functions → `housekeeping` → Logs, or `firebase functions:log --only housekeeping`.
- **Last run**: Google Cloud Console → **Cloud Scheduler** → `firebase-schedule-housekeeping-us-central1`. Click **Force run** to run it now, for example after you changed an expiry date in the console.
- **In the emulator** the schedule doesn't fire on a timer. Trigger it from the Emulator UI or the functions shell.

## Cost

One run per hour is 720 runs a month: well inside the free Cloud Functions quota, and one of the three free Cloud Scheduler jobs per billing account. The Firestore reads are the matching documents only.

**Next:** [Testing & QA Tools →](doc:api/testing)
