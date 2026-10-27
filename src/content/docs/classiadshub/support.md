---
title: Support
description: How to get help with ClassiAds-Hub, what support covers and how to report an issue.
---

## Before you contact us

1. Search these docs (<kbd>Ctrl</kbd> + <kbd>K</kbd>) and read the [FAQs](doc:faqs).
2. Open **Settings → System Status** in the Admin Panel. It checks Firestore, Storage and Auth and shows the project and region the API runs in.
3. Look at the **Cloud Functions logs** (`firebase functions:log`, or Firebase console → Functions → `api` → Logs). Unhandled errors appear as `Unhandled API error`; payment errors carry the gateway's message.
4. Check the browser console and the network tab of the website or the panel: every API answer has a readable `message` and, for form errors, an `errors` object ([Conventions & Errors](doc:api/conventions)).
5. Reproduce it on a **staging project** or with the [Localhost Setup](doc:installation/localhost-setup). It shows whether the problem is in your data or in the code.

## Contact

| Channel | Details |
|---|---|
| Contact form | [infidec.com contact page](/contact-us?product=classiadshub) |
| E-mail | [contact@infidec.com](mailto:contact@infidec.com) |
| Hours | Monday – Friday, 9:00 AM – 6:00 PM IST |

We reply within **1–2 business days**.

## What to include

- Your **order ID / purchase e-mail**
- Which part: Website, Admin Panel, Mobile App or backend (Cloud Functions, rules, indexes), and the version (`1.0.0`)
- Where it runs: your website and panel addresses, the browser, or the Android / iOS version, phone model, emulator or real device
- What you did, what you expected and what happened, with the ad ID, transaction ID or user ID if there is one
- Screenshots and the exact error text: the message on screen, the API response (`message`, `errors`), the browser console, the `flutter run` output or the Functions log line

:::warning Never send secrets
Do not send passwords, service-account keys, `functions/.env`, `secret/prod.env`, gateway secret keys, the Gemini API key or keystores. If we need access to your project, we will ask for a temporary account with limited rights.
:::

## What support covers

| Included | Not included |
|---|---|
| Help installing and configuring the product as documented | Custom features or design changes |
| Fixing bugs in the original code | Problems caused by modified code |
| Answering questions about how features work | Third-party service issues (Google Cloud / Firebase, Google Maps, Stripe, Razorpay, PayPal, Gemini) |
| Updates and bug-fix releases | Google Play / App Store account issues, rejections caused by your listing or content |
| Guidance on the known limitations listed in the [Changelog](doc:changelog) | Firebase billing and quota questions |
| | Adding an SMS or e-mail provider, or integrating the listed-but-unintegrated gateways (Paystack, PhonePe, Flutterwave, PayTabs, DPO) |

## Installation service

Prefer us to do it? Our team can create and configure your Firebase project, deploy the backend, publish the website and the Admin Panel on your domains, load your categories, custom fields and locations, set up Stripe, Razorpay or PayPal, re-brand the app with your name, logo and colours, and publish it on Google Play. See [Installation](/installation).

**Next:** [FAQs →](doc:faqs)
