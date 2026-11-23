---
title: Online Store Overview
description: The Online Store module in the Rental Platform, the public booking page at /s/<slug>, how it is published through publicStores, the setup steps and how to take the store online or offline.
---

Every Booqora workspace comes with an **Online Store**: a public booking page where customers pick rental dates, add products to a cart and send a booking request. It is part of the Rental Platform app, so there is nothing extra to deploy.

![Online store overview](/docs/booqora/images/platform-online-store.webp "Booking page, website builder and website integration cards with the setup steps")

## Store URL

```text
https://<your-platform-domain>/s/<workspace-slug>
https://<your-platform-domain>/s/<workspace-slug>/p/<product-id>   (product page)
```

The **slug** is made from the company name when the workspace is created (`Session.slugify`). If the slug is taken, `-1`, `-2` and so on is added. The slug cannot be changed in the panel.

These routes are public: the router lets anyone open `/s/...` without signing in.

## How the store gets its data

The store never reads your private workspace settings. When you save store-related settings, the Rental Platform copies the public parts into **`publicStores/<slug>`** (`StoreSync.mirror` in `lib/features/online_store/store_common.dart`):

| Copied field | From |
|---|---|
| `name`, `logoUrl`, `email`, `phone` | Settings → General |
| `currency`, `symbol`, `position` | Settings → Pricing |
| `enabled`, `brandColor`, `description`, `heroTitle`, `heroSubtitle`, `announcement`, `showPrices`, `addToCart`, `availabilityEnabled` | Online store → Booking page and Preferences |
| `seoTitle`, `seoDescription` | Online store → SEO |
| `termsRequired`, `termsLabel`, `termsText` | Online store → Checkout |
| `fulfillmentDefault` | Online store → Fulfillment |
| `crossSell` (enabled, title, subtitle, max items) | Online store → Cross-sell |
| `workspaceId` | The workspace |

The store then loads the workspace's **products** with `showInStore == true` (archived products are skipped) and the **collections** with `showInStore == true` (except the system "All products" collection).

## The module

**Online store** in the side menu opens `/online-store`. A **View online store** button in the header opens your live store. The sections are:

| Section | Route | Covered in |
|---|---|---|
| Overview | `/online-store` | This page |
| Booking page | `/online-store/booking-page` | This page |
| Website | `/online-store/website` | [Website & Branding](doc:store/website) |
| Website integration | `/online-store/integration` | [Website & Branding](doc:store/website) |
| Cross-sell | `/online-store/cross-sell` | [Website & Branding](doc:store/website) |
| Preferences | `/online-store/preferences` | [Website & Branding](doc:store/website) |
| Fulfillment | `/online-store/fulfillment` | [Checkout & Fulfillment](doc:store/checkout) |
| Checkout | `/online-store/checkout` | [Checkout & Fulfillment](doc:store/checkout) |
| SEO | `/online-store/seo` | [SEO & Sharing](doc:store/seo) |

### Overview

Three channel cards:

- **Booking page**: shows *Live* or *Offline*, the store URL with a copy button, **View online store** and **Customize**.
- **Website builder**: themes, pages, menus, blog posts and redirects.
- **Website integration**: embed booking on WordPress, Shopify, Squarespace or any site.

Below them, **Steps to get started** tracks four tasks: *Set up rental period*, *Add products to store* (shows how many products are visible), *Customize checkout* and *Brand colour*. Each opens the right page.

### Booking page

| Setting | Purpose |
|---|---|
| **Enable online store** | Store status. When off, visitors see an offline message and cannot book |
| **Hero title** | Large heading, e.g. "Rent the best gear in town". Default: "Rent from <name>" |
| **Hero subtitle** | Text under the heading. Falls back to the store description |
| **Announcement bar text** | A coloured bar above the store, e.g. "Free delivery on orders over ₹5,000" |
| **Store description** | Longer description of your business |

A live preview updates as you type, and a **Share your booking page** card has **Copy link** and **Open** buttons. Saving mirrors the settings to `publicStores` straight away.

## Taking the store offline

Turn off **Enable online store** (Booking page or Preferences) and save. Visitors then see "This store is currently offline" with "<name> isn't taking online bookings right now. Please check back soon." and your email and phone buttons. A wrong slug shows "This store doesn't exist".

## Putting products in the store

Open a product under **Inventory**, switch on **Show in store** and save ([Products](doc:admin/products)). Add products to a collection that is shown in the store to give customers category chips.

![Store home](/docs/booqora/images/store-home.webp "The public booking page with hero, date pickers, collections and products")

## What happens to a booking

A booking from the store is created as an order with `source: online`, status `draft` and no order number, which the platform shows as a **request**. Your team reviews it in **Orders** and reserves it ([Orders](doc:admin/orders)). The `onOnlineOrder` function emails the customer and your store email. See [The Booking Flow](doc:store/booking-flow).

**Next:** [Website & Branding →](doc:store/website)
