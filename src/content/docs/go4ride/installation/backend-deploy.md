---
title: Deploy the Backend
description: Build the TypeScript Cloud Functions and deploy them together with the Firestore, Storage and Realtime Database rules and the Firestore indexes, including the IAM roles a first Cloud Functions v2 deploy needs.
---

The backend is everything `firebase.json` at the repository root points to. One deploy uploads:

| What | File(s) | Purpose |
|---|---|---|
| **Cloud Functions** | `functions/src/*.ts` (compiled to `functions/lib/`) | 19 functions: fare, dispatch, settlement, payments, payouts, KYC, staff, subscriptions, roles, scheduled jobs. See [Callable Functions](doc:api/callable-functions) and [Triggers & Scheduled Jobs](doc:api/triggers) |
| **Firestore rules** | `firebase/firestore.rules` | Role-based access via custom claims. Money fields are written only by functions |
| **Firestore indexes** | `firebase/firestore.indexes.json` | 8 composite indexes (`rides`, `bids`, `transactions`, `withdrawals`, `banners`) |
| **Storage rules** | `firebase/storage.rules` | KYC, profile, ride, support and admin upload paths, 10 MB limit |
| **Realtime Database rules** | `firebase/database.rules.json` | `driver_locations`: any signed-in user reads, each driver writes only their own node |

```json title="firebase.json (functions block)"
"functions": [
  {
    "source": "functions",
    "codebase": "default",
    "runtime": "nodejs20",
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"]
  }
]
```

The functions run in **`us-central1`** with default memory and timeout. They use no Secret Manager secrets and no `.env` file: payment keys are read at runtime from Firestore (`settings/payment` and `secure_settings/payment`), which you fill in from the admin panel. See [Keys & Environment](doc:installation/environment-configuration).

## 1. Install and build

```bash
cd functions
npm install
npm run build        # tsc → functions/lib/
cd ..
```

The deploy runs `npm run build` again for you as the `predeploy` step, so a TypeScript error stops the deploy before anything is uploaded.

## 2. Check the project

```bash
firebase use          # must print your-project-id
```

## 3. Deploy

From the repository root:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage,database,functions
```

The first deploy takes 5–10 minutes. It enables Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Eventarc, Pub/Sub and Cloud Scheduler for you. If the CLI asks for an Artifact Registry **cleanup policy**, accept it so old container images are deleted automatically.

:::tip Deploy from an Owner account
Run `firebase login` with the Google account that owns the project. The first deploy enables APIs and grants IAM roles, which an Editor or a service-account key often cannot do.
:::

:::note The `database` target needs the Realtime Database
If you skipped [creating the Realtime Database](doc:installation/firebase-project), deploying `database` fails. Create it in the console and run the command again.
:::

## 4. First-deploy IAM roles (Cloud Functions v2)

Go4Ride uses 2nd-gen **Firestore triggers** (`onRideCreated`, `onRideStatusChanged`, `onDriverProfileCreated`, `onUserProfileCreated`) and **scheduled functions**. These are delivered through Eventarc and Pub/Sub, which need a few roles on Google's default service accounts. The Firebase CLI grants them automatically on the first deploy. If your account isn't allowed to change IAM, or Google is still creating the service agents, the deploy fails with a message such as *"Since this is your first time using 2nd gen functions, we need a little bit longer to finish setting everything up. Retry the deployment in a few minutes."* or a *permission denied* on Eventarc.

First, **wait 3–5 minutes and run the same deploy again**. That fixes most cases. If it keeps failing, grant the roles yourself (Google Cloud Console → **IAM & Admin → IAM**, tick *Include Google-provided role grants*), or with `gcloud`:

| Service account | Role | Why |
|---|---|---|
| `PROJECT_NUMBER-compute@developer.gserviceaccount.com` (default compute) | **Cloud Run Invoker** (`roles/run.invoker`) | Eventarc and Cloud Scheduler call the functions |
| `PROJECT_NUMBER-compute@developer.gserviceaccount.com` | **Eventarc Event Receiver** (`roles/eventarc.eventReceiver`) | Receives the Firestore events |
| `service-PROJECT_NUMBER@gcp-sa-pubsub.iam.gserviceaccount.com` (Pub/Sub service agent) | **Service Account Token Creator** (`roles/iam.serviceAccountTokenCreator`) | Pub/Sub signs push requests. Needed on projects created on or before 8 April 2021 |

```bash
PROJECT=your-project-id
PN=$(gcloud projects describe $PROJECT --format='value(projectNumber)')

gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$PN-compute@developer.gserviceaccount.com" --role=roles/run.invoker
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$PN-compute@developer.gserviceaccount.com" --role=roles/eventarc.eventReceiver
gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:service-$PN@gcp-sa-pubsub.iam.gserviceaccount.com" \
  --role=roles/iam.serviceAccountTokenCreator
```

Find the project number under Project settings → **General** if you don't use `gcloud`.

:::warning "Missing permission on the build service account"
On newer Google Cloud projects, Cloud Build builds functions with the **default compute service account**. If the deploy fails with *"Could not build the function due to a missing permission on the build service account"*, give that account the **Cloud Build Service Account** role (`roles/cloudbuild.builds.builder`) and deploy again.
:::

:::note No token-signing role needed
Unlike some other products, Go4Ride never mints custom tokens: admins sign in with Firebase Email/Password and riders with Phone OTP. The function's own service account needs no *Service Account Token Creator* role and you don't need the IAM Credentials API.
:::

## 5. Verify

- Firebase console → **Functions**: 19 functions in `us-central1`, all green: `calculateFare`, `onRideCreated`, `onRideStatusChanged`, `createPayment`, `paymentReturn`, `checkPayment`, `approveWithdrawal`, `setUserRole`, `reviewKyc`, `sendBroadcast`, `devBootstrapAdmin`, `createStaffUser`, `updateStaff`, `deleteStaff`, `purchaseSubscription`, `onDriverProfileCreated`, `onUserProfileCreated`, `dailyAnalyticsRollup`, `expireRideRequests`.
- Firestore → **Rules**, Storage → **Rules** and Realtime Database → **Rules** show the Go4Ride rules. Firestore → **Indexes** shows the composite indexes as *Enabled* (building takes a few minutes).
- Cloud Scheduler (Google Cloud Console) lists two jobs: `expireRideRequests` (every minute) and `dailyAnalyticsRollup` (daily 00:30).
- The payment return page answers:

```bash
curl "https://us-central1-your-project-id.cloudfunctions.net/paymentReturn"
# → an HTML page "Payment not completed" (no payment id given). That is correct.
```

If the function URLs answer **403 Forbidden** from Google instead, your organisation blocks public (`allUsers`) access to Cloud Run. Callable and HTTP functions must be publicly invocable (the callables check Firebase Auth themselves). Allow it for this project in the organisation policy (*Domain restricted sharing*).

:::danger devBootstrapAdmin is deployed but disabled
`devBootstrapAdmin` grants the caller the admin role, but only when it runs inside the Functions **emulator** (`FUNCTIONS_EMULATOR === "true"`). In production it always answers `permission-denied`. Create your first production admin as shown in [Create the First Admin](doc:installation/super-admin).
:::

## Updating later

After you change backend code:

```bash
firebase deploy --only functions
```

After you change only rules or indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage,database
```

To deploy a single function: `firebase deploy --only functions:createPayment`. To roll back, deploy the previous version from your Git history. Rules also keep their own history in the console (Rules → History).

**Next:** [Keys & Environment →](doc:installation/environment-configuration)
