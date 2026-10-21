---
title: Third-Party Service Costs
description: QwikMart is a one-time purchase. The external services it connects to are billed by their providers, directly to you.
---

QwikMart is a one-time purchase. The **external services it connects to are not included** and are billed directly to you by their providers. Nothing on this page is charged by Infidec — every account is opened in your own name, with your own billing details, so you keep full control of it.

:::tip Read this before you launch
Most services have a free allowance that comfortably covers development and a small store. Costs begin when order volume grows. Knowing which meter is running — and where the free tier ends — avoids an unexpected bill in month two.
:::

## What is required and what is optional

| Service | Needed for | Can you launch without it? |
|---|---|---|
| **Firebase (Blaze plan)** | Backend, database, logins, storage, push, hosting | **No** — QwikMart runs on Firebase |
| **Domain name** | Website and panel address | Yes (App Hosting gives you a free `*.hosted.app` address), but a domain is recommended |
| **Google Play developer account** | Publishing the Android apps | Only if you skip Android |
| **Apple Developer Program** | Publishing on the App Store | Yes — Android works without it |
| **Payment gateway** (e.g. Razorpay) | Online payments | Yes — Cash on Delivery and Wallet work without one |
| **SMTP e-mail** | Order and contact e-mails, password reset | Yes, but customers get no e-mails |
| **SMS gateway** | OTP / transactional SMS through your own provider | Yes — Firebase Phone Auth sends the OTP |
| **Google Gemini API key** | AI product descriptions and translations | Yes — fully optional |
| **Maps** | Location picker and live tracking | **Nothing to buy** — QwikMart uses OpenStreetMap |

## Firebase

QwikMart needs the **Blaze (pay-as-you-go)** plan because it uses Cloud Functions and calls external services (payment gateways, SMTP, Gemini). Blaze still includes the free daily/monthly quota — you pay only for usage above it.

| Product | Free quota (approx.) | What drives the bill |
|---|---|---|
| **Cloud Firestore** | 50,000 reads, 20,000 writes, 20,000 deletes per day; 1 GiB stored | Product browsing, order history, **rider location updates** (every 10 s while a rider is online) |
| **Cloud Functions** | 2 million invocations / month | Cart pricing, orders, payments, notifications |
| **Authentication** | Email/password and anonymous are free; phone sign-in has a small daily free allowance | **Phone OTP SMS** — charged per SMS, price depends on the country |
| **Cloud Storage** | 5 GB stored (US regions) | Product images, documents |
| **Cloud Messaging (push)** | Free and unlimited | — |
| **App Hosting** | Small free allowance (Cloud Run + Cloud Build) | Website & panel traffic, builds |

:::warning Set a budget alert on day one
In Google Cloud Console → **Billing → Budgets & alerts**, create a monthly budget (for example ₹5,000) with alerts at 50 %, 90 % and 100 %. Alerts do not stop spending, but they tell you within hours if something is wrong.
:::

:::note Phone OTP costs real money
Every OTP SMS is billed. Protect it: enable only the countries you sell in (Authentication → Settings → **SMS region policy**) and consider App Check before launch.
:::

## Payment gateways

Gateways charge a percentage of each transaction rather than a subscription. Typical Indian rates are about **2 % per domestic transaction** (higher for international cards, Amex and some wallets). There is no charge for configuring a gateway in QwikMart — you only pay the provider when you take money.

## SMS gateways (optional)

Only needed if you send OTP or transactional SMS through your own provider (Twilio, MSG91, Fast2SMS, 2Factor) instead of Firebase Phone Auth. Indian senders must register sender IDs and templates on the **DLT** portal first.

## Google Gemini — AI content (optional)

Used by the "Generate with AI" buttons for product descriptions and translations. The Gemini API has a free tier for the Flash models that is enough for a catalogue of a few thousand products; paid usage is billed per token.

## App stores

| Store | Cost |
|---|---|
| Google Play Console | One-time US$25 registration |
| Apple Developer Program | US$99 per year |

## Summary

| Cost | When it starts |
|---|---|
| Firebase Blaze | Immediately (needs a billing account), but most small stores stay within or close to the free quota |
| Domain | Immediately — about ₹800–1,500 per year |
| Phone OTP SMS | From the first OTP above the free allowance |
| Payment gateway | Per transaction |
| Google Play | Once, when you create the developer account |
| Gemini | Only above the free tier, and only if you enable AI |

## Disclaimer

:::danger Third-party fees are your responsibility
Your purchase covers the **source code, the application features and the components listed on the product page**. Charges from Firebase/Google Cloud, payment gateways, SMS providers, e-mail providers, app stores, domains or any other external provider are billed by those providers directly to you. Prices and free tiers change — always confirm current pricing on each provider's website before going live.
:::
