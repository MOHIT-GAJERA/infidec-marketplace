---
title: Posting & Managing Ads
description: The Post an Ad form with category custom fields, location and images, plus editing, boosting, marking sold, renewing and deleting ads from My Ads.
---

## Post an Ad

The amber **Ad Listing** button in the header and **+ Post a new Ad** in the dashboard open `/post-ad`. Visitors who are not signed in are sent to `/login?next=/post-ad`.

![Post an Ad](/docs/classiadshub/images/web-post-ad.jpg "Post an Ad — numbered sections on one page")

The form is a single page with numbered sections. Everything is sent when the user presses **Publish Ad**.

### 1. Category

One drop-down with the full category tree from `GET /categories/tree`. Sub-categories are indented with `—`. Choosing a category loads its custom fields from `GET /categories/<id>/custom-fields` and clears any values entered for a previous category.

### 2. Details

| Field | Required | Rules (server) |
|---|---|---|
| **Title** | Yes | 3–191 characters |
| **Description** | Yes | At least 10 characters |
| **Price** | No | Number, 0 – 999,999,999, two decimals allowed. Stored in minor units (cents) |
| **Price type** | — | **Fixed** (default), **Negotiable**, **Free**, **Contact for price** |
| **Condition** | No | **—**, **New**, **Used**, **Refurbished** |
| **Phone** | No | Up to 32 characters |

The currency is the platform default (`general.default_currency`, e.g. `USD`).

### 3. Extra Details

Shown only when the category has custom fields (**Admin → Ads Listing → Custom Fields**). Required fields have a `*` after the label.

| Field type | Website input |
|---|---|
| `dropdown`, `radio` | Select with the field's options |
| `textarea` | Multi-line text |
| `number` | Number input |
| `date` | Date picker |
| Any other type (e.g. `text`, `checkbox`) | Single-line text |

The server validates every value (`syncFields` in `functions/src/routes/ads.ts`): required fields, allowed options, numbers, minimum and maximum length. Errors come back as *The Brand field is required.* or *Invalid option for Fuel type.* and show at the top of the form.

### 4. Location

Three linked drop-downs: **Country** (`GET /locations/countries`) → **State** (`/locations/states?country_id=`) → **City** (`/locations/cities?state_id=`). State and City are disabled until the level above is chosen. All are optional. The data comes from **Admin → Location**.

### 5. Images

A file picker (`image/*`, multiple). Hint: *Upload up to 10 photos. The first becomes the cover.* The real limit is the **Max images per ad** setting (default 10).

### What happens on Publish Ad

:::steps
### The ad is created

`POST /ads` with the fields above and `custom_fields` keyed by field code. The server:

- checks the category, country, state and city exist;
- checks the posting quota (see below);
- creates the `ads` document with a unique slug (`title-xxxxxx`), `views_count: 0`, `expires_at` = today + **Ad expiry (days)** (default 30);
- sets the status: `pending` when **Require admin approval for new ads** is on (and the user is not staff or set to auto-approve), otherwise `approved`;
- adds 1 to the category's `ads_count` and gives the user the `seller` role.

### The images are uploaded

If files were chosen, `POST /ads/<id>/images` uploads them to Storage under `ads/<adId>/`. The first image becomes the cover. If the upload fails, the ad already exists, so the website opens its edit page to add photos there instead of creating a duplicate.

### The user lands on My Ads

The new ad shows with the status **pending** or **approved**. Pending ads appear in **Admin → Ads Listing → All Ads** for review ([Ads & Moderation](doc:admin/ads)).
:::

### Posting quota

| Setting (**Settings → General → Advertisement Settings**) | Effect |
|---|---|
| **Free Ad Listing** on and **Require an active package to post** off (default) | Anyone can post |
| **Free Ad Listing** off, or **Require an active package to post** on | The user needs an active subscription that covers the category and has ads left. Otherwise: *An active subscription with remaining quota is required to post in this category.* |

Each posted ad uses one ad from a limited package (`ads_used + 1`). Unlimited packages are not counted. Users buy packages on **Dashboard → Subscriptions** ([Plans, Featured Ads & Checkout](doc:web/checkout)).

## My Ads

**Dashboard → My Ads** (`/dashboard/ads`) lists all the user's ads, newest first, from `GET /my/ads`.

![My Ads](/docs/classiadshub/images/web-my-ads.jpg "Dashboard → My Ads")

Each row shows the cover image, title (links to the ad page), a status badge, **★ Featured** when boosted, price, *N views · N favorites* and the action buttons:

| Status badge | Meaning |
|---|---|
| **approved** (green) | Live |
| **pending** (amber) | Waiting for admin approval |
| **rejected** (red) | Rejected by an admin |
| **sold**, **expired**, **draft** (grey) | Not live |

| Button | Shown when | API | Result |
|---|---|---|---|
| **Edit** | Always | — | Opens `/dashboard/ads/<id>/edit` |
| **★ Boost** | Status `approved` and not featured | — | Opens `/checkout?type=featured&ad_id=<id>` |
| **Mark sold** | Status is not `sold` | `POST /ads/<id>/sold` | Status `sold`, `sold_at` set. Removed from listings |
| **Renew** | Always | `POST /ads/<id>/renew` | New `expires_at` = today + expiry days. Status becomes `pending` if approval is required, otherwise `approved` with a new publish date |
| **Delete** | Always, after *Delete this ad permanently?* | `DELETE /ads/<id>` | Deletes the ad, its images in Storage and all favourites of it, and lowers the category count |

:::tip Renew also brings back sold or expired ads
**Renew** sets the status again (`pending` or `approved`), so it also re-lists an ad that was marked sold or has expired.
:::

## Edit an ad

`/dashboard/ads/<id>/edit` loads the ad with `GET /ads/<id>` (owners can read their own ad in any status).

| Part | Notes |
|---|---|
| Fields | **Title**, **Description**, **Price**, **Price type**, **Condition**, **Phone** |
| **Extra Details** | The category's custom fields with the saved values |
| **Images** | Thumbnails with **Cover** / **Set cover** and **Remove**, plus a file picker to add more |
| Buttons | **Save changes**, **Cancel** |

The category and location cannot be changed on the website edit page.

- **Set cover** → `POST /ads/<id>/images/<imageId>/primary`.
- **Remove** → `DELETE /ads/<id>/images/<imageId>` (deletes the file; if it was the cover, the next image becomes the cover).
- **Save changes** → `PUT /ads/<id>`, then uploads any new images, then returns to My Ads.

:::warning Edits can send a live ad back to review
For an approved ad, the page warns: *Saving changes may send the ad back for review before it is live again.* When approval is required and the user is not staff or auto-approved, saving sets the status back to `pending`.
:::

**Next:** [Accounts & Login →](doc:web/accounts)
