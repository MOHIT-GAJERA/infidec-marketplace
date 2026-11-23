---
title: Support
description: How to get help with Booqora, what support covers and how to report an issue.
---

## Before you contact us

1. Search these docs (<kbd>Ctrl</kbd> + <kbd>K</kbd>) and read the [FAQs](doc:faqs).
2. For payment problems, open **Settings → Payment providers** in the Rental Platform. Each provider shows whether it is configured on the server and, if it cannot take payments, the reason (missing keys, turned off, or a currency mismatch).
3. Read the **Functions logs** in the Firebase console (or `firebase functions:log --project <your-project-id>`). Payment and e-mail errors are explained there; failed e-mails are also saved with their error in the workspace's `emailLog` collection in Firestore.
4. Check the browser console (Rental Platform, Online Store, Marketing Website) or the `flutter run` output (Mobile App), and the troubleshooting section in [Run the App](doc:app/run-the-app).

## Contact

| Channel | Details |
|---|---|
| E-mail | [contact@infidec.com](mailto:contact@infidec.com) |
| Phone / WhatsApp | [+91 81289 74378](https://wa.me/918128974378) |
| Contact form | [infidec.com contact page](/contact-us?product=booqora) |
| Hours | Monday – Friday, 9:00 AM – 6:00 PM IST |

We reply within **1–2 business days**.

## What to include

- Your **order ID / purchase e-mail**
- Which part: backend (Cloud Functions, rules), Rental Platform, Online Store, Mobile App or Marketing Website, and the version
- What you did, what you expected and what happened
- Screenshots and the exact error text (Functions log, browser console, `flutter run` or `npm run build` output)

### Issue checklist

- [ ] I am on the latest release ([Changelog](doc:changelog))
- [ ] I searched the docs and the [FAQs](doc:faqs)
- [ ] I replaced the author's Firebase project with my own in every `.firebaserc`, `firebase_options.dart` and Google services file
- [ ] The secrets exist in my project and the functions were redeployed after changing them
- [ ] I can reproduce the problem and have the steps written down
- [ ] I attached screenshots and the exact error text, with secrets removed

:::warning Never send secrets
Do not send passwords, service-account keys, payment or SMTP secrets, `functions/.env`, keystores or `key.properties`. If we need access, we will ask for a temporary account.
:::

## What support covers

| Included | Not included |
|---|---|
| Help installing and configuring the product as documented | Custom features or design changes |
| Fixing bugs in the original code | Problems caused by modified code |
| Answering questions about how features work | Third-party service issues (Google, Firebase billing, payment gateways, SMTP providers) |
| Updates and bug-fix releases | App Store / Play Store account issues |

## Installation service

Prefer us to do it for you? Our team can create the Firebase project, deploy the backend, publish the Rental Platform and the Marketing Website on your domain, re-brand and build the Mobile App and publish it on Google Play. See [Installation](/installation).
