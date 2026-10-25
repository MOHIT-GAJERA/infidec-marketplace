---
title: Backups & Monitoring
description: Turn on Firestore backups and point-in-time recovery, back up Storage, Auth users and configuration, and set up logs and alerts for the Go4Ride functions before you go live.
---

Google replicates Firestore, but replication doesn't protect you from a wrong bulk edit, a deleted collection or a bad script. Put these safety nets in place before launch.

## What holds your data

| Store | Contents | Backup method |
|---|---|---|
| **Cloud Firestore** | Everything that matters: riders, drivers, rides, wallets, ledger (`transactions`), payments, settings, catalogue | Scheduled backups + PITR (below) |
| **Cloud Storage** | KYC documents, profile photos, support attachments, admin uploads | Copy to a backup bucket |
| **Firebase Authentication** | Phone and e-mail logins, custom claims (`role`, `roleId`) | `firebase auth:export` |
| **Realtime Database** | Only live driver positions (`driver_locations`) | Not needed: it rebuilds itself as drivers go online |

## Firestore backups

Use **Firestore → Disaster recovery** in the console, or `gcloud`:

```bash
# Daily backups kept 7 days + weekly backups kept 14 weeks
gcloud firestore backups schedules create --project=your-project-id --database='(default)' --recurrence=daily --retention=7d
gcloud firestore backups schedules create --project=your-project-id --database='(default)' --recurrence=weekly --day-of-week=SUN --retention=14w

# Point-in-time recovery: read or restore the database as it was at any minute of the last 7 days
gcloud firestore databases update --project=your-project-id --database='(default)' --enable-pitr
```

Before any risky operation (a bulk change in the console, a data-fix script), take a manual export to a bucket in the same location as the database:

```bash
gcloud storage buckets create gs://your-project-id-backups --location=asia-south1 --project=your-project-id   # once
gcloud firestore export gs://your-project-id-backups/pre-change-$(date +%F) --project=your-project-id
```

To restore an export: `gcloud firestore import gs://your-project-id-backups/<folder> --project=your-project-id`.

## Storage

```bash
gcloud storage rsync -r gs://your-project-id.firebasestorage.app gs://your-project-id-backups/storage
```

Run it on a schedule (for example weekly). KYC documents are personal data: keep the backup bucket private and apply the same retention you promise drivers in your privacy policy.

## Authentication users

```bash
firebase auth:export auth-users.json --format=json --project your-project-id
```

The export includes the custom claims, so staff roles survive a restore (`firebase auth:import`). Store the file encrypted: it contains phone numbers and e-mail addresses.

## Code and configuration

- Keep the whole repository in a **private** Git repository, and tag each release (`git tag v1.0.0`).
- `secret/app_keys.env`, `google-services.json` and `GoogleService-Info.plist` are **git-ignored**. Keep copies in your password manager.
- Payment and SMTP secrets live in Firestore (`secure_settings/*`), so the Firestore backup covers them. Still write down where each value comes from (gateway dashboards, SMTP provider).
- Back up the **Android upload keystores** of both apps and their passwords in two places. Losing an upload key blocks app updates.

## Monitoring

| What | Where |
|---|---|
| Function errors and logs | `firebase functions:log` (or `npm run logs` in `functions/`), Firebase console → **Functions → Logs**, or Google Cloud **Logs Explorer** |
| Payment problems | Logs: `checkout creation failed`, `payment verification failed`. The `payments` collection shows each attempt with `status` and `reason` |
| Dispatch | Rides that end in `noDriversFound` (no eligible driver, or not accepted within *Auto-cancel unaccepted ride*) |
| Scheduled jobs | Cloud Scheduler: last run and result of `expireRideRequests` (every minute) and `dailyAnalyticsRollup` |
| Error alerts | Cloud Monitoring → **Alerting** → a log-based alert on `severity>=ERROR` for Cloud Run revisions |
| Budget | Cloud Billing → **Budgets & alerts** (50 / 90 / 100 %), plus a quota or budget on Google Maps Platform |
| SMS fraud | Authentication → **Usage** and the SMS region policy |
| App crashes | Google Play Console → **Android vitals**, App Store Connect → **Crashes** |

:::tip Search the logs quickly
In Logs Explorer, `resource.type="cloud_run_revision" severity>=WARNING` lists every failed function run in one view. Add `resource.labels.service_name="createpayment"` to narrow it to one function (Cloud Run service names are the lower-case function names).
:::

## Recommended before launch

- [x] Daily and weekly Firestore backups and PITR turned on
- [x] Budget alerts for Firebase and Google Maps created
- [x] Maps API key restricted to your apps and APIs
- [x] SMS region policy set; test phone numbers removed
- [x] Gateways switched from test to **live** keys (`paypalMode` = `live` for PayPal), with one small real payment tested
- [x] Service-account key files used for the first admin deleted and revoked
- [x] Release builds made **without** `USE_EMULATOR`
- [x] Sample values removed from `config/app_keys.example.env`

**Next:** [Services →](doc:admin/services)
