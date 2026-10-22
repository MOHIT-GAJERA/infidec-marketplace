---
title: Notifications
description: The bell badge and the activity feed. New orders, reservation requests, low stock and table alerts (cleaning, payment pending, long stays, large bills).
---

**Admin → Notifications** (*"Recent activity across the restaurant."*) is a single feed of things that need your attention. Open it with the **bell** in the top bar.

![Notifications](/docs/go4foodie/images/admin-notifications.jpg "Admin → Notifications")

**Permission:** every signed-in admin role (**OWNER**, **MANAGER**, **STAFF**).

## The bell badge

The orange badge on the bell counts open **to-dos**:

| Counted | Clears when |
|---|---|
| Reservations with status **Pending** | You confirm, cancel or otherwise update them in [Reservations](doc:admin/reservations) |
| Inventory items at or below their **reorder level** | You restock them in [Inventory](doc:admin/inventory) |
| Tables in state **Cleaning** or **Waiting Payment** | You set them to another state on the [Floor](doc:admin/floor) |

The badge is hidden at 0 and shows **9+** above nine. It is recalculated **every time you move to another page** in the panel. It doesn't poll in the background.

## Feed items

Newest first:

| Type | Icon | Title | Detail |
|---|---|---|---|
| Order | Shopping bag (blue) | *New order ORD-48213* | *Jane Doe · $64* (the 6 latest orders) |
| Reservation | Calendar (orange) | *Reservation request SV-284910* | *Jane Doe · Table booking* or *Private event* (the 6 latest pending requests) |
| Stock | Package (red) | *Low stock: Sea Bass (whole)* | *2 kg left (reorder at 5)* |
| Table | Floor plan (amber) | *Table 5 needs cleaning* | *Mark available once cleaned.* |
| Table | | *Table 5 payment pending* | *Awaiting checkout.* |
| Table | | *Table 5 occupied 2h+* | *Open since 6:05:12 PM* (session open more than 120 minutes) |
| Table | | *Large bill at Table 5* | *$340 running* (open session total $300 or more) |

Each item shows its time, e.g. *Oct 22, 7:42 PM*. With nothing to show you see *"You’re all caught up."*

:::note A live view, not an inbox
The feed is rebuilt from the current data each time you open the page. There is no *mark as read*: an item disappears when its cause is gone (the reservation is confirmed, the stock is refilled, the table is set to Available). The page doesn't update itself while open, so reopen it to refresh. Only the [Floor](doc:admin/floor) is realtime.
:::

:::tip Thresholds
The *occupied 2h+* (120 minutes) and *large bill* ($300) limits are constants at the top of `functions/src/services/queries.ts` (`OCCUPIED_TOO_LONG_MIN`, `LARGE_BILL_THRESHOLD`). Change them and redeploy the function to suit your restaurant.
:::

Staff and managers using the mobile app see the same feed in the Restaurant and Owner apps. See [Owner App](doc:app/owner).

**Next:** [Audit Log →](doc:admin/audit-log)
