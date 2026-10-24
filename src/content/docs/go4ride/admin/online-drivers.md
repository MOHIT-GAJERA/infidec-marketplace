---
title: Online Drivers Map
description: A live map of every online driver from the Realtime Database, with a searchable roster, last-seen times and a link to each driver's details.
---

**Admin → People → Online drivers** (*"Live map of drivers who are online"*) shows where your fleet is right now. Positions stream from the **Realtime Database** and move on the map without reloading.

![Online drivers](/docs/go4ride/images/admin-online-drivers.jpg "Admin → People → Online drivers")

## The map

- A marker for each driver with a known position. Click a marker or a roster row to select and zoom to that driver.
- The status chip shows **Live · 8 on map** (or *Connecting…* while it loads).
- **Zoom in**, **Zoom out** and **Recentre** buttons. Recentre fits every driver on screen.
- With nobody online the map shows Surat (the built-in default) and *"No drivers online — Drivers appear on the map as soon as they go online in the driver app."*
- The map uses **OpenStreetMap** tiles, so it needs no Google key in the admin panel.

## The roster

*"Live GPS, refreshed in real time"*, with **Search name, phone or plate**.

| Column | Shows |
|---|---|
| **Driver** | Name and vehicle (or phone). *Location unavailable* if no GPS fix yet |
| **Seen** | Time since the last GPS fix: *now*, *3m ago*, *1h ago* |
| Action | **View driver** opens the driver's details |

A driver is listed when their online switch is on, **or** when their last GPS fix is less than **2 minutes** old. Labels refresh every 15 seconds.

## Where the positions come from

| Step | Detail |
|---|---|
| Driver goes online | The Driver App asks for location permission and starts sending its position |
| Live position | Written to Realtime Database at `driver_locations/{driverId}` as `{lat, lng, heading, updatedAt}`. Rules let each driver write only their own node, and any signed-in user read |
| Matching | `onRideCreated` uses the position saved on the driver's Firestore profile (`currentLocation`) for the search radius |
| Rider tracking | The rider's ride screen reads the assigned driver's node to move the car marker |

![Driver online](/docs/go4ride/images/app-driver-home-offline.webp "Driver App: the online switch starts the live location")

:::tip Nobody on the map?
Check that the driver is **online** in the Driver App, has granted **location permission**, and that your Realtime Database instance exists and its rules are deployed (`firebase deploy --only database`). See [Deploy the Backend](doc:installation/backend-deploy).
:::

:::note Cost
Every online driver writes a small update regularly and every open map reads them. Realtime Database bills by data stored and downloaded, so keep this page closed when you don't need it on a big fleet. See [Third-Party Service Costs](doc:admin/third-party-costs).
:::

**Next:** [Employees, Roles & Permissions →](doc:admin/roles-permissions)
