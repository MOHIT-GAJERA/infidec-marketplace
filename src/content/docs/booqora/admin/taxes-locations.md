---
title: Taxes, Locations & Custom Fields
description: Configure tax-inclusive or tax-exclusive pricing and tax profiles, manage pickup and delivery locations, and add custom fields to customers, orders and products.
---

Three settings sections describe how your business is set up: how tax is calculated, where items are kept and handed over, and what extra information you collect.

## Taxes

**Settings → Taxes** (`/settings/taxes`, file `taxes_settings.dart`).

![Tax settings](/docs/booqora/images/platform-settings-taxes.webp "Tax-inclusive or exclusive pricing with a live preview, plus product and customer tax profiles")

### General

Choose how the prices you enter are treated. This is saved as `settings.taxes.pricesIncludeTax` (default **exclusive**) and is used by the order price calculation in `lib/data/pricing.dart`.

| Option | Calculation | Typical use |
|---|---|---|
| **Product prices include tax** | Tax is taken out of the price: `tax = price − price / (1 + rate/100)` | Retail |
| **Product prices exclude tax** | Tax is added on top: `tax = price × rate/100` | B2B |

A **Preview** box lets you type a product price and a rate and shows *Total excl. taxes*, *Tax* and *Total incl. taxes*.

### Tax profiles

Tax profiles are stored in the `taxProfiles` collection and are saved immediately.

| Profile type | Purpose | Where you pick it |
|---|---|---|
| **Product tax profiles** | Rates such as "GST 18%" or "VAT 20%" | The product's pricing tab ([Products](doc:admin/products)) |
| **Customer tax profiles** | Rates that override product taxes for a customer, e.g. "Tax exempt" | The customer form |

Each profile has a **Name**, a **Rate** (%) and a **Compound tax** tick box ("Calculated on top of other taxes"). The compound flag is saved on the profile; the current price calculation applies each line's rate on its own.

Deleting a profile shows a warning: products or customers using it will no longer be taxed by it.

:::note Online Store orders
Booking requests from the Online Store are created with zero tax. The cart shows "Taxes calculated at confirmation": tax is applied when your team opens and confirms the order.
:::

## Locations

**Settings → Locations** (`/settings/locations`, collection `locations`). Every workspace starts with a **Main location** that allows pickup and is the default.

Click **Add location** and fill in:

| Field | Meaning |
|---|---|
| Name | e.g. "Downtown store" (required) |
| Address | Street, city, postcode |
| Pickup | Customers can collect and return items here |
| Delivery | Orders can be delivered from this location |
| Show in online store | Customers can choose this location when booking online |
| Default location | Used for new orders. Only one location can be the default; choosing a new default clears the old one |

The table shows each location with its **Online store** status (*Visible* or *Hidden*). Deleting a location keeps the reference on existing orders. If you delete the default, another location becomes the default.

Locations with **Pickup** on are offered as the **Default pickup location** in the store's [Fulfillment settings](doc:store/checkout#fulfillment), and the order editor lets staff choose a location.

## Custom fields

**Settings → Custom fields** (`/settings/custom-fields`, collection `customFields`). Fields are grouped in three cards, and you can **drag** fields to change the order they appear in.

| Group | Captured on |
|---|---|
| Customer information | Each customer |
| Order information | Orders |
| Product information | Products |

Click **Add field** in a group:

| Setting | Options |
|---|---|
| Name | e.g. "Driving licence number" |
| Type | Text, Number, Date, Dropdown (select), Checkbox |
| Options | For dropdowns only; at least one option is required |
| Show on documents | Print the field on invoices, quotes and contracts |
| Ask in checkout | Customer and order fields only: customers fill it in when booking online |

Values are stored on each record under `customFields`. Deleting a field keeps the values already stored, but the field is no longer shown or editable.

:::warning What is wired up today
**Customer** fields appear on the customer form (`/customers/new` and `/customers/:id`). Order and product fields, and the *Ask in checkout* and *Show on documents* flags, are saved in the definitions but are not yet rendered by the order editor, the product page, the documents or the Online Store checkout. The checkout asks only for name, phone, email, fulfillment, address and notes ([Checkout & Fulfillment](doc:store/checkout)).
:::

**Next:** [Documents & Translations →](doc:admin/documents-translations)
