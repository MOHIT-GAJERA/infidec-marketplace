---
title: Ads Endpoints
description: Listing, filtering, sorting and nearby search, ad details, posting and editing ads with custom fields and images, sold and renew, favourites and saved searches.
---

The ad routes live in `functions/src/routes/ads.ts`. Public listings only show **published** ads: `status == "approved"` and not past `expires_at`.

## Ad statuses

| Status | Meaning | Set by |
|---|---|---|
| `draft` | Saved, not submitted | Owner (`status: "draft"`) |
| `pending` | Waiting for moderation | `POST /ads` or an edit when *Require admin approval for new ads* is on |
| `approved` | Live (until `expires_at`) | Admin, or automatically when approval is off, the seller has *auto-approve*, or the poster is staff |
| `rejected` | Refused, with `rejection_reason` | Admin |
| `sold` | Sold (`sold_at`, optional `buyer_id`) | Owner, admin, or *confirm buyer* |
| `expired` | Past `expires_at` | The hourly `housekeeping` job |
| `inactive` | Hidden by an admin | Admin |

## Listing and search

| Method | Path | Auth | Query | Returns |
|---|---|---|---|---|
| `GET` | `/ads` | Optional | See the filter table · `sort` · `page` · `per_page` (≤ 50) | Published ads, paginated |
| `GET` | `/ads/nearby` | Optional | `latitude` (required, −90…90), `longitude` (required, −180…180), `radius` in km (1–500, default *Nearby radius (km)*, 25) | Ads with coordinates inside the radius, nearest first, each with `distance_km` |
| `GET` | `/ads/{slug}` | Optional | — | One ad with `custom_fields` and the category's field list. Accepts the slug or the numeric id. Adds 1 to `views_count` for approved ads. Unapproved ads are visible only to the owner and staff (`404` for others) |
| `GET` | `/ads/{slug}/related` | Public | — | Up to 10 published ads in the same category, newest first |

| Filter | Meaning |
|---|---|
| `q` | Every word must appear in the title or the description |
| `category_id` or `category_slug` | The category **and all its subcategories** |
| `country_id`, `state_id`, `city_id`, `area_id`, `user_id` | Exact match |
| `price_min`, `price_max` | In major units (`price_min=500`) |
| `condition` | `new` · `used` · `refurbished` |
| `featured` | `1` = featured ads only |
| `cf[<code>]` | A custom-field value, for example `cf[fuel_type]=diesel`. For checkbox fields the ad matches when it contains the value |

| `sort` | Order |
|---|---|
| *(default)* | Featured first, then newest |
| `price_asc`, `price_desc` | By price |
| `oldest` | Oldest first |
| `most_viewed`, `most_liked` | By `views_count` / `favorites_count` |

## The ad object

```json title="data (GET /ads/{slug})"
{
  "id": 42, "title": "Toyota Corolla 2019", "slug": "toyota-corolla-2019-k3x9qa",
  "description": "Single owner, full service history.",
  "price": 1250000, "price_display": "USD 12,500.00", "currency_code": "USD",
  "price_type": "negotiable", "condition": "used", "phone": "+15550100", "video_url": null,
  "status": "approved", "is_featured": true, "views_count": 311, "favorites_count": 9, "is_favorited": false,
  "location": { "address": "Main Street 5", "latitude": 40.71, "longitude": -74.0, "city": "New York", "state": "New York", "country": "United States", "country_id": 1, "state_id": 3, "city_id": 7, "area_id": null },
  "category": { "id": 5, "parent_id": 1, "name": "Cars", "slug": "cars", "custom_fields": [{ "id": 2, "name": "Fuel type", "code": "fuel_type", "type": "dropdown" }] },
  "seller": { "id": 12, "name": "Asha Mehta", "email": null, "phone": null, "is_verified": true, "seller_profile": { "rating_avg": 4.5, "rating_count": 2 } },
  "images": [{ "id": 1, "url": "https://firebasestorage.googleapis.com/…", "is_primary": true, "sort_order": 0 }],
  "custom_fields": [{ "custom_field_id": 2, "code": "fuel_type", "name": "Fuel type", "type": "dropdown", "value": "petrol" }],
  "rejection_reason": null,
  "published_at": "2026-10-20T08:00:00.000Z", "expires_at": "2026-11-19T08:00:00.000Z", "created_at": "2026-10-20T07:55:00.000Z"
}
```

