---
title: Admin Endpoints
description: Every /admin endpoint the Admin Panel uses, grouped by module, with the permission each one needs, plus the generic CRUD API behind the catalogue, location and content pages.
---

All admin routes live under `/api/v1/admin` (`functions/src/routes/admin/`). Every request needs a Firebase ID token of a user whose `roles` include `super-admin`, `admin` or `staff`. Each route then checks one **module** with `can(module)`: admins pass, staff pass when one of their roles grants it. *Lookup* means staff with one of the listed modules may also **GET** it.

| Module | Sidebar group |
|---|---|
| `dashboard` | Dashboard (every staff member has it) |
| `ads`, `categories`, `custom_fields` | Ads Listing (jobs use `ads`) |
| `content` | Content Management |
| `chat` | Chat Management |
| `packages`, `transactions` | Package Management |
| `sellers` | Seller Management |
| `blogs` | Forms & Blogs |
| `customers`, `roles`, `staff` | Customers & Roles |
| `locations` | Location |
| `reports` | Reports |
| `notifications` | Notification |
| `settings` | Settings, System Status |

## Session and dashboard

| Method | Path | Module | Returns |
|---|---|---|---|
| `GET` | `/admin/ping` | — | `{ admin: true }` |
| `GET` | `/admin/me` | — | `{ user, permissions, modules }`. The panel shows only the modules in `permissions` |
| `GET` | `/admin/dashboard` | `dashboard` | Query `year`. `kpis` (total / featured / active / expired / sold / pending ads, users, customers, subscriptions, active subscriptions, favourites, reviews, categories, `total_revenue`), `revenue.monthly` (subscription and featured-ad revenue per month), `ads_by_status`, `top_categories`, `sold_by_category`, `customer_stats`, `recent_ads`, `most_viewed`, `recent_reports`, `recent_chats`, `top_customers`, `sales_count` |

## Ads and jobs

| Method | Path | Module | Body / query | Effect |
|---|---|---|---|---|
| `GET` | `/admin/ads` | `ads` (lookup: `content`, `notifications`) | `tab` (`active` · `requested` · `admin` · `favorite`), `status`, `featured`, `category_id`, `country_id`, `state_id`, `city_id`, `user_id`, `q`, `page`, `per_page` (≤ 100) | Every ad in every status, newest first, with custom fields |
| `POST` | `/admin/ads/{id}/approve` | `ads` | — | `approved`, sets `approved_at` and `published_at`, notifies the seller, audit log |
| `POST` | `/admin/ads/{id}/reject` | `ads` | `reason` (required, max 255) | `rejected` with `rejection_reason`, notifies the seller |
| `POST` | `/admin/ads/{id}/status` | `ads` | `status` (`pending` · `approved` · `rejected` · `sold` · `expired` · `inactive` · `draft`), `reason` (required for `rejected`) | Any status change |
| `POST` | `/admin/ads/bulk-status` | `ads` | `ids` (array), `status`, `reason` | Same, for many ads. `{ updated }` |
| `POST` | `/admin/ads/{id}/feature` | `ads` | `days` (default 30) | **Toggles** `is_featured` with `featured_until` |
| `DELETE` | `/admin/ads/{id}` | `ads` | — | Deletes the ad, its images and favourites, audit log |
| `GET` | `/admin/jobs` | `ads` | `status`, `page` | Every job listing |
| `POST` | `/admin/jobs/{id}/status` | `ads` | `status` (`draft` · `open` · `closed`) | |
| `DELETE` | `/admin/jobs/{id}` | `ads` | — | |

The panel's **Create Advertisement** page uses the normal `POST /ads` and `PUT /ads/{id}` endpoints ([Ads Endpoints](doc:api/ads)). Ads posted by staff are approved immediately. Editing or deleting **another user's** ad through those endpoints needs the `admin` or `super-admin` role; staff get `403`.

## Customers and staff

