---
title: Stock Items
description: Individual units of trackable products — automatic identifiers, regular and temporary stock, current and expected stock, statuses and barcode scanning.
---

A **stock item** is one physical unit of a **trackable** product: one camera, one tent, one projector. Each item has its own identifier, so you always know exactly which unit you own. Stock items are stored in `workspaces/{wid}/stockItems`. Bulk products do not use stock items; they only keep a quantity.

## Where to find them

- **Inventory → Stock items** (`/inventory?tab=stock`) lists every stock item in the workspace.
- A trackable product's **Inventory** tab lists the items of that product, split into **Current stock** and **Expected stock**.

![Stock items](/docs/booqora/images/platform-stock-items.webp "Stock items tab with identifiers, kind, purchase cost and status")

### Workspace list

- **Search** by identifier.
- **Filters**: Kind (*regular* / *temporary*) and Status (*available* / *out* / *downtime*).
- **Columns**: Identifier, Product, Kind, Available from, Purchase cost and Status.
- **Export** downloads Identifier, Product, Kind, Available from, Purchase cost and Status as CSV.

## Adding stock items

Stock items are added from the product, not from the list.

:::steps
### Open the product
Go to **Inventory → Products**, open a trackable product and stay on the **Inventory** tab.

### Add stock items
Click **Add stock items** and fill in the dialog.

### Save
Click **Add stock**. The items are created in one batch and the product's stock count goes up by the same number.
:::

| Field | Notes |
|---|---|
| **Quantity** | 1 to 500 items at a time |
| **Kind** | **Regular stock** — items you own. **Temporary stock** — sub-rented or borrowed items available for a limited period |
| **Available from** | When the items arrive. A future date puts them under **Expected stock** |
| **Available till** | Temporary stock only, and required |
| **Purchase cost per item** | Pre-filled from the product's default purchase cost |
| **Purchase date** | Optional |
| **Identifier prefix** | Defaults to the first four letters or digits of the product name |

When you create a trackable product with an **Initial stock quantity**, the same routine creates the first items automatically.

## Identifiers

Identifiers are generated as `<PREFIX>-<number>` with three digits, for example `CANO-001`, `CANO-002`. Booqora looks at the existing items of the product with the same prefix and continues after the highest number, so deleting `CANO-002` never causes a duplicate. You can choose a different prefix per batch, such as `R6-` for a second model.

## Current and expected stock

On the product's Inventory tab:

- **Current stock** — items whose *Available from* date has passed.
- **Expected stock** — items with an *Available from* date in the future. They stay here until they arrive.

Each row shows the identifier, the kind (with *until …* for temporary stock), the available-from date and the status. The bin icon deletes an item and lowers the product's stock count by one.

:::warning Stock count and availability
Availability is calculated from the product's **stock count** (`quantity`), which includes expected and temporary items as soon as they are added. If you add items that arrive next month, consider scheduling [downtime](doc:admin/availability) until they arrive, so they cannot be booked early.
:::

## Statuses

| Status | Meaning |
|---|---|
| `available` | Ready to rent |
| `downtime` | A downtime record for this specific item has been **started** |
| `out` | Reserved in the data model for items out on rent |

When you schedule downtime with **Specific stock item**, starting it sets the item to `downtime`; ending or cancelling it sets the item back to `available`. Orders are booked per product quantity, not per identifier.

## Barcodes

Identifiers are plain text, so you can print them as barcodes or QR codes with any label printer. The Booqora **Mobile App** has a scanner (built on `mobile_scanner`) that looks up a scanned code as a stock item identifier, a product SKU or an order number. See the [Mobile App tour](doc:app/features-tour).

**Next:** [Bundles & Collections →](doc:admin/bundles-collections)