`is_favorited` appears only when a token is sent. The seller object never contains e-mail or phone; the ad's own `phone` is what the seller chose to show.

## Posting and managing ads

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| `GET` | `/my/ads` | Signed in | Query `status`, `page`, `per_page` | Your ads in every status, newest first |
| `POST` | `/ads` | Signed in | JSON or multipart, see the field table; files `images[]` | `201` *Ad submitted for approval.* or *Ad created.* |
| `PUT` | `/ads/{id}` | Owner or admin | Any field of the table (`sometimes`); files `images[]` are added | *Ad updated.* |
| `DELETE` | `/ads/{id}` | Owner or admin | — | Deletes the ad, its images in Storage and its favourites. *Ad deleted.* |
| `POST` | `/ads/{id}/sold` | Owner or admin | — | `status: sold`. *Marked as sold.* |
| `POST` | `/ads/{id}/renew` | Owner or admin | — | New `expires_at` (+ *Ad expiry (days)*), `pending` or `approved` again. *Ad renewed.* |
| `POST` | `/ads/{id}/images` | Owner or admin | Multipart `images[]` (required) | `201` the new images `{ id, url, is_primary, sort_order }` |
| `POST` | `/ads/{id}/images/{imageId}/primary` | Owner or admin | — | *Primary image set.* |
| `DELETE` | `/ads/{id}/images/{imageId}` | Owner or admin | — | Deletes the file. If it was primary, the next image becomes primary |

| Field | Rule |
|---|---|
| `category_id` | Required, integer, must exist |
| `title` | Required, 3–191 characters |
| `description` | Required, at least 10 characters |
| `price` | Number 0–999,999,999 in major units (stored ×100) |
| `currency_code` | 3 letters (default `settings/general.default_currency`, else `USD`) |
| `price_type` | `fixed` (default) · `negotiable` · `free` · `contact` |
| `condition` | `new` · `used` · `refurbished` |
| `phone` | Max 32 |
| `video_url` | `http(s)://` URL, max 255 |
| `country_id`, `state_id`, `city_id`, `area_id` | Integers. Country, state and city must exist |
| `address` | Max 255 |
| `latitude`, `longitude` | −90…90, −180…180 |
| `custom_fields` | Object keyed by field **code**: `{ "fuel_type": "petrol", "features": ["abs", "airbags"] }` (JSON string in multipart) |
| `status` | `draft` or `pending` |

### What happens on `POST /ads`

1. The input and the references are validated. Custom fields are checked against the category's fields (including the parent's): required fields, allowed options for dropdown / radio / checkbox, numbers, min and max length. Errors use the key `custom_fields.<code>`.
2. If posting needs a package (*Require an active package to post* on, or *Free Ad Listing* off), the user needs an active subscription that covers the category and has quota left. Otherwise `422` *An active subscription with remaining quota is required to post in this category.*
3. The status is `draft`, `pending` or `approved` (see the status table). `expires_at` is set to now + *Ad expiry (days)* (default 30). The slug is the title plus six random characters.
4. One ad is counted against the subscription quota (`ads_used`), except for drafts. The category's `ads_count` goes up by one.
5. Images in the same request are stored under `ads/{id}/`. The first one is primary. At most *Max images per ad* (default 10).
6. A user without the `seller` role gets it, with `seller_profile.member_since`.

Editing an approved ad sends it back to `pending` when approval is required and the editor is neither staff nor auto-approved. Changing the category re-validates the custom fields.

## Favourites and saved searches

| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| `GET` | `/favorites` | Signed in | `page`, `per_page` | Your favourite ads, newest first |
| `POST` | `/ads/{id}/favorite` | Signed in | — | **Toggles**: `{ ad_id, favorited }`. Keeps `favorites_count` in step |
| `GET` | `/saved-searches` | Signed in | — | Your saved searches |
| `POST` | `/saved-searches` | Signed in | `name` (max 150), `query` (required object of the listing filters, for example `{ "q": "corolla", "category_id": 5, "sort": "price_asc" }`), `notify` (boolean) | `201` the saved search |
| `DELETE` | `/saved-searches/{id}` | Owner | — | *Saved search removed.* |
| `POST` | `/saved-searches/{id}/run` | Owner | — | Up to 50 matching published ads; updates `last_run_at` |

`notify` is stored, but v1.0.0 has no job that alerts users about new matches.

**Next:** [Chat, Offers & Social Endpoints →](doc:api/social)
