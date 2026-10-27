---
title: Deploy the Backend
description: Build the TypeScript Cloud Functions and deploy them together with the Firestore and Storage rules and the Firestore indexes, including the secrets and environment values the first deploy needs.
---

The backend is everything `firebase.json` at the repository root points to, except Hosting. One deploy uploads:

| What | File(s) | Purpose |
|---|---|---|
| **Cloud Functions** | `functions/src/**/*.ts` (compiled to `functions/lib/`) | `api`: the whole REST API under `/api/v1` and `/v1`. `housekeeping`: the hourly job. See [Architecture](doc:api/overview) and [Scheduled Jobs](doc:api/scheduled-jobs) |
| **Firestore rules** | `firebase/firestore.rules` | Clients may only read their own chat threads. Everything else goes through the API |
| **Firestore indexes** | `firebase/firestore.indexes.json` | 4 composite indexes (`ads` ×2, `subscriptions`, `messages`) |
| **Storage rules** | `firebase/storage.rules` | Public read for media folders, no client writes |

```json title="firebase.json (functions block)"
"functions": [
  {
    "source": "functions",
    "codebase": "default",
    "runtime": "nodejs22",
    "ignore": ["node_modules", ".git", "*.local", "src"],
    "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"]
  }
]
```

Only the compiled `lib/` folder is uploaded (`src` is ignored). The `predeploy` step runs `tsc` first, so a TypeScript error stops the deploy before anything is uploaded.

The two functions, from `functions/src/index.ts`:

| Function | Type | Settings |
|---|---|---|
| `api` | HTTPS (`onRequest`) | `us-central1`, 512 MiB, 120 s timeout, concurrency 40, max 20 instances, `invoker: "public"`, secrets `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET` |
| `housekeeping` | Scheduled (`onSchedule`) | `every 60 minutes`, 300 s timeout, the same three secrets |

## 1. Install and build

```bash
cd functions
npm install
npm run build        # tsc → functions/lib/
cd ..
```

## 2. Create `functions/.env`

The function reads a few non-secret values from `functions/.env` (git-ignored). Create it with at least the Web API key:

```env title="functions/.env"
WEB_API_KEY=YOUR_FIREBASE_WEB_API_KEY
# Payments (public ids; secret keys live in Secret Manager)
RAZORPAY_KEY_ID=rzp_test_your_key_id
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_ENV=sandbox
```

`WEB_API_KEY` is required: `POST /auth/login` uses it to check passwords against Firebase Auth. Without it every login fails with *These credentials do not match our records.* The payment values are explained in [Keys & Environment](doc:installation/environment-configuration).

## 3. Create the three secrets

Both functions declare the secrets `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET` and `PAYPAL_CLIENT_SECRET`. They must exist in Secret Manager before the deploy, or the CLI stops and asks for them. Set them now. If you don't use a gateway yet, store a placeholder such as `not-set` and replace it later:

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set PAYPAL_CLIENT_SECRET
```

Each command asks for the value and enables the Secret Manager API on the first run. `tools/payments/setup-payments.mjs` can do this for you from a key file. See [Keys & Environment](doc:installation/environment-configuration#3-payment-keys).

## 4. Check the project

```bash
firebase use          # must print your-project-id
```

## 5. Deploy

From the repository root:

```bash
export FUNCTIONS_DISCOVERY_TIMEOUT=900
export NODE_OPTIONS=--max-old-space-size=4096
firebase deploy --only functions,firestore:rules,firestore:indexes,storage
```

The two environment variables give the CLI enough time and memory to load the functions code during deploy (the payment setup script sets them the same way). In PowerShell use `$env:FUNCTIONS_DISCOVERY_TIMEOUT="900"` and `$env:NODE_OPTIONS="--max-old-space-size=4096"`.

The first deploy takes 5–10 minutes. It enables Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Cloud Scheduler and Pub/Sub for you. If the CLI asks for an Artifact Registry **cleanup policy**, accept it so old container images are deleted automatically.

:::tip Deploy from an Owner account
Run `firebase login` with the Google account that owns the project. The first deploy enables APIs and grants IAM roles, which an Editor or a service-account key often cannot do.
:::

:::warning "Missing permission on the build service account"
On newer Google Cloud projects, Cloud Build builds functions with the **default compute service account**. If the deploy fails with *"Could not build the function due to a missing permission on the build service account"*, give `PROJECT_NUMBER-compute@developer.gserviceaccount.com` the **Cloud Build Service Account** role (`roles/cloudbuild.builds.builder`) in Google Cloud Console → IAM, and deploy again.
:::

:::note No token-signing role needed
ClassiAds-Hub never mints custom tokens: clients sign in with Firebase Email/Password (or Google) using the `auth_email` the API returns. The function's service account needs no *Service Account Token Creator* role.
:::

If the first deploy fails with *"we need a little bit longer to finish setting everything up"*, wait 3–5 minutes and run the same command again.

## 6. Verify

- Firebase console → **Functions**: `api` and `housekeeping` in `us-central1`, both green.
- Firestore → **Rules** and Storage → **Rules** show the ClassiAds-Hub rules. Firestore → **Indexes** shows 4 composite indexes as *Enabled* (building takes a few minutes).
- Google Cloud Console → **Cloud Scheduler** lists `firebase-schedule-housekeeping-us-central1`, every 60 minutes.
- The API answers:

```bash
curl https://us-central1-your-project-id.cloudfunctions.net/api/v1/health
# {"success":true,"data":{"service":"classiads-api","version":"v1","time":"…"},"message":"OK","meta":null,"errors":null}

curl https://us-central1-your-project-id.cloudfunctions.net/api/v1/health/ready
# "status":"ready" when Firestore is reachable (HTTP 503 "degraded" otherwise)
```

If the URL answers **403 Forbidden** from Google instead of JSON, your organisation blocks public (`allUsers`) access to Cloud Run. The `api` function must be publicly invocable: it checks the Firebase ID token itself. Allow it for this project in the organisation policy (*Domain restricted sharing*).

:::note The database is still empty
A new project has no categories, settings or payment gateways yet. The API returns empty lists until you add them in the panel ([Setup Guide](doc:installation/setup-guide)) or import the sample data ([Data Migration](doc:installation/data-migration)).
:::

## Updating later

After you change backend code:

```bash
firebase deploy --only functions
```

After you change only rules or indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

To deploy one function: `firebase deploy --only functions:api`. To roll back, deploy the previous version from your Git history. Rules also keep their own history in the console (Rules → History).

**Next:** [Keys & Environment →](doc:installation/environment-configuration)
