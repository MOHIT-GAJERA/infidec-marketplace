---
title: Dashboard
description: The live overview of the platform: total revenue with a 7-day chart, completed and active rides, online drivers, customers, ride mix by service, fleet & KYC and the active rides table.
---

**Admin → Overview → Dashboard** (*"Live overview of revenue, rides and fleet"*) is the first page after sign-in. It greets you (*Good morning / afternoon / evening*) with *"Here's what's happening across Go4Ride today."* and updates live: a ride accepted in the Driver App appears here without reloading.

![Dashboard](/docs/go4ride/images/admin-dashboard.jpg "Admin → Dashboard")

Every role can open the dashboard. It is always in a staff member's sidebar.

## Revenue card

The black card on the left:

| Item | Value |
|---|---|
| **Total revenue** · *All time* | Sum of the fare totals of every **completed** ride, e.g. `₹48,215.00` |
| Caption | *"From 214 completed rides · ₹6,420 this week"* |
| **Bar chart** | Completed-ride revenue for each of the last 7 days (today is highlighted). Hover a bar for the date and amount |

Revenue is the **fare the riders paid**, not the platform's commission. Commission per ride is on each booking (see [Commission, Wallet & Settlement](doc:admin/commission-wallet)).

## KPI tiles

| Tile | Value | Caption |
|---|---|---|
| **Completed rides** | Rides with status *completed* | *"N total bookings"* |
| **Active rides** | Rides that are not finished and have a driver | *"In progress right now"*, with a live dot |
| **Online drivers** | Drivers online now, e.g. `12 / 40` | A progress bar of online ÷ registered |
| **Customers** | Registered riders | *"N blocked"* |

## Ride mix

*"Share of bookings by service"*: the number and share of rides for **City**, **Intercity**, **Rental** and **Parcel**.

## Fleet & KYC

*"N registered drivers"* with four meters:

| Meter | Counts |
|---|---|
| **Online now** | Drivers with the online switch on |
| **KYC approved** | Verified drivers |
| **Awaiting review** | Drivers who submitted documents (status *pending*) |
| **Rejected** | Drivers whose KYC you rejected |

Use **Awaiting review** as your to-do list, then open [Drivers → Pending approval](doc:admin/drivers).

## Active rides

*"Assigned trips currently on the road"* with a **N live** pill. Columns: **Pickup**, **Service**, **Status** (e.g. *Driver arriving*, *In progress*) and **Fare**. When nothing is running you see *"No active rides right now — Trips appear here the moment a driver accepts."*

![Dashboard dark](/docs/go4ride/images/admin-dashboard-dark.jpg "Dark mode")

## Where the numbers come from

The dashboard reads live from Firestore: the latest **200** rides (newest first), up to **200** drivers and up to **200** customers. That keeps it fast and cheap. On a large platform the all-time totals cover only those latest records, so use [Bookings](doc:admin/bookings) exports for accounting.

:::note Daily rollup
The `dailyAnalyticsRollup` job runs every day at 00:30 and writes yesterday's completed rides, revenue and rides per service to `analytics_daily/{date}`. The v1.0 dashboard doesn't display it yet; it is there for your own reports.
:::

**Next:** [Bookings →](doc:admin/bookings)
