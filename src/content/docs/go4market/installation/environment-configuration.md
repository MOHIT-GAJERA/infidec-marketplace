---
title: Secrets & functions/.env
description: Configure Cloud Functions with a non-secret functions/.env file and eight Secret Manager secrets for payments, SMTP e-mail and SMS.
---

Cloud Functions read their configuration from two places:

| Where | What | Who can see it |
|---|---|---|
| `functions/.env` | **Non-secret** values: public payment keys, currencies, SMTP host/user, site URLs, SMS provider settings, Gemini key | Deployed with the functions; git-ignored |
| **Secret Manager** | **Secrets**: payment secret keys, SMTP password, SMS API keys | Only the functions that bind them |

:::danger Never put secrets in the apps, the panels or Firestore
The Admin panel's Settings pages hold **public** keys only (Razorpay Key ID, Stripe publishable key, PayPal client ID). Secret keys live only in Secret Manager. Never commit `functions/.env`, service-account JSON files or keystores.
:::

## 1. Create `functions/.env`

`functions/.env` is git-ignored and not shipped, so create it. Every key is optional; leave out what you do not use.

```bash title="functions/.env"
# Payments (public / non-secret parts)
RAZORPAY_KEY_ID=rzp_test_<your-key-id>
RAZORPAY_CURRENCY=INR
STRIPE_PUBLISHABLE_KEY=pk_test_<your-publishable-key>
STRIPE_CURRENCY=usd
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_ENV=sandbox            # sandbox | live
PAYPAL_CURRENCY=USD

# SMTP (the password is a secret, see below)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587                 # 465 = SSL, 587 = STARTTLS
MAIL_USERNAME=orders@yourmarket.com
MAIL_FROM_ADDRESS=orders@yourmarket.com

# Sites (payment return URLs, push and e-mail links)
WEBSITE_URL=https://<your-project-id>.web.app
ADMIN_URL=https://<your-project-id>-admin.web.app
SELLER_URL=https://<your-project-id>-seller.web.app
DELIVERY_URL=https://<your-project-id>-delivery.web.app
LOCAL_TZ=Asia/Kolkata

# Optional: Google Gemini for AI product descriptions
GEMINI_API_KEY=<your-gemini-api-key>

# Optional: SMS gateway, see "SMS Gateway"
SMS_PROVIDER=                 # twilio | msg91 | fast2sms | none (empty = use the panel setting)
SMS_DEFAULT_COUNTRY_CODE=91
TWILIO_ACCOUNT_SID=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_FROM=
SMS_SENDER_ID=
MSG91_TEMPLATE_ID=
FAST2SMS_ROUTE=q
FAST2SMS_TEMPLATE_ID=

# Optional: weekly backup bucket (default <project-id>.firebasestorage.app)
# BACKUP_BUCKET=
```

The defaults that apply when a key is missing are in `functions/src/lib/config.ts`.

:::warning Keep the public keys in step with the panel
`placeOrder` takes the Razorpay key from `RAZORPAY_KEY_ID`, while the apps read `settings/payments` (Admin → Settings → Payment gateways). Use the **same** Key ID, publishable key and client ID in both places, and switch both from test to live together.
:::

## 2. Create the secrets

Go4Market binds these eight secrets (defined in `functions/src/lib/config.ts`). **Every secret must exist before the first deploy**, even if you do not use that service. For unused services, store the placeholder value `unset`; the code treats `unset` as "not configured".

| Secret | Used for | Bound by |
|---|---|---|
| `RAZORPAY_KEY_SECRET` | Razorpay order creation, signature check, refunds | `placeOrder`, `confirmPayment`, `walletTopup`, `confirmWalletTopup`, `paymentWebhook`, `processReturn` |
| `STRIPE_SECRET_KEY` | Stripe Checkout Sessions and refunds | same as above |
| `PAYPAL_CLIENT_SECRET` | PayPal Orders v2 capture and refunds | same as above |
| `MAIL_PASSWORD` | SMTP password (Gmail **app password**) | `onUserCreated`, `completeProfile`, `onOrderWritten`, `onMailCreated`, `processWithdrawal` |
| `TWILIO_API_KEY_SID` | Twilio API key SID (`SK…`) | `onSmsQueued`, `getSystemStatus` |
| `TWILIO_API_KEY_SECRET` | Twilio API key secret | `onSmsQueued`, `getSystemStatus` |
| `SMS_AUTH_TOKEN` | Twilio account auth token (fallback when no API key) | `onSmsQueued`, `getSystemStatus` |
| `SMS_API_KEY` | MSG91 authkey or Fast2SMS API key | `onSmsQueued`, `getSystemStatus` |

Set each one from the repository root. The CLI prompts for the value:

```bash
firebase functions:secrets:set RAZORPAY_KEY_SECRET --project <your-project-id>
firebase functions:secrets:set STRIPE_SECRET_KEY --project <your-project-id>
firebase functions:secrets:set PAYPAL_CLIENT_SECRET --project <your-project-id>
firebase functions:secrets:set MAIL_PASSWORD --project <your-project-id>
firebase functions:secrets:set TWILIO_API_KEY_SID --project <your-project-id>
firebase functions:secrets:set TWILIO_API_KEY_SECRET --project <your-project-id>
firebase functions:secrets:set SMS_AUTH_TOKEN --project <your-project-id>
firebase functions:secrets:set SMS_API_KEY --project <your-project-id>
```

To store a placeholder without typing it, put `unset` in a file and pass it:

```bash
echo unset > unset.txt
firebase functions:secrets:set SMS_API_KEY --data-file unset.txt --project <your-project-id>
```

:::note Changing a secret later
Functions read a secret version when they start. After changing a value, redeploy the functions that bind it, for example `firebase deploy --only functions:onSmsQueued,functions:getSystemStatus`.
:::

## 3. Where each value comes from

| Service | Where to find it |
|---|---|
| Razorpay | Dashboard → Account & Settings → **API Keys** (Key ID + Key Secret). Test keys start with `rzp_test_` |
| Stripe | Dashboard → Developers → **API keys** (publishable `pk_…`, secret `sk_…`) |
| PayPal | developer.paypal.com → Apps & Credentials → your REST app (Client ID + Secret) |
| Gmail SMTP | Google Account → Security → 2-Step Verification → **App passwords** |
| Twilio | Console → Account → API keys & tokens; Messaging → Services (`MG…`) |
| MSG91 / Fast2SMS | Dashboard → API / Dev API |
| Gemini | [aistudio.google.com](https://aistudio.google.com) → Get API key |

Check what is configured at any time in Admin → **System health**, which calls `getSystemStatus` and shows each integration as ready or missing.

**Next:** [Deploy Functions, Rules & Indexes →](doc:installation/backend-deploy)
