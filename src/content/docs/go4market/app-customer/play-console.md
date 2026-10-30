---
title: Google Play Listing & Review
description: Create both Go4Market apps in Play Console, use the ready-made listing texts, screenshots and graphics, answer App content (including background location for the Partner app) and release.
---

This page covers **both** apps. The package ships everything you need for the store listing in `playstore/`:

| App | Package (default) | Suggested Play name | Folder |
|---|---|---|---|
| Customer app | `com.go4market.customer` | Go4Market: Grocery, Food & More | `playstore/customer_app/` |
| Partner app | `com.go4market.partner` | Go4Market Partner | `playstore/partner_app/` |

Each folder contains `listing.md` (title, short and full description, ready to paste), `screenshots/` (8 phone screenshots, 1080 × 2400), `graphics/icon_512.png`, `graphics/feature_graphic.png` (1024 × 500) and `video/` (screen recordings). Replace the Go4Market name and screenshots with your own branding before publishing.

![Customer app feature graphic](/docs/go4market/images/playstore-customer-feature.webp "playstore/customer_app/graphics/feature_graphic.png")
![Partner app feature graphic](/docs/go4market/images/playstore-partner-feature.webp "playstore/partner_app/graphics/feature_graphic.png")

## 1. Create the app

[play.google.com/console](https://play.google.com/console) → **Create app**: name, default language, **App**, **Free**. Keep **Google-managed app signing** (Setup → App signing); your upload key signs the uploads.

## 2. Main store listing

Grow → Store presence → **Main store listing**:

- texts from `listing.md`;
- app icon, feature graphic and phone screenshots (in file-name order);
- video: Play accepts only a **YouTube** link, so upload the MP4 from `video/` to YouTube (public or unlisted);
- category: Customer → *Shopping*; Partner → *Business*;
- contact e-mail, website and privacy policy URL (`https://<your-domain>/page/privacy`).

## 3. App content

| Form | Suggested answer |
|---|---|
| Privacy policy | `https://<your-domain>/page/privacy` |
| App access | "Some functionality is restricted". Add demo logins (customer, seller, delivery) and keep **Demo mode** on during review |
| Ads | No ads |
| Content rating | Questionnaire; customer app: users can purchase goods. Expected: Everyone / 3+ |
| Target audience | 18 and over |
| Data safety | Collected: name, e-mail, phone, address and location, purchase history, app interactions, device ID (FCM token). Partner app also: photos (products and documents) and background location for riders. Card data is **not** collected by the app (handled by Razorpay, Stripe and PayPal). Encrypted in transit; users can request deletion |
| Financial features | Customer app: stored-value wallet for purchases on the platform |

### Partner app: background location and foreground service

The Delivery role shares live location while a rider is **Online**, using a foreground service of type *location* and the `ACCESS_BACKGROUND_LOCATION` permission. Play requires a declaration:

- **Description**: "Delivery partners share live location while they are marked Online so customers can track their order and the platform can assign nearby deliveries. Tracking stops when the partner goes Offline."
- **Video**: Online toggle → permission prompt → "You are online" notification → Offline toggle.
- Declare the **foreground service** type *Location* with the same explanation.

:::tip Avoiding the background-location review
Remove `ACCESS_BACKGROUND_LOCATION` from `apps/partner_app/android/app/src/main/AndroidManifest.xml`. Tracking then works while the app is open or the foreground notification is showing, which covers most delivery shifts.
:::

## 4. Release

1. **Testing → Internal testing → Create new release**, upload the `.aab`, add release notes.
2. Install from the opt-in link and check sign-in (e-mail, Google, phone), ordering, payments and notifications on a real phone.
3. **New personal developer accounts** must run a **closed test with at least 12 testers for 14 days** before production access. Organisation accounts can go straight to production.
4. **Production → Create release**, promote the tested build, choose countries and submit. Reviews usually take 1–7 days.

## Checklist

- [x] Upload key backed up; `key.properties` in both apps
- [x] App-signing SHA-1/SHA-256 added to Firebase after the first upload
- [x] Live payment keys; webhook registered
- [x] Privacy, terms and refund pages reviewed
- [x] Demo accounts work and Demo mode is on for the review, then off
- [x] Data safety and location declarations submitted

**Next:** [Partner App Prerequisites →](doc:app-partner/prerequisites)
