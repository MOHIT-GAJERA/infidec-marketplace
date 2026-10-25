---
title: Bookings
description: Every ride booked on the platform, split into Cab, Intercity, Rental and Parcel, with status and payment filters, a booking detail view with timeline and fare breakdown, admin cancellation and CSV export.
---

**Admin → Operations → Bookings** has one page per service type:

| Page | Shows rides of type | Subtitle |
|---|---|---|
| **Cab** | `city` | *City cab bookings* |
| **Intercity** | `intercity` (both Intercity Sharing and Intercity Personal) | *Outstation bookings* |
| **Rental** | `rental` | *Hourly rental bookings* |
| **Parcel** | `parcel` | *Parcel deliveries* |

All four work the same way. The data is the `rides` collection, live.

![Cab bookings](/docs/go4ride/images/admin-bookings.jpg "Admin → Bookings → Cab")

## Toolbar

The title shows the count, e.g. **"128 bookings"**, and the subtitle *"6 open · ₹42,310 completed revenue"*.

- **Search ID, customer or pickup**: matches the ride id, the customer's name or the pickup address.
- **All drivers** drop-down: show only one driver's rides.
- **Export CSV**: downloads the filtered list as `bookings_city_2026-10-24.csv` with *Booking ID, Customer, Driver, Pickup, Drop, Booked, Status, Payment, Mode, Total*.

## Filters

| Status tab | Ride statuses included |
|---|---|
| **All** | Everything |
| **Placed** | `requested`, `bidding` |
| **Ongoing** | `accepted`, `driverArriving`, `driverArrived`, `inProgress`, `onHold` |
| **Completed** | `completed` |
| **Cancelled** | `cancelled`, `noDriversFound` |

A second filter: **Any payment / Paid / Unpaid**. Each tab shows its count.

## Table

| Column | Shows |
|---|---|
| **Booking** | Service icon, short id `#a1b2c3d4` and the pickup address |
| **Customer** | Rider name (or uid) |
| **Booked** | Date and time (wide screens) |
| **Status** | e.g. *Requested*, *Driver arriving*, *In progress*, *Completed*, *No drivers found*. Live statuses pulse |
| **Payment** | **Paid** / **Unpaid** (wide screens) |
| **Total** | Fare total |

Click a row or the eye icon to open the booking. The page shows 10 rows per page; change it in the footer.

## Booking detail

The dialog title is the type (e.g. **City booking**) with the full id `#…`.

| Section | Content |
|---|---|
| **Pills** | Status, **Paid / Unpaid**, payment mode (*Cash*, *Wallet*, *Card*) |
| **Route** | Pickup and drop addresses |
| **People** | Customer name and phone, driver name and phone (or *Unassigned*), vehicle make, model and plate |
| **Timeline** | Booked, Scheduled for (if any), Accepted, Started, Completed, Cancelled with the reason |
| **Fare** | Base fare, Distance (km), Time (min), Waiting, Surge ×, Platform fee, Tax, Discount (with the promo code), **Total** |

![Intercity bookings](/docs/go4ride/images/admin-bookings-intercity.jpg "Bookings → Intercity")
![Parcel bookings](/docs/go4ride/images/admin-bookings-parcel.jpg "Bookings → Parcel")

### Cancel a ride

While a ride is not finished, the dialog has **Cancel ride**. Confirm *"Cancel this ride? The customer and driver will be notified."* The ride is set to `cancelled` with `cancelledBy: admin` and the reason *Cancelled by admin*. The rider gets a *"Your ride was cancelled."* push, and the trip leaves the driver's active-ride panel because the ride is no longer active. (There is no separate push to the driver.)

An admin cancellation never charges a [cancellation fee](doc:admin/commission-wallet#cancellation-charge): fees only apply when the **rider** cancels.

## The ride lifecycle

| Status | Set by | What happens |
|---|---|---|
| `requested` | Customer App on booking | `onRideCreated` notifies eligible drivers, or sets `noDriversFound` |
| `accepted` | Driver App, **Accept** | The rider is notified, the free cancellation window starts |
| `driverArriving` | Driver App, **Navigate to pickup** | *"Your driver is on the way."* |
| `driverArrived` | Driver App, **I've arrived** | Waiting timer starts. The rider sees the OTP |
| `inProgress` | Driver App, **Start trip** after the 4-digit OTP | *"Your trip has started."* |
| `onHold` | Driver App, **Hold ride** | Trip paused (the waiting timer runs), **Resume trip** continues it |
| `completed` | Driver App, **Complete trip** | Settlement: commission and driver earning, wallet debit for wallet rides |
| `cancelled` | Rider, driver or admin | Cancellation fee when the rider cancels late |
| `noDriversFound` | `onRideCreated` or `expireRideRequests` | No eligible driver, or nobody accepted within the auto-cancel time |

More detail: [Ride Lifecycle](doc:api/ride-lifecycle).

:::note What the list covers
Bookings load the **latest 200 rides** (newest first) across all types, then split them by type. For a full history export, use the Firestore console or a scheduled export (see [Backups & Monitoring](doc:installation/backups)).
:::

**Next:** [Dispatch & Dispatch Users →](doc:admin/dispatch)
