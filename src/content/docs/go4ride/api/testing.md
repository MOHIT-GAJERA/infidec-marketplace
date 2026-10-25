---
title: Testing
description: The automated test suites that ship with Go4Ride (Dart unit and widget tests, Jest tests for the pricing and settlement maths, and the Firestore security-rules matrix) and how to run them.
---

Go4Ride ships with layered automated tests. Run them before every release and after every change to pricing, settlement or the rules.

## Test suites

| Suite | Tech | Location | What it covers |
|---|---|---|---|
| Domain | `dart test` | `packages/core/test/` | Models round-trip to Firestore maps, enums, validators, parsing, `Result` / `Failure`, platform settings models, fare and promo maths |
| Data layer | `flutter test` + `fake_cloud_firestore` | `packages/data/test/` | Repositories: CRUD, queries, the **atomic `acceptRide`** transaction, status transitions, config |
| Customer App | `flutter test` (Riverpod overrides) | `apps/customer_app/test/` | App gate, catalogue logic, fare estimator, home services, ride history rendering |
| Driver App | `flutter test` | `apps/driver_app/test/` | Driver logic (KYC document completeness and submit rules, waiting charge, go-online wallet guard, start OTP, cancel rules, update requirement), gates, widgets |
| Admin Panel | `flutter test` | `apps/admin_panel/test/` | Smoke test |
| Cloud Functions | Jest + ts-jest | `functions/src/__tests__/pricing.test.ts` | `computeFare`, `promoDiscount`, `settle`, `commissionFor`, `subscriptionCovers`, `cancellationFee`, `haversineKm`, `fareTotal` |
| Security rules | `@firebase/rules-unit-testing` + Jest | `tests/rules/firestore.rules.test.js` | Allow / deny matrix for customer, driver, admin and anonymous users |

## How to run

```bash
# Once, at the repository root
flutter pub get

# Domain (pure Dart)
dart test packages/core

# Data layer (in-memory Firestore, no emulator needed)
flutter test packages/data

# Each app
flutter test apps/customer_app
flutter test apps/driver_app
flutter test apps/admin_panel

# Cloud Functions maths
cd functions && npm install && npm test
```

Static analysis across the workspace:

```bash
flutter analyze
cd functions && npm run build     # the TypeScript compile is a type check too
```

## Security-rules tests

These need the **Firestore emulator** on `127.0.0.1:8080`:

```bash
# Terminal 1
firebase emulators:start --only firestore --project demo-rules-test

# Terminal 2
cd tests/rules && npm install && npm test
```

The suite loads `firebase/firestore.rules` itself, uses the project ID `demo-rules-test`, clears the database before every test and signs in as `customer`, `driver`, `admin` or anonymous by setting the `role` claim. The `PERMISSION_DENIED` lines it prints are the `assertFails` cases being correctly denied: expected, not errors.

What it checks, among others:

| Area | Checks |
|---|---|
| `users` | Owner reads own profile, another customer can't; owner can't change `walletBalance`, admin can |
| `rides` | Customer creates own unpaid ride; can't create a paid ride or one for someone else; only participants read a ride; drivers can list requested rides; a rider can't mark a ride paid or rewrite its fare |
| Ledger & payments | Owners read their own rows; no client writes `transactions` or `payments` |
| `sos_alerts` | Driver creates own, customer can't create as a driver, riders raise under `userId` only |
| Catalogue & settings | Public read, admin-only write; `secure_settings` admin-only; `promo_codes` signed-in read |
| Support | Owner creates ticket + first message in one batch; owner can't self-resolve or reassign; staff can |
| Driver KYC | New profile can't start with money or approval; documents only as `pending`, one at a time (`lastDocumentId`) |
| Subscriptions | A driver can't grant themselves a commission waiver or reset ride usage |
| Default deny | Unknown collections are denied to everyone |

## Manual checks before a release

Some things need real devices and real gateways:

| Area | How |
|---|---|
| Online payments | Test keys: Stripe `4242 4242 4242 4242` (success) / `4000 0000 0000 0002` (decline), Razorpay mock bank *Success* / *Failure*, PayPal sandbox buyer. Check `payments/{id}`, the wallet or ride, and the ledger row. See [Payment Flow](doc:api/payments) |
| Ride flow | Book → accept → arrive → OTP → start → complete on two phones; check `commission`, `driverEarning` and both wallets. See [Setup Guide](doc:installation/setup-guide) |
| Late cancellation | Cancel as the rider after the free window; check the fee on both wallets |
| Expiry | Book with no driver online; after `autoCancelSeconds` the ride becomes `noDriversFound` |
| GPS | Driver location updates while moving, after the app was in the background, and after network loss |
| Push | Ride request, ride status, KYC, payout and broadcast notifications on Android and iOS |
| Maintenance & versions | Turn on maintenance mode and raise the minimum version; both apps react |

:::tip Run the functions locally
To test a change to a trigger end to end before deploying, run the full Emulator Suite and the apps with `USE_EMULATOR=true`. See [Localhost & Emulators](doc:installation/localhost-setup).
:::

**Next:** [Changelog →](doc:changelog)
