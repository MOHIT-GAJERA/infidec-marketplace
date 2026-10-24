---
title: Payment Flow
description: How Go4Ride takes online payments for trips and wallet top-ups through Razorpay, Stripe and PayPal hosted checkouts, verifies them server-side and records them exactly once.
---

Go4Ride supports **Cash**, the **Go4Ride Wallet** and **online payments** through three hosted checkouts. The gateways host the card / UPI form, so the apps contain **no gateway SDK** and never see a card number.

| Gateway | Product used | Methods | Charges in |
|---|---|---|---|
| **Razorpay** | Payment Links | UPI, cards, netbanking, wallets | INR |
| **Stripe** | Checkout Sessions | Cards | `stripeCurrency` (default INR) |
| **PayPal** | Orders v2 (intent `CAPTURE`) | PayPal balance, cards | `paypalCurrency` (default INR) |

Cash and wallet payments are settled by the ride trigger (see [Ride Lifecycle](doc:api/ride-lifecycle)). This page covers the online flow, implemented in `functions/src/payments.ts` and `functions/src/gateways.ts`.

## The flow

```text
Customer App ── createPayment ──▶ payments/{id} (created) + gateway checkout URL
App opens the URL in the browser ──▶ rider pays on the gateway page
Gateway redirects ──▶ paymentReturn?pid={id}  ──▶ verifies with the gateway API
                                               ──▶ payments/{id} = paid | failed
                                               ──▶ ride marked paid  or  wallet credited
                                               ──▶ transactions row + push notification
App watches payments/{id} live ── (optional) checkPayment re-verifies on demand
```

![Stripe Checkout](/docs/go4ride/images/web-stripe-checkout.jpg "Stripe Checkout opened from the app")
![Razorpay checkout](/docs/go4ride/images/web-razorpay-checkout.jpg "Razorpay Payment Link: UPI, cards and netbanking")
![Return page](/docs/go4ride/images/web-payment-return.jpg "paymentReturn: the page the rider sees after paying")

## createPayment (callable)

| | |
|---|---|
| **Caller** | Any signed-in user |
| **Input** | `purpose` (`ride` or `topup`), `gateway` (`razorpay`, `stripe` or `paypal`), `rideId` (for `ride`), `amount` (for `topup`) |
| **Output** | `{ paymentId, checkoutUrl, amount, currency }` |

What it does:

1. Loads the gateway config (`settings/payment` merged with `secure_settings/payment`). Stops if `<gateway>Enabled` is `false`.
2. **Computes the amount on the server**:
   - `ride`: the ride must belong to the caller, not be paid, and not be `cancelled` or `noDriversFound`. Amount = the ride's `fare.total`.
   - `topup`: amount must be between `settings/app.walletMinTopup` and `walletMaxTopup` (defaults ₹50 and ₹10,000).
3. Converts the INR amount for the gateway (`chargeAmount`): Razorpay always INR; Stripe / PayPal in their configured currency. For USD it multiplies by `usdPerInr` (default **0.012**), minimum 0.50.
4. Creates the hosted checkout with the return URL `…/paymentReturn?pid=<paymentId>` (and `&cancelled=1` as the cancel URL):
   - Razorpay: `POST /v1/payment_links` with `reference_id = paymentId`, `callback_method: get`, SMS/e-mail notifications off.
   - Stripe: `POST /v1/checkout/sessions`, `mode: payment`, `client_reference_id` + `metadata.paymentId`, success URL with `session_id={CHECKOUT_SESSION_ID}`.
   - PayPal: OAuth token, then `POST /v2/checkout/orders` with `reference_id = paymentId`, `user_action: PAY_NOW`, `shipping_preference: NO_SHIPPING`.
5. Writes `payments/{paymentId}`: `userId`, `purpose`, `rideId`, `gateway`, `amountInr`, `amount`, `currency`, `gatewayRef` (link / session / order id), `checkoutUrl`, `status: "created"`, `createdAt`.

| Error | When |
|---|---|
| `unauthenticated` | Not signed in |
| `invalid-argument` | Unknown gateway or purpose, missing `rideId`, top-up outside the limits (*Top-up must be between ₹50 and ₹10000.*) |
| `failed-precondition` | Gateway turned off, ride already paid, nothing to pay |
| `not-found` | Ride missing or not the caller's |
| `unavailable` | The gateway refused the checkout (wrong keys, account not activated…). Logged as `checkout creation failed` |

