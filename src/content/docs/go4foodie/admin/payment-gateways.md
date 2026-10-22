---
title: Payment Gateways
description: Set up Razorpay, Stripe and PayPal for online orders and gift card purchases. Covers which keys are secrets, currencies, test mode, how each payment is verified, and what happens with no gateway.
---

Go4Foodie takes online payments for **website orders** (take-away and table QR), **mobile app orders** and **gift card / coupon purchases** through **Razorpay**, **Stripe** and **PayPal**. You can enable one, two or all three.

Gateways are configured on the **backend**, not in a panel screen. The public key goes in `firebase/functions/.env.<project-id>`, and the secret key goes in **Secret Manager**. After each change, redeploy the function.

## Keys per provider

| Provider | Plain config (`.env.<project-id>`) | Secret (`functions:secrets:set`) | Configured when |
|---|---|---|---|
| **Razorpay** | `RAZORPAY_KEY_ID`, `RAZORPAY_CURRENCY` (default `INR`) | `RAZORPAY_KEY_SECRET` | Key ID **and** Key Secret are set |
| **Stripe** | `STRIPE_PUBLISHABLE_KEY`, `STRIPE_CURRENCY` (default `usd`) | `STRIPE_SECRET_KEY` | Publishable key **and** Secret key are set |
| **PayPal** | `PAYPAL_CLIENT_ID`, `PAYPAL_ENV` (`sandbox` default, or `live`), `PAYPAL_CURRENCY` (default `USD`) | `PAYPAL_CLIENT_SECRET` | Client ID **and** Client Secret are set |

To switch a provider **off**, empty its public key in `.env` and redeploy. The secret can stay.

```bash
cd firebase
firebase functions:secrets:set RAZORPAY_KEY_SECRET
# edit functions/.env.yourrestaurant-1a2b3 → RAZORPAY_KEY_ID=rzp_test_…
FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions
```

Check which gateways are live: `https://your-api-host/api/payment` returns, for example, `{"razorpay":true,"stripe":false,"paypal":false}`.

:::warning Keep the secret keys secret
Never put a Key Secret, Secret key or Client Secret in `.env`, in app code or in a screenshot. If one leaks, generate a new one in the provider's dashboard, then run `functions:secrets:set` and redeploy.
:::

## How a payment works

1. The website or the app asks `GET /api/payment` which gateways are configured.
2. If **more than one** is configured, the website shows a **provider chooser**. With only one, it opens that one directly.
3. `POST /api/payment` (provider, amount, description) creates the payment on the provider's side with the **secret key**, and returns only the public data (key ID / publishable key / client ID and the order or intent ID).
4. The customer pays in the provider's own checkout.
5. The order or gift card request is sent with the `payment` result. The server **verifies it with the provider** before saving anything. A missing payment returns **402 Payment required**, and a payment that fails the check returns **402 Payment verification failed**.

![Payment chooser](/docs/go4foodie/images/web-payment-chooser.jpg "Website: the chooser appears when more than one gateway is configured")
![Stripe payment](/docs/go4foodie/images/web-payment-stripe.jpg "Website: Stripe Payment Element in the payment dialog")

| Provider | Checkout | What the server verifies |
|---|---|---|
| **Razorpay** | Razorpay Checkout (website and app) | The checkout signature: `HMAC_SHA256(order_id + "\|" + payment_id, Key Secret)`, compared in constant time |
| **Stripe** | Stripe Payment Element (website and app) | Fetches the PaymentIntent from Stripe with the secret key and requires status `succeeded` |
| **PayPal** | PayPal Buttons (website only). After approval the site calls `POST /api/payment/capture` | Fetches the PayPal order and requires status `COMPLETED` |

The verified reference (Razorpay payment ID, Stripe PaymentIntent ID or PayPal order ID) and the provider are stored on the order or gift card. They show in [Transactions](doc:admin/transactions).

:::note No webhooks
Go4Foodie doesn't use gateway webhooks. Payments are confirmed **while the customer is still on the page**, so you have nothing to register in the gateway dashboards. If a customer pays and then closes the page before the order is sent, the money is captured but there's no order. Find the payment in the gateway dashboard and refund it there. Go4Foodie doesn't issue refunds itself.
:::

