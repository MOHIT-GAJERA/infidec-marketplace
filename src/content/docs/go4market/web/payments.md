---
title: Checkout & Payment Return
description: The website's single-screen checkout, Razorpay Checkout.js, Stripe Checkout and PayPal redirects, and the /payment/return page.
---

## Checkout

`/cart` is a single screen, like in the app: items with add-ons, delivery type (home or pickup), address, speed (standard, 15 min, 30 min, scheduled slot), coupon, wallet, membership discount, payment method and the bill. Every change calls `getCheckoutQuote`, so prices, fees and errors always come from the server.

Guests can fill the cart; **Place order** asks them to sign in first, and the guest cart is merged into their account.

## Payment methods

`lib/core/payment_flow.dart` handles the `payment` payload returned by `placeOrder`:

| Provider | Website behaviour |
|---|---|
| **Razorpay** | Loads `https://checkout.razorpay.com/v1/checkout.js` on demand (`web_bridge.dart`) and opens the Razorpay modal. On success calls `confirmPayment` with the payment ID and signature |
| **Stripe** | Redirects the tab to the hosted **Stripe Checkout** page |
| **PayPal** | Redirects to the PayPal approval page |
| **Wallet / COD** | Order placed immediately |

## The `/payment/return` page

Stripe and PayPal send the customer back to:

```text
<WEBSITE_URL>/payment/return?provider=stripe|paypal&orderId=<id>[&session_id=…][&kind=topup][&cancelled=1]
```

The page calls `confirmPayment` (or `confirmWalletTopup` when `kind=topup`). On success it shows the order or the new wallet balance. On `cancelled=1` it tells the customer the payment was cancelled; the unpaid order is cancelled automatically after 30 minutes.

:::warning WEBSITE_URL must match your domain
`WEBSITE_URL` in `functions/.env` builds these return URLs. If it still says `go4market.web.app`, customers are sent to the wrong site after paying. Update it and redeploy the payment functions when you add a custom domain.
:::

The app uses the same return URL. In the app, the customer simply returns, and the app confirms the payment when the in-app browser closes.

**Next:** [Web Push & SEO →](doc:web/push-seo)
