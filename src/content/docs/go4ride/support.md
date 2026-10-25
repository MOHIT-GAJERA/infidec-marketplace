---
title: Support
description: How to get help with Go4Ride, what support covers and how to report an issue.
---

## Before you contact us

1. Search these docs (<kbd>Ctrl</kbd> + <kbd>K</kbd>) and read the [FAQs](doc:faqs).
2. Check the troubleshooting tables in [Customer App → Run the App](doc:app-customer/run-the-app#troubleshooting) and [Driver App → Run the App](doc:app-driver/run-the-app#troubleshooting).
3. Look at the **Cloud Functions logs** (`firebase functions:log`, or Firebase console → Functions → Logs). Dispatch, settlement, payment and KYC errors are written there.
4. Reproduce it against the **Firebase Emulator Suite** if you can ([Localhost & Emulators](doc:installation/localhost-setup)). It shows whether the problem is in your data or in the code.

## Contact

| Channel | Details |
|---|---|
| E-mail | [contact@infidec.com](mailto:contact@infidec.com) |
| Contact form | [infidec.com contact page](/contact-us?product=go4ride) |
| Hours | Monday – Friday, 9:00 AM – 6:00 PM IST |

We reply within **1–2 business days**.

## What to include

- Your **order ID / purchase e-mail**
- Which part: Customer App, Driver App, Admin Panel or backend (Cloud Functions, rules), and the version (`1.0.0`)
- Platform and device: Android version or iOS version, phone model, emulator or real device
- What you did, what you expected and what happened, with the ride ID or ticket ID if there is one
- Screenshots and the exact error text: the toast in the app, the `flutter run` output, the browser console of the Admin Panel or the Functions log line

:::warning Never send secrets
Do not send passwords, service-account keys, `secret/app_keys.env`, gateway secret keys, SMTP passwords or keystores. If we need access to your project, we will ask for a temporary account with limited rights.
:::

## What support covers

| Included | Not included |
|---|---|
| Help installing and configuring the product as documented | Custom features or design changes |
| Fixing bugs in the original code | Problems caused by modified code |
| Answering questions about how features work | Third-party service issues (Google Cloud / Firebase, Google Maps, payment gateways, SMS delivery, SMTP providers) |
| Updates and bug-fix releases | Google Play / App Store account issues, rejections caused by your listing or content |
| Guidance on the known limitations listed in the [Changelog](doc:changelog) | Firebase billing and quota questions |

## Installation service

Prefer us to do it? Our team can create and configure your Firebase project, deploy the backend and the Admin Panel on your domain, load your catalogue, re-brand both apps with your name, logo and colours, set up the Maps key and payment gateways, and publish the Customer and Driver apps on Google Play. See [Installation](/installation).
