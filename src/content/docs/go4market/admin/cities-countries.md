---
title: Cities, Countries & Taxes
description: Define the cities you serve on an OpenStreetMap picker, the countries and dial codes you support, and the tax classes used on products and invoices.
---

## Cities & zones

**Admin → Settings → Cities & zones** (`/settings/cities`) lists the cities you deliver to. Click **Add**, search or click on the **OpenStreetMap** picker to set the centre, and drag the radius.

| Field | Key | Used for |
|---|---|---|
| City, State | `name`, `state` | City pickers in the website, apps and rider registration |
| Zone / area label | `zone` | Display only |
| Location | `lat`, `lng` | Map centre |
| Delivery radius (km) | `radiusKm` | Shown on the map; the hard limit is `maxDeliveryKm` |

Riders choose the cities they serve (`deliveryPartners.cities[]`). **Auto-assign** and the delivery pool only offer a rider orders from those cities, so name cities consistently.

:::note Location-based shopping
Customers pick their location on the map, and the checkout quote calculates distance, fee and ETA from the stores' coordinates to that address. Each seller's latitude and longitude come from their store settings. The backend also exposes `getNearbyStores` (approved stores within a radius, sorted by distance) for custom store-finder screens.
:::

:::warning Override fields
The city form also has *City delivery fee override*, *Free delivery above (override)* and *Minutes per km*. In v1.0 the checkout uses the platform-wide fee settings, so treat these as informational.
:::

## Countries

**Settings → Countries** (`/settings/countries`) holds `countries/{ISO}`: name, ISO code, dial code, currency and flag image. The seed adds India, UAE, United States and United Kingdom. Phone fields use the dial code, and numbers without a country code default to **+91**.

## Taxes

**Catalogue → Taxes** (`/catalog/taxes`) defines tax classes (`taxes/{id}`: title, percent, description). The seed adds GST 0 %, 5 %, 12 %, 18 % and 28 %. Products reference a class for invoices and reports.

:::tip Inclusive or exclusive pricing
Product prices in the demo are **GST-inclusive**, and `settings/platform.taxPct` is 0. If you want tax added at checkout instead, set **Platform settings → Tax** to a percentage. It is then added on top of the discounted subtotal.
:::

**Next:** [Categories, Brands & Attributes →](doc:admin/catalog)
