---
title: Keys & Environment
description: Where every key and configuration value lives in ClassiAds-Hub. The functions .env file, the payment secrets in Secret Manager, the Firebase web config of the website and the panel, and the settings stored in Firestore.
---

ClassiAds-Hub keeps very little configuration on disk. There are four kinds of values, each in one place:

| Kind | Where it lives | Set with |
|---|---|---|
| **Backend values** (Web API key, public payment ids) | `functions/.env` (git-ignored) | A text editor, or `tools/payments/setup-payments.mjs` |
| **Payment secret keys** | Firebase **Secret Manager**: `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET` | `firebase functions:secrets:set`, or the setup script |
| **Firebase web config and API addresses** | `web/src/lib/firebase.ts`, `web/src/lib/config.ts`, `admin/src/lib/firebase.ts`, `admin/src/lib/api.ts` | A text editor, then rebuild |
| **Business settings** (site name, ads rules, OTP, AI, web push…) | Firestore `settings/{group}` | The Admin Panel → **Settings** |

## 1. `functions/.env`

```env title="functions/.env"
WEB_API_KEY=YOUR_FIREBASE_WEB_API_KEY
# Payments (public ids; secret keys live in Secret Manager)
RAZORPAY_KEY_ID=rzp_test_your_key_id
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_ENV=sandbox
STRIPE_PUBLISHABLE_KEY=
```

| Variable | Used by | Meaning |
|---|---|---|
| `WEB_API_KEY` | `functions/src/routes/auth.ts` | The Firebase **Web API key** (Project settings → General). Login and account deletion check the password through the Identity Toolkit REST API with it. **Required** |
| `RAZORPAY_KEY_ID` | `functions/src/lib/payments.ts` | Razorpay key id (`rzp_test_…` or `rzp_live_…`), paired with the secret `RAZORPAY_KEY_SECRET` |
| `PAYPAL_CLIENT_ID` | `functions/src/lib/payments.ts` | PayPal REST app client id, paired with `PAYPAL_CLIENT_SECRET` |
| `PAYPAL_ENV` | `functions/src/lib/payments.ts` | `live` uses `api-m.paypal.com`. Anything else uses the sandbox `api-m.sandbox.paypal.com` |
| `STRIPE_PUBLISHABLE_KEY` | Written by the setup script, not read by the code | Stripe Checkout is hosted, so only the secret key is needed |

The file is deployed with the functions. After you change it, run `firebase deploy --only functions`.

## 2. Payment secrets (Secret Manager)

| Secret | Gateway | Format |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe Checkout Sessions | `sk_test_…` / `sk_live_…` |
| `RAZORPAY_KEY_SECRET` | Razorpay Payment Links | The key secret of `RAZORPAY_KEY_ID` |
| `PAYPAL_CLIENT_SECRET` | PayPal Orders v2 | The secret of `PAYPAL_CLIENT_ID` |

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase deploy --only functions      # functions read the new version on deploy
```

The keys you type in **Admin → Settings → Payment Gateways → Configure** are **not** used by Stripe, Razorpay or PayPal. The backend reads only Secret Manager and `functions/.env`. The admin page switches each gateway on or off and sets its display name. See [Payment Gateways](doc:admin/payment-gateways).

## 3. Payment keys

`tools/payments/setup-payments.mjs` does the whole payment setup in one run:

1. Writes `RAZORPAY_KEY_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_ENV` and `STRIPE_PUBLISHABLE_KEY` to `functions/.env` (other lines are kept).
2. Stores the three secret keys in Secret Manager (through a temporary file, never the command line).
3. Deploys the functions.
4. In Firestore `payment_gateways`: enables **Card (Stripe)**, **Razorpay (UPI / Cards / Netbanking)** and **PayPal**, sets each one's `mode` to `live` or `sandbox` from the key prefix (`sk_test_`, `rzp_test_`, `PAYPAL_ENV`), and **disables Sandbox and Bank Transfer**.
5. Rebuilds the website and deploys `hosting:web`.

It reads the keys from `secret/prod.env` (the `secret/` folder is git-ignored):

```env title="secret/prod.env"
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox
```

All of `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are required by the script.

:::warning Edit the script for your project first
The script targets the demo project: it passes `--project classiadshub` to every `firebase` command and loads the service-account file `secret/classiadshub-firebase.json`. Replace both with your project ID and your own key file. It also loads `firebase-admin` from `tools/migrate`, so run `npm install` in `tools/migrate` once.
:::

