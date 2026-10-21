---
title: Configure Home Screen
description: The home screen is built from the Admin Panel — no app update needed.
---

The home screen content is **not** hard-coded. The app calls the `getHome` function with the customer's zone and mode, and renders the sections you published in **Admin → Home Builder**.

![Quick home](/docs/qwikmart/images/app-customer-home.webp "Quick mode")
![eCommerce home](/docs/qwikmart/images/app-customer-ecommerce.webp "eCommerce mode")

## What you change in the panel

| Element | Where |
|---|---|
| Banners, category rows, product sliders, brands, grids | [Home Builder](doc:admin/home-builder) — per zone, Quick and eCommerce |
| Delivery time ("Delivery in 8 minutes") | [Delivery Zones](doc:admin/zones) → delivery time |
| Categories in the top tabs | Categories (Quick / eCommerce flags, Category Order) |
| Search bar suggestions / trending | Based on product names and best sellers |

Changes appear the next time the customer opens the app or pulls to refresh — no new app version needed.

## In code

Only the look of each section type is coded:

| Section | Widget folder |
|---|---|
| Section renderer | `lib/features/home/` |
| Product card | `lib/widgets/product_card.dart` |
| Banner card | `lib/widgets/banner_card.dart` |

**Next:** [Login Methods & Phone OTP →](doc:app-customer/auth-methods)
