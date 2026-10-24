---
title: Architecture
description: How Go4Ride's backend is built. The apps talk to Firebase directly, the security rules guard every write, and 19 Cloud Functions handle money, roles, dispatch and payments.
---

Go4Ride has **no REST API**. The three Flutter apps use the Firebase SDKs to read and write Cloud Firestore, the Realtime Database and Cloud Storage directly. **Security rules** decide what each role may do. Everything that moves money or changes roles runs in **Cloud Functions v2** (TypeScript, Node.js 20, `us-central1`) with the Admin SDK, which bypasses the rules.

![Go4Ride architecture](/docs/go4ride/images/architecture.svg "Customer App, Driver App and Admin Panel on one Firebase project")

## The building blocks

| Service | Used for |
|---|---|
| **Firebase Authentication** | Phone OTP (riders, drivers), Email/Password (admin, staff, dispatchers). The custom claim `role` (`customer`, `driver`, `admin`, `staff`, `dispatcher`) drives the rules and the panel |
| **Cloud Firestore** | All business data: users, drivers, rides, ledger, payments, catalogue, settings. See [Data Model](doc:api/data-model) |
| **Realtime Database** | `driver_locations/{driverId}` = `{lat, lng, heading, updatedAt}`, written by the online driver and watched by the rider |
| **Cloud Storage** | `kyc/`, `profile/`, `rides/`, `support/`, `admin_uploads/`. See [Security Rules](doc:api/security-rules) |
| **Cloud Functions** | 12 callables, 1 HTTP endpoint, 4 Firestore triggers and 2 scheduled jobs (table below) |
| **Cloud Messaging** | Notifications to a device token (`fcmToken` on `users` / `drivers`) and to topics `all`, `customers`, `drivers` |

## The 19 functions

| Function | Type | Called by | Page |
|---|---|---|---|
| `calculateFare` | Callable | Anyone | [Callable Functions](doc:api/callable-functions) |
| `createPayment`, `checkPayment` | Callable | Signed-in rider | [Payment Flow](doc:api/payments) |
| `paymentReturn` | HTTP (`onRequest`) | Gateway redirect in the browser | [Payment Flow](doc:api/payments) |
| `purchaseSubscription` | Callable | Driver | [Callable Functions](doc:api/callable-functions) |
| `reviewKyc`, `approveWithdrawal`, `sendBroadcast`, `setUserRole` | Callable | Admin | [Callable Functions](doc:api/callable-functions) |
| `createStaffUser`, `updateStaff`, `deleteStaff` | Callable | Admin | [Callable Functions](doc:api/callable-functions) |
| `devBootstrapAdmin` | Callable | Anyone signed in, **emulator only** | [Callable Functions](doc:api/callable-functions) |
| `onRideCreated`, `onRideStatusChanged` | Firestore trigger (`rides/{rideId}`) | — | [Triggers & Scheduled Jobs](doc:api/triggers) |
| `onDriverProfileCreated`, `onUserProfileCreated` | Firestore trigger | — | [Triggers & Scheduled Jobs](doc:api/triggers) |
| `expireRideRequests`, `dailyAnalyticsRollup` | Scheduled | Cloud Scheduler | [Triggers & Scheduled Jobs](doc:api/triggers) |

All of them are exported from `functions/src/index.ts`. The code is split by topic: `fare.ts`, `rides.ts`, `payments.ts` + `gateways.ts`, `payouts.ts`, `admin.ts`, `staff.ts`, `subscriptions.ts`, `roles.ts`, `scheduled.ts`, plus the pure math in `pricing.ts` and the helpers in `config.ts` and `notifications.ts`.

## Who writes what

| Data | Written by the apps (rules-checked) | Written only by functions |
|---|---|---|
| Ride | Rider creates it (`isPaid: false`). Driver claims it (`driverId`, `accepted`) and moves its `status`. Rider or driver cancels | `settledAt`, `commission`, `driverEarning`, `cancellationFee`, `isPaid`, `paymentStatus`, `paymentGateway`, `paymentId`, `paidAt`, and `noDriversFound` |
| Wallets | — | `walletBalance` on `users` and `drivers`, driver `earnings` |
| Ledger | — | `transactions` |
| Online payments | — | `payments` (clients may only read their own) |
| KYC | Driver uploads documents as `pending` and submits for review | Overall `kycStatus` via `reviewKyc` (admins may also write per-document status from the panel) |
| Subscriptions | — | `subscriptions` and the driver's `subscription*` fields |
| Roles | — | Custom claims, `staff/{uid}` |

## Calling a callable

The apps use the `cloud_functions` package, region default (`us-central1`):

```dart title="Dart"
final res = await FirebaseFunctions.instance
    .httpsCallable('createPayment')
    .call<Map<String, dynamic>>({'purpose': 'topup', 'gateway': 'razorpay', 'amount': 500});
final checkoutUrl = res.data['checkoutUrl'] as String;
```

The SDK sends the user's Firebase ID token automatically. Errors arrive as `FirebaseFunctionsException` with a `code` and a readable `message`:

| Code | Typical cause |
|---|---|
| `unauthenticated` | Not signed in |
| `permission-denied` | Wrong role (for example a non-admin calling `reviewKyc`) |
| `invalid-argument` | Missing or invalid input |
| `not-found` | The ride, plan, role, payment or staff member doesn't exist (or isn't yours) |
| `failed-precondition` | Not allowed in the current state: already paid, already processed, insufficient wallet, gateway turned off |
| `already-exists` | Staff e-mail or phone already in use |
| `unavailable` | The payment gateway refused to create a checkout |

## Conventions

- **Money** is a plain number in major units (₹215.50, not paise). The platform default currency is INR (`settings/general.currency`), but fares carry their own `currency`.
- **Times** are Firestore `Timestamp`s written with `serverTimestamp()`. Some older fields accept epoch milliseconds and the functions handle both.
- **Idempotency**: settlement (`settledAt`), cancellation fees (`cancellationFee`) and payment finalisation (`payments.status`) are each guarded inside a transaction, so a retried trigger or a second redirect never double-charges.
- Settings documents may be missing on a new project. Every function falls back to built-in defaults (for example search radius 5 km, auto-cancel 180 s, top-up ₹50–₹10,000).

**Next:** [Callable Functions →](doc:api/callable-functions)
