---
title: Introduction
description: QwikMart is a ready-to-launch All-in-One Quick Commerce & eCommerce Platform with Multi-Store & Multi-Country — Firebase backend, Admin & Store panels, Next.js website and two Flutter apps.
---

Welcome to the **QwikMart** documentation. QwikMart lets you run a 10-minute grocery & essentials delivery business (quick commerce) and a regular online store (eCommerce, delivered in 1–4 days) from **one** platform, with multiple stores, delivery zones and countries.

This guide takes you from the downloaded package to a live business: create your Firebase project, deploy the backend, install the panels and website, re-brand the two mobile apps and publish them on Google Play.

:::note Version
These docs cover **QwikMart v1.0.1** (released 20 October 2026). See the [Changelog](doc:changelog) for what changed in each version.
:::

## What is included

| Part | Technology | What it does |
|---|---|---|
| **Backend** | Firebase: Cloud Functions (TypeScript, Node 22), Cloud Firestore, Authentication, Cloud Storage, Cloud Messaging | Business logic (pricing, orders, payments, wallet, riders), security rules, push & email |
| **Admin Panel** | Next.js 15, React 19, Tailwind CSS, Firebase JS SDK | Super Admin panel (`/admin`), Store panel (`/store`) and Delivery Boy web panel (`/delivery`) |
| **Web Portal** | Next.js 15, React 19, Tailwind CSS | Customer website: browse, cart, checkout, orders, live tracking, wallet |
| **Customer App** | Flutter 3 (Android & iOS) | Shopping app with phone OTP login, live order tracking, wallet, referral |
| **Delivery Boy App** | Flutter 3 (Android & iOS) | Rider app: registration, go online, accept orders, OTP delivery, earnings |

## How QwikMart is put together

QwikMart has **no separate server to maintain**. Everything runs on Google Firebase:

- The apps, website and panels read catalogue data **directly from Cloud Firestore** (protected by security rules).
- Anything that must be trusted — prices, coupons, placing an order, payments, wallet, rider assignment, refunds — runs in **Cloud Functions** (callable functions in region `asia-south1`).
- Logins use **Firebase Authentication** (phone OTP, email/password and guest sessions).
- Images and documents are stored in **Cloud Storage**; push notifications use **Firebase Cloud Messaging**.
- The Admin Panel and the website are hosted on **Firebase App Hosting** (or any Node.js server).

![QwikMart architecture](/docs/qwikmart/images/architecture.svg "Every client talks to the same Firebase project")

## Key features

- **Quick commerce + eCommerce** in one app, with a toggle on the home screen.
- **Multi-store, multi-zone, multi-country**: draw delivery zones on a map, assign stores, set currency per country.
- **Home Builder**: design the app/website home screen (banners, category rows, product sliders, brands) per zone and publish.
- **Live order tracking** with the rider's position on a map and a **delivery OTP** for safe hand-over.
- **Payments**: Razorpay (native checkout in the app), Stripe, PayPal, Cashfree, PhonePe, Paystack, PayTabs, Midtrans, **Wallet** and **Cash on Delivery**.
- **Wallet, refunds, cashback and Refer & Earn**.
- **Delivery partners**: self-registration with documents, admin approval, auto/manual assignment, commission, cash collection and payouts.
- **Returns & replacements** with photos and rider pickup.
- **Support chat**, website **Contact Us** form, push / email / SMS notifications.
- **Roles & permissions** for staff, plus a dedicated **Store panel** for store owners.
- **AI**: product description & translation generation with Google Gemini.
- **3 languages** out of the box (English, Hindi, Arabic with RTL) — add more any time.

## The recommended path

:::steps
### Read the requirements
Check [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs) so you have every account ready.

### Create Firebase and deploy the backend
[Create the Firebase project](doc:installation/firebase-project), then [deploy the backend](doc:installation/backend-deploy).

### Install the Admin Panel and create your Super Admin
[Admin Panel Installation](doc:installation/admin-panel) → [Create the Super Admin](doc:installation/super-admin) → [Setup Guide](doc:installation/setup-guide).

### Put the website online
[Web Portal installation](doc:web/installation-steps) and [deployment](doc:web/deployment).

### Re-brand and publish the apps
[Customer App](doc:app-customer/prerequisites) and [Delivery Boy App](doc:app-delivery/prerequisites) → Google Play.
:::

## Where to go next

:::cards
- [Admin Panel Overview](doc:admin/overview) What the panel manages and how access works.
- [Demo Instructions](doc:admin/demo-instructions) Try everything locally with sample data in 10 minutes.
- [Customer App](doc:app-customer/prerequisites) Configure and publish the shopping app.
- [FAQs](doc:faqs) Quick answers to common setup questions.
:::
