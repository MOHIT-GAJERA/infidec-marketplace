---
title: Sliders & Home Screen
description: Manage the app home banner slider and the Home Screen section switches and popular-category list, and see exactly where each setting shows up on the app and the website.
---

Two pages under **Admin → Content Management** control the home screen:

| Menu item | Page title | Stores data in |
|---|---|---|
| **Slider** | *Slider* | Firestore collection `sliders`, images in Storage `sliders/` |
| **Home Screen** | *Home Screen Sections* | The `home` settings group (`settings` collection) |

Both feed `GET /api/v1/home`, the single call the app and the website make for the home screen. Staff need the **content** permission.

## What the home payload contains

| Key in `/home` | Filled from | Used by |
|---|---|---|
| `sliders` | Active sliders in sort order (empty when **Slider** is switched off) | App home banner carousel |
| `categories` | Active main categories | App category chips and **Popular Categories** grid; website category row |
| `featured_sections` | Active [Feature Sections](doc:admin/featured-sections) with their ads (empty when **Featured Section** is switched off) | App and website home sections |
| `popular_categories` | The list you build on **Home Screen** | Returned by the API (see the note below) |
| `sections_visibility` | The five switches | Returned by the API (see the note below) |

## Slider

![Slider](/docs/classiadshub/images/admin-sliders.jpg "Admin → Content Management → Slider")

The page has the form on the left and the list on the right.

### Add a slide

| Field | Notes |
|---|---|
| **Image** | Required. *Recommended 1200 × 450*. JPG, PNG, WebP, GIF or SVG up to 5 MB |
| **Title** | Optional. Shown on the slide when the image cannot load |
| **Item** | *Select Advertisement*: an approved ad the slide opens |
| **OR Category** | A category the slide opens |
| **OR Third Party Link** | An external `https://` URL |
| **Country / State / City** | Optional location for the slide |

**Item**, **Category** and **Third Party Link** exclude each other: picking one clears the others. The slide's `link_type` is set from what you picked (`ad`, `category`, `external` or `none`). Click **Submit** (`POST /api/v1/admin/crud/sliders`). New slides are active.

### The list

| Column | Shows |
|---|---|
| Drag handle | Drag rows to change the order (saved at once, *"Order saved."*) |
| **Image** | Slide image |
| **Type** | *Advertisement*, *Category*, *Link* or *-* |
| **Name** | Ad title, category name or slide title |
| **Country** | Country, if set |
| **Third Party Link** | The external URL |
| **Active** | Toggle the slide on or off |
| **Action** | Delete (*"Delete this slide?"*; the image file is removed too) |

Slides cannot be edited. To change a slide, add a new one and delete the old one.

### How the app uses slides

The app shows active slides as a swipeable banner (180 px high) below the search bar. Tapping a slide opens the linked ad (`/ad/<slug>`) or category (`/category/<slug>`). With no slides the app shows its built-in fallback banner.

:::note Current client behaviour
- **Third Party Link** slides are shown but do not open the link on tap in the bundled app.
- The **Country / State / City** values are stored and returned (`country_id`, `state_id`, `city_id`) but the app does not filter slides by location yet.
- The website home page uses its own hero banner and does not show the slider.
:::

## Home Screen

![Home Screen sections](/docs/classiadshub/images/admin-home-screen.jpg "Admin → Content Management → Home Screen")

### Section Visibility

Five switches. Each change is saved immediately (`PUT /api/v1/admin/settings` with group `home`) and the toast says, for example, *"Slider hidden."*

| Switch | Setting key | Effect |
|---|---|---|
| **All Categories** | `home.show_all_categories` | Returned in `sections_visibility` |
| **Slider** | `home.show_slider` | Off: `/home` returns no sliders, so the app shows its fallback banner |
| **Popular Categories** | `home.show_popular_categories` | Returned in `sections_visibility` |
| **Featured Section** | `home.show_featured_section` | Off: `/home` returns no feature sections, so the app and the website home show no sections |
| **All Advertisement** | `home.show_all_advertisement` | Returned in `sections_visibility` |

All switches are on by default.

### Popular Categories

*Search and select a category to add to the popular list*: pick a category (main or sub) and click **Add**. The table lists **Sequence**, **Image**, **Name**, **Type** (*Main Category* or *Sub Category*) and a remove button. Drag rows to reorder. The list is saved as `home.popular_categories` (an array of category ids).

:::note What the bundled clients read
The app and the website use `sliders`, `categories` and `featured_sections` from `/home`. The `popular_categories` list and the **All Categories**, **Popular Categories** and **All Advertisement** switches are returned by the API but not yet read by the bundled app or website: the app's **Popular Categories** grid shows the active main categories. Use these values if you extend the clients.
:::

## Common workflows

- **Run a campaign banner**: upload a 1200 × 450 image on **Slider**, link it to the category or ad, drag it to the top. Switch it off when the campaign ends.
- **Hide all home sections temporarily**: switch **Featured Section** off on **Home Screen**.

**Next:** [Feature Sections →](doc:admin/featured-sections)
