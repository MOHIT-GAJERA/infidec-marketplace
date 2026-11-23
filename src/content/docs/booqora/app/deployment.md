---
title: Release Build & Keystore
description: Create your upload keystore, configure android/key.properties, set the version and build the signed Android App Bundle and split APKs for the Booqora Mobile App.
---

Google Play accepts only **Android App Bundles** (`.aab`) signed with **your** upload key. The Gradle file is already prepared for this: you only need a keystore and a `key.properties` file.

## 1. Create the upload keystore (once)

```bash title="Terminal"
keytool -genkeypair -v -keystore ~/keys/yourbrand-upload.jks \
  -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

`keytool` asks for a store password, a key password and your name and organisation. On Windows, `keytool` is in Android Studio's JDK:

```powershell title="PowerShell"
& "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkeypair -v `
  -keystore C:\Users\you\keys\yourbrand-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

:::danger Back up the keystore and passwords
Store the `.jks` file and both passwords in a password manager and in a second safe place. If you lose them you must ask Google to reset the upload key before you can publish updates, which takes days.
:::

## 2. Create `android/key.properties`

```properties title="booqora_mobile/android/key.properties"
storePassword=<store-password>
keyPassword=<key-password>
keyAlias=upload
storeFile=C:/Users/you/keys/yourbrand-upload.jks
```

`storeFile` is resolved from `android/app/`, so an absolute path is simplest. Use forward slashes on Windows too.

:::warning Never commit it
`key.properties`, `*.jks` and `*.keystore` are listed in `.gitignore`. Keep them out of Git and out of any ZIP you share. If the package you received contains a `key.properties`, delete it and create your own.
:::

## 3. How Gradle uses it

`android/app/build.gradle.kts` loads the file and creates a `release` signing config:

```kts title="booqora_mobile/android/app/build.gradle.kts"
val keystoreProperties = Properties().apply {
    val f = rootProject.file("key.properties")
    if (f.exists()) load(FileInputStream(f))
}

android {
    signingConfigs {
        create("release") {
            if (keystoreProperties.isNotEmpty()) {
                keyAlias = keystoreProperties["keyAlias"] as String
                keyPassword = keystoreProperties["keyPassword"] as String
                storeFile = file(keystoreProperties["storeFile"] as String)
                storePassword = keystoreProperties["storePassword"] as String
            }
        }
    }
    buildTypes {
        release {
            signingConfig = if (keystoreProperties.isNotEmpty())
                signingConfigs.getByName("release") else signingConfigs.getByName("debug")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

If `key.properties` is missing, release builds are signed with the **debug** key. They install fine for testing, but Google Play rejects them.

The project compiles for **Java 17** and uses Flutter's default `compileSdk`, `targetSdk` and `minSdk` (`flutter.minSdkVersion` and so on).

## 4. Set the version

```yaml title="booqora_mobile/pubspec.yaml"
version: 1.0.0+1     # versionName + versionCode
```

Raise the number after `+` for **every** upload, for example `1.0.1+2`. Play refuses a bundle whose version code it has seen before.

## 5. Build

App Bundle for Google Play:

```bash title="Terminal"
cd booqora_mobile
flutter clean
flutter pub get
flutter build appbundle --release
# → build/app/outputs/bundle/release/app-release.aab
```

APKs for direct installs (testers, your team):

```bash title="Terminal"
flutter build apk --release --split-per-abi
# → build/app/outputs/flutter-apk/app-arm64-v8a-release.apk
#   build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk
#   build/app/outputs/flutter-apk/app-x86_64-release.apk
```

Split APKs are much smaller than one universal APK. `arm64-v8a` runs on almost every modern phone; `armeabi-v7a` covers older 32-bit phones. Run `flutter build apk --release` without the flag for a single universal APK.

## 6. R8 and ProGuard rules

Release builds are minified with R8 using `android/app/proguard-rules.pro`. The file keeps:

- the Razorpay SDK classes and its `onPayment*` callbacks;
- the Google Pay / UPI intent classes Razorpay uses.

```text title="booqora_mobile/android/app/proguard-rules.pro"
-keep class com.razorpay.** {*;}
-keepclasseswithmembers class * { public void onPayment*(...); }
-keep class com.google.android.apps.nbu.paisa.inapp.client.api.** {*;}
```

If you add a plugin that uses reflection and it works in debug but crashes in release, add a `-keep` rule for its classes here.

## Pinned Android path provider

`pubspec.yaml` pins one package:

```yaml title="booqora_mobile/pubspec.yaml"
# path_provider_android 2.3.x uses package:jni, which fails to load android.content.Context
# in release builds on Android 16; 2.2.x uses standard platform channels.
dependency_overrides:
  path_provider_android: 2.2.23
```

`path_provider_android` is not a direct dependency; it is pulled in by other packages such as `google_fonts`. Version 2.3 switched to JNI and made **release** builds crash at launch on Android 16. Version 2.2.23 uses standard platform channels and does not have the problem.

Keep the override until a newer `path_provider_android` is confirmed to work in a release build on Android 16. To test, remove the override, run `flutter pub get`, then `flutter run --release` on an Android 16 device or emulator and open a screen that creates a PDF.

## 7. Before you upload

- [x] Package name, app name, icon and splash are yours
- [x] `firebase_options.dart` and the platform files point to `<your-project-id>`
- [x] `Browser.origin` and `Payments.returnUrl` point to your platform domain
- [x] Live payment keys configured on the server ([Payment Gateways](doc:admin/payment-gateways))
- [x] `version` raised
- [x] The release build tested on a real phone: sign-in, an order, a PDF, a payment in test mode

**Next:** [Google Play Listing & Review →](doc:app/play-console)
