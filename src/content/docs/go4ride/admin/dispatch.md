---
title: Dispatch & Dispatch Users
description: How ride requests reach drivers, the dispatch monitor for rides booked by dispatch users on a rider's behalf, and how to create dispatch user accounts.
---

**Admin → Operations → Dispatch** has two pages: **Monitor** (*"Bookings placed by dispatch users"*) and **Dispatch users** (*"Staff who book rides on behalf of riders"*). This page also explains how every ride request finds a driver.

## How ride requests reach drivers

Dispatch is automatic. When a ride document is created with status `requested`, the `onRideCreated` Cloud Function:

1. Reads **Settings → Driver & ride**: *Search radius (km)* (default 5) and *Minimum driver wallet to accept rides* (default 0).
2. Finds drivers who are **online**, **KYC approved**, **not blocked**, have a wallet balance **at or above the minimum**, and whose last position is **inside the search radius** of the pickup. A driver with no known position is included rather than skipped.
3. Sends a **"New ride request"** push to up to **25** of them.
4. If nobody qualifies, sets the ride to `noDriversFound` and tells the rider *"All nearby drivers are busy right now. Please try again in a few minutes."*

In the Driver App, an online, available driver sees the open requests (the latest 20 with status `requested`) as cards with a countdown (*Driver accept window*, default 30 seconds). The first driver to tap **Accept** claims the ride in a transaction, so two drivers can never take the same ride.

:::note Push is filtered, the list is not
The radius, KYC, block and wallet checks decide **who gets the push notification**. The request list inside the Driver App is not filtered by distance in v1.0: any online driver who opens the app can see and accept an open request. The Driver App does stop a driver below the minimum wallet from going online at all.
:::

Every minute, the `expireRideRequests` job closes requests that are still `requested` after **Auto-cancel unaccepted ride** seconds (default 180) by setting them to `noDriversFound`.

![Ride request in the Driver App](/docs/go4ride/images/app-driver-request.webp "A request card with the accept timer")

| Setting (Settings → Driver & ride) | Default | Effect |
|---|---|---|
| Search radius (km) | 5 | Who gets the request |
| Minimum driver wallet to accept rides | ₹0 | Drivers below it get no requests and can't go online |
| Driver accept window (seconds) | 30 | Countdown on the request card |
| Auto-cancel unaccepted ride (seconds) | 180 | When `expireRideRequests` gives up |

See [General & App Settings](doc:admin/settings#driver-ride) for the full page.

## Dispatch monitor

![Dispatch monitor](/docs/go4ride/images/admin-dispatch-monitor.jpg "Admin → Dispatch → Monitor")

The monitor lists every ride that carries a `dispatcherId`, that is, a ride a **dispatch user** booked for a rider (for example from a phone call). It is live.

### KPI tiles

| Tile | Shows |
|---|---|
| **Total dispatches** | All dispatcher bookings, with the number of dispatchers |
| **Today** | Dispatches today |
| **Completed** | Completed dispatches and their share of all |
| **In progress** | Not yet finished, *"Live right now"* |
| **Cancelled** | *"Incl. no drivers found"* |

### Dispatch log

- **Search dispatcher, driver, customer or pickup**.
- Period: **Today** (default) / **This week** / **All time**.
- Type: **All / Cab / Intercity / Rental / Parcel**.
- Stage: **All / Requested / Accepted / Ongoing / Completed / Cancelled**.
- Columns: **Time**, **Type**, **Dispatcher**, **Driver** (or *Unassigned*), **Customer**, **Pickup**, **Status**, **Fare**. 25 rows per page.

:::note Booking on a rider's behalf in v1.0
Security rules already allow a `dispatcher` to create a ride for a rider (with their own uid in `dispatcherId`) and to move it along, and the monitor reports on those rides. **v1.0 has no booking form for dispatchers in the admin panel**, so the monitor stays empty until you add one (or create rides through your own tool with `dispatcherId`, `dispatcherName`, `customerName` and `driverName` fields). Dispatch users can still watch all bookings and the live driver map.
:::

## Dispatch users

![Dispatch users](/docs/go4ride/images/admin-dispatch-users.jpg "Admin → Dispatch → Dispatch users")

Dispatch users are staff accounts with the `dispatcher` claim. They sign in to this admin console with e-mail and password and see only the pages their role grants.

### Table

| Column | Shows |
|---|---|
| **Name** | Avatar and name |
| **Email** | Sign-in e-mail |
| **Phone** | Phone or — |
| **Role** | Role pill, or *No role* |
| **Created** | Date and time |
| **Active** | Switch. Turning it off asks *"Deactivate {name}? They will be signed out right away and won't be able to sign in until reactivated."* |

Toolbar: **Search name, email, phone or role**, **Export** (CSV: ID, Name, Email, Phone, Role, Active, Created) and **Add dispatch user**.

### Add a dispatch user

:::steps
### Create the Dispatcher role first
Open [Access → Roles](doc:admin/roles-permissions) and click **Create default roles**. It adds a protected **Dispatcher** role with view and edit on the dispatch monitor, the four bookings pages and online drivers.

### Open the form
Click **Add dispatch user**. The **Dispatcher** role is preselected when it exists.

### Fill in the details
| Field | Rule |
|---|---|
| **Full name** | Required, e.g. *Priya Sharma* |
| **Email** | Required, valid e-mail. Can't be changed later |
| **Phone** | Optional. Use international format (`+91 90000 00001`) to also store it on the sign-in account |
| **Password** | At least 8 characters: *"Use at least 8 characters"* |
| **Role** | Required: *"Select a role"* |

### Create
Click **Create dispatch user**. The `createStaffUser` function creates the sign-in account, sets the claims `{role: "dispatcher", roleId}` and writes `staff/{uid}` with `type: "dispatcher"`.
:::

Edit a user with the pencil (name, phone and role; a role change re-issues the claims). **Delete** removes the sign-in account and the profile (*"…sign-in account and profile will be permanently removed."*). You can't delete your own account.

| Error | Cause |
|---|---|
| An account with this email already exists. | The e-mail is already a Firebase Auth user (maybe a rider or driver) |
| Enter the phone number in international format, e.g. +919876543210. | Phone has a `+` but isn't valid E.164 |
| The selected role no longer exists. | The role was deleted |
| Admin privileges required. | You are signed in as staff, not admin |

**Next:** [SOS Alerts →](doc:admin/sos-alerts)
