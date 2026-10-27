---
title: Custom Fields
description: Add category-specific fields such as Brand, Year or Fuel type to the post-ad forms, choose their type, options, length limits and required flag, and scope them to categories.
---

**Admin → Ads Listing → Custom Fields** defines the extra questions a seller answers when posting in a category: *Brand*, *Model year*, *Mileage*, *Bedrooms*, *Fuel type* and so on. Fields live in the Firestore collection `custom_fields`; the answers are stored on each ad in `custom_field_values`.

![Custom fields](/docs/classiadshub/images/admin-custom-fields.jpg "Admin → Ads Listing → Custom Fields")

Staff need the **custom_fields** permission.

## How fields reach the forms

- A field is linked to one or more categories (its **Category Scope**).
- A category shows its **own** fields **and** the fields of all its parent categories. Attach *Brand* to *Cars & Vehicles* once and it appears in *Cars*, *Motorbikes* and every other subcategory.
- The post-ad forms load the list with `GET /api/v1/categories/{id}/custom-fields` (website **Post Ad**, app **Post Ad**, Admin **Create Advertisement**).
- The ad detail pages show the answers under **Details** (website, app and Admin).
- The search API can filter by a field value with `cf[<code>]=<value>` (see [Ads Endpoints](doc:api/ads)).

Only **active** fields are shown. Fields are ordered by their sort order.

## The list

| Filter / column | Notes |
|---|---|
| **Category** filter | Fields whose scope contains this exact category |
| **Type** filter | *Number Input, Text Input, Text Area, Dropdown, Radio, Checkboxes, File Input, Date* |
| Search | Matches the name or the code |
| **Image** | The field icon |
| **Name** | Field name |
| **Category** | Category paths, e.g. *Cars & Vehicles > Cars* (first three, then *+2 more*) |
| **Type** | Stored type key (`dropdown`, `number` …) |
| **Action** | **Edit**, **Delete** |

Tick rows and click **Delete N** to remove several fields at once (`POST /api/v1/admin/crud/custom_fields/bulk`).

The **Custom fields** icon on the [Categories](doc:admin/categories) page opens this list already filtered to that category.

## Create or edit a field

Click **Create Custom Field**. The page has two cards.

![Custom field form](/docs/classiadshub/images/admin-custom-field-form.jpg "Create Custom Field with Category Scope")

### Create Custom Field

| Field | Notes |
|---|---|
| Language tabs | Translate the **Field Name** into other active languages |
| **Field Name** | Required. Shown as the label on the post-ad form |
| **Field Type** | See the table below |
| **Field Length (Min)** / **(Max)** | Only for Number Input, Text Input and Text Area. Number of characters |
| **Field Values** | Only for Dropdown, Radio and Checkboxes. Click **Add value** for each option |
| **Icon** | Optional image *(use 256 x 256 size for better view)*, stored under `custom-fields/` |
| **Required** | The seller must fill the field |
| **Active** | Inactive fields are hidden from all forms |

### Category Scope

*Select the categories where this Custom Field should be applied.* Tick categories in the tree (use the search box for large trees). Ticking a parent is enough for all its children.

Click **Save and Back** (or **Update**). The API is `POST` / `PUT /api/v1/admin/crud/custom_fields`.

## Field types

| Type | Label | Seller input | Server check |
|---|---|---|---|
| `number` | Number Input | Number box | Must be a number; min/max length |
| `textbox` | Text Input | Single-line text | Min/max length |
| `textarea` | Text Area | Multi-line text | Min/max length |
| `dropdown` | Dropdown | Select one option | Value must be one of the **Field Values** |
| `radio` | Radio | Select one option | Value must be one of the **Field Values** |
| `checkbox` | Checkboxes | Select several options | Every value must be one of the **Field Values** |
| `fileinput` | File Input | Text value | Min/max length when set |
| `date` | Date | Date picker | Stored as text |

When a check fails the API answers with HTTP 422 and a message such as *"The Mileage field is required."*, *"Invalid option for Fuel type."* or *"The Year must be a number."*; the forms highlight the field.

## The field code

Each field has a `code`, created once from the name when the field is first saved (for example *Fuel Type* → `fuel_type`). Apps and the API send answers keyed by code:

```json title="POST /api/v1/ads (part of the body)"
{
  "category_id": 14,
  "title": "Ford Mustang EcoBoost",
  "custom_fields": { "brand": "Ford", "year": "2021", "fuel_type": "Petrol" }
}
```

Renaming a field later does **not** change its code, so existing ads keep their answers.

:::warning Changing options on a live field
Answers are stored as the option value. If you remove or rename an option, ads that used it keep the old value, but the next time the seller edits the ad the old value fails the check (*Invalid option*) until they choose a new one.
:::

:::note Not in the form
The data model also has an `is_filterable` flag and per-category sort orders. The Admin form does not edit these; the flag is returned by the API for your own front-end filters.
:::

## Deleting a field

**Delete** removes the field definition. Values already stored on ads stay in `custom_field_values`. The API still returns them on the ad, but without a name or type, so they can show up as unlabelled values. Prefer switching **Active** off for fields that ads already use.

**Next:** [Job Listings →](doc:admin/jobs)
