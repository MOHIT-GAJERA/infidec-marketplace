---
title: Payment Gateways
description: Enable Stripe, Razorpay and PayPal hosted checkout with the setup script, use the Sandbox gateway for testing, configure Bank Transfer, and understand which listed gateways are placeholders.
---

Payments happen **on the website only**. Buyers pay for [subscription packages](doc:admin/packages) and [featured ad plans](doc:admin/featured-plans) at `/checkout`. The mobile app has no purchases, so no Google Play or App Store billing is involved.

Open **Admin → Settings → Payment Gateways**. Subtitle: *"Sandbox and Bank Transfer are built in; other providers need live credentials"*. The data is the Firestore `payment_gateways` collection.

![Payment Gateways](/docs/classiadshub/images/admin-settings-payment-gateways.jpg "Admin → Settings → Payment Gateways")

## The table

| Column | Shows |
|---|---|
| **Gateway** | Display name shown at checkout |
| **Code** | `sandbox`, `bank_transfer`, `stripe`, `razorpay`, `paypal`, `paystack`, `phonepe`, `flutterwave`, `paytabs`, `dpo` |
| **Type** | **Online** or **Manual** (Bank Transfer) |
| **Mode** | **Sandbox** / **Live** drop-down. Saved at once |
| **Enabled** | Toggle. Only enabled gateways are offered at checkout (`GET /payment-gateways`) |
| **Credentials** | **Configure**: edit the gateway's `config` as JSON |

Every change calls `PUT /admin/payment-gateways/{id}` and shows *"Gateway updated."* The API caches the gateway list for about 30 seconds.

## What each gateway really does

