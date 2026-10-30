---
title: Changelog
description: Release history of Go4Market.
---

## v1.0.0 — 29 October 2026

First release of Go4Market.

**Backend (Firebase)**

- Cloud Functions v2 in TypeScript (Node 22, `asia-south1`): checkout quote, order placement, payments, wallet, membership, returns, withdrawals, fund transfers, cash settlement, rider assignment, POS, reports, abandoned carts, AI descriptions, campaigns, system status and the XML sitemap.
- Triggers and schedules: stats aggregation, notifications, e-mail, SMS queue, product keywords, ratings, live rider location, attribute alerts, daily subscriptions, hourly pending-order cleanup, daily cart reminders, monthly salaries, weekly Firestore backup.
- Firestore and Storage security rules; about 130 composite indexes.
- **v1.1 panel integration**: seller-owned riders (`createSellerRider`), `riderLocation` on orders, membership from the wallet, refunds to the original payment, payout/credit transfers, auto-assign, rider pay defaults, communication settings, admin e-mail sending, taxes, countries and custom fields.
- **v1.2 notifications, SMS and sign-in**: `registerPushToken` / `unregisterPushToken` with server-side topic subscription (web push), `completeProfile` for phone OTP and Google users, SMS gateway via Twilio, MSG91 or Fast2SMS with per-event templates and DLT fields.

**Web (Flutter Web on Firebase Hosting)**

- Customer website with four modules, voice search, single-screen checkout, live tracking, wallet, membership, subscriptions, blog and FAQ.
- Admin, Seller and Delivery panels from one codebase.
- **v1.3 panels**: English, Hindi, Gujarati and Arabic with full RTL; Google and phone OTP sign-in for sellers and riders; browser push.

**Apps (Flutter, Android)**

- Customer app (`com.go4market.customer`): e-mail, Google and phone OTP sign-in, guest cart, OpenStreetMap location, Razorpay native checkout, Stripe and PayPal, wallet, membership, subscriptions, returns, live tracking with delivery OTP, English and Hindi.
- Partner app (`com.go4market.partner`): Seller role with POS and camera barcode scanner, Delivery role with foreground live location, OTP delivery and cash collection, English and Hindi.

## Updating an existing installation

1. Back up Firestore ([Backups](doc:installation/backups)) and commit your own changes in Git.
2. Merge the new release into your copy, keeping your `functions/.env`, `firebase_options.dart`, `google-services.json` files and brand assets.
3. Deploy rules and indexes, then the functions: `firebase deploy --only firestore,storage,functions`.
4. Rebuild and deploy the website and panels ([Build & Deploy the Web Apps](doc:installation/hosting)).
5. Raise the app versions, build new bundles and upload them to Play.
