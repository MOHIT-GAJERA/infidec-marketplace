---
title: Tables & QR Codes
description: Create your dining tables, download or print their QR codes for table-side ordering, and switch tables active or inactive.
---

**Admin → Tables** (topbar title **Table Management**, *"QR codes for table-side ordering."*) is where you create your dining tables and print the QR code for each one. When a guest scans the code, the website opens in **dine-in** mode for that table, and the order lands on the table's bill.

![Tables](/docs/go4foodie/images/admin-tables.jpg "Admin → Tables")

**Permission:** `manage:tables` (**OWNER** and **MANAGER**). Staff don't see the QR-code icon in the sidebar, and they can't open [Floor](doc:admin/floor) either.

## How the QR code works

Each table gets a random, permanent **code** when you create it. The QR code encodes:

```text title="QR payload"
https://www.yourrestaurant.com/order?table=<code>
```

The first part is the backend's `WEBSITE_URL` setting ([Environment configuration](doc:installation/environment-configuration)). The QR image is generated in the browser, so no external service is involved.

When a guest scans it, the website looks up the code (`GET /api/tables/<code>`), shows the menu for **Table N**, and places a **Dine-in** order. If the table has no open session, one opens automatically and the table turns **Occupied** on the [Floor](doc:admin/floor). See [Ordering on the website](doc:web/ordering).

:::warning Set WEBSITE_URL before you print
The QR codes contain the website address the backend has configured. If you print codes while `WEBSITE_URL` still points to a test address, every printed code points there. Set your real domain, redeploy the function, then print. Renumbering or renaming a table later does **not** change its code, so printed QR codes keep working.
:::

## Filters

- Status pills **All / Active / Inactive**
- **Search tables…**: matches table number or name
- **Add Table**

## Table cards

| Element | What it does |
|---|---|
| **Table N** + name | Number and optional name (e.g. *Window / Patio*) |
| Status badge **Active** / **Inactive** | Click to toggle (*"Click to deactivate"* / *"Click to activate"*) |
| QR image | Click to open the QR modal (*"View QR code"*) |
| **N orders** | Orders placed for this table so far |
| Icons | **QR** (modal), **Download**, **Print**, then **Edit**, **Delete** |

If nothing matches you see *"No tables match your filters."*

## Active and inactive tables

| Status | Effect |
|---|---|
| **Active** | The QR code works and guests can order from the table |
| **Inactive** | *"Inactive tables stop accepting QR orders."* Scanning the code shows *"Table not found or inactive"* |

The status is separate from the table's live **state** (Available, Occupied, Cleaning…), which you set on the [Floor](doc:admin/floor). An inactive table still appears on the floor plan.

## Add a table

:::steps
### Open the form
Click **Add Table**. The modal title is **Add table**.

### Enter the details
| Field | Placeholder | Rule |
|---|---|---|
| **Table number** | `12` | Required: *"Table number is required"*. Must be unique: *"Table number 12 already exists"* |
| **Table name** | *Window / Patio* | Optional |
| **Status** | Active | Active / Inactive |

### Save
Click **Add table**. The new card appears first in the grid with a fresh QR code.
:::

New tables start with **4 seats** and state **Available**. You can't change seat capacity in the admin panel. The floor plan shows it as *"Seats 4"*, and [Table Analytics](doc:admin/table-analytics) uses it for utilization. To change it, edit the table's `capacity` field in Firestore (see [Data model](doc:api/data-model)).

## Print table QR codes

![Table QR code](/docs/go4foodie/images/admin-table-qr.jpg "Tables → Table N · QR code")

:::steps
### Open the table's QR
Click the QR image or the **QR** icon. The modal **Table N · QR code** shows a large QR code and the link it opens. Click the link to test it in a new tab.

### Download or print
- **Download** saves a 600 × 600 px PNG named `table-12-qr.png`. Use it in your own table-tent design.
- **Print** opens a print-ready page with **GO4FOODIE**, *"Scan to order · Table 12 · Window"* and a 300 px QR code. The print dialog opens automatically.

### Place it on the table
Laminate the print or put it in a table stand. Scan it once with a phone to check that it opens the right table.
:::

The **Download** and **Print** icons on the card do the same without opening the modal.

:::tip Allow pop-ups
Printing opens a small pop-up window. If nothing happens, allow pop-ups for your admin domain (for example `admin.yourrestaurant.com`) in the browser.
:::

## Edit or delete

- **Edit** (pencil): change the number, name or status, then click **Save changes**. The same unique-number check applies.
- **Delete** (trash): confirm *"Delete table N? Its QR code will stop working."*

:::danger Deleting removes the table's history
Deleting a table also deletes **all its table sessions and their payments**, so its [Table History](doc:admin/table-analytics#table-history) and its analytics are gone. Orders placed at the table are kept, but they are no longer linked to it. If you only want to stop QR ordering, set the table to **Inactive**.
:::

**Next:** [Live Floor →](doc:admin/floor)
