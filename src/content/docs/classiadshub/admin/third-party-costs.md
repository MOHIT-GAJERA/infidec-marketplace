---
title: Third-Party Service Costs
description: ClassiAds-Hub is a one-time purchase. The external services it connects to (Firebase, Google Maps, payment gateways, app stores) are billed by their providers, directly to you.
---

ClassiAds-Hub is a one-time purchase. The **external services it connects to are not included**. Their providers bill you directly. Infidec charges nothing on this page. You open every account in your own name, with your own billing details, so you keep full control of it.

:::tip Read this before you launch
Most services have a free allowance that covers development and a small marketplace with room to spare. Costs start when ads, users and traffic grow. Know which meter is running and where each free tier ends, and you won't get a surprise bill in month two.
:::

## What is required and what is optional

| Service | Needed for | Can you launch without it? |
|---|---|---|
| **Firebase (Blaze plan)** | Cloud Functions API, Firestore, Auth, Storage, FCM, Hosting, Secret Manager | **No.** ClassiAds-Hub runs on Firebase |
| **Payment gateway** (Stripe, Razorpay or PayPal) | Selling subscription packages and featured-ad plans on the website | Yes. Free posting works without one, and **Bank Transfer** needs no gateway account |
| **Google Maps Platform** | The map widgets in the mobile app | Yes, but the app's map screens need a key |
| **Domain names** | Branded addresses for the website and the Admin Panel | Yes (`*.web.app` addresses are free), but recommended |
| **Google Play developer account** | Publishing the Android app | Only if you skip Android |
| **Apple Developer Program** | Publishing on the App Store, Sign in with Apple | Yes. Android works without it |
| **Google Gemini API** | AI drafts for titles, descriptions and blog posts in the Admin Panel | Yes. Without a key the panel returns draft templates |
| **SMS or e-mail provider** | Not used: v1.0.0 sends no SMS or e-mail. See the note below | Yes |
| **Admin maps** | The location picker in the Admin Panel | **Nothing to buy.** It uses OpenStreetMap tiles through Leaflet |

:::note No SMS or e-mail is sent in v1.0.0
The OTP code is generated and stored by the API. In **Test mode** (the `log` provider) the code is returned to the website and the app and shown on screen. The Twilio / MSG91 options and the e-mail templates are stored settings only: the backend has no SMS or e-mail sender yet. So there is no SMS or SMTP bill, but you need to add a sender before you rely on OTP or password-reset codes in production. See [Login, OTP & Notification Settings](doc:admin/otp-notifications).
:::

## Firebase

ClassiAds-Hub needs the **Blaze (pay-as-you-go)** plan. Cloud Functions, Secret Manager, the scheduled job and outgoing calls to the payment gateways all require it. Blaze still includes the free monthly quota. You only pay for usage above it.

| Product | Free quota (approx.) | What drives the bill |
|---|---|---|
| **Cloud Functions** | 2 million invocations / month, plus free compute time | Every API call from the website, the Admin Panel and the app goes through the `api` function (512 MiB, up to 20 instances) |
| **Cloud Firestore** | 50,000 reads, 20,000 writes, 20,000 deletes per day. 1 GiB stored | Listings, search and the dashboard. Many endpoints load a whole collection and filter it in memory (for example all approved ads, cached ~10 s per instance), so reads grow with the size of your catalogue |
| **Cloud Storage** | 5 GB stored in US regions | Ad photos (up to 5 MB each, 10 per ad by default), avatars, banners, KYC documents, receipts, résumés |
| **Firebase Hosting** | 10 GB stored, 360 MB / day transferred | Two static sites: the website and the Admin Panel |
| **Authentication** | E-mail/password and Google sign-in are free | Nothing for v1.0.0 (Firebase Phone Auth is not used) |
| **Cloud Messaging (FCM)** | Free | Nothing |
| **Secret Manager** | A few active secret versions free | Three secrets: `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `PAYPAL_CLIENT_SECRET` |
| **Cloud Scheduler** | 3 jobs per billing account free | ClassiAds-Hub uses **1** job: `housekeeping` (every 60 minutes) |
| **Artifact Registry** | 0.5 GB | Container images of each functions deploy. Accept the cleanup policy the Firebase CLI offers on the first deploy |

:::warning Set a budget alert on day one
In Google Cloud Console → **Billing → Budgets & alerts**, create a monthly budget (for example US$25) with alerts at 50 %, 90 % and 100 %. Alerts don't stop spending, but they warn you within hours if something is wrong.
:::

## Google Maps Platform

Only the **mobile app** uses Google Maps (the `google_maps_flutter` map widgets). Enable **Maps SDK for Android** and **Maps SDK for iOS** on the key. See [Google Maps & Location](doc:app/maps-location).

The website's *Nearby* page uses the browser's location and the API's distance search, and the Admin Panel uses OpenStreetMap, so neither needs a Maps key. The **Google Maps / Places key** field in **Settings → Web Settings** is stored but not used by the website in v1.0.0.

Google gives each API a free monthly usage allowance and then bills per request. Restrict the key to your Android package name and iOS bundle ID, and set a quota so a leaked key can't run up a bill.

## Payment gateways

Gateways charge a percentage of each transaction, not a subscription. Stripe, Razorpay and PayPal fees vary by country, card type and payment method. Setting up a gateway in ClassiAds-Hub costs nothing. You only pay the provider when you take money. **Bank Transfer** has no gateway fee; your bank may charge its own. See [Payment Gateways](doc:admin/payment-gateways).

Paystack, PhonePe, Flutterwave, PayTabs and DPO appear in the gateway list but have no integration in v1.0.0, so there is nothing to sign up for.

## Ad networks

The **AdMob** and **AdSense** settings pages store your publisher and unit IDs, but neither SDK is wired into the app or the website in v1.0.0 (the app's banner slot renders nothing). They earn nothing and cost nothing until you add the integration. See [AdMob, AdSense & Video Ads](doc:admin/ad-networks).

## Google Gemini

**Settings → Gemini AI** with the *Google Gemini* provider calls the `gemini-2.0-flash` model with your API key whenever an admin generates text. Google bills per token above the free tier. Choose *Draft templates (no key)* or *Disabled* to avoid any cost. See [Gemini AI](doc:admin/ai-settings).

## App stores

| Store | Cost |
|---|---|
| Google Play Console | One-time US$25 registration |
| Apple Developer Program | US$99 per year |

The app sells nothing, so there is no store commission.

## Summary

| Cost | When it starts |
|---|---|
| Firebase Blaze | Right away (a billing account is required). A small marketplace usually stays close to the free quota |
| Payment gateway | Per transaction on the website |
| Google Maps Platform | Above the free monthly allowance, for the app's maps |
| Gemini API | Only if you choose the Google Gemini provider |
| Domains | Right away, per year |
| Google Play / App Store | When you create the developer accounts |

## Disclaimer

:::danger Third-party fees are your responsibility
Your purchase covers the **source code, the application features and the components listed on the product page**. Firebase / Google Cloud, Google Maps Platform, payment gateways, Google Gemini, app stores, domain registrars and any other external provider bill you directly. Prices and free tiers change. Always check current pricing on each provider's website before going live.
:::

**Next:** [Installation Overview →](doc:installation/overview)
