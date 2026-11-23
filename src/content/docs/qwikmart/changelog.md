---
title: Changelog
description: Release history of QwikMart.
---

## v1.0.2 — 23 November 2026

Customer App `1.0.4` · Delivery Boy App `1.0.2`

- **Languages managed from the Admin Panel:** add any of 36 supported languages (or a custom code) in **Admin → Settings → Languages** and translate the **Website**, **Customer App** and **Delivery Boy App** texts in the new translation editor (key/value and JSON views, import / export JSON, copy missing keys from English). The website and both apps load languages and texts from Firestore at start-up — **no rebuild or store update needed**. Admin texts override the built-in ones; missing texts fall back to English. See [Languages & Translations](doc:admin/languages).
- **Language pickers** in the website top bar / profile and in **Profile → Language** in both apps now list the languages that are active in the Admin Panel (with RTL support).
- **Per-country currency:** checkout and wallet top-ups are charged in the customer's country currency; order e-mails, notifications and COD limits use the order's country symbol; Admin order, return and customer screens show each record in its own currency; the Delivery Boy App shows amounts in the currency of the rider's country.
- **Per-country time zone:** peak-hour surge, promo-code time windows, report days and daily sales statistics follow the country's time zone instead of always IST.
- **Home Builder:** redesigned live preview that matches the storefront (mobile / tablet / desktop), plus **category colour** and **category icon** for the category strip.
- **Content:** updated Privacy Policy and other CMS pages.
- **Docs:** new pages [Languages & Translations](doc:admin/languages) and [Delivery Boy Panel](doc:admin/delivery-panel).

:::note Upgrading to v1.0.2
Redeploy the Cloud Functions (`cd firebase && npx firebase deploy --only functions,firestore`), then redeploy the Admin Panel and website, and publish the new app builds so users get the admin-managed language pickers.
:::

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
