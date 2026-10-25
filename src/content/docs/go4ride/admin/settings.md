---
title: General & App Settings
description: The 22 settings pages of the Go4Ride admin panel: general, app settings, driver & ride rules, languages, taxes, currencies, landing page, content pages, contact details and the help and cancellation reasons.
---

**Admin → System → Settings** (*"Platform configuration"*) opens a settings hub: a second column lists every settings page, grouped, and the selected page opens beside it. On narrow windows the list becomes a row of chips.

![Settings](/docs/go4ride/images/admin-settings.jpg "Admin → Settings: the settings navigation and the selected page")

| Group | Pages |
|---|---|
| **App setup** | General · App theme & versions · App settings · Map settings · Languages · Maintenance mode |
| **Business rules** | Business model · Fare & pricing · Driver & ride · Surge pricing · Taxes · Currencies |
| **Integrations** | Payment methods · Payment secrets · SMTP |
| **Content & pages** | Landing page · About app · Privacy policy · Terms & conditions · Contact us |
| **Support** | Cancellation reasons · Help reasons |

Some pages have their own guide:

| Page | Guide |
|---|---|
| App theme & versions, Maintenance mode | [Maintenance Mode & App Versions](doc:admin/maintenance) |
| Map settings | [Maps & Location](doc:admin/map-settings) |
| Business model | [Commission, Wallet & Settlement](doc:admin/commission-wallet) |
| Fare & pricing, Surge pricing | [Zones, Fares & Surge](doc:admin/zones) |
| Payment methods, Payment secrets | [Payment Gateways](doc:admin/payment-gateways) |
| SMTP | [Email Templates](doc:admin/email-templates) |

## How settings pages work

- Each settings page is **one document**: `settings/{page}` (readable by the apps, no secrets) or `secure_settings/{page}` (Payment secrets and SMTP; admins and Cloud Functions only).
- Fields show their default value until you save. When you change something, a black **Unsaved changes** bar appears with **Discard** and **Save changes**. Missing required fields give *"Fill in: Support email, Support phone"*.
- The apps listen to these documents, so most changes take effect **immediately**, without an app update.
- Only the **admin** role can save settings (security rules).

## General

*"Platform identity and regional defaults."* (`settings/general`)

| Section | Field | Default |
|---|---|---|
| **Platform** (*Names shown in apps, emails and receipts*) | Platform name | `Go4Ride` |
| | Legal company name | — |
| | GSTIN | e.g. `22AAAAA0000A1Z5` |
| | Website | `https://yourdomain.com` |
| **Region** (*Defaults for new users and fares*) | Default country code | `+91` |
| | Currency code | `INR` |
| | Time zone | `Asia/Kolkata` |
| | Distance unit | Kilometres / Miles |

:::note Brand and currency come from the app build
In v1.0 the apps take their name, currency symbol (₹), currency code and default dial code (+91) from the **brand configuration compiled into each app**, not from this page. Change them when you [brand the Customer App](doc:app-customer/branding) and the [Driver App](doc:app-driver/branding). Keep this page in step for your records.
:::

## App settings

`settings/app`

| Section | Field | Default | Used by v1.0 |
|---|---|---|---|
| **Refer & earn · Emergency** | Referral programme | On | Stored |
| | Referrer reward | ₹50 (*credited when the invited user completes their first ride*) | Stored |
| | New user reward | ₹25 | Stored |
| | Emergency phone number | `112` | **Yes**: the SOS dialog and account screens of both apps (**Call 112**) |
| **Wallet** | Minimum top-up | ₹50 | **Yes**: top-up sheet and `createPayment` |
| | Maximum top-up | ₹10,000 | **Yes**: top-up sheet and `createPayment` |
| | Minimum driver withdrawal | ₹100 | **Yes**: Driver App withdrawal sheet |
| **Loyalty programme** | Loyalty points | Off | Stored |
| | Points per completed ride | 5 | Stored |
| | Value of one point | ₹0.50 | Stored |
| | Minimum points to redeem | 100 | Stored |

:::note Referral and loyalty in v1.0
The referral and loyalty values are saved and the rider profile has `referralCode` and `loyaltyPoints` fields, but v1.0 has no function that credits referral rewards or awards points. Treat these sections as configuration for a future update.
:::

## Driver & ride

