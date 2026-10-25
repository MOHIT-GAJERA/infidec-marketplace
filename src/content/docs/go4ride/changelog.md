---
title: Changelog
description: Release history of Go4Ride.
---

## v1.0.0 — 24 October 2026

First public release of **Go4Ride**: a complete taxi and ride-hailing platform with a Customer App, a Driver App, a Flutter Web Admin Panel and a serverless Firebase backend. No VPS, PHP or MySQL.

### Platform

- **Pub workspace monorepo**: `apps/customer_app`, `apps/driver_app`, `apps/admin_panel`, shared `packages/core` (models, enums), `packages/data` (repositories), `packages/services` (maps, location, push, payments) and `packages/ui_kit` (white-label theme and widgets), plus `functions`, `firebase` and `tests/rules`.
- **Firebase backend**: Authentication (phone OTP for the apps, e-mail and password for the admin), Cloud Firestore, Realtime Database for live driver positions (`driver_locations`), Cloud Storage (KYC documents, support photos, admin uploads), **Cloud Functions v2** in TypeScript on Node 20, and Firebase Cloud Messaging.
- **Roles** as custom claims: admin, staff, dispatcher, driver and customer. Staff and dispatchers are created by the admin through Cloud Functions (`createStaffUser`, `updateStaff`, `deleteStaff`) with per-module permissions.
- **White-label branding** through one `BrandConfig` per app: name, colours, currency, dial code. Light and dark themes in every app.

### Customer App (Android & iOS)

- Phone login with a 6-digit SMS code and first-time profile.
- Home with live map, promo banners and admin-managed services: **City cab**, **Intercity sharing**, **Intercity personal**, **Rental** (hourly packages) and **Parcel** (receiver details).
- Place search, GPS pickup, route-based fare estimate per **vehicle type**, promo codes, *female drivers only* option.
- Payment by **Cash**, **Go4Ride Wallet** or online with **Razorpay** (UPI, cards, netbanking), **Stripe** Checkout or **PayPal**, all through hosted checkouts verified on the server.
- Live ride screen: status timeline, driver card with call button, driver position on the map, **4-digit start OTP**, cancellation with admin-managed reasons, **SOS** alert with emergency call.
- Wallet with top-ups inside admin limits and a full transaction list. Ride history.
- Help centre with topics, tickets with a photo, live chat with support, contact channels, About / Privacy / Terms pages.
- Live **maintenance mode** and **minimum version** (optional or forced update) gates.

### Driver App (Android & iOS)

- Onboarding slides, phone login, vehicle registration from the admin catalogue (types, brands, models).
- **KYC**: admin-defined document types with front / back photos and expiry dates, per-document status, rejection reasons and re-upload.
- Going online with checks for approval, location permission and **minimum wallet**. Live location to the Realtime Database.
- Incoming requests with an accept window, atomic accept, trip panel (navigate to pickup, arrived with waiting timer, OTP-verified start, hold, complete), driver cancellation reasons, SOS.
- Earnings and wallet, withdrawal requests, **subscription plans** paid from the wallet, trip history, support tickets and chat.

### Admin Panel (Flutter Web)

- Premium black and white interface with light / dark mode and a collapsible sidebar.
- Dashboard, bookings per service, dispatch monitor and dispatch users, SOS alerts, customers, drivers with KYC review, online drivers map, support overview and tickets.
- Catalogue: services, zones with local fares and surge, rental packages, vehicle types, brands and models, driver documents, with **Load defaults** on empty pages.
- Growth: offers, banners, onboarding, push notifications, e-mail templates, achievement badges.
- Finance: subscription plans and history, payout requests.
- Roles and employees. Settings: general, app theme and versions, app settings, maps, maintenance, business model (commission, cancellation charge, ride OTP), driver and ride rules, surge, payment methods and secrets, SMTP, landing page, contact.

### Backend

- `onRideCreated` dispatch to online, approved, unblocked drivers inside the search radius with enough wallet, `noDriversFound` when nobody is available, `expireRideRequests` every minute.
- Settlement once per ride: commission (percentage or fixed) unless a paid subscription waives it, wallet movements for cash, wallet and online rides, ledger rows in `transactions`.
- Late cancellation fee charged to the rider's wallet and paid to the driver.
- Payments: `createPayment`, `paymentReturn` (Razorpay signature and link status, Stripe session status, PayPal capture) and `checkPayment`, idempotent. Gateway secrets in `secure_settings/payment`, readable only by admins and functions.
- `reviewKyc`, `approveWithdrawal`, `purchaseSubscription`, `sendBroadcast`, daily analytics rollup.
- Security rules for Firestore, Storage and the Realtime Database, with rules tests. Jest tests for pricing, Dart tests for the apps.

### Known limitations in 1.0.0

- The apps do not save the FCM device token yet, so personal ride pushes need the small addition in [Push Notifications](doc:app-customer/notifications). Topic broadcasts work.
- The fare charged is the in-app estimate from the vehicle type. Zone fares and surge are used by `calculateFare`, which the Customer App does not call yet.
- No in-app account deletion, rating screen, driver wallet top-up or driver bidding screen.
- The driver shares location only while the app is in the foreground.

## Updating an existing installation

1. Back up Firestore ([Backups & Monitoring](doc:installation/backups)) and commit your own changes in Git.
2. Merge the new version. Keep your `secret/app_keys.env`, `firebase_options.dart`, `google-services.json`, `GoogleService-Info.plist`, `.firebaserc`, both `android/key.properties`, the keystores and your branding assets.
3. Backend: `cd functions && npm install && npm run build`, then `firebase deploy --only firestore:rules,firestore:indexes,storage,database,functions`.
4. Admin Panel: build and deploy to Hosting ([Hosting, Domain & SSL](doc:installation/hosting)).
5. Apps: increase `version:` in each `pubspec.yaml`, build the bundles and upload them ([Customer App release](doc:app-customer/deployment), [Driver App release](doc:app-driver/deployment)).
