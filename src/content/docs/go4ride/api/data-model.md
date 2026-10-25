---
title: Data Model (Firestore)
description: Every Cloud Firestore collection Go4Ride uses, with its key fields and who writes it, plus the Realtime Database and Cloud Storage paths.
---

Go4Ride keeps its data in **Cloud Firestore** (database `(default)`), with live driver positions in the **Realtime Database** and files in **Cloud Storage**. The shared definition lives in `docs/DATA_CONTRACT.md` in the repository and in the Dart models in `packages/core/lib/src/models`. Field names below are exactly what is stored.

## Types

| Value | Stored as |
|---|---|
| Dates and times | Firestore `Timestamp` (server time). A few older fields accept epoch milliseconds |
| Money | number, major units (₹215.50) |
| Enums | camelCase strings (`driverArriving`, `noDriversFound`, `ridePayment`) |
| Positions | `{lat, lng}` maps |
| IDs | Auto IDs, except `users/{uid}`, `drivers/{uid}`, `staff/{uid}` (Auth uid), `services/{key}`, `promo_codes/{CODE}`, `settings/{page}` |

## People

| Collection | Key fields | Written by |
|---|---|---|
| `users/{uid}` | `name`, `phone`, `email`, `gender`, `photoUrl`, `role`, `walletBalance`, `fcmToken`, `isBlocked`, `loyaltyPoints`, `referralCode`, `referredBy`, `createdAt` | Rider (own profile, never `walletBalance`, `role`, `isBlocked`, `loyaltyPoints`, `referredBy`); admin; functions (wallet) |
| `drivers/{uid}` | `name`, `phone`, `isFemale`, `vehicleInfo`, `vehicleTypeId`, `kycStatus` (`notSubmitted` · `pending` · `approved` · `rejected`), `documents: {docTypeId: {front, back, expiry, status, reason}}`, `lastDocumentId`, `kycReason`, `kycRejectReason`, `kycReviewedAt`, `kycDocUrls` (legacy), `isOnline`, `currentLocation {lat, lng}`, `rating`, `totalRatings`, `earnings`, `walletBalance`, `isBlocked`, `badges[]`, `fcmToken`, `createdAt` | Driver (profile, documents as `pending`); admin (KYC decisions, block); functions (money, KYC status) |
| | Subscription: `subscriptionId`, `subscriptionName`, `subscriptionExpiry`, `subscriptionRideLimit` (−1 = unlimited), `subscriptionRidesUsed`, `subscriptionWaivesCommission` | Functions only (`purchaseSubscription`, settlement) |
| `staff/{uid}` | `name`, `email`, `phone`, `photoUrl`, `roleId`, `roleName`, `type` (`employee` · `dispatcher`), `active`, `createdAt`, `updatedAt` | `createStaffUser` / `updateStaff` |
| `roles/{id}` | `name`, `type` (`system` · `admin` · `custom`), `protected`, `permissions: {moduleId: ['view','edit','delete']}` (module ids = sidebar ids) | Admin |

## Rides

| Collection | Key fields | Written by |
|---|---|---|
| `rides/{id}` | `type` (`city` · `intercity` · `rental` · `parcel`), `sharing`, `status`, `customerId`, `driverId`, `pickup`, `drops[]`, `vehicleClass`, `vehicleTypeId`, `fare {baseFare, distanceFare, timeFare, waitingCharge, surgeMultiplier, platformFee, tax, discount, distanceKm, durationMin, currency, total}`, `paymentMode` (`cash` · `wallet` · `card`), `isPaid`, `paymentStatus`, `otp`, `promoCode`, `zoneId`, `rentalPackageId`, `parcelDetails`, `femaleOnly`, `biddingEnabled`, `scheduledAt`, `dispatcherId`, `dispatcherName`, `cancelReason`, `cancelledBy`, timestamps `createdAt` · `acceptedAt` · `startedAt` · `completedAt` · `cancelledAt` · `noDriversAt` | Rider / dispatcher (create), driver (claim, status), rider / driver (cancel) |
| | Functions only: `settledAt`, `commission`, `driverEarning`, `cancellationFee`, `paymentGateway`, `paymentId`, `paidAt` | Functions |
| `bids/{id}` | `rideId`, `driverId`, `driverName`, `driverRating`, `amount`, `etaMinutes`, `status`, `createdAt` | Driver (bidding flow; data layer only today) |
| `ratings/{id}` | `rideId`, `fromId`, `toId`, `stars`, `review`, `createdAt` | Rider / driver (as `fromId`) |
| `sos_alerts/{id}` | `rideId`, `location`, `note`, `raisedBy` (`customer` · `driver`), `userId` or `driverId`, `status` (`active` · `resolved`), `resolution`, `createdAt` | Rider / driver (create), staff (resolve) |

