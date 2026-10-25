---
title: Wallet & Payments
description: Cash, the Go4Ride wallet and online payments (Razorpay, Stripe, PayPal hosted checkouts) in the Customer App, wallet top-ups, the server-verified payment flow and test cards.
---

![Wallet](/docs/go4ride/images/app-customer-wallet.webp "Wallet and transactions")
![Top-up](/docs/go4ride/images/app-customer-topup.webp "Add money")
![Pay with](/docs/go4ride/images/app-customer-pay-picker.webp "Choose a gateway")
![Success](/docs/go4ride/images/app-customer-payment-success.webp "Payment successful")

## Payment methods

Riders choose the method on the booking form. The chips follow **Admin → Settings → Payment methods** live ([Payment Gateways](doc:admin/payment-gateways)):

| Chip | Shown when | When the money moves |
|---|---|---|
| **Cash** | `cashEnabled` (default on) | Rider pays the driver. Commission is taken from the driver's wallet at completion |
| **Wallet** | `walletEnabled` (default on) | The fare is debited from the rider's wallet when the ride completes |
| **Card / UPI** | Razorpay, Stripe or PayPal enabled | After completion the rider taps **Pay ₹…** on the ride screen and pays on the gateway's page |

If every method is off, the app falls back to Cash.

## Wallet

Home → **Wallet** (or Account → Wallet) shows **Available balance**, **Add money** and the list of transactions: *Wallet top-up*, *Trip payment*, *Cancellation fee*, *Refund*, *Promo credit* and so on, with date and a green or red amount.

### Top-up

:::steps
### Add money
Enter an amount or tap a quick chip (₹200, ₹500, ₹1,000, ₹2,000 and the minimum). The amount must be between **Minimum top-up** and **Maximum top-up** in Admin → Settings → App settings → Wallet (defaults ₹50 and ₹10,000).

### Pick a gateway
**Pay with**: Razorpay (*UPI, cards, netbanking*), Stripe (*Credit / debit card*) or PayPal (*PayPal balance or card*). Only enabled gateways are listed. With one gateway the sheet is skipped.

### Pay on the gateway page
The checkout opens in the phone's browser. The app shows *Waiting for Razorpay…* and updates by itself.

### Credited
*Payment successful*: the wallet is credited and a *Wallet top-up* transaction appears.
:::

![Stripe Checkout](/docs/go4ride/images/web-stripe-checkout.jpg "Stripe Checkout")
![Razorpay](/docs/go4ride/images/web-razorpay-checkout.jpg "Razorpay payment link")
![Razorpay bank](/docs/go4ride/images/web-razorpay-bank.jpg "Razorpay test bank")
![Return page](/docs/go4ride/images/web-payment-return.jpg "Back to the app")

## How an online payment works

Card details never touch the app or your Firestore. The app only opens a hosted page and watches the result:

:::steps
### createPayment
The app calls the `createPayment` Cloud Function with `purpose` (`ride` or `topup`), `gateway` and the ride ID or amount. The **server** decides the amount: the ride's saved fare total, or the top-up amount checked against the wallet limits. It creates `payments/{id}` (status `created`) and a Razorpay Payment Link, Stripe Checkout Session or PayPal order.

### Hosted checkout
The app opens the returned `checkoutUrl` in the browser.

### paymentReturn
After paying, the gateway redirects to the `paymentReturn` HTTP function. It verifies with the gateway API: Razorpay HMAC signature and link status, Stripe session `payment_status`, PayPal order capture.

### Finalised once
`payments/{id}` becomes `paid` or `failed`. For a ride, the ride is marked paid. For a top-up, the wallet is credited. A row is added to `transactions` and the rider gets a notification. Finalising is idempotent, so a second redirect or check never credits twice.
:::

The wait sheet listens to `payments/{id}` live. If the rider closed the browser before the redirect, **I've paid — check status** calls `checkPayment`, which asks the gateway again. **Reopen payment page** and **Cancel** are also available. A failed payment shows the reason and *No money was taken.*

Public keys are stored in `settings/payment` (readable by the apps). Secrets are in `secure_settings/payment`, which only admins and Cloud Functions can read. Nothing secret is compiled into the app.

## Currencies

Razorpay always charges **INR**. Stripe and PayPal charge in the currency set for them in the Admin Panel. When that currency is USD, the INR amount is converted with `usdPerInr` (default **0.012**, so ₹215 → $2.58). Keep the rate up to date, or use INR accounts.

## Test payments

Switch the gateways to test / sandbox keys in the Admin Panel first.

| Gateway | Success | Failure |
|---|---|---|
| Stripe | Card `4242 4242 4242 4242`, any future date, any CVC | `4000 0000 0000 0002` (declined) |
| Razorpay (test mode) | Netbanking or UPI → test bank page → **Success** | Same page → **Failure** |
| PayPal (sandbox) | Log in with a sandbox **buyer** account from developer.paypal.com | Cancel on the PayPal page |

:::warning Go live checklist
Replace every test key with live keys in **Payment methods** and **Payment secrets**, and pay one small real amount with each gateway before launch.
:::

## Troubleshooting

| Message | Cause |
|---|---|
| *This payment method is turned off.* | The gateway is disabled in Payment methods |
| *Top-up must be between ₹50 and ₹10000.* | Amount outside the wallet limits |
| *This ride is already paid.* / *This ride has nothing to pay.* | Paid already, or the ride was cancelled / had no driver |
| *Could not start razorpay payment. Please try another method.* | Wrong or missing secret key. Check the Functions logs |
| *Online payment is unavailable. Please pay the driver in cash.* | A card ride, but no gateway is enabled any more |
| Stuck on *Waiting for …* | The redirect did not reach `paymentReturn`. Tap **I've paid — check status** |

**Next:** [Help & Support Tickets →](doc:app-customer/support)
