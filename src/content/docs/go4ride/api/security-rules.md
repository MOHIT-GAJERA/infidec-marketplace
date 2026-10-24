---
title: Security Rules
description: How Go4Ride's Firestore, Storage and Realtime Database rules protect money, KYC and personal data, role by role, and how to change them safely.
---

The apps write to Firebase directly, so the **security rules are the backend's front door**. They live in three files and are deployed with `firebase deploy --only firestore:rules,storage,database`:

| File | Protects |
|---|---|
| `firebase/firestore.rules` | All Firestore collections |
| `firebase/storage.rules` | Uploaded files |
| `firebase/database.rules.json` | `driver_locations` in the Realtime Database |

Cloud Functions use the Admin SDK and **bypass** the rules. That is why every money movement (wallets, commission, settlement, cancellation fees, payouts, subscriptions, online payments) is done in a function and denied to clients.

## Roles

Rules read the custom claim `request.auth.token.role`:

| Helper | True for |
|---|---|
| `isSignedIn()` | Any signed-in user |
| `isAdmin()` | `role == "admin"` |
| `isStaff()` | `role` in `admin`, `staff`, `dispatcher` |
| `isDispatcher()` | `role == "dispatcher"` |
| `isDriver()` | `role == "driver"` (granted when `drivers/{uid}` is created) |
| `isSelf(id)` | The signed-in uid equals the document id |

Staff and dispatchers get per-module **view / edit / delete** permissions in the panel from `roles/{roleId}`. Those are enforced by the panel UI. In the rules, staff can read operational data (users, rides, ledger, tickets, SOS) and write only tickets, ticket messages and SOS resolutions; catalogue and settings writes are admin-only.

## Firestore, collection by collection

| Collection | Read | Create | Update | Delete |
|---|---|---|---|---|
| `users/{id}` | self, staff | self | admin; self except `walletBalance`, `role`, `isBlocked`, `loyaltyPoints`, `referredBy` | admin |
| `drivers/{id}` | any signed-in user (riders see their driver) | self, with `walletBalance` 0, `earnings` 0, `kycStatus` `notSubmitted`/`pending`, no `isBlocked`, no `subscriptionId` | admin; self, never money, rating, block, subscription or badge fields, `kycStatus` only to `pending`, documents only as `pending` (one per write, the one named in `lastDocumentId`) | admin |
| `rides/{id}` | staff, the rider, the driver, any driver while `status == "requested"` | `isPaid == false` and `customerId == self`, or a dispatcher with `dispatcherId == self` | admin; rider, assigned driver, any driver, or the booking dispatcher, but never `customerId`, `fare`, `isPaid`, `paymentStatus`, `paymentGateway`, `paymentId`, `paidAt`, `settledAt`, `commission`, `driverEarning`, `cancellationFee` | admin |
| `bids/{id}` | signed in | driver as self | admin, the bidding driver | admin, the bidding driver |
| `ratings/{id}` | signed in | `fromId == self` | admin | admin |
| `transactions/{id}` | staff, owner | admin | admin | admin |
| `withdrawals/{id}` | staff, the driver | driver as self with `status == "requested"` | admin | admin |
| `payments/{id}` | staff, owner | nobody | nobody | nobody |
| `subscriptions/{id}` | staff, owner | admin | admin | admin |
| `notifications/{id}` | staff, `target == self` or `"all"` | admin | admin | admin |
| `push_notifications/{id}` | admin | admin | admin | admin |
| `sos_alerts/{id}` | staff, the raiser | driver with `driverId == self`; rider with `userId == self` and no `driverId` | staff | admin |
| `support_tickets/{id}` | staff, owner | owner with `status == "pending"` | staff; owner except `status`, `assignedTo`, `assignedName`, `userId`, `userType` | admin |
| `…/messages/{id}` | staff, ticket owner | `senderId == self` and staff or ticket owner | admin | admin |
| `staff/{id}` | self, staff | admin | admin | admin |
| `roles/{id}` | staff | admin | admin | admin |
| `settings/{doc}`, `config/{doc}` | everyone | admin | admin | admin |
| `secure_settings/{doc}` | admin | admin | admin | admin |
| `analytics_daily/{id}` | staff | nobody | nobody | nobody |
| `email_templates/{id}` | staff | admin | admin | admin |
| Catalogue (`services`, `zones`, `rental_packages`, `vehicle_types`, `vehicle_brands`, `vehicle_models`, `document_types`, `banners`, `onboarding`, `cancel_reasons`, `help_reasons`, `subscription_plans`, `achievement_badges`, `languages`, `currencies`, `taxes`, `content_pages`) | everyone | admin | admin | admin |
| `promo_codes/{id}` | signed in | admin | admin | admin |
| anything else | nobody | nobody | nobody | nobody |

### Why some rules look the way they do

- **Drivers can't approve themselves.** `documentChangeIsPendingUpload()` compares the `documents` map before and after: a driver may change at most the one document named in `lastDocumentId`, and only to `status: "pending"`. `kycStatus` may only move to `pending`. Approved / rejected are written by admins or `reviewKyc`.
- **No free money.** A new driver profile must start with zero wallet and earnings. Nobody but functions and admins can change `walletBalance`, `earnings` or any `subscription*` field, so a driver can't grant themselves a commission waiver.
- **Riders can't mark rides paid.** A ride must be created with `isPaid: false`, and the payment and settlement fields can't be changed by clients afterwards. `payments` is completely read-only for clients.
- **Any driver may update a ride.** Claiming a request needs it: the driver isn't assigned yet. The accept is a transaction that fails if `driverId` is already set, and money fields are still protected. If you need stricter rules, limit driver updates to rides where `driverId` is empty or equal to `uid()`.
- **Ticket and first message in one batch.** Message rules use `getAfter()` on the ticket, because the Customer and Driver apps create the ticket and its first message in the same batch.

## Storage

| Path | Read | Write |
|---|---|---|
| `kyc/{driverId}/{file}` | staff, that driver | that driver; image or PDF; < 10 MB |
| `profile/{userId}/{file}` | signed in | owner; image; < 10 MB |
| `rides/{rideId}/{file}` | signed in | signed in; image; < 10 MB |
| `support/{ticketId}/{file}` | signed in | signed in; image; < 10 MB |
| `admin_uploads/**` | everyone | staff; image; < 10 MB |
| `banners/{file}` | everyone | admin; image |
| anything else | nobody | nobody |

## Realtime Database

```json title="firebase/database.rules.json"
{
  "rules": {
    "driver_locations": {
      ".read": "auth != null",
      ".indexOn": ["updatedAt"],
      "$driverId": {
        ".write": "auth != null && auth.uid === $driverId",
        ".validate": "newData.hasChildren(['lat', 'lng'])"
      }
    }
  }
}
```

Everything outside `driver_locations` is denied by default.

## Changing the rules safely

1. Edit the file, then run the rules tests against the emulator (see [Testing](doc:api/testing)). Add a test for your change.
2. Deploy only the rules: `firebase deploy --only firestore:rules` (or `storage`, `database`).
3. If something breaks, roll back in the console: Firestore → **Rules → History** → pick the previous version → **Publish**.

:::warning Keep the money rules
If you add a field that holds money or a verification outcome, add it to the protected `changes([...])` list of its collection, and write it from a Cloud Function.
:::

**Next:** [Testing →](doc:api/testing)
