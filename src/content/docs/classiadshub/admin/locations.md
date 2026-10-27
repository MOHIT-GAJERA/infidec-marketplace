---
title: Countries, States, Cities, Areas & Currencies
description: Build the location tree (country, state, city, area) that sellers pick when posting and buyers filter by, import countries in bulk, place cities on a map, and manage currencies.
---

**Admin → Location** holds the reference data used when posting an ad (location pickers on the website and in the app), for search filters and for price display.

| Page | Collection | Parent |
|---|---|---|
| **Currencies** | `currencies` | — |
| **Countries** | `countries` | — |
| **States** | `states` | Country |
| **Cities** | `cities` | Country (+ State) |
| **Areas** | `areas` | Country + State + City |

All five need the **Locations** permission. Each list has **Search...**, **Refresh**, **Columns** and **Export CSV**. Lists are sorted by name (currencies by sort order). Public endpoints (`GET /locations/countries`, `/locations/states`, `/locations/cities`, `/locations/areas`, `/currencies`) return **active** rows only.

:::tip Build top-down
Add countries first, then states, then cities, then areas. The pickers on the Cities and Areas pages read the **public** endpoints, so a country or state you switched off does not appear there.
:::

## Countries

![Countries](/docs/classiadshub/images/admin-countries.jpg "Admin → Location → Countries")

| Column | Shows |
|---|---|
| **Name** | Country name |
| **Flag** | Flag emoji |
| **ISO** | `ISO-2 / ISO-3`, e.g. `IN / IND` |
| **Phone code** | e.g. `+91` |
| **Currency** | Currency code, e.g. `INR` |
| **Active** | Toggle |
| **Action** | Edit, Delete |

**Create Country** fields: **Name** (required, translatable), **ISO-2**, **ISO-3**, **Phone code**, **Currency code**.

### Import Countries

**Import Countries** loads the public world-countries dataset (`world-countries@5.1.0` from jsDelivr), hides the countries you already have (matched by ISO-2), and lets you tick any number of them. Click **Import N**. For each country it saves the name, ISO-2, ISO-3, phone code, first currency code and the flag emoji. Toast: *"12 countries imported."*

States, cities and areas are not imported; add them yourself.

## States

![States](/docs/classiadshub/images/admin-states.jpg "Admin → Location → States")

Filter: **Country**. Columns: **Name**, **Country**, **Code**, **Active**, **Action**.

**Create State** fields: **Country** (required), **Name** (required, translatable), **Code** (optional, e.g. `GJ`).

## Cities

![Cities](/docs/classiadshub/images/admin-cities.jpg "Admin → Location → Cities")

The page has the form on top and the list below.

| Field | Notes |
|---|---|
| **Country** | Required |
| **State** | Optional for cities |
| **City Name** | Required |
| **Latitude** / **Longitude** | Optional. Type them, or click / drag the marker on the map |

The map is OpenStreetMap (Leaflet), so it needs no API key. Click **Save** (*"City added."*) or, when editing, **Update** / **Cancel**.

List columns: **Name**, **State**, **Country**, **Coordinates** (4 decimals), **Status** (toggle), **Action** (Edit scrolls up to the form, Delete).

:::note Why coordinates matter
Ads store their own latitude and longitude (from the address the seller picks), and **Nearby** search uses the ad's position with the **Nearby radius (km)** from [General settings](doc:admin/settings#advertisement-settings). City and area coordinates are returned by the location endpoints for the clients to centre maps on. Fill them in for the cities you care about.
:::

## Areas

![Areas](/docs/classiadshub/images/admin-areas.jpg "Admin → Location → Areas")

Same layout as Cities, with three pickers: **Country**, **State**, **City** (all required) and **Area Name**. A yellow note asks: *"Please select the correct location on the map. Do not place the marker for any other location."*

List columns: **Name**, **City**, **State**, **Country**, **Coordinates**, **Status**, **Action**.

:::warning Deleting
Deleting a country, state or city does **not** delete its children or update ads that use it. Ads keep the old id and show no location name. Prefer switching the row off (inactive) to hide it from pickers.
:::

## Currencies

![Currencies](/docs/classiadshub/images/admin-currencies.jpg "Admin → Location → Currencies")

| Column | Shows |
|---|---|
| **ISO Code** | e.g. `USD`, with a **Default** badge on the default currency |
| **Name** | e.g. *US Dollar* |
| **Symbol** | e.g. `$` |
| **Symbol Position** | `left` or `right` |
| **Country** | Optional label |
| **Active** | Toggle |
| **Action** | Edit, Delete |

**Create Currency** fields:

| Field | Notes |
|---|---|
| **ISO Code** | Required, exactly 3 letters, unique. Saved in upper case |
| **Name** | Required |
| **Symbol** | Required |
| **Symbol Position** | **Left ($100)** or **Right (100$)** |
| **Country** | Optional |
| **Decimal digits** | 0–4. Default 2 |
| **Default currency** | Toggle. Turning it on clears the flag on every other currency |

Active currencies are offered when creating [packages](doc:admin/packages) and sent to the clients (`GET /currencies`). The default currency for new ads is set separately in **Settings → Default Currency Settings** (see [Languages & Currency](doc:admin/languages#default-currency)), which also sets this **Default** flag.

:::note Prices are not converted
Each ad, package and plan keeps its own currency code. Changing the default currency does not convert existing prices.
:::

**Next:** [General, Web & SEO →](doc:admin/settings)
