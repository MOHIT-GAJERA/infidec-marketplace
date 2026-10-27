---
title: Data Model (Firestore)
description: Every Cloud Firestore collection ClassiAds-Hub uses, with its document id, key fields and status values, plus the counters that keep numeric ids.
---

ClassiAds-Hub keeps all data in **Cloud Firestore** (database `(default)`), one collection per table of the earlier MySQL version. The collection names are defined once, in the `C` map of `functions/src/lib/store.ts`. Only the API writes them (with the Admin SDK). Field names below are exactly what is stored.

`docs/DATABASE_SCHEMA.md` in the repository describes the earlier MySQL schema. Most field names carry over, but the Firestore code is the reference.

## Conventions

| Topic | How it is stored |
|---|---|
| Document id | A **numeric id** as a string (`ads/42`), also stored as the field `id` (number). Exceptions are listed per collection |
| New ids | `counters/{collection}.value`, increased in a transaction by `nextId()`. Never edit a counter downwards |
| Timestamps | `created_at`, `updated_at` on every row (Firestore `Timestamp`), plus status times (`approved_at`, `paid_at`…) |
| Money | Integers in **minor units** with a `currency_code` |
| Files | A Storage path (`ads/42/<uuid>.jpg`) for public folders, a full tokenised URL for private ones (`kyc/`, `receipts/`, `resumes/`) |
| Relations | Numeric ids (`user_id`, `category_id`…). Small child lists live inside the parent (ad `images`, custom-field `options`) |
| Translations | `translations: { "<locale>": { "<field>": "…" } }` on catalogue rows |

## People and access

| Collection | Key fields |
|---|---|
| `users` | `name`, `email`, `phone`, `auth_uid` (Google / Apple uid, else the uid is the id), `avatar_path`, `address`, `status` (`active` · `suspended` · `banned`), `roles[]` (`super-admin` · `admin` · `staff` · custom role · `seller` · `customer`), `is_verified` (badge), `email_verified_at`, `phone_verified_at`, `login_type` (`email` · `phone` · `google` · `apple`), `auto_approve_ads`, `preferred_language`, `preferred_currency`, `last_login_at`, `seller_profile { display_name, bio, business_name, website, rating_avg, rating_count, member_since }`, `deleted_at` |
| `roles` | `name` (unique), `permissions[]` (module ids, see [Admin Endpoints](doc:api/admin)) |
| `user_devices` | Id: the last 200 characters of the base64url FCM token. `user_id`, `fcm_token`, `platform` (`android` · `ios` · `web`), `device_name`, `last_active_at` |
| `otp_verifications` | Auto id. `identifier`, `channel` (`sms` · `email`), `provider`, `purpose` (`register` · `login` · `reset` · `verify`), `code_hash` (SHA-256), `attempts`, `expires_at`, `consumed_at` |
| `verification_fields` | `name`, `type`, `min_length`, `max_length`, `values`, `is_required`, `is_active`, `sort_order` |
| `verification_requests` | `user_id`, `document_type` (`id_card` · `passport` · `driving_license` · `other`), `document_number`, `front_image_path`, `back_image_path`, `selfie_image_path`, `fields {name: value}`, `status` (`pending` · `approved` · `rejected`), `rejection_reason`, `reviewed_by`, `reviewed_at` |

## Catalogue

| Collection | Key fields |
|---|---|
| `categories` | `name`, `slug` (unique), `parent_id` (null for roots), `type`, `description`, `icon_path`, `image_path`, `sort_order`, `is_active`, `ads_count`, `translations` |
| `custom_fields` | `name`, `code` (key used in ads and filters), `type` (`number` · `textbox` · `textarea` · `dropdown` · `radio` · `checkbox` · `fileinput` · `date`), `min_length`, `max_length`, `is_required`, `is_filterable`, `is_active`, `sort_order`, `icon_path`, `options [{ id, label, value, sort_order }]`, `category_ids[]`, `categories [{ category_id, is_required, sort_order }]`, `translations` |

## Ads

