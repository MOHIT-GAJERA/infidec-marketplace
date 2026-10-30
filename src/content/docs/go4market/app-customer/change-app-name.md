---
title: Change App Name
description: Change the name shown under the launcher icon and inside the Customer app.
---

## Launcher name (Android)

```xml title="apps/customer_app/android/app/src/main/AndroidManifest.xml"
<application
    android:label="Your Market"
    …>
```

## In-app name

The app title and texts that mention the brand come from the localisation files:

```json title="apps/customer_app/lib/l10n/app_en.arb"
{
  "appName": "Your Market",
  …
}
```

Change `appName` in `app_en.arb` **and** `app_hi.arb` (and any other language you add). Search both files for "Go4Market" to catch texts such as the welcome line. The localisation classes are regenerated on the next build (`generate: true` in `pubspec.yaml`).

Some brand mentions are written directly in Dart, such as the Refer & Earn share text in `lib/screens/profile/info_screens.dart` and the update dialog in `lib/screens/shell/main_shell.dart`. Search `lib/` for `Go4Market` to find them.

## iOS (optional)

```xml title="apps/customer_app/ios/Runner/Info.plist"
<key>CFBundleDisplayName</key>
<string>Your Market</string>
```

## Store listing name

The name on Google Play is set separately in Play Console (Main store listing). The suggested texts are in `playstore/customer_app/listing.md`.

:::tip Keep the backend in step
Also set the app name in **Admin → Settings → Platform settings** (`appName`). E-mails, the website header and SEO defaults use it.
:::

**Next:** [Change Logo & App Icon →](doc:app-customer/change-app-logo)
