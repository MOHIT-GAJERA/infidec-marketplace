---
title: Secrets & Environment
description: Configure Booqora's Cloud Functions with eight Secret Manager secrets for Razorpay, Stripe, PayPal and SMTP, plus the non-secret functions/.env file.
---

Booqora's Cloud Functions read their configuration from two places:

| Where | What | Who can see it |
|---|---|---|
| `booqora_platform/functions/.env` | **Non-secret** values: currencies, PayPal mode, SMTP host and port | Deployed with the functions; included in the package |
| **Secret Manager** | **Secrets**: payment keys and SMTP credentials | Only the functions that bind them |

:::danger Never put secrets in the apps or Firestore
The Rental Platform and the Mobile App hold **no** payment or SMTP keys. Razorpay's public Key ID is handed to the browser by `paymentConfig` / `createPayment` only when a checkout opens. Never commit service-account JSON files, keystores or a file with real secret values.
:::

## 1. The eight secrets

These names are declared with `defineSecret()` at the top of `functions/index.js`. **All eight must exist** in Secret Manager before you deploy, because each function binds a group of them.

| Secret | Used for | Bound by |
|---|---|---|
| `RAZORPAY_KEY_ID` | Razorpay Key ID (`rzp_test_…` or `rzp_live_…`); the prefix decides test or live mode | `paymentConfig`, `createPayment`, `verifyPayment` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret; also verifies the payment signature | same |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` or `sk_live_…`) | same |
| `PAYPAL_CLIENT_ID` | PayPal REST app client ID | same |
| `PAYPAL_CLIENT_SECRET` | PayPal REST app secret | same |
| `MAIL_USERNAME` | SMTP login | `verifyPayment`, `sendEmail`, `onOnlineOrder` |
| `MAIL_PASSWORD` | SMTP password (for Gmail, an **app password**) | same |
| `MAIL_FROM_ADDRESS` | The address e-mails are sent from | same |

## 2. Create the secrets

Run each command from `booqora_platform/`. The CLI prompts for the value and enables the Secret Manager API on first use.

```bash title="Terminal"
cd booqora_platform
firebase functions:secrets:set RAZORPAY_KEY_ID
firebase functions:secrets:set RAZORPAY_KEY_SECRET
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set PAYPAL_CLIENT_ID
firebase functions:secrets:set PAYPAL_CLIENT_SECRET
firebase functions:secrets:set MAIL_USERNAME
firebase functions:secrets:set MAIL_PASSWORD
firebase functions:secrets:set MAIL_FROM_ADDRESS
```

:::tip A provider you do not use
Still create its secrets, with any placeholder such as `unset`, so the deploy succeeds. Then switch that provider **off** in *Settings → Payment providers*. A provider is offered only when its keys are set, it is enabled and its currency matches the store, so a switched-off placeholder is never shown to customers.
:::

### Keeping the values in one local file

It is convenient to keep every value in one **git-ignored** file and set the secrets from it. The package's `.gitignore` already ignores a `secret/` folder at the repository root:

```bash title="secret/.env (never commit this file)"
# Payments
RAZORPAY_KEY_ID=rzp_test_<your-key-id>
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>
STRIPE_SECRET_KEY=sk_test_<your-stripe-secret-key>
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>

# SMTP
MAIL_USERNAME=bookings@yourrentals.com
MAIL_PASSWORD=<your-smtp-app-password>
MAIL_FROM_ADDRESS=bookings@yourrentals.com
```

Set one secret from a value without typing it into the prompt:

```bash title="Terminal"
printf '%s' "rzp_test_<your-key-id>" | firebase functions:secrets:set RAZORPAY_KEY_ID --data-file=-
```

After changing a secret, **redeploy the functions** so they pick up the new version.

## 3. Check `functions/.env`

`functions/.env` holds settings that are not secret. It ships with the package; adjust it to your business:

```bash title="booqora_platform/functions/.env"
RAZORPAY_CURRENCY=INR        # currency your Razorpay account charges in
STRIPE_CURRENCY=INR          # informational; Stripe Checkout uses the store's currency
PAYPAL_ENV=sandbox           # sandbox | live
PAYPAL_CURRENCY=USD          # PayPal is offered only to stores in this currency
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587                # 465 = SSL, 587 = STARTTLS
```

How the functions use them:

| Variable | Default | Effect |
|---|---|---|
| `RAZORPAY_CURRENCY` | `INR` | Razorpay is unavailable for a store whose currency differs, with the reason shown in Settings |
| `PAYPAL_ENV` | `sandbox` | `live` switches to `api-m.paypal.com` and live mode |
| `PAYPAL_CURRENCY` | `USD` | PayPal is unavailable for stores in another currency (so an INR store cannot use PayPal by default) |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server |
| `MAIL_PORT` | `587` | Port 465 turns on implicit TLS (`secure: true`) |

The **store currency** itself is chosen when the workspace is created and lives in *Settings → Pricing*, not in this file.

## 4. Local testing with the emulator (optional)

If you run the Functions emulator, put local secret values in `functions/.secret.local` (same `NAME=value` format). `firebase.json` excludes this file from deploys and `.gitignore` excludes it from git. See [Localhost Setup](doc:installation/localhost-setup).

## 5. Where providers are switched on and off

The keys only make a provider *possible*. Each workspace then turns providers on or off and chooses what customers pay at checkout (nothing, full amount, a down payment or the deposit) in the platform. See [Payment Gateways](doc:admin/payment-gateways) and [Checkout & Fulfilment](doc:store/checkout).

**Next:** [Deploy Functions, Rules & Indexes →](doc:installation/backend-deploy)
