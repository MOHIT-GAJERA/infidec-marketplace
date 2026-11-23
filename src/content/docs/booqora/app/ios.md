---
title: iOS Build & App Store
description: Build the Booqora Mobile App for iPhone on a Mac, set the bundle ID and signing team, check the Info.plist permissions and upload the IPA to App Store Connect.
---

The Flutter project includes an iOS target (`booqora_mobile/ios/`) with the same features as Android. iOS apps can only be built and signed **on a Mac with Xcode**.

:::note Test on a real iPhone
The 1.0 release was QA-tested on Android. The iOS project is configured (bundle ID, permissions, Firebase, URL schemes), but run a full test on an iPhone before you submit: sign-in, an order, the scanner, a Razorpay test payment and a PDF.
:::

## What is already configured

| Item | Value | Where |
|---|---|---|
| Bundle ID | `io.booqora.booqoraMobile` | `ios/Runner.xcodeproj/project.pbxproj` (`PRODUCT_BUNDLE_IDENTIFIER`) |
| Minimum iOS | 13.0 | `IPHONEOS_DEPLOYMENT_TARGET` in the same file |
| Display name | Booqora | `CFBundleDisplayName` in `ios/Runner/Info.plist` |
| Camera permission text | "Booqora uses the camera to scan barcodes and take product photos." | `NSCameraUsageDescription` |
| Photo library text | "Booqora lets you choose product photos and your logo from your library." | `NSPhotoLibraryUsageDescription` |
| URL schemes the app may open | `https`, `mailto`, `tel`, `tez`, `phonepe`, `paytmmp`, `gpay`, `upi` | `LSApplicationQueriesSchemes`. Lets Razorpay hand off to UPI apps |
| Firebase config | `GoogleService-Info.plist` | `ios/Runner/` |
| Version | From `pubspec.yaml` (`CFBundleShortVersionString` = build name, `CFBundleVersion` = build number) | `Info.plist` |

The app locks itself to portrait in `lib/main.dart`.

## 1. Prepare the Mac

```bash title="Terminal (Mac)"
xcode-select --install          # command-line tools
sudo gem install cocoapods      # or: brew install cocoapods
flutter doctor                  # Xcode and CocoaPods should be green
```

Copy the `booqora_mobile` folder to the Mac (or clone your repository) and complete [Firebase Setup](doc:app/firebase-setup) so `GoogleService-Info.plist` and `firebase_options.dart` belong to your project.

## 2. Install the pods

```bash title="Terminal (Mac)"
cd booqora_mobile
flutter pub get
cd ios
pod install --repo-update
cd ..
```

The package does not ship a `Podfile`; Flutter generates it on the first iOS build or `pod install`. If CocoaPods reports that a plugin requires a higher iOS version, set `platform :ios, '<version>'` in `ios/Podfile` and raise `IPHONEOS_DEPLOYMENT_TARGET` in Xcode to the same version.

## 3. Bundle ID and signing

1. Open `ios/Runner.xcworkspace` (the workspace, not the `.xcodeproj`).
2. Select the **Runner** target → **Signing & Capabilities**.
3. Tick **Automatically manage signing** and choose your **Team** (an Apple Developer Program membership is needed for App Store builds).
4. Set **Bundle Identifier** to your own ID, for example `com.yourbrand.rentals`. It must match the iOS app registered in Firebase and the `iosBundleId` in `firebase_options.dart` ([Change Package Name](doc:app/change-package-name)).

The project has no development team set, so this step is required before the first device or release build.

## 4. Check Info.plist

Update the permission texts and display name for your brand ([Change App Name](doc:app/change-app-name)). Apple reviews these sentences: they must say clearly why the app needs the camera and the photo library.

## 5. Run on an iPhone

Connect the iPhone, trust the Mac, enable **Developer Mode** on the phone (Settings → Privacy & Security) and run:

```bash title="Terminal (Mac)"
flutter run --release
```

## 6. Build the IPA

```bash title="Terminal (Mac)"
flutter build ipa --release
# → build/ios/ipa/*.ipa
# → build/ios/archive/Runner.xcarchive
```

Raise `version` in `pubspec.yaml` for every upload, just like on Android. App Store Connect refuses a build number it has already seen.

## 7. Upload to App Store Connect

1. In [App Store Connect](https://appstoreconnect.apple.com) → **Apps → +** → New App: platform iOS, your name, primary language, the **bundle ID** from step 3 and an SKU.
2. Upload the build with the **Transporter** app (drag in the `.ipa`), or open `build/ios/archive/Runner.xcarchive` in Xcode → **Distribute App → App Store Connect**.
3. Wait for processing, then test it with **TestFlight**.
4. Fill in the listing: description, keywords, support URL, privacy policy URL (`https://<your-platform-domain>/privacy`), screenshots for the required iPhone sizes and the **App Privacy** questionnaire (use the same answers as the Play [data safety form](doc:app/play-console)).
5. In **App Review Information**, enter a demo account so the reviewer can sign in. Enter the password only in that field.
6. Select the build and **Submit for Review**.

:::warning App icon without transparency
App Store Connect rejects an app icon with an alpha channel. If you regenerate the icons, use `remove_alpha_ios: true` ([Change Logo & App Icon](doc:app/change-app-logo)).
:::

## Common problems

| Problem | Fix |
|---|---|
| `No profiles for '…' were found` | Choose your Team and let Xcode manage signing, or create the App ID in the Apple Developer portal |
| CocoaPods version conflicts | `cd ios && pod repo update && pod install` |
| App crashes on launch with a Firebase error | `GoogleService-Info.plist` is missing from the Runner target or belongs to another project |
| Scanner shows *Camera access is off* | The user denied the prompt; they must enable it in Settings → your app → Camera |

For questions not covered here see the [FAQs](doc:faqs).

**Next:** [Website Overview →](doc:web/overview)
