---
title: Ride Workflow & OTP
description: From an incoming request to a completed trip in the Driver App: the accept window, each status button, verifying the rider's 4-digit OTP, waiting time, hold, cancellation and what happens at completion.
---

![Request](/docs/go4ride/images/app-driver-request.webp "Incoming request with countdown")
![Arriving](/docs/go4ride/images/app-driver-arriving.webp "On the way to pickup")
![Arrived](/docs/go4ride/images/app-driver-arrived.webp "Arrived, waiting timer")
![OTP](/docs/go4ride/images/app-driver-otp.webp "Enter ride OTP")
![In progress](/docs/go4ride/images/app-driver-in-progress.webp "Trip in progress")

## The request card

While online, every open request appears as a card (`ride_request_card.dart`): ride type, estimated fare, a *Female-only* tag when the rider asked for it, pickup and drop, and a countdown bar **Expires in 30s** (red in the last 5 seconds).

| Button | Result |
|---|---|
| **Accept** | A Firestore transaction assigns the ride to the driver (`driverId`, status `accepted`, `acceptedAt`). If another driver was faster: *This ride was already taken.* and the card disappears |
| **Decline** | Hides the card on this phone only. The ride stays open for other drivers |
| (timer runs out) | The card hides itself on this phone |

The countdown length is **Driver accept window (seconds)** in Admin → Settings → Driver & ride (`requestTimeoutSeconds`, default 30). The request itself stays open on the server until **Auto-cancel unaccepted ride** (default 180 s), then it becomes *No drivers found*.

## Trip panel

After accepting, Home switches to the **Current trip** panel: status badge, pickup, drop-off, fare and payment method (`cash`, `wallet` or `card`), plus one main button that moves the ride forward:

:::steps
### Navigate to pickup
`accepted` → **`driverArriving`**. The rider sees *Driver on the way*. The button only changes the status. It does not open a navigation app, so drivers use Google Maps themselves.

### I've arrived
→ **`driverArrived`**. A **Waiting** card starts a timer: *Free waiting · 02:41 left*, then *2 min chargeable · ₹4.00 (₹2.00/min)*. The free minutes and the per-minute charge come from Driver & ride settings (defaults 3 min, ₹2).

### Start trip
If **Require OTP to start a ride** is on and the ride has a code, the sheet **Enter ride OTP** asks for the rider's 4 digits (*Ask the rider for the 4-digit code shown in their app.*). A wrong code shows *Incorrect OTP. Ask the rider to check their app.* **Verify & start trip** → **`inProgress`**, `startedAt` is stamped.

### Hold ride (optional)
**Hold ride** → **`onHold`** (*Trip paused* for the rider), the waiting timer runs again. **Resume trip** → `inProgress`.

### Complete trip
→ **`completed`**, `completedAt` is stamped. The panel closes and Home shows the request list again.
:::

:::note Waiting charge is shown, not billed
The waiting timer and charge help the driver and rider agree on extra time, but the app does not add them to the fare. The amount settled is the fare saved at booking.
:::

## Cancelling

**Cancel ride** (red text button) is available while the ride is *accepted*, *driver on the way* or *driver arrived*, not after the trip has started. The sheet *Why are you cancelling?* lists the **driver** cancel reasons from the Admin Panel plus **Other** (max 200 characters). The ride becomes `cancelled` with `cancelledBy: driver`. No fee is charged to either side.

## At completion

The `onRideStatusChanged` Cloud Function settles the ride **once** (`settledAt`):

| Payment | Driver wallet | Rider |
|---|---|---|
| **Cash** | − commission (the driver already holds the cash) | Pays the driver. Ride marked paid |
| **Wallet** | + driver earning | Wallet debited by the fare |
| **Card / UPI** | + driver earning | Pays through the hosted checkout on the ride screen |

Example with 10 % commission on a ₹215 fare: commission **₹21.50**, driver earning **₹193.50**. Cash ride: wallet −₹21.50. Wallet or card ride: wallet +₹193.50. Lifetime earnings grow by ₹193.50 either way. An active paid subscription waives the commission ([Subscription Plans](doc:app-driver/subscriptions)).

Collect cash only for **Cash** rides. For card rides, remind the rider to tap **Pay** in their app.

## Trip history

Account → **Trip history** lists the driver's rides (type, status, date, pickup, drop and fare), newest first.

## Status reference

| Driver taps | New status | Rider sees |
|---|---|---|
| Accept | `accepted` | *Driver assigned* + OTP |
| Navigate to pickup | `driverArriving` | *Driver on the way* |
| I've arrived | `driverArrived` | *Your driver has arrived* |
| Start trip (+ OTP) | `inProgress` | *On your way* |
| Hold ride / Resume trip | `onHold` / `inProgress` | *Trip paused* / *On your way* |
| Complete trip | `completed` | *Trip completed* |
| Cancel ride | `cancelled` | *Ride cancelled* + reason |

The full server-side lifecycle is in [Ride Lifecycle](doc:api/ride-lifecycle).

**Next:** [Earnings, Wallet & Payouts →](doc:app-driver/earnings)
