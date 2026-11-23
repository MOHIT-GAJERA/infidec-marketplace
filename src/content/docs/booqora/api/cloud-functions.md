---
title: Cloud Functions Reference
description: Reference for Booqora's five Cloud Functions (paymentConfig, createPayment, verifyPayment, sendEmail, onOnlineOrder), with inputs, outputs, secrets and behaviour.
---

All functions live in one file, `booqora_platform/functions/index.js`, written as ES modules for **Cloud Functions v2** on **Node.js 22**.

```js title="Global options"
setGlobalOptions({ region: 'asia-south1', maxInstances: 10, memory: '256MiB' });
```

| Function | Type | Auth | Secrets |
|---|---|---|---|
| `paymentConfig` | Callable (`onCall`) | None needed | Payment |
| `createPayment` | Callable | Signed in (anonymous allowed) | Payment |
| `verifyPayment` | Callable | None needed; checks the session and the provider | Payment + Mail |
| `sendEmail` | Callable | Signed in, **not anonymous**, workspace member | Mail |
| `onOnlineOrder` | Firestore `onDocumentCreated` on `workspaces/{wid}/orders/{oid}` | – | Mail |

*Payment* secrets are `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`. *Mail* secrets are `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`. See [Secrets & Environment](doc:installation/environment-configuration).

Clients call them through `Payments` in `lib/data/payments.dart` with `FirebaseFunctions.instanceFor(region: 'asia-south1')` and a 60-second timeout. Errors are thrown as `HttpsError` with a readable message, which the apps show as-is.

## `paymentConfig`

Tells a client which payment providers a store can use right now. Public, so the Online Store can call it.

| Input | Type | Notes |
|---|---|---|
| `workspaceId` | string | Either this… |
| `slug` | string | …or the store slug, resolved through `publicStores/{slug}` |

**Returns**

```json
{
  "workspaceId": "abc123",
  "currency": "INR",
  "checkout": { "paymentMode": "full", "downPaymentPercent": 25 },
  "providers": {
    "razorpay": { "configured": true, "enabled": true, "available": true, "mode": "test", "currency": "INR", "keyId": "rzp_test_…", "reason": null },
    "stripe":   { "configured": true, "enabled": true, "available": true, "mode": "test", "currency": "INR", "reason": null },
    "paypal":   { "configured": true, "enabled": true, "available": false, "mode": "test", "currency": "USD", "reason": "PayPal is set up for USD; this store uses INR." }
  }
}
```

A provider is **available** when its keys are set (`configured`), it is not switched off in *Settings → Payment providers* (`enabled`) and its currency matches the store. `mode` is `live` for `rzp_live…` / `sk_live…` keys or `PAYPAL_ENV=live`, otherwise `test`. `reason` explains why a provider is unavailable.

## `createPayment`

Starts a payment for one order and stores a `paymentSessions` document.

| Input | Type | Notes |
|---|---|---|
| `workspaceId`, `orderId` | string | Required |
| `provider` | string | `razorpay`, `stripe` or `paypal` |
| `purpose` | string | `checkout` (Online Store rules), `balance` (default, the amount due) or `custom` (staff only) |
| `amount` | number | Only for `custom`; capped at the amount due |
| `returnUrl` | string | Required for Stripe and PayPal; must start with an origin in `ALLOWED_RETURN` |

**How the amount is chosen**

| Purpose | Amount |
|---|---|
| `checkout` | From `settings.checkout.paymentMode`: `full` = amount due; `down` = `downPaymentPercent` % of the total (default 25), capped at the amount due; `deposit` = order deposit minus deposit already paid; `none` = nothing |
| `balance` | `total − paid` |
| `custom` | The requested amount, only if the caller is a workspace member |

The amount must be at least **1** in the store currency, otherwise *"Nothing to pay on this order"*.

**Returns**

