---
title: Payments
description: How the website takes payments with Razorpay, Stripe and PayPal. Client SDKs loaded on demand, the provider chooser, and server-side verification.
---

The website stores **no gateway keys**. The gateways are configured on the backend ([Payment Gateways](doc:admin/payment-gateways)). The browser loads each gateway's official JavaScript SDK only when the guest pays. All payment code is in `lib/payment.ts` (`pay()`).

![Payment chooser](/docs/go4foodie/images/web-payment-chooser.jpg "Choose payment method")
![Stripe](/docs/go4foodie/images/web-payment-stripe.jpg "Pay by card (Stripe)")

## Flow

:::steps
### Which gateways?
`GET /api/payment` → `{razorpay, stripe, paypal}` (booleans). If the request fails, all three count as `false`.

### Choose
- **None configured** → `pay()` returns nothing and the order or gift card is sent **without payment** (demo mode).
- **One configured** → it opens directly.
- **More than one** → the **Choose payment method** modal (*"Select how you’d like to pay securely."*) in the order Razorpay, Stripe, PayPal. Closing it gives *"Payment cancelled."*

### Pay
The site calls `POST /api/payment {provider, amount, description}` (for example *"Take Away order · $42.00"*, *"Table 5 order · $42.00"*, *"Gift card · $100"*). The backend creates the order or intent with your secret key and returns only public values.

### Submit
The result is attached as `payment` to `POST /api/orders` or `POST /api/gift-cards`. The backend **verifies it again** before it saves anything.
:::

## Gateways

| Gateway | Browser SDK | What the guest sees | Result sent to the backend | Server check |
|---|---|---|---|---|
| **Razorpay** | `https://checkout.razorpay.com/v1/checkout.js` | Razorpay Checkout (cards, UPI, netbanking, wallets) with name, email and phone pre-filled | `{provider:'razorpay', orderId, paymentId, signature}` | HMAC-SHA256 of `orderId\|paymentId` with `RAZORPAY_KEY_SECRET` |
| **Stripe** | `https://js.stripe.com/v3/` | **Pay by card** modal with the Payment Element (*night* theme), `confirmPayment` with `redirect: 'if_required'` | `{provider:'stripe', paymentIntentId}` | PaymentIntent fetched from Stripe, status must be `succeeded` |
| **PayPal** | `https://www.paypal.com/sdk/js?client-id=…&currency=…` | **Pay with PayPal** modal with PayPal Buttons. On approval the site calls `POST /api/payment/capture` | `{provider:'paypal', orderId}` | PayPal order fetched, status must be `COMPLETED` |

When verification fails, the order is not saved and the red banner shows *Payment required*, *Payment verification failed* or *Unknown payment provider* (HTTP 402). Cancelling a gateway window shows *Payment cancelled.*

The payment reference is stored on the order or gift card (`razorpayPaymentId`, which holds the reference for every provider: the Razorpay payment ID, the Stripe PaymentIntent ID or the PayPal order ID), together with `paymentProvider`.

## Currencies

| Gateway | Variable (backend) | Default |
|---|---|---|
| Razorpay | `RAZORPAY_CURRENCY` | `INR` |
| Stripe | `STRIPE_CURRENCY` | `usd` |
| PayPal | `PAYPAL_CURRENCY` (+ `PAYPAL_ENV=live` for production) | `USD` |

The site always **displays** amounts with `$`. Set the gateway currency to the one you show, or change the display ([Configuration](doc:web/configuration#currency-symbol)).

## Domains

- **Razorpay / Stripe**: add your website domain (and the App Hosting `*.hosted.app` domain while testing) in the gateway dashboard if it restricts domains.
- **Stripe Payment Element** and **PayPal Buttons** run on your own page, so the page must use HTTPS. App Hosting provides HTTPS automatically.

## Test

| Gateway | Test details (sandbox / test keys) |
|---|---|
| Razorpay | Card `4111 1111 1111 1111`, any future date, any CVV, or UPI `success@razorpay` |
| Stripe | Card `4242 4242 4242 4242`, any future date, any CVC |
| PayPal | A sandbox buyer account from developer.paypal.com (`PAYPAL_ENV` not `live`) |

After a test payment the order appears in Admin → [Orders](doc:admin/orders) and in [Transactions](doc:admin/transactions) with the provider.

**Next:** [Deployment Guide →](doc:web/deployment)
