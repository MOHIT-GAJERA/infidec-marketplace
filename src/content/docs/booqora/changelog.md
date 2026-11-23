---
title: Changelog
description: Release history of Booqora.
---

## v1.0.0 — 23 November 2026

First release of Booqora: the Rental Platform, the Online Store, the Mobile App, the Marketing Website and the Firebase backend.

**Backend (Firebase)**

- Cloud Functions v2 in JavaScript (Node 22, `asia-south1`): `paymentConfig`, `createPayment`, `verifyPayment` and `sendEmail` (callable) and the `onOnlineOrder` Firestore trigger ([Cloud Functions Reference](doc:api/cloud-functions)).
- Payment and SMTP credentials stored as Secret Manager secrets (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`); non-secret options such as currencies, `PAYPAL_ENV`, `MAIL_HOST` and `MAIL_PORT` in `functions/.env`.
- Server-side payment verification with idempotent recording on the order, test / live mode detection and per-store currency checks.
- Branded HTML e-mails with an `emailLog` per workspace.
- Firestore security rules and indexes; Storage rules based on uploader metadata ([Security Rules](doc:api/security-rules)).

**Rental Platform (Flutter Web)**

- E-mail sign-up, login and password reset, workspace onboarding and a step-by-step setup guide.
- Dashboard, orders with the reserve → pick up → return flow, rental calendar, customers, coupons.
- Inventory: products, trackable stock items with their own identifiers, bundles, collections, pricing structures, downtime, live availability including late returns and shortages.
- Quotes, contracts, invoices and packing slips as branded documents.
- Reports: performance, fulfilment, products, availability, customers, coupons and activity.
- Settings: general, rental, pricing, taxes, locations, custom fields, documents, e-mails, payment providers, team, translations, security and billing (Starter, Pro and Business plans with a 14-day trial).
- App Store (integrations catalogue) and **Bora**, a rule-based assistant that answers from live workspace data.

**Online Store**

- Public booking page at `/s/<workspace-slug>` with rental dates, cart, checkout, online payment and optional terms acceptance. Bookings arrive as draft orders that staff reserve.
- Online payments with Razorpay, Stripe and PayPal and a payment return page (`/pay/return`).
- Booking confirmation e-mails to the customer and the store.

**Mobile App (Flutter, Android & iOS)**

- Package `io.booqora.booqora_mobile` (iOS bundle `io.booqora.booqoraMobile`), version `1.0.0+1`, same Firebase project and data as the platform.
- Native splash, four-page onboarding, intro and sign-in; Home, Orders, Inventory and More tabs with a centre quick-create button.
- Native Razorpay checkout, Stripe payment links, camera barcode scanning, PDF invoices with share and print, calendar agenda and documents.
- Release signing, Play Store listing text, graphics and screenshots in `release/play-store/` ([Google Play Listing & Review](doc:app/play-console)).

**Marketing Website (Next.js)**

- Next.js 16, Tailwind CSS 4 static export on Firebase Hosting: home, 11 feature pages, 6 industry pages, pricing, integrations, mobile app, about, contact and three rental guides.
- Metadata, JSON-LD, generated `sitemap.xml` and `robots.txt`, and login / sign-up links to the platform ([Website Overview](doc:web/overview)).

**Tooling**

- GitHub Actions workflow that analyses, builds and deploys the Rental Platform to Firebase Hosting on every push to `main` ([Auto-Deploy with GitHub Actions](doc:installation/ci-cd)).

### Milestones

| Date | Milestone |
|---|---|
| 17 November 2026 | Rental Platform (Flutter Web + Firebase) and the CI deploy workflow |
| 18 November 2026 | Payments (Razorpay, Stripe, PayPal) and e-mail via Cloud Functions |
| 19 November 2026 | Mobile App for Android and iOS, device QA fixes and the privacy policy page |
| 20 November 2026 | Marketing Website |
| 23 November 2026 | v1.0.0 released with this documentation |

## Updating an existing installation

1. Back up Firestore ([Backups & Monitoring](doc:installation/backups)) and commit your own changes in Git.
2. Merge the new release into your copy, keeping your `firebase_options.dart`, `google-services.json`, `GoogleService-Info.plist`, `.firebaserc` files, `functions/.env`, `android/key.properties` and brand assets.
3. Deploy rules, indexes and functions from `booqora_platform/`: `firebase deploy --only firestore,storage,functions --project <your-project-id>` ([Deploy Functions, Rules & Indexes](doc:installation/backend-deploy)).
4. Rebuild and deploy the Rental Platform ([Build & Deploy to Hosting](doc:installation/hosting)) and the Marketing Website ([Build & Deploy](doc:web/deployment)).
5. Raise the Mobile App version in `pubspec.yaml`, build a new bundle and upload it to Play ([Release Build & Keystore](doc:app/deployment)).
