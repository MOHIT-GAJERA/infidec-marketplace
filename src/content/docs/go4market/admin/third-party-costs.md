---
title: Third-Party Service Costs
description: Go4Market is a one-time purchase. The external services it connects to are billed by their providers, directly to you.
---

Go4Market is a one-time purchase. The **external services it connects to are not included**. Their providers bill you directly. Nothing on this page is charged by Infidec: you open every account in your own name, with your own billing details, so you keep full control.

:::tip Read this before you launch
Most services have a free allowance that covers development and a small marketplace. Costs start when order volume grows. Knowing which meter is running, and where the free tier ends, avoids an unexpected bill in month two.
:::

## What is required and what is optional

| Service | Needed for | Can you launch without it? |
|---|---|---|
| **Firebase (Blaze plan)** | Backend, database, logins, storage, push, hosting | **No**, Go4Market runs on Firebase |
| **Domain name** | Your own website and panel addresses | Yes, the free `*.web.app` addresses work, but a domain is recommended |
| **Google Play developer account** | Publishing the Customer and Partner apps | Only if you skip Android |
| **Payment gateway** (Razorpay, Stripe, PayPal) | Online payments and wallet top-ups | Yes, Cash on Delivery and Wallet work without one |
| **SMTP e-mail** (e.g. Gmail / Google Workspace) | Order, welcome and withdrawal e-mails | Yes, but no e-mails are sent |
| **SMS gateway** (Twilio, MSG91 or Fast2SMS) | Order SMS with the delivery OTP | Yes, it is optional. Phone **sign-in** OTP is sent by Firebase, not by this gateway |
| **Google Gemini API key** | AI product descriptions | Yes, a built-in template is used instead |
| **Maps** | Location picker, live tracking, rider map | **Nothing to buy**, Go4Market uses OpenStreetMap |

## Firebase

Go4Market needs the **Blaze (pay-as-you-go)** plan because it uses Cloud Functions, Secret Manager, scheduled jobs and calls to external services. Blaze still includes the free quota; you pay only above it.

| Product | Free quota (approx.) | What drives the bill |
|---|---|---|
| **Cloud Firestore** | 50,000 reads, 20,000 writes per day; 1 GiB stored | Catalogue browsing, order lists, **rider location writes** (at most every ~15 s per online rider) |
| **Cloud Functions** | 2 million invocations / month | Checkout quotes, orders, payments, triggers, scheduled jobs |
| **Secret Manager** | 6 active secret versions free, then a few cents each per month | Go4Market defines 8 secrets (payments, SMTP, SMS) |
| **Authentication** | E-mail, Google and anonymous sign-in are free; phone sign-in is billed per SMS above a small allowance | **Phone OTP SMS**, priced per country |
| **Cloud Storage** | 5 GB stored | Product images (WebP keeps them small), weekly Firestore backups |
| **Cloud Messaging** | Free | – |
| **Hosting** | 10 GB stored, 360 MB/day transfer | Four Flutter Web sites; Flutter bundles are a few MB each, cached by the browser |

:::warning Set a budget alert on day one
In Google Cloud Console → **Billing → Budgets & alerts**, create a monthly budget (for example ₹5,000) with alerts at 50 %, 90 % and 100 %. Alerts do not stop spending, but they warn you within hours if something is wrong.
:::

:::note Phone OTP costs real money
Every sign-in OTP is an SMS billed by Firebase. Allow only the countries you sell in (Authentication → Settings → **SMS region policy**) and use **test phone numbers** during development.
:::

## Payment gateways

Gateways charge per transaction, not per month. Typical Indian rates are about **2 % per domestic transaction**; international cards cost more. Stripe and PayPal charge in their own currency (`STRIPE_CURRENCY`, `PAYPAL_CURRENCY`); Go4Market converts from INR with `settings/platform.fx`.

## SMS gateway (optional)

Order SMS (order placed, out for delivery with the OTP, ready for pickup, delivered, cancelled, withdrawal) are charged by your provider per message. In India, MSG91 and Fast2SMS on a DLT route need a registered sender ID and approved templates. Twilio needs a sender number or a Messaging Service.

## OpenStreetMap tiles

The maps use the public `tile.openstreetmap.org` server, which is free but has a [fair-use policy](https://operations.osmfoundation.org/policies/tiles/). For heavy production traffic, switch to a commercial tile provider. See [Maps & Location](doc:app-customer/maps-location).

## Google Gemini (optional)

`generateDescription` uses Gemini 2.5 Flash when `GEMINI_API_KEY` is set. Each description is one short request, and the free tier is usually enough for a catalogue.

## Google Play

A one-time **US$25** registration fee per developer account. New personal accounts must run a closed test with at least 12 testers for 14 days before production access.

**Next:** [Installation Overview →](doc:installation/overview)
