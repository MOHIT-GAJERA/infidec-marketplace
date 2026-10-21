---
title: Deploy the Backend
description: Install the backend dependencies and deploy Cloud Functions, Firestore rules, indexes and Storage rules to your Firebase project.
---

The `firebase/` folder is the QwikMart backend. Deploying it uploads:

| What | File(s) | Purpose |
|---|---|---|
| **Cloud Functions** | `firebase/functions/src/**` (TypeScript → `lib/`) | ~60 callable functions and triggers: cart pricing, orders, payments, wallet, riders, notifications, AI |
| **Firestore rules** | `firebase/firestore.rules` | Who may read / write each collection |
| **Firestore indexes** | `firebase/firestore.indexes.json` | Composite indexes for every list and filter in the apps and panels |
| **Storage rules** | `firebase/storage.rules` | Who may upload images and documents |

## 1. Install dependencies

```bash
cd firebase
npm install                      # Firebase CLI (local copy)
npm --prefix functions install   # Cloud Functions dependencies
```

## 2. Log in and select your project

```bash
npx firebase login
npx firebase use yourstore-1a2b3     # your Project ID
```

Also replace the old project ID in `firebase/package.json` scripts if you use `npm run deploy`:

```json title="firebase/package.json"
"deploy": "firebase deploy --only functions,firestore,storage --project yourstore-1a2b3"
```

## 3. Function parameters

Rename `firebase/functions/.env.<old-project-id>` to `firebase/functions/.env.yourstore-1a2b3` (or create it):

```env title="firebase/functions/.env.yourstore-1a2b3"
# Warm instances for detectZone / getHome / cartSummary (1 removes cold starts, costs one idle instance each)
HOT_MIN_INSTANCES=0
# Turn on only after every client sends App Check tokens
ENFORCE_APP_CHECK=false
```

## 4. Deploy

Deploy rules and indexes first, then the functions:

```bash
npx firebase deploy --only firestore:rules,firestore:indexes,storage
npx firebase deploy --only functions
```

The functions deploy runs `npm run build` (TypeScript → JavaScript) automatically and takes 5–10 minutes the first time. Every function runs in **`asia-south1`**.

:::warning First deploy errors are normal
On a brand-new project the first functions deploy sometimes fails with *"Permission denied while using the Eventarc Service Agent"* or a similar message, because Google is still creating service accounts. Wait two or three minutes and run the same command again.
:::

:::note Indexes take a few minutes
Open Firestore → **Indexes** and wait until every index shows **Enabled** before you test the apps. A list that needs an index that is still building shows an error until it is ready.
:::

## 5. Allow signed download links

Invoices and report exports use signed URLs. Grant the functions' service account the **Service Account Token Creator** role on itself (once per project):

```bash
PN=$(gcloud projects describe yourstore-1a2b3 --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding $PN-compute@developer.gserviceaccount.com \
  --member="serviceAccount:$PN-compute@developer.gserviceaccount.com" \
  --role=roles/iam.serviceAccountTokenCreator --project=yourstore-1a2b3
```

No `gcloud`? Google Cloud Console → **IAM & Admin → Service accounts** → *Compute Engine default service account* → **Permissions** → Grant access → same account → role *Service Account Token Creator*.

## 6. Verify

- Firebase console → **Functions**: every function is listed with a green status.
- Firestore → **Rules** shows the QwikMart rules; **Indexes** are Enabled.
- Storage → **Rules** shows the QwikMart rules.

## Updating later

After you change backend code or receive an update:

```bash
cd firebase
npx firebase deploy --only functions,firestore,storage
```

To roll back, deploy the previous version from your Git history. Firestore and Storage rules also keep their own history in the console (Rules → History).

**Next:** [Admin Panel Installation →](doc:installation/admin-panel)
