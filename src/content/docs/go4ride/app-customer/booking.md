---
title: Booking a Ride
description: How riders book a City cab, Intercity (sharing or personal), Rental or Parcel ride in the Customer App, how the fare estimate is calculated and what is saved in Firestore.
---

![Home](/docs/go4ride/images/app-customer-home.webp "Home: map, banners and services")
![Payment choice](/docs/go4ride/images/app-customer-pay-picker.webp "Payment and fare estimate")
![Ride requested](/docs/go4ride/images/app-customer-ride.webp "Finding a driver")

## Home screen

`lib/features/home/home_screen.dart` shows, from top to bottom:

| Element | Source |
|---|---|
| *Hello, {first name}* + *Where are you headed?*, Help and Account buttons | `users/{uid}` |
| Live map with the rider's location and a **Where to?** bar | Google Maps ([Google Maps & Location](doc:app-customer/maps-location)) |
| Promo banners carousel | **Admin → Banners** ([Banners & Onboarding](doc:admin/banners-onboarding)) |
| **Choose a service** tiles | Active documents in **Admin → Services**, in their `order` ([Services](doc:admin/services)) |
| **My rides** and **Wallet** buttons | |

**Where to?** opens the booking form of the first service. Each tile opens `/booking/<service key>`. Up to four services sit in one row, more scroll sideways. If no service exists yet, the app shows a built-in list (City Ride, Intercity, Rental, Parcel) so you can still test.

## Services

| Service key (seeded title) | Ride type | What the form asks |
|---|---|---|
| `city` (Cab) | City | Pickup, destination, vehicle type |
| `intercity_sharing` (Intercity Sharing) | Intercity, saved with `sharing: true` | Pickup, destination, vehicle type |
| `intercity` (Intercity Personal) | Intercity | Pickup, destination, vehicle type |
| `rental` (Rental) | Rental | Pickup, optional destination, **rental package** |
| `parcel` (Parcel) | Parcel | Pickup, drop-off, vehicle type, **receiver name and phone**, what is being sent |

The service title, description and icon come from the Admin Panel, so you can rename *Cab* to *Taxi* without a new build.

## The booking form

:::steps
### Route
**Pickup** is filled from GPS (reverse geocoded). Tap it or **Destination** to open the place search. When both are set, the app asks Google Directions for distance and duration.

### Choose a vehicle
Every **vehicle type** from **Admin → Vehicle types** that is offered for this service (or for all services) is listed with its image, seats and its own estimated fare ([Vehicle Types](doc:admin/vehicles)). Rental bookings show **Rental package** instead: name, hours, km included, extra per km and price ([Rental Packages](doc:admin/rental-packages)).

### Payment
Chips for the methods switched on in **Admin → Settings → Payment methods**: **Cash**, **Wallet** and **Card / UPI** (shown when Razorpay, Stripe or PayPal is enabled). With Wallet the balance is shown, with a hint to top up if it is lower than the fare. A **Female drivers only** switch is available for every service except Parcel.

### Promo code
Type a code and tap **Apply**. The app checks it in `promo_codes`: it must exist, be active, be inside its dates, below its usage limit and the fare must reach the minimum ride amount ([Offers & Coupons](doc:admin/offers)).

### Fare estimate and confirm
The card shows base fare, distance, time, promo discount and the estimated total. **Confirm • ₹215.00** creates the ride and opens the live ride screen.
:::

## How the fare is calculated

The estimate is calculated **in the app** by `lib/features/booking/fare_estimator.dart` from the selected vehicle type's rates:

```text
total = max( minFare, baseFare + distanceKm × perKm + durationMin × perMinute ) − promo discount
```

Example with a sedan type (base ₹50, ₹14/km, ₹1.50/min) and a 10 km, 30 min route: 50 + 140 + 45 = **₹235**. A 10 % promo capped at ₹20 brings it to **₹215**.

Rates the admin left empty fall back to the built-in defaults (2.0 base, 0.9 per km, 0.2 per minute, 2.5 minimum). Always fill in every rate for every vehicle type. Rentals use the package price.

:::warning Zone fares and surge are not applied in the app
Zones, zone fares and surge are set in the Admin Panel and used by the `calculateFare` Cloud Function, but the Customer App does not call it. The fare saved with the ride, and charged at the end, is the in-app estimate from the vehicle type ([Zones, Fares & Surge](doc:admin/zones)). The fare card says *Final fare may vary with zone, surge, tolls and waiting time*, but nothing changes the saved fare today.
:::

## What is saved

**Confirm** writes one document in `rides` with:

| Field | Value |
|---|---|
| `status` | `requested` |
| `type`, `vehicleClass`, `vehicleTypeId` | From the service and the chosen vehicle type |
| `pickup`, `drops` | Address and coordinates |
| `fare` | The estimate (base, distance, time, discount, total, currency) |
| `paymentMode`, `paymentStatus` | `cash` / `wallet` / `card`, `unpaid` |
| `otp` | A random **4-digit** start code, when **Admin → Settings → Business model → Ride OTP** is on |
| `femaleOnly`, `promoCode`, `rentalPackageId`, `parcelDetails`, `sharing` | When used |

The `onRideCreated` Cloud Function then looks for drivers who are online, KYC-approved, not blocked, have at least the minimum wallet and are inside the search radius. If there are none, the ride becomes `noDriversFound` straight away. A scheduled job closes requests that nobody accepts within **Auto-cancel unaccepted ride** (180 s by default). See [Ride Lifecycle](doc:api/ride-lifecycle).

## Limits today

| Feature | Status |
|---|---|
| **Driver bidding** | The seeded Intercity services have *Driver bidding* on and the form says *Drivers can bid on this ride*, but the Driver App has no bidding screen. Bidding rides are handled as normal requests. Switch **Driver bidding** off in Admin → Services |
| **Female drivers only** | Saved on the ride and shown to drivers as a *Female-only* tag. Matching does not filter by driver gender |
| **Scheduled rides, multiple stops** | Not in the booking form |

**Next:** [Live Tracking, OTP & SOS →](doc:app-customer/ride-tracking)
