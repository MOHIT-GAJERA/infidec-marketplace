---
title: Feature Sections
description: Build the ad rows on the app and website home screens, such as Latest Ads, Most Viewed or a category row, with their filter, item count, style and order.
---

**Admin → Content Management → Feature Section** creates the rows of ads on the home screen: *Latest Ads*, *Most Viewed*, *Featured Ads*, *Cars under one roof* and so on. Sections live in the Firestore collection `featured_sections`. The ads in each section are picked live by the API every time the home screen loads; you never add ads to a section by hand.

![Feature sections](/docs/classiadshub/images/admin-featured-sections.jpg "Admin → Content Management → Feature Section")

Staff need the **content** permission.

## Where sections appear

| Client | Behaviour |
|---|---|
| App home | Each section with at least one ad is shown under **All Advertisements**, in section order |
| Website home | Each section with at least one ad is shown with its title, the first **4** ads and a **View all** link to `/search` |

Both read the sections from `GET /api/v1/home` (`featured_sections`). The same data is also available at `GET /api/v1/featured-sections`. When **Featured Section** is switched off on [Home Screen](doc:admin/home-content), no sections are returned.

## Add a section

The page header reads **Create Feature Section**; the card **Add Feature Section**.

| Field | Notes |
|---|---|
| Language tabs | Translate the **Title** into other active languages |
| **Title (English)** | Required. The heading shown above the row |
| **Slug** | *Generated from the title when empty* |
| **Filters** | Required. Decides which ads fill the row (table below) |
| **Items to show** | 1–50, default 10. The maximum number of ads returned |
| **Active** | Inactive sections are not returned |
| **Categories** | Only for **Category Criteria**: tick one or more categories in the tree |
| **Select Style for APP Section** | **Style 1** to **Style 4** (card layouts, previewed on the card) |

Click **Submit** (`POST /api/v1/admin/crud/featured_sections`).

## Filters

Every filter only uses **published** ads: status `approved` and not past `expires_at`.

| Filter | Label | Ads returned |
|---|---|---|
| `latest` | Latest Ads | Newest by publish date |
| `most_viewed` | Most Viewed | Highest `views_count` first |
| `most_liked` | Most Liked | Most favourites first |
| `featured` | Featured Ads | Only featured ads, newest first |
| `category` | Category Criteria | Ads in the ticked categories (or whose parent category is ticked), newest first |
| `price_low_high` | Price: Low → High | Cheapest first |
| `price_high_low` | Price: High → Low | Most expensive first |

:::tip Category rows
For **Category Criteria**, ticking a main category also catches ads posted directly in its first-level subcategories (the ad's `parent_category_id`). For deeper trees, tick the subcategories too.
:::

## The list

*\* To change the order, drag the table rows up & down.* The order is saved at once (*"Order saved."*) and is the order on the home screen.

| Column | Shows |
|---|---|
| **Style** | Small preview of the chosen style |
| **Title** | Section title |
| **Filters** | Filter label |
| **Sequence** | Stored sort order |
| **Value** | *N Category* for category sections, otherwise *N items* |
| **Active** | Toggle |
| **Action** | **Edit** (loads the section into the form above; **Cancel** leaves edit mode) and **Delete** |

:::note Style and translations
The style (`style_1` … `style_4`) is stored and returned with each section, and the title translations are stored in `translations`. The bundled app and website currently render every section with their standard ad cards and the English title.
:::

:::warning Empty sections are hidden
A section with no matching ads (for example *Featured Ads* when nothing is featured) is skipped by both clients. If a section does not show up, check that matching approved ads exist.
:::

**Next:** [Offer Item Tips →](doc:admin/tips)