| Gateway | Status in code | How it pays |
|---|---|---|
| **Sandbox (Test)** | Built in | No real money. The website confirms the payment straight away (`POST /payments/{id}/confirm`) |
| **Bank Transfer** | Built in, manual | Creates a pending transaction. An admin approves it in [Bank Transfer](doc:admin/transactions#bank-transfer) |
| **Stripe** | Integrated | Stripe Checkout Session |
| **Razorpay** | Integrated | Razorpay Payment Link (UPI, cards, netbanking) |
| **PayPal** | Integrated | PayPal Orders v2 (approve, then capture) |
| **Paystack, PhonePe, Flutterwave, PayTabs, DPO** | **Placeholders** | No integration. Checkout fails with *"… is not configured."* or *"… live integration is not enabled yet."* |

:::warning Keep placeholders disabled
Do not enable Paystack, PhonePe, Flutterwave, PayTabs or DPO. They are listed rows (carried over from the earlier version) without any payment code. Buyers who pick them get an error and a failed transaction.
:::

## How hosted checkout works (Stripe, Razorpay, PayPal)

:::steps
### Buyer starts checkout
The website calls `POST /subscriptions/checkout` or `POST /ads/{id}/feature/checkout`. The API creates a `pending` transaction and asks the gateway for a payment page (`functions/src/lib/payments.ts`).

### Buyer pays on the gateway's page
The website redirects to the returned `checkout_url`. The product name is *"ClassiAds Hub — Subscription package"* or *"ClassiAds Hub — Featured ad"*.

### Buyer returns
The gateway sends the buyer to `{frontend_url}/checkout/result?txn=<id>` (cancel adds `&cancelled=1`). The page calls `POST /payments/{id}/confirm`.

### Server verifies
The API asks the gateway for the real status. It activates the purchase only when the payment is paid **and** the amount and currency match the transaction. The client's word is never trusted.

### Fallback
If the buyer closes the tab, the hourly `housekeeping` function re-checks pending hosted payments from the last 2 days and settles them.
:::

:::danger Set your website URL
The return URL comes from the setting `general.frontend_url` (default `https://classiadshub.web.app`, written by the migration script). There is no field for it in the Admin Panel. Set it in the Firestore console: collection `settings`, document `general`, field `frontend_url` = `https://www.yourcompany.com`. Otherwise buyers are sent back to the demo site.
:::

## Set up Stripe, Razorpay and PayPal

Keys are **not** entered in the Admin Panel. The **Configure** JSON is ignored for these three gateways. The code reads:

| Value | Where it lives |
|---|---|
| `STRIPE_SECRET_KEY` | Firebase Secret Manager |
| `RAZORPAY_KEY_SECRET` | Firebase Secret Manager |
| `PAYPAL_CLIENT_SECRET` | Firebase Secret Manager |
| `RAZORPAY_KEY_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_ENV` (`sandbox` or `live`) | `functions/.env` |

The script `tools/payments/setup-payments.mjs` sets all of this in one run.

:::steps
### Get your keys
- **Stripe**: Dashboard → Developers → API keys (secret key `sk_test_…` or `sk_live_…`).
- **Razorpay**: Dashboard → Account & Settings → API Keys (`rzp_test_…` / `rzp_live_…` and its secret).
- **PayPal**: developer.paypal.com → Apps & Credentials (client id and secret, Sandbox or Live).

### Put them in `secret/prod.env`
```bash title="secret/prod.env"
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox
```
All five keys except `STRIPE_PUBLISHABLE_KEY` and `PAYPAL_ENV` are required; the script stops if one is missing. Never commit this folder.

### Point the script at your project
The script is written for the demo project. Before the first run, replace the project id `classiadshub` (in the `functions:secrets:set`, `deploy` and `initializeApp` calls) with `your-project-id`, and the service-account path `secret/classiadshub-firebase.json` with your own key file (Firebase console → Project settings → Service accounts → Generate new private key). The script loads `firebase-admin` from `tools/migrate/`, so run `npm install` there once.

### Run it from the repo root
```bash
firebase login
node tools/payments/setup-payments.mjs
```
Add `--skip-deploy` to only write the keys and update the gateways.
:::

The script does five things:

1. Writes the public ids to `functions/.env` under `# Payments (public ids; secret keys live in Secret Manager)`, keeping every other line.
2. Stores the three secrets with `firebase functions:secrets:set` (through a temp file, never on the command line).
3. Deploys the functions (`api` and `housekeeping` read the secrets).
4. Updates `payment_gateways`: **enables** Stripe (*Card (Stripe)*), Razorpay (*Razorpay (UPI / Cards / Netbanking)*) and PayPal, **disables** Sandbox and Bank Transfer, and sets **Mode** to *live* when it sees live keys (`sk_live_`, `rzp_live_`, `PAYPAL_ENV=live`).
5. Rebuilds and deploys the website (`hosting:web`).

Re-run it whenever the keys change, for example to go live. If you want Bank Transfer as well, switch it back on in the table afterwards.

:::note Mode column
For Stripe and Razorpay the key itself decides test or live. For PayPal, `PAYPAL_ENV` decides (`live` → `api-m.paypal.com`, otherwise `api-m.sandbox.paypal.com`). The **Mode** column is informational for these three; the script keeps it in sync.
:::

### Test payments

Test on your website → **Dashboard → Subscriptions** → choose a plan:

| Gateway | Test details |
|---|---|
| Stripe | Card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP |
| Razorpay | Card `4111 1111 1111 1111` (or UPI `success@razorpay`), then click **Success** on the test bank page |
| PayPal | Log in with a sandbox *personal* account (developer.paypal.com → Testing tools → Sandbox accounts) |

The plan should become active and the transaction should show **Succeed** in [Payment Transactions](doc:admin/transactions).

### Going live

1. Put live keys (`sk_live_…`, `rzp_live_…`, PayPal live client id/secret and `PAYPAL_ENV=live`) in `secret/prod.env`.
2. Re-run the script.
3. For Razorpay, enable international payments in its dashboard if buyers pay in a currency other than INR.

Gateways charge in the transaction's currency (the package or plan currency). Make sure your gateway account supports it.

## Sandbox (Test)

The built-in test gateway. Checkout returns a reference `sbx_…` and the website immediately confirms the payment, so the purchase is activated with no card. Use it on staging or for demos.

The webhook `POST /webhooks/payments/sandbox` with `{ "transaction_id": 123, "status": "completed" }` (or `failed`) also settles a sandbox transaction. It handles only the sandbox gateway.

:::danger Disable Sandbox in production
While **Sandbox (Test)** is enabled, anyone can get a paid package for free. The setup script disables it; check it stays off.
:::

## Bank Transfer

A manual gateway (`is_manual: true`). Click **Configure** and enter JSON like:

```json title="Bank Transfer configuration"
{
  "instructions": "Transfer the amount to our account and quote your reference.",
  "bank_details": "Your Company Ltd · Bank name · Account 000000000 · IFSC/SWIFT XXXX0000"
}
```

The checkout API returns `instructions` (with `(Ref: bt_…)` added) and `bank_details`. Without `instructions` the default text is *"Transfer the amount to the marketplace bank account and quote your reference."* The buyer cannot confirm the payment themselves (*"This payment must be confirmed by an administrator."*). You approve or reject it in [Bank Transfer](doc:admin/transactions#bank-transfer).

:::note
The **Configure** dialog must contain valid JSON, otherwise you see *"Configuration must be valid JSON."* For online gateways the hint reads `{ "key_id": "...", "key_secret": "..." }`, but Stripe, Razorpay and PayPal take their keys from Secret Manager as described above.
:::

**Next:** [AdMob, AdSense & Video Ads →](doc:admin/ad-networks)
