---
title: Bundles & Collections
description: Group products into discounted bundles for orders, and organise products into collections for the inventory and the Online Store.
---

**Bundles** and **collections** both group products, but for different reasons. A bundle is something you *sell* as one line on an order, such as a wedding photo kit. A collection is a way to *organise* products, such as "Cameras" or "Party tents", in your inventory filters and your Online Store. Both are managed under **Inventory** (`booqora_platform/lib/features/inventory/`).

## Bundles

**Inventory → Bundles** (`/inventory?tab=bundles`) lists your bundles with Name, Items (total units), Price and Store visibility. Bulk actions are **Show in store**, **Hide from store** and **Delete**.

![Bundles](/docs/booqora/images/platform-bundles.webp "Bundles tab with item counts and prices")

### Creating a bundle

Choose **Add product → Add bundle**, or go to `/inventory/bundles/new`.

| Section | Fields |
|---|---|
| **General** | **Name** (required, e.g. *Wedding photo kit*), Description and Image |
| **Items** | **Add product** for each product, then set the **quantity** and an optional **Discount %** per item. At least one item is required |
| **Price** | Shows the **Sum of items**. Optionally enter a **Bundle price override** |
| **Online store** | **Show in online store** and the collections the bundle belongs to |

### How a bundle is priced on an order

Type the bundle name in the order editor's product search; bundles show as *Bundle · n items*. The bundle becomes one order line:

- **Without an override**, the line price is the sum of each item's rental price for the order period × its quantity × (1 − item discount %). It is recalculated when you change the rental period.
- **With an override**, the override amount is used as the bundle's unit price.

```text title="Example: no override, 2-day rental"
Camera body  ₹1,000/day × 2 days × 1   × (1 − 10%) = ₹1,800
Lens          ₹500/day × 2 days × 2   × (1 −  0%) = ₹2,000
Bundle line price                                   = ₹3,800
```

:::warning Bundles and availability
A bundle line is stored as one line with its items attached, not as separate product lines. The availability check in [Availability](doc:admin/availability) counts product lines only, so the products inside a bundle are not deducted from stock. If stock is tight, add the products individually instead.
:::

Bundles can also be added as cross-sell recommendations on a product's **Cross-sell** tab.

## Collections

**Inventory → Collections** (`/inventory?tab=collections`) lists collections with their number of products and whether they show in the Online Store. Bulk actions are **Show in store**, **Hide from store** and **Delete**.

![Collections](/docs/booqora/images/platform-collections.webp "Collections tab with the system All products collection")

### The All products collection

Every workspace starts with a **System** collection called **All products** (id `all-products`). It always contains every product, its name cannot be changed and it cannot be deleted. New products are added to it automatically.

### Creating a collection

Choose **Add product → Add collection**, or go to `/inventory/collections/new`.

| Section | Fields |
|---|---|
| **General** | **Name** (required), **Parent collection** (or *None (top level)*) and Image |
| **Appearance in online store** | **Include in collections page** (show it in the store navigation) and Description |
| **SEO** | Page title (60 characters), Meta description (160 characters) and Slug |
| **Products** | **Add product** to add members, or the × to remove one |

You can also add a product to collections from its product page, using **Add to collections** on the **Collections** card.

### Where collections are used

- **Inventory filters**: the Products tab has a **Collections** filter.
- **Coupons**: a coupon can apply to *Specific collections* only ([Coupons](doc:admin/coupons)).
- **Online Store**: collections with **Include in collections page** switched on (except the system collection) appear as filters on your booking page. See [Online Store overview](doc:store/overview).

Deleting a collection only removes the grouping; the products stay in your inventory. System collections are skipped by bulk delete.

**Next:** [Pricing →](doc:admin/pricing)
