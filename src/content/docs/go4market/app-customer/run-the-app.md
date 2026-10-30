---
title: Run the App
description: Run the Customer app on an emulator or phone, sign in with the demo customer, and fix the most common start-up problems.
---

## Run

```bash
cd apps/customer_app
flutter pub get
flutter run                 # choose an emulator or a USB-connected phone
```

`flutter run` builds a debug APK signed with your debug key. On first start the app shows the splash screen and onboarding, then the home screen as a **guest** (anonymous session) so customers can browse and fill a cart before signing in.

Sign in with the demo customer account listed in [Demo Instructions](doc:admin/demo-instructions), or tap **Fill demo account** while Demo mode is on.

![Customer app sign-in](/docs/go4market/images/app-customer-login.webp "Sign in with e-mail, Google or Phone, or continue as guest")

## Release build on a device

```bash
flutter run --release
# or
flutter build apk --release      # build/app/outputs/flutter-apk/app-release.apk
```

Release builds use R8 (`isMinifyEnabled = true`, `isShrinkResources = true`) with the keep rules in `android/app/proguard-rules.pro` for Razorpay, Firebase and notifications. Without `android/key.properties`, release builds are signed with the debug key (fine for testing, rejected by Play).

## Troubleshooting

| Problem | Fix |
|---|---|
| `No matching client found for package name` | `google-services.json` does not contain your package name; download it again after registering the app |
| Google sign-in: `ApiException: 10` | SHA-1/SHA-256 of the signing key not in Firebase, or `webClientId` is not the **web** client ID |
| Phone OTP: `missing-client-identifier` / reCAPTCHA every time | Add SHA-256, and make sure the Play Integrity API is enabled for the project |
| Phone OTP: `This request is missing a valid app identifier` | Package name in Firebase and `applicationId` differ |
| `PERMISSION_DENIED` on Firestore | Rules not deployed, or the app points to another project (`firebase_options.dart`) |
| `NOT_FOUND` / `internal` on callable functions | Functions not deployed in `asia-south1`, or a different region set in `kFunctionsRegion` |
| Home screen empty | The project is not seeded or the modules are disabled |
| Map tiles missing | No internet, or the device blocks `tile.openstreetmap.org` |

**Next:** [Change Package Name →](doc:app-customer/change-package-name)