:::tip Reconcile in the dashboard
The server checks that a payment is genuine and completed. Compare amounts with your gateway's settlement report every now and then, as you would with any online shop.
:::

## Mobile app

The Customer App opens **Razorpay** or **Stripe** in an in-app WebView with the same keys and verification. **PayPal isn't offered in the app**, because its pop-up flow doesn't run in a WebView. For orders, the app also offers **Pay at restaurant**. That option skips the gateway even when one is configured, and the order shows as *Pay at restaurant* until it's settled at the counter. Gift cards always need an online payment. See [Mobile App → Payments](doc:app/payments).

![App payment](/docs/go4foodie/images/app-customer-payment.webp "Customer App: Pay at restaurant, Razorpay or Card (Stripe)")

## Currencies

Each provider charges in its own currency setting (`RAZORPAY_CURRENCY`, `STRIPE_CURRENCY`, `PAYPAL_CURRENCY`). Amounts are sent to Razorpay and Stripe in the smallest unit (× 100), so use a currency with two decimal places. The admin panel and the e-mails show amounts with a `$` sign whatever the currency. See [Settings](doc:admin/settings).

## Test mode

| Provider | Test keys | Test payment |
|---|---|---|
| Razorpay | Dashboard in **Test Mode** → API Keys → `rzp_test_…` | UPI `success@razorpay` (or `failure@razorpay`), card `4111 1111 1111 1111` |
| Stripe | Dashboard in **Test mode** → Developers → API keys → `pk_test_…` / `sk_test_…` | Card `4242 4242 4242 4242`, any future date, any CVC |
| PayPal | [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → **Sandbox** app, `PAYPAL_ENV=sandbox` | Sign in with a sandbox *personal* account |

## Set up Razorpay (India)

:::steps
### Create the account
Sign up at [razorpay.com](https://razorpay.com). Test mode works straight away. Live payments need KYC.

### Get the keys
Razorpay Dashboard → **Account & Settings → API Keys** → *Generate Key*. Copy the **Key ID** and the **Key Secret** (it's shown only once).

### Save them in Go4Foodie
`RAZORPAY_KEY_ID=rzp_test_…` and `RAZORPAY_CURRENCY=INR` in `.env.<project-id>`, then `firebase functions:secrets:set RAZORPAY_KEY_SECRET`, then redeploy.

### Test
Place a website order with Razorpay and pay with `success@razorpay`. The order appears in **Orders**, and the payment shows in Razorpay Dashboard → Payments (Test mode).

### Go live
Replace both keys with `rzp_live_…` keys, redeploy, and place one small real payment.
:::

## Set up Stripe

Stripe Dashboard → **Developers → API keys**: put `STRIPE_PUBLISHABLE_KEY` (`pk_…`) in `.env`, run `firebase functions:secrets:set STRIPE_SECRET_KEY` (`sk_…`) and set `STRIPE_CURRENCY` (for example `usd`, `eur`, `gbp`). PaymentIntents are created with *automatic payment methods*, so the methods you enable under **Settings → Payment methods** appear in the Payment Element.

## Set up PayPal

PayPal Developer → **Apps & Credentials** → create a REST app. Put `PAYPAL_CLIENT_ID` in `.env` and set `PAYPAL_CLIENT_SECRET` as a secret. Keep `PAYPAL_ENV=sandbox` while testing, then use the **Live** app's credentials and `PAYPAL_ENV=live`. Orders are created with intent `CAPTURE`.

## No gateway = demo mode

:::danger Without a gateway, orders are free
If **no** gateway is configured, the backend lets orders and gift card purchases through **without any payment**. That's the fallback for development and demos. On a live restaurant, the website then takes take-away orders and issues gift cards that nobody has paid for. Configure at least one gateway before you share the website, or accept that every online order is paid at the restaurant.
:::

**Next:** [SMTP / Email Settings →](doc:admin/smtp-settings)
