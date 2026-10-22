---
title: Audit Log
description: Every POS and table action, with who did it and when. Session open and close, orders added and voided, merges, payments and table state changes.
---

**Admin → Audit Log** (*"Every POS & table action, who and when."*) records each action taken on the floor and in the POS, whether it came from the admin panel, the Restaurant App or the Owner App. Use it to answer questions like *"who voided that dish?"* or *"who closed Table 5, and with which payment method?"*.

![Audit log](/docs/go4foodie/images/admin-audit.jpg "Admin → Audit Log")

**Permission:** `manage:settings`, so **OWNER only**. The scroll icon sits at the **bottom** of the sidebar and is hidden for Managers and Staff.

## Columns

| Column | Shows |
|---|---|
| **When** | Date and time, e.g. *Oct 22, 7:42 PM* |
| **Action** | Coloured pill with the action name |
| **Entity** | What was changed: `TableSession`, `Order`, `Payment`, `Table` |
| **Detail** | Short description (— if none) |
| **By** | Name of the signed-in user or employee, or **System** |

The page shows the **latest 200** entries, newest first. With no entries you see *"No activity logged yet."* There are no filters, paging or exports.

## Logged actions

| Action | Pill colour | Logged when | Entity | Detail example |
|---|---|---|---|---|
| `session.open` | Green | A table is opened (Floor, POS or Restaurant App) | TableSession | *4 guests* |
| `order.add` | Blue | Items are sent to the kitchen or **+** is clicked | Order | *2 item(s)* |
| `order.void` | Red | **−** removes one unit from the bill | Order | *Removed item* |
| `session.merge` | Amber | Two tables are merged | TableSession | *Merged from …* (source table id) |
| `payment.add` | Blue | A split / partial payment is added | Payment | *UPI 40* |
| `session.close` | Orange | **Close table** or **Close & Pay** | TableSession | *Mixed · total 128.5* |
| `table.state` | Grey | A table's state is changed (incl. **Awaiting payment**) | Table | *CLEANING* |

Entries are written by the `api` Cloud Function into the `auditLogs` collection after each successful action. If writing an entry fails, the action itself still succeeds.

:::note What isn't logged
Changes to menu, orders' status, reservations, staff, customers, gift cards, inventory, tables (QR list) and settings aren't audit-logged. Tables changing to **Occupied** after a guest's QR order aren't logged either. The audit log covers the floor and POS money flow.
:::

:::tip Entries can't be edited
The log can't be changed from the panel or the API, and `firestore.rules` blocks direct access from browsers. Only someone with access to your Firebase project console could remove entries. Keep project access restricted. See [Backups](doc:installation/backups).
:::

**Next:** [Roles & Permissions →](doc:admin/roles-permissions)
