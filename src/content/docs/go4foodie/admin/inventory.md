---
title: Inventory
description: Track ingredient stock, units, suppliers and cost. Get low-stock and out-of-stock alerts and adjust quantities with one click.
---

**Admin → Inventory** (*"Stock levels and low-stock alerts."*) tracks the **ingredients and supplies** in your kitchen: produce, meat and fish, dairy, drinks, dry goods and bakery items, with quantity, reorder level, cost and supplier.

![Inventory](/docs/go4foodie/images/admin-inventory.jpg "Admin → Inventory")

**Permission:** `manage:inventory` (**OWNER** and **MANAGER**).

:::note Inventory is counted by hand
Inventory items are separate from menu dishes. Selling a dish does **not** reduce stock automatically. Update quantities with **+ / −** or **Edit** when deliveries arrive or after a stock count.
:::

## Stock status

| Status | Rule | Colour |
|---|---|---|
| **In Stock** | Quantity above the reorder level | Green |
| **Low Stock** | Quantity at or below the reorder level | Amber |
| **Out of Stock** | Quantity 0 | Red (the whole row is tinted red) |

Every item at or below its reorder level (Low and Out) appears in [Notifications](doc:admin/notifications) as *"Low stock: Sea Bass (whole)"* / *"2 kg left (reorder at 5)"* and adds 1 to the bell badge.

## Stats

| Tile | Value |
|---|---|
| **Total Items** | All inventory items |
| **Low Stock** | Items with status Low Stock |
| **Out of Stock** | Items with quantity 0 |
| **Stock Value** | Σ quantity × cost per unit |

## Filters

- Category pills: **All, Produce, Meat & Fish, Dairy, Beverage, Dry Goods, Bakery**
- **Search items…**: name or supplier
- **Add Item**

## Inventory table

| Column | Shows / does |
|---|---|
| **Item** | Name |
| **Category** | One of the six categories |
| **Supplier** | Supplier or — |
| **Stock** | **−** (*Decrease*), `12 kg`, **+** (*Increase*), with *"reorder at 5"* underneath |
| **Status** | In Stock / Low Stock / Out of Stock |
| **Actions** | Edit, Delete |

If nothing matches you see *"No inventory items match your filters."*

## Adjust stock

Click **+** or **−** to change the quantity by **1 unit**. The quantity never goes below 0. The change shows immediately and is saved in the background. If the server refuses it, the old value comes back with an error toast. For larger changes (a delivery of 20 kg), use **Edit**.

## Add or edit an item

:::steps
### Open the form
Click **Add Item** (modal **Add inventory item**), or the pencil on a row (**Edit inventory item**).

### Fill in the details
| Field | Placeholder / default | Rule |
|---|---|---|
| **Name** | *Sea Bass (whole)* | At least 2 characters: *"Name is required"* |
| **Category** | **Dry Goods** | One of the six categories |
| **Unit** | *kg, L, units* (default `kg`) | Required: *"Unit is required"* |
| **Quantity** | `0` | Number ≥ 0 |
| **Reorder at** | `0` | Number ≥ 0. Low Stock starts at this level |
| **Cost / unit** | `0` | Number ≥ 0. Used for **Stock Value** |
| **Supplier** | *Boston Seafood Co.* | Optional |

Negative numbers show *"Number must be greater than or equal to 0"*.

### Save
Click **Add item** or **Save changes**.
:::

**Delete** asks *"Remove this inventory item?"* and removes the item.

:::tip Set useful reorder levels
Set **Reorder at** to what you use between two deliveries. Items then go Low Stock (and show in Notifications) in time to order more.
:::

**Next:** [Transactions →](doc:admin/transactions)
