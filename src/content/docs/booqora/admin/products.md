---
title: Products
description: Inventory products — rental products, sales items and services, bulk versus trackable tracking, the new product flow and every tab of the product page.
---

Products are everything you rent, sell or charge for. They live in **Inventory** (`/inventory`) together with bundles, collections, downtime and stock items, and are stored in `workspaces/{wid}/products`. The code is in `booqora_platform/lib/features/inventory/`.

## Inventory overview

**Inventory** has five tabs: **Products**, **Bundles**, **Collections**, **Downtime** and **Stock items** (`/inventory?tab=products|bundles|collections|downtime|stock`). The **Add product** button has a menu for *Add product*, *Add bundle*, *Add collection* and *Schedule downtime*. **Export** downloads the current tab as CSV.

![Inventory](/docs/booqora/images/platform-inventory.webp "Products tab with metrics, filters and availability")

On the **Products** tab:

- **Metrics**: Products, Total stock units, Stock value (quantity × default purchase cost) and Currently out (units on started orders).
- **Filters**: Product type, Tracking, Status (*active* / *archived*), Collections, Tags and Show in store.
- **Columns**: Name (with SKU), Type, Price, Stock, **Available now**, Online store (*Visible* / *Hidden*) and Tags.
- **Bulk actions**: Archive, Show in store, Hide from store and Delete. Deleting a product also deletes its stock items; existing orders keep their lines.

## Product types and tracking

| Type | Label | Pricing behaviour |
|---|---|---|
| `rental` | Rental product | Charged per period and returned to stock |
| `sale` | Sales item | Charged once per unit (for sale or giveaways) |
| `service` | Service | Charged once per unit, e.g. setup costs. Never causes a shortage |

| Tracking | Meaning |
|---|---|
| **Trackable** | Each unit is a stock item with its own identifier, e.g. a serial number. See [Stock Items](doc:admin/stock-items) |
| **Bulk** | Only a quantity is kept, e.g. chairs or cables |

## Creating a product

:::steps
### General
Click **Add product**. Enter the **Product name** (required) and upload an **Image**.

### Product type and tracking
Choose *Rental product*, *Sales item* or *Service*, and *Trackable* or *Bulk*.

### Pricing
Pick **Flat fee** (a price per hour, day, week or month for rentals, or per unit otherwise), **Fixed price per order** or **No pricing**. Tiered pricing structures can be chosen later on the Pricing tab.

### Stock
Enter the **Initial stock quantity** (up to 500). For trackable products Booqora creates that many stock items with automatic identifiers. Optionally tick **Enable variations**.

### Create
Click **Create product**. The product page opens so you can add the SKU, descriptions, more images, a deposit and online store settings.
:::

![New product](/docs/booqora/images/platform-product-new.webp "New product: general, type, tracking, pricing and stock")

New products are active, visible in the store, eligible for discounts, not taxable and part of the system **All products** collection.

## The product page

`/inventory/products/:id` has a header with **Duplicate product**, **Archive** / **Unarchive** and **Delete**, a **Summary** card (price, type, tracking, **Stock**, **Available now**, **Out now**) and a **Collections** card with **Add to collections**. Open a tab directly with `?tab=inventory|variations|pricing|settings|store|downtime|cross-sell|history`.

![Product](/docs/booqora/images/platform-product.webp "Product page with the summary card and tabs")

| Tab | What you manage |
|---|---|
| **Inventory** | Bulk: the **Quantity** with **Update quantity**. Trackable: **Current stock** and **Expected stock** lists and **Add stock items** |
| **Variations** | **Enable variations**, **Add property** (e.g. Colour, Size), then **Add variation** with a value per property, Price, Weight and SKU |
| **Pricing** | **Charge for this product**, pricing method, price and period, **Preview pricing** (1 hour, 1 day, 3 days, 1 week, 1 month), **Taxable** with a tax profile, **Eligible for discounts**, **Security deposit value** and **Default purchase cost**. See [Pricing](doc:admin/pricing) |
| **Settings** | Name, SKU, **Description on documents**, images (the first is the main image), Weight and unit, **Buffer before / after (hours)**, **Allow shortage** and Tracking type |
| **Online store** | **Show in online store**, Description, Excerpt, SEO page title, meta description and slug with a search preview, and an **Embed on your website** `<iframe>` snippet |
| **Downtime** | Downtime records for this product and **Schedule downtime**. See [Availability](doc:admin/availability) |
| **Cross-sell** | Recommended products and bundles, in order, shown on the product page and in the cart |
| **History** | Orders and units booked, every order with this product, and the activity log |

:::tip Buffers and shortages
**Buffer before** blocks preparation time before each rental and **Buffer after** blocks cleaning time after each return. **Allow shortage** lets you reserve an order even when not enough units are free. Both are explained in [Availability](doc:admin/availability).
:::

### Embed snippet

The **Online store** tab gives a ready-made iframe for any website:

```html title="Embed code"
<iframe src="https://<your-platform-domain>/s/<workspace-slug>/p/<product-id>" width="100%" height="640" style="border:0;border-radius:12px" loading="lazy" title="Product name"></iframe>
```

Cross-sell recommendations only appear in the Online Store when cross-selling is switched on under **Online store → Cross-sell**. Until then the tab shows a warning with **Go to settings**.

**Next:** [Stock Items →](doc:admin/stock-items)
