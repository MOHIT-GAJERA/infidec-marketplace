---
title: App Prerequisites
description: What the Go4Market Partner app is (one app for sellers and delivery partners), what you need before building it, and how the project is organised.
---

The **Partner app** (`apps/partner_app`, package `com.go4market.partner`) is **one** Flutter app with **two roles**:

| Role | For | Highlights |
|---|---|---|
| **Seller** | Store owners and staff | Dashboard, orders (accept, pack, assign rider, pickup OTP), products and stock, **POS with camera barcode scanner**, coupons, returns, reviews, own riders, earnings and withdrawals |
| **Delivery** | Delivery partners | Online/offline, live location in a foreground service, delivery pool, active delivery with OTP and cash, history, earnings and withdrawals |

On the login screen the user picks **Seller** or **Delivery**. The app then opens the right shell based on the user's `role` claim.

![Partner app login, Delivery role](/docs/go4market/images/app-partner-login-delivery.webp "The Partner app login with the Delivery role selected")

## Before you start

- [x] The backend is deployed and seeded ([Installation](doc:installation/overview))
- [x] `packages/g4m_core/lib/src/firebase_options.dart` has your **partner** Android app ID (`androidPartner`)
- [x] You have chosen your package name (for example `com.yourmarket.partner`)

## Tools

Flutter 3.41 stable (Dart 3.11), Android Studio with the current SDK, JDK 17, and a **real phone** for camera scanning and location tracking.

```bash
cd apps/partner_app
flutter pub get
```

## Project layout

```text title="apps/partner_app/"
android/                     Gradle (Kotlin DSL), manifest, google-services.json, key.properties.example
assets/branding/             app_icon.png, logo.png, splash_android12.png
lib/main.dart · lib/app.dart entry point and MaterialApp
lib/core/                    session, push, location_service (foreground tracking), social_auth,
                             partner_theme (role colours), l10n (EN/HI), device (map, store URL)
lib/features/auth/           login, sign-up, role chooser, forgot password, OTP
lib/features/seller/         dashboard, orders, POS, products, stock, coupons, returns, reviews,
                             riders, earnings, store settings, registration
lib/features/delivery/       home, orders, active delivery, history, earnings, profile, registration
lib/features/common/         notifications, withdrawals, help, preferences, version gate
```

## Key packages

`firebase_*` (core, auth, firestore, functions, storage, messaging), `flutter_local_notifications`, `google_sign_in`, `geolocator` + `permission_handler` (tracking), `flutter_map` (OpenStreetMap), `mobile_scanner` (barcode), `image_picker` (product photos, documents), `fl_chart` (sales charts), `url_launcher`, `share_plus`, `package_info_plus`.

**Next:** [Firebase Setup →](doc:app-partner/firebase-setup)
