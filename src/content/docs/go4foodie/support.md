---
title: Support
description: How to get help with Go4Foodie, what support covers and how to report an issue.
---

## Before you contact us

1. Search these docs (<kbd>Ctrl</kbd> + <kbd>K</kbd>) and read the [FAQs](doc:faqs).
2. Check the troubleshooting table in [Run the App](doc:app/run-the-app#troubleshooting) and the error list in [Errors](doc:api/errors).
3. Look at the **Functions logs** of the `api` function (`firebase functions:log` or the Firebase console). Most errors are explained there.

## Contact

| Channel | Details |
|---|---|
| E-mail | [contact@infidec.com](mailto:contact@infidec.com) |
| Contact form | [infidec.com contact page](/contact-us?product=go4foodie) |
| Hours | Monday – Friday, 9:00 AM – 6:00 PM IST |

We reply within **1–2 business days**.

## What to include

- Your **order ID / purchase e-mail**
- Which part: backend (Cloud Function), Admin Panel, website, or mobile app (and which mode: Customer, Restaurant or Owner), plus the version
- What you did, what you expected and what happened
- Screenshots and the exact error text (Functions log, browser console, the toast in the app, or the `flutter run` output)

:::warning Never send secrets
Do not send passwords, service-account keys, `AUTH_SECRET`, payment secrets, SMTP passwords or keystores. If we need access we will ask for a temporary account.
:::

## What support covers

| Included | Not included |
|---|---|
| Help installing and configuring the product as documented | Custom features or design changes |
| Fixing bugs in the original code | Problems caused by modified code |
| Answering questions about how features work | Third-party service issues (Google / Firebase, payment gateways, SMTP providers) |
| Updates and bug-fix releases | Server administration, App Store / Play Store account issues |

## Installation service

Prefer us to do everything? Our team can create the Firebase project, deploy the backend and the Admin Panel, migrate your existing data, host the website on your domain, re-brand and build the mobile app and publish it on Google Play. See [Installation](/installation).
