---
title: Introduction
description: Go4Foodie is an All-in-One Restaurant POS, QR Table Ordering & Online Food Ordering Platform on Firebase. It includes a Flutter Web admin panel, a Next.js website, one Flutter mobile app with three modes and a serverless backend.
---

Welcome to the **Go4Foodie** documentation. Go4Foodie runs a restaurant's front of house, kitchen tickets and online sales from **one** platform. It covers the live floor plan and POS billing, QR table ordering, take-away ordering, table bookings and private events, gift cards and coupons, staff, inventory and reports.

This guide takes you from the downloaded package to a live restaurant. You create your own Firebase project, deploy the backend and the admin panel, put the website online and publish the mobile app.

:::note Version
These docs cover **Go4Foodie v1.0.0** (released 22 October 2026). The [Changelog](doc:changelog) lists what changed in each version.
:::

## What is included

| Part | Folder | What it does |
|---|---|---|
| **Admin Panel** | `admin-app/` | Flutter Web panel with 20 screens: dashboard, orders, menu, reservations, tables & QR codes, live floor, POS, analytics, staff, customers, gift cards, transactions, inventory, reports, notifications, audit log and settings |
| **Customer Website** | `website/` | Next.js 16 storefront: menu, take-away ordering (now or scheduled), table QR ordering, table booking & private events, gift cards & coupons |
| **Mobile App** | `mobile-app/` | One Flutter app for Android & iOS. The first screen offers three modes: **Customer App**, **Restaurant App** (staff POS) and **Owner App** |
| **Backend** | `firebase/` | One Cloud Function `api` (Node.js 22, TypeScript, Express), Firestore & Storage rules, Hosting configuration |
| **Migration tool** | `firebase/migration/` | `migrate.mjs` imports an existing MySQL database dump into Firestore |
| **Documentation** | `docs/` | Data model, API contracts and go-live runbook. This website is the full guide |

## How Go4Foodie is put together

Go4Foodie has **no server to rent or maintain**. Everything runs in **your** Google Firebase project:

- **One Cloud Function, `api`**, runs in `asia-south1` (Mumbai) and serves the whole REST API. Prices, orders, payments, POS actions and e-mails are all handled there.
- **Cloud Firestore** (`asia-south1`) stores the data. Clients never write to it directly. The admin panel only *listens* to the collections behind live screens (floor, POS, orders, reservations).
- **Cloud Storage** keeps uploaded menu images.
- **Firebase Authentication** signs admin users in with **custom tokens** that the `api` function mints after it checks the password. The mobile app uses its own 30-day tokens signed with `AUTH_SECRET`.
- **Firebase Hosting** serves the admin panel and an API host. Both send `/api/**` to the function. **Firebase App Hosting** runs the server-rendered website.

![Architecture](/docs/go4foodie/images/architecture.svg "Admin panel, website and mobile app all call the same api Cloud Function, which reads and writes Firestore and Storage")

The API has three parts, all behind the same Hosting rewrite:

| Path | Used by | Authentication |
|---|---|---|
| `/api/*` | Website (public API: menu, orders, reservations, gift cards, payments) | None. Paid actions need a verified payment |
| `/api/mobile/*` | Mobile app (all three modes) | HS256 JWT, valid for 30 days, signed with `AUTH_SECRET` |
| `/api/admin/*` | Admin panel | Firebase ID token from a custom token, with claims `kind`, `refId`, `role`, `outletId` |

## Key features

- **Live floor plan & POS**: open and close table sessions, KOT printing, voids, discount / tax / service charge / tip, split payments, merged tables, invoice printing, **Close & Pay**.
- **QR table ordering**: each table has a QR code that opens `/order?table=<code>` on the website. The order goes straight to that table's session and opens one if needed.
- **Take-away ordering** for *now* or *later*, with time slots and a cut-off.
- **Table booking & private events** with live slot availability.
- **Gift cards & coupons** sold online, redeemed in the restaurant, with e-mails.
- **Payments**: Razorpay, Stripe and PayPal, verified on the server. Customers pick a provider when more than one is set up.
- **Branded e-mails** over your SMTP server: order confirmed / completed, reservation confirmed / completed, gift card purchased / redeemed.
- **Roles**: OWNER, MANAGER and STAFF with 13 permissions. Staff members sign in to the Restaurant App.
- **Analytics**: dashboard KPIs, table analytics (busy hours, rankings, CSV / Excel / PDF), reports, transactions and an audit log of every POS action.
- **Light & dark theme** with smooth motion. Reduced-motion settings are respected.

## Tech stack

| Layer | Technology |
|---|---|
| Admin Panel | Flutter Web (Dart 3.11+), `firebase_auth`, `cloud_firestore`, `go_router`, `fl_chart`, `qr_flutter` |
| Website | Next.js 16 (App Router, SSR), React 19, Tailwind CSS 4 |
| Mobile App | Flutter (Android & iOS), Riverpod, `go_router`, `webview_flutter` for online payments |
| Backend | Cloud Functions 2nd gen, Node.js 22, TypeScript, Express 4, `firebase-admin`, `zod`, `bcryptjs`, `nodemailer`, `luxon` |
| Database & files | Cloud Firestore (Native mode), Cloud Storage |
| Hosting | Firebase Hosting (admin site + API host), Firebase App Hosting (website) |
| Secrets | Google Cloud Secret Manager |

## The recommended path

:::steps
### Check the requirements
Read [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs) so every account is ready.

### Create Firebase and deploy the backend
[Create the Firebase project](doc:installation/firebase-project), [deploy the backend](doc:installation/backend-deploy) and [configure the environment](doc:installation/environment-configuration).

### Install the admin panel and create your Owner
[Admin Panel Installation](doc:installation/admin-panel), then [Data Migration](doc:installation/data-migration) (optional), then [Admin Users](doc:installation/admin-users), then the [Setup Guide](doc:installation/setup-guide).

### Put the website online
[Web Portal installation](doc:web/installation-steps) and [deployment](doc:web/deployment).

### Publish the mobile app
[Mobile App prerequisites](doc:app/prerequisites), then [point it at your API](doc:app/api-configuration), then [publish it](doc:app/deployment).
:::

## Where to go next

:::cards
- [Admin Panel Overview](doc:admin/overview) What the panel manages and how access works.
- [Installation Overview](doc:installation/overview) What gets installed, in which order.
- [Web Portal](doc:web/overview) The customer website: ordering, booking, gift cards.
- [Mobile App](doc:app/prerequisites) Customer, Restaurant and Owner modes in one app.
- [API Reference](doc:api/overview) Every endpoint, the data model and error codes.
- [FAQs](doc:faqs) Quick answers to common setup questions.
:::
