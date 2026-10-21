---
title: Countries & Currency
description: Add the countries you sell in, with their dial code, currency and timezone.
---

Every zone, store and price belongs to a **country**. The country decides the currency symbol shown in the apps, the phone dial code used for OTP login and the timezone used for reports and surge hours.

![Countries](/docs/qwikmart/images/admin-countries.jpg "Admin → Countries")

## Add a country

**Admin → Countries → Add**

| Field | Example | Notes |
|---|---|---|
| Name | India | Shown in the location picker |
| ISO code (`iso2`) | `IN` | Two letters |
| Dial code | `+91` | Pre-selected on the phone login screen |
| Currency code | `INR` | Used for payment gateways |
| Currency symbol | `₹` | Shown on prices |
| Timezone | `Asia/Kolkata` | Reports, surge slots, "today" on dashboards |
| Default | On | The country pre-selected for new visitors |
| Status | Active | Inactive countries are hidden in the apps |

## Default currency

**System Settings → General → Default Currency / Currency Symbol** sets the fallback currency for screens that are not tied to a country (for example the wallet). Keep it the same as your main country.

:::warning One currency per country
Prices are stored as plain numbers in the store's currency. Do not change a country's currency after you have products and orders — existing amounts would be shown in the new currency without conversion.
:::

## Selling in several countries

Add each country, then create zones and stores inside it. Customers pick their country/city on the location screen (or it is detected from their GPS position), and see only the stores and prices of that zone.

**Next:** [Delivery Zones →](doc:admin/zones)
