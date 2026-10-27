---
title: Plans, Featured Ads & Checkout
description: How users buy subscription packages and featured-ad boosts on the website, the hosted Stripe, Razorpay and PayPal flow, result-page verification, bank transfer and the sandbox gateway.
---

All paid features are sold on the website. The Mobile App has no in-app purchases and sends users to the website for plans and boosts.

| Product | Where the user starts | What it gives |
|---|---|---|
| **Subscription package** | **Dashboard → Subscriptions → Choose Plan** (footer **Subscription** link) | An ad quota (or unlimited) for a number of days, optionally limited to some categories |
| **Featured ad** | **Dashboard → My Ads → ★ Boost** on an approved ad | The ad gets **★ Featured** and is sorted first, for the plan's number of days |

Packages are set up in **Admin → Package Management → Subscription Packages** ([Subscription Packages](doc:admin/packages)), featured plans in **Featured Ad Plans** ([Featured Ad Plans](doc:admin/featured-plans)), gateways in **Settings → Payment Gateways** ([Payment Gateways](doc:admin/payment-gateways)).

![Checkout](/docs/classiadshub/images/web-checkout.jpg "Checkout — order summary and payment method")

## The checkout page

`/checkout` receives the order in the URL:

| Flow | URL |
|---|---|
| Subscription | `/checkout?type=subscription&package_id=<id>&title=<name>&price=<display>` |
| Featured ad | `/checkout?type=featured&ad_id=<id>&title=Feature: <ad title>` (optional `plan_id`) |

The page shows:

1. **Checkout** with a summary card: title and price.
2. For featured ads, **Feature plan**: one card per plan from `GET /featured-plans` — name, *N days featured*, price. The first is selected. None: *No feature plans available right now.*
3. **Payment method**: one card per active gateway from `GET /payment-gateways`, 💳 for online gateways and 🏦 for manual ones. The first is selected.
4. **Pay <price>** and a hint: *You'll be taken to a secure payment page to complete your purchase.* or, for manual gateways, *You'll get bank details after placing the order.*

## What happens on Pay

:::steps
### A pending transaction is created

- Subscription: `POST /subscriptions/checkout` with `{ package_id, gateway }`. Creates a `transactions` document (`type: subscription`, `status: pending`) and a `subscriptions` document (`status: pending`).
- Featured ad: `POST /ads/<id>/feature/checkout` with `{ plan_id, gateway }`. Only the ad owner can do this. Creates a `transactions` document (`type: featured_ad`).

The amount is the package `final_price` or the plan price, plus **Tax (%)** from **Settings → General**. All amounts are in minor units with the package or plan currency.

### The gateway flow starts

| Gateway code | Flow |
|---|---|
| `stripe` | Stripe Checkout Session. The API returns `checkout_url`; the browser goes to Stripe |
| `razorpay` | Razorpay Payment Link. Browser goes to the link |
| `paypal` | PayPal Orders v2 with `PAY_NOW`. Browser goes to the PayPal approval page |
| `sandbox` | No redirect. The website immediately calls `POST /payments/<id>/confirm` and the payment completes |
| `bank_transfer` (manual) | No redirect. The transaction stays `pending` with a reference `bt_XXXXXXXXXX`. The user sees *Awaiting confirmation* |
| Any other code | Fails with *<Name> live integration is not enabled yet.* (or *… is not configured.*) |

A free package (total 0) is activated at once without any gateway.

### The buyer returns to the result page

Stripe, Razorpay and PayPal send the buyer to `<frontend_url>/checkout/result?txn=<id>` (or `…&cancelled=1` when the buyer cancels). `frontend_url` is the `frontend_url` field of Firestore `settings/general` — set it to your domain ([Configuration](doc:web/configuration)).
:::

## Result page and server-side verification

`/checkout/result?txn=<id>` shows *Confirming your payment…* and calls `POST /payments/<id>/confirm` with `{ cancelled }`. The server never trusts the browser — it asks the gateway:

| Gateway | Check |
|---|---|
| Stripe | Checkout Session is paid, and `amount_total` and currency match the transaction |
| Razorpay | Payment Link `amount_paid` ≥ total and the currency matches |
| PayPal | An `APPROVED` order is captured by the server, then the capture must be `COMPLETED` with matching amount and currency |

| Gateway answer | Transaction | Page |
|---|---|---|
| Paid and matching | `completed`, product activated | ✅ **Payment successful** — *Your purchase is complete and active.* |
| Not paid, or cancelled return | `failed` | ❌ **Payment failed** — *Payment was cancelled.* or the server message. **Try again** → Subscriptions |
| Still processing | stays `pending` | ⏳ **Awaiting confirmation** — *Your payment is still being processed…* |

Buttons: **View transactions** and **Go to dashboard** (or **Try again**).

### What "completed" activates

`fulfil()` in `functions/src/routes/billing.ts`:

- **Subscription**: status `active`, `starts_at` now, `ends_at` = now + package days, `ad_limit` / `is_unlimited` from the package, `ads_used: 0`.
- **Featured ad**: `is_featured: true`, `featured_until` = now + plan days (added to the remaining time if the ad is already featured).
- An invoice `INV-YYYYMMDD-000042` is created and the user gets a *Payment successful* notification.

### Buyers who never come back

If the buyer pays but closes the tab before the result page, the hourly `housekeeping` scheduled function checks every pending Stripe / Razorpay / PayPal transaction from the last 2 days with the gateway and completes or fails it ([Scheduled Jobs](doc:api/scheduled-jobs)).

## Bank transfer

With **Bank Transfer** selected, the user is sent straight to ⏳ **Awaiting confirmation** — *Complete the bank transfer; an admin will confirm it shortly.* The transaction is `pending` with a `bt_…` reference.

An admin confirms it in **Admin → Package Management → Bank Transfer** ([Subscriptions & Transactions](doc:admin/transactions)), which runs the same activation as an online payment.

:::warning The website does not show bank details or a receipt upload yet
The API returns the bank instructions and the reference when the checkout starts, and it has a receipt endpoint (`POST /payments/<id>/receipt`, field `receipt`, stored in the private `receipts/` folder). The current website does not display the instructions or offer the upload. Tell buyers your bank details and how to quote the reference (for example on a CMS page), or add these two steps to `src/app/checkout/page.tsx`.
:::

## Sandbox (Test) gateway

**Sandbox (Test)** completes the payment without any real charge — the website calls `/payments/<id>/confirm` right after starting the checkout. Use it to test plans and boosts end to end.

:::danger Disable the sandbox in production
While the sandbox gateway is active, anyone can get plans and boosts for free. Turn it off in **Settings → Payment Gateways** before launch. `tools/payments/setup-payments.mjs` disables `sandbox` and `bank_transfer` when it enables the live gateways.
:::

## Setting up the live gateways

Secret keys are stored in Firebase Secret Manager (`STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET`) and public ids in `functions/.env` (`RAZORPAY_KEY_ID`, `PAYPAL_CLIENT_ID`, `PAYPAL_ENV`). The helper script stores them, deploys, enables the gateways and rebuilds the website. See [Payment Gateways](doc:admin/payment-gateways) and [Billing & Payments](doc:api/billing).

Paystack, PhonePe, Flutterwave, PayTabs and DPO appear in the gateway list but have no integration in the code. Keep them disabled.

**Next:** [Blog, Jobs & Pages →](doc:web/content)