## Money

| Collection | Key fields | Written by |
|---|---|---|
| `transactions/{id}` | The ledger. `userId`, `type` (`ridePayment` · `commission` · `payout` · `subscription` · `cancellationFee` · `topup` · `refund` · `promoCredit`), `amount` (signed), `status`, `currency`, `rideId`, `gateway`, `paymentId`, `paymentMode`, `planId`, `createdAt` | Functions (admins may write) |
| `payments/{id}` | Online attempts: `userId`, `purpose` (`ride` · `topup`), `rideId`, `gateway`, `amountInr`, `amount`, `currency`, `gatewayRef`, `checkoutUrl`, `status` (`created` · `paid` · `failed`), `gatewayPaymentId`, `reason`, `createdAt`, `paidAt`, `updatedAt` | Functions only |
| `withdrawals/{id}` | `driverId`, `amount`, `method`, `accountRef`, `note`, `status` (`requested` · `approved` · `paid` · `rejected`), `requestedAt`, `processedAt`, `paidAt` | Driver (create as `requested`), admin / `approveWithdrawal` |
| `subscriptions/{id}` | `userId`, `userName`, `type`, `planId`, `planName`, `price`, `paymentType`, `startedAt`, `expiry`, `isActive`, `createdAt` | `purchaseSubscription` |

## Support and notifications

| Collection | Key fields | Written by |
|---|---|---|
| `support_tickets/{id}` | `ticketNo`, `userId`, `userName`, `userType` (`customer` · `driver`), `reasonId`, `reasonTitle`, `description`, `imageUrl`, `rideId`, `status` (`pending` · `active` · `resolved` · `closed`), `assignedTo`, `assignedName`, `lastMessage`, `lastMessageAt`, `createdAt`, `updatedAt` | Rider / driver (create as `pending`, last-message preview), staff |
| `support_tickets/{id}/messages/{id}` | `senderId`, `senderType` (`customer` · `driver` · `staff`), `senderName`, `text`, `imageUrl`, `createdAt` | Ticket owner, staff |
| `notifications/{id}` | In-app inbox: `title`, `body`, `type`, `target` (uid or `all`), `data`, `imageUrl`, `isRead`, `sentAt` | Admin |
| `push_notifications/{id}` | Broadcast history: `title`, `body`, `audience` (`all` · `customers` · `drivers`), `topic`, `imageUrl`, `sentBy`, `sentAt` | Admin |

## Catalogue (public read, admin write)

