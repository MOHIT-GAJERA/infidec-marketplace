---
title: Modules
description: Enable and order the four Go4Market modules (Grocery, Food, Pharmacy and Shopping), set their colours, and understand how a module scopes the catalogue and orders.
---

A **module** is a vertical of your marketplace. Go4Market ships four, with fixed IDs:

| Module ID | Default name | Typical sellers | Quick delivery |
|---|---|---|---|
| `grocery` | Grocery | Supermarkets, dairies, fruit and vegetable stores | Yes |
| `food` | Food | Restaurants and cloud kitchens (add-ons, veg/non-veg) | Yes |
| `pharmacy` | Pharmacy | Chemists and wellness stores | Yes |
| `ecommerce` | Shopping | Electronics, fashion, home | **No**, standard or scheduled delivery only |

Every category, product and order item carries a `moduleId`, and each order stores the list in `moduleIds[]`. Search, reports and the admin dashboard can be filtered by module.

## Manage modules

**Admin → Settings → Modules** (`/settings/modules`):

| Field | Effect |
|---|---|
| **Module id** | One of `grocery`, `food`, `pharmacy`, `ecommerce`. Fixed; the code relies on these IDs |
| **Name / Tagline** | Shown on the module tabs of the website and app home screens |
| **Theme colour** | The module's accent: home hero, category tiles and the panel when this module is selected |
| **Icon** | Icon name used by the clients |
| **Enabled** | Hide a module everywhere without deleting its data |
| **Order** | Order of the module tabs |

![Customer app home with module tabs](/docs/go4market/images/app-customer-home.webp "Module tabs (Grocery, Food, Pharmacy, Shopping) on the Customer app home")

## Module switcher in the panels

The top bar of the Admin panel has a **module switcher** (*All modules* by default). Choosing a module:

- re-themes the panel in that module's colour,
- scopes the dashboard, catalogue lists and the product editor to the module,
- pre-selects the module for new products, sliders and offers.

## Running fewer modules

To launch as a grocery-only store, disable the other three. Their tabs disappear from the website and app, and sellers can only pick enabled modules at registration. You can enable them later without changing code.

:::warning Do not rename module IDs
The IDs are referenced by the order engine (quick delivery is refused for `ecommerce` items), search, reports and the seed data. Change the **name** and **colour** freely, but keep the IDs.
:::

**Next:** [Platform Settings →](doc:admin/platform-settings)
