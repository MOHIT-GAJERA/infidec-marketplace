---
title: Google Play Listing & Review
description: Create the Booqora Mobile App in Google Play Console, fill in the store listing, App content and Data safety forms, give reviewers access and release through testing tracks.
---

This page follows the release guide that ships with the package, `release/play-store/PLAY_STORE_GUIDE.md`. It contains the listing texts ready to paste, the App content answers and the Data safety table. Replace the Booqora name, URLs and contact details with your own before you submit.

**Before you start:** a Google Play developer account (one-time USD 25) at [play.google.com/console](https://play.google.com/console), and the signed `.aab` from [Release Build & Keystore](doc:app/deployment).

## 1. Create the app

Play Console → **Create app**:

- App name, for example `YourBrand – Rental Management` (max 30 characters).
- Default language: English (India) or English (US).
- **App**, **Free**. Accept the declarations.

## 2. Store listing

Grow → Store presence → **Main store listing**:

| Field | Source |
|---|---|
| Short description (max 80) | `PLAY_STORE_GUIDE.md` section 2, for example "Bookings, inventory, payments & your rental store — managed from your phone." |
| Full description (max 4000) | Section 2: bookings, inventory, payments, documents, calendar, Online Store, reports and Bora |
| App icon | 512 × 512 PNG (`release/play-store/graphics/app-icon-512.png` in the original package) |
| Feature graphic | 1024 × 500 PNG |
| Phone screenshots | 8 screenshots, 1080 × 1920, in order |

Store settings: category **Business**, up to five tags (for example Business management, Invoicing, Inventory, Scheduling, Point of sale), your **contact e-mail**, your **website**, and the **privacy policy URL** `https://<your-platform-domain>/privacy`. The Rental Platform ships a privacy page at `/privacy`; review its content for your business.

## 3. App content

Policy → **App content**. Complete every card:

| Section | Answer |
|---|---|
| Privacy policy | `https://<your-platform-domain>/privacy` |
| Ads | No ads |
| App access | *All or some functionality is restricted*. Add reviewer instructions (below) |
| Content rating | Category *Utility, Productivity, Communication or other*. Answer **No** to violence, sexual content, language, controlled substances and gambling; users interacting or sharing content: **No**. Expected: Everyone / 3+ |
| Target audience | 18 and over (business app) |
| News app / COVID-19 / Government / Health | No |
| Financial features | *Payment processing via third parties*. The app does not hold funds, lend or trade; Razorpay, Stripe and PayPal process payments |
| Data safety | See section 4 |

### Reviewer access

Booqora requires an account, so Google needs a working login. Create a **dedicated demo account** in your own project with a sample workspace (some products, customers, orders and an invoice). In **App access**, add instructions such as:

```text title="App access instructions"
Booqora is a business app that requires an account. Use the demo account below,
which contains a sample rental business with products, customers, orders and an invoice.

Email: <demo-account-email>
Password: <entered in the Console field only>

After signing in you land on the dashboard. Bottom tabs: Home, Orders, Inventory, More.
The centre + button creates orders, products and customers.
Payments run in TEST mode; no real money is charged.
```

:::warning Keep reviewer credentials private
Type the password only into the Play Console field. Never put it in the repository, the listing or a shared document, and keep the account active for as long as the app is published.
:::

## 4. Data safety

- Does the app collect or share required data types? **Yes**
- Is all data encrypted in transit? **Yes**
- Can users request deletion? **Yes**, by e-mail to support as stated in the privacy policy (Google may also ask for an account-deletion URL)

| Data type | Collected | Shared | Purpose | Optional |
|---|---|---|---|---|
| Name | Yes | No | App functionality, Account management | Required |
| Email address | Yes | No | App functionality, Account management, Developer communications | Required |
| Phone number | Yes | No | App functionality | Optional |
| Address | Yes | No | App functionality | Optional |
| Purchase history | Yes | No | App functionality | Required |
| Other financial info (payment status, amounts) | Yes | Yes, with payment processors | App functionality | Optional |
| Photos | Yes | No | App functionality | Optional |
| Other user-generated content (orders, notes) | Yes | No | App functionality | Required |
| Crash logs | No | — | — | — |

Notes: card and UPI details are entered on Razorpay, Stripe or PayPal screens and never reach the app. The camera is used only for on-device barcode scanning. Data processed by Firebase as a service provider does not count as sharing.

## 5. Testing tracks and release

:::steps
### Create a testing release
Test and release → Testing → **Internal testing** (or **Closed testing**) → **Create new release**. Upload the `.aab`, name it `1.0.0 (1)`, add release notes and start the rollout. On the **Testers** tab create an e-mail list and share the opt-in link.

### Use Play App Signing
On the first upload accept **Use Google-generated key**. Google re-signs the app for users; your `.jks` stays the **upload** key. If you lose the upload key, Google can reset it.

### Meet the testing requirement
**New personal developer accounts** must run a **closed test with at least 12 testers for 14 days** in a row before they can apply for production access. Organisation accounts are exempt.

### Choose countries
Test and release → Production → **Countries/regions**: add India and any other markets.

### Promote to production
Production → **Create new release** → *Add from library* → select the tested build → **Send for review**. First reviews usually take 1–7 days.
:::

## 6. Updates

Raise `version` in `pubspec.yaml` (for example `1.0.0+1` → `1.0.1+2`), run `flutter build appbundle --release` and upload the new `app-release.aab` to the same track.

Before going live with real money, switch the server to **live** payment keys and redeploy the functions ([Payment Gateways](doc:admin/payment-gateways)). If you later add Google Sign-In or App Check, register the **App signing key** SHA-256 from *Setup → App integrity* in your Firebase Android app.

## Checklist

- [x] Upload key and passwords backed up
- [x] Listing texts, icon, feature graphic and screenshots show your brand
- [x] Privacy policy reachable at your domain
- [x] Demo account works; password only in the Console
- [x] Data safety and App content completed
- [x] Closed test finished (new personal accounts)

**Next:** [iOS Build & App Store →](doc:app/ios)
