---
title: Admin Panel Installation
description: Connect the Flutter Web admin panel to your Firebase project, build it, add a Hosting target to firebase.json and publish it.
---

`apps/admin_panel/` is the Go4Ride admin console, a **Flutter Web** application with a black & white UI, light and dark mode and a collapsible sidebar. It talks to Firebase directly (Auth, Firestore, Realtime Database, Storage, Cloud Functions), so it is just static files: Firebase Hosting, or any static host, can serve it.

**Stack:** Flutter 3.41+ (Dart 3.11+), `flutter_riverpod`, `go_router`, `firebase_auth`, `cloud_firestore`, `firebase_database`, `firebase_storage`, `cloud_functions`, `flutter_map` (OpenStreetMap tiles), `phosphor_flutter`, `google_fonts`, `image_picker`.

## 1. Connect it to your project

If you haven't done it on the previous page:

```bash
cd apps/admin_panel
flutterfire configure --project=your-project-id --platforms=web
```

Check that `apps/admin_panel/lib/firebase_options.dart` now shows **your** `projectId`. With the old values the panel signs in to the wrong project and every login fails.

## 2. Try it locally

```bash
flutter pub get                      # once, at the repository root
cd apps/admin_panel
flutter run -d chrome --web-port=5060
```

You see the sign-in screen. You can't get in yet, because a new project has no admin. That is the next page.

![Admin login](/docs/go4ride/images/admin-login.jpg "The admin sign-in screen. First time? Create an admin account switches to sign-up")

## 3. Build for production

```bash
cd apps/admin_panel
flutter build web --release
```

The output goes to `apps/admin_panel/build/web`. No `--dart-define` is needed: the panel has no Maps key and must **not** be built with `USE_EMULATOR=true`.

## 4. Add a Hosting target

The shipped root `firebase.json` has no `hosting` block. Add one next to `"database"`:

```json title="firebase.json (add)"
"hosting": {
  "public": "apps/admin_panel/build/web",
  "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
  "rewrites": [{ "source": "**", "destination": "/index.html" }],
  "headers": [
    { "source": "/index.html", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] },
    { "source": "**/*.@(js|wasm|png|jpg|svg|ttf|otf|woff2)", "headers": [{ "key": "Cache-Control", "value": "max-age=604800" }] }
  ]
}
```

The panel uses hash URLs (`/#/…`), so the rewrite is only a safety net. `index.html` with `no-cache` makes every new deploy load on the next refresh.

## 5. Deploy

```bash
firebase deploy --only hosting
```

Open `https://your-project-id.web.app` (also `https://your-project-id.firebaseapp.com`). Custom domains are on [Hosting, Domain & SSL](doc:installation/hosting).

:::tip Another static host
`build/web` is plain static files. You can upload it to Netlify, Vercel, Cloudflare Pages, S3 or Nginx instead. Serve `index.html` for unknown paths and keep it uncached.
:::

## Deploy everything at once

After the first install, this is the full redeploy of the backend and the panel:

```bash
(cd apps/admin_panel && flutter build web --release)
firebase deploy --only firestore:rules,firestore:indexes,storage,database,functions,hosting
```

## Branding

| What | File |
|---|---|
| Browser title, description | `apps/admin_panel/web/index.html` (`<title>Go4Ride Admin</title>`, `<meta name="description">`) |
| Install name and colours | `apps/admin_panel/web/manifest.json` |
| Favicon & PWA icons | `apps/admin_panel/web/favicon.png`, `apps/admin_panel/web/icons/` |
| Logos on the login screen, sidebar and splash | `apps/admin_panel/assets/branding/` (`go4ride_wordmark.png`, `go4ride_wordmark_light.png`, `go4ride_mark.png`, `go4ride_app_icon.png`; keep the file names) |
| Colours, light/dark palette | `apps/admin_panel/lib/app/admin_theme.dart` |
| App name used in the window title | `BrandConfig` in `packages/ui_kit` (shared with the apps) |

Rebuild and redeploy after each change.

## Folder overview

```text title="apps/admin_panel/lib/"
main.dart                Firebase init (real or emulator), ProviderScope
firebase_options.dart    Your Firebase web config (flutterfire configure)
config/firebase_dev.dart Emulator wiring for --dart-define=USE_EMULATOR=true
app/                     Router, shell, sidebar (navigation.dart), theme, providers,
                         admin_functions.dart (callable wrappers), module_ids.dart
engine/                  Generic CRUD tables/forms, settings pages, CSV export, store
modules/                 resource_specs.dart (catalogue pages) and settings_specs.dart (every setting key)
features/                Dashboard, bookings, dispatch, drivers, customers, zones, pricing,
                         payouts, support, push notifications, staff & roles, settings
widgets/                 Shared admin UI
```

**Next:** [Create the First Admin →](doc:installation/super-admin)
