---
title: Categories, Brands & Attributes
description: Build an unlimited category tree per module, manage brands, global attributes, custom fields (veg/non-veg, allergens) and tax classes.
---

The catalogue structure is shared by every seller. Admins own categories, brands and global attributes. Sellers add products into this structure and can define their own attributes and custom fields.

## Categories (unlimited depth)

**Admin → Catalogue → Categories** (`/catalog/categories`) shows a tree per module. Drag to reorder, click **Add** for a root category, or **Add sub-category** on any node. There is no depth limit.

| Field | Notes |
|---|---|
| Name, Slug | The slug is used in website URLs: `/c/<slug>` |
| Module | Grocery, Food, Pharmacy or Shopping |
| Parent category | Empty for a root category |
| Image / icon | Square image (WebP recommended, 480 × 480) |
| Subtitle | Small text on category tiles |
| Tile background (light / dark) | Pastel tile colours for light and dark mode |
| Active | Hide without deleting |
| Meta title, description, keywords | SEO for the category page |

Each category stores `parentId`, `path[]` (all ancestor IDs) and `depth`. Each product stores `categoryPath[]`, so a product in *Dairy › Milk › Toned* also appears under *Dairy* and *Milk*. The `onProductWritten` trigger keeps `productCount` up to date, so the storefront can hide empty categories.

:::tip Plan the tree before importing products
Moving a category later is fine because paths are recalculated, but it is easier to agree on the top two levels per module first. For example, Grocery: *Fruits & Vegetables*, *Dairy, Bread & Eggs*, *Atta, Rice, Oil & Dals*, *Snacks & Beverages*.
:::

## Brands

**Catalogue → Brands**: name, slug, logo, tile background and description. Products reference a brand (`brandId`, `brandName`) and the storefront can filter by brand.

## Attributes

**Catalogue → Attributes**: reusable option lists such as *Size* (S, M, L, XL), *Weight* (250 g, 500 g, 1 kg) or *Colour*, with a display type (chips, colour swatches and so on). The product editor's **variant generator** combines attribute values into variants.

- **Global attributes** (`sellerId = null`) are created by admins and available to everyone.
- **Seller attributes** are private to the seller who created them.

:::warning Changing a global attribute
When an admin renames a global attribute, deletes it or removes values from it, `onAttributeWritten` creates an **attribute alert** and notifies the sellers whose products use it. They see a banner in Seller → Catalogue → Attributes and should update their variants.
:::

## Custom fields

**Catalogue → Custom fields** (`/catalog/custom-fields`) adds extra inputs without code. It has tabs for **products, sellers, delivery partners and customers**. Each field has a label, key, type (text, number, dropdown, toggle…), dropdown options, help text and a *required* flag. Typical product fields are spice level, allergens, prescription required or warranty.

Products also have a built-in **Veg / Non-veg** flag (`isVeg`). The website and apps show the green or red marker on Food items.

## Taxes

Tax classes are described in [Cities, Countries & Taxes](doc:admin/cities-countries#taxes).

**Next:** [Products, Variants & Stock →](doc:admin/products)
