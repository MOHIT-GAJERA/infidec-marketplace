---
title: Build & Deploy the Web Apps
description: Create the four Firebase Hosting sites, build the Flutter Web website and the Admin, Seller and Delivery panels, and deploy them.
---

Go4Market has four web front-ends, all **Flutter Web** and all on **Firebase Hosting**:

| Target | Default URL | Source | Build output |
|---|---|---|---|
| `website` | `https://<your-project-id>.web.app` | `apps/website` | `apps/website/build/web` |
| `admin` | `https://<your-project-id>-admin.web.app` | `apps/panel` + `lib/main_admin.dart` | `apps/panel/build/admin` |
| `seller` | `https://<your-project-id>-seller.web.app` | `apps/panel` + `lib/main_seller.dart` | `apps/panel/build/seller` |
| `delivery` | `https://<your-project-id>-delivery.web.app` | `apps/panel` + `lib/main_delivery.dart` | `apps/panel/build/delivery` |

`firebase.json` defines these targets, with SPA rewrites, long cache headers for hashed assets, `no-cache` for `index.html` and the service workers, and `X-Robots-Tag: noindex` on the three panels. The website also rewrites `/sitemap.xml` to the `sitemap` function.

## 1. Create the hosting sites

The default site (`<your-project-id>`) already exists. Create the three panel sites:

```bash
firebase hosting:sites:create <your-project-id>-admin --project <your-project-id>
firebase hosting:sites:create <your-project-id>-seller --project <your-project-id>
firebase hosting:sites:create <your-project-id>-delivery --project <your-project-id>
```

Make sure `.firebaserc` maps each target to these site IDs (see [Connect the Code](doc:installation/connect-your-project#1-firebase-cli-project-and-hosting-sites)). You can also set the mapping with `firebase target:apply hosting admin <your-project-id>-admin`.

## 2. Build the website

```bash
cd apps/website
flutter pub get
flutter build web --release
cd ../..
```

## 3. Build the three panels

The helper script `apps/panel/tool/build_all.ps1` builds each entrypoint into its own folder. It also patches `index.html` (title, description, theme colour, `noindex`), generates favicons and PWA icons, writes `manifest.json`, copies `firebase-messaging-sw.js` into each build and adds a `robots.txt` that disallows indexing.

:::warning The script needs two images at the repository root
`build_all.ps1` reads `logo.png` (favicon) and `icons_512.png` (PWA icons) from the **repository root**. Put your own files there before building. For the stock Go4Market branding, copy `apps/customer_app/assets/brand/logo.png` to `logo.png` and `playstore/customer_app/graphics/icon_512.png` to `icons_512.png`.
:::

```powershell
cd apps/panel
flutter pub get
powershell -ExecutionPolicy Bypass -File tool/build_all.ps1            # admin, seller and delivery
powershell -ExecutionPolicy Bypass -File tool/build_all.ps1 seller     # just one panel
cd ../..
```

The panel titles and accent colours (admin green `#0B8A4F`, seller orange `#E8740C`, delivery blue `#2563EB`) are set in the `$panels` table at the top of the script.

### Without PowerShell

On macOS or Linux without `pwsh`, build each panel directly, then copy `web/firebase-messaging-sw.js` into each output folder yourself:

```bash
cd apps/panel
flutter build web --release -t lib/main_admin.dart -o build/admin
flutter build web --release -t lib/main_seller.dart -o build/seller
flutter build web --release -t lib/main_delivery.dart -o build/delivery
for p in admin seller delivery; do cp web/firebase-messaging-sw.js build/$p/; done
```

Older Flutter versions do not support `-o`. In that case build to `build/web` and copy it to `build/<panel>`.

:::tip Optional web push VAPID key
Panels use Firebase's default VAPID key for browser push. To use your own (Project settings → Cloud Messaging → Web Push certificates), add `--dart-define=FCM_VAPID_KEY=<your-key>` to the panel build commands.
:::

## 4. Deploy

```bash
firebase deploy --only hosting --project <your-project-id>                 # all four
firebase deploy --only hosting:admin,hosting:seller --project <your-project-id>   # selected targets
```

Open the four URLs. The website shows the seeded modules and products. The panels show their login screens.

## 5. After deploying

- Add the three panel domains to **Authentication → Settings → Authorized domains** if you have not already (needed for Google and phone sign-in).
- Browsers cache Flutter bundles aggressively. `index.html`, `flutter_bootstrap.js` and `flutter_service_worker.js` are served `no-cache`, so a normal reload picks up a new release. If a user still sees an old version, ask for a hard refresh (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>).

![Seller panel login](/docs/go4market/images/seller-login.webp "The Seller panel (Seller Hub) after deploying the seller target")

**Next:** [Create the Super Admin →](doc:installation/super-admin)
