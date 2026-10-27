---
title: Introduction
description: ClassiAds-Hub is a classified ads and buy-sell marketplace on Firebase. It includes a Next.js website, a Next.js Admin Panel, a Flutter app for Android and iOS and a serverless Cloud Functions API.
---

Welcome to the **ClassiAds-Hub** documentation. ClassiAds-Hub runs a classifieds marketplace from **one** platform. Sellers post ads with photos and category-specific fields. Buyers search, filter, chat with sellers and make offers. You moderate ads, run the catalogue, sell subscription packages and featured-ad plans, and manage the whole marketplace from the Admin Panel.

This guide takes you from the downloaded package to a live marketplace. You create your own Firebase project, deploy the backend, publish the website and the Admin Panel, then brand and publish the mobile app.

:::note Version
These docs cover **ClassiAds-Hub v1.0.0**. The [Changelog](doc:changelog) lists what changed in each version.
:::

![ClassiAds-Hub website home](/docs/classiadshub/images/web-home.jpg "The website home page: slider, categories and feature sections")

## What is included

| Part | Folder | What it does |
|---|---|---|
| **Backend API** | `functions/` | One Cloud Function `api` (Express, TypeScript, Node 22, `us-central1`) that serves every endpoint under `/api/v1`, plus the hourly `housekeeping` job |
| **Admin Panel** | `admin/` | Next.js 16 static site (Tailwind 4, Nunito font). Dashboard, ads moderation, categories, custom fields, content, chat, packages and payments, sellers, blogs, customers, staff roles, locations, reports, push notifications and settings |
| **Website** | `web/` | Next.js 16 static site. Home, search, categories, nearby, ad details, seller pages, post an ad, chat, offers, the user dashboard, plans and checkout, blog, jobs and CMS pages |
| **Mobile App** | `mobile/` | Flutter app for Android and iOS (Riverpod, Dio, go_router, Firebase Auth, Messaging, Analytics, Crashlytics, Remote Config, Storage) |
| **Rules & indexes** | `firebase/` | `firestore.rules`, `storage.rules`, `firestore.indexes.json`. The root `firebase.json` and `.firebaserc` define the functions and the two Hosting sites |
| **Tools** | `tools/` | `migrate/` (optional one-time import from the earlier MySQL version), `payments/setup-payments.mjs` (gateway keys and deploy), `qa/` (automated API and browser checks) |
| **Store assets** | `store/playstore/`, `docs/PLAYSTORE_GUIDE.md` | Play Store listing assets and a release guide |

## How ClassiAds-Hub is put together

ClassiAds-Hub has **no server to rent**. There is no VPS, PHP or MySQL. Everything runs in **your** Firebase project on the Blaze plan:

- **Cloud Functions** run the REST API. Every read and write from the website, the Admin Panel and the app goes through it. It checks the signed-in user, validates input and writes Firestore with the Admin SDK.
- **Cloud Firestore** stores users, ads, categories, chats, offers, payments, settings and content. Documents keep **numeric ids**, issued by a `counters` collection.
- **Firebase Authentication** holds the logins: e-mail and password, phone and password (through a synthetic e-mail), and Google sign-in.
- **Cloud Storage** keeps ad photos, avatars, category icons, sliders and banners in public folders, and seller KYC documents, bank receipts and résumés in private folders.
- **Firebase Cloud Messaging (FCM)** sends push notifications for chat messages, offers, ad decisions and admin broadcasts.
- **Firebase Hosting** serves two sites: the website and the Admin Panel. Both forward `/api/**` to the `api` function, so they call the API on their own domain.

```text title="Request flow"
Website / Admin Panel ──/api/v1/*──▶ Firebase Hosting rewrite ──▶ Cloud Function "api"
Mobile App ──────────── https://us-central1-your-project-id.cloudfunctions.net/api/v1/*
                                                       │
                         Firestore · Firebase Auth · Storage · FCM · Secret Manager
```

### How sign-in works

