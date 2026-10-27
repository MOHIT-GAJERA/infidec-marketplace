---
title: Run the App
description: Run the ClassiAds-Hub app on an emulator or phone against your Firebase project, walk through a first test, and fix the most common problems.
---

```bash
cd mobile
flutter pub get
flutter devices                 # list emulators and phones
```

| Goal | Command (from `mobile/`) |
|---|---|
| Debug run against the API in `app_config.dart` | `flutter run` |
| Another API without editing the file | `flutter run --dart-define=API_BASE_URL=https://us-central1-your-project-id.cloudfunctions.net/api/v1` |
| A specific device | add `-d <device-id>` |
| Release build on a phone | `flutter run --release` (signed with your upload key if `android/key.properties` exists, otherwise the debug key) |
| Local Functions emulator | `flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5001/your-project-id/us-central1/api/v1` ([API Configuration](doc:app/api-configuration#local-backend-emulator)) |

Use an Android emulator image **with Google Play**. Without Play services there is no FCM token, Google sign-in fails and the map may not load.

:::tip VS Code / Android Studio
Put the `--dart-define` in your run configuration once, for example in `.vscode/launch.json`: `"args": ["--dart-define=API_BASE_URL=https://www.yourcompany.com/api/v1"]`.
:::

## Before the first run

- [Firebase Setup](doc:app/firebase-setup) done for **your** project, Email/Password (and Google) enabled.
- The API base URL points at your deployed `api` function ([API Configuration](doc:app/api-configuration)).
- At least a few categories, custom fields and locations exist, and some approved ads (or use **Dummy Data** in the Admin Panel, [System Status, Logs & Dummy Data](doc:admin/system-status)).
- The Maps key is yours ([Google Maps & Location](doc:app/maps-location)).

## First test walkthrough

Use two accounts, A (seller) and B (buyer), on two devices or one after the other.

:::steps
### First launch
Splash → three onboarding slides → **Skip** or the arrow → **Welcome back**.

### Register A
**Sign up** → name, email, password (8+ characters) → **Create account**. On the **Verify** screen, the code is pre-filled (*Dev code*) while the OTP provider is `log` → **Verify**. Answer the location prompt.

### Post an ad as A
Tap **+** → pick a category, fill title, description, price and the category fields, add a photo → **Publish Ad**. With approval on, it shows *Ad submitted for approval*. Approve it in the Admin Panel under **Ads Listing** ([Ads & Moderation](doc:admin/ads)).

### Find it as B
Sign in as B (or **Continue with Google**). Find the ad on Home, in search or in its category. Tap the heart, then **Make an offer** → enter an amount → **Send**.

### Answer as A
A gets a *New offer* push. Open **Chat → Selling** → the conversation → **Accept** on the offer card. Send a message; B sees it within about 8 seconds.

### Close the sale
A: **My Ads → Mark sold → Who bought? → Confirm** next to B. B gets *Purchase confirmed*.

### Review
B: open A's seller profile → **Write a review** → stars and text → **Submit Review**. A sees it in **Profile → My Reviews**.
:::

![Login](/docs/classiadshub/images/app-login.webp "Login")
![Home](/docs/classiadshub/images/app-home.webp "Home")
![Post an ad](/docs/classiadshub/images/app-post-ad.webp "Post an Ad")
![Chat](/docs/classiadshub/images/app-chat.webp "Chat")

## Tests

```bash
cd mobile
flutter analyze
flutter test
```

`test/widget_test.dart` contains one widget test for the splash screen. It still expects the text `ClassiAds_Hub`, but the splash shows only the icon, so the test fails until you update the expectation (for example to `find.byType(Image)`).

## Troubleshooting

| Problem | Fix |
|---|---|
| Listings say *"This is sample listing content…"* | The app cannot reach the API and shows sample data. Check the base URL and the deployment ([API Configuration](doc:app/api-configuration#sample-data-fallback)) |
| *Cannot reach the server. Is the API running?* | Wrong base URL, no internet, or (emulator) `http://` blocked without `usesCleartextTraffic` |
| Login works but you see the demo data | `firebase_options.dart` or the API URL still point at the demo project |
| *Firebase init skipped:* in the console | `firebase_options.dart` is invalid. Run `flutterfire configure` again |
| Build fails: *No matching client found for package name* | `google-services.json` does not contain your `applicationId`. Re-run FlutterFire after renaming |
| *Google sign-in failed* / `DEVELOPER_ERROR` | Google provider off, SHA-1 missing, or old `google-services.json` ([Login, Register & OTP](doc:app/auth#continue-with-google)) |
| Grey / blank map on an ad | Maps SDK for Android not enabled or the key is restricted to another package / SHA-1 |
| No map on ads posted from the app | Expected: the app does not send coordinates ([Post & Manage Ads](doc:app/post-ad)) |
| *An active subscription with remaining quota is required…* | Posting requires a package. Buy one on the website, or turn the requirement off in the Admin Panel settings |
| No push notifications | Permission denied, emulator without Google Play, or no APNs key on iOS ([Push Notifications](doc:app/notifications)) |
| Image picker crashes on iOS | Add `NSPhotoLibraryUsageDescription` (and `NSCameraUsageDescription` if you add camera capture) to `ios/Runner/Info.plist`. They are not in the shipped file |

**Next:** [Release & Play Store →](doc:app/deployment)
