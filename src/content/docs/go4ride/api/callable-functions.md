---
title: Callable Functions
description: Reference for every Go4Ride callable Cloud Function. Who may call it, the input it takes, what it returns, what it changes and the errors it raises.
---

Callables are invoked from the apps with `FirebaseFunctions.instance.httpsCallable('<name>').call({...})`. The caller's identity comes from the Firebase ID token the SDK attaches. **Admin** means the custom claim `role == "admin"`; staff and dispatchers can't call the admin functions, even if their panel role shows the page.

The payment callables `createPayment` and `checkPayment` are documented with the HTTP endpoint on [Payment Flow](doc:api/payments).

## Summary

| Function | Caller | Used by | Source |
|---|---|---|---|
| `calculateFare` | Anyone | Available to the apps (the booking screen currently prices client-side) | `fare.ts` |
| `purchaseSubscription` | Driver | Driver App → Subscription plans | `subscriptions.ts` |
| `reviewKyc` | Admin | Panel → Drivers → Approve / Reject | `admin.ts` |
| `approveWithdrawal` | Admin | Panel → Payout requests | `payouts.ts` |
| `sendBroadcast` | Admin | Panel → Push notifications | `admin.ts` |
| `setUserRole` | Admin | Scripts / future UI | `admin.ts` |
| `createStaffUser` | Admin | Panel → Employees, Dispatch users | `staff.ts` |
| `updateStaff` | Admin | Panel → Employees, Dispatch users | `staff.ts` |
| `deleteStaff` | Admin | Panel → Employees, Dispatch users | `staff.ts` |
| `devBootstrapAdmin` | Signed in, **emulator only** | Panel → *Admin access required* screen | `admin.ts` |

## calculateFare

Computes a fare breakdown from distance and time with the global pricing, an optional zone override and an optional promo code.

| | |
|---|---|
| **Caller** | Anyone (no auth check) |
| **Input** | `distanceKm` (number, required), `durationMin` (number), `zoneId?`, `promoCode?`, `waitingMinutes?` |
| **Output** | `FareBreakdown`: `baseFare`, `distanceFare`, `timeFare`, `waitingCharge`, `surgeMultiplier`, `platformFee`, `tax`, `discount`, `distanceKm`, `durationMin`, `currency`, `total` |
| **Reads** | `config/pricing` (falls back to built-in defaults), `zones/{zoneId}` (`baseFare`, `perKm`, `perMinute`, `surgeMultiplier`), `promo_codes/{CODE}` (upper-cased) |
| **Writes** | Nothing |
| **Errors** | `invalid-argument` when `distanceKm` is missing or not a number |

The maths (`computeFare` in `pricing.ts`): metered = (base + km × perKm + min × perMinute + waiting min × perMinute) × surge. Platform fee and tax are percentages of the metered amount. The promo discount respects `isActive`, `usageLimit`/`usedCount`, `minRideAmount` and `maxDiscount`. The total never goes below `minFare`.

:::note What the booking screen uses today
The Customer App's booking screen estimates the fare on the device from the selected **vehicle type's** rates (`baseFare`, `perKm`, `perMinute`, `minFare` from `vehicle_types`) and stores that breakdown in the ride. After creation the rules forbid any client from changing `fare`. Settlement, online payment and cancellation fees all use the stored `fare.total`. `calculateFare` is deployed and ready if you want server-side pricing.
:::

## purchaseSubscription

A driver buys a paid plan from their wallet, or activates a free plan.

| | |
|---|---|
| **Caller** | Signed-in user with claim `role == "driver"` |
| **Input** | `planId` (string) |
| **Output** | `{ ok: true, expiry: "<ISO date>" }` |
| **Errors** | `permission-denied` (not a driver), `invalid-argument` (no `planId`), `not-found` (plan missing or `active: false`), `failed-precondition` (no driver profile, or *"Insufficient wallet balance. You need ₹…"*) |

In one transaction it:

1. Reads `subscription_plans/{planId}` and `drivers/{uid}`. A plan is free when `type == "free"` or `price <= 0`.
2. Computes the new expiry: from **now**, or from the current `subscriptionExpiry` if that is later (renewing extends), plus `validityDays` (default 30).
3. Updates the driver: `subscriptionId`, `subscriptionName`, `subscriptionExpiry`, `subscriptionRideLimit` (`rideLimit`, −1 = unlimited), `subscriptionRidesUsed: 0`, `subscriptionWaivesCommission` (true for paid plans), and for paid plans `walletBalance − price`.
4. Adds a `subscriptions` row (`userId`, `userName`, `type: "driver"`, `planId`, `planName`, `price`, `paymentType` = *Wallet* or *Free plan*, `startedAt`, `expiry`, `isActive: true`).
5. For paid plans adds a `transactions` row of type `subscription` with a negative amount.

