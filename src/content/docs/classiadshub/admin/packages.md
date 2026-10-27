---
title: Subscription Packages
description: Create the paid (or free) packages that give sellers an ad-posting quota, with price, discount, duration, ad limit, category scope and translations.
---

A **subscription package** gives a user a quota of ad listings for a period of time. Users buy packages **on the website** (**Dashboard → Subscriptions**). The mobile app has no purchases: it only shows what the user already has.

Manage packages in **Admin → Package Management → Subscription Packages**. The data is the Firestore `packages` collection, served by the generic admin CRUD API (`/admin/crud/packages`).

![Subscription Packages](/docs/classiadshub/images/admin-packages.jpg "Admin → Package Management → Subscription Packages")

## When is a package needed?

Packages only matter when posting is not free. Two switches in [General settings](doc:admin/settings#advertisement-settings) decide this:

| Setting | Effect |
|---|---|
| **Free Ad Listing** on | Anyone can post without a package (default) |
| **Free Ad Listing** off, or **Require an active package to post** on | Posting needs an active package that covers the ad's category and still has quota |

When a package is required and the user has none, the API refuses the ad with *"An active subscription with remaining quota is required to post in this category."* Each posted ad uses one unit of the package's ad limit (`ads_used + 1`), unless the package is unlimited.

## The list

**Tabs:** **All Packages**, **Active Packages**, **Inactive Packages**, **Discontinued Packages**.

**Package Type** filter: *All*, *Item Listing (Ads)*, *Featured Ads*.

The toolbar has **Search...** (by name), **Refresh**, a **Columns** menu to hide columns, and **Export CSV** (`packages.csv`). The footer shows *"Showing 1 to 3 of 3 entries"* and a rows-per-page selector.

| Column | Shows |
|---|---|
| **Image** | Package icon |
| **Name** | Package name (sortable) |
| **Type** | **Item Listing (Ads)** or **Featured Ads** |
| **Categories** | **Global** (no categories selected) or **Category Based** |
| **Price** | Base price |
| **Discount (%)** | Discount applied to the price |
| **Final Price** | Price after discount (what the buyer pays, plus tax) |
| **Package Duration** | Days, or *Unlimited* |
| **Ad Limit** | Number of ads, or *Unlimited* |
| **Total Revenue** | Sum of `total` of all **completed** transactions for this package |
| **Active Subscribers** | Subscriptions with status `active` whose end date has not passed |
| **Package Status** | Active / Inactive / Discontinued |
| **Action** | Edit, Delete |

**Delete** asks *"Delete package "…"? Existing subscriptions keep working."* Subscriptions already bought keep their own copy of the limit and end date, so deleting a package does not cut anyone off.

## Create or edit a package

Click **Create Subscription Package** (or the edit icon). The page has two cards: the package form and **Category Scope**.

![Create package](/docs/classiadshub/images/admin-package-form.jpg "Create Package")

| Field | Notes |
|---|---|
| **Package Name** | Required. Translatable (see below) |
| **IOS Product ID** / **Android Product ID** | Optional store product ids. Kept for compatibility with the earlier version. The current app does not sell packages, so they are not used |
| **Description** | Translatable |
| **Currency** | Any active currency from [Currencies](doc:admin/locations#currencies). Default `USD` |
| **Price** | Required, in major units (e.g. `9.99`). Stored in cents |
| **Discount (%)** | 0–100 |
| **Final Price** | Read-only. `Price × (1 − Discount / 100)`. The server recalculates it on save |
| **Package Duration Type** | **Limited** (then **Duration (Days)** is required) or **Unlimited** (never expires) |
| **Package Type** | **Ad Listing Package** or **Featured Ads Package** |
| **Ad Limit** | Number of ads. Tick **Unlimited** for no limit |
| **Status** | **Active**, **Inactive**, **Discontinued** |
| **Icon** | Image, max 5 MB. Stored in Storage under `packages/` |
| **Key Points** | Bullet list shown on the website plan card. **Add Key Point** adds a line. Translatable |

**Category Scope**: *"Select the categories where this Package should be applied"*. Tick **Global (Apply to All Categories)** or pick categories in the tree. A category-based package only gives quota for ads posted in those categories.

Click **Create Package** / **Update Package**. You return to the list with *"Package created."* or *"Package updated."*

:::note Package Type
The website lists both types on the plans page, and both give an ad-posting quota. Promoting a single ad to Featured is sold through [Featured Ad Plans](doc:admin/featured-plans), not through a package. Treat **Package Type** as a label for your own grouping.
:::

### Translations

When more than one language is active (see [Languages](doc:admin/languages)), language tabs appear above the form. On a non-English tab you fill in only **Package Name**, **Description** and **Key Points**. They are saved in the package's `translations` map. Prices, limits and the icon are shared by all languages.

## Status and visibility

| Status | Website | Admin |
|---|---|---|
| **Active** | Shown on the plans page, can be bought | Can be assigned to customers |
| **Inactive** | Hidden | Can still be assigned from [Customers](doc:admin/customers) |
| **Discontinued** | Hidden | Hidden from the assign list |

Saving a status also sets `is_active` (`true` only for Active). The public endpoint `GET /packages` returns active packages only.

## What happens when a user buys

1. The website calls `POST /subscriptions/checkout` with the package and the gateway.
2. The API creates a `pending` transaction (amount = final price, plus tax from **Tax (%)** in [General settings](doc:admin/settings)) and a `pending` subscription.
3. When the payment is confirmed, the subscription becomes `active` with `starts_at` now, `ends_at` = now + duration (or none), and the package's ad limit. An invoice `INV-YYYYMMDD-000123` is created and the user gets a *"Payment successful"* notification.
4. A package whose total is `0` is activated straight away, without a gateway step.

The hourly `housekeeping` job sets subscriptions to `expired` once `ends_at` has passed. See [Subscriptions & Transactions](doc:admin/transactions) and [Payment Gateways](doc:admin/payment-gateways).

:::tip Give a package for free
Use the **Assign package** action on [Customers](doc:admin/customers) to activate a package for a user without payment. It is recorded as a `0` transaction with gateway `admin`.
:::

**Next:** [Featured Ad Plans →](doc:admin/featured-plans)
