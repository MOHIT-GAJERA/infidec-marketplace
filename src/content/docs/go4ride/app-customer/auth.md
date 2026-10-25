---
title: Phone Login (OTP)
description: How riders sign in with their phone number and a 6-digit SMS code (Firebase Phone Authentication), create their profile, and what to configure in Firebase.
---

Riders sign in with **phone number + SMS code** only. There is no e-mail, social or guest login in the Customer App. The code is sent and checked by **Firebase Phone Authentication**. The app never sees or stores a password.

![Login](/docs/go4ride/images/app-customer-login.webp "Enter the phone number")
![OTP](/docs/go4ride/images/app-customer-otp.webp "Enter the 6-digit code")
![Profile](/docs/go4ride/images/app-customer-profile.webp "First-time profile")

## The flow

:::steps
### Phone number
`lib/features/auth/phone_login_screen.dart`. The rider types the number without the country code. The app adds `defaultDialCode` from `BrandConfig` (**+91** as shipped) and calls Firebase `verifyPhoneNumber`. Button: **Send code**.

### SMS code
`lib/features/auth/otp_screen.dart`: *"We sent a 6-digit code to +91…"*. The rider enters the code and taps **Verify**. **Change phone number** goes back.

### First-time profile
New riders land on **Your profile** (`profile_setup_screen.dart`): *Full name* (required) and *Email (optional)*. **Continue** creates `users/{uid}` with the verified phone number.

### Home
Returning riders go straight to Home. The `onUserProfileCreated` Cloud Function gives the account the `customer` role claim.
:::

The router (`lib/app/router.dart`) handles the redirects: signed out → login, signed in without a `users` document → profile setup, otherwise Home. The Firebase session persists, so riders stay signed in until they tap **Account → Sign out**.

## Firebase checklist

:::steps
### Enable Phone sign-in
Authentication → Sign-in method → **Phone** → Enable.

### Add SHA-1 and SHA-256
Project settings → the Android app → **Add fingerprint** for the debug key, your upload key and, after the first Play upload, the **App signing key** ([Firebase Setup](doc:app-customer/firebase-setup)). Without them Android shows a browser reCAPTCHA page, or the code is never sent.

### SMS region policy
Authentication → Settings → **SMS region policy** → allow only the countries you operate in. This blocks SMS fraud from other regions.

### iOS
Upload an APNs key in Cloud Messaging and add the reversed client ID URL scheme, otherwise phone sign-in on iPhone falls back to reCAPTCHA or fails.
:::

## Test numbers

Authentication → Sign-in method → Phone → **Phone numbers for testing**, for example `+91 90000 00001` → `123456`. No SMS is sent and there is no SMS cost. Use them for development, the emulator and the Google Play reviewer.

:::warning Anyone can use a test number
A test number works for everyone who knows it. Keep one only for your reviewer account, and remove the others before launch.
:::

## Change the country code

The dial code is not chosen in the app. It comes from `BrandConfig.defaultDialCode` in `lib/app/theme_controller.dart`:

```dart title="lib/app/theme_controller.dart"
const go4RideBrand = BrandConfig(
  ...
  defaultCountryCode: 'AE',
  defaultDialCode: '+971',
);
```

The number is validated as a full international number (`+` followed by 7 to 15 digits) before the code is requested.

## Errors riders may see

| Message | Cause |
|---|---|
| *Enter a valid phone number.* | Too short or too long after the dial code is added |
| *Code must be 6 digits.* | Fewer than 6 digits typed |
| *Incorrect code. Please try again.* | Wrong or expired code. Go back and request a new one if it keeps failing |
| *That phone number looks invalid.* | Firebase rejected the number format |
| *Too many attempts. Please try again later.* | Firebase rate limit for this device or number. Wait, or use a test number |
| reCAPTCHA page opens in a browser | SHA fingerprints missing for this build ([Firebase Setup](doc:app-customer/firebase-setup)) |

## Costs

Firebase Phone Auth SMS is billed per message on the Blaze plan, and the price depends on the country. See [Third-Party Service Costs](doc:admin/third-party-costs).

:::note Account deletion
The Customer App has no **Delete account** option yet. Google Play and the App Store require one for apps with sign-in. Plan it before you submit ([Release & Play Store](doc:app-customer/deployment)).
:::

**Next:** [Booking a Ride →](doc:app-customer/booking)
