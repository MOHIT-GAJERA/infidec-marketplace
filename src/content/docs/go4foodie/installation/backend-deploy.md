---
title: Deploy the Backend
description: Install the backend dependencies, create the secrets and plain config, choose the function's service account, and deploy the api function, the rules and the API host.
---

The `firebase/` folder is the Go4Foodie backend. Deploying it uploads:

| What | File(s) | Purpose |
|---|---|---|
| **Cloud Function `api`** | `firebase/functions/src/**` (TypeScript → `lib/`) | The whole REST API: `/api/*` (website), `/api/mobile/*` (app), `/api/admin/*` (panel), plus `/up` health check |
| **Firestore rules** | `firebase/firestore.rules` | Clients can't write anything. Signed-in admin users may only *read* the live collections |
| **Firestore indexes** | `firebase/firestore.indexes.json` | Empty. The API needs no composite indexes |
| **Storage rules** | `firebase/storage.rules` | Deny all. Uploads go through the function |
| **Hosting** | `firebase/firebase.json` → targets `admin` and `api` | Rewrites `/api/**` to the function. The admin target is deployed on the [next-but-one page](doc:installation/admin-panel) |

The function is defined in `functions/src/index.ts`: region `asia-south1`, 512 MiB memory, 120 s timeout, `minInstances: 0`, and five **secrets** it needs at runtime.

## 1. Install dependencies

```bash
cd firebase/functions
npm install
```

The deploy runs `npm run build` (TypeScript → `lib/`) for you as a predeploy step.

## 2. Select your project

```bash
cd firebase
firebase login
firebase use yourrestaurant-1a2b3
```

## 3. Plain configuration file

Non-secret settings are deployed with the function from `firebase/functions/.env.<project-id>`. Delete the `.env.<old-project-id>` file that ships in the package and create your own:

```env title="firebase/functions/.env.yourrestaurant-1a2b3"
LOCAL_TZ=Asia/Kolkata
WEBSITE_URL=https://yourrestaurant.com

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SCHEME=
MAIL_USERNAME=orders@yourrestaurant.com
MAIL_FROM_ADDRESS=orders@yourrestaurant.com

RAZORPAY_KEY_ID=
RAZORPAY_CURRENCY=INR
STRIPE_PUBLISHABLE_KEY=
STRIPE_CURRENCY=usd
PAYPAL_CLIENT_ID=
PAYPAL_ENV=sandbox
PAYPAL_CURRENCY=USD
```

Leave a value empty to turn that feature off. Every variable is explained in [Environment Configuration](doc:installation/environment-configuration).

:::danger No secrets in this file
This file is uploaded in plain text with the function. Passwords and secret keys belong in **Secret Manager** (next step). A name that is both a secret and a line in `.env` makes the deploy fail.
:::

## 4. Create the secrets

The function declares five secrets: `AUTH_SECRET`, `MAIL_PASSWORD`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY` and `PAYPAL_CLIENT_SECRET`. **Every one of them must exist in Secret Manager, or the deploy fails**, even the ones you don't use yet.

```bash
firebase functions:secrets:set AUTH_SECRET          # paste a long random string (see below)
firebase functions:secrets:set MAIL_PASSWORD        # SMTP password / Gmail app password
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set PAYPAL_CLIENT_SECRET
```

Each command asks for the value. Nothing is echoed to the screen.

- **`AUTH_SECRET`** signs the mobile app's login tokens. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`. If you are moving from an older Go4Foodie server, use **the same value as before** so existing app logins keep working.
- For a gateway or SMTP you don't use yet, enter a placeholder such as `unused` and leave its partner value in the `.env` file empty (`RAZORPAY_KEY_ID=`, `MAIL_HOST=`…). A gateway only counts as configured when **both** of its keys are set. See [Payment Gateways](doc:admin/payment-gateways).

On the first deploy the Firebase CLI gives the function's service account access to these secrets.

## 5. Choose the function's service account

Admin sign-in calls `createCustomToken`, and inside Cloud Functions that needs the runtime identity to **sign** with its own key. That takes the **Service Account Token Creator** role and the **IAM Service Account Credentials API**.

