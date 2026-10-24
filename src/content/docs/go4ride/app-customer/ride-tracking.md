---
title: Live Tracking, OTP & SOS
description: The live ride screen of the Customer App: status timeline, the driver's live position, the 4-digit start OTP, calling the driver, SOS alerts and ride history.
---

After **Confirm** the rider lands on **Your ride** (`/ride/:id`, `lib/features/rides/active_ride_screen.dart`). Everything on it is live. The screen listens to `rides/{id}` in Firestore and to the driver's position in the Realtime Database, so it updates without refresh.

![Ride](/docs/go4ride/images/app-customer-ride.webp "Driver on the way, OTP card")
![Trip paid](/docs/go4ride/images/app-customer-trip-paid.webp "Completed and paid")
![History](/docs/go4ride/images/app-customer-history.webp "My rides")

## What the screen shows

| Block | Content |
|---|---|
| Map (top third) | Pickup marker, drop marker (green), **Your driver** marker (yellow). The camera follows the driver as they move |
| Status header | Title and hint for the current status (table below) |
| OTP card | *Share this OTP with your driver to start the trip* + the 4-digit code |
| Driver card | Initial avatar, name, rating, vehicle and plate number, **call** button (opens the phone dialer) |
| Trip progress | Timeline: Requested → Driver assigned → Driver on the way → Driver arrived → Trip started → Completed (or a red *Cancelled* / *No drivers found* step) |
| Trip details | Pickup, drop, payment method and fare. The cancel reason once cancelled |
| **Cancel ride** | While the ride is not finished ([Cancellation & Fees](doc:app-customer/cancellation)) |
| **SOS** (app bar, red) | While the ride is active |

## Ride statuses

| Status | Header the rider sees | Set by |
|---|---|---|
| `requested` | *Finding your driver* | Customer App |
| `accepted` | *Driver assigned* | Driver taps **Accept** |
| `driverArriving` | *Driver on the way* | Driver taps **Navigate to pickup** |
| `driverArrived` | *Your driver has arrived*: *Share the OTP to start your trip.* | Driver taps **I've arrived** |
| `inProgress` | *On your way* | Driver verifies the OTP and taps **Start trip** |
| `onHold` | *Trip paused* | Driver taps **Hold ride** |
| `completed` | *Trip completed* | Driver taps **Complete trip** |
| `cancelled` | *Ride cancelled* | Rider, driver or admin |
| `noDriversFound` | *No drivers available*: *Please try booking again in a few minutes.* | `onRideCreated` or the `expireRideRequests` job |

## Start OTP

When **Admin → Settings → Business model → Require OTP to start a ride** is on (default), the booking stores a random 4-digit code on the ride. The rider sees it in the yellow OTP card while the ride is *accepted*, *driver on the way* or *driver arrived*. The driver must type it before **Start trip** works. The card disappears once the trip has started.

Switch it off and drivers can start the trip without a code. New bookings then carry no OTP.

## Driver location

The Driver App writes its position to `driver_locations/{driverId}` in the Realtime Database while the driver is online. The ride screen reads it from the moment a driver is assigned until the ride ends. If the marker does not appear:

- the driver's app is closed or in the background (it shares location only while open),
- `databaseURL` in `firebase_options.dart` points to another project ([Firebase Setup](doc:app-customer/firebase-setup)),
- the Realtime Database rules are not deployed.

## SOS

:::steps
### Rider taps SOS
Confirmation: *Send SOS alert?* *Our safety team will be alerted with your ride and current location.*

### Alert saved
The app reads one GPS fix and creates a document in `sos_alerts` (`raisedBy: customer`, ride ID, location, status `active`).

### Call emergency services
The dialog *Alert sent* offers **Call 112**. The number comes from **Admin → Settings → App settings → Emergency phone number**.
:::

The team sees and resolves alerts in [SOS Alerts](doc:admin/sos-alerts). **Account → Emergency** also calls the same number at any time.

## After the trip

When the driver completes the ride, the server settles it once (commission, driver earning, wallet debit for wallet rides). See [Commission, Wallet & Settlement](doc:admin/commission-wallet).

| Payment method | What the rider sees |
|---|---|
| Cash | Pays the driver. The ride is marked paid by the settlement |
| Wallet | The fare is debited from the Go4Ride wallet automatically |
| Card / UPI | A **Payment** card with **Pay ₹215.00**. It opens the hosted checkout ([Wallet & Payments](doc:app-customer/payments)). After payment: *₹215.00 paid. Thank you!* |

There is no rating or tip screen after the trip in this version.

## My rides

Home → **My rides** (or Account → **My rides**) lists every ride of the rider, newest first, with type, status chip, date, pickup, drop and fare. Tap a ride to open the same live screen, for example to pay a completed card ride later.

## Notifications

On each status change the backend sends a push (*A driver accepted your ride.*, *Your driver has arrived.* …) to the token stored on the rider's profile. Read [Push Notifications](doc:app-customer/notifications) first: the shipped app does not save that token yet.

**Next:** [Cancellation & Fees →](doc:app-customer/cancellation)
