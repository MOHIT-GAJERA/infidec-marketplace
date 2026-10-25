---
title: FAQs
description: Quick answers to common Go4Ride questions about setup, Firebase, Google Maps, payments, driver KYC, pricing and the Play Store.
---

## General

### Do I need a server, VPS, PHP or MySQL?
No. Go4Ride runs entirely on Firebase: Authentication, Firestore, Realtime Database, Storage, Cloud Functions and Hosting for the Admin Panel. You need a Google account with billing enabled (Blaze plan). See [Requirements](doc:installation/requirements).

### What exactly is included?
Three Flutter apps (Customer App, Driver App, Admin Panel for the web), the Cloud Functions source in TypeScript, Firestore / Storage / Realtime Database rules and indexes, shared packages and tests. See [Introduction](doc:intro).

### Are the rider and driver apps one app or two?
Two apps with two package names (`com.go4ride.customer`, `com.go4ride.driver` by default) and two Play Store listings. They share one Firebase project.

### Is iOS supported?
Yes. Both apps build for iOS 14+. You need a Mac with Xcode, an Apple Developer account and an APNs key for push and phone sign-in. See the iOS sections of [Customer App release](doc:app-customer/deployment) and [Driver App release](doc:app-driver/deployment).

### Can I use it outside India?
Yes. Change the dial code and currency in each app's `BrandConfig` (`theme_controller.dart`), the region defaults in Admin → Settings → General, and use Stripe or PayPal where Razorpay is not available. Phone OTP works worldwide; set the SMS region policy in Firebase Auth.

## Firebase

### Why is the Blaze plan required?
Cloud Functions, outgoing calls to payment gateways and Google Maps billing need it. You still get the free quotas. See [Third-Party Service Costs](doc:admin/third-party-costs).

### Phone login opens a reCAPTCHA page or never sends the SMS.
Add the SHA-1 and SHA-256 of the key that signed the build to the right Firebase Android app: debug key for `flutter run`, upload key for release builds, and the Play **App signing** key for Play installs ([Phone Login (OTP)](doc:app-customer/auth)).

### How do I test without real SMS?
Add test numbers with fixed codes in Firebase → Authentication → Sign-in method → Phone, or run against the Auth emulator, which prints the code.

### The app shows another project's data.
`firebase_options.dart` still belongs to the demo project. Run `flutterfire configure --project=your-project-id` inside `apps/customer_app` and `apps/driver_app` ([Firebase Setup](doc:app-customer/firebase-setup)).

## Google Maps

### Where does the Maps key go?
In one git-ignored file, `secret/app_keys.env` (`MAPS_API_KEY=…`). Android reads it in Gradle, iOS through the xcconfig files, and Dart through `--dart-define-from-file=../../secret/app_keys.env`, which you must pass on every run and build ([Google Maps & Location](doc:app-customer/maps-location)).

### The map works but place search fails.
Either the Places / Geocoding / Directions APIs are not enabled, or the key has an **Android apps** restriction. Those REST calls are made from Dart without the Android headers, so Google rejects them. Use API restrictions for that key, or a second key.

### Which APIs do I enable?
Maps SDK for Android, Maps SDK for iOS, Places API, Geocoding API and Directions API.

## Rides & pricing

### No driver ever receives my test ride.
The driver must be KYC-approved, online, not blocked, at or above **Minimum driver wallet to accept rides**, and within the **Search radius** of the pickup (default 5 km). Otherwise the ride ends as *No drivers found*. On an emulator, set the GPS position near the pickup.

### Why does the fare not change with zones or surge?
The Customer App calculates the fare from the selected vehicle type (base, per km, per minute, minimum) and saves it with the ride. Zones and surge are used by the `calculateFare` function, which the app does not call in 1.0.0 ([Booking a Ride](doc:app-customer/booking)).

### How do I switch off the ride OTP?
Admin → Settings → Business model → **Require OTP to start a ride**. New bookings then have no code and drivers start the trip directly.

### The rider was not charged a cancellation fee.
The fee applies only when the **rider** cancels **after** a driver accepted and **after** the free window (120 s by default). Save the Business model settings once, otherwise no charge is configured ([Cancellation & Fees](doc:app-customer/cancellation)).

### Does driver bidding work?
Not in 1.0.0. The Driver App has no bidding screen, so switch **Driver bidding** off in Admin → Services.

## Payments

### Which payment methods are supported?
Cash, the Go4Ride wallet, and online payments through hosted checkouts: Razorpay (UPI, cards, netbanking), Stripe and PayPal. Switch them on and add the keys in Admin → Settings → Payment methods and Payment secrets ([Payment Gateways](doc:admin/payment-gateways)).

### When does a card ride get paid?
After completion. The rider taps **Pay** on the ride screen, pays on the gateway page, and the ride is marked paid once the server has verified the payment ([Wallet & Payments](doc:app-customer/payments)).

### Stripe charges a strange amount in USD.
Stripe and PayPal accounts in USD get the INR fare converted with `usdPerInr` (default 0.012). Update the rate or use an INR account.

### Which test cards can I use?
Stripe `4242 4242 4242 4242` (success) and `4000 0000 0000 0002` (decline). Razorpay test mode shows a mock bank page with **Success** and **Failure**. PayPal needs a sandbox buyer account.

## Drivers

### How do I approve a driver?
Admin → Drivers → Pending approval → open the driver → approve each document, then approve the driver ([Drivers & KYC](doc:admin/drivers)). Auto-approval is not available in 1.0.0.

### How do drivers get paid?
Online and wallet rides credit the driver wallet. Drivers request a withdrawal in the app, your team approves it in **Payout requests**, and you transfer the money yourself ([Earnings, Wallet & Payouts](doc:app-driver/earnings)).

### A driver's wallet is negative and they cannot go online.
Cash rides deduct your commission from the wallet. Collect the amount from the driver, then correct `walletBalance` (Firestore console) or lower the minimum wallet in Driver & ride settings.

### Do subscriptions reduce the commission?
An active **paid** plan waives the commission completely until it expires or reaches its ride limit. The free plan keeps standard commission ([Subscription Plans](doc:app-driver/subscriptions)).

## Notifications

### Riders do not get "driver accepted" pushes.
The apps do not save the FCM token in 1.0.0, so only broadcasts to topics arrive. Add the token code shown in [Push Notifications](doc:app-customer/notifications). The ride screen updates live in any case.

## Google Play

### Do I need a closed test with 12 testers?
Only for new **personal** developer accounts. An **organization** account (with a D-U-N-S number) can publish to production directly. We still recommend internal and closed testing first.

### Does the driver app need the background location declaration?
No. It requests only foreground location and has no background location permission ([Driver App release](doc:app-driver/deployment)).

### What does the reviewer need?
A test phone number with a fixed code for each app. For the Driver App, that number must belong to a driver you have **already approved**.

### Google says the app needs account deletion.
Both apps need an in-app deletion path and a public web page for deletion requests. The apps do not include it in 1.0.0, so add it before you submit.

## Customisation

### Where do I change the name, logo and colours?
Customer App: [App Name, Logo & Splash](doc:app-customer/branding) and [Theme Colours & Fonts](doc:app-customer/change-theme). Driver App: [App Name, Logo & Colour](doc:app-driver/branding). The *App theme* colours in the Admin Panel do not change the apps in 1.0.0.