| Provider | Response |
|---|---|
| Razorpay | `sessionId`, `keyId`, `providerOrderId`, `amount`, `amountMinor`, `currency`, `name`, `description`, `prefill` (`name`, `email`, `contact`), `brandColor`, `mode`; the client opens Razorpay Checkout with these |
| Stripe | `sessionId`, `url` (Stripe Checkout page), `amount`, `currency`, `mode` |
| PayPal | `sessionId`, `url` (PayPal approval link), `amount`, `currency`, `mode` |

Stripe and PayPal return to `returnUrl?provider=…&w=<workspaceId>&s=<sessionId>`, plus `&cs={CHECKOUT_SESSION_ID}` for Stripe or `&cancelled=1` when the customer cancels. PayPal adds its own `token`.

## `verifyPayment`

Confirms a payment with the provider and records it. Safe to call more than once.

| Input | Type | Notes |
|---|---|---|
| `workspaceId`, `sessionId` | string | Required |
| `razorpay` | object | `{ paymentId, signature }` from Razorpay Checkout |
| `stripeSessionId` | string | The `cs` query parameter; must match the session |
| `paypalToken` | string | The `token` query parameter; must match the session |

**Verification**

- **Razorpay:** HMAC-SHA256 of `<razorpayOrderId>|<paymentId>` with the key secret, compared in constant time with the signature.
- **Stripe:** retrieves the Checkout Session and requires `payment_status = paid`.
- **PayPal:** captures the order (or reads it if already captured) and requires `COMPLETED`.

On success it runs one Firestore **transaction** that: writes `payments/{provider}_{transactionId}` (`method: online`), updates the order's `paid`, `due`, `paymentStatus` (and `depositPaid` for a deposit), marks the session `paid`, and adds an `activity` entry. It then e-mails a receipt to the customer if the order has an e-mail address.

**Returns** `{ ok, amount, currency, provider, orderId, storeName, slug, mode, transactionId }`, or `{ ok: true, already: true, … }` if the session was already paid, or `{ ok: false, status, message }` if the provider says the payment is not complete.

## `sendEmail`

Sends an e-mail from a workspace over SMTP.

| Input | Type | Notes |
|---|---|---|
| `workspaceId` | string | Caller must be a member |
| `to` | string or list | Comma-separated or array; 1–20 valid addresses |
| `subject`, `body` | string | Required; trimmed to 300 and 20,000 characters |
| `context`, `entityId` | string | Optional, stored in the log (`orders`, `invoices`…) |
| `cc` | list | Optional extra addresses |

The message is sent as plain text plus a branded HTML version (logo, brand colour, footer). *From* is `"<fromName>" <MAIL_FROM_ADDRESS>`; *Reply-To* is `settings.emails.replyTo` or the company e-mail; `settings.emails.ccAll` is copied on every message. Every attempt is written to `emailLog` with `status: sent` or `failed`. Returns `{ ok: true, id }`.

## `onOnlineOrder`

Runs when any order is created. It does nothing unless `source == 'online'`. Then it:

1. E-mails the customer *"We received your booking request — {store}"* with the lines, rental period (in the workspace time zone) and total, unless `settings.emails.sysOrderConfirmation` is `false`.
2. E-mails the store's `settings.general.email` *"New online booking from {customer}"* with the customer's contact details.

E-mail failures are logged as warnings and never block the booking.

## Configuration

| Variable (`functions/.env`) | Default | Used by |
|---|---|---|
| `RAZORPAY_CURRENCY` | `INR` | Provider availability |
| `PAYPAL_ENV` | `sandbox` | PayPal API host and mode |
| `PAYPAL_CURRENCY` | `USD` | Provider availability |
| `MAIL_HOST`, `MAIL_PORT` | `smtp.gmail.com`, `587` | SMTP transport |

`ALLOWED_RETURN`, a constant in `index.js`, lists the origins allowed as Stripe/PayPal return URLs. Update it for your domains ([Custom Domains & SSL](doc:installation/domains#3-allow-the-domain-as-a-payment-return-url)).

**Next:** [Payment Flow →](doc:api/payment-flow)