```bash
cd tools/payments
node setup-payments.mjs                 # all five steps
node setup-payments.mjs --skip-deploy   # steps 1, 2 and 4 only
```

Re-run it whenever `prod.env` changes, for example when you switch to live keys. If you want to keep **Bank Transfer**, switch it back on in the Admin Panel afterwards. The API caches the gateway list for about 30 seconds.

:::danger Sandbox is switched off, not removed
The script only sets `is_active: false` on the `sandbox` row. Its public test webhook keeps working while the row exists. On a live marketplace delete the `sandbox` document from `payment_gateways`. See [Billing & Payments](doc:api/billing#sandbox-and-the-public-webhook).
:::

## 4. Firebase web config

The website and the Admin Panel each contain the Firebase web config. The shipped files point at the demo project. Replace the `config` object with the `firebaseConfig` you copied in [Create the Firebase Project](doc:installation/firebase-project#7-register-the-web-app):

```ts title="web/src/lib/firebase.ts and admin/src/lib/firebase.ts"
const config = {
  apiKey: "YOUR_FIREBASE_WEB_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_WEB_APP_ID",
};
```

## 5. API addresses

On Firebase Hosting both sites call `/api/v1` on their own domain. Locally (and at build time, for the website's sitemap) they call the function URL directly. Change the project ID in these lines:

| File | Value | Used when |
|---|---|---|
| `web/src/lib/config.ts` | `FUNCTION_API = "https://us-central1-your-project-id.cloudfunctions.net/api/v1"` | `localhost`, and the build-time sitemap |
| `web/src/lib/config.ts` | `SITE_URL`: default `https://classiadshub.web.app`, or `NEXT_PUBLIC_SITE_URL` | Canonical URLs, `robots.txt`, `sitemap.xml` |
| `web/src/lib/config.ts` | `APP_NAME`, `APP_TAGLINE` | The site name in titles and the header |
| `admin/src/lib/api.ts` | The `localhost` fallback `https://us-central1-your-project-id.cloudfunctions.net/api/v1` | `localhost` |
| `mobile/lib/core/config/app_config.dart` | `apiBaseUrl`, or `--dart-define=API_BASE_URL=…` | The app. See [API Configuration](doc:app/api-configuration) |

Both sites also accept `NEXT_PUBLIC_API_BASE` (in `web/.env.local` or `admin/.env.local`) to override the API address. Leave it unset for Hosting.

```env title="web/.env.local"
NEXT_PUBLIC_SITE_URL=https://www.yourcompany.com
# NEXT_PUBLIC_API_BASE=   (leave unset on Firebase Hosting)
```

## 6. Settings in Firestore

Everything else you configure in **Settings** in the panel. Each settings group is one document `settings/{group}`, for example `general`, `ads`, `commerce`, `web`, `notifications`, `firebase`, `otp`, `media`, `video_ads`, `admob`, `adsense`, `ai`, `home`. The API serves them to the website and the app through `GET /config`, **without** the keys marked secret (`_secret`): the Twilio token, the Gemini API key and similar. See [General, Web & SEO](doc:admin/settings).

One value has no form in the panel: **`settings/general.frontend_url`**. It is the base of the checkout return address (`<frontend_url>/checkout/result?txn=<id>`) and defaults to `https://classiadshub.web.app`. Set it to your website address in the Firestore console. See [Hosting, Domain & SSL](doc:installation/hosting#3-the-checkout-return-address).

## 7. Other references to the demo project

Search the code for `classiadshub` after you switch projects. Besides the files above:

| File | What |
|---|---|
| `admin/src/app/(panel)/settings/[section]/section.tsx` | The read-only project details on **Settings → Firebase Settings**, the console link and the bucket name on **File Manager** |
| `admin/src/components/shell.tsx` | The *visit website* link in the top bar |
| `functions/src/lib/auth.ts` | The synthetic e-mail domain for phone accounts, `@phone.classiadshub.app`. Keep it: changing it breaks existing phone logins |
| `tools/**` | Project ID, bucket and service-account path in the migration, payment and QA scripts |

:::danger Never commit keys
`secret/`, `**/.env` and `**/.env.*` are in `.gitignore`. Keep `functions/.env` and `secret/prod.env` out of your repository and store a copy in your password manager. The Firebase web config is not a secret, but gateway secret keys and service-account files are.
:::

**Next:** [Admin Panel Installation →](doc:installation/admin-panel)
