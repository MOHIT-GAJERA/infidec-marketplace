---
title: Deploy Functions, Rules & Indexes
description: Install the Cloud Functions dependencies and deploy Booqora's five functions, Firestore rules and indexes, and Storage rules to your Firebase project.
---

With the project connected and the secrets in place, deploy the backend from `booqora_platform/`. Everything here is declared in `booqora_platform/firebase.json`.

## 1. Install the function dependencies

```bash title="Terminal"
cd booqora_platform/functions
npm install
cd ..
```

The functions are plain JavaScript ES modules (`"type": "module"`), so there is **no build step**. Dependencies: `firebase-admin`, `firebase-functions` (v2 API), `stripe` and `nodemailer`. Stripe and Nodemailer load only on first use, which keeps cold starts and deploy discovery fast.

## 2. Deploy the security rules and indexes

```bash title="Terminal"
firebase deploy --only firestore:rules,firestore:indexes,storage --project <your-project-id>
```

| File | What it does |
|---|---|
| `firestore.rules` | Multi-tenant rules: data under `workspaces/{wid}` is open only to members; the Online Store may read products, bundles and collections marked *show in store* and create **online draft** orders. See [Security Rules](doc:api/security-rules) |
| `firestore.indexes.json` | Empty on purpose. Booqora queries use a single `orderBy` or a single equality filter, so no composite indexes are needed |
| `storage.rules` | Public read for workspace media; uploads only by signed-in staff, images or PDFs under 10 MB, stamped with the uploader's uid |

Deploy rules **before** you open the platform. Without them, Firestore's production-mode default denies every request and the app cannot load.

## 3. Deploy the functions

```bash title="Terminal"
firebase deploy --only functions --project <your-project-id>
```

The first deploy takes several minutes. Firebase may ask to enable APIs (Cloud Functions, Cloud Build, Artifact Registry, Eventarc, Cloud Run, Secret Manager); answer **yes**. It may also ask about a clean-up policy for old container images; accepting it keeps storage costs down.

### Discovery timeout

Before uploading, the CLI loads `index.js` to discover the functions. On a slow disk this can exceed the default timeout and fail with *"User code failed to load. Cannot determine backend specification"*. Raise the limit:

```bash title="macOS / Linux"
FUNCTIONS_DISCOVERY_TIMEOUT=60 firebase deploy --only functions --project <your-project-id>
```

```powershell title="Windows PowerShell"
$env:FUNCTIONS_DISCOVERY_TIMEOUT = "60"
firebase deploy --only functions --project <your-project-id>
```

:::warning "Secret … not found" errors
Every secret a function binds must exist in Secret Manager. Create any missing one (a placeholder is fine for providers you do not use, see [Secrets & Environment](doc:installation/environment-configuration#2-create-the-secrets)) and deploy again.
:::

:::note Deploy functions from your own computer
The included GitHub Actions workflow deploys **hosting and rules only**. Deploy functions locally with your own `firebase login`. If you have `GOOGLE_APPLICATION_CREDENTIALS` set to a service account in your shell, unset it first so the CLI uses your login.
:::

## What gets deployed

| Function | Type | Secrets | Purpose |
|---|---|---|---|
| `paymentConfig` | Callable | Payment | Which payment providers a store can use right now, its currency and checkout mode |
| `createPayment` | Callable (signed in) | Payment | Starts a Razorpay order, a Stripe Checkout session or a PayPal order for an order |
| `verifyPayment` | Callable | Payment + SMTP | Confirms the payment with the provider, records it on the order and e-mails a receipt |
| `sendEmail` | Callable (staff) | SMTP | Sends an e-mail from the workspace (documents, payment links, messages) |
| `onOnlineOrder` | Firestore trigger on `workspaces/{wid}/orders/{oid}` create | SMTP | E-mails the customer and the store when an Online Store booking arrives |

Global options (`functions/index.js`): region **`asia-south1`**, **256 MiB** memory, **max 10 instances**, runtime **Node.js 22** (`firebase.json` → `"runtime": "nodejs22"`). Details in [Cloud Functions Reference](doc:api/cloud-functions).

## Everything in one command

Once you are comfortable, the whole backend deploys together:

```bash title="Terminal"
firebase deploy --only functions,firestore:rules,firestore:indexes,storage --project <your-project-id>
```

## Check the deploy

```bash title="Terminal"
firebase functions:list --project <your-project-id>
firebase functions:log --project <your-project-id>
```

You should see the five functions in `asia-south1`. In the console, **Firestore → Rules** and **Storage → Rules** show the new rules with today's date.

**Next:** [Build & Deploy to Hosting →](doc:installation/hosting)
