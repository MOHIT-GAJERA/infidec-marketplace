---
title: Third-Party Service Costs
description: Booqora is a one-time purchase. The external services it connects to (Firebase, payment gateways, SMTP, app stores, a domain) are billed by their providers, directly to you.
---

Booqora is a one-time purchase. The **external services it connects to are not included**. Their providers bill you directly. Nothing on this page is charged by Infidec: you open every account in your own name, with your own billing details, so you keep full control.

:::note Prices change
The figures below are typical list prices at the time of writing and are only a guide. Always check the provider's current pricing page for your country and currency before you launch.
:::

## What is required and what is optional

| Service | Needed for | Can you launch without it? |
|---|---|---|
| **Firebase (Blaze plan)** | Backend, database, logins, file storage, hosting, Cloud Functions | **No**, Booqora runs on Firebase |
| **Payment gateway** (Razorpay, Stripe, PayPal) | Online payments in the Online Store, the platform and the app | Yes, staff can still record cash, card, bank and UPI payments by hand |
| **SMTP e-mail** (e.g. Gmail / Google Workspace) | Booking confirmations, payment receipts, sending documents | Technically yes, but no e-mails are sent |
| **Domain name** | Your own platform, store and website addresses | Yes, the free `*.web.app` addresses work, but a domain is recommended |
| **Google Play developer account** | Publishing the Android app | Only if you skip Android |
| **Apple Developer Program** | Publishing the iOS app | Only if you skip iOS |

## Firebase

Booqora needs the **Blaze (pay-as-you-go)** plan because it uses Cloud Functions and Secret Manager, and the functions call external services (Razorpay, Stripe, PayPal, your SMTP server). Blaze still includes the free quota; you pay only above it.

| Product | Free quota (approx.) | What drives the bill |
|---|---|---|
| **Cloud Firestore** | 50,000 reads and 20,000 writes per day, 1 GiB stored | Opening lists and dashboards, Online Store visits, orders and activity logs |
| **Cloud Functions** | 2 million invocations per month | Payment configuration, checkout, verification, e-mails and the online-booking trigger |
| **Secret Manager** | A small number of active secret versions free, then a few cents each per month | Booqora binds **8 secrets** (payments and SMTP) |
| **Authentication** | E-mail/password and anonymous sign-in are free for normal volumes | – |
| **Cloud Storage** | About 5 GB stored on the default bucket | Product images, logos, avatars |
| **Hosting** | 10 GB stored, about 360 MB per day of transfer | The Rental Platform (Flutter Web) and the Marketing Website |

Cloud Functions also use **Cloud Build** and **Artifact Registry** when you deploy. The cost is usually a few cents, but old container images can build up; Firebase offers to set a clean-up policy during the first deploy.

:::warning Set a budget alert on day one
In Google Cloud Console → **Billing → Budgets & alerts**, create a monthly budget with alerts at 50 %, 90 % and 100 %. Alerts do not stop spending, but they warn you quickly if something is wrong.
:::

Booqora keeps Firestore reads low by design: queries use a single `orderBy` or a single equality filter and the rest is filtered in the browser, and the platform enables the Firestore offline cache. A small rental business usually stays inside the free quota.

## Payment gateways

Gateways charge **per successful transaction**, not per month. Typical rates:

| Gateway | Typical fee | Notes |
|---|---|---|
| **Razorpay** | Around 2 % per domestic transaction in India; higher for international cards, Amex and some methods | Charges in the currency set by `RAZORPAY_CURRENCY` (default `INR`) |
| **Stripe** | A percentage plus a small fixed fee per card payment; varies by country | Stripe Checkout charges in the store's own currency |
| **PayPal** | A percentage plus a fixed fee, higher for cross-border payments | Charges in `PAYPAL_CURRENCY` (default `USD`), so it is unavailable for stores in other currencies |

Booqora itself adds no fee. See [Payment Gateways](doc:admin/payment-gateways).

## SMTP e-mail

Booqora sends e-mail through any SMTP server (`MAIL_HOST`, default `smtp.gmail.com`, port 587). A **Gmail** or **Google Workspace** mailbox with an app password works. Google Workspace is billed per user per month. Free Gmail accounts have daily sending limits, so a busy business should use Workspace or a transactional e-mail provider that offers SMTP. See [Email (SMTP) & Templates](doc:admin/email-smtp).

## Google Play

A one-time **US$25** registration fee per developer account. New personal accounts must run a closed test with a minimum number of testers for a set period before production access; check the current rule in the Play Console. See [Google Play Listing & Review](doc:app/play-console).

## Apple App Store

The **Apple Developer Program** costs **US$99 per year** (fee waivers exist for some non-profits and institutions). You also need a Mac with Xcode to build and upload the iOS app. See [iOS Build & App Store](doc:app/ios).

## Domain name

A `.com` domain typically costs roughly US$10–20 per year from any registrar. Firebase Hosting provides the **SSL certificate free** for custom domains. See [Custom Domains & SSL](doc:installation/domains).

**Next:** [Installation Overview →](doc:installation/overview)
