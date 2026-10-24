---
title: Run the App
description: Run the Driver App against your Firebase project or the local emulators, take a test driver from registration to a completed ride, and run its tests.
---

```bash
flutter pub get                   # repository root, once
cd apps/driver_app
flutter devices
```

| Goal | Command (from `apps/driver_app`) |
|---|---|
| Your Firebase project | `flutter run --dart-define-from-file=../../secret/app_keys.env` |
| Local emulators | `flutter run --dart-define-from-file=../../secret/app_keys.env --dart-define=USE_EMULATOR=true` |
| Chrome (emulators) | `flutter run -d chrome --web-port=5050 --dart-define=USE_EMULATOR=true` |
| Release build on a phone | `flutter run --release --dart-define-from-file=../../secret/app_keys.env` |

Run the Customer App on a second device at the same time to test rides end to end. Both can use the same emulators ([Localhost & Emulators](doc:installation/localhost-setup)).

:::tip Real location on an emulator
The Android emulator reports a fixed position (Googleplex by default). Set it near your test pickup in Extended controls → **Location**, otherwise `onRideCreated` may find the driver outside the search radius.
:::

## Test-driver walkthrough

:::steps
### Sign up
Skip or finish the onboarding slides → **Drive & earn** → test number (for example `90000 00002`) → code → **Verify**.

### Vehicle
Name, vehicle type, brand, model, plate, colour, year → **Continue**.

### Documents
Upload each required document (camera or gallery), set expiry dates → **Submit for review**. The screen shows *Documents under review*.

### Approve in the Admin Panel
Admin → **Drivers** → pending → open the driver → approve the documents and the driver ([Drivers & KYC](doc:admin/drivers)). The app shows *Approved!* and opens Home.

### Go online
Flip the switch. Grant location. The admin **Online drivers** map shows the driver ([Online Drivers Map](doc:admin/online-drivers)).

### Take a ride
Book from the Customer App → the request card appears → **Accept** → **Navigate to pickup** → **I've arrived** → **Start trip** → enter the rider's OTP → **Complete trip**.

### Check the money
Account → **Earnings & wallet**: a cash ride shows the commission deducted, a wallet or card ride the earning added.
:::

![Onboarding](/docs/go4ride/images/app-driver-onboarding.webp "Onboarding")
![Vehicle](/docs/go4ride/images/app-driver-vehicle.webp "Vehicle")
![Home](/docs/go4ride/images/app-driver-home-offline.webp "Home")
![Arrived](/docs/go4ride/images/app-driver-arrived.webp "Arrived")
![In progress](/docs/go4ride/images/app-driver-in-progress.webp "In progress")

## Account menu

| Item | Opens |
|---|---|
| Profile | Name (phone is the login, verification status) |
| Vehicle | The vehicle form, to change type, brand, model, plate |
| Documents | Live document status, replace expiring or rejected ones |
| Subscriptions | [Subscription Plans](doc:app-driver/subscriptions) |
| Earnings & wallet | [Earnings, Wallet & Payouts](doc:app-driver/earnings) |
| Trip history | Past rides |
| Help & support, Contact us | Tickets with photo and chat, contact channels (same as the rider app, with the *driver* help topics) |
| Emergency | Calls the emergency number |
| About us, Privacy policy, Terms & conditions | Content pages for the *driver* audience |
| Dark mode / Light mode, Sign out | |

## Troubleshooting

| Problem | Fix |
|---|---|
| Stuck on the registration screen after approval | The driver document is not `approved` yet (check `kycStatus` in Firestore), or the app is on another project |
| *Permission denied* when accepting a ride or requesting a withdrawal | The `role: driver` claim is missing. The `onDriverProfileCreated` function must be deployed. Sign out and in again to refresh the token |
| Vehicle type or brand list is empty | Load defaults in Admin → Vehicle types / Vehicle brands |
| Upload fails | Storage rules not deployed, or the file is over 10 MB |
| *Low wallet balance* when going online | Wallet below **Minimum driver wallet to accept rides** |
| *Location permission needed to go online.* | Allow location in system settings (choose *While using the app*) |
| No requests appear | Driver offline, no open rides, or every open ride was declined or already taken |
| Rider does not see the driver move | The driver app is in the background, or `databaseURL` is wrong |
| Phone login opens a reCAPTCHA page | SHA fingerprints for the **driver** Firebase Android app are missing |

## Tests

```bash
cd apps/driver_app
flutter analyze
flutter test
```

They cover document completeness and submit rules, the waiting charge, the wallet guard, the start OTP, cancel rules, vehicle year validation, plan labels, the maintenance and update gates, and the onboarding fallback.

**Next:** [Release & Play Store →](doc:app-driver/deployment)
