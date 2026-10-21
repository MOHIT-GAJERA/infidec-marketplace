---
title: General Settings
description: Branding, contact details, currency, tax behaviour, app versions, store links and maintenance — Admin → System Settings.
---

**Admin → System Settings** is split into tabs. Public settings are stored in Firestore `settings/public` and read by every app; tabs marked with a lock (Payment Gateways, SMS, Firebase, SMTP, AI) hold secrets and can only be opened by the **Super Admin**.

![System Settings](/docs/qwikmart/images/admin-settings.jpg "Admin → System Settings → General")

## General tab

| Field | Used for |
|---|---|
| App Name, Tagline | Website title, e-mails, invoices, the apps' about screens |
| Support Email, Support Phone, WhatsApp | Website footer, Contact Us popup, app help screens, e-mails |
| Company Name, Business Address | Invoices, website footer, legal pages |
| Logo, Favicon | Website and e-mails |
| Default Currency, Currency Symbol | Fallback currency (see [Countries](doc:admin/countries)) |
| Timezone | Reports and dashboards |
| Primary Color | Website accent colour |
| Default Country, Default Zone | Pre-selected location for first-time visitors |
| Prices include tax | On: entered prices already include tax (usual in India). Off: tax is added at checkout |
| Demo Mode | Pre-fills demo logins and masks data. **Keep off in production** |
| Cookie consent banner | Shows the cookie notice on the website |
| Social Links | Facebook, Instagram, X, YouTube icons in the website footer |

## App tab

| Field | Notes |
|---|---|
| Min Version (Android / iOS) — Customer and Delivery | Lowest app version you still support |
| Force Update | Saved for the apps' update check |
| Play Store URL / App Store URL (customer and delivery apps) | "Get it on Google Play" badges on the website, share links |
| App Maintenance + Maintenance Message | Saved for the apps' maintenance screen |

:::note Version check in v1.0.1
The store links are used by the website today. The **force update** and **app maintenance** switches are stored for the apps, but QwikMart v1.0.1 apps do not block old versions or show a maintenance screen yet — publish an update through Google Play when you need users to upgrade.
:::

## Maintenance tab

| Field | Notes |
|---|---|
| Maintenance Mode (website) | Website notice; the Admin Panel stays available |
| App Maintenance, Message | See the note above |

## Other tabs

- [Payment Gateways](doc:admin/payment-gateways)
- [SMTP / Email](doc:admin/smtp-settings)
- [SMS Gateway & OTP](doc:admin/sms-settings)
- [Firebase (push)](doc:admin/push-notifications)
- [AI (Google Gemini)](doc:admin/ai-settings)
- [Wallet, Referral & Delivery](doc:admin/wallet-referral-delivery)

Changes are saved instantly; the apps pick them up on their next start (the website on the next page load).
