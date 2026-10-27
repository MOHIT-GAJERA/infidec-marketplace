---
title: Changelog
description: Release history of ClassiAds-Hub.
---

## v1.0.0 — 27 October 2026

First public release of **ClassiAds-Hub**: a complete classified ads and buy-sell marketplace with a Next.js website, a Next.js Admin Panel, a Flutter app for Android and iOS and a serverless Firebase backend. No VPS, PHP or MySQL.

### Platform

- **Firebase-only backend**: Cloud Functions 2nd gen (Node.js 22, TypeScript, Express), Cloud Firestore with numeric ids from a `counters` collection, Firebase Authentication, Cloud Storage, Firebase Cloud Messaging, Secret Manager and Firebase Hosting with two sites.
- **One REST API** (`api` function, `us-central1`) under `/api/v1`, reached same-origin through Hosting rewrites by the website and the panel, and directly by the app. Standard envelope `{ success, data, message, meta, errors }`, Laravel-style validation, prices in minor units with `*_display` strings.
- **Login** through the API plus Firebase `signInWithEmailAndPassword`: e-mail or phone with a password, and Google (website and app) or Apple (iOS) sign-in through the Firebase SDK.
- **Roles**: super-admin, admin, staff with custom roles over 17 admin modules, seller and customer.
- **Security**: all writes through the API; Firestore rules allow clients to read only their own chat threads; Storage has public media folders and private tokenised folders for KYC documents, receipts and résumés.
- **Hourly `housekeeping` job**: expires ads, featured periods and subscriptions, and settles hosted payments whose buyer never returned.

### Website (Next.js 16, static export)

- Home with slider, categories, popular categories and admin-managed feature sections; banner ads.
- Search with keyword, category (including subcategories), location, price, condition and custom-field filters, six sort orders; nearby ads by distance; category pages; related ads.
- Ad details with gallery, specifications, seller card, chat, offers, favourites and reporting. Seller pages with followers, live ads and reviews.
- Post and edit ads with category-specific custom fields and up to 10 photos; drafts; renew and mark sold.
- User dashboard: my ads, favourites, chat with offers and counter-offers, notifications, profile, reviews, job applications, seller verification, subscriptions and transactions.
- **Plans and featured ads** with hosted checkout: **Stripe** (Checkout Sessions), **Razorpay** (Payment Links) and **PayPal** (Orders v2), verified on the server (amount and currency) on `/checkout/result`; manual **Bank Transfer** with receipt upload; invoices and tax.
- Blog with categories and feedback, jobs board with applications and résumé upload, CMS pages, contact form.
- SEO: per-page metadata from the API, `sitemap.xml` and `robots.txt`.

### Admin Panel (Next.js 16, static export)

- Dashboard with ad, user, subscription and revenue KPIs, monthly revenue, ads by status, top categories, recent ads, reports and chats, top customers.
- Ads moderation (approve, reject with reason, status, bulk status, feature, delete), create and edit ads, categories with drag-and-drop order and bulk actions, custom fields, job listings.
- Content: sliders, home screen sections and popular categories, feature sections, offer item tips, banner ads.
- Chats and chat templates; subscription packages, featured-ad plans, user subscriptions, payment transactions with confirm, reject and refund, bank-transfer review.
- Seller verification fields and requests, seller reviews and review reports; blogs, blog categories and FAQs.
- Customers (status, auto-approve, grant or remove packages), roles with module permissions, staff management, user queries.
- Currencies, countries, states, cities and areas; report reasons and user reports; push notifications to all users, a role, one user or selected users.
- 24 settings pages: general, web, SEO, default currency, languages and translations, payment gateways, OTP, notifications, e-mail templates, Firebase, AdMob, AdSense, video ads, watermark, Gemini AI, file manager, log viewer, system status, dummy data and the CMS pages.

### Mobile App (Flutter, Android & iOS)

- Onboarding, login and registration, home, categories, search, nearby ads, ad details, posting and managing ads, favourites, chat with offers, seller pages and followers, reviews, blog, jobs, CMS pages, notifications, profile with seller verification, settings and in-app account deletion.
- Firebase Auth, Firestore (chat), Cloud Messaging, Analytics, Crashlytics, Remote Config and Storage; Google Maps.
- **No in-app purchases**: packages and featured ads are sold on the website only.

### Tools

- `tools/payments/setup-payments.mjs`: gateway keys to `functions/.env` and Secret Manager, deploy, gateway switches.
- `tools/migrate/`: optional one-time import from the earlier MySQL version (users with their password hashes, catalogue, ads, chats, payments, content).
- `tools/qa/`: 194 API checks, browser checks for the website and the panel, end-to-end runs, cleanup.

### Known limitations in 1.0.0

- **No SMS or e-mail is sent.** OTP codes are shown on screen in *Test mode*; the Twilio / MSG91 settings and the e-mail templates are stored only. Password reset by code needs a sender added in `functions/src/lib/otp.ts`. See [Login, OTP & Notification Settings](doc:admin/otp-notifications).
- Paystack, PhonePe, Flutterwave, PayTabs and DPO are listed but have no integration.
- AdMob and AdSense settings are stored, but the ad SDKs are not wired into the app or the website.
- Refunds in the panel update the records only; refund the money in the gateway dashboard.
- Saved searches store a *notify* flag, but no alert job sends matches yet.
- The `sandbox` test gateway's public webhook works whenever the `sandbox` row exists. Delete that row on a live marketplace ([Billing & Payments](doc:api/billing#sandbox-and-the-public-webhook)).
- Some values point at the demo project and must be changed when you install: `.firebaserc`, the Firebase web config, the API addresses, `settings/general.frontend_url` and the tools scripts ([Keys & Environment](doc:installation/environment-configuration)).

## Updating an existing installation

1. Back up Firestore ([Backups & Monitoring](doc:installation/backups)) and commit your own changes in Git.
2. Merge the new version. Keep your `.firebaserc`, `functions/.env`, `secret/`, `web/.env.local`, the Firebase config in `web/src/lib/firebase.ts` and `admin/src/lib/firebase.ts`, the app's `firebase_options.dart`, `google-services.json`, `GoogleService-Info.plist`, `android/key.properties`, the keystore and your branding assets.
3. Backend: `cd functions && npm install && npm run build`, then `firebase deploy --only functions,firestore:rules,firestore:indexes,storage`.
4. Website and Admin Panel: `npm install && npm run build` in `web/` and `admin/`, then `firebase deploy --only hosting`.
5. App: increase `version:` in `mobile/pubspec.yaml`, build the bundle and upload it ([Release & Play Store](doc:app/deployment)).

**Next:** [Support →](doc:support)