| Collection | Key fields |
|---|---|
| `ads` | `user_id`, `category_id`, `parent_category_id`, `title`, `slug` (unique), `description`, `price` (minor units or null), `currency_code`, `price_type` (`fixed` · `negotiable` · `free` · `contact`), `condition` (`new` · `used` · `refurbished`), `phone`, `video_url`, `country_id`, `state_id`, `city_id`, `area_id`, `address`, `latitude`, `longitude`, `status` (`draft` · `pending` · `approved` · `rejected` · `sold` · `expired` · `inactive`), `rejection_reason`, `is_featured`, `featured_until`, `views_count`, `favorites_count`, `approved_at`, `published_at`, `expires_at`, `sold_at`, `buyer_id`, `images [{ id, path, is_primary, sort_order }]`, `custom_field_values { "<fieldId>": value or [values] }`, `keywords[]` (search words), `is_demo` |
| `favorites` | Id `{userId}_{adId}`. `user_id`, `ad_id` |
| `saved_searches` | `user_id`, `name`, `query` (the listing filters), `notify`, `last_run_at` |
| `ad_sales` | Id = the ad id. `ad_id`, `seller_id`, `buyer_id`, `confirmed_at` |

## Chat and social

| Collection | Key fields |
|---|---|
| `conversations` | `key` (`{adId}_{buyerId}`), `ad_id`, `buyer_id`, `seller_id`, `participant_uids[]` (Firebase uids, used by the rules), `last_message`, `last_message_at`, `buyer_unread`, `seller_unread` |
| `messages` | `conversation_id`, `sender_id`, `body`, `type` (`text` · `offer` · `system`), `offer_id`, `attachment_path`, `participant_uids[]`, `read_at` |
| `offers` | `ad_id`, `conversation_id`, `buyer_id`, `seller_id`, `parent_offer_id`, `amount` (minor units), `currency_code`, `status` (`pending` · `accepted` · `rejected` · `countered` · `withdrawn`), `message`, `countered_by` |
| `follows` | Id `{followerId}_{followingId}`. `follower_id`, `following_id` |
| `reviews` | `key` (`{reviewer}_{reviewee}_{ad or 0}`), `reviewer_id`, `reviewee_id`, `ad_id`, `rating` (1–5), `comment`, `type` (`seller_review` · `buyer_review`), `is_approved`, `report_status` (`reported` · `approved` · `rejected`), `report_reason`, `reported_at`, `report_rejection_reason` |
| `reports` | `key`, `reporter_id`, `reportable_type` (`ad` · `user`), `reportable_id`, `reason`, `details`, `status` (`open` · `reviewing` · `resolved` · `dismissed`), `resolved_by`, `resolved_at` |
| `report_reasons` | `reason`, `is_active`, `sort_order` |
| `notifications` | Id = a UUID. `uuid`, `user_id`, `type`, `data { type, title, body, …ids }`, `read_at` |
| `push_notifications` | `title`, `body`, `target` (`all` · `role` · `user` · `selected`), `target_role`, `target_user_id`, `target_user_ids`, `item_type`, `item_id`, `image_url`, `sent_by`, `recipients_count` |
| `chat_templates` | `name`, `category_ids[]`, `messages[]`, `replies[]`, `is_active` |

## Billing

| Collection | Key fields |
|---|---|
| `packages` | `name`, `description`, `type` (`ad_listing` · `featured_ads`), `price`, `discount_percent`, `final_price`, `currency_code`, `duration_days`, `ad_limit`, `is_unlimited`, `key_points[]`, `category_ids[]`, `icon_path`, `status` (`active` · `inactive` · `discontinued`), `is_active`, `sort_order`, `ios_product_id`, `android_product_id` |
| `featured_ad_plans` | `name`, `description`, `price`, `currency_code`, `duration_days`, `is_active`, `sort_order` |
| `payment_gateways` | `code` (`sandbox` · `bank_transfer` · `stripe` · `razorpay` · `paypal` · …), `name`, `is_active`, `mode` (`sandbox` · `live`), `is_manual`, `config` (Bank Transfer: `instructions`, `bank_details`), `supported_currencies`, `sort_order` |
| `transactions` | `user_id`, `type` (`subscription` · `featured_ad`), `package_id`, `ad_id`, `featured_ad_plan_id`, `gateway`, `gateway_reference`, `amount`, `tax_amount`, `total`, `currency_code`, `status` (`pending` · `completed` · `failed` · `refunded`), `paid_at`, `receipt_path`, `payment_status` (`under_review` after a receipt upload) |
| `subscriptions` | `user_id`, `package_id`, `transaction_id`, `status` (`pending` · `active` · `expired` · `cancelled`), `starts_at`, `ends_at`, `ad_limit`, `is_unlimited`, `ads_used` |
| `invoices` | `transaction_id`, `user_id`, `number` (`INV-YYYYMMDD-000123`), `subtotal`, `tax_amount`, `total`, `currency_code`, `status` (`paid` · `refunded`), `issued_at` |

