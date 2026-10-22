---
title: Third-Party Service Costs
description: Go4Foodie is a one-time purchase. The external services it connects to are billed by their providers, directly to you.
---

Go4Foodie is a one-time purchase. The **external services it connects to are not included**. Their providers bill you directly. Infidec charges nothing on this page. You open every account in your own name, with your own billing details, so you keep full control of it.

:::tip Read this before you launch
Most services have a free allowance that covers development and a small restaurant with room to spare. Costs start when traffic and order volume grow. Know which meter is running and where each free tier ends, and you won't get a surprise bill in month two.
:::

## What is required and what is optional

| Service | Needed for | Can you launch without it? |
|---|---|---|
| **Firebase (Blaze plan)** | Backend function, database, file storage, admin hosting, website hosting | **No.** Go4Foodie runs on Firebase |
| **Domain name** | Website and admin addresses | Yes. You get free `*.web.app` and `*.hosted.app` addresses, but a domain is recommended |
| **Payment gateway** (Razorpay, Stripe or PayPal) | Online payment for orders and gift cards | Yes. See the warning on [Payment Gateways](doc:admin/payment-gateways#no-gateway-demo-mode) first |
| **SMTP e-mail** | Order, reservation and gift card e-mails | Yes, but guests get no e-mails |
| **Google Play developer account** | Publishing the Android app | Only if you skip Android |
| **Apple Developer Program** | Publishing on the App Store | Yes. Android works without it |
| **SMS / maps / push** | Not used | **Nothing to buy.** Go4Foodie sends no SMS, uses no map API and no push service |

## Firebase

Go4Foodie needs the **Blaze (pay-as-you-go)** plan. Cloud Functions, Secret Manager and App Hosting need it, and so do outgoing calls to payment gateways and SMTP. Blaze still includes the free monthly quota. You only pay for usage above it.

| Product | Free quota (approx.) | What drives the bill |
|---|---|---|
| **Cloud Firestore** | 50,000 reads, 20,000 writes, 20,000 deletes per day. 1 GiB stored | Admin screens and reports read whole collections. The live floor and POS listeners read again on every change |
| **Cloud Functions** (`api`) | 2 million invocations / month, plus free compute time | Every page load in the admin panel, the website and the app is one or more API calls |
| **Firebase Authentication** | Custom-token sign-in is free | Nothing. No SMS or phone sign-in is used |
| **Cloud Storage** | 5 GB stored in US regions. Buckets in other regions are billed from the first GB, at very small amounts | Menu images |
| **Firebase Hosting** | 10 GB stored, 360 MB/day transfer | Admin panel downloads (the Flutter Web build is a few MB per first visit) |
| **App Hosting** | Small free allowance (Cloud Run + Cloud Build) | Website traffic and builds |
| **Secret Manager** | A few active secret versions and 10,000 access operations / month | Go4Foodie stores 5 secrets. Each time you change a secret, a new version is created |
| **Artifact Registry** | 0.5 GB | Container images of each function deploy. Accept the cleanup policy the Firebase CLI offers on the first deploy |

:::warning Set a budget alert on day one
In Google Cloud Console → **Billing → Budgets & alerts**, create a monthly budget (for example ₹3,000 or US$40) with alerts at 50 %, 90 % and 100 %. Alerts don't stop spending, but they warn you within hours if something is wrong.
:::

## Payment gateways

Gateways charge a percentage of each transaction, not a subscription. Typical rates are about **2 % per domestic transaction** in India with Razorpay. International cards, Stripe and PayPal fees vary by country. Setting up a gateway in Go4Foodie costs nothing. You only pay the provider when you take money.

## SMTP e-mail

Any SMTP account works: a Gmail / Google Workspace mailbox with an app password, or a transactional provider such as Amazon SES, Brevo, SendGrid, Mailgun or Zoho. Low volumes are usually free. See [SMTP / Email Settings](doc:admin/smtp-settings).

## App stores

| Store | Cost |
|---|---|
| Google Play Console | One-time US$25 registration |
| Apple Developer Program | US$99 per year |

## Summary

| Cost | When it starts |
|---|---|
| Firebase Blaze | Right away (a billing account is required). Most single-restaurant installs stay within or close to the free quota |
| Domain | Right away, roughly ₹800–1,500 per year |
| Payment gateway | Per transaction |
| SMTP provider | Usually only above a free monthly volume |
| Google Play | Once, when you create the developer account |

## Disclaimer

:::danger Third-party fees are your responsibility
Your purchase covers the **source code, the application features and the components listed on the product page**. Firebase / Google Cloud, payment gateways, e-mail providers, app stores, domain registrars and any other external provider bill you directly. Prices and free tiers change. Always check current pricing on each provider's website before going live.
:::
