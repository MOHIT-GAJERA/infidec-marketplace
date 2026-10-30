---
title: Support
description: How to get help with Go4Market, what support covers and how to report an issue.
---

## Before you contact us

1. Search these docs (<kbd>Ctrl</kbd> + <kbd>K</kbd>) and read the [FAQs](doc:faqs).
2. Open **Admin → System health** to see which integrations are configured and whether a backup or index is failing.
3. Read the **Functions logs** in the Firebase console (or `firebase functions:log`). Most errors are explained there.
4. Check the troubleshooting tables in [Customer App → Run the App](doc:app-customer/run-the-app#troubleshooting) and [Partner App → Run the App](doc:app-partner/run-the-app#troubleshooting).

## Contact

| Channel | Details |
|---|---|
| E-mail | [contact@infidec.com](mailto:contact@infidec.com) |
| Phone / WhatsApp | [+91 81289 74378](https://wa.me/918128974378) |
| Contact form | [infidec.com contact page](/contact-us?product=go4market) |
| Hours | Monday – Friday, 9:00 AM – 6:00 PM IST |

We reply within **1–2 business days**.

## What to include

- Your **order ID / purchase e-mail**
- Which part: backend, website, Admin / Seller / Delivery panel, Customer app or Partner app, and the version
- What you did, what you expected and what happened
- Screenshots and the exact error text (Functions log, browser console or `flutter run` output)

:::warning Never send secrets
Do not send passwords, service-account keys, payment secrets, `functions/.env` or keystores. If we need access, we will ask for a temporary account.
:::

## What support covers

| Included | Not included |
|---|---|
| Help installing and configuring the product as documented | Custom features or design changes |
| Fixing bugs in the original code | Problems caused by modified code |
| Answering questions about how features work | Third-party service issues (Google, payment gateways, SMS providers) |
| Updates and bug-fix releases | App Store / Play Store account issues |

## Installation service

Prefer us to do it for you? Our team can create the Firebase project, deploy the backend, publish the website and panels on your domain, re-brand and build both apps and publish them on Google Play. See [Installation](/installation).
