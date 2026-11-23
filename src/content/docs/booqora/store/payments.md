---
title: Online Store Payments
description: How customers pay after a booking request in the Online Store, the Pay now card, Razorpay in-page checkout, Stripe and PayPal redirects, the /pay/return page and server-side verification with verifyPayment.
---

Customers can pay as soon as they have sent a booking request. Payment is optional: they can always pay later. Everything sensitive happens in the Cloud Functions in `functions/index.js`; the browser only starts the payment and shows the result.

## When the Pay now card appears

The success screen asks `paymentConfig` for the store's checkout settings and providers (`lib/features/storefront/storefront_pay.dart`). The **Pay now** card is shown only if:

- the checkout payment mode is not **Do not show payment options** ([Checkout & Fulfillment](doc:store/checkout)),
- at least one provider is **available** (keys on the server, *Offer to customers* on, currency matching) ([Payment Gateways](doc:admin/payment-gateways)),
- and the amount is at least 1.

If `paymentConfig` fails, the card is hidden and the request still stands.

| Payment mode | Card title | Amount |
|---|---|---|
| `full` | Pay now to confirm your booking | Order total |
| `down` | Pay a N% down payment to confirm | N% of the total |
| `deposit` | Pay the security deposit to confirm | The order deposit |

The card lists one button per available provider: **Pay with Razorpay** (UPI, cards, netbanking & wallets), **Pay with Stripe** (Credit & debit cards) and **Pay with PayPal** (PayPal balance or cards). In test mode it shows "Test mode — no real money will be charged." The footer reads "You can also pay later — the store will confirm your booking by email."

## The flow

```text
Pay with … ─► createPayment (server: amount from order + checkout mode)
   ├─ Razorpay ─► Razorpay Checkout opens in the page ─► handler ─► verifyPayment
   └─ Stripe / PayPal ─► redirect to hosted page ─► /pay/return?provider=…&w=…&s=… ─► verifyPayment
verifyPayment ─► check with the provider ─► record payment on the order ─► email receipt
```

:::steps
### createPayment
Requires a signed-in user; the store visitor is already signed in anonymously from the request. With `purpose: 'checkout'` the server calculates the amount from the order and the workspace's checkout mode, so the browser cannot change it. It creates a `paymentSessions/<id>` document with `status: pending`, the amount, currency, provider and mode. In deposit mode the session is marked `kind: deposit`.

### Pay with the provider
- **Razorpay**: the server creates a Razorpay order. The browser loads `https://checkout.razorpay.com/v1/checkout.js` and opens the checkout in the page, pre-filled with the customer's name, email and phone and coloured with your brand colour.
- **Stripe**: the server creates a Stripe Checkout Session in the store currency and returns its URL. The browser goes there.
- **PayPal**: the server creates a PayPal order (`intent: CAPTURE`, no shipping) and returns the approval link.

### Return
Razorpay calls back in the page. Stripe and PayPal send the customer to `/pay/return` with the provider, workspace ID and session ID (plus `cs` for Stripe or `token` for PayPal). Cancelling adds `cancelled=1`.

### verifyPayment
- **Razorpay**: checks the HMAC-SHA256 signature of `order_id|payment_id` with the key secret.
- **Stripe**: retrieves the Checkout Session and requires `payment_status: paid`.
- **PayPal**: captures the order (or reads it if already captured) and requires `COMPLETED`.
:::

## What is recorded

`verifyPayment` records the payment in a single transaction, and only once (a session already `paid` is returned as is):

| Where | What |
|---|---|
| `payments/<provider>_<transactionId>` | Amount, currency, `method: online`, provider, kind (`charge` or `deposit`), reference, note "Paid online via <provider>" (plus "(test mode)") |
| The order | `paid`, `due` and `paymentStatus` (`payment_due`, `partially_paid`, `paid`, `overpaid`). A deposit payment updates `depositPaid` instead of `paid` |
| `paymentSessions/<id>` | `status: paid`, `transactionId`, `paidAt` |
| `activity` | "<order> · <currency> <amount> via <provider>" |

The customer then gets the email "Payment received — <store>" with the amount and transaction reference ([Email & SMTP](doc:admin/email-smtp)).

## The /pay/return page

`/pay/return` (`lib/features/payments/pay_return_page.dart`) is public, like the store.

It shows "Confirming your payment…" while it calls `verifyPayment`, then:

| Heading | Message |
|---|---|
| Payment cancelled | "You cancelled the payment. No money was taken." (no server call is made) |
| Payment successful | The amount, the store name and "Thank you! Your payment has been received and a receipt is on its way by email." |
| Payment not completed | The reason from the server, with a **Check again** button |

After verification it offers **Back to store** (`/s/<slug>`) and, for signed-in staff, **Open order**. The page shows "Secured by Booqora".

In the store, a successful Razorpay payment replaces the card with "Payment received · ₹…" and "A receipt has been sent to your email."

## Checklist

- [ ] Payment secrets set and functions deployed ([Payment Gateways](doc:admin/payment-gateways))
- [ ] Your Hosting and custom domains added to `ALLOWED_RETURN` in `functions/index.js`, or Stripe and PayPal fail with "returnUrl is not allowed"
- [ ] A payment mode chosen in **Online store → Checkout**
- [ ] Anonymous sign-in enabled in Firebase Authentication
- [ ] A test payment made in test mode before switching to live keys

For the full technical sequence, including staff-initiated payments and payment links, see [Payment Flow](doc:api/payment-flow).

**Next:** [SEO & Sharing →](doc:store/seo)
