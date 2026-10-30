---
title: Payment Gateways
description: How the Customer app pays with native Razorpay checkout, Stripe Checkout and PayPal in an in-app browser, Wallet and COD, and what to configure.
---

The app shows only the methods enabled in **Admin → Settings → Payment gateways** (`settings/payments`), and hides COD above the COD limit. All prices and amounts come from the server. The app never calculates a charge itself.

![Payment methods at checkout](/docs/go4market/images/app-customer-checkout-payment.webp "UPI, cards and netbanking (Razorpay), Stripe, PayPal and Cash on delivery")

## The flow in the app

The logic lives in `apps/customer_app/lib/core/payments.dart`:

| Method | What the app does |
|---|---|
| **Razorpay** (UPI, cards, netbanking, wallets) | Opens the native `razorpay_flutter` checkout with the order ID and key from `placeOrder`. On success it calls `confirmPayment` with the payment ID and signature |
| **Stripe** | Opens the hosted Stripe Checkout URL in an in-app browser (Chrome Custom Tab). When the user returns to the app, it calls `confirmPayment` with the session ID |
| **PayPal** | Opens the PayPal approval URL the same way; on return the server captures the payment |
| **Wallet** | Uses the balance. With *Use wallet balance* on, only the remainder is charged |
| **COD** | The order is placed immediately |

Wallet top-ups (**Wallet → Add money**) use the same flow with `walletTopup` / `confirmWalletTopup`.

## What to configure

1. Public keys in **Admin → Settings → Payment gateways** and in `functions/.env`; secrets in Secret Manager ([Payment Gateways](doc:admin/payment-gateways)).
2. `WEBSITE_URL` in `functions/.env`: Stripe and PayPal return to `WEBSITE_URL/payment/return`, which tells the user to go back to the app.
3. Nothing in the app source: no keys are compiled into the app.

## Release builds

`android/app/proguard-rules.pro` already contains the **Razorpay keep rules** required by R8. Keep them if you edit the file. The manifest's `<queries>` block lists UPI apps and Custom Tabs so payment apps can be opened on Android 11+.

:::tip Test cards and UPI
Use Razorpay **test mode** keys with test cards or `success@razorpay` as the UPI ID, Stripe test cards (`4242 4242 4242 4242`) and a PayPal sandbox buyer account. Switch both the panel and the server to live keys together.
:::

**Next:** [Push Notifications →](doc:app-customer/notifications)
