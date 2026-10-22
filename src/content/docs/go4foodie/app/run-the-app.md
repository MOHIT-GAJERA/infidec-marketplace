---
title: Run the App
description: Run the Go4Foodie app on an emulator or phone against your live backend or a local API server, and test all three modes.
---

```bash
cd mobile-app
flutter pub get
flutter devices                 # list emulators / phones
```

| Goal | Command |
|---|---|
| Your live backend (default in `lib/core/api.dart`) | `flutter run` |
| A specific backend | `flutter run --dart-define=API_BASE_URL=https://yourrestaurant-1a2b3.web.app` |
| Local API on your PC + Android emulator | `flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8787` |
| Local API on your PC + real phone on the same Wi-Fi | `flutter run --dart-define=API_BASE_URL=http://192.168.1.20:8787` |
| Payments tested against your website domain | add `--dart-define=SITE_ORIGIN=https://www.yourrestaurant.com` |
| Release build on a phone | `flutter run --release --dart-define=API_BASE_URL=…` |

The Android emulator reaches your PC's `localhost` at **`10.0.2.2`**. A real phone needs your PC's LAN IP, and your firewall must allow the port.

You can also skip the flags and set the address in the app: tap **Server settings** (tune icon) on the first screen and enter the URL. See [API Configuration](doc:app/api-configuration#in-app-server-settings).

## Local API server

The backend can run on your PC against your real Firestore, with no emulator:

```bash
cd firebase/functions
npm install
npm run dev            # → api listening on http://localhost:8787
```

`npm run dev` compiles the function and starts the same Express app on port **8787** (`PORT` overrides it). It reads `functions/.env.local`, which you never deploy, and needs `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service-account key of your project, plus `AUTH_SECRET`. Details are in [Localhost Setup](doc:installation/localhost-setup).

## First-run walkthrough

1. Splash → **welcome screen** (*"Choose how you would like to continue"*). The mode you used last is marked **LAST USED**.
2. **Customer App** → three onboarding slides (once per mode) → **Create account** → you land on Home. Add dishes → **Place order** with **Pay at restaurant** → **Track order**.
3. Sign out (Profile → **Sign out**) → **Restaurant App** → sign in with an admin login or an employee who has an app password → **Floor** → tap a table → **Open table** → **Add items** → **Close & pay**.
4. Sign out → **Owner App** → sign in with the **OWNER** admin login → Dashboard, Reports, Manage.

![Welcome](/docs/go4foodie/images/app-welcome.webp "Choose a mode")
![Login](/docs/go4foodie/images/app-login.webp "Sign in")
![Customer orders](/docs/go4foodie/images/app-customer-orders.webp "My Orders")
![Restaurant floor](/docs/go4foodie/images/app-restaurant-floor.webp "Restaurant floor")
![Owner reports](/docs/go4foodie/images/app-owner-reports.webp "Owner reports")

The app remembers the session (token, mode and profile in secure storage). On the next launch it checks the token with `GET /api/mobile/auth/me` and opens the right app directly. If the server is unreachable it keeps the cached profile. If the server answers **401** it signs out.

## Troubleshooting

| Problem | Fix |
|---|---|
| *Cannot reach the server at …* | Wrong base URL, or the phone cannot reach your PC. Check **Server settings**. On an emulator use `10.0.2.2`, not `localhost` |
| *Request failed (404)* on every screen | The base URL has no `/api/**` rewrite. Use the Hosting site of the API (or the admin site), not the website domain, and leave out `/api` |
| *Invalid email or password* in the Owner App with a correct password | The login is not an OWNER admin user, or it is an employee. The Owner App only accepts `users` with role OWNER |
| *Owner access only. Use the Restaurant app.* | MANAGER or STAFF admin user. Sign in to the Restaurant App |
| Employee cannot sign in | Set an app password for the employee in Admin → Staff, and make sure the employee is **Active** |
| Signed out right after login, or every call is *Unauthorized* | `AUTH_SECRET` differs between environments, or the token expired (30 days). Sign in again |
| *That time is too soon …* / slots look wrong | The backend `LOCAL_TZ` does not match your restaurant timezone ([Environment](doc:installation/environment-configuration)) |
| Online payment options missing | No gateway is configured on the backend (`GET /api/payment` returns all `false`) |
| QR scanner crashes on iPhone | Add `NSCameraUsageDescription` to `Info.plist` ([details](doc:app/deployment#ios-camera-permission)) |
| First request is slow | Cold start of the Cloud Function after an idle period. Set `minInstances: 1` on the function if needed |

## Tests

```bash
flutter analyze
flutter test
```

`test/widget_test.dart` covers the cart, pickup slots and the order and reservation status flows.

**Next:** [Release & Play Store →](doc:app/deployment)
