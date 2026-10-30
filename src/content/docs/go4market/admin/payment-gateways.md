---
title: Payment Gateways
description: Enable Razorpay, Stripe Checkout, PayPal, Wallet and Cash on Delivery, where each key goes, how the payment hand-off works, and how to go live.
---

Go4Market supports **Razorpay**, **Stripe Checkout**, **PayPal**, the **Wallet** and **Cash on Delivery**. Payments are created and verified **only in Cloud Functions**; the clients never see a secret key.

## Where each key goes

| Gateway | Public value: Admin → Settings → Payment gateways **and** `functions/.env` | Secret: Secret Manager |
|---|---|---|
| Razorpay | Key ID (`rzp_live_…`) · `RAZORPAY_KEY_ID`, `RAZORPAY_CURRENCY` | `RAZORPAY_KEY_SECRET` |
| Stripe | Publishable key (`pk_live_…`) · `STRIPE_PUBLISHABLE_KEY`, `STRIPE_CURRENCY` | `STRIPE_SECRET_KEY` |
| PayPal | Client ID + environment (`sandbox` / `live`) · `PAYPAL_CLIENT_ID`, `PAYPAL_ENV`, `PAYPAL_CURRENCY` | `PAYPAL_CLIENT_SECRET` |
| COD | *Enable cash on delivery* toggle; limit in Platform settings (`codMax`) | – |

The panel page saves `settings/payments`, which the website and apps read to decide which methods to show. Secrets are set with `firebase functions:secrets:set` (see [Secrets & functions/.env](doc:installation/environment-configuration#2-create-the-secrets)).

![Checkout payment methods](/docs/go4market/images/app-customer-checkout-payment.webp "Checkout in the Customer app: UPI/cards (Razorpay), Stripe, PayPal or Cash on delivery")

## How a payment works

1. The client calls `placeOrder` with `paymentMethod`. The function re-prices the cart, applies the coupon and wallet, reserves stock and creates the order with status `pending`. It returns a `payment` payload.
2. The client completes the payment:

| Provider | Payload | Client action |
|---|---|---|
| `razorpay` | `razorpayOrderId`, `keyId`, amount in paise, prefill | App: native `razorpay_flutter` sheet. Website: Razorpay Checkout.js |
| `stripe` | `checkoutUrl`, `sessionId` | Opens the hosted **Stripe Checkout** page (same tab on the web, in-app browser in the app) |
| `paypal` | `approveUrl`, `paypalOrderId` | Opens PayPal approval |
| `cod`, `wallet` | – | The order is `placed` immediately |

3. The client calls `confirmPayment`. The function verifies the Razorpay signature, retrieves the Stripe session, or captures the PayPal order. Then the order moves to `placed` with `paymentStatus: paid`.
4. Stripe and PayPal return to `WEBSITE_URL/payment/return?provider=…&orderId=…`. The app calls `confirmPayment` when the browser closes.
5. As a safety net, `paymentWebhook` receives provider events and marks orders paid. It **re-verifies every event against the provider's API**.

Wallet top-ups use the same flow with `walletTopup` / `confirmWalletTopup`.

:::note Currencies
Razorpay charges in `RAZORPAY_CURRENCY` (default INR). Stripe and PayPal charge in `STRIPE_CURRENCY` / `PAYPAL_CURRENCY` (default USD); INR totals are converted with `settings/platform.fx.usd`. Keep that rate current, or configure Stripe and PayPal in INR if your accounts support it.
:::

## Webhook

Register `https://asia-south1-<your-project-id>.cloudfunctions.net/paymentWebhook` in each dashboard:

| Provider | Events |
|---|---|
| Razorpay | `payment.captured`, `order.paid` |
| Stripe | `checkout.session.completed`, `checkout.session.async_payment_succeeded` |
| PayPal | `CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED` |

## Refunds

- **Cancelled orders**: the wallet part and any captured online payment are refunded to the customer's **wallet**.
- **Returns**: the admin chooses **wallet** or **source**. *Source* refunds the Razorpay, Stripe or PayPal payment through the gateway; the wallet part always goes back to the wallet. See [Returns & Refunds](doc:admin/returns).
- **Unpaid** online orders are cancelled automatically after 30 minutes by `cleanupPendingOrders`.

## Going live checklist

- [x] Live keys in **both** the panel and `functions/.env`, live secrets in Secret Manager, functions redeployed
- [x] PayPal environment set to `live`
- [x] Webhook URL registered in every dashboard
- [x] One real small payment per method, then refunded through a return

:::warning Test and live keys must match
A test Key ID with a live secret, or a panel key that differs from `RAZORPAY_KEY_ID`, makes payments fail at the signature check. **System health** shows which gateways are configured.
:::

**Next:** [Email (SMTP) & Templates →](doc:admin/email-smtp)
