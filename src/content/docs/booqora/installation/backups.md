---
title: Backups & Monitoring
description: Protect Booqora's Firestore data with exports or scheduled backups, and monitor functions, e-mail delivery, payments and costs.
---

All of a rental business's data lives in **Cloud Firestore**: workspaces, orders, customers, products, documents, payments and settings. Images live in **Cloud Storage**. Booqora does not include a scheduled backup function, so set one of the options below up before you go live.

## Option 1: Firestore scheduled backups (recommended)

Firestore can take daily or weekly backups of the whole database itself, with no code and no bucket to manage.

```bash title="Terminal"
# Daily backup, kept for 14 days
gcloud firestore backups schedules create \
  --database="(default)" \
  --recurrence=daily \
  --retention=14d \
  --project=<your-project-id>

# List schedules and existing backups
gcloud firestore backups schedules list --database="(default)" --project=<your-project-id>
gcloud firestore backups list --project=<your-project-id>
```

To recover, restore a backup into a **new** database ID with `gcloud firestore databases restore`, check it, then copy what you need back. You can also manage schedules in the Google Cloud Console under **Firestore → Disaster recovery**. Backups are billed by storage size; check the current pricing.

## Option 2: Manual export to Cloud Storage

An export is a snapshot you can keep as long as you like, download, or import into another project.

```bash title="Terminal"
# Export everything
gcloud firestore export gs://<your-project-id>.firebasestorage.app/backups/$(date +%F) \
  --project=<your-project-id>

# Export only some collections (collection IDs, at any level)
gcloud firestore export gs://<your-project-id>.firebasestorage.app/backups/orders-$(date +%F) \
  --collection-ids=orders,payments,documents \
  --project=<your-project-id>

# Import an export (overwrites documents with the same IDs)
gcloud firestore import gs://<your-project-id>.firebasestorage.app/backups/2026-11-01 \
  --project=<your-project-id>
```

Exports need the Blaze plan, which Booqora already uses. Add an **Object Lifecycle** rule on the `backups/` prefix to delete old exports automatically.

:::warning Storage files are not in a Firestore export
Product images and logos are in Cloud Storage under `workspaces/{workspaceId}/…`. To back them up, copy the bucket to a second bucket on a schedule (for example with a Storage Transfer Service job), or turn on **object versioning** for the bucket.
:::

## Point-in-time recovery

Turn on **Point-in-time recovery (PITR)** in **Firestore → Disaster recovery** to read or recover data as it was at any minute in the last 7 days. It is the best protection against a mistaken bulk delete. It adds storage cost.

## What else to keep safe

| Item | Where it lives | How to back it up |
|---|---|---|
| Source code with your changes | Your Git repository | Push to GitHub or another remote |
| Secrets (payment and SMTP keys) | Secret Manager | Keep a copy in your password manager |
| Android upload keystore and `key.properties` | Your computer | Store offline and in a password manager; see [Release Build & Keystore](doc:app/deployment) |
| Hosting releases | Firebase Hosting | Kept automatically; roll back in **Release history** |

## Monitoring

### Cloud Functions

```bash title="Terminal"
firebase functions:log --project <your-project-id>
```

Or open **Functions → Logs** in the console. Every failure in `sendMail` is logged as `sendMail failed`; a failed receipt or booking e-mail is logged as a warning (`receipt email failed`, `customer confirmation failed`, `store notification failed`) without stopping the payment or booking. In Google Cloud Console → **Logging → Log-based alerts**, create an alert on `severity>=ERROR` for the functions so you hear about problems by e-mail.

### E-mail delivery

Every e-mail the functions send, or fail to send, is recorded in `workspaces/{wid}/emailLog` with `status` (`sent` or `failed`), the error text and the SMTP message ID. Check it in the Firestore console when a customer says an e-mail never arrived.

### Payments

Each payment attempt creates `workspaces/{wid}/paymentSessions/{id}` with `status: pending`, which becomes `paid` with the provider's transaction ID once verified. A session left at `pending` means the customer did not finish, or the return page was never reached. Compare with your Razorpay, Stripe or PayPal dashboard. See [Payment Flow](doc:api/payment-flow).

### Activity log

Booqora writes an `activity` entry for creates, updates, deletes, settings changes and online payments. The **Activity** report (`/reports/activity`) shows it inside the platform.

### Usage and cost

- **Firebase console → Usage and billing** shows Firestore reads and writes, function invocations and storage per day.
- Keep the **budget alert** from [Create the Firebase Project](doc:installation/firebase-project#2-upgrade-to-the-blaze-plan) in place.
- **Hosting → Usage** shows bandwidth for the platform and the website.

**Next:** [Dashboard →](doc:admin/dashboard)
