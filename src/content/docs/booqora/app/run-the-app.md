---
title: Run the App
description: Install packages, start the Booqora Mobile App on an emulator or phone, and know what works on an emulator and what needs a real device.
---

With Flutter installed and Firebase connected, you can run the app in debug mode in a few minutes.

:::steps
### Get the packages

```bash title="Terminal"
cd booqora_mobile
flutter pub get
```

This also applies the `dependency_overrides` in `pubspec.yaml` (see [Release Build & Keystore](doc:app/deployment#pinned-android-path-provider)).

### Start a device

- **Android emulator**: Android Studio → Device Manager → create a recent Pixel image (API 34 or newer) and start it.
- **Android phone**: enable Developer options and USB debugging, connect the cable and accept the prompt on the phone.
- **iOS simulator** (Mac only): `open -a Simulator`.

List what Flutter can see:

```bash title="Terminal"
flutter devices
```

### Run

```bash title="Terminal"
flutter run
# or pick a device
flutter run -d emulator-5554
```

Press `r` for hot reload and `R` for hot restart. The first Android build downloads Gradle and takes several minutes.
:::

## First launch

1. The native splash appears, then the animated in-app splash.
2. On the very first launch you see four **onboarding** pages, then the **intro** screen with *Create free account* and *I already have an account*.
3. Sign up (or sign in with an account you created on the Rental Platform).
4. A new account goes through the workspace step (`/welcome`) and then lands on **Home**.

![Animated splash](/docs/booqora/images/app-splash.webp "In-app splash")
![Intro screen](/docs/booqora/images/app-intro.webp "Intro: create an account or sign in")
![Sign in](/docs/booqora/images/app-login.webp "Sign in with email and password")

The onboarding is shown once per install. To see it again, clear the app's storage or uninstall and reinstall.

## Emulator notes

| Feature | Emulator | Real phone |
|---|---|---|
| Sign in, orders, inventory, calendar, reports | Works | Works |
| Firestore offline cache | Works | Works |
| Barcode scanner camera | Usually **no** camera. Use **Enter a code manually** on the scan screen | Works |
| Razorpay native checkout | Opens; test payments work with test keys | Works |
| Stripe / PayPal links | Open in the in-app browser | Works |
| PDF share sheet and print preview | Works | Works |

:::tip Camera on the Android emulator
Android Studio can map a virtual scene or your webcam to the emulator camera (Device Manager → Edit → Advanced settings → Camera). Even then, barcode scanning is unreliable. Test scanning on a real phone and use **Enter a code manually** on the scan screen for quick checks.
:::

## Useful commands

```bash title="Terminal"
flutter clean            # wipe build output after changing package name, icons or splash
flutter pub get
flutter analyze          # static checks
flutter test             # tests in test/
flutter run --release    # release-mode run on a connected phone
```

`flutter run --release` uses R8 and your signing config. If `android/key.properties` is missing, release builds fall back to the debug key, so this works before you create a keystore.

## Common problems

| Symptom | Fix |
|---|---|
| `flutter.sdk not set in local.properties` | Run any `flutter` command in `booqora_mobile/` once; Flutter writes `android/local.properties` |
| Sign-in says the user is not found or the app shows nothing | `firebase_options.dart` still points at the author's project. See [Firebase Setup](doc:app/firebase-setup) |
| "No payment provider is available" in Collect online | Payment keys are not configured on the server, or the provider is off in Settings → Payments ([Payment Gateways](doc:admin/payment-gateways)) |
| Gradle out of memory | Close other apps or lower `-Xmx8G` in `android/gradle.properties` |
| iOS build fails on pods | Run `cd ios && pod install --repo-update` on the Mac |

**Next:** [Change Package Name →](doc:app/change-package-name)
