---
title: Ride Lifecycle
description: Every status a Go4Ride ride passes through, who moves it, which timestamps and fields each step writes, and what the backend does at each transition.
---

A ride is one document in `rides/{rideId}`. The rider creates it, a driver claims it, the driver moves it forward, and the functions react to each status change. The status values come from the `RideStatus` enum in `packages/core`.

## Statuses

| Status | Meaning | Set by |
|---|---|---|
| `requested` | Waiting for a driver | Customer App (or a dispatcher in the panel) |
| `bidding` | Reserved for the bidding flow (enum value; drivers' bid UI isn't wired yet) | — |
| `accepted` | A driver claimed the ride | Driver App (transaction) |
| `driverArriving` | Driver is driving to the pickup | Driver App: *Navigate to pickup* |
| `driverArrived` | Driver is at the pickup; the waiting timer runs | Driver App: *I've arrived* |
| `inProgress` | Trip started (after the OTP check) | Driver App: *Start trip* |
| `onHold` | Trip paused; the waiting timer runs | Driver App |
| `completed` | Trip finished. Settlement runs | Driver App: *Complete trip* |
| `cancelled` | Cancelled by rider, driver or admin | Apps / panel |
| `noDriversFound` | No eligible driver, or no one accepted in time | Functions |

`completed`, `cancelled` and `noDriversFound` are terminal.

```text
requested ──▶ accepted ──▶ driverArriving ──▶ driverArrived ──▶ inProgress ──▶ completed
    │            │               │                  │           ▲     │
    │            └───────────────┴──────────────────┴──▶ cancelled    ▼
    │                                                           └── onHold
    └──▶ noDriversFound  (onRideCreated: nobody eligible · expireRideRequests: too old)
```

## 1. Booking

The Customer App writes the ride with `status: "requested"`, `createdAt` (server time) and:

| Field | Content |
|---|---|
| `type` | `city`, `intercity`, `rental` or `parcel` (`sharing: true` for Intercity Sharing) |
| `customerId` | The rider's uid (a dispatcher booking adds `dispatcherId`, `dispatcherName`) |
| `pickup`, `drops[]` | Address + `position {lat, lng}` |
| `vehicleTypeId`, `vehicleClass` | Selected vehicle type |
| `fare` | Fare breakdown estimated from the vehicle type's rates, with any promo discount |
| `paymentMode` | `cash`, `wallet` or `card` (online gateway) |
| `isPaid: false`, `paymentStatus: "unpaid"` | Required by the rules |
| `otp` | Random 4-digit code, only when `settings/business.otpRequired` is on |
| Optional | `promoCode`, `rentalPackageId`, `parcelDetails {receiverName, receiverPhone, note}`, `femaleOnly`, `biddingEnabled`, `scheduledAt`, `zoneId` |

**Backend:** `onRideCreated` notifies up to 25 eligible drivers or sets `noDriversFound`. See [Triggers](doc:api/triggers).

## 2. Accept

Online drivers watch `rides` where `status == "requested"` and see a request card with a countdown of `settings/driver_ride.requestTimeoutSeconds` (default **30 s**). Accepting runs a **transaction**: it fails with *This ride was already taken.* if `driverId` is already set, otherwise writes `driverId`, `status: "accepted"`, `acceptedAt`.

A driver can only go online when their KYC is approved, location permission is granted and their wallet is at least `minWalletToAccept`. While online the Driver App writes its position to the Realtime Database (`driver_locations/{uid}`) and to `drivers/{uid}.currentLocation`, which dispatch uses for the radius check.

If nobody accepts within `autoCancelSeconds` (default **180 s**), `expireRideRequests` sets `noDriversFound`.

## 3. Arrive and wait

*Navigate to pickup* → `driverArriving`; *I've arrived* → `driverArrived`. The rider follows the driver live from `driver_locations/{driverId}`.

While `driverArrived` (and later `onHold`) the Driver App shows a waiting timer: the first `freeWaitingMinutes` (default 3) are free, then `waitingChargePerMinute` (default ₹2) per started minute. The amount is shown to the driver; it isn't added to the stored fare automatically.

## 4. Start with OTP

When `otpRequired` is on and the ride has an `otp`, *Start trip* opens a sheet where the driver enters the rider's 4-digit code. The code is compared in the Driver App with `rides.otp` (the rider sees it on the active ride screen). Only a match moves the ride to `inProgress` and stamps `startedAt`.

## 5. Complete and settle

*Complete trip* → `completed` + `completedAt`. `onRideStatusChanged` then settles exactly once (guarded by `settledAt`):

| Payment mode | Driver wallet | Rider wallet | Ride |
|---|---|---|---|
| `cash` | − commission | — | marked paid |
| `wallet` | + driver earning | − fare (at completion) | marked paid, `paymentGateway: "wallet"` |
| `card` (online) | + driver earning | — | paid when the online payment succeeds (before or after completion) |

Commission comes from **Settings → Business model** and is waived by an active paid subscription. The ride gets `commission`, `driverEarning`, `settledAt`; the ledger gets `ridePayment` and `commission` rows. Full rules: [Commission, Wallet & Settlement](doc:admin/commission-wallet).

## 6. Cancel

The Customer App offers *Cancel* on any ride that isn't finished; the Driver App only while `accepted`, `driverArriving` or `driverArrived`. The app writes `status: "cancelled"`, `cancelReason`, `cancelledBy` (`customer`, `driver` or `admin`) and `cancelledAt`.

If the **rider** cancels after a driver accepted and more than `freeCancelSeconds` (default 120 s) after `acceptedAt`, `onRideStatusChanged` charges `cancellationCharge` (default ₹25 fixed, or a percentage of the fare) to the rider's wallet and pays it to the driver, once (guarded by `cancellationFee`).

## 7. SOS during a ride

Rider and driver can raise an SOS from an active ride. It creates `sos_alerts/{id}` with `rideId`, `location`, `raisedBy` (`customer` / `driver`), `status: "active"` and either `userId` (rider) or `driverId` (driver). Staff resolve it in the panel (`status: "resolved"`, `resolution`). The apps also offer a call to `settings/app.emergencyNumber`. See [SOS Alerts](doc:admin/sos-alerts).

## Timestamps

| Field | Written when |
|---|---|
| `createdAt` | Booking |
| `acceptedAt` | Accept transaction |
| `startedAt` | `inProgress` |
| `completedAt` | `completed` |
| `cancelledAt` | `cancelled` |
| `noDriversAt` | `noDriversFound` (functions) |
| `settledAt`, `paidAt` | Settlement / payment (functions) |

**Next:** [Payment Flow →](doc:api/payments)
