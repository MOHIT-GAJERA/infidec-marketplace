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
| Currency code | `INR` | Orders and wallet top-ups in this country are charged in this currency — your payment gateway must support it |
| Currency symbol | `₹` | Shown on prices, in order e-mails / notifications, in the Admin Panel order and return screens and in the Delivery Boy App |
| Timezone | `Asia/Kolkata` | Peak-hour surge and promo-code time windows, report days and daily sales statistics for this country |
| Default | On | The country pre-selected for new visitors |
| Status | Active | Inactive countries are hidden in the apps |

## Default currency

**System Settings → General → Default Currency / Currency Symbol** (and **Timezone**) are the fallback when a country has no currency or time zone set. Keep them the same as your main country.

What each country controls:

- **Checkout and wallet top-ups** are charged in the currency of the customer's country (the country selected on the website or in the app; the default country otherwise).
- **Order e-mails, notifications and COD limits** show amounts with the order's country symbol.
- **Admin Panel** order, return and customer screens show each record in its own country's currency.
- **Delivery Boy App** shows amounts in the currency of the rider's zone country.
- **Reports and dashboard statistics** count days from midnight to midnight in the country's time zone (falling back to the general time zone, then `Asia/Kolkata`).

:::warning One currency per country
Prices are stored as plain numbers in the store's currency. Do not change a country's currency after you have products and orders — existing amounts would be shown in the new currency without conversion.
:::

## Selling in several countries

Add each country, then create zones and stores inside it. Customers pick their country/city on the location screen (or it is detected from their GPS position), and see only the stores and prices of that zone.

**Next:** [Delivery Zones →](doc:admin/zones)
