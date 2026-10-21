---
title: Catalogue & Products
description: Set up taxes, categories, brands and attributes, then add products one by one or in bulk with a CSV.
---

Build the catalogue in this order: **Taxes → Categories → Brands → Attributes → Products**.

![Products](/docs/qwikmart/images/admin-products.jpg "Admin → Products → Manage Products")

## Taxes

**Admin → Taxes**: create the rates you charge, e.g. *GST 5 %*, *GST 12 %*, *GST 18 %*. Each product gets one tax. **System Settings → General → Prices include tax** decides whether prices you enter already include tax (usual in India) or tax is added at checkout.

## Categories

**Categories → Add Category**

- Name (in every language — use the **AI translate** button to fill the others), image, parent category for sub-categories.
- Flags: show in **Quick**, **eCommerce** or both.
- **Category Order** lets you drag categories into the order shown in the apps.

## Brands and attributes

- **Brands**: name and logo; shown on product pages and in the "Top Brands" home section.
- **Attributes**: filters such as *Weight*, *Size*, *Colour* that variants use and the website filter panel shows.

## Add a product

**Products → Add Product** is a five-step wizard:

| Step | What you enter |
|---|---|
| **Category** | Category and sub-category (decides where the product appears) |
| **Product Details** | Name, short description and description (rich text, per language — or **Generate with AI**), brand, tax, food type (veg / non-veg), tags, max quantity per order, images (first = cover), fulfilment (Quick / eCommerce / both), toggles: *Returnable* + return window (days), *Cancelable*, *Cash on Delivery*, *Featured* |
| **Variants** | Each pack size / colour: variant name (e.g. *1 kg*), SKU, price (MRP), sale price, stock |
| **SEO** | Slug, meta title, keywords, description, optional schema markup (website) |
| **Review** | Check everything and publish (status *Active* or *Inactive*) |

Products added by a store owner can require approval — they appear in **Products → Pending Approvals**.

Stock and price can then be overridden per store in **Stock Management**.

## Bulk upload and bulk update

- **Bulk Upload**: download the CSV template, fill one row per variant and upload. Images are image URLs; separate several images (and tags) with `|`. Booleans accept 1/0, true/false or yes/no.
- **Bulk Update**: export, change price/stock/status in a spreadsheet, re-upload.

:::tip AI content
With a Gemini key in **System Settings → AI**, the **Generate with AI** buttons write product descriptions and translate names into every enabled language. See [AI (Google Gemini)](doc:admin/ai-settings).
:::

## Reviews and ratings

Customers can rate delivered products and add photos. Moderate them in **Product Ratings** (hide or delete).

**Next:** [Home Builder →](doc:admin/home-builder)
