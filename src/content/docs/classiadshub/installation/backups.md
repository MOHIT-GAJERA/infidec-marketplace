---
title: Backups & Monitoring
description: Turn on Firestore backups and point-in-time recovery, back up Storage, Auth users and configuration, and set up logs and alerts for the ClassiAds-Hub functions before you go live.
---

Google replicates Firestore, but replication doesn't protect you from a wrong bulk edit, a deleted collection or a bad script. Put these safety nets in place before launch.

## What holds your data

| Store | Contents | Backup method |
|---|---|---|
| **Cloud Firestore** | Everything that matters: users and roles, ads, categories, custom fields, chats, offers, reviews, transactions, subscriptions, invoices, settings, content, the `counters` that issue ids | Scheduled backups + PITR (below) |
| **Cloud Storage** | Ad photos, avatars, content images, KYC documents (`kyc/`), receipts (`receipts/`), résumés (`resumes/`) | Copy to a backup bucket |
| **Firebase Authentication** | Logins and password hashes. The uid of API-created accounts equals the Firestore user id | `firebase auth:export` |
| **Secret Manager** | `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET` | Keep the values in your password manager |

## Firestore backups

Use **Firestore → Disaster recovery** in the console, or `gcloud`:

```bash
# Daily backups kept 7 days + weekly backups kept 14 weeks
gcloud firestore backups schedules create --project=your-project-id --database='(default)' --recurrence=daily --retention=7d
gcloud firestore backups schedules create --project=your-project-id --database='(default)' --recurrence=weekly --day-of-week=SUN --retention=14w

# Point-in-time recovery: read or restore the database as it was at any minute of the last 7 days
gcloud firestore databases update --project=your-project-id --database='(default)' --enable-pitr
```

Before any risky operation (a bulk change in the console, a data-fix script, a migration re-run), take a manual export to a bucket in the same location as the database:

```bash
gcloud storage buckets create gs://your-project-id-backups --location=europe-west1 --project=your-project-id   # once
gcloud firestore export gs://your-project-id-backups/pre-change-$(date +%F) --project=your-project-id
```

To restore an export: `gcloud firestore import gs://your-project-id-backups/<folder> --project=your-project-id`.

:::warning Restore the counters too
New records get their id from `counters/{collection}`. If you restore only some collections, make sure each counter is at least the highest id in its collection, or new documents will overwrite existing ones.
:::

## Storage

```bash
gcloud storage rsync -r gs://your-project-id.firebasestorage.app gs://your-project-id-backups/storage
```

Run it on a schedule (for example weekly). `kyc/`, `receipts/` and `resumes/` hold personal data: keep the backup bucket private and apply the same retention you promise users in your privacy policy.

## Authentication users

```bash
firebase auth:export auth-users.json --format=json --project your-project-id
```

Store the file encrypted: it contains e-mail addresses and password hashes. `firebase auth:import` restores it (pass the hash parameters the export prints).

## Code and configuration

- Keep the whole repository in a **private** Git repository, and tag each release (`git tag v1.0.0`).
- `functions/.env`, `secret/prod.env`, `web/.env.local`, the app's `google-services.json`, `GoogleService-Info.plist` and `android/key.properties` are **git-ignored**. Keep copies in your password manager.
- Back up the **Android upload keystore** and its passwords in two places. Losing it blocks app updates.

## Monitoring

| What | Where |
|---|---|
| API errors and logs | `firebase functions:log` (or `npm run logs` in `functions/`), Firebase console → **Functions → Logs**, or Google Cloud **Logs Explorer**. Unhandled errors are logged as `Unhandled API error` and answered with `500 Server error.` |
| Payment problems | Gateway errors come back as `422` with the gateway's message (for example `Stripe: …`). **Package Management → Payment Transactions** shows each attempt with its status |
| Hourly job | Logs `housekeeping` with the counts `expiredAds`, `unfeatured`, `expiredSubs`, and `housekeeping: settled N hosted payment(s)`. Cloud Scheduler shows the last run of `firebase-schedule-housekeeping-us-central1` |
| Push | `FCM send failed` warnings. Dead tokens are deleted from `user_devices` automatically |
| Health | `GET /api/v1/health/ready` answers `503` when Firestore is unreachable. Add an uptime check on it in Cloud Monitoring |
| Admin activity | **Settings → Log Viewer** (the `audit_logs` collection: ad decisions, user status, staff removal, settings changes, file deletions, payment confirmations) |
| Error alerts | Cloud Monitoring → **Alerting** → a log-based alert on `severity>=ERROR` for Cloud Run revisions |
| Budget | Cloud Billing → **Budgets & alerts** (50 / 90 / 100 %) |
| App crashes | Firebase **Crashlytics**, Google Play Console → **Android vitals** |

:::tip Search the logs quickly
In Logs Explorer, `resource.type="cloud_run_revision" resource.labels.service_name="api" severity>=WARNING` lists every failed API request in one view.
:::

## Recommended before launch

- [x] Daily and weekly Firestore backups and PITR turned on
- [x] Budget alerts created
- [x] Gateways switched from test to **live** keys (`PAYPAL_ENV=live` for PayPal) and one small real payment tested
- [x] **Sandbox (Test)** gateway document deleted from `payment_gateways` (see [Billing & Payments](doc:api/billing#sandbox-and-the-public-webhook))
- [x] OTP provider decided (Test mode shows codes on screen: see [Login, OTP & Notification Settings](doc:admin/otp-notifications))
- [x] Demo ads removed (**Settings → Dummy Data**) and demo logins changed
- [x] `settings/general.frontend_url` points at your website
- [x] Service-account key files deleted and revoked

**Next:** [Dashboard →](doc:admin/dashboard)
