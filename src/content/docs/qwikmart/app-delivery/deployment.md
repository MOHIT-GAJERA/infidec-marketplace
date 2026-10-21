---
title: Release & Play Store
description: Sign, build and publish the Delivery Boy App — including the extra declarations riders' apps need.
---

The signing and build steps are the same as for the customer app ([Release & Play Store](doc:app-customer/deployment)) — with **its own keystore**:

```bash
keytool -genkey -v -keystore /secure/yourstore-delivery-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

```properties title="delivery_app/android/key.properties"
storePassword=<store password>
keyPassword=<key password>
keyAlias=upload
storeFile=C:/secure/yourstore-delivery-upload.jks
```

```bash
cd delivery_app
flutter build appbundle --release --dart-define=FALLBACK_TO_MOCK=false
```

## Play Console — what is different from the customer app

| Item | Delivery app |
|---|---|
| App name | e.g. *YourStore Delivery Partner* |
| Category | **Business** |
| Sign-in details | An **approved** test rider account (e-mail + password) with instructions: *"Tap Go online on Home; assigned orders appear under Active."* |
| Content rating | "Shares user location with other users": **Yes** (customers see the rider during delivery) |
| **Foreground service permissions** | Location — description + video, see [Live Location](doc:app-delivery/location-tracking#google-play-foreground-service-declaration) |
| Data safety | See below |

## Data safety answers (delivery app)

| Data type | Required? | Purpose |
|---|---|---|
| Name, Email, Phone number, Address | Required | Account management, App functionality |
| Other info (date of birth, vehicle) | Required | Account management |
| User IDs | Required | Account management |
| **Precise location** (also while the app is in the background during an online shift) | Required | App functionality |
| Other financial info (bank details, earnings, cash) | Required | App functionality, Account management |
| Photos, Files and docs (licence, ID proof) | Required | Account management |
| Other in-app messages (support chat) | Optional | App functionality |
| Device or other IDs (push token) | Required | App functionality |

Collected, not shared, encrypted in transit, deletion available.

Add the Play App Signing SHA-1/SHA-256 to the delivery app in Firebase after the first upload.

:::tip Riders do not need the public store
You can keep the delivery app on a **closed testing** track and invite riders by e-mail while the public listing is in review.
:::
