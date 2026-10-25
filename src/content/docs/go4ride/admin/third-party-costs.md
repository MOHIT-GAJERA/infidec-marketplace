---
title: Third-Party Service Costs
description: Go4Ride is a one-time purchase. The external services it connects to (Firebase, Google Maps, payment gateways, app stores) are billed by their providers, directly to you.
---

Go4Ride is a one-time purchase. The **external services it connects to are not included**. Their providers bill you directly. Infidec charges nothing on this page. You open every account in your own name, with your own billing details, so you keep full control of it.

:::tip Read this before you launch
Most services have a free allowance that covers development and a small fleet with room to spare. Costs start when riders, drivers and trips grow. Know which meter is running and where each free tier ends, and you won't get a surprise bill in month two.
:::

## What is required and what is optional

| Service | Needed for | Can you launch without it? |
|---|---|---|
| **Firebase (Blaze plan)** | Auth, Firestore, Realtime Database, Storage, Cloud Functions, push | **No.** Go4Ride runs on Firebase |
| **Google Maps Platform** | Maps in both apps, place search, routes and distance for fares, address lookup | **No.** Booking needs a route to estimate the fare |
| **Phone OTP SMS** (Firebase Authentication) | Rider and driver login | **No.** Both apps sign in with phone OTP |
| **Payment gateway** (Razorpay, Stripe or PayPal) | Online trip payment and wallet top-up | Yes. Cash and the Go4Ride Wallet work without one |
| **Domain name** | A branded address for the admin panel | Yes, but recommended |
| **Google Play developer account** | Publishing both Android apps | Only if you skip Android |
| **Apple Developer Program** | Publishing on the App Store | Yes. Android works without it |
| **SMTP e-mail** | Not used to send mail in v1.0 (see [Email Templates](doc:admin/email-templates)) | Yes |
| **Admin maps** | Zone drawing and the live driver map | **Nothing to buy.** The admin panel uses OpenStreetMap tiles |

## Firebase

Go4Ride needs the **Blaze (pay-as-you-go)** plan. Cloud Functions, scheduled jobs and the outgoing calls to payment gateways all require it. Blaze still includes the free monthly quota. You only pay for usage above it.

| Product | Free quota (approx.) | What drives the bill |
|---|---|---|
| **Cloud Firestore** | 50,000 reads, 20,000 writes, 20,000 deletes per day. 1 GiB stored | The admin panel's live lists (rides, drivers, users, tickets), the apps' ride screens, and `expireRideRequests` reading open requests every minute |
| **Realtime Database** | 1 GB stored, 10 GB / month downloaded | Online drivers writing their GPS position, and the admin map and rider tracking reading it |
| **Cloud Functions** | 2 million invocations / month, plus free compute time | Every new ride, every status change, every payment, and the two scheduled jobs |
| **Cloud Scheduler** | 3 jobs per billing account free | Go4Ride uses **2** jobs: `expireRideRequests` (every minute) and `dailyAnalyticsRollup` (daily) |
| **Cloud Storage** | 5 GB stored in US regions. Other regions are billed from the first GB, at very small amounts | KYC documents (up to 10 MB each), profile photos, support photos, banners |
| **Authentication** | Email/password sign-in is free | **Phone OTP SMS**: charged per SMS on Blaze. The price depends on the destination country |
| **Cloud Messaging (FCM)** | Free | Nothing |
| **Artifact Registry** | 0.5 GB | Container images of each functions deploy. Accept the cleanup policy the Firebase CLI offers on the first deploy |

:::note Phone OTP costs real money
Every OTP SMS is billed. Protect it: in Firebase Console → **Authentication → Settings → SMS region policy**, allow only the countries you operate in, and add test phone numbers for your own testing (they never send an SMS).
:::

:::warning Set a budget alert on day one
In Google Cloud Console → **Billing → Budgets & alerts**, create a monthly budget (for example ₹3,000 or US$40) with alerts at 50 %, 90 % and 100 %. Alerts don't stop spending, but they warn you within hours if something is wrong.
:::

## Google Maps Platform

Both apps use one Google Maps key (see [Maps & Location](doc:admin/map-settings)). Enable these APIs on it:

| API | Used for |
|---|---|
| **Maps SDK for Android / iOS** | The map on the rider's home and ride screens and the driver's home |
| **Places API** | Pickup and drop search (autocomplete + place details) |
| **Directions API** | Route distance and duration, which the fare estimate is built from |
| **Geocoding API** | Turning a map position into an address |

Google gives each API a free monthly usage allowance and then bills per request. Restrict the key to your package names (`com.go4ride.customer`, `com.go4ride.driver` or your own) and to these APIs, and set a quota so a leaked key can't run up a bill.

## Payment gateways

Gateways charge a percentage of each transaction, not a subscription. Typical rates are about **2 % per domestic transaction** in India with Razorpay. Stripe and PayPal fees vary by country and card type. Setting up a gateway in Go4Ride costs nothing. You only pay the provider when you take money. See [Payment Gateways](doc:admin/payment-gateways).

## App stores

| Store | Cost |
|---|---|
| Google Play Console | One-time US$25 registration (one account publishes both apps) |
| Apple Developer Program | US$99 per year |

## Summary

| Cost | When it starts |
|---|---|
| Firebase Blaze | Right away (a billing account is required). A small fleet usually stays close to the free quota, apart from OTP SMS |
| Phone OTP SMS | From the first real login |
| Google Maps Platform | Above the free monthly allowance of each API |
| Payment gateway | Per transaction |
| Domain | Right away, roughly ₹800–1,500 per year |
| Google Play / App Store | When you create the developer accounts |

## Disclaimer

:::danger Third-party fees are your responsibility
Your purchase covers the **source code, the application features and the components listed on the product page**. Firebase / Google Cloud, Google Maps Platform, payment gateways, app stores, domain registrars and any other external provider bill you directly. Prices and free tiers change. Always check current pricing on each provider's website before going live.
:::
