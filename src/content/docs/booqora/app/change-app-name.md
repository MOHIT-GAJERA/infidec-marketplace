---
title: Change App Name
description: Change the name shown under the launcher icon on Android and iOS, the task-switcher title and the Booqora text inside the Mobile App.
---

The app name appears in three kinds of places: the **launcher label** under the icon, the **window title** used by the task switcher, and **text inside the app** (splash, onboarding, sign-in, About dialog). The store listing name is separate and is set in Play Console or App Store Connect.

Keep the launcher label short. Android and iOS cut off names longer than about 12 characters under the icon.

## 1. Android launcher label

```xml title="booqora_mobile/android/app/src/main/AndroidManifest.xml"
<application
    android:label="YourBrand"
    android:name="${applicationName}"
    android:icon="@mipmap/ic_launcher">
```

## 2. iOS display name

```xml title="booqora_mobile/ios/Runner/Info.plist"
<key>CFBundleDisplayName</key>
<string>YourBrand</string>
```

`CFBundleName` (currently `booqora_mobile`) is the short internal name. You can set it to the same value; it must be 15 characters or fewer.

While you are in `Info.plist`, update the permission texts that mention Booqora:

```xml title="booqora_mobile/ios/Runner/Info.plist"
<key>NSCameraUsageDescription</key>
<string>YourBrand uses the camera to scan barcodes and take product photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>YourBrand lets you choose product photos and your logo from your library.</string>
```

## 3. Flutter app title

```dart title="booqora_mobile/lib/main.dart"
MaterialApp.router(
  title: 'YourBrand',
  // …
)
```

Android uses this title in the recent-apps screen.

## 4. Text inside the app

Search `lib/` for `Booqora` to find every visible occurrence:

```bash title="Terminal"
cd booqora_mobile
grep -rn "Booqora" lib
```

The ones users see first:

| File | What |
|---|---|
| `lib/features/welcome/welcome_pages.dart` | Splash wordmark (`const word = 'Booqora'`), the tagline "Rental management, beautifully simple", the name on the onboarding header, "Welcome to Booqora" on the intro screen |
| `lib/features/auth/auth_pages.dart` | "New to Booqora?" on the sign-in screen |
| `lib/widgets/common.dart` | `AppLogo` with `light: true`: logo mark plus the word "Booqora" |
| `lib/features/home/home_page.dart` | "Welcome to Booqora, …" card for new workspaces |
| `lib/features/more/more_page.dart` | About dialog (`applicationName`) and "Booqora for mobile" under App version |
| `lib/features/home/help_page.dart`, `lib/features/apps/apps_page.dart` | Support e-mail `support@booqora.app`. Replace with your own inbox |
| `lib/features/documents/doc_pdf.dart` | PDF metadata `creator: 'Booqora'` |
| `lib/features/calendar/calendar_page.dart` | Fallback calendar name in the `.ics` export |
| `lib/data/payments.dart` | Fallback merchant name in the Razorpay checkout |
| `lib/features/home/help_articles.dart`, `setup_steps.dart` | Help and setup guide texts |

Several settings screens also mention Booqora in hints and help text. Change what fits your brand; none of them affect how the app works.

:::note Keep the data contract
Do not rename Dart identifiers, Firestore collection names or field names while you rebrand. `lib/data/` is shared with the Rental Platform; a renamed field breaks the link between web and mobile.
:::

## 5. Rebuild

```bash title="Terminal"
flutter clean
flutter run
```

Uninstall the old build first if the launcher still shows the previous name. Some launchers cache labels.

## Checklist

- [x] `android:label` in `AndroidManifest.xml`
- [x] `CFBundleDisplayName` and the two usage descriptions in `Info.plist`
- [x] `title` in `lib/main.dart`
- [x] Visible "Booqora" texts and the support e-mail in `lib/`
- [x] Store listing name in Play Console and App Store Connect

**Next:** [Change Logo & App Icon →](doc:app/change-app-logo)
