---
title: Changelog
description: Release history of Go4Foodie.
---

## v1.0.0 — 22 October 2026

First release on **Firebase**. It replaces the previous VPS version (Laravel + MySQL) with a fully serverless backend, and the website, mobile app and Admin Panel keep the same behaviour.

- **Serverless backend:** one Cloud Function `api` (Node.js 22, TypeScript, Express) in `asia-south1` serves the public website API (`/api/*`), the mobile API (`/api/mobile/*`) and the admin API (`/api/admin/*`) behind a Firebase Hosting rewrite. It keeps the same paths, JSON shapes, status codes and error messages as before.
- **Cloud Firestore** replaces MySQL (one collection per table). Password hashes move to a server-only `credentials` collection. **Cloud Storage** holds menu image uploads.
- **Admin Panel:** Flutter Web on Firebase Hosting. Login with Firebase custom tokens, a live floor with **realtime Firestore listeners**, POS, orders, menu, reservations, tables & QR, table analytics, staff, customers, gift cards & coupons, inventory, transactions, reports, outlets, notifications, audit log and settings. Light and dark theme, premium motion with reduced-motion support.
- **Customer website:** Next.js 16 (SSR) on **Firebase App Hosting**. Take-away ordering (Schedule Now / Later), table QR ordering, table booking with live availability, private events, gift cards and coupons.
- **Mobile app:** one Flutter app for Android and iOS with **Customer**, **Restaurant** (staff POS) and **Owner** modes. Release builds point to the Firebase API, and existing mobile logins keep working when `AUTH_SECRET` is kept.
- **Payments:** Razorpay (signature verified), Stripe (PaymentIntent verified) and PayPal (order verified and captured), with in-app Razorpay / Stripe and *Pay at restaurant*.
- **Emails:** branded SMTP emails for order confirmed and completed, table reservation and event request, reservation completed, gift card / coupon purchased and gift card redeemed.
- **Security:** secrets in Secret Manager (`AUTH_SECRET`, `MAIL_PASSWORD`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_SECRET`). The unauthenticated directory endpoints of the old version were removed.
- **Migration tool:** `firebase/migration/migrate.mjs` imports a `mysqldump` of the previous version into Firestore, keeping every ID (`--dry-run` to preview, `--reset` for an exact copy at cut-over). See [Data Migration](doc:installation/data-migration).

## Updating an existing installation

1. Back up Firestore (see [Backups](doc:installation/backups)) and commit your own changes in Git.
2. Merge the new version into your repository. Keep your configuration: `functions/.env.<project-id>`, `.firebaserc` files, `website/apphosting.yaml`, `website/firebase.json`, `mobile-app/android/key.properties`, the keystore, your `API_BASE_URL` / `SITE_ORIGIN` defaults and your branding assets.
3. Admin and backend: `cd admin-app && flutter build web --release`, then `cd firebase && FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions,hosting,firestore,storage`.
4. Website: `cd website && firebase deploy --only apphosting` (or push to the connected branch).
5. Mobile app: increase `version:` in `pubspec.yaml`, build the bundle and upload it to Google Play ([Release & Play Store](doc:app/deployment)).
