---
title: Backups & Monitoring
description: The weekly automatic Firestore export, on-demand backups and restores, and what to monitor once Go4Market is live.
---

## Automatic weekly backup

The scheduled function `backupFirestore` runs every **Sunday at 02:30 IST**. It starts a managed Firestore export of all collections to:

```text
gs://<your-project-id>.firebasestorage.app/backups/<yyyy-mm-dd>
```

Set `BACKUP_BUCKET` in `functions/.env` to use another bucket. The result is recorded in `system/backup` (`lastRunAt`, `status`, `path`) and shown under **Admin → System health → Last backup**.

### Grant the export permission once

The export runs as the functions' service account, which needs two roles. In Google Cloud Console → **IAM**, find `<project-number>-compute@developer.gserviceaccount.com` (the default compute service account used by Cloud Functions v2) and add:

- **Cloud Datastore Import Export Admin**
- **Storage Admin** on the backup bucket (or Storage Object Admin)

If `system/backup.status` is `failed`, the `error` field usually says which permission is missing.

:::tip Keep backups cheap
Add a lifecycle rule on the bucket (Cloud Storage → bucket → Lifecycle) that deletes objects under `backups/` after, say, 60 days.
:::

## On-demand backup and restore

```bash
# backup now
gcloud firestore export gs://<your-project-id>.firebasestorage.app/backups/manual-$(date +%F) --project <your-project-id>

# restore (writes over documents with the same IDs)
gcloud firestore import gs://<your-project-id>.firebasestorage.app/backups/<folder> --project <your-project-id>
```

Firebase Authentication users are **not** in a Firestore export. Export them separately:

```bash
firebase auth:export users.json --project <your-project-id>
```

Back up **outside Firebase** as well: your Git repository, `functions/.env`, the Android **upload keystore** and its passwords. A lost keystore means you cannot update your apps.

## What to monitor

| Where | What to look at |
|---|---|
| **Admin → System health** | Integration status (Razorpay, Stripe, PayPal, SMTP, SMS, Gemini), counts, last backup, latency, missing indexes |
| Firebase → **Functions → Logs** | Errors from `placeOrder`, `confirmPayment`, `onOrderWritten`, `onSmsQueued` |
| Firestore → `smsOutbox` | SMS status: `sent`, `failed`, `skipped_no_provider`, `skipped_disabled`, `invalid_number` |
| Firestore → `mail` | Admin-composed e-mail results (`delivery.state`) |
| Firebase → **Usage and billing** | Firestore reads/writes, Functions invocations, phone-auth SMS |
| Google Cloud → **Billing → Budgets** | Your budget alerts |
| Firebase → **Crashlytics** (optional) | Not included by default; add it to the apps if you want crash reports |

:::warning Unpaid orders are cleaned up automatically
`cleanupPendingOrders` runs hourly. It cancels online-payment orders left unpaid for 30 minutes (restoring stock and coupons) and expires abandoned wallet top-ups. This is expected; do not "fix" these cancellations.
:::

**Next:** [Modules →](doc:admin/modules)