1. The client sends the login and password to `POST /api/v1/auth/login` (or `/auth/register`).
2. The API checks the account and returns `auth_email`, the e-mail of the Firebase Auth account.
3. The client signs in with Firebase `signInWithEmailAndPassword(auth_email, password)`.
4. Every later request carries the Firebase **ID token** as `Authorization: Bearer <token>`.

Roles live on the user document in Firestore: `super-admin`, `admin`, `staff` (with custom roles and per-module permissions), `seller` and `customer`.

## Key features

- **Ads with custom fields**: unlimited nested categories, each with its own fields (text, number, dropdown, radio, checkboxes, date, file). Fields set on a parent category apply to its subcategories.
- **Moderation**: new ads wait for approval when *Require admin approval for new ads* is on. Approve, reject with a reason, feature, mark sold or delete. Trusted sellers can be set to auto-approve.
- **Search and discovery**: keyword search, category, location, price and custom-field filters, sorting, nearby ads by distance, saved searches, favourites, related ads, seller pages with followers.
- **Chat and offers**: a conversation per ad and buyer, offers with accept, reject, counter and withdraw, chat templates per category.
- **Trust**: seller verification (KYC documents and admin-defined fields) with a verified badge, seller reviews from buyers who chatted or were confirmed as the buyer, review reports, ad and user reports.
- **Monetisation on the website**: subscription packages with ad limits and categories, featured-ad plans, hosted checkout with **Stripe**, **Razorpay** and **PayPal**, manual **Bank Transfer** with receipt upload, invoices and tax.
- **Content**: sliders, home-screen sections, feature sections, banner ads, offer tips, blog with categories, FAQs, CMS pages (About, Terms, Privacy, Refund, Contact).
- **Jobs board**: job listings, applications with résumé upload and application statuses.
- **Staff roles**: custom roles with access to 17 admin modules.
- **Push notifications**: to everyone, a role, one user or selected users, with an image and a link to an ad.

:::note The mobile app has no in-app purchases
Premium plans, featured-ad checkout and transaction history are not part of the app. Buyers purchase plans and featured ads **on the website only**, so Google Play Billing rules do not apply to the app.
:::

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Cloud Functions 2nd gen, Node.js 22, TypeScript, Express 4, `firebase-admin` 13, `busboy` for uploads |
| Database & files | Cloud Firestore, Cloud Storage |
| Auth & push | Firebase Authentication, Firebase Cloud Messaging |
| Secrets | Firebase Secret Manager (`STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET`) |
| Website & Admin Panel | Next.js 16.2 (static export), React 19, Tailwind CSS 4, Firebase JS SDK 12, Leaflet with OpenStreetMap in the admin map picker |
| Mobile App | Flutter (Dart 3.11+), Riverpod, Dio, go_router, Google Maps |
| Hosting | Firebase Hosting, two sites (`web` and `admin` targets) |

## The recommended path

:::steps
### Check the requirements
Read [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs) so every account is ready.

### Create Firebase and deploy the backend
[Create the Firebase project](doc:installation/firebase-project), [deploy the backend](doc:installation/backend-deploy) and [add your keys](doc:installation/environment-configuration).

### Install the Admin Panel and the website
[Admin Panel Installation](doc:installation/admin-panel), then [Create the First Admin](doc:installation/super-admin), [Hosting, Domain & SSL](doc:installation/hosting) and the [Setup Guide](doc:installation/setup-guide).

### Brand and publish the app
[App Prerequisites](doc:app/prerequisites), [package name](doc:app/change-package-name), [branding](doc:app/branding) and [release](doc:app/deployment).
:::

## Where to go next

:::cards
- [Admin Panel Overview](doc:admin/overview) What the panel manages and how access works.
- [Installation Overview](doc:installation/overview) What gets installed, in which order.
- [Website](doc:web/overview) Browsing, posting ads, the user dashboard and checkout.
- [Mobile App](doc:app/prerequisites) Brand, configure and publish the Flutter app.
- [Backend Reference](doc:api/overview) The REST API, the data model and the security rules.
- [FAQs](doc:faqs) Quick answers to common setup questions.
:::

**Next:** [Admin Panel Overview →](doc:admin/overview)
