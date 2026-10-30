---
title: Products, Variants & Stock
description: Add and approve products with variants, food add-ons, barcodes and AI descriptions, manage stock and low-stock alerts, bulk import/export, media, ratings and product order.
---

Products belong to a **seller** and a **module**. Admins can create products for any seller and approve products submitted by sellers.

## Add a product

**Admin → Catalogue → Add product** (`/catalog/products/new`). The editor takes on the colour of the module you choose.

| Section | Fields |
|---|---|
| Basics | Name, module, category (tree picker), brand, seller, unit (e.g. `500 ml`), tags |
| Description | Short and long description, with **Generate with AI** (see [AI Descriptions](doc:admin/ai-descriptions)) |
| Pricing | Price, MRP (strike-through), tax class |
| Stock | Stock, low-stock threshold (`lowStockAt`), SKU, **barcode** (EAN-13) |
| Variants | Name, price, MRP, stock and SKU per variant. The **variant generator** creates every combination of chosen attribute values |
| Food | **Veg / Non-veg**, **add-ons** (name + price, e.g. *Extra raita +₹29*), delivery minutes |
| Custom fields | Any fields defined in Catalogue → Custom fields |
| Media | Several images (WebP, JPEG or PNG, up to 10 MB each) |
| Visibility | Status (`active`, `pending`, `draft`, `rejected`), featured |

![Food product with add-ons in the Customer app](/docs/go4market/images/app-customer-food-addons.webp "A Food product: variants (Regular / Family pack) and optional add-ons, priced by the order engine")

When you save, `onProductWritten` builds the search **keywords** (words plus 2–10-character prefixes, so partial typing matches), the slug and `categoryPath`, and updates category counts.

## Approvals

Products created by sellers start as **pending** unless `settings/platform.autoApproveProducts` is `true`. Review them at **Catalogue → Product approvals** (`/catalog/approvals`): approve (status `active`) or reject. Sellers can change stock on their own products at any time without re-approval.

## Stock

**Catalogue → Stock management** (`/catalog/stock`) lists products by stock level, with quick restock. Stock is reserved inside the order transaction and restored on cancellation or return. `onProductWritten` sends **low-stock and out-of-stock alerts** to the seller when stock crosses `lowStockAt` or reaches zero.

## Bulk upload and bulk update

**Catalogue → Bulk upload / update** (`/catalog/bulk`):

1. **Download the template.** It contains the column headers and an example row.
2. Fill in or edit rows in a spreadsheet and save as CSV.
3. **Upload**. Rows with an `id` update existing products; rows without one create new products.

The columns are:

```text
id, name, slug, sku, barcode, moduleId, categoryId, brandId, price, mrp, stock, lowStockAt, unit,
tags, images, shortDescription, description, isVeg, featured, status, deliveryMinutes, sellerId
```

List cells (`tags`, `images`) use `|` as the separator. For a bulk **update**, export the current products, edit them, and import the file again.

## Media library, ratings and product order

- **Media library** (`/catalog/media`): browse, upload and delete files in Storage. Admins may delete any object.
- **Product ratings** (`/catalog/ratings`): every review with rating, comment and photos. Reviews come only from customers with a delivered order containing the product (`submitReview`). `onReviewWritten` keeps the product and seller averages up to date.
- **Product order** (`/catalog/sort`): drag products to set their manual sort order on the storefront.

:::note WebP everywhere
Upload forms accept WebP, and the seed stores all catalogue images as WebP. Smaller images mean faster pages and lower Storage costs.
:::

**Next:** [Homepage: Sliders, Offers & Popups →](doc:admin/homepage)
