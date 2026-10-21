---
title: Change App Name, Logo & Colour
description: Re-brand the Delivery Boy App — launcher name, icon, splash, colours, texts.
---

| What | Where |
|---|---|
| Launcher name (Android) | `android/app/src/main/AndroidManifest.xml` → `android:label="YourStore Delivery"` |
| Name on iOS | `ios/Runner/Info.plist` → `CFBundleDisplayName` |
| Name inside the app | `lib/core/config.dart` → `appName` |
| Support contact | `lib/core/config.dart` → `supportPhone`, `supportEmail` |
| Brand colours | `lib/core/theme.dart` → `AppColors.primary`, `primaryDark`, … |
| Texts (English, Hindi, Arabic) | `lib/core/l10n.dart` |
| Online notification text | `lib/core/location_service.dart` → `ForegroundNotificationConfig` (`notificationTitle`, `notificationText`) |

## Icon and splash

Replace the images in `delivery_app/assets/icon/` (`app_icon.png`, `app_icon_foreground.png`, `app_icon_monochrome.png`, `app_icon_round.png`, `play_store_512.png`, `splash_*.png`), set the adaptive icon background colour in `flutter_launcher_icons.yaml`, then:

```bash
cd delivery_app
dart run flutter_launcher_icons
dart run flutter_native_splash:create
```

Details and image sizes are the same as for the customer app — see [Change App Logo & Splash](doc:app-customer/change-app-logo).

**Next:** [Rider Registration & Approval →](doc:app-delivery/registration)
