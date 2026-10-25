---
title: Going Online & Live Location
description: The driver Home screen, the conditions for going online (approval, location permission, minimum wallet), how the live location is shared with riders and dispatch, blocked accounts and SOS.
---

![Home offline](/docs/go4ride/images/app-driver-home-offline.webp "You're offline")
![Low wallet](/docs/go4ride/images/app-driver-low-wallet.webp "Low wallet balance")
![Request](/docs/go4ride/images/app-driver-request.webp "Incoming request")

## Home screen

`lib/features/home/home_screen.dart`:

| Element | Content |
|---|---|
| App bar | Avatar with the initial (opens Account), *Hi, {first name}*, Earnings and Menu buttons |
| Availability bar | *You're online* / *You're offline*, the wallet balance and the online switch |
| Body | Offline: *Go online to start earning*. Online: the list of incoming requests (*Waiting for requests* when empty). During a trip: the trip panel |
| **SOS** button (red, bottom right) | Always visible |

## Going online

Flipping the switch on runs these checks in order:

| Check | If it fails |
|---|---|
| Driver is **KYC-approved** | Not possible: unapproved drivers never reach Home |
| Wallet ≥ **Minimum driver wallet to accept rides** (Admin → Settings → Driver & ride) | Sheet *Low wallet balance*: *Keep at least ₹100 in your wallet to go online (current balance ₹40.00).* with **Open wallet** |
| **Location permission** granted | *Location permission needed to go online.* |
| Not under **maintenance** | The maintenance page blocks the app and takes the driver offline |
| Not **blocked** | The *Account blocked* screen with **Contact support** and **Sign out** |

Then the app refreshes the driver role claim and writes `isOnline: true` on `drivers/{uid}`.

With the default minimum of **0** the wallet check is skipped. Set a minimum when drivers collect cash, because their commission is deducted from the wallet and can make it negative ([Earnings, Wallet & Payouts](doc:app-driver/earnings)).

## Live location

While the driver is online and approved, the app listens to the GPS (high accuracy, every **10 m** of movement) and, for each position:

1. writes `{lat, lng, updatedAt}` to the Realtime Database at **`driver_locations/{uid}`**: riders' ride screen and the admin **Online drivers** map read it live,
2. updates `currentLocation` on `drivers/{uid}` in Firestore: `onRideCreated` uses it to find drivers within the **search radius**.

Going offline stops the stream and **removes** `driver_locations/{uid}`.

:::warning Keep the app open while online
The Driver App has no background location service. When the driver switches to another app or locks the phone, Android and iOS stop or throttle the updates, so riders see the marker freeze. Ask drivers to keep the app in the foreground (a phone mount and screen-on). There is no `ACCESS_BACKGROUND_LOCATION` permission, so no background-location declaration is needed on Google Play.
:::

*Driver location update (seconds)* in the admin settings is stored but not used by the app, which updates by distance.

## Who receives a request

When a rider books, `onRideCreated` picks drivers that are:

- online (`isOnline`) and KYC-approved,
- not blocked,
- at or above the minimum wallet,
- within **Search radius (km)** of the pickup (default 5 km). Drivers without a known position are included.

Up to 25 of them get a push *New ride request*. Nobody eligible → the ride becomes *No drivers found*.

In the app, the **request list** shows the 20 newest rides that are still `requested` and unassigned, updated live. It does not filter by distance, so in a busy city drivers may see requests far away. See [Ride Workflow & OTP](doc:app-driver/ride-workflow) for the card and accepting.

:::note Push for drivers
The backend sends *New ride request* to the `fcmToken` on the driver profile, but the shipped Driver App does not save that token (and does not request the Android 13+ notification permission), so drivers rely on the live list in the app. Add the token in the same way as for the rider app ([Push Notifications](doc:app-customer/notifications)) with `DriverRepository.updateFcmToken`. Broadcasts to the topics `all` and `drivers` do reach drivers.
:::

## SOS

**SOS** → *Send SOS?* *This alerts the operations team with your live location.* → **Send SOS**. The app saves an alert in `sos_alerts` with the driver ID, current location and the active ride, and shows *SOS sent. Help is on the way.* During a trip the trip panel also has an **SOS** button and **Call 112** (the emergency number from App settings). Your team handles alerts in [SOS Alerts](doc:admin/sos-alerts).

## Blocked drivers

If an admin blocks the driver (Drivers page), the app takes them offline at once and shows *Account blocked* with **Contact support**.

## Maintenance and updates

| Admin setting | Driver App |
|---|---|
| Maintenance mode → **Driver app under maintenance** | *Under maintenance* page with your message. The app sets the driver offline so no new rides are assigned |
| Driver app versions → minimum version, Force update off | Optional update prompt |
| Same, Force update on | *Update required* page |

**Next:** [Ride Workflow & OTP →](doc:app-driver/ride-workflow)
