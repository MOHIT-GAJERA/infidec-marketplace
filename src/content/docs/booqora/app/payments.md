---
title: Payments in the App
description: Collect payments from the Booqora Mobile App with the native Razorpay checkout, Stripe and PayPal payment links, or by recording cash, card, bank and UPI payments.
---

Every order in the Mobile App has a **Payments** section with two buttons:

- **Add payment**: record a payment you received outside the app (cash, card machine, bank transfer, UPI).
- **Collect online**: take the payment through Razorpay, or create a Stripe or PayPal payment link.

Online payments use the same Cloud Functions as the Rental Platform and the Online Store. **No payment keys are stored in the app.** The keys live in Cloud Functions secrets and every payment is verified on the server before the order is marked paid.

![Collect online payment](/docs/booqora/images/app-collect-payment.webp "Collect online payment: available providers")
![Payments on an order](/docs/booqora/images/app-payments-list.webp "Payments recorded on an order")

## Record a manual payment

**Add payment** opens a sheet with:

| Field | Options |
|---|---|
| Type | **Charge** (money in), **Refund** (money out), **Deposit** (security deposit held) |
| Method | **Cash**, **Card**, **Bank transfer**, **UPI** |
| Amount | Pre-filled with the amount due |
| Note | Optional, for example a UPI reference |

Tap **Record payment** (or **Record refund**). The order's paid and due amounts and its payment status (`payment_due`, `partially_paid`, `paid`, `overpaid`, `process_deposit`) update immediately on the phone and on the web.

## Collect online

**Collect online** opens the *Collect online payment* sheet. The app first calls the `paymentConfig` function, which returns each provider's status for this workspace:

- **Available** providers are listed with their currency.
- Unavailable providers are listed underneath with the reason, for example "Stripe keys are not configured on the server", "Razorpay is set up for INR; this store uses USD" or "turned off in Settings → Payment providers".
- If any available provider uses test keys, the sheet shows *Test mode — use test cards or sandbox accounts*.

The **Amount** field is pre-filled with the amount due. You can collect part of it; the server caps the amount at what is due.

### Razorpay: Charge now (native checkout)

![Razorpay checkout](/docs/booqora/images/app-razorpay.webp "Native Razorpay checkout")

Razorpay uses the native SDK (`razorpay_flutter`). Tap **Charge now** and hand the phone to the customer, who pays with UPI, card, netbanking or a wallet.

:::steps
### Create the payment
The app calls `createPayment` with the order, the amount and `purpose: 'custom'`. The function creates a Razorpay order and a payment session and returns the public key ID, amount, currency and customer prefill.

### Pay in the Razorpay sheet
The app opens the native checkout with that data and the brand colour. UPI apps installed on the phone (Google Pay, PhonePe, Paytm) can be used directly; the Android manifest and the iOS `LSApplicationQueriesSchemes` already allow it.

### Verify on the server
On success the app sends the Razorpay payment ID and signature to `verifyPayment`. The function checks the HMAC signature with the secret key, records the payment on the order and e-mails the customer a receipt. Only then does the app show *Payment of … received via Razorpay*.
:::

If the customer cancels, nothing is recorded and the sheet stays open so you can try again or choose another provider. If they pick an external wallet, the app shows *Continue in …* with the wallet name.

### Stripe and PayPal: Create link

![Stripe payment link](/docs/booqora/images/app-stripe-link.webp "Payment link created")
![Stripe checkout page](/docs/booqora/images/app-stripe-page.webp "Stripe Checkout in the in-app browser")

Stripe and PayPal use **hosted checkout pages**. Tap **Create link** and the app calls `createPayment`, which returns a Stripe Checkout or PayPal URL. The link card offers:

- **Share**: a ready-written message with the link through the system share sheet (WhatsApp, SMS, e-mail …).
- **Open**: opens the page in a **secure in-app browser** (Chrome Custom Tabs on Android, Safari View Controller on iOS), so the customer can pay on your phone. If no in-app browser is available, the system browser is used.
- **Copy link**.
- **Email to customer**: sends the link from your workspace SMTP through the `sendEmail` function.

After paying, the customer lands on the Rental Platform's return page (`/pay/return`). That page calls `verifyPayment`, which retrieves the Stripe session or captures the PayPal order on the server and records the payment. The order in the app updates live through Firestore; there is no need to refresh.

:::warning PayPal and currencies
PayPal is set up for one currency, USD by default (`PAYPAL_CURRENCY`). It is unavailable for stores in INR. Razorpay is INR by default (`RAZORPAY_CURRENCY`). Stripe charges in the store currency.
:::

## Configuration checklist

- [x] Provider keys set as Cloud Functions secrets and the functions deployed ([Payment Gateways](doc:admin/payment-gateways))
- [x] Provider switched on in the app or web under **Settings → Payments**
- [x] `returnUrl` in `lib/data/payments.dart` points to your platform domain ([Firebase Setup](doc:app/firebase-setup))
- [x] Functions region in `lib/data/payments.dart` matches your deployment
- [x] Test with test keys first, then switch to live keys before launch

The full server-side sequence, including the payment session document and receipts, is described in [Payment Flow](doc:api/payment-flow).

## Release builds

`android/app/proguard-rules.pro` keeps the Razorpay classes and the Google Pay intent classes so R8 does not strip them. Keep these rules if you edit the file; without them the checkout can crash in release builds only.

**Next:** [Barcode Scanning →](doc:app/barcode-scanning)
