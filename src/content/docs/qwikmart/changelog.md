---
title: Changelog
description: Release history of QwikMart.
---

## v1.0.1 — 20 October 2026

- **Customer App:** native **Razorpay** checkout (UPI apps, cards, net banking, wallets) for orders and wallet top-ups, with server-side signature verification.
- **Customer App:** R8 keep rules for Razorpay in release builds.
- **Website:** **Contact Us** popup form in the footer with ticket numbers, e-mail notification to support and acknowledgement to the sender.
- **Admin Panel:** new **Contact Messages** screen (status, notes, reply by e-mail); **Delete Account** page in Pages.
- **Content:** complete About, Privacy, Terms, Return & Refund and Delete Account pages.
- **Delivery App:** in-app account deletion; live location through a foreground service while online.
- Website set to light mode; cookie banner text matches the privacy policy.

## v1.0.0 — 14 October 2026

First release:

- Firebase backend (Cloud Functions, Firestore, Authentication, Storage, Cloud Messaging).
- Super Admin, Store and Delivery Boy web panels.
- Next.js customer website.
- Flutter Customer App and Delivery Boy App (Android).
- Quick commerce + eCommerce, multi-store, multi-zone, multi-country.
- Payments: Razorpay, Stripe, PayPal, Cashfree, PhonePe, Paystack, PayTabs, Midtrans, Wallet, COD.
- Wallet, Refer & Earn, promo codes, returns, support chat, push / e-mail / SMS notifications, Google Gemini AI content.

## Updating an existing installation

1. Back up Firestore (see [Backups](doc:installation/backups)) and commit your own changes in Git.
2. Merge the new version into your repository (keep your configuration files: `.env.local`, `apphosting.yaml`, `firebase_options.dart`, `google-services.json`, `key.properties`, branding assets).
3. `cd firebase && npx firebase deploy --only functions,firestore,storage`
4. Push to deploy the panel and website.
5. Increase the app versions in `pubspec.yaml`, build and upload to Google Play.
