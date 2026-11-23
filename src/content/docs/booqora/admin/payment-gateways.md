---
title: Payment Gateways
description: Connect Razorpay, Stripe and PayPal through Cloud Functions secrets, read the provider status in Settings → Payment providers, switch between test and live mode and set up manual payment methods.
---

Booqora takes online payments through three providers: **Razorpay**, **Stripe** and **PayPal**. The secret keys never reach the browser. They are stored in **Google Secret Manager** and read only by the Cloud Functions in `booqora_platform/functions/index.js`. The settings page shows what the server reports and lets you switch each provider on or off for customers.

## Where things live

| What | Where | Who sets it |
|---|---|---|
| Razorpay key ID and secret | Secrets `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | You, with the Firebase CLI |
| Stripe secret key | Secret `STRIPE_SECRET_KEY` | You |
| PayPal client ID and secret | Secrets `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` | You |
| Razorpay currency | `RAZORPAY_CURRENCY` in `functions/.env` (default `INR`) | You |
| PayPal environment and currency | `PAYPAL_ENV` (`sandbox` or `live`), `PAYPAL_CURRENCY` (default `USD`) in `functions/.env` | You |
| On/off per provider | `settings.payments.<provider>.enabled` in the workspace | Admin, in the panel |
| Manual methods | `settings.payments` (`cashEnabled`, `bankEnabled`, `upiEnabled` and instructions) | Admin, in the panel |

`functions/.env` also contains a `STRIPE_CURRENCY` line, but the code does not read it: Stripe always charges in the store currency.

## Set the secrets

:::steps
### Create the provider accounts
Get API keys from the Razorpay, Stripe and PayPal dashboards. Start with **test** keys.

### Store the secrets
Run one command per secret from `booqora_platform/` and paste the value when prompted:

```bash title="Terminal"
firebase functions:secrets:set RAZORPAY_KEY_ID --project <your-project-id>
firebase functions:secrets:set RAZORPAY_KEY_SECRET --project <your-project-id>
firebase functions:secrets:set STRIPE_SECRET_KEY --project <your-project-id>
firebase functions:secrets:set PAYPAL_CLIENT_ID --project <your-project-id>
firebase functions:secrets:set PAYPAL_CLIENT_SECRET --project <your-project-id>
```

All five are declared with `defineSecret`, so each must exist before the functions deploy, even for a provider you do not use. For a provider you do not use, set a placeholder value and then switch the provider off with **Offer to customers** (a non-empty placeholder counts as "configured").

### Edit the non-secret settings
Set `RAZORPAY_CURRENCY`, `PAYPAL_ENV` and `PAYPAL_CURRENCY` in `functions/.env`.

### Allow your domain for redirects
Stripe and PayPal send the customer back to `/pay/return`. The function only accepts return URLs that start with an entry in `ALLOWED_RETURN` in `functions/index.js`. The package lists the author's `booqora-platform.web.app`, `booqora-platform.firebaseapp.com` and `http://localhost`. Replace them with your own Hosting domains and any custom domain.

### Deploy the functions
`firebase deploy --only functions --project <your-project-id>`. See [Cloud Functions](doc:api/cloud-functions).
:::

## Test mode and live mode

The mode is worked out from the keys. Nothing in the panel changes it.

| Provider | Live when | Otherwise |
|---|---|---|
| Razorpay | Key ID starts with `rzp_live` | Test |
| Stripe | Secret key starts with `sk_live` | Test |
| PayPal | `PAYPAL_ENV=live` (uses `api-m.paypal.com`) | Sandbox (`api-m.sandbox.paypal.com`) |

Payments made in test mode are recorded with the note "(test mode)", and the Online Store shows "Test mode — no real money will be charged."

## Settings → Payment providers

**Settings → Payment providers** (`/settings/payments`) calls the `paymentConfig` function and shows one card per provider.

![Payment providers](/docs/booqora/images/platform-settings-payments.webp "Provider cards with live status, mode, currency and the Offer to customers switch")

| Status | Meaning |
|---|---|
| Not configured | The server has no keys for this provider |
| Turned off | Keys exist but **Offer to customers** is off |
| Connected · Test mode / Connected · Live | Ready to take payments |
| Needs attention | Configured and on, but the currency does not match (the reason is shown) |

A configured card also shows **Mode**, **Currency** and "Keys: Stored securely on server". The **Offer to customers** switch saves immediately and only works once the provider is configured.

### Currency rules

A provider is available only when its currency matches the store currency from [Settings → Pricing](doc:admin/pricing):

- **Razorpay** charges in `RAZORPAY_CURRENCY` (INR by default), so an INR store works out of the box.
- **Stripe** charges in the store currency, whatever it is.
- **PayPal** charges in `PAYPAL_CURRENCY`, which is **USD** by default. In an INR store PayPal shows *Needs attention* with "PayPal is set up for USD; this store uses INR." and is not offered.

## Manual payments

Three methods you record yourself. Switch one on to show an instructions field. Instructions are meant for invoices and order confirmations.

| Method | Instructions field |
|---|---|
| Cash | Instructions, e.g. "Please pay the full amount in cash at pickup." |
| Bank transfer | Bank details and instructions (account name, number, IFSC / IBAN, reference) |
| UPI | UPI ID and instructions |

Save the section with the **Save** button. Payments you receive in person are recorded on the order ([Orders](doc:admin/orders)).

## Where payments are used

- **Online Store checkout**: the payment card after a booking request, driven by the checkout payment mode ([Online Store Payments](doc:store/payments)).
- **Orders**: staff can take the balance or a custom amount online and send a payment link by email.

The full sequence (`createPayment` → provider → `verifyPayment`) is explained in [Payment Flow](doc:api/payment-flow).

:::note Apps catalogue
The Razorpay, Stripe and PayPal entries in **Apps** only store a public key ID for reference. Payments always use the server secrets above.
:::

**Next:** [Email & SMTP →](doc:admin/email-smtp)
