---
title: Change App Name
description: Change the name shown under the app icon and inside the app.
---

| Where | File | Value |
|---|---|---|
| Android launcher name | `android/app/src/main/AndroidManifest.xml` | `android:label="YourStore"` |
| iOS home-screen name | `ios/Runner/Info.plist` | `CFBundleDisplayName` → `YourStore` (and `CFBundleName`) |
| Name used inside the app | `lib/core/config.dart` | `static const String appName = 'YourStore';` |
| Support contact in the app | `lib/core/config.dart` | `supportEmail`, `supportPhone` |
| Translated texts | `assets/l10n/en.json`, `hi.json`, `ar.json` | search for "QwikMart" and replace |

```xml title="android/app/src/main/AndroidManifest.xml"
<application
    android:label="YourStore"
    ...>
```

The name customers see in e-mails, on invoices and on the website comes from **Admin → System Settings → General → App Name**.

Rebuild the app after the change (`flutter run`). Keep the Play Store listing name consistent with the launcher name.

**Next:** [Change App Logo & Splash →](doc:app-customer/change-app-logo)
