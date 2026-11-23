---
title: Payment Flow
description: How an online payment moves through Booqora, from paymentConfig and createPayment to the provider's checkout, verifyPayment and the /pay/return page, on the web and in the Mobile App.
---

Booqora takes online payments through **Razorpay**, **Stripe** and **PayPal**. The same four steps run whether a customer pays in the Online Store or staff collect a payment on an order. Secret keys stay in the Cloud Functions; the browser and the app only ever see the Razorpay Key ID and the provider's hosted checkout.

## The four steps

:::steps
### 1. paymentConfig
The client asks which providers this store can use, the store currency and the checkout mode. Providers that are not configured, switched off, or set up for another currency come back with `available: false` and a `reason`.

### 2. createPayment
The client sends the order ID, the provider and the purpose. The function works out the amount on the server, creates the provider object (Razorpay order, Stripe Checkout Session or PayPal order) and saves a `paymentSessions` document with `status: pending`.

### 3. Provider checkout
**Razorpay** opens inside the page (web) or as the native checkout sheet (Mobile App). **Stripe** and **PayPal** are hosted pages: the browser is redirected, or a payment link is shared with the customer.

### 4. verifyPayment
The client sends the provider's proof back. The function checks it **with the provider**, then records the payment on the order in one transaction and e-mails a receipt.
:::

```text title="Sequence"
Client                     Cloud Functions                 Provider
  │ paymentConfig ───────────▶ providers, currency, mode
  │ createPayment ───────────▶ create order/session ───────▶ Razorpay / Stripe / PayPal
  │ ◀──────── keyId + orderId (Razorpay) or hosted url (Stripe/PayPal)
  │ customer pays ──────────────────────────────────────────▶
  │ verifyPayment ───────────▶ check signature / session / capture
  │                            payments/{provider}_{txn} + order.paid/due + activity
  │ ◀──────── ok, amount, currency                   receipt e-mail ▶ customer
```

## Who pays and how much

| Where | Purpose | Amount | Providers shown |
|---|---|---|---|
| **Online Store** after a booking request | `checkout` | Set in *Online store → Checkout*: full amount, a down payment percentage, or the security deposit only. With *none*, no payment is asked for | Every available provider |
| **Platform**, order → *Collect online payment* | `custom` | Staff enter any amount from 1 up to the amount due | Razorpay: **Charge now**. Stripe and PayPal: **Create link** |
| **Mobile App**, order → *Collect online payment* | `custom` | Same as the platform | Razorpay: **Charge now** (native checkout). Stripe and PayPal: **Create link**, then share, copy or open it |

The amount is always recalculated in `createPayment` from the order in Firestore. A client cannot change what is charged, and only workspace members can use `custom`.

## Razorpay on the web

`Payments.pay()` in `booqora_platform/lib/data/payments.dart`:

1. Loads `https://checkout.razorpay.com/v1/checkout.js` once.
2. Opens Razorpay Checkout with the `keyId`, `amountMinor`, `currency`, the Razorpay `order_id`, the customer prefill and the store's brand colour.
3. In the `handler`, calls `verifyPayment` with `razorpay_payment_id` and `razorpay_signature`.
4. Closing the sheet returns *Payment cancelled*; a `payment.failed` event shows Razorpay's error text.

The page never leaves Booqora, so Razorpay does not use `/pay/return`.

## Razorpay in the Mobile App

`booqora_mobile/lib/data/payments.dart` uses the **`razorpay_flutter`** plugin instead of the web script. It listens for `EVENT_PAYMENT_SUCCESS` (then calls `verifyPayment`), `EVENT_PAYMENT_ERROR` (cancelled or failed) and `EVENT_EXTERNAL_WALLET`. UPI apps, cards, net banking and wallets open natively. See [Payments in the App](doc:app/payments).

## Stripe and PayPal

`createPayment` returns a hosted `url`:

- **Web:** the browser goes to the URL. After paying, Stripe or PayPal sends the customer to `<platform>/pay/return?provider=…&w=<workspaceId>&s=<sessionId>` (Stripe adds `cs`, PayPal adds `token`).
- **Mobile App:** when a hosted page is opened from the app, it loads in a secure in-app browser view; the return page runs there, and the order updates live in the app once paid.
- **Payment link:** in the *Collect online payment* dialog, staff create a link and **Copy**, **Open** or **E-mail** it (platform), or **Share**, copy or open it (Mobile App). E-mails go through `sendEmail`.

### The `/pay/return` page

`lib/features/payments/pay_return_page.dart` is public (no sign-in). It:

1. Shows *You cancelled the payment. No money was taken.* if the URL has `cancelled=1`.
2. Otherwise calls `verifyPayment` with `stripeSessionId` or `paypalToken`.
3. Shows the result: amount, currency and store name on success, or the provider's message if the payment is not complete.
4. Offers **Open order** for signed-in staff or **Back to store** for customers, and **Check again** if the payment is not confirmed yet.

The return URL must start with an origin in `ALLOWED_RETURN` in `functions/index.js`. See [Custom Domains & SSL](doc:installation/domains#3-allow-the-domain-as-a-payment-return-url).

## Recording the payment

`verifyPayment` is **idempotent**. The payment document ID is `{provider}_{transactionId}`, and a session that is already `paid` returns `already: true` without writing again. So a customer refreshing the return page, or the app and the return page both verifying, never records a payment twice.

What changes on the order:

| Field | New value |
|---|---|
| `paid` | Previous `paid` + amount (unchanged for a deposit-only payment) |
| `due` | `total − paid` |
| `paymentStatus` | `paid`, `partially_paid`, `overpaid` or `payment_due` |
| `depositPaid` | Increased, for a deposit payment |

A `payments` document (method `online`, with the provider and transaction reference) and an `activity` entry (*"#12 · INR 2500.00 via Razorpay"*) are written in the same transaction.

## Test and live mode

| Provider | Test | Live |
|---|---|---|
| Razorpay | Key ID starts `rzp_test_` | Key ID starts `rzp_live_` |
| Stripe | Secret key starts `sk_test_` | Secret key starts `sk_live_` |
| PayPal | `PAYPAL_ENV=sandbox` | `PAYPAL_ENV=live` |

Test-mode payments are labelled *(test mode)* in the payment note, so they are easy to spot in reports.

:::note No webhooks
Booqora confirms each payment from the client through `verifyPayment`; it does not register provider webhooks. If a customer pays on Stripe or PayPal but closes the browser before the return page loads, the session stays `pending`. Check the provider dashboard and record the payment by hand on the order.
:::

**Next:** [Security Rules →](doc:api/security-rules)
