---
title: Triggers & Scheduled Jobs
description: The Firestore triggers that dispatch rides, settle earnings, charge cancellation fees and grant roles, and the two scheduled jobs that expire stale requests and roll up daily stats.
---

Go4Ride has four Firestore triggers (2nd gen, delivered through Eventarc) and two scheduled functions (Cloud Scheduler). They have no callers: they react to data the apps write. All of them use the Admin SDK, so the security rules don't apply to what they write.

| Function | Fires on | Source |
|---|---|---|
| `onRideCreated` | `rides/{rideId}` created | `rides.ts` |
| `onRideStatusChanged` | `rides/{rideId}` updated and `status` changed | `rides.ts` |
| `onDriverProfileCreated` | `drivers/{uid}` created | `roles.ts` |
| `onUserProfileCreated` | `users/{uid}` created | `roles.ts` |
| `expireRideRequests` | Every minute | `scheduled.ts` |
| `dailyAnalyticsRollup` | Every day at 00:30 | `scheduled.ts` |

## onRideCreated: dispatch

Finds drivers for a new ride request and notifies them.

1. Reads `settings/driver_ride`: `searchRadiusKm` (default **5**) and `minWalletToAccept` (default **0**).
2. Queries `drivers` where `isOnline == true` and `kycStatus == "approved"` (up to 200).
3. Keeps drivers that are **not blocked** (`isBlocked != true`), have `walletBalance ≥ minWalletToAccept`, and whose `currentLocation` is within the radius of the ride's `pickup.position` (haversine distance). A driver without a known position is kept rather than silently skipped.
4. **Nobody eligible:** sets the ride to `status: "noDriversFound"` + `noDriversAt` and pushes *No drivers available* to the rider.
5. **Otherwise:** pushes *New ride request* (`data.type = "ride_request"`, `data.rideId`) to the first **25** eligible drivers.

The push is a nudge. Drivers actually see requests through a live query on `rides` where `status == "requested"` (allowed by the rules for any driver), and claim one with a transaction that only succeeds while `driverId` is empty. See [Ride Lifecycle](doc:api/ride-lifecycle).

:::note Scale
Filtering happens in memory over the online set, which is fine for hundreds of online drivers. The code has a `TODO` to move to a geohash query for very large fleets.
:::

## onRideStatusChanged: notify, settle, charge

Runs when a ride's `status` changes (other updates are ignored).

**1. Rider notification.** Pushes *Ride update* to the rider for these statuses:

| Status | Message |
|---|---|
| `accepted` | A driver accepted your ride. |
| `driverArriving` | Your driver is on the way. |
| `driverArrived` | Your driver has arrived. |
| `inProgress` | Your trip has started. |
| `completed` | Trip completed. Thanks for riding! |
| `cancelled` | Your ride was cancelled. |

**2. Settlement** when the ride becomes `completed` and has a `driverId`. In one transaction, skipped if `settledAt` is already set:

- Commission from `settings/business`: `commissionEnabled`, `commissionType` (`percentage` / `fixed`), `commissionValue`. Without business settings the legacy `config/pricing.commissionPct` (default 15 %) applies. Commission never exceeds the fare.
- **No commission** if the driver's paid subscription is active and under its ride limit; the ride is counted in `subscriptionRidesUsed`.
- Driver wallet: **cash** ride → `walletBalance − commission` (the driver already holds the cash). **Wallet / online** ride → `walletBalance + driverEarning`. `earnings + driverEarning` in both cases.
- **Wallet** ride not yet paid: the rider's `walletBalance − total`, a rider `ridePayment` ledger row, and the ride marked paid (`paymentGateway: "wallet"`).
- **Cash** ride: marked paid.
- The ride gets `settledAt`, `commission`, `driverEarning`. The ledger gets a driver `ridePayment` row (+driverEarning) and, if any, a `commission` row.

Example: fare ₹215, commission 10 % → commission ₹21.50, driver earning ₹193.50.

**3. Cancellation fee** when the ride becomes `cancelled`, `cancelledBy == "customer"`, a driver was assigned and `acceptedAt` is known:

- Reads `settings/business`: `cancellationEnabled`, `cancellationType` (`fixed` / `percentage` of the fare), `cancellationCharge`, `freeCancelSeconds` (default 120). No fee inside the free window, when disabled, or when the business document doesn't exist.
- In one transaction, skipped if `cancellationFee` is already set: ride `cancellationFee`, rider `walletBalance − fee` (may go negative), driver `walletBalance + fee` and `earnings + fee`, and two `cancellationFee` ledger rows (−fee rider, +fee driver).
- Push to the rider: *Cancellation fee*.

Cancellations by the driver or an admin never charge the rider.

## onDriverProfileCreated / onUserProfileCreated: roles

When `drivers/{uid}` is created, the user gets the claim `role: "driver"`. When `users/{uid}` is created, `role: "customer"`. Rules:

- Existing claims are kept and only `role` is changed.
- `admin`, `staff` and `dispatcher` are **never** overwritten.
- A driver who also creates a rider profile stays a `driver`.

The apps refresh their ID token after creating the profile so the new claim is active straight away. The driver rules (`isDriver()`) and `purchaseSubscription` depend on it.

## expireRideRequests (every minute)

Closes requests nobody accepted in time.

- Reads `settings/driver_ride.autoCancelSeconds` (default **180**).
- Loads up to 500 rides with `status == "requested"` and sets every one older than the cutoff to `status: "noDriversFound"` + `noDriversAt`, in one batch. `createdAt` may be a Timestamp or epoch milliseconds.

The rider gets no separate push for this; the Customer App watches the ride and shows that no driver was found.

## dailyAnalyticsRollup (daily 00:30)

Aggregates yesterday's completed rides into `analytics_daily/{YYYY-MM-DD}`: `date`, `completedRides`, `revenue` (sum of `fare.total`), `byType` (count per ride type), `generatedAt`. Clients can read it if they are staff; nobody can write it.

:::warning Known limitation
The job filters `completedAt` as **epoch milliseconds**, while the apps store `completedAt` as a server Timestamp, so on a standard install it records zero rides. The current admin dashboard doesn't read `analytics_daily`, so nothing visible depends on it. If you build reports on it, change the query in `scheduled.ts` to compare Timestamps.
:::

## Notification payloads

Every push carries `data.type` so the apps can route it:

| `type` | Sent by | Extra data |
|---|---|---|
| `ride_request` | `onRideCreated` (to drivers) | `rideId` |
| `ride_status` | `onRideCreated`, `onRideStatusChanged` | `rideId` |
| `payment` | `paymentReturn` / `checkPayment` | `paymentId` |
| `kyc_status` | `reviewKyc` | — |
| `withdrawal` | `approveWithdrawal` | — |
| `broadcast` | `sendBroadcast` (topic) | — |

A user without an `fcmToken` is skipped silently.

**Next:** [Ride Lifecycle →](doc:api/ride-lifecycle)
