---
title: Payment Gateways
description: Enable Cash on Delivery, Wallet and online gateways such as Razorpay, Stripe, PayPal, Cashfree, PhonePe, Paystack, PayTabs and Midtrans.
---

**Admin → System Settings → Payment Gateways** (Super Admin only).

![Payment gateways](/docs/qwikmart/images/admin-settings-payment.jpg "System Settings → Payment Gateways")

## Supported methods

| Method | Keys you need | App experience |
|---|---|---|
| **Cash on Delivery** | — | Rider collects cash; set the **COD maximum order amount** on this tab (0 = no limit) |
| **Wallet** | — | Pays from the QwikMart Wallet balance |
| **Razorpay** | Key ID, Key Secret | **Native Razorpay checkout** in the Android/iOS app (UPI apps, cards, net banking, wallets); Razorpay Checkout on the website |
| **Stripe** | Publishable key, Secret key, Webhook secret | Stripe Payment Element (website), hosted page (app) |
| **PayPal** | Client ID, Client Secret | Redirect to PayPal |
| **Cashfree** | App ID, Secret Key | Cashfree checkout |
| **PhonePe** | Merchant ID, Salt Key, Salt Index | Redirect to PhonePe |
| **Paystack** | Public Key, Secret Key | Redirect |
| **PayTabs** | Profile ID, Server Key, Region | Redirect |
| **Midtrans** | Client Key, Server Key | Redirect |

For every gateway you choose **Enabled** and a **mode** — *Sandbox* (test keys) or *Live*.

## How payments are secured

1. The app calls `placeOrder`. The server recalculates the total and creates the gateway order with your **secret key** (stored in `settings/private_payment`, never sent to the app).
2. The app opens the gateway checkout with only the **public key** and the gateway order ID.
3. After payment the app sends the gateway's payment ID and signature to `verifyPayment`; the server verifies the **signature** with the secret before marking the order *Paid*.
4. Wallet top-ups follow the same flow (`walletRecharge` → `verifyWalletRecharge`).

A customer who closes the payment screen keeps the order as *Payment pending*; they can pay later from **My Orders** or cancel it, and you can cancel or delete pending orders in **Orders**.

## Set up Razorpay (India)

:::steps
### Create the account
Sign up at [razorpay.com](https://razorpay.com), complete KYC for live payments. Test mode works immediately.

### Get the keys
Razorpay Dashboard → **Account & Settings → API Keys** → *Generate Key*. Copy the **Key ID** (`rzp_test_…` / `rzp_live_…`) and **Key Secret**.

### Save them in QwikMart
Payment Gateways → **Razorpay** → paste Key ID and Key Secret → mode **Sandbox** (for `rzp_test_` keys) → **Enabled** → Save.

### Test
Place an order with Razorpay. Test UPI ID: `success@razorpay` (or `failure@razorpay`); test card `4111 1111 1111 1111`, any future expiry, any CVV. Check the order shows *Paid* and the payment appears in Razorpay Dashboard → Test mode → Payments.

### Go live
Replace the keys with `rzp_live_…` keys, set mode **Live** and place one small real payment.
:::

:::warning Keep the secret secret
Never paste the Key Secret into app code, `.env` files or screenshots. If it leaks, regenerate it in the Razorpay dashboard and update it here.
:::

## Refunds

Refunds of cancelled online orders and approved returns go to the customer's **Wallet** instantly by default. When processing a return you can choose *original payment method* instead — then issue the refund in your gateway dashboard. See [Returns & Refunds](doc:admin/returns).