| Method | Path | Module | Body / query | Effect |
|---|---|---|---|---|
| `GET` | `/admin/users` | `customers` (lookup: `notifications`) | `role`, `customers=1` (no staff), `status`, `q`, `page`, `per_page` (≤ 100) | Users with `ads_count`, `login_type`, `auto_approve_ads` |
| `GET` | `/admin/users/{id}` | `customers` | — | One user |
| `POST` | `/admin/users/{id}/status` | `customers` | `status` (`active` · `suspended` · `banned`) | Also disables the Firebase Auth user and revokes its sessions when not active. Not allowed on a super-admin |
| `POST` | `/admin/users/{id}/auto-approve` | `customers` | `enabled` (boolean) | Their new ads skip moderation |
| `POST` | `/admin/users/{id}/packages` | `customers` | `package_id` | Grants the package free of charge (a `0` transaction with gateway `admin`, fulfilled at once) |
| `DELETE` | `/admin/users/{id}/packages` | `customers` | — | Cancels the user's active subscriptions |
| `GET` | `/admin/staff` | `staff` | `page` | Users with `staff`, `admin` or `super-admin` |
| `POST` | `/admin/staff` | `staff` | `name`, `email`, `password` (min 8), `role` (a role name, or `admin`), `status` (`active` · `suspended`) | Creates the user (`roles: ["staff", role]` or `["admin"]`) and the Auth login. Only admins may create an admin |
| `PUT` | `/admin/staff/{id}` | `staff` | Same fields, all optional | Updates Firestore and Firebase Auth. Only a super-admin may edit a super-admin |
| `DELETE` | `/admin/staff/{id}` | `staff` | — | Deletes staff-only accounts; accounts that are also customers or sellers just lose the staff roles. Not allowed on a super-admin or on yourself |

## Chat

| Method | Path | Module | Effect |
|---|---|---|---|
| `GET` | `/admin/chat/products` | `chat` | Ads that have conversations, with the number of conversations and the last activity. Query `q` |
| `GET` | `/admin/conversations` | `chat` | Query `ad_id`. Conversations with both participants |
| `GET` | `/admin/conversations/{id}` | `chat` | `{ conversation, messages }`, oldest first |
| `DELETE` | `/admin/conversations/{id}` | `chat` | Deletes the conversation and its messages |

## Seller Management

| Method | Path | Module | Body / query | Effect |
|---|---|---|---|---|
| `GET` | `/admin/reviews` | `sellers` | `type`, `approved`, `reported=1`, `page` | Reviews with reviewer, reviewee and ad |
| `POST` | `/admin/reviews/{id}/approval` | `sellers` | `is_approved` (boolean) | Shows or hides the review, recalculates the rating |
| `POST` | `/admin/reviews/{id}/report` | `sellers` | `decision` (`approved` · `rejected`), `reason` (required to reject) | `approved` hides the review; `rejected` keeps it with `report_rejection_reason` |
| `DELETE` | `/admin/reviews/{id}` | `sellers` | — | Deletes and recalculates the rating |
| `GET` | `/admin/verifications` | `sellers` | `status`, `page` | KYC requests with the user and document URLs |
| `POST` | `/admin/verifications/{id}/approve` | `sellers` | — | Sets `users.is_verified: true`, notifies *You are verified!* |
| `POST` | `/admin/verifications/{id}/reject` | `sellers` | `reason` (required, max 255) | Notifies *Verification rejected* with the reason |

## Reports and notifications

| Method | Path | Module | Body / query | Effect |
|---|---|---|---|---|
| `GET` | `/admin/reports` | `reports` | `status`, `type` (`ad` · `user`), `user_id`, `ad_id`, `page` | Reports with the reporter and the reported ad |
| `POST` | `/admin/reports/{id}/status` | `reports` | `status` (`open` · `reviewing` · `resolved` · `dismissed`) | `resolved` / `dismissed` record who and when |
| `GET` | `/admin/push-notifications` | `notifications` | `page` | Sent broadcasts |
| `POST` | `/admin/push-notifications` | `notifications` | `title` (required, max 191), `body` (required, max 2000), `target` (`all` · `role` · `user` · `selected`), `target_role`, `target_user_id`, `user_ids`, `item_type` (for example `ad`), `item_id`, `image_url` or file `image` | Writes an in-app notification for every recipient and pushes it (`admin.broadcast`). `all` = every active user. An ad item without an image uses the ad's first photo. `{ id, recipients_count }` |
| `DELETE` | `/admin/push-notifications/{id}` | `notifications` | — | Deletes the history row only |

