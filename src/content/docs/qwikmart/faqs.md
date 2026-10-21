---
title: FAQs
description: Quick answers to common setup, Firebase, payment and Play Store questions.
---

## General

### Do I need a server or VPS?
No. QwikMart runs on Firebase (Cloud Functions, Firestore, App Hosting). You only need a Google account with billing enabled (Blaze plan). A VPS is optional if you prefer to host the website and panel yourself.

### Do I need PHP, MySQL or cron jobs?
No. There is no PHP, no MySQL and no cron — everything is serverless.

### Can I use QwikMart outside India?
Yes. Add your countries, currencies and zones; enable a gateway that works in your region (Stripe, PayPal, Paystack, PayTabs, Midtrans…). Choose the Firestore and functions region closest to your customers ([Requirements](doc:installation/requirements#choose-a-region)).

### Is iOS supported?
The Flutter apps are iOS-ready. Register the iOS apps in Firebase (`flutterfire configure`), add `GoogleService-Info.plist`, an APNs key, then build and publish from a Mac with Xcode.

## Firebase

### Why is the Blaze plan required?
Cloud Functions and outgoing network calls (payment gateways, e-mail, AI) are only available on Blaze. You still get the free quota. See [costs](doc:admin/third-party-costs).

### The first functions deploy failed with a permission / Eventarc error.
Normal on a new project — Google is still creating service accounts. Wait 2–3 minutes and deploy again.

### A list shows "needs a Firestore index".
The composite indexes are still building, or were not deployed. Run `npx firebase deploy --only firestore:indexes` and wait until all indexes are *Enabled*.

### Every action fails with "internal" or "not-found".
The functions region in the client does not match the deployed region, or functions are not deployed. See [Functions region](doc:installation/environment-configuration#functions-region).

## Login & OTP

### Phone OTP opens a browser / reCAPTCHA page on Android.
Add the SHA-1 and SHA-256 of the signing key (debug, upload and Play App Signing) to the Android app in Firebase. See [Login Methods](doc:app-customer/auth-methods).

### "SMS verification is not available for this region".
Allow the country in Firebase → Authentication → Settings → **SMS region policy**.

### How do I create the first admin?
Follow [Create the Super Admin](doc:installation/super-admin).

## Payments

### Online payments stay "Payment pending".
Check the gateway keys and mode (Sandbox/Live) in System Settings → Payment Gateways and look at the Functions logs for `verifyPayment`. With Razorpay test keys use UPI `success@razorpay`.

### Can customers pay with Cash on Delivery only?
Yes — disable all online gateways and keep COD (and Wallet) enabled.

## E-mail

### Test e-mail fails with "530 Authentication Required".
Gmail needs an **App Password**, not your normal password. See [SMTP / Email](doc:admin/smtp-settings).

## Google Play

### "This package name is already in use".
Another developer owns that application ID. Choose a different one before your first upload — see [Change Package Name](doc:app-customer/change-package-name).

### Which app should I publish first?
The Customer App — its review is simpler. The Delivery App needs the foreground-service location declaration with a video ([Live Location](doc:app-delivery/location-tracking)); riders can use a closed test track meanwhile.

### Which URLs does Google Play need?
Privacy policy (`/pages/privacy`) and a delete-account page (`/pages/delete-account`) on your website — edit them in Admin → Pages.

### Does a personal developer account need a closed test?
Yes — personal accounts created after November 2023 need 12 testers for 14 days before production. Organisation accounts do not.

## Customisation

### Where do I change colours, logo and app name?
Apps: [Change App Name](doc:app-customer/change-app-name), [Logo](doc:app-customer/change-app-logo), [Theme](doc:app-customer/change-theme). Website: [Configuration & Theming](doc:web/configuration).

### How do I add a language?
See [Manage Languages](doc:app-customer/languages) and add it in Admin → Languages.
