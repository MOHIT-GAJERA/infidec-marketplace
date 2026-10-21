---
title: Login Methods & Phone OTP
description: Guest browsing, phone OTP and e-mail login — how they work and what to configure in Firebase.
---

| Method | How it works |
|---|---|
| **Guest** | On first launch the app signs in anonymously. The guest can browse and fill the cart; when they log in, the cart is kept. |
| **Phone + OTP** | Country code (default from your default country) + number → 6-digit SMS code (Firebase Phone Authentication). |
| **E-mail + password** | Register / login / forgot password (reset e-mail from Firebase). |

After every login the app calls `syncProfile`, which creates or links the customer profile, applies a referral code and stores the push token. Blocked accounts are signed out.

## Firebase checklist

:::steps
### Enable providers
Authentication → Sign-in method → **Phone**, **Email/Password**, **Anonymous**.

### SMS region policy
Authentication → Settings → SMS region policy → allow only your selling countries. Blocked regions show *"SMS verification is not available for this region yet"*.

### SHA fingerprints
Project settings → Android app → add **SHA-1 and SHA-256** for the debug key, your upload key and — after the first Play upload — the **Play App Signing key** (Play Console → Test and release → App integrity → App signing). Without them Android falls back to a browser reCAPTCHA page.

### Download the new google-services.json
Not strictly required for phone auth, but keep the file in sync after adding fingerprints.
:::

## Test numbers

Authentication → Sign-in method → Phone → **Phone numbers for testing**: e.g. `+91 9876543210` → `123456`. No SMS is sent. Useful for development and for Google Play reviewers — but **anyone** can log in with it, so remove it (or keep it only for a dedicated reviewer account) at launch.

## Change the default country code

The phone field uses the dial code of the **default country** (Admin → Countries). Customers can pick another country from the list.

## Account deletion

Profile → **Delete account** calls `deleteAccount`: profile anonymised, addresses/cart/favourites removed, login deleted; orders kept for accounting. Google Play requires this in-app option plus a web page — see [Pages](doc:admin/pages#delete-account-page).

**Next:** [Maps & Location →](doc:app-customer/maps-location)
