---
title: Availability
description: How Booqora works out how many units are free — reserved and started orders, buffers, late rentals, downtime for maintenance or repair, and shortage warnings.
---

Booqora prevents double bookings by checking, for every product and period, how many units are still free. The calculation is `Pricing.available()` in `booqora_platform/lib/data/pricing.dart`, and it is used everywhere: the order editor badges, the **Reserve** check, the order list's **With shortage** tab, **Check availability** on the calendar, **Available now** in the inventory and the Availability report.

## The formula

```text
available = stock quantity
          − units on overlapping reserved / started orders
          − units in overlapping scheduled / started downtime
```

The result can be negative. A negative number is a **shortage**.

### Stock quantity

The product's `quantity`. For bulk products this is the number on the **Inventory** tab; for trackable products it is the number of stock items. See [Stock Items](doc:admin/stock-items).

### Orders that hold stock

Only orders with status **`reserved`** or **`started`** hold stock (`Pricing.holding`). Drafts, returned, archived and canceled orders do not. Every product line with the product's id counts its quantity.

| Status | Blocks units? |
|---|---|
| draft | No — save as draft to quote without blocking stock |
| reserved | Yes, from pickup to return |
| started | Yes, until it is returned (see late rentals) |
| returned / archived / canceled | No |

### Overlap and buffers

An order counts when its period overlaps the period you are checking. Each product can have a **Buffer before** and a **Buffer after** in hours (**Settings** tab of the product). The check window is widened by these buffers, so an order that ends just before your pickup still blocks the unit during its cleaning time, and one that starts just after your return blocks it during its preparation time.

```text title="Example: Buffer after = 2 h"
Order A returns  Tue 12:00
Order B picks up Tue 13:00  → unit still blocked (A + 2 h buffer = 14:00)
Order B picks up Tue 14:30  → unit free
```

### Late rentals keep holding stock

A **started** order whose return time has passed is late. Booqora assumes the items are still out, so the order keeps holding its units through the end of any period you check. Mark it **Returned** to release the stock. Late orders appear on the dashboard (**View late**), in the **Late** tab on Orders and as amber bars on the [Calendar](doc:admin/calendar).

## Downtime

Downtime takes units out of circulation for **Maintenance**, **Repair** or **Missing** items. Records with status `scheduled` or `started` reduce availability by their quantity while they overlap the period. A downtime without an end date is open-ended and blocks the units until you end it.

![Downtime](/docs/booqora/images/platform-downtime.webp "Inventory → Downtime with status, reason and actions")

:::steps
### Schedule downtime
Use **Inventory → Add product → Schedule downtime**, or **Schedule downtime** on a product's Downtime tab.

### Fill in the dialog
Choose the **Product**, then **Quantity** (a number of units) or **Specific stock item** (one identifier). Pick the **Reason**, **From**, an optional **Until** and a **Note**.

### Start and end it
On **Inventory → Downtime** use **Start** when work begins and **End** when the units are back. **Cancel** (on scheduled or started records) releases the units without ending the record normally. Starting sets the start time to now; ending sets the end time to now.
:::

The Downtime tab can be filtered by **Attention** (*starting today*, *ending today*, *overdue start*, *overdue end*), Status, Reason and Date range. Overdue records show a red warning icon.

## Shortages

A shortage happens when an order needs more units than are available for its period (excluding the order itself). Services never cause shortages.

- **Order editor**: each line shows *n available*, *n more available* or a red **Shortage n** badge.
- **Reserve**: if a product is short and **Allow shortage** is off on that product, Booqora shows **Not enough stock to reserve** and the order stays a draft.
- **Order list**: draft, reserved and started orders with a shortage get a **shortage** pill and appear in the **With shortage** tab.
- **Availability report**: lists each rental product with Quantity, Reserved, Downtime, Available and a status of *Available*, *Fully booked* or *Shortage* for the chosen period (the next 30 days by default). See [Reports](doc:admin/reports).

:::tip When to allow shortages
Switch on **Allow shortage** (product **Settings** tab) for items you can always sub-rent or buy in at short notice. Reservations then go through, and the order is flagged so you remember to source the extra units.
:::

## Checking availability quickly

- **Calendar → Check availability**: pick a product and a period to see *n of m units available*.
- **Inventory → Products → Available now** and the product **Summary** card: units free for the next hour.

**Next:** [Settings →](doc:admin/settings)
