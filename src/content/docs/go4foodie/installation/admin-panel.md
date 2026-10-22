---
title: Admin Panel Installation
description: Build the Flutter Web admin panel, copy it into the Hosting folder and publish it on your admin site.
---

The `admin-app/` folder is the Go4Foodie admin panel, a **Flutter Web** application. It is compiled to static files and served by the **admin** Hosting site. That same site also sends `/api/**` to the function, so the panel calls the API on its own origin.

**Stack:** Flutter (Dart 3.11+), `firebase_core`, `firebase_auth`, `cloud_firestore`, `go_router`, `provider`, `fl_chart`, `qr_flutter`, `google_fonts`, `lucide_icons_flutter`.

## 1. Check the Firebase config

Make sure `admin-app/lib/firebase_options.dart` contains **your** web app values ([Create the Firebase Project → step 6](doc:installation/firebase-project#6-register-the-admin-web-app)). With the old values, the panel signs in to the wrong project and every login fails.

## 2. Remove the demo login hint

The login screen shows the demo's credentials with a copy button that fills the form. That's useful on a demo, but it shouldn't be on your live panel.

In `admin-app/lib/pages/login_page.dart`, delete the `_DemoHint(onTap: () { … }),` block below the **Sign in** button (and the `const SizedBox(height: 24),` above it). Those demo credentials don't exist in your project anyway, so the hint would only confuse your team.

## 3. Install packages and build

```bash
cd admin-app
flutter pub get
flutter build web --release
```

The output goes to `admin-app/build/web`.

## 4. Deploy to the admin site

```bash
cd ../firebase
firebase deploy --only hosting:admin
```

The admin target's **predeploy** step runs `scripts/copy-admin.js`. It deletes `firebase/public` and copies `admin-app/build/web` into it. If you forgot the build, it stops with *"No admin build at … run "flutter build web --release" in admin-app first."*

When it finishes, open `https://yourrestaurant-admin.web.app`.

![Admin login](/docs/go4foodie/images/admin-login.jpg "The admin sign-in screen")

You can't sign in yet, because a new project has no admin user. Create one in [Admin Users](doc:installation/admin-users) (or import your existing database first in [Data Migration](doc:installation/data-migration)).

## Deploy everything at once

After the first install, this is the full redeploy of the backend and both Hosting sites:

```bash
cd admin-app && flutter build web --release
cd ../firebase && FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions,hosting,firestore,storage
```

`hosting` deploys both targets: **admin** (the panel) and **api** (the API host).

## Caching

`firebase.json` caches JS, WASM, images and fonts for 7 days and serves `index.html` with `no-cache`. Each new deploy therefore loads on the next page refresh. If someone still sees the old version, a hard refresh (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>) fixes it.

## Branding

| What | File |
|---|---|
| Browser title and description | `admin-app/web/index.html` (`<title>Go4Foodie Admin</title>`), `lib/main.dart` (`title:`) |
| Install name and colours | `admin-app/web/manifest.json` |
| Favicon & PWA icons | `admin-app/web/favicon.png`, `admin-app/web/icons/` |
| Logos in the sidebar and login screen | `admin-app/assets/images/` (keep the same file names) |
| Colours, fonts, light/dark theme | `admin-app/lib/core/theme.dart` |

Rebuild and redeploy after each change.

## Folder overview

```text title="admin-app/"
lib/
  main.dart              Firebase init, theme, session restore, router
  firebase_options.dart  Your Firebase web config
  core/api.dart          JSON client for /api/admin/* (API_BASE override)
  core/session.dart      Login → custom token → Firebase Auth session, /me, permissions
  core/theme.dart        Light/dark theme tokens
  shell/                 Sidebar (nav.dart), top bar, router and permission guard
  pages/                 The 20 screens: login, dashboard, orders, menu, floor, pos…
  widgets/               Shared UI, charts, motion (page transitions, shimmer, count-up)
web/                     index.html, manifest.json, icons
assets/images/           Logos
```

**Next:** [Data Migration →](doc:installation/data-migration)
