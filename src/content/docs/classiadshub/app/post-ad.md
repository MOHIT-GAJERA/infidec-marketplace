---
title: Post & Manage Ads
description: How sellers post an ad from the app with category custom fields and photos, and manage it in My Ads (edit, mark sold, who bought, renew, delete).
---

![Post an ad](/docs/classiadshub/images/app-post-ad.webp "Post an Ad")
![My Ads](/docs/classiadshub/images/app-my-ads.webp "My Advertisement")

Any signed-in user can post ads. There is no separate seller account: the user who posts is the seller of that ad.

## Post an Ad

The centre **+** button of the bottom bar opens `/post-ad` (**Post an Ad**), file `lib/features/ads/screens/post_ad_screen.dart`. Guests are sent to the login screen first.

### Fields

| Field | Rule | Sent as |
|---|---|---|
| **Category** `*` | Required. One dropdown with all categories; subcategories are indented under their parent. Any level can be chosen | `category_id` |
| **Title** `*` | Required, at least 3 characters | `title` |
| **Description** `*` | Required, at least 10 characters | `description` |
| **Price** | Optional number; commas are removed. *Enter a valid price* on bad input | `price` (normal units; stored in minor units) |
| **Price type** | Fixed (default), Negotiable, Free, Contact | `price_type` |
| **Condition** | —, New, Used, Refurbished | `condition` |
| **Phone** | Optional contact number for this ad | `phone` |
| Custom fields | Loaded for the chosen category (see below) | `custom_fields` (`{ code: value }`) |
| **Location**: Country, State, City | Optional cascading dropdowns: countries from `GET /locations/countries`, states from `GET /locations/states?country_id=…`, cities from `GET /locations/cities?state_id=…` | `country_id`, `state_id`, `city_id` |
| **Photos** | Pick several images from the gallery, up to **10**. Tap × on a thumbnail to remove it | uploaded after the ad is created |

### Category custom fields

When the category changes, the form calls `GET /categories/:id/custom-fields` and adds one input per field you defined in **Custom Fields** for that category ([Custom Fields](doc:admin/custom-fields)):

| Field type | Input in the app |
|---|---|
| `dropdown`, `radio`, `checkbox` | A dropdown with the field's options (one value) |
| `number` | Text field with a numeric keyboard |
| Any other type (`text`, `textarea`, …) | Text field |

Required fields are marked with `*` and show *Required* when empty. The API validates them again against the category and returns the first error if a value is missing or wrong.

:::note Checkbox fields take one value in the app
The app shows checkbox fields as a single-choice dropdown. Sellers who need several values can edit the ad on the website.
:::

### What happens on Publish Ad

:::steps
### Create the ad
`POST /ads` with the fields above. The API checks the category and location references and the custom fields.

### Check the posting quota
If **Settings** require a subscription to post (or free listing is switched off), the user needs an active package with remaining quota for that category. Otherwise the API answers *"An active subscription with remaining quota is required to post in this category."* Packages are bought **on the website**, not in the app ([Plans, Featured Ads & Checkout](doc:web/checkout)).

### Set the status
`pending` when ads require approval (the default) and the user is not set to auto-approve; otherwise `approved` (live). Admins approve ads under **Ads Listing** ([Ads & Moderation](doc:admin/ads)).

### Upload the photos
`POST /ads/:id/images` as multipart `images[]`. The API enforces the **max images per ad** setting (default 10). If only the upload fails, the ad still exists and the app says *Ad posted, but photos failed to upload: …*.

### Done
The app shows *Ad submitted for approval* or *Ad published!* and opens **My Ads**.
:::

:::warning Ads posted in the app have no map pin
The app sends Country / State / City but no `latitude` / `longitude`. These ads show no map on the detail screen and do not appear in **Nearby Ads**, which only lists ads with coordinates.
:::

The app has no draft, video URL, address or area field. Those are available when posting on the website ([Posting & Managing Ads](doc:web/post-ad)).

## My Ads

The **My Ads** tab (`/myads`, title **My Advertisement**) lists the user's own ads from `GET /my/ads`, in every status.

| Filter pill | Shows |
|---|---|
| **All ads** | Everything |
| **Featured** | Ads with `is_featured` |
| **Live** | Status `approved` |

Each row shows the image, title, price and a coloured status chip:

| Status | Meaning |
|---|---|
| `pending` | Waiting for moderation |
| `approved` | Live |
| `rejected` | Rejected by an admin (the seller gets an *Ad rejected* notification with the reason) |
| `sold` | Marked as sold |
| `expired` | Past its expiry date (the hourly `housekeeping` job sends *Ad expired*) |
| `draft` | Saved as draft on the website |

Tap a row to open the public ad page. With no ads: **No Data Found**.

### Row actions

| Action | Shown when | API | Notes |
|---|---|---|---|
| **Edit** | Always | `PUT /ads/:id` | See below |
| **Mark sold** | Status is not `sold` | `POST /ads/:id/sold` | Confirm *Mark "…" as sold?* |
| **Who bought?** | Status is `sold` | `GET /ads/:id/potential-buyers`, `POST /ads/:id/confirm-buyer` | See below |
| **Renew** | Always | `POST /ads/:id/renew` | New expiry = today + **default expiry days** (default 30). Goes back to `pending` when approval is required |
| **Delete** | Always | `DELETE /ads/:id` | Confirm *Delete "…"? This cannot be undone.* |

### Edit an ad

`/ad-edit/:id` (**Edit Ad**) loads the ad with `GET /ads/:id` and lets the owner change **Title**, **Description**, **Price**, **Price type** and **Condition**. **Save changes** sends `PUT /ads/:id`.

If an approved ad is edited while approval is required, it goes back to review: *Ad updated — it is back in review*. Photos, category, custom fields and location cannot be changed in the app; use the website for that.

### Who bought?

After marking an ad as sold, the seller can name the buyer. The **Who bought this?** screen lists every user who chatted about or made an offer on the ad (*Select the buyer who purchased this item. They can then leave you a review.*). **Confirm** calls `POST /ads/:id/confirm-buyer`:

- the sale is recorded (`ad_sales`) and the ad gets `status: sold` and the `buyer_id`;
- the buyer gets *Purchase confirmed — … Leave a review!*;
- the buyer can now review the seller ([Chat, Offers & Reviews](doc:app/chat-offers#write-a-review)).

## Featured ads

Featured ads show a **★ Featured** tag and appear first in search. A seller cannot make an ad featured from the app: featured-ad plans are bought **on the website**. Admins can also feature an ad from the Admin Panel ([Featured Ad Plans](doc:admin/featured-plans)).

**Next:** [Chat, Offers & Reviews →](doc:app/chat-offers)
