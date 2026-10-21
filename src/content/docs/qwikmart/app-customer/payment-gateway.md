---
title: Payment Gateway (Razorpay)
description: Native Razorpay checkout in the app, plus COD, Wallet and redirect gateways — all configured in the Admin Panel.
---

Payment methods and keys are managed in **Admin → System Settings → Payment Gateways** — nothing to change in the app code. The checkout screen shows every method you enable.

![Checkout](/docs/qwikmart/images/app-customer-cart.webp "Checkout with payment methods")
![Wallet](/docs/qwikmart/images/app-customer-wallet.webp "Wallet top-up")

## Razorpay — native checkout

When the customer chooses Razorpay, the app opens Razorpay's **native payment sheet** (UPI apps, cards, net banking, wallets) using the `razorpay_flutter` SDK:

1. `placeOrder` returns the Razorpay order ID and your **public** Key ID.
2. The sheet opens (`lib/core/razorpay_checkout.dart`).
3. On success the app sends the payment ID and **signature** to `verifyPayment`; the server verifies it with your secret and marks the order *Paid*.
4. If the customer closes the sheet, the order stays *Payment pending* — they see *"Payment not completed. You can pay later from My Orders."*

Wallet top-ups use the same sheet (`walletRecharge` → `verifyWalletRecharge`).

## Release builds (R8)

Razorpay needs keep rules so code shrinking does not break it. They are already in `android/app/proguard-rules.pro` and referenced from the release build type:

```kts title="android/app/build.gradle.kts"
buildTypes {
    release {
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```

## Other gateways

Stripe, PayPal, Cashfree, PhonePe, Paystack, PayTabs and Midtrans open the gateway's hosted page and return to the app, which then verifies the payment. Cash on Delivery and Wallet complete instantly.

## Test

With Razorpay in **Sandbox** mode use UPI `success@razorpay` or card `4111 1111 1111 1111` (any future date, any CVV). See [Payment Gateways](doc:admin/payment-gateways).

**Next:** [Push Notifications →](doc:app-customer/notifications)
