---
title: "Sign-in: Email, Google & Phone OTP"
description: How guest browsing, e-mail/password, Google and phone OTP sign-in work in the Customer app, the Complete-your-profile step, and the Firebase settings each one needs.
---

The Customer app supports four ways in:

| Method | Code | Needs |
|---|---|---|
| **Guest** (browse and cart) | Anonymous Firebase session | Anonymous provider enabled |
| **E-mail and password** | `lib/screens/auth/auth_screens.dart` | Email/Password provider |
| **Google** | `lib/core/social_auth.dart` | Google provider, `webClientId`, SHA-1/SHA-256 |
| **Phone OTP** | `lib/screens/auth/phone_auth_screen.dart`, `social_auth.dart` | Phone provider, SHA-256, SMS region policy |

![Phone sign-in](/docs/go4market/images/app-customer-phone-otp.webp "Continue with phone: +91 default, 6-digit code by SMS")
![Verify the code](/docs/go4market/images/app-customer-verify-otp.webp "Enter the code; it is filled in automatically when Android can read it")
![Complete your profile](/docs/go4market/images/app-customer-complete-profile.webp "First sign-in: name, optional e-mail and a referral code")

## Guest to account

Customers start as an **anonymous** user, so the cart works before sign-in. When they sign in with any method, the guest cart is **merged** into their account. Anonymous users can request quotes, but `placeOrder` requires a real account, so checkout asks them to sign in.

## Complete your profile

After the first Google or phone sign-in (or when the profile has no name), the app shows **Complete your profile**: name, optional e-mail and optional referral code. It calls `completeProfile`, which:

- creates the `users/{uid}` document if needed, with a referral code and the `customer` role;
- saves the name, e-mail (lower-cased) and phone (E.164, +91 by default);
- applies the referral code if the user has no orders and no referrer yet;
- sends the welcome e-mail once, when an e-mail is first added.

Clashes with another account's e-mail or phone are returned as **warnings**, not errors.

## Google sign-in setup

1. Firebase → Authentication → Sign-in method → **Google** → enable and copy the **Web client ID**.
2. Put it in `webClientId` in `apps/customer_app/lib/core/social_auth.dart`.
3. Add the SHA-1 and SHA-256 of every signing key (debug, upload, Play app signing) to the Android app in Firebase.

## Phone OTP setup

1. Enable the **Phone** provider.
2. Add the **SHA-256** fingerprints. Android then verifies the app with Play Integrity instead of a reCAPTCHA page.
3. In Authentication → Settings → **SMS region policy**, allow only your countries.
4. For development and Play review, add **test phone numbers** with fixed codes.

:::warning Phone OTP SMS are billed
Firebase charges per verification SMS beyond a small free allowance. Keep the region policy tight and use test numbers while developing.
:::

## Turning a method off

To hide a method, remove its button in `lib/screens/auth/auth_screens.dart` and disable the provider in Firebase. The backend accepts all providers; there is no switch in the Admin panel for this.

**Next:** [Payment Gateways →](doc:app-customer/payment-gateway)
