---
title: FAQs
description: Quick answers to common ClassiAds-Hub questions about setup, Firebase, login, moderation, payments, OTP, Maps and the Play Store.
---

## General

### Do I need a server, VPS, PHP or MySQL?
No. ClassiAds-Hub runs entirely on Firebase: Cloud Functions for the API, Firestore, Authentication, Storage, Cloud Messaging and Hosting for the website and the Admin Panel. You need a Google account with billing enabled (Blaze plan). MySQL is only needed if you run the optional one-time [Data Migration](doc:installation/data-migration). See [Requirements](doc:installation/requirements).

### What exactly is included?
The Cloud Functions API (TypeScript), the Next.js website, the Next.js Admin Panel, the Flutter app for Android and iOS, Firestore and Storage rules and indexes, the payment setup script, the migration tool and the QA scripts. See [Introduction](doc:intro).

### Is there a live demo?
Yes: the website at [classiadshub.web.app](https://classiadshub.web.app) and the Admin Panel at [classiadshub-admin.web.app](https://classiadshub-admin.web.app). Demo logins are shared on request. See [Demo Instructions](doc:admin/demo-instructions).

### Is iOS supported?
Yes, the Flutter app builds for Android and iOS. You need a Mac with Xcode and an Apple Developer account for iOS. See [App Prerequisites](doc:app/prerequisites).

### Can I use my own currency and language?
Yes. Add currencies in **Location → Currencies**, pick the default in **Settings → Default Currency Settings**, and add languages and translations in **Settings → Languages**. Packages, plans and ads each carry their own `currency_code`.

## Firebase & installation

### Why is the Blaze plan required?
Cloud Functions, Secret Manager, Cloud Scheduler and outgoing calls to the payment gateways need it. You still get the free quotas. See [Third-Party Service Costs](doc:admin/third-party-costs).

### The deploy stops and asks for `STRIPE_SECRET_KEY`.
Both functions declare the three payment secrets. Set them before the first deploy with `firebase functions:secrets:set`, using a placeholder for gateways you don't use yet. See [Deploy the Backend](doc:installation/backend-deploy#3-create-the-three-secrets).

### Every login fails with "These credentials do not match our records."
Check that `functions/.env` contains `WEB_API_KEY` with your project's Web API key and that you redeployed the functions. The API checks passwords with it. Also check that the key has no website restriction (see [Hosting](doc:installation/hosting#optional-restrict-the-browser-api-key)).

### The website or the panel shows the demo data, or login fails after I switched projects.
The Firebase web config in `web/src/lib/firebase.ts` / `admin/src/lib/firebase.ts`, or the API address in `web/src/lib/config.ts` / `admin/src/lib/api.ts`, still points at the demo project. Update them and rebuild. See [Keys & Environment](doc:installation/environment-configuration).

### The API URL answers 403 Forbidden.
Your Google Cloud organisation blocks public access to Cloud Run. The `api` function must be publicly invocable; it checks the Firebase ID token itself. Allow `allUsers` for this project in the organisation policy.

### "Continue with Google" shows an error.
Enable the Google provider in Firebase Authentication and add your website domain to **Authentication → Settings → Authorized domains**.

## Admin Panel

### How do I create the first admin?
Register an account, then change its `roles` to `["super-admin"]` in the Firestore console. See [Create the First Admin](doc:installation/super-admin).

### A staff member doesn't see a menu or gets "You do not have permission".
Their role doesn't include that module. Edit the role in **Customers & Roles → Role**. Changes apply within about 30 seconds. Editing or deleting another user's ad needs the admin role. See [Roles, Staff & Permissions](doc:admin/roles-permissions).

### Where is the setting for the checkout return address?
There is no form for it. Set `settings/general.frontend_url` to your website address in the Firestore console. See [Hosting, Domain & SSL](doc:installation/hosting#3-the-checkout-return-address).

## Ads

### A new ad doesn't appear on the website.
It is probably `pending`: **Require admin approval for new ads** is on. Approve it in **Ads Listing → All Ads → Requested**, or turn on *auto-approve* for trusted sellers in **Customers**. Ads past `expires_at` are hidden too; sellers can renew them.

### Posting fails with "An active subscription with remaining quota is required".
**Require an active package to post** is on, or **Free Ad Listing** is off. The user needs an active package that covers the category with ads left. Grant one in **Customers** (⊕ package) or change the settings.

### My custom fields don't show on the post-ad form.
Attach the field to the category (or to one of its parent categories) in **Ads Listing → Custom Fields**, and make sure the field is active.

### How long do ads stay live?
**Settings → General → Ad expiry (days)**, 30 by default. The hourly job marks expired ads and notifies the seller. See [Scheduled Jobs](doc:api/scheduled-jobs).

## Payments

### Which payment methods are supported?
On the website: **Stripe**, **Razorpay** and **PayPal** through hosted checkout pages, and manual **Bank Transfer** with receipt upload. Paystack, PhonePe, Flutterwave, PayTabs and DPO are listed but not integrated. See [Payment Gateways](doc:admin/payment-gateways).

### Why can't users buy packages in the app?
On purpose. The app has no in-app purchases, so Google Play Billing rules don't apply. Packages and featured ads are sold on the website only.

### I entered my keys under Payment Gateways → Configure, but checkout fails.
That form isn't used by the hosted gateways. Secret keys go to Secret Manager and public ids to `functions/.env`. Use `tools/payments/setup-payments.mjs` or follow [Keys & Environment](doc:installation/environment-configuration#3-payment-keys).

### A payment stays "pending".
The buyer didn't return to `/checkout/result`, or the gateway hadn't confirmed yet. The hourly `housekeeping` job checks every pending hosted payment of the last two days with the gateway. Older ones: check the gateway dashboard and confirm in **Package Management → Payment Transactions**.

### Which test cards can I use?
Stripe `4242 4242 4242 4242` with any future date and CVC. Razorpay test mode and PayPal sandbox buyers work with their own test details. See [Testing & QA Tools](doc:api/testing#testing-payments-by-hand).

### Does "Refund" in the panel return the money?
No. It marks the transaction and invoice refunded and removes the package or featured flag. Refund the payment in the gateway dashboard as well.

### Should I keep the Sandbox gateway?
Only on a test project. On a live marketplace delete its `payment_gateways` document: its public test webhook can complete any transaction while the row exists. See [Billing & Payments](doc:api/billing#sandbox-and-the-public-webhook).

## OTP & notifications

### The OTP code shows on screen. Is that normal?
Yes, while **Settings → OTP Provider Settings → Provider** is *Test mode*. v1.0.0 sends no SMS or e-mail; the other providers are settings only. Add a sender in `functions/src/lib/otp.ts` before you switch Test mode off, or password reset stops working. See [Login, OTP & Notification Settings](doc:admin/otp-notifications).

### Users don't receive push notifications.
The device must be registered (`POST /auth/devices`, done by the app after login), **Push notifications (FCM)** must be on in **Settings → Notification Settings**, and the app must use your Firebase project. For web push, add the VAPID key. See [Push Notifications](doc:app/notifications).

## Maps

### Where does the Google Maps key go?
Only the mobile app needs one. See [Google Maps & Location](doc:app/maps-location). The website and the Admin Panel need no Maps key.

## Google Play

### Does the app need Google Play Billing?
No. The app sells nothing.

### Does the app support account deletion?
Yes. Users delete their account in the app (`DELETE /auth/account`): the profile is anonymised, devices and avatar removed and the Firebase login deleted. See [Profile, Verification & Account Deletion](doc:app/profile).

### Where is the release guide?
[Release & Play Store](doc:app/deployment), based on `docs/PLAYSTORE_GUIDE.md` in the package.

## Customisation

### Where do I change the name, logo and colours?
Website: [Configuration](doc:web/configuration). Admin Panel: [Admin Panel Installation → Branding](doc:installation/admin-panel#branding). App: [App Name, Logo & Splash](doc:app/branding) and [Theme Colours & Fonts](doc:app/change-theme).

**Next:** [Introduction →](doc:intro)
