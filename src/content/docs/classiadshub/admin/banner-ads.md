---
title: Banner Ads
description: Create single or dual image banners for a page of the website or the app, link them to a category, an ad or an external URL, and filter and switch them on or off.
---

**Admin → Content Management → Banner Ads** manages your own (house) banner advertisements: image banners you place on a page of the website or the app, linking to a category, an ad or an outside URL. Banners live in the Firestore collection `banner_ads`; images are stored in Storage under `banners/`.

![Banner ads](/docs/classiadshub/images/admin-banner-ads.jpg "Admin → Content Management → Banner Ads")

Staff need the **content** permission. Third-party ad networks (AdMob, AdSense) are configured separately, see [AdMob, AdSense & Video Ads](doc:admin/ad-networks).

## The list

Four filters above the table, each with *All*:

| Filter | Options |
|---|---|
| **Platform** | *Website*, *App* |
| **Page** | *Homepage*, *Ads Details Page*, *Category Page*, *Search Results* |
| **Layout** | *Single*, *Dual* |
| **Ad Type** | *Category*, *Advertisement*, *External Link* |

| Column | Shows |
|---|---|
| **Banner Image** | One image (single) or two (dual) |
| **Platform** | *Website* or *App* |
| **Page** | Target page |
| **Layout** | *Single* or *Dual* |
| **Ad Type** | What the banner links to |
| **Active** | Toggle |
| **Action** | **Edit**, **Delete** (*"Delete this banner?"*; images are deleted from Storage) |

## Create a banner

Click **Create Banner Ad**. The wizard **Create Banner Ads** has four steps; **Continue** is enabled when the step is complete, **Back** returns.

:::steps
### Platform and Select Page
**Select Platform**: *Website* or *App* (required). **Page**: *Homepage*, *Ads Details Page*, *Category Page* or *Search Results*.

### Banner Layout
*Single banner* or *Dual banner (side by side)*.

### Upload Banner
Upload one image for single or two for dual. *Recommended 1200 × 300 (single) or 600 × 300 (dual)*. JPG, PNG, WebP, GIF or SVG up to 5 MB each.

### Banner Placement
**Ad Type**: *Category* (pick a category), *Advertisement* (pick an approved ad) or *External Link* (enter a URL). **Placement**: free text, *e.g. top, middle, bottom*. Click **Create** (or **Update**).
:::

The API is `POST` / `PUT /api/v1/admin/crud/banner_ads` (multipart, images as `images[]`). New banners are active. When you upload new images while editing, the old images are replaced and deleted.

## Stored values

| Field | Values |
|---|---|
| `platform` | `web`, `app` |
| `page` | `home`, `ad_details`, `category`, `search` |
| `layout` | `single`, `dual` |
| `ad_type` | `category`, `advertisement`, `external` |
| `category_id` / `ad_id` / `external_url` | The link target for the chosen type |
| `placement` | Your free-text slot name |
| `image_paths` | Storage paths of the images |
| `sort_order` | Order within the list |

## Where banners are served

Active banners are public, filtered by platform and page:

```http title="Example"
GET /api/v1/banner-ads?platform=app&page=home
```

Each item returns `layout`, `placement`, `ad_type`, `category_id`, `ad_id`, `external_url` and the full `image_urls`.

:::note Not rendered by the bundled clients yet
The website and the Flutter app in this package do not call `/banner-ads` yet. The app home has an empty `AdBannerPlaceholder` widget (`mobile/lib/shared/widgets/ad_banner.dart`) between the categories and the ad list, a natural place to add it. To show your banners, read this endpoint in the page you want and render the images with their link. See [Catalogue & Content Endpoints](doc:api/catalog).
:::

**Next:** [Blogs & FAQs →](doc:admin/blogs)
