---
title: Introduction
description: Go4Market is a ready-to-launch multi-vendor quick-commerce and eCommerce platform for Grocery, Food, Pharmacy and Shopping, built on Firebase and Flutter.
---

Welcome to the **Go4Market** documentation. Go4Market lets you run a multi-vendor marketplace with four modules (**Grocery, Food, Pharmacy and Shopping**) from one platform. Sellers list their products and run their own counter POS. Delivery partners deliver in 15 or 30 minutes or in a scheduled slot. Customers shop from the website or the Android app.

This guide takes you from the downloaded package to a live business. You create your Firebase project, deploy the backend, publish the website and the three web panels, then re-brand the two mobile apps and publish them on Google Play.

:::note Version
These docs cover **Go4Market v1.0.0** (backend contract v1.2, panels v1.3), updated 29 October 2026. See the [Changelog](doc:changelog).
:::

## What is included

| Part | Technology | Folder | What it does |
|---|---|---|---|
| **Backend** | Firebase: Cloud Functions v2 (TypeScript, Node 22, region `asia-south1`), Firestore, Authentication, Storage, Cloud Messaging | `functions/`, `firestore.rules`, `storage.rules`, `firestore.indexes.json` | Pricing, checkout, payments, wallet, settlements, rider assignment, notifications, SMS, e-mail, reports, sitemap |
| **Website** | Flutter Web on Firebase Hosting | `apps/website` | Customer storefront: modules, search, cart, checkout, tracking, wallet, blog |
| **Admin Panel** | Flutter Web on Firebase Hosting | `apps/panel` (`lib/main_admin.dart`) | Catalogue, sellers, riders, orders, POS, finance, marketing, content, settings |
| **Seller Panel** | Flutter Web on Firebase Hosting | `apps/panel` (`lib/main_seller.dart`) | Seller Hub: products, orders, POS, own riders, coupons, earnings, reports |
| **Delivery Panel** | Flutter Web on Firebase Hosting | `apps/panel` (`lib/main_delivery.dart`) | Rider web panel: go online, accept, deliver with OTP, cash, earnings |
| **Customer App** | Flutter (Android) | `apps/customer_app` (`com.go4market.customer`) | Shopping app with phone OTP, Google and e-mail sign-in, live tracking, wallet |
| **Partner App** | Flutter (Android) | `apps/partner_app` (`com.go4market.partner`) | One app, two roles: **Seller** (orders, POS with camera barcode scanner, stock) and **Delivery** (live location, OTP delivery, earnings) |
| **Shared package** | Dart | `packages/g4m_core` | Brand theme, models, repositories and the Firebase options used by every Flutter client |
| **Seed tool** | Node.js (Admin SDK) | `tools/seed` | Demo accounts, modules, categories, sellers, products and settings |

## How Go4Market is put together

Go4Market has **no server for you to maintain**. Everything runs in one Firebase project that you own:

- Every client (website, three panels, two apps) reads catalogue data **directly from Cloud Firestore**, protected by security rules.
- Anything that must be trusted runs in **callable Cloud Functions** in `asia-south1`: prices, coupons, placing an order, payments, wallet, status changes, rider assignment, refunds and payouts. Order status changes only through the `updateOrderStatus` function, never through a direct client write.
- Logins use **Firebase Authentication** with e-mail/password, **Google** and **phone OTP**. Roles (`customer`, `seller`, `delivery`, `admin`) are custom claims that only Cloud Functions can set.
- Images are stored in **Cloud Storage**. Push notifications go through **Firebase Cloud Messaging** to Android devices and web browsers.
- The website and the three panels are **four Firebase Hosting sites** built from two Flutter codebases.

![Go4Market Admin dashboard](/docs/go4market/images/admin-dashboard.webp "The Admin panel dashboard: revenue, orders, customers and order status across all modules")

## Key features

- **4 modules, multi-vendor**: Grocery, Food, Pharmacy and Shopping. Each module has its own colour, categories and sellers, and commission is set per seller.
- **Delivery options**: quick **15-minute** and **30-minute** delivery, standard delivery, **scheduled** slots and **self-pickup**. Fees depend on distance, and customers see an arrival countdown.
- **Live rider tracking** on **OpenStreetMap**, a **delivery OTP**, and **COD cash collection** with settlement.
- **POS with barcode** for admins and sellers: a USB scanner on the web, a camera scanner in the Partner app.
- **Wallet** with partial payment and top-ups, **coupons and promo codes**, **membership plans**, **Refer & Earn** and **product subscriptions** (daily, weekly or monthly).
- **Payments**: Razorpay, Stripe Checkout, PayPal, Wallet and Cash on Delivery.
- **Returns** with refund to the wallet or the original payment, plus **withdrawals**, **fund transfers**, **rider salary**, **reports** and **abandoned carts**.
- **Food add-ons** and variants (Half/Full, sizes), veg/non-veg flags and custom fields.
- **Sign-in** with e-mail/password, Google and phone OTP.
- **Languages**: English, Hindi, Gujarati and **Arabic with RTL** on the website and panels. The two apps ship in English and Hindi.
- **Notifications**: app and web push via `registerPushToken`, e-mail over SMTP, and an optional **SMS gateway** (Twilio, MSG91 or Fast2SMS).
- **AI product descriptions** with Google Gemini (optional), **force update**, **SEO** and an XML **sitemap** function.

## The recommended path

:::steps
### Read the requirements
Check [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs) so every account is ready.

### Create Firebase and connect the code
[Create the Firebase project](doc:installation/firebase-project), then [connect the code to it](doc:installation/connect-your-project).

### Deploy the backend
[Secrets & functions/.env](doc:installation/environment-configuration) → [Deploy functions, rules and indexes](doc:installation/backend-deploy) → [Seed demo data](doc:installation/seed-data).

### Publish the website and panels
[Build & deploy the web apps](doc:installation/hosting) → [Create the Super Admin](doc:installation/super-admin) → [Setup Guide](doc:installation/setup-guide).

### Re-brand and publish the apps
[Customer App](doc:app-customer/prerequisites) and [Partner App](doc:app-partner/prerequisites) → Google Play.
:::

## Where to go next

:::cards
- [Admin Panel Overview](doc:admin/overview) What the panel manages and how access works.
- [Demo Instructions](doc:admin/demo-instructions) Demo logins and a 15-minute tour.
- [Installation Overview](doc:installation/overview) The full install, step by step.
- [FAQs](doc:faqs) Quick answers to common setup questions.
:::