| Collection | Key fields |
|---|---|
| `services/{key}` (`city`, `intercity_sharing`, `intercity`, `rental`, `parcel`) | `key`, `title`, `description`, `image`, `bidEnabled`, `active`, `order` |
| `vehicle_types/{id}` | `name`, `image`, `seats`, `baseFare`, `perKm`, `perMinute`, `minFare`, `services[]`, `order`, `active` |
| `vehicle_brands/{id}` · `vehicle_models/{id}` | `name`, `logo`, `active` · `name`, `brandId`, `vehicleTypeId`, `active` |
| `document_types/{id}` | `title`, `sides` (`one` · `two`), `required`, `expiryRequired`, `order`, `active` |
| `zones/{id}` | `name`, `polygon[] {lat, lng}`, `baseFare`, `perKm`, `perMinute`, `surgeMultiplier`, `isActive` |
| `rental_packages/{id}` | `name`, `vehicleTypeId`, `price`, `hours`, `km`, `extraPerKm`, `extraPerHour`, `isActive` |
| `promo_codes/{CODE}` | `discount`, `isPercentage`, `maxDiscount`, `minRideAmount`, `validFrom`, `validTo`, `usageLimit`, `usedCount`, `isActive`, `title`, `visibility` (`public` · `private`). Readable by signed-in users only |
| `banners/{id}` · `onboarding/{id}` | `title`, `imageUrl`, `description`, `offerText`, `action`, `position`, `isActive` · `title`, `description`, `image`, `audience`, `order`, `active` |
| `cancel_reasons/{id}` · `help_reasons/{id}` | `title`, `audience`, `order`, `active` (help reasons add `description`, `allowImage`) |
| `subscription_plans/{id}` | `name`, `description`, `price`, `validityDays`, `rideLimit` (−1 = unlimited), `type` (`free` · `paid`), `features[]`, `active` |
| `achievement_badges/{id}` | `name`, `image`, `tier`, `category` (`rides` · `rating` · `earnings` · `cancellation`), `threshold`, `audience`, `active` |
| `languages/{code}` · `currencies/{CODE}` · `taxes/{id}` | `name`, `code`, `nativeName`, `rtl`, `isDefault`, `active` · `code`, `symbol`, `symbolSide`, `decimals`, `isDefault`, `active` · `name`, `rate`, `type`, `country`, `active` |
| `content_pages/{page}_{audience}` | `title`, `content: {langCode: markdown}` for `about`, `privacy`, `terms` × `customer`, `driver` |
| `email_templates/{key}` | `name`, `trigger`, `subject`, `body`, `variables[]`, `enabled` (staff read only) |

## Settings and system

| Document | Contents | Access |
|---|---|---|
| `settings/{doc}` | One document per settings page: `general`, `app_theme`, `app`, `map`, `maintenance`, `business`, `driver_ride`, `surge`, `payment`, `landing`, `contact`. Keys in `apps/admin_panel/lib/modules/settings_specs.dart` | Public read, admin write |
| `secure_settings/payment` · `secure_settings/smtp` | Gateway secrets · SMTP credentials | Admin only (functions bypass) |
| `config/pricing` | Legacy global fare config (`baseFare`, `perKm`, `perMinute`, `surgeMultiplier`, `platformFeePct`, `commissionPct`, `taxPct`, `currency`, `minFare`) read by `calculateFare` and as commission fallback | Public read, admin write |
| `analytics_daily/{YYYY-MM-DD}` | `completedRides`, `revenue`, `byType`, `generatedAt` | Staff read, nobody writes (functions only) |

Any collection not listed in the rules is denied to every client.

## Realtime Database

| Path | Value | Rules |
|---|---|---|
| `driver_locations/{driverId}` | `{lat, lng, heading, updatedAt}` (server timestamp). Removed when the driver goes offline | Read: any signed-in user. Write: only that driver. Must have `lat` and `lng`. Indexed on `updatedAt` |

## Cloud Storage

| Path | Contents | Rules |
|---|---|---|
| `kyc/{driverId}/{docTypeId}_{side}` | Driver documents (image or PDF) | Owner writes; owner and staff read |
| `profile/{userId}/{file}` | Profile photos | Owner writes; signed-in users read |
| `rides/{rideId}/{file}` | Ride images (for example parcel proof) | Signed-in users read and write |
| `support/{ticketId}/{ts}_{name}` | Rider / driver ticket attachments | Signed-in users read and write |
| `admin_uploads/{folder}/{ts}_{name}` | Catalogue images, banners, badges, staff replies (`admin_uploads/support/{ticketId}/…`) | Public read; staff write |
| `banners/{file}` | Legacy CMS banners | Public read; admin write |

Uploads must be images (`image/*`; KYC also allows `application/pdf`) and smaller than 10 MB.

## Composite indexes

`firebase/firestore.indexes.json` defines: `rides` (`customerId` + `createdAt` desc, `driverId` + `createdAt` desc, `status` + `createdAt` desc), `bids` (`rideId` + `status`, `driverId` + `createdAt` desc), `transactions` (`userId` + `createdAt` desc), `withdrawals` (`driverId` + `requestedAt` desc), `banners` (`isActive` + `position`).

**Next:** [Security Rules →](doc:api/security-rules)
