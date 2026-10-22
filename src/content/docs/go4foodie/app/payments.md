---
title: In-App Payments
description: Razorpay Checkout and Stripe Payment Element in a WebView, Pay at restaurant, and how the backend verifies every payment.
---

Gateway keys live **only on the backend** (Secret Manager and `functions/.env.<project-id>`, see [Payment Gateways](doc:admin/payment-gateways)). The app holds no keys and needs no payment SDK. It asks the backend which gateways are configured and runs the gateway's own web checkout in a WebView.

![Payment options](/docs/go4foodie/images/app-customer-payment.webp "Payment options at checkout")
![Cart](/docs/go4foodie/images/app-customer-cart.webp "Your order")

## Payment options

The checkout shows:

| Option | Shown when | Subtitle |
|---|---|---|
| **Pay at restaurant** | Always, for take-away and table orders. Never for gift cards | *Settle at the counter or your table* |
| **Razorpay** | Razorpay is configured | *UPI, cards, net-banking & wallets* |
| **Card (Stripe)** | Stripe is configured | *Visa, Mastercard, Amex* |

The list comes from `GET /api/payment` (`{razorpay, stripe, paypal}`). **PayPal is not offered in the app** because its pop-up button flow does not work inside a WebView. PayPal stays available on the website.

## How an online payment works

:::steps
### Start
The app calls `POST /api/payment` with `{provider, amount, description}`, using the cart total as `amount` and *"Go4Foodie order"* or *"Gift card"* as the description. The backend creates a Razorpay order or a Stripe PaymentIntent and returns only **public** values (`keyId` + `orderId`, or `publishableKey` + `clientSecret`).

### Pay in the WebView
A full-screen page opens, titled **Secure payment** (Razorpay) or **Card payment** (Stripe). Its HTML is loaded with the base URL `SITE_ORIGIN`:
- **Razorpay**: `checkout.razorpay.com/v1/checkout.js` opens with your key, the order ID, the customer's name, email and phone pre-filled, and the brand colour `#f5761e`.
- **Stripe**: the Payment Element (*night* theme) with a **Pay now** button. `confirmPayment` runs with `redirect: 'if_required'`.

### Return the result
The page sends the result back through a JavaScript channel: `{provider:'razorpay', orderId, paymentId, signature}` or `{provider:'stripe', paymentIntentId}`. Closing the sheet cancels the payment, and nothing is ordered. A failed payment shows the gateway's message.

### Place the order
The app sends the result as `payment` with `POST /api/mobile/customer/orders` (or `/customer/gift-cards`). The backend **verifies** it before saving: the Razorpay HMAC-SHA256 signature of `orderId|paymentId` with your key secret, or the Stripe PaymentIntent status `succeeded`.
:::

When verification fails, the order is not created and the app shows the server message:

| Message | Reason |
|---|---|
| *Payment required* | A gateway is configured but the order was sent without payment and without *Pay at restaurant* |
| *Payment verification failed* | Bad Razorpay signature, or the Stripe intent has not succeeded |
| *Razorpay not configured* / *Stripe not configured* | The gateway was switched off after the app loaded the options |
| *Could not start payment* | The gateway API refused the request (check the keys and currency) |

## Pay at restaurant

With **Pay at restaurant**, the app sends `payAtRestaurant: true` and no `payment`. The order is saved **unpaid**. The order detail shows *Payment · Pay at restaurant*. Staff collect the money at the counter, or for table orders in the POS (**Payment** / **Close & pay**).

## No gateway configured

When no gateway is configured, orders and gift cards go through **without payment** (demo mode). The checkout then shows only **Pay at restaurant**. A gift card is issued straight away with payment status *PAID*. Configure at least one gateway before you go live.

## Currency

Razorpay charges in `RAZORPAY_CURRENCY` (default `INR`) and Stripe in `STRIPE_CURRENCY` (default `usd`). Amounts are sent in major units and converted to minor units on the server. The app formats prices in USD ([change it](doc:app/branding#currency-symbol)). Make sure the currencies match.

## Before going live

- [ ] Live keys set on the backend and the function redeployed
- [ ] `SITE_ORIGIN` is your real website domain, and that domain is allowed in the Razorpay / Stripe dashboard
- [ ] Test payment in sandbox: Razorpay test card `4111 1111 1111 1111` or UPI `success@razorpay`, Stripe test card `4242 4242 4242 4242` (any future date, any CVC)
- [ ] The order appears in Admin → Orders with the provider and the payment reference

**Next:** [Run the App →](doc:app/run-the-app)