## Content

| Collection | Key fields |
|---|---|
| `sliders` | `title`, `image_path`, `link_type` (`none` · `ad` · `category` · `external`), `ad_id`, `category_id`, `external_url`, `country_id`, `state_id`, `city_id`, `sort_order`, `is_active` |
| `featured_sections` | `title`, `slug`, `filter_type`, `category_id`, `category_ids[]`, `style`, `item_limit`, `sort_order`, `is_active` |
| `banner_ads` | `platform` (`web` · `app`), `page`, `layout` (`single` · `dual`), `ad_type` (`category` · `advertisement` · `external`), `placement`, `category_id`, `ad_id`, `external_url`, `image_paths[]`, `sort_order`, `is_active` |
| `tips` | `description`, `sort_order`, `is_active` |
| `blog_categories` | `name`, `slug`, `sort_order`, `is_active` |
| `blog_posts` | `title`, `slug`, `body` (HTML), `excerpt`, `blog_category_id`, `status` (`draft` · `published`), `published_at`, `tags[]`, `meta_title`, `meta_description`, `meta_keywords`, `schema`, `cover_image_path`, `author_id`, `views_count`, `useful_count`, `not_useful_count` |
| `pages` | `key` (`about` · `terms` · `privacy` · `refund` · `contact`…), `title`, `body` (HTML), `is_published` |
| `seo_meta` | `route_key` or `seoable_type` + `seoable_id`, `title`, `description`, `keywords`, `og_image`, `json_ld` |
| `faqs` | `question`, `answer`, `sort_order`, `is_active` |
| `email_templates` | `code`, `subject`, `body_html`, `variables`, `is_active` (stored; no e-mail is sent in v1.0.0) |
| `user_queries` | `name`, `email`, `subject`, `message` (from `POST /contact`) |

## Jobs

| Collection | Key fields |
|---|---|
| `job_listings` | `user_id`, `title`, `slug`, `description`, `company_name`, `category_id`, `city_id`, `employment_type`, `salary_min`, `salary_max` (minor units), `currency_code`, `status` (`draft` · `open` · `closed`), `expires_at`, `applications_count` |
| `job_applications` | `job_listing_id`, `user_id`, `cover_letter`, `resume_path`, `status` (`submitted` · `reviewed` · `shortlisted` · `rejected` · `hired`) |

## Reference data and system

| Collection | Key fields |
|---|---|
| `countries` | `name`, `iso2`, `iso3`, `phone_code`, `currency_code`, `flag_path`, `is_active` |
| `states` | `country_id`, `name`, `code`, `is_active` |
| `cities` | `country_id`, `state_id`, `name`, `latitude`, `longitude`, `is_active` |
| `areas` | `country_id`, `state_id`, `city_id`, `name`, `latitude`, `longitude`, `is_active` |
| `currencies` | `code`, `name`, `symbol`, `symbol_position`, `country`, `decimal_digits`, `is_default`, `is_active`, `sort_order` |
| `languages` | `code`, `name`, `is_rtl`, `is_default`, `flag_path`, `is_active`, `sort_order` |
| `translations` | Id = the locale (`en`, `ar`…). `locale`, `strings { key: text }` |
| `settings` | Id = the group (`general`, `ads`, `commerce`, `web`, `notifications`, `firebase`, `otp`, `media`, `video_ads`, `admob`, `adsense`, `ai`, `home`…). One field per setting, plus `_types { key: type }` and `_secret [keys hidden from /config]` |
| `audit_logs` | Auto id. `user_id`, `action` (`ad.approved`, `settings.updated`, `transaction.confirmed`…), `subject_type`, `subject_id`, `meta` |
| `counters` | Id = a collection name. `value` = the last id issued |

## Composite indexes

`firebase/firestore.indexes.json` defines the four composite indexes the queries need:

| Collection | Fields | Used by |
|---|---|---|
| `ads` | `status` ↑, `expires_at` ↑ | `housekeeping`: expire approved ads |
| `ads` | `is_featured` ↑, `featured_until` ↑ | `housekeeping`: end featured periods |
| `subscriptions` | `status` ↑, `ends_at` ↑ | `housekeeping`: expire subscriptions |
| `messages` | `conversation_id` ↑, `participant_uids` (array-contains), `id` ↑ | Client realtime listeners on a chat thread |

**Next:** [Security Rules & Storage →](doc:api/security-rules)