`settings/driver_ride`

| Section | Field | Default | Effect in v1.0 |
|---|---|---|---|
| **Driver verification** | Require document verification | On | Stored |
| | Auto-approve drivers | Off | Stored (no automatic approval yet) |
| **Dispatch** (*How ride requests reach drivers*) | Search radius (km) | 5 | `onRideCreated`: only drivers within this distance get the push |
| | Driver location update (seconds) | 10 | Stored |
| | Driver accept window (seconds) | 30 | Countdown on the Driver App's request card |
| | Auto-cancel unaccepted ride (seconds) | 180 | `expireRideRequests` closes older requests as *no drivers found* |
| | Minimum driver wallet to accept rides | ₹0 | Drivers below it can't go online and get no requests |
| | Free waiting minutes | 3 | Driver App waiting timer: *"Free waiting · 2:41 left"* |
| | Waiting charge per minute | ₹2 | Shown on the timer after the free minutes |

See [Dispatch](doc:admin/dispatch#how-ride-requests-reach-drivers) for the matching rules.

:::note Waiting charges
The Driver App counts free and chargeable waiting time and shows the amount, but v1.0 doesn't add it to the ride's fare. Collect it in cash or leave it at zero.
:::

## Languages, Taxes and Currencies

Three small lists, each with **Load defaults** on an empty page:

| Page | Fields | Defaults |
|---|---|---|
| **Languages** (`languages`) | Name, Code, Native name, Right-to-left, Default, Active | English (default), Hindi, Gujarati active; Marathi, Arabic inactive |
| **Taxes** (`taxes`) | Name, Tax amount, Type (Percentage / Fixed), Country, Active | *GST (cab)* 5 % India |
| **Currencies** (`currencies`) | Name (code), Symbol, Symbol side (Left / Right), Decimals, Default, Active | INR ₹ (default), USD $ inactive |

Active **languages** appear as tabs in the content page editor below. In v1.0 the tax applied to fares is the **Tax %** on [Fare & pricing](doc:admin/zones#fare-pricing-global-rates), and the currency shown in the apps comes from the app build; the Taxes and Currencies lists are reference data.

## Content pages: About, Privacy policy, Terms

**About app**, **Privacy policy** and **Terms & conditions** each open an editor:

- **Customer app / Driver app** switch: each app has its own version (`content_pages/{page}_{customer|driver}`).
- A tab per active language. *"Markdown supported. Only the default language is required; others fall back to it."*
- A **Page title** and a Markdown body with a toolbar: Heading, Bold, Italic, Bullet list, Numbered list, Link, Divider.
- The button reads **Save changes** when there are edits, **Saved** otherwise.

The apps show the page in the phone's language, falling back to English. Publish real privacy and terms pages before you submit to the stores.

## Contact us

*"Shown on the help screens of both apps and on the website."* (`settings/contact`)

| Field | Rule |
|---|---|
| Support email | Required, e.g. `support@yourcompany.com` |
| Support phone | Required, e.g. `+91 90000 00001` |
| WhatsApp number | Optional. Adds a WhatsApp button |
| Support hours | Default `24 × 7` |
| Office address | Optional |

## Landing page

`settings/landing` stores content for a public marketing website: **Branding & SEO** (brand name, tagline, primary colour `#FABE24`, SEO title and description, logo) and **Hero section** (badge text, title, subtitle, image, Play Store and App Store links). The package doesn't include a website that reads it in v1.0; use the values for your own site.

## Help & cancellation reasons

| Page | Fields | Where it appears |
|---|---|---|
| **Help reasons** (`help_reasons`) | Title, Description, Type (Customer / Driver), Allow image upload, Display order, Active | The help centre topics in each app. *Allow image upload* shows the photo picker on the ticket form |
| **Cancellation reasons** (`cancel_reasons`) | Reason, Shown to (Customer / Driver), Display order, Active | The cancel sheet in the Customer App and the Driver App |

Defaults: 4 rider and 5 driver help reasons (*Lost item in vehicle*, *Payment issue*, *Rider did not show up*…), and 4 rider and 3 driver cancellation reasons (*Driver is taking too long*, *Booked by mistake*, *Rider not at pickup*, *Vehicle issue*…).

**Next:** [Maps & Location →](doc:admin/map-settings)