## paymentReturn (HTTP)

`GET https://us-central1-your-project-id.cloudfunctions.net/paymentReturn?pid=…` is the browser redirect target. It is public (no auth), because the gateway sends the rider's browser there. It **never trusts the query string alone**:

| Gateway | Verification |
|---|---|
| **Razorpay** | Recomputes the HMAC-SHA256 signature over `payment_link_id \| reference_id \| status \| payment_id` with the key secret (timing-safe compare), **and** fetches the payment link: `paid` → paid; `cancelled` / `expired` → failed |
| **Stripe** | Fetches the Checkout Session: `payment_status == "paid"` → paid; `status == "expired"` → failed; otherwise pending |
| **PayPal** | Captures the order (`PayPal-Request-Id: cap-<orderId>` makes it idempotent): `COMPLETED` or `ORDER_ALREADY_CAPTURED` → paid; `ORDER_NOT_APPROVED` → pending; other errors → failed |

`cancelled=1` marks the attempt failed (*Payment cancelled.*). It answers with a small black-and-amber HTML page: *Payment successful*, *Payment pending* or *Payment not completed* (*"No money was taken for this attempt."*). The page carries `data-status` for automated tests.

## Finalising, exactly once

`finalizePayment` runs in a Firestore transaction and does nothing if the payment is already `paid` or `failed`, so a second redirect, a page refresh or a `checkPayment` call never double-credits.

- **Paid:** `payments/{id}` → `status: "paid"`, `gatewayPaymentId`, `paidAt`.
  - Ride: `isPaid: true`, `paymentStatus: "paid"`, `paymentGateway`, `paymentId`, `paidAt`, plus a `ridePayment` ledger row (−amount, rider).
  - Top-up: rider `walletBalance + amountInr`, plus a `topup` ledger row.
- **Failed:** `status: "failed"`, `reason`.
- **Pending:** no change; the app keeps waiting.
- Push to the rider: *Payment successful* (*"₹500 added to your wallet."* / *"₹215 paid for your trip."*) or *Payment failed*.

## checkPayment (callable)

| | |
|---|---|
| **Caller** | The payment's owner |
| **Input** | `paymentId` |
| **Output** | `{ status }`: `paid`, `failed`, `pending` or `missing` |
| **Errors** | `unauthenticated`, `not-found` (not your payment) |

Re-runs the same verification, for when the rider closed the browser before the redirect. The Customer App's *waiting* sheet listens to `payments/{id}` and offers a *check again* action that calls it.

## Keys

| Key | Document | Field |
|---|---|---|
| Razorpay Key ID / Key Secret | `settings/payment` / `secure_settings/payment` | `razorpayKeyId` / `razorpayKeySecret` |
| Stripe secret key | `secure_settings/payment` | `stripeSecretKey` (`stripePublishableKey` in `settings/payment` is shown only) |
| PayPal Client ID / Secret | `settings/payment` / `secure_settings/payment` | `paypalClientId` / `paypalSecret`; `paypalMode: "live"` uses `api-m.paypal.com`, otherwise the sandbox |
| Currency for Stripe / PayPal | `settings/payment` | `stripeCurrency`, `paypalCurrency`, `usdPerInr` |

No webhooks are used: the redirect plus `checkPayment` verify every payment. The webhook-secret fields on the Payment secrets page are stored but not read by the current functions.

## Test cards

| Gateway | Success | Failure |
|---|---|---|
| Stripe (test keys `pk_test_…` / `sk_test_…`) | `4242 4242 4242 4242`, any future date, any CVC | `4000 0000 0000 0002` (declined) |
| Razorpay (test keys `rzp_test_…`) | Netbanking or card → mock bank page → **Success** | Mock bank page → **Failure** |
| PayPal (`paypalMode: sandbox`) | Log in with a sandbox **personal** (buyer) account from developer.paypal.com | Cancel on the PayPal page |

![Razorpay mock bank](/docs/go4ride/images/web-razorpay-bank.jpg "Razorpay test mode: choose Success or Failure")

Gateway setup step by step: [Payment Gateways](doc:admin/payment-gateways).

**Next:** [Data Model (Firestore) →](doc:api/data-model)
