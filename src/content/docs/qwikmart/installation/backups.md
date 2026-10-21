---
title: Backups & Monitoring
description: Turn on Firestore backups and point-in-time recovery, and set up alerts before you go live.
---

Firestore is replicated by Google, but replication does not protect you from a wrong bulk edit or a deleted collection. Put these safety nets in place before launch.

## Firestore backups

**Firestore → Disaster recovery** in the console, or with `gcloud`:

```bash
# Daily backups kept 7 days + weekly backups kept 14 weeks
gcloud firestore backups schedules create --project=yourstore-1a2b3 --database='(default)' --recurrence=daily --retention=7d
gcloud firestore backups schedules create --project=yourstore-1a2b3 --database='(default)' --recurrence=weekly --day-of-week=SUN --retention=14w

# Point-in-time recovery: restore the database to any minute of the last 7 days
gcloud firestore databases update --project=yourstore-1a2b3 --database='(default)' --enable-pitr
```

Before any risky operation (bulk import, data migration) take a manual export:

```bash
gcloud firestore export gs://yourstore-backups/pre-import-$(date +%F) --project=yourstore-1a2b3
```

## Authentication users

Export the user list periodically (password hashes included) and store it securely:

```bash
npx firebase auth:export users.json --project yourstore-1a2b3
```

## Code and configuration

- Keep the whole project in a **private** Git repository; tag each release (`git tag v1.0.1`).
- Back up the **app signing keystores** and their passwords in two places (password manager + offline). Losing the upload key blocks app updates.

## Monitoring

| What | Where |
|---|---|
| Function errors and logs | Firebase console → **Functions → Logs**, or Google Cloud **Logs Explorer** |
| Budget | Cloud Billing → **Budgets & alerts** |
| Error-rate alerts | Cloud Monitoring → **Alerting** → policy on `cloudfunctions.googleapis.com/function/execution_count` with status ≠ ok |
| App crashes / ANRs | Google Play Console → **Android vitals** |
| Website / panel | App Hosting → backend → **Rollouts** and **Logs** |

## Recommended before launch

- **App Check** — register the Android apps with *Play Integrity* and the websites with *reCAPTCHA Enterprise*, watch the metrics for a week, then set `ENFORCE_APP_CHECK=true` in `firebase/functions/.env.<project-id>` and redeploy.
- **Restrict API keys** — Google Cloud → APIs & Services → Credentials: limit the Android key to your package names + SHA-1, and the browser key to your domains.
- **Warm instances** — set `HOT_MIN_INSTANCES=1` to remove cold starts on the home screen and cart (small idle cost).
- Remove Firebase **test phone numbers** and keep **Demo Mode** off.
