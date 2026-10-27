---
title: API Configuration
description: Point the app at your own Cloud Functions API with app_config.dart or --dart-define, and understand how requests, tokens, errors and the sample-data fallback work.
---

Every screen in the app gets its data from the **ClassiAds-Hub REST API**, the `api` Cloud Function of your Firebase project. The base URL is set in one file.

## The base URL

```dart title="mobile/lib/core/config/app_config.dart"
class AppConfig {
  static const String appName = 'ClassiAds Hub';

  /// Override at build time: --dart-define=API_BASE_URL=https://.../api/v1
  static const String _override = String.fromEnvironment('API_BASE_URL');

  /// Firebase Cloud Function `api`. Override with --dart-define=API_BASE_URL=... (e.g. the emulator).
  static String get apiBaseUrl =>
      _override.isNotEmpty ? _override : 'https://us-central1-your-project-id.cloudfunctions.net/api/v1';

  static const Duration connectTimeout = Duration(seconds: 20);
  static const Duration receiveTimeout = Duration(seconds: 20);
  ...
}
```

The shipped file points at the demo project. Change the default to your own project, or pass it at build time.

| Option | Base URL | Notes |
|---|---|---|
| Direct function URL | `https://us-central1-your-project-id.cloudfunctions.net/api/v1` | The function serves `/v1/*` directly. Default style of the shipped file |
| Through Hosting | `https://www.yourcompany.com/api/v1` | Uses the `/api/**` → `api` rewrite of the website Hosting site. Works once your custom domain is connected ([Hosting, Domain & SSL](doc:installation/hosting)) |

Both reach the same function. Always end the URL with `/api/v1` (or `/v1` on the direct URL as shown) and no trailing slash, because the app appends paths like `/home` and `/ads`.

:::tip Find your function URL
After `firebase deploy --only functions`, the CLI prints `Function URL (api(us-central1)): https://us-central1-your-project-id.cloudfunctions.net/api`. Add `/v1` to it. Open `<base>/home` in a browser: a JSON envelope with `"success": true` means the URL is right.
:::

## Override with --dart-define

You do not have to edit the file. `API_BASE_URL` can be passed to any `flutter run` or `flutter build`:

```bash
flutter run --dart-define=API_BASE_URL=https://us-central1-your-project-id.cloudfunctions.net/api/v1

flutter build appbundle --release \
  --dart-define=API_BASE_URL=https://www.yourcompany.com/api/v1
```

A value passed with `--dart-define` wins over the default in `app_config.dart`. If you forget it on a release build, the app uses the default, so keep the default pointing at production.

## How requests work

`lib/core/network/api_client.dart` is a small Dio wrapper used by every repository:

| Behaviour | Detail |
|---|---|
| Auth header | `Authorization: Bearer <Firebase ID token>` of the signed-in user (`currentUser.getIdToken()`, refreshed by the SDK). Guests send no header |
| Envelope | Reads `{ success, data, message, meta, errors }`. `data` is returned to the screen, `meta.pagination` feeds paging |
| Errors | A non-success envelope becomes an `ApiException` with `message`, `statusCode` and field `errors` (422). Screens show the message in a snackbar |
| Network failure | Shows *"Cannot reach the server. Is the API running?"* |
| Timeouts | 20 s connect, 20 s receive (`AppConfig.connectTimeout` / `receiveTimeout`) |
| Uploads | Multipart for ad photos (`images[]`), the avatar (`avatar`) and KYC documents (`front_image`, `back_image`) |

Prices arrive in minor units (`price`) with a ready-made `price_display` string, so the app never formats currency itself.

## Sample-data fallback

Many read calls are wrapped in `withFallback()` (`lib/core/utils/fallback.dart`). If the API call throws, the screen shows sample content from `lib/core/dummy/dummy_data.dart` instead of an error: home sections, categories, search results, ad detail, chats, favorites, My Ads, reviews, job applications and languages.

:::warning Sample data hides a wrong URL
If you see listings like *"This is sample listing content shown because live data could not be loaded"* with picsum photos, the app cannot reach your API. Check the base URL, the deployment and the device's internet connection. In debug builds the console prints `[fallback] using dummy data: …` with the real error.

Writes (posting, editing, chat, offers) never use sample data, so they show the real error.
:::

## Local backend (emulator)

To test against the Functions emulator, run it from the repository root and pass its URL:

```bash
firebase emulators:start --only functions
# Android emulator reaches your computer at 10.0.2.2
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5001/your-project-id/us-central1/api/v1
```

Two things to know:

- Android blocks plain `http://` traffic by default. For a local test, add `android:usesCleartextTraffic="true"` to the `<application>` tag of `android/app/src/debug/AndroidManifest.xml` (debug only, never in `main`).
- The app has no `useAuthEmulator` call, so it signs in against your **real** Firebase Auth project. See [Localhost Setup](doc:installation/localhost-setup) for the full local setup.

## Other values in app_config.dart

| Constant | Purpose |
|---|---|
| `appName` | App name constant |
| `googleMapsApiKey` | Maps key constant, overridable with `--dart-define=GOOGLE_MAPS_KEY=…`. No Dart code reads it today; the map uses the native keys in `AndroidManifest.xml` and `AppDelegate.swift` ([Google Maps & Location](doc:app/maps-location)). Replace the shipped default anyway so the demo key is not in your build |
| `kOnboardingSeen`, `kLanguage`, `kCurrency`, `kLocationPrompted`, `kLocationLabel`, … | `shared_preferences` keys. Changing them resets those preferences for existing users |

**Next:** [Google Maps & Location →](doc:app/maps-location)
