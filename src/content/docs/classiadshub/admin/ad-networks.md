---
title: AdMob, AdSense & Video Ads
description: The Admob, AdSense and Video Ads Settings pages, what each field stores, and what you must add to the app and website before third-party ads are shown.
---

Three settings pages hold the keys for third-party advertising. Open them from **Admin → Settings** (cards **Admob**, **AdSense** and **Video Ads Settings**).

All three are simple key/value forms. **Save** writes each group to the Firestore document `settings/{group}` (`PUT /admin/settings`) and shows *"Settings saved."* The change is recorded in the [Log Viewer](doc:admin/system-status#log-viewer) as `settings.updated`.

:::warning Stored, not yet wired
In the shipped code these values are **saved but not used**. The Flutter app has an `AdBannerPlaceholder` widget (`mobile/lib/shared/widgets/ad_banner.dart`) on the home screen and the ad detail screen that renders nothing. The website has no AdSense script. No video-ads feature reads the Video Ads settings. The steps below show where to plug them in.
:::

For your own in-house banners (images that link to a category, an ad or a URL), use [Banner Ads](doc:admin/banner-ads) instead. Those work out of the box.

## Admob

Subtitle: *"Google AdMob configuration"*. Group: `admob`.

![Admob settings](/docs/classiadshub/images/admin-settings-admob.jpg "Settings → Admob")

| Field | Key | Example |
|---|---|---|
| **Enable AdMob** | `enabled` | on / off |
| **Android app ID** | `android_app_id` | `ca-app-pub-0000000000000000~0000000000` |
| **iOS app ID** | `ios_app_id` | `ca-app-pub-0000000000000000~1111111111` |
| **Banner unit ID** | `banner_unit_id` | `ca-app-pub-0000000000000000/2222222222` |
| **Interstitial unit ID** | `interstitial_unit_id` | `ca-app-pub-0000000000000000/3333333333` |

### Show AdMob banners in the app

:::steps
### Add the SDK
Add `google_mobile_ads` to `mobile/pubspec.yaml` and run `flutter pub get`.

### Add the app id
Android: add a `<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="YOUR_ADMOB_APP_ID"/>` inside `<application>` in `mobile/android/app/src/main/AndroidManifest.xml`. iOS: add `GADApplicationIdentifier` to `Info.plist`. The app id must be in the native files; it cannot come only from the API.

### Replace the placeholder
Change the body of `AdBannerPlaceholder` to load a `BannerAd` with your banner unit id. The widget is already placed on the home and ad detail screens.

### Declare ads in Play Console
Under **App content → Ads**, answer **Yes, my app contains ads**.
:::

## AdSense

Subtitle: *"Google AdSense configuration"*. Group: `adsense`.

![AdSense settings](/docs/classiadshub/images/admin-settings-adsense.jpg "Settings → AdSense")

| Field | Key |
|---|---|
| **Enable AdSense** | `enabled` |
| **Publisher ID (ca-pub-…)** | `client_id` |
| **Ad slot ID** | `slot_id` |

To show AdSense on the website, add the AdSense `<script>` with your publisher id to `web/src/app/layout.tsx` and place `<ins class="adsbygoogle">` blocks where you want ads. Then rebuild and deploy the website (see [Deployment](doc:web/deployment)). Remember to add the `ads.txt` file Google gives you to `web/public/`.

## Video Ads Settings

Subtitle: *"Reels and video advertisements"*. Group: `video_ads`.

![Video Ads settings](/docs/classiadshub/images/admin-settings-video-ads.jpg "Settings → Video Ads Settings")

| Field | Key |
|---|---|
| **Enable video ads** | `enabled` |
| **Max duration (seconds)** | `max_duration_seconds` |
| **Max file size (MB)** | `max_size_mb` |

These limits are stored for a future video-ad (reels) feature; no code reads them yet. Today sellers can add a **video URL** (`video_url`, a link such as YouTube) to an ad, but cannot upload video files. Uploaded ad images are limited to 5 MB each and to **Max images per ad** in [General settings](doc:admin/settings#advertisement-settings).

## Reading the values from a client

Settings are public through `GET /config` (`data.settings.admob`, `data.settings.adsense`, `data.settings.video_ads`). Keys that were saved as secret are left out. So once you add the SDK, your client can read the unit ids from the API instead of hard-coding them (except the AdMob app id, see above).

**Next:** [Customers & User Queries →](doc:admin/customers)
