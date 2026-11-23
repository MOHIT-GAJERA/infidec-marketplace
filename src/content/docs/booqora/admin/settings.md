---
title: Settings Overview, General & Rental Period
description: How the Rental Platform settings area is organised, every field in General settings, the Rental period options and a summary of Pricing settings.
---

All workspace configuration lives under **Settings** (`/settings/<section>`). Each section is saved into the workspace document as `settings.<section>` (for example `settings.general`), so every member of the team sees the same values. Sections that manage lists (tax profiles, locations, templates) save each item immediately; the other sections have a **Save** button.

![Settings](/docs/booqora/images/platform-settings.webp "The settings side navigation with the Back office and Online bookings groups")

## Sections

| Menu item | Route | Page |
|---|---|---|
| General | `/settings/general` | This page |
| Pricing | `/settings/pricing` | [Pricing](#pricing) below and [Pricing & Deposits](doc:admin/pricing) |
| Taxes | `/settings/taxes` | [Taxes, Locations & Custom Fields](doc:admin/taxes-locations) |
| Rental period | `/settings/rental-period` | [Rental period](#rental-period) below |
| Payment providers | `/settings/payments` | [Payment Gateways](doc:admin/payment-gateways) |
| Custom fields | `/settings/custom-fields` | [Taxes, Locations & Custom Fields](doc:admin/taxes-locations) |
| Locations | `/settings/locations` | [Taxes, Locations & Custom Fields](doc:admin/taxes-locations) |
| Emails | `/settings/emails` | [Email & SMTP](doc:admin/email-smtp) |
| Documents | `/settings/documents` | [Documents & Translations](doc:admin/documents-translations) |
| Translations | `/settings/translations` | [Documents & Translations](doc:admin/documents-translations) |
| Security | `/settings/security` | [Team & Security](doc:admin/team-security) |
| Team | `/settings/team` | [Team & Security](doc:admin/team-security) |
| Account and billing | `/settings/billing` | [Plans & Billing](doc:admin/billing) |

Under **Online bookings** a link opens **Online store settings** (`/online-store`), described in [Online Store Overview](doc:store/overview). On narrow screens the side navigation becomes a dropdown.

## General

**Settings → General** (`/settings/general`, file `lib/features/settings/general_settings.dart`).

![General settings](/docs/booqora/images/platform-settings-general.webp "Company info, address, document lines, regional settings and labels")

### Company info

| Field | Notes |
|---|---|
| Logo | PNG, JPG or SVG, up to 8 MB. Uploaded to Storage under `branding` and saved **as soon as it is uploaded**. |
| Company name | Required. Also renames the workspace and the public store name. |
| Email shown on documents | Printed on documents. Also receives the "new online booking" notification ([Email & SMTP](doc:admin/email-smtp)). |
| Phone | Printed on documents and shown on the offline store page. |
| Website | Free text, e.g. `https://`. |

On save, the name, logo, email and phone are also copied to the public store document `publicStores/<slug>`, which the [Online Store](doc:store/overview) reads.

### Address and extra lines

- **Country** (India, United States, United Kingdom, United Arab Emirates, Australia, Canada, Singapore, Germany, France, Netherlands, New Zealand, South Africa, Ireland, Spain, Italy, Other), **Address line 1 and 2**, **City**, **State**, **Pincode**. Printed on invoices, quotes and contracts.
- **Extra details for documents**: two free lines, for example a GSTIN or bank details.

### Regional settings

| Setting | Options | Default |
|---|---|---|
| Time zone | 19 zones, from `Asia/Kolkata` to `America/Sao_Paulo` and `UTC` | `Asia/Kolkata` |
| First day of the week | Monday, Sunday, Saturday | Monday |
| Date format | `dd-MM-yyyy`, `MM/dd/yyyy`, `yyyy-MM-dd` | `dd-MM-yyyy` |
| Use AM/PM | 2:30 PM instead of 14:30 | Off |
| Unit system | Metric (kg, g) or Imperial (lb, oz) | Metric |
| Default weight unit | Depends on the unit system | kg |

The date format and AM/PM switch drive every date and time shown in the platform. The calendar uses the first day of the week. The time zone is used when the booking emails format dates.

### Personalize labels

Optional names for **Customer**, **Order**, **Quote**, **Contract** and **Packing slip**. Leave a field empty to keep the default.

:::note Currency is under Pricing
There is no currency field in General. The currency is chosen when the workspace is created and can be changed in **Settings → Pricing**.
:::

## Rental period

**Settings → Rental period** (`/settings/rental-period`, saved as `settings.rentalPeriod`).

![Rental period](/docs/booqora/images/platform-settings-rental.webp "Rental period mode, default times, operating hours and away mode")

| Section | Options |
|---|---|
| Rental period | **Dates and times** (with an *Enable time selection* tick box), **Fixed durations** (add lengths such as "3 days" or "1 week" from hours, days, weeks or months) or **Single day rental** |
| Default order times | **Pickup time** (default 09:00) and **Return time** (default 17:00), plus *Pre-fill the times* |
| Operating hours | Switch on, then open or close each weekday with a from/to time (default 09:00 to 18:00, Sunday closed) |
| Time interval | 15 minutes, 30 minutes or 1 hour (default) |
| Away mode | Switch on and add one or more date ranges when you are closed |
| Manual orders | *Apply rental restrictions to manual orders* |

:::warning What is enforced today
In the current code the **default pickup and return times** are applied when you create a new order. The mode, operating hours, interval, away mode and manual-order restriction are saved with the workspace but are not yet checked by the order editor or the Online Store date pickers. Treat them as stored preferences.
:::

## Pricing

**Settings → Pricing** (`/settings/pricing`) holds:

- **Enable pricing**, the **Currency** (INR, USD, EUR, GBP, AED, AUD, CAD, SGD), **Display as symbol** and **Symbol position** (before or after), with a live example.
- **Pricing structure templates**: tiered rates you assign to products, with four suggested templates.
- **Security deposits**: no deposit, percentage of order total, product-specific, or fixed amount.

The currency is also copied to the public store and decides which payment providers are available. Everything is explained in [Pricing & Deposits](doc:admin/pricing).

![Pricing settings](/docs/booqora/images/platform-settings-pricing.webp "Currency, pricing structure templates and security deposits")

**Next:** [Payment Gateways →](doc:admin/payment-gateways)