While a paid plan is active and under its ride limit, settlement takes **no commission** and counts the ride in `subscriptionRidesUsed`. See [Ride Lifecycle](doc:api/ride-lifecycle).

## reviewKyc

Approves or rejects a driver's KYC as a whole and notifies the driver.

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `driverId`, `approve` (boolean), `reason?` |
| **Output** | `{ ok: true }` |
| **Writes** | `drivers/{driverId}`: `kycStatus` = `approved` / `rejected`, `kycReviewedAt`, `kycRejectReason` (null on approve) |
| **Side effects** | Push to the driver: *KYC approved* (*"You can now go online and accept rides."*) or *KYC rejected* (the reason) |
| **Errors** | `permission-denied` |

Per-document decisions (`documents.<docTypeId>.status` and `.reason`) are written by the panel directly, which the rules allow for admins only. Drivers can never set a document or their `kycStatus` to anything but `pending`.

## approveWithdrawal

Processes a driver's payout request.

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `withdrawalId`, `approve` (boolean) |
| **Output** | `{ ok: true }` |
| **Errors** | `permission-denied`, `not-found`, `failed-precondition` (*Already processed.* when status isn't `requested`; *Insufficient driver balance.*) |

On **approve**, in one transaction: driver `walletBalance − amount`, withdrawal `status: "approved"` + `processedAt`, and a `transactions` row of type `payout`. On **reject**: `status: "rejected"` + `processedAt`, wallet unchanged. Either way the driver gets a *Withdrawal update* push. Marking the money as transferred (`status: "paid"`, `paidAt`) is a separate panel action. See [Payout Requests](doc:admin/payouts).

## sendBroadcast

Sends a push notification to an FCM topic.

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `topic`, `title`, `body` (all required) |
| **Output** | `{ ok: true }` |
| **Side effects** | FCM message to `/topics/<topic>` with `data.type = "broadcast"` |
| **Errors** | `permission-denied`, `invalid-argument` |

The Customer App subscribes to `all` and `customers`, the Driver App to `all` and `drivers`. The panel writes the history row in `push_notifications`. See [Push Notifications](doc:admin/push-notifications).

## setUserRole

Sets a user's custom claim `role`.

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `uid`, `role`: one of `customer`, `driver`, `admin`, `staff`, `dispatcher` |
| **Output** | `{ ok: true }` |
| **Errors** | `permission-denied`, `invalid-argument` (*Invalid role.*) |

It **replaces** all custom claims with `{ role }`, so a staff member's `roleId` is dropped. Use `updateStaff` for staff. The user needs to refresh their ID token (sign out and in) to see the change.

## createStaffUser

Creates an employee or dispatch user.

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `name`, `email`, `password` (≥ 8 characters), `roleId`, `type` (`employee` or `dispatcher`), `phone?` |
| **Output** | `{ uid }` |
| **Errors** | `permission-denied`; `invalid-argument` (name, e-mail, password, role or type invalid; phone not in international format); `not-found` (*The selected role no longer exists.*); `already-exists` (e-mail or phone in use) |

Steps: checks `roles/{roleId}` exists, creates the Auth user (the phone number goes to Auth only if it starts with `+`), sets claims `{ role: "staff" | "dispatcher", roleId }`, writes `staff/{uid}` (`name`, `email`, `phone`, `roleId`, `roleName`, `type`, `active: true`, `createdAt`, `updatedAt`). If the profile write fails, the new Auth user is deleted again.

## updateStaff

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `uid`, and any of `name`, `phone`, `roleId`, `active` |
| **Output** | `{ ok: true }` |
| **Errors** | `permission-denied`, `invalid-argument`, `not-found` |

A new `roleId` re-issues the claims (type kept). `active: false` disables the Auth user **and revokes its refresh tokens**, so the person is signed out. `active: true` re-enables it. A new `name` also updates the Auth display name.

## deleteStaff

| | |
|---|---|
| **Caller** | Admin |
| **Input** | `uid` |
| **Output** | `{ ok: true }` |
| **Errors** | `permission-denied`, `invalid-argument`, `failed-precondition` (*You can't delete your own account.*) |

Deletes the Auth user (ignored if already gone) and `staff/{uid}`.

## devBootstrapAdmin

| | |
|---|---|
| **Caller** | Any signed-in user, **only when `FUNCTIONS_EMULATOR === "true"`** |
| **Input** | none |
| **Output** | `{ ok: true, uid }` |
| **Errors** | `permission-denied` (*Disabled outside the emulator.*) in production; `unauthenticated` |

Sets the caller's claims to `{ role: "admin" }`. It exists so you can get into the panel on the [emulators](doc:installation/localhost-setup). In production create the first admin as in [Create the First Admin](doc:installation/super-admin).

**Next:** [Triggers & Scheduled Jobs →](doc:api/triggers)
