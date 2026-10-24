---
title: Payment Gateways
description: Turn Cash, the Go4Ride Wallet, Razorpay, Stripe and PayPal on or off, add the public and secret keys, and understand how hosted checkouts are verified on the server.
---

Riders can pay a trip with **Cash**, the **Go4Ride Wallet** or **online**, and top up their wallet online. Online payments use **hosted checkout pages**, so the apps need no gateway SDK and card data never touches your project:

| Gateway | Hosted page | Methods |
|---|---|---|
| **Razorpay** | Payment Links | UPI, cards, netbanking, wallets (India) |
| **Stripe** | Checkout | International and domestic cards |
| **PayPal** | Orders v2 | PayPal balance or card |

You configure them on two settings pages: **Settings → Integrations → Payment methods** and **Payment secrets**.

## Payment methods

*"Which payment methods the apps offer. Public keys only — secrets live under "Payment secrets"."* Saved to `settings/payment`, which the apps can read.

| Section | Field | Default |
|---|---|---|
| **Cash & wallet** | Cash | On |
| | Go4Ride wallet | On |
| **Razorpay** (*UPI, cards and netbanking (India)*) | Enable Razorpay | Off |
| | Mode | Test / Live |
| | Key ID | `rzp_test_…` |
| **Stripe** (*International cards*) | Enable Stripe | Off |
| | Mode | Test / Live |
| | Publishable key | `pk_test_…` |
| **PayPal** | Enable PayPal | Off |
| | Mode | **Sandbox** / Live |
| | Client ID | Your app's client id |

## Payment secrets

*"Stored in a collection only admins and Cloud Functions can read. Never shipped to the apps."* Saved to `secure_settings/payment`. Values show as `••••••••`.

| Gateway | Field | Where to find it |
|---|---|---|
| Razorpay | **Key secret** | Razorpay Dashboard → Account & Settings → API Keys |
| Razorpay | Webhook secret | Not used by v1.0 (see below) |
| Stripe | **Secret key** | Stripe Dashboard → Developers → API keys (`sk_test_…` / `sk_live_…`) |
| Stripe | Webhook signing secret | Not used by v1.0 |
| PayPal | **Client secret** | PayPal Developer → Apps & Credentials |

:::steps
### Create test credentials
Razorpay **test mode** keys, Stripe **test** keys, a PayPal **sandbox** app.

### Enter the public values
**Payment methods**: switch the gateway on, pick Test / Sandbox, paste the Key ID / Publishable key / Client ID, **Save changes**.

### Enter the secrets
**Payment secrets**: paste the Key secret / Secret key / Client secret, **Save changes**.

### Test a payment
In the Customer App, **Wallet → Add money** with a test card (below). The wallet should go up within seconds.

### Go live
Replace the test keys with live keys, set PayPal **Mode** to **Live**, and run one small real payment.
:::

## What riders see

- **Booking screen**: payment chips for each enabled method: *Cash*, *Wallet* and *Card* (shown when at least one gateway is on). If everything is off, Cash is offered.
- **Card trips** are paid **after completion**: the ride screen shows **Pay ₹…**, the rider picks a gateway if more than one is on, and the checkout opens in the browser.
- **Wallet top-up**: **Add money** → amount between your minimum and maximum (**Settings → App settings**, default ₹50–₹10,000) → **Proceed to pay**.

![Pick a gateway](/docs/go4ride/images/app-customer-pay-picker.webp "Choose Razorpay, Stripe or PayPal")
![Payment successful](/docs/go4ride/images/app-customer-payment-success.webp "The app updates as soon as the server confirms")
![Trip paid](/docs/go4ride/images/app-customer-trip-paid.webp "The completed trip shows Paid")

## How a payment is verified

```text
App ── createPayment ──▶ payments/{id} (created) + checkout URL
App opens the URL ──▶ Razorpay / Stripe / PayPal page
Gateway redirects ──▶ paymentReturn?pid={id}
paymentReturn asks the gateway API ──▶ payments/{id} = paid | failed
                                       ride marked paid, or wallet credited
                                       ledger row in transactions + push
App watches payments/{id} live (checkPayment re-checks on demand)
```

1. **`createPayment`** (callable) computes the amount **on the server**: the ride's fare total, or the top-up amount checked against your limits (*"Top-up must be between ₹50 and ₹10000."*). It refuses a gateway that is switched off, a ride that is already paid, cancelled or not the caller's.
2. The rider pays on the gateway's own page.
3. The gateway sends the browser back to the **`paymentReturn`** HTTP function. It never trusts the redirect alone. For **Razorpay** it checks the HMAC-SHA256 signature with your key secret **and** fetches the payment link status; for **Stripe** it reads the Checkout Session's `payment_status`; for **PayPal** it captures the approved order.
4. The result is applied **once** in a transaction: `payments/{id}` becomes *paid* or *failed*; a ride gets `isPaid: true`; a top-up credits `users.walletBalance`; a row is added to `transactions`; the rider gets *"Payment successful"* or *"Payment failed"*.
5. The browser shows a small Go4Ride page: *Payment successful*, *Payment pending* or *Payment not completed — No money was taken for this attempt.*

![Stripe checkout](/docs/go4ride/images/web-stripe-checkout.jpg "Stripe Checkout")
![Razorpay checkout](/docs/go4ride/images/web-razorpay-checkout.jpg "Razorpay Payment Link")
![Razorpay test bank](/docs/go4ride/images/web-razorpay-bank.jpg "Razorpay test mode: choose Success or Failure")
![Return page](/docs/go4ride/images/web-payment-return.jpg "paymentReturn result page")

If the rider closes the browser before the redirect, the app's **checkPayment** call re-verifies with the gateway, so a paid payment is never lost.

## Test cards and accounts

| Gateway | Use | Result |
|---|---|---|
| Stripe | `4242 4242 4242 4242`, any future date, any CVC | Success |
| Stripe | `4000 0000 0000 0002` | Declined |
| Razorpay (test mode) | Netbanking → the mock bank page → **Success** or **Failure** | As chosen |
| PayPal (sandbox) | Log in with a **sandbox personal (buyer)** account from PayPal Developer → Sandbox accounts | Success |

## Currency

Razorpay always charges **INR**. Stripe and PayPal charge INR by default too. If your Stripe or PayPal account can't take INR (for example a US sandbox account), add these keys to `secure_settings/payment` in the Firestore console (there is no form field for them):

| Key | Example | Effect |
|---|---|---|
| `stripeCurrency` | `"USD"` | Stripe charges in USD |
| `paypalCurrency` | `"USD"` | PayPal charges in USD |
| `usdPerInr` | `0.012` (default) | INR → USD conversion rate. Minimum charge 0.50 |

The ride and wallet keep the INR amount; only the gateway charge is converted.

:::note Modes and webhooks
**Mode** for Razorpay and Stripe is informational: test or live is decided by the keys you paste. PayPal **Mode** chooses the sandbox or live API. v1.0 verifies payments through the return page and `checkPayment`, so no webhook endpoint needs to be registered and the two webhook secrets are not used.
:::

:::warning The return URL
The functions build the return address as `https://us-central1-your-project-id.cloudfunctions.net/paymentReturn`. If you deploy functions to another region, change `returnBase()` in `functions/src/payments.ts` to match.
:::

**Next:** [General & App Settings →](doc:admin/settings)
