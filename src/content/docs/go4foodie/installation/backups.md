---
title: Backups & Monitoring
description: Turn on Firestore backups and point-in-time recovery, back up uploads and configuration, and set up logs and alerts before you go live.
---

Google replicates Firestore, but replication doesn't protect you from a wrong bulk edit, an accidental `migrate.mjs --reset` or a deleted collection. Put these safety nets in place before launch.

## Firestore backups

Use **Firestore → Disaster recovery** in the console, or `gcloud`:

```bash
# Daily backups kept 7 days + weekly backups kept 14 weeks
gcloud firestore backups schedules create --project=yourrestaurant-1a2b3 --database='(default)' --recurrence=daily --retention=7d
gcloud firestore backups schedules create --project=yourrestaurant-1a2b3 --database='(default)' --recurrence=weekly --day-of-week=SUN --retention=14w

# Point-in-time recovery: read or restore the database as it was at any minute of the last 7 days
gcloud firestore databases update --project=yourrestaurant-1a2b3 --database='(default)' --enable-pitr
```

Before any risky operation (a data migration, a bulk change in the console), take a manual export to a bucket in the same region:

```bash
gcloud storage buckets create gs://yourrestaurant-backups --location=asia-south1 --project=yourrestaurant-1a2b3   # once
gcloud firestore export gs://yourrestaurant-backups/pre-change-$(date +%F) --project=yourrestaurant-1a2b3
```

To restore an export: `gcloud firestore import gs://yourrestaurant-backups/<folder> --project=yourrestaurant-1a2b3`.

:::note Logins are in Firestore too
Admin, staff and customer passwords live in the `credentials` collection, so Firestore backups include them. Firebase Authentication only holds the `user:<id>` entries that the panel creates at sign-in. You don't need to back those up.
:::

## Uploaded images

Menu images uploaded in the panel are stored in the default bucket under `uploads/`. Copy them to the backup bucket from time to time:

```bash
gcloud storage rsync -r gs://yourrestaurant-1a2b3.firebasestorage.app/uploads gs://yourrestaurant-backups/uploads
```

## Code and configuration

- Keep the whole package in a **private** Git repository, and tag each release (`git tag v1.0.0`).
- `firebase/functions/.env.<project-id>` is **git-ignored**. Keep a copy in your password manager.
- Write down where each secret value comes from (gateway dashboards, SMTP provider). Secret Manager keeps old versions, but you can't read them back from the Firebase CLI.
- Back up the **mobile app signing keystore** and its passwords in two places. Losing the upload key blocks app updates.

## Monitoring

| What | Where |
|---|---|
| API errors and logs | `firebase functions:log` (or `npm run logs` in `firebase/functions`), or Firebase console → **Functions → Logs**, or Google Cloud **Logs Explorer** (resource *Cloud Run Revision*, service `api`) |
| E-mail delivery | Logs: `Mail sent to …`, `SMTP not configured — skipping email to …`, and errors such as `Order completion email failed` |
| Payment problems | Logs: `Razorpay order failed`, `Stripe intent failed`, `PayPal auth failed`… |
| Health check | Cloud Monitoring → **Uptime checks** → HTTPS `https://your-api-host/up`, which expects `ok` |
| Error alerts | Cloud Monitoring → **Alerting** → a log-based alert on `severity>=ERROR` for the `api` service |
| Budget | Cloud Billing → **Budgets & alerts** (50 / 90 / 100 %) |
| Website | App Hosting → backend → **Rollouts** and **Logs** |
| App crashes | Google Play Console → **Android vitals** |

:::tip Search the logs quickly
In Logs Explorer, `resource.labels.service_name="api" severity>=WARNING` lists every failed request, failed e-mail and payment error in one view.
:::

## Recommended before launch

- [x] Daily and weekly Firestore backups and PITR turned on
- [x] Budget alert created
- [x] Uptime check on `/up`
- [x] Demo login hint removed from the admin login screen
- [x] Gateways switched from test to **live** keys (`PAYPAL_ENV=live` for PayPal), with one small real payment tested
- [x] Service-account key files used for migration or admin users deleted and revoked
- [x] Browser API key restricted to your admin domains (Google Cloud → APIs & Services → Credentials)

**Next:** [Settings →](doc:admin/settings)