## Packages, subscriptions and transactions

| Method | Path | Module | Body / query | Effect |
|---|---|---|---|---|
| `GET` | `/admin/subscriptions` | `packages` | `status` (`expired` matches active ones past `ends_at`), `user_id`, `page` | Subscriptions with package and user |
| `POST` | `/admin/subscriptions/{id}/cancel` | `packages` | — | `cancelled` |
| `GET` | `/admin/transactions` | `transactions` | `status`, `type` (`subscription` · `featured_ad`), `gateway`, `page` | Transactions with package, ad, invoice, user and `receipt_url` |
| `POST` | `/admin/transactions/{id}/confirm` | `transactions` | — | Fulfils a `pending` transaction (Bank Transfer), audit log |
| `POST` | `/admin/transactions/{id}/reject` | `transactions` | — | `failed`, cancels the pending subscription, notifies *Payment rejected* |
| `POST` | `/admin/transactions/{id}/refund` | `transactions` | — | Only `completed` ones. See [Billing & Payments](doc:api/billing#amounts-tax-and-invoices) |
| `GET` | `/admin/payment-gateways` | `settings` (lookup: `transactions`) | — | Every gateway row |
| `PUT` | `/admin/payment-gateways/{id}` | `settings` | `name`, `is_active`, `mode` (`sandbox` · `live`), `config` (object), `supported_currencies`, `is_manual`, `sort_order` | Updates the row. There is no create endpoint |

## Settings and system

| Method | Path | Module | Body / query | Effect |
|---|---|---|---|---|
| `GET` | `/admin/settings` | `settings` (`content` for `group=home`) | `group` | One group, or every group including secret values |
| `PUT` | `/admin/settings` | `settings` (`content` for `home`) | `group` (required), `settings` (required object), `secret` (array of keys to hide from `/config`) | Merges the keys into `settings/{group}`, records `_types` and `_secret`, audit log |
| `GET` | `/admin/translations/{locale}` | `settings` | — | The locale's strings |
| `PUT` | `/admin/translations/{locale}` | `settings` | `strings` (object) | Replaces them |
| `GET` | `/admin/files` | `settings` | `prefix` | Storage folders and files (≤ 500). Private folders have no URL |
| `DELETE` | `/admin/files` | `settings` | `path` | Deletes one Storage object, audit log |
| `GET` | `/admin/system-status` | `settings` | — | Firestore, Storage and Auth checks, document counts, Node version, region, project |
| `GET` | `/admin/audit-logs` | `settings` | `page` | The last 500 audit entries with the user |
| `POST` | `/admin/ai/generate` | `blogs` | `prompt` (required, max 2000), `type` (`title` · `description` · `blog`) | Gemini text when `ai.provider = gemini` and a key is set; otherwise a draft template. `422` when disabled |
| `POST` | `/admin/dummy-data/remove` | admin / super-admin only | — | Deletes every ad with `is_demo: true`. `{ removed }` |

## Blog posts

| Method | Path | Module | Body |
|---|---|---|---|
| `GET` | `/admin/blog` | `blogs` | Query `status`, `blog_category_id`, `q`, `page` |
| `GET` | `/admin/blog/{id}` | `blogs` | — |
| `POST` | `/admin/blog` | `blogs` | Multipart: `title` (required), `slug`, `body` (required, HTML), `excerpt` (max 500, else the first 200 characters of the body), `blog_category_id`, `status` (`draft` · `published`), `tags` (array or comma list), `meta_title`, `meta_description`, `meta_keywords`, `schema`, `translations`, file `cover_image` |
| `PUT` | `/admin/blog/{id}` | `blogs` | Same fields, all optional. Publishing for the first time sets `published_at` |
| `DELETE` | `/admin/blog/{id}` | `blogs` | Deletes the post and its cover image |

## Generic CRUD

Most catalogue, location and content pages use one generic API (`routes/admin/crud.ts`):

| Method | Path | Effect |
|---|---|---|
| `GET` | `/admin/crud/{resource}` | List. Query `q` (search), the resource's filters, `is_active`, `page`, `per_page` (≤ 500) or `all=1` |
| `GET` | `/admin/crud/{resource}/{id}` | One row |
| `POST` | `/admin/crud/{resource}` | Create (JSON or multipart). `is_active` defaults to `true`. A slug is generated where the resource has one |
| `PUT` | `/admin/crud/{resource}/{id}` | Update (every field optional). A new file replaces and deletes the old one |
| `DELETE` | `/admin/crud/{resource}/{id}` | Delete the row and its files. A category with subcategories or ads can't be deleted |
| `POST` | `/admin/crud/{resource}/reorder` | `{ ids: [3, 1, 2] }` → `sort_order` 0…n |
| `POST` | `/admin/crud/{resource}/bulk` | `{ ids, action: "activate" \| "deactivate" \| "delete" }` |

| Resource | Module (lookup) | Key fields | Files |
|---|---|---|---|
| `categories` | `categories` (`ads`, `content`, `chat`, `packages`, `custom_fields`) | `name`, `slug`, `parent_id` (no cycles), `type`, `description`, `sort_order`, `is_active`, `translations` | `icon`, `image` |
| `custom_fields` | `custom_fields` | `name`, `code` (auto from name), `type`, `min_length`, `max_length`, `is_required`, `is_filterable`, `options`, `category_ids` | `icon` |
| `countries` · `states` · `cities` · `areas` | `locations` | `name`; `iso2`, `iso3`, `phone_code`, `currency_code`; `country_id`, `state_id`, `city_id`; `latitude`, `longitude` | — |
| `currencies` | `locations` | `code` (3 letters, unique), `name`, `symbol`, `symbol_position`, `country`, `decimal_digits`, `is_default` | — |
| `languages` | `settings` | `name`, `code` (unique), `is_rtl`, `is_default`, `flag_path` | — |
| `sliders` | `content` | `title`, `link_type` (`none` · `ad` · `category` · `external`), `ad_id`, `category_id`, `external_url`, location ids | `image` |
| `featured_sections` | `content` | `title`, `filter_type`, `category_ids`, `style`, `item_limit` (1–50) | — |
| `tips` | `content` | `description` | — |
| `banner_ads` | `content` | `platform` (`web` · `app`), `page`, `layout` (`single` · `dual`), `ad_type` (`category` · `advertisement` · `external`), `placement`, `category_id`, `ad_id`, `external_url`. Filter the page with `banner_page` | `images` (several) |
| `chat_templates` | `chat` | `name`, `category_ids`, `messages`, `replies` | — |
| `packages` | `packages` (`customers`) | `name`, `type`, `price`, `discount_percent` (→ `final_price`), `currency_code`, `duration_days`, `ad_limit`, `is_unlimited`, `key_points`, `status`, `category_ids`, `ios_product_id`, `android_product_id` | `icon` |
| `featured_ad_plans` | `packages` | `name`, `description`, `price`, `currency_code`, `duration_days` | — |
| `verification_fields` | `sellers` | `name`, `type`, `min_length`, `max_length`, `values`, `is_required` | — |
| `blog_categories` · `faqs` | `blogs` | `name`, `slug` · `question`, `answer` | — |
| `report_reasons` | `reports` | `reason` | — |
| `user_queries` | `customers` | Read-only (contact-form messages) | — |
| `roles` | `roles` (`staff`) | `name` (unique), `permissions` (module ids) | — |
| `pages` · `seo_meta` · `email_templates` | `settings` | `key`, `title`, `body` · `route_key`, `seoable_type`, `seoable_id`, `title`, `description`, `keywords`, `og_image`, `json_ld` · `code`, `subject`, `body_html`, `variables` | — |

Prices in `packages` and `featured_ad_plans` are sent in major units and stored in minor units.

**Next:** [Data Model (Firestore) →](doc:api/data-model)