`functions/src/index.ts` runs the function as the project's **Firebase Admin SDK** service account, which already holds Token Creator. Replace the shipped address with yours:

```ts title="firebase/functions/src/index.ts"
export const api = onRequest(
  {
    memory: '512MiB',
    timeoutSeconds: 120,
    minInstances: 0,
    serviceAccount: 'firebase-adminsdk-fbsvc@yourrestaurant-1a2b3.iam.gserviceaccount.com',
    secrets: ['AUTH_SECRET', 'MAIL_PASSWORD', 'RAZORPAY_KEY_SECRET', 'STRIPE_SECRET_KEY', 'PAYPAL_CLIENT_SECRET'],
  },
  app,
);
```

Copy the exact address from **Project settings → Service accounts** (*Firebase Admin SDK* section). Older projects use a name like `firebase-adminsdk-ab12c@…`.

:::note Alternative: use the default compute service account
Delete the `serviceAccount:` line instead. The function then runs as `<project-number>-compute@developer.gserviceaccount.com`. Give that account the role in Google Cloud Console → **IAM & Admin → IAM** → *Default compute service account* → **Edit** → *Add role* → **Service Account Token Creator**. Or with `gcloud`:

```bash
PN=$(gcloud projects describe yourrestaurant-1a2b3 --format='value(projectNumber)')
gcloud projects add-iam-policy-binding yourrestaurant-1a2b3 \
  --member="serviceAccount:$PN-compute@developer.gserviceaccount.com" \
  --role=roles/iam.serviceAccountTokenCreator
```
:::

Then enable **IAM Service Account Credentials API** (`iamcredentials.googleapis.com`) once in APIs & Services → Library. Without it, every admin login fails with a server error, even though the website and the app work.

:::tip Deploy from an Owner account
Run `firebase login` with the Google account that owns the project. The first deploy enables Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Secret Manager and Eventarc for you. A service-account key can't enable APIs.
:::

## 6. Deploy

Deploy the function, the rules and the **API host**. The admin site follows once the panel is built:

```bash
cd firebase
FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions,firestore,storage,hosting:api
```

`FUNCTIONS_DISCOVERY_TIMEOUT=90` gives the CLI 90 seconds to load the function code and read its settings. The default is shorter, and the Express app with all its routes can go over it on a slow machine. On PowerShell use `$env:FUNCTIONS_DISCOVERY_TIMEOUT=90; firebase deploy --only functions,firestore,storage,hosting:api`.

The first functions deploy takes 3–6 minutes. If the CLI asks for an Artifact Registry **cleanup policy**, accept it so old container images are deleted automatically.

:::warning First-deploy errors are normal
On a brand-new project the first deploy sometimes fails with a *permission denied* or *service agent* error while Google is still creating service accounts. Wait two or three minutes and run the same command again.
:::

## 7. Verify

```bash
curl https://yourrestaurant-1a2b3.web.app/up         # → ok
curl https://yourrestaurant-1a2b3.web.app/api/menu   # → {"items":[],"categories":[]} on a new project
curl https://yourrestaurant-1a2b3.web.app/api/payment  # → {"razorpay":false,"stripe":false,"paypal":false}
```

- Firebase console → **Functions**: `api` is listed in `asia-south1` with a green status.
- Firestore → **Rules** and Storage → **Rules** show the Go4Foodie rules.

If `/api/…` answers **403 Forbidden** from Google instead of JSON, your organisation blocks public (`allUsers`) access to Cloud Run. Allow public invocation for this project in the organisation policy (*Domain restricted sharing*).

## Updating later

After you change backend code, `.env.<project-id>` or a secret value:

```bash
cd firebase
FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions
```

The deploy pins each secret's current version to the function, so **redeploy after every `functions:secrets:set`**. Until you do, the function keeps using the old value. To roll back, deploy the previous version from your Git history. Firestore and Storage rules also keep their own history in the console (Rules → History).

**Next:** [Environment Configuration →](doc:installation/environment-configuration)
