---
title: Catalogue & Content Endpoints
description: The public read endpoints of ClassiAds-Hub. Health checks, categories and custom fields, locations, app config and translations, the home page, content, CMS pages, blog, SEO, packages, plans and payment gateways.
---

These routes live in `functions/src/routes/catalog.ts`. They are **public** (no token needed), read mostly cached reference data, and only return **active** rows (`is_active` not `false`), sorted by `sort_order` then name unless noted.

## Health

| Method | Path | Returns |
|---|---|---|
| `GET` | `/health` | `{ service: "classiads-api", version: "v1", time }` |
| `GET` | `/health/ready` | `{ status: "ready" \| "degraded", checks: { firestore: { ok }, storage: { ok } } }`. HTTP `503` when Firestore is unreachable |

## Categories and custom fields

| Method | Path | Query | Returns |
|---|---|---|---|
| `GET` | `/categories` | `parent_id` (children of one category) or `roots_only=1` | Flat list of categories |
| `GET` | `/categories/tree` | — | Root categories, each with `children` (one level) |
| `GET` | `/categories/{id}/custom-fields` | — | The custom fields of the category **and of its ancestors**, sorted for that category. `404` *Category not found.* |
| `GET` | `/categories/{slug}` | — | One category with `children` and `custom_fields` |

Each custom field has `id`, `name`, `code`, `type` (`number`, `textbox`, `textarea`, `dropdown`, `radio`, `checkbox`, `fileinput`, `date`), `icon_path`, `is_required` (per category), `is_filterable`, `sort_order` and `options` (`{ id, label, value, sort_order }`). The `code` is the key you use in `custom_fields` when posting an ad and in `cf[code]` when filtering.

## Locations

| Method | Path | Query | Returns |
|---|---|---|---|
| `GET` | `/locations/countries` | — | Countries by name |
| `GET` | `/locations/states` | `country_id` (**required**, `422` otherwise) | States of the country |
| `GET` | `/locations/cities` | `state_id`, `country_id` | Cities |
| `GET` | `/locations/areas` | `city_id` | Areas `{ id, city_id, name, latitude, longitude }` |

## Config and translations

| Method | Path | Returns |
|---|---|---|
| `GET` | `/config` | `{ settings, languages, currencies }`. `settings` holds every `settings/{group}` document **without** `_`-prefixed meta keys and without the keys listed as secret (Twilio token, Gemini key…). The website and the app read their switches from here |
| `GET` | `/languages` | Active languages (`code`, `name`, `is_rtl`, `is_default`…) |
| `GET` | `/currencies` | Active currencies (`code`, `name`, `symbol`, `decimal_digits`, `is_default`) |
| `GET` | `/translations/{locale}` | `{ locale, fallback, translations }`: the strings of the default language merged with the locale's own strings (`translations/{locale}.strings`) |

## Home page

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/home` | Optional | `sliders`, root `categories`, `popular_categories` (from `settings/home.popular_categories`), `featured_sections` with their ads, and `sections_visibility` (`all_categories`, `slider`, `popular_categories`, `featured_section`, `all_advertisement`) from the **Home Screen** settings |
| `GET` | `/sliders` | Public | Active sliders `{ id, image_url, title, link_type, ad_id, ad_slug, category_id, category_slug, external_url, country_id, state_id, city_id }` |
| `GET` | `/featured-sections` | Optional | Each section `{ id, title, slug, filter_type, style, category_id, ads }`. With a token the ads include `is_favorited` |
| `GET` | `/tips` | Public | Offer item tips `{ id, description, sort_order }` |
| `GET` | `/banner-ads` | Public | Query `platform` (`web` · `app`), `page`. Each banner: `platform`, `page`, `layout`, `placement`, `ad_type`, `category_id`, `ad_id`, `external_url`, `image_urls` |

A feature section's `filter_type` decides its ads (from the published ads, `item_limit` default 10):

| `filter_type` | Ads |
|---|---|
| `latest` | Newest first |
| `most_viewed` | By `views_count` |
| `most_liked` | By `favorites_count` |
| `featured` | Featured ads, newest first |
| `category` | Ads in `category_ids` (or their parent category) |
| `price_low_high`, `price_high_low` | By price |

## Lookups and contact

| Method | Path | Body / query | Returns |
|---|---|---|---|
| `GET` | `/faqs` | — | `{ id, question, answer }` |
| `GET` | `/report-reasons` | — | `{ id, reason }` |
| `GET` | `/chat-templates` | `category_id` | Templates for that category (or for all categories) `{ id, name, messages, replies }` |
| `GET` | `/verification-fields` | — | Admin-defined seller verification fields |
| `POST` | `/contact` | `name` (max 150), `email`, `subject` (max 191), `message` (max 5000), all required | `201` *Thanks! We'll get back to you soon.* Stored in `user_queries` (Admin → **User Queries**) |

## Packages, plans and gateways

| Method | Path | Query | Returns |
|---|---|---|---|
| `GET` | `/packages` | `category_id`, `type` (`ad_listing` · `featured_ads`) | Active packages: `price`, `discount_percent`, `final_price`, `price_display`, `currency_code`, `duration_days`, `ad_limit`, `is_unlimited`, `key_points`, `category_ids`, `categories` |
| `GET` | `/packages/{id}` | — | One active package |
| `GET` | `/featured-plans` | — | Featured-ad plans `{ id, name, description, price, price_display, currency_code, duration_days }` |
| `GET` | `/payment-gateways` | — | Active gateways `{ code, name, is_manual, mode }`, plus `instructions` for manual gateways (Bank Transfer) |

## Blog, pages and SEO

| Method | Path | Query / body | Returns |
|---|---|---|---|
| `GET` | `/blog` | `category` (slug), `q` (title search), `full=1` (with body), `page`, `per_page` (default 12) | Published posts (status `published`, `published_at` not in the future), newest first, with category and author |
| `GET` | `/blog/categories` | — | Active blog categories with their post counts |
| `GET` | `/blog/{slug}` | — | One post with the full body. Adds 1 to `views_count` |
| `POST` | `/blog/{id}/feedback` | `useful` (`true` / `1`) | Adds 1 to `useful_count` or `not_useful_count` |
| `GET` | `/pages` | — | Published CMS pages `{ key, title, updated_at }` |
| `GET` | `/pages/{key}` | — | One page (`about`, `terms`, `privacy`, `refund`, `contact`…) |
| `GET` | `/seo` | `route` (for example `home`), or `type` (`ad` · `category` · `blog`) + `slug` | `{ title, description, keywords, og_image, json_ld }` from `seo_meta`, falling back to the item's own title and description, then to `general.app_name` / `app_tagline` |

**Next:** [Ads Endpoints →](doc:api/ads)
