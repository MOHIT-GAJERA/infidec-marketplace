---
title: Introduction
description: Booqora is a ready-to-launch rental management platform with an online booking store, a Flutter mobile app and a Next.js marketing website, all running on Firebase.
---

Welcome to the **Booqora** documentation. Booqora is rental management software for businesses that rent things out: cameras and AV kit, bikes and scooters, party and event gear, tools, boats, sports equipment and more. Staff manage orders, live availability, inventory, customers, documents and payments in the **Rental Platform**. Customers book online in the **Online Store**. Owners and staff carry the business in their pocket with the **Mobile App**.

This guide takes you from the downloaded package to a live business. You create your own Firebase project, deploy the backend, publish the Rental Platform and the Marketing Website, then re-brand the Mobile App and publish it on Google Play (and the App Store if you want iOS).

:::note Version
These docs cover **Booqora v1.0.0** (platform, Mobile App build `1.0.0+1`). See the [Changelog](doc:changelog).
:::

## What is included

| Part | Technology | Folder | What it does |
|---|---|---|---|
| **Backend** | Firebase: Cloud Functions v2 (JavaScript, Node 22, region `asia-south1`), Firestore, Storage, Authentication | `booqora_platform/functions/`, `firestore.rules`, `storage.rules`, `firestore.indexes.json` | Online payments (Razorpay, Stripe, PayPal), SMTP e-mail, booking notifications, multi-tenant security rules |
| **Rental Platform** | Flutter Web (Flutter 3.41, Dart 3.11) on Firebase Hosting | `booqora_platform/` | The back office: dashboard, orders, calendar, customers, inventory, coupons, documents, reports, settings, team and the Bora assistant |
| **Online Store** | Part of the Rental Platform build | `booqora_platform/lib/features/storefront/` (route `/s/:slug`) | Each workspace's public booking page: browse products, pick dates, check availability, book and pay online |
| **Mobile App** | Flutter (Android and iOS) | `booqora_mobile/` (`io.booqora.booqora_mobile`) | The platform on a phone: orders, inventory, calendar, native Razorpay checkout, payment links, barcode scanning, PDF share and print |
| **Marketing Website** | Next.js 16, TypeScript, Tailwind CSS 4, static export on Firebase Hosting | `booqora_website/` | Your public product site: features, industries, pricing, blog and links to sign up and log in |

## How Booqora is put together

Booqora has **no server for you to maintain**. Everything runs in one Firebase project that you own:

- Every business is a **workspace**. All of its data lives under `workspaces/{workspaceId}/…` in **Cloud Firestore**, and only members of that workspace can read or write it. See [Data Model](doc:api/data-model).
- The Rental Platform and the Mobile App read and write Firestore **directly**, protected by [security rules](doc:api/security-rules). Prices, totals and availability are calculated in the shared Dart file `lib/data/pricing.dart`.
- Anything that needs a secret key runs in **five Cloud Functions** in `asia-south1`: `paymentConfig`, `createPayment`, `verifyPayment`, `sendEmail` and the `onOnlineOrder` trigger. Payment and SMTP keys stay in **Secret Manager** and never reach the browser. See [Cloud Functions Reference](doc:api/cloud-functions).
- Staff sign in with **e-mail and password** (Firebase Authentication). Online Store visitors get an anonymous session so they can place a booking request without an account.
- Product images, logos and avatars are stored in **Cloud Storage**.
- The Rental Platform (with the Online Store inside it) and the Marketing Website are **two Firebase Hosting sites**.

![Booqora dashboard](/docs/booqora/images/platform-dashboard.webp "The Rental Platform dashboard: revenue, orders, upcoming pickups and returns")

## Key features

- **Orders with live availability**: draft → reserved → started (picked up) → returned, with automatic rental pricing, deposits, discounts, coupons and taxes.
- **Rental calendar** showing every pickup and return.
- **Inventory**: rental, sale and service products; trackable stock items with identifiers or bulk quantities; variations; bundles; collections; **downtime** for maintenance, repair or missing items; buffer time before and after each rental.
- **Pricing**: flat or fixed prices per hour, day, week or month, or tiered **pricing structures** with a minimum charge.
- **Customers** with addresses, default discounts, deposit rules, tax profiles and custom fields.
- **Documents**: quotes, contracts, invoices and packing slips with sequential numbers, finalising, signature requests, print and e-mail; PDF share and print in the Mobile App.
- **Online Store** at `/s/<your-store>` with your brand colour, collections, cross-sell, pickup or delivery, terms acceptance, coupons, SEO and online payment (full, down payment or deposit only).
- **Payments**: record cash, card, bank or UPI payments, take **Razorpay** checkout in the page or app, and send **Stripe** or **PayPal** payment links.
- **E-mail over SMTP**: booking confirmations, payment receipts and editable templates for orders, quotes, contracts and invoices.
- **Reports**: performance, products, availability, fulfilment, customers, coupons and activity.
- **Team**: invite staff as admin or member; owner, admin and member roles.
- **Bora**, a built-in assistant that answers questions about your workspace and links you to the right page.
- **Global search** (<kbd>Ctrl</kbd> + <kbd>K</kbd>), barcode lookup, CSV export and editable translations.
- **Mobile App** with a camera barcode scanner, quick create, native Razorpay checkout and PDF share.

## The recommended path

:::steps
### Read the requirements
Check [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs) so every account is ready.

### Create Firebase and connect the code
[Create the Firebase project](doc:installation/firebase-project), then [connect the code to it](doc:installation/connect-your-project).

### Deploy the backend
[Secrets & Environment](doc:installation/environment-configuration) → [Deploy functions, rules and indexes](doc:installation/backend-deploy).

### Publish the platform and website
[Build & deploy to Hosting](doc:installation/hosting) → [Create your first workspace](doc:installation/first-workspace) → [Setup Guide](doc:installation/setup-guide).

### Re-brand and publish the Mobile App
[App Prerequisites](doc:app/prerequisites) → [Release Build & Keystore](doc:app/deployment) → [Google Play](doc:app/play-console).
:::

## Where to go next

:::cards
- [Platform Overview](doc:admin/overview) What the Rental Platform manages and how access works.
- [Demo Instructions](doc:admin/demo-instructions) Live demo links and a 15-minute tour.
- [Installation Overview](doc:installation/overview) The full install, step by step.
- [FAQs](doc:faqs) Quick answers to common setup questions.
:::
