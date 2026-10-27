---
title: General, Web & SEO
description: The Settings hub, the System Settings page (company details, app versions, maintenance switches, ad posting rules, tax), Web Settings and the SEO meta entries.
---

## The Settings hub

**Admin → Settings** (sidebar group *SETTINGS*) opens a grid of cards: *"Manage how your platform looks, works, and communicates."* Type in **Search settings** to filter the cards by title or subtitle. The counter shows *"24 settings"*.

![Settings hub](/docs/classiadshub/images/admin-settings.jpg "Admin → Settings")

| Card | Covered in |
|---|---|
| Settings, Web Settings, Seo-Settings | This page |
| Notification Settings, OTP Provider Settings | [Login, OTP & Notification Settings](doc:admin/otp-notifications) |
| Video Ads Settings, Admob, AdSense | [AdMob, AdSense & Video Ads](doc:admin/ad-networks) |
| Watermark Settings, File Manager | [Watermark & File Manager](doc:admin/media-settings) |
| Dummy Data, System Status, Log Viewer | [System Status, Logs & Dummy Data](doc:admin/system-status) |
| About Us, Terms & Conditions, Privacy Policy, Refund Policy, Contact Us | [CMS Pages](doc:admin/pages) |
| Firebase Settings | [Firebase Settings](doc:admin/firebase-settings) |
| Languages, Default Currency Settings | [Languages & Currency](doc:admin/languages) |
| Payment Gateways | [Payment Gateways](doc:admin/payment-gateways) |
| Email Templates | [Email Templates & SMTP](doc:admin/email-templates) |
| Gemini AI | [Gemini AI](doc:admin/ai-settings) |

All settings pages need the **Settings** permission. The card list is defined in `admin/src/lib/settings-config.ts`; the custom pages are in `admin/src/app/(panel)/settings/[section]/section.tsx`.

### How settings are stored

Settings live in Firestore as one document per group: `settings/{group}`, e.g. `settings/general`, `settings/ads`. **Save** sends one `PUT /admin/settings` per group with `{ group, settings, secret }` and shows *"Settings saved."* Each save is logged as `settings.updated`. Numbers left empty are saved as `null` (the code default then applies).

The API reads settings through a 30-second cache. Clients can read all non-secret settings from the public `GET /config`. Fields marked secret (for example API keys) are never returned there.

## System Settings (General)

Card **Settings** → page **System Settings**, *"General platform configuration"*. Three blocks.

![System Settings](/docs/classiadshub/images/admin-settings-general.jpg "Settings → System Settings")

### Company Details

Group `general`.

| Field | Key | Used by |
|---|---|---|
| **Company Name** | `app_name` | Site name in the SEO titles returned by `GET /seo` |
| **Tagline** | `app_tagline` | Default meta description in `GET /seo` |
| **Email** | `support_email` | Stored for clients (`GET /config`) |
| **Contact Number 1** / **Contact Number 2** | `contact_number_1`, `contact_number_2` | Stored for clients |
| **Address** | `address` | Stored for clients |

### More Setting

Group `general`.

| Field | Key | Notes |
|---|---|---|
| **Default Language** | `default_language` | Drop-down of active languages |
| **Android Version** / **IOS Version** | `android_version`, `ios_version` | Latest app version numbers |
| **Play Store Link** / **App Store Link** | `play_store_link`, `app_store_link` | Store URLs |
| **Force Update App** | `force_update` | Toggle |
| **Android Maintenance Mode** / **IOS Maintenance Mode** | `android_maintenance`, `ios_maintenance` | Toggles |
| **Web Maintenance Mode** | `maintenance_mode` | Toggle |

:::warning Stored for the clients to read
The version, force-update and maintenance values are published through `GET /config`, but the shipped website and Flutter app do not read `GET /config`. Turning a maintenance switch on does not block anyone yet. Add the check to the app's startup and to the website layout if you need it. The same applies to the Company Details and the Web Settings below: the website's name, tagline and URL come from its build-time config (see [Website Configuration](doc:web/configuration)).
:::

### Advertisement Settings

Groups `ads` and `commerce`. These are enforced by the API.

| Field | Key | Default | Effect |
|---|---|---|---|
| **Free Ad Listing** | `ads.free_ad_listing` | on | *"Allow posting without a package"*. Off = a package is needed to post |
| **Require admin approval for new ads** | `ads.require_approval` | on | New ads (and edits of live ads) go to `pending` for [moderation](doc:admin/ads). Staff and sellers with **Auto Approve Advertisement** ([Customers](doc:admin/customers#auto-approve-advertisement)) skip it |
| **Require an active package to post** | `ads.require_subscription` | off | Posting needs an active [package](doc:admin/packages) covering the category, with quota left |
| **Ad expiry (days)** | `ads.default_expiry_days` | 30 | `expires_at` for new and renewed ads. The hourly job then sets them to `expired` and notifies the seller |
| **Max images per ad** | `ads.max_images_per_ad` | 10 | Upload limit per ad (each image max 5 MB) |
| **Nearby radius (km)** | `ads.nearby_radius_km` | 25 | Default radius of `GET /ads/nearby` |
| **Tax (%)** | `commerce.tax_percent` | 0 | Added to package and featured-plan prices at checkout |
| **Commission (%)** | `commerce.commission_percent` | — | Stored only. No code uses it |

The default currency for new ads is in [Default Currency Settings](doc:admin/languages#default-currency).

## Web Settings

*"Website appearance and behaviour"*. Group `web`.

![Web Settings](/docs/classiadshub/images/admin-settings-web.jpg "Settings → Web Settings")

| Field | Key |
|---|---|
| **Header colour** / **Footer colour** | `header_color`, `footer_color` (colour picker + hex) |
| **Footer description** | `footer_description` |
| **Google Maps / Places key** | `google_maps_key`: *"Used for address autocomplete on the website"* |
| **Default map latitude** / **Default map longitude** | `default_latitude`, `default_longitude` |
| **Facebook URL**, **Instagram URL**, **X URL**, **Linkedin URL**, **Youtube URL**, **Pinterest URL** | `facebook_url` … `pinterest_url` |

These are published in `GET /config` for the website to use, but the shipped website does not read them: its colours come from its Tailwind theme, its footer text and links are in `web/src/components/layout/footer.tsx`, and it loads no Google Maps script (the **Nearby** page uses the browser's location). See [Website Configuration](doc:web/configuration) for what to change there.

:::note The Maps key is public
Anything in this group is returned by the public `GET /config`. Only put a browser key here that is restricted to your website's domain in Google Cloud.
:::

## Seo-Settings

*"Meta tags per page route (home, search, blog…) or per item"*. Data: the `seo_meta` collection.

![Seo-Settings](/docs/classiadshub/images/admin-settings-seo.jpg "Settings → Seo-Settings")

| Column | Shows |
|---|---|
| **Route** | The route key, or `type #id` for an item entry |
| **Meta title** | Title |
| **Meta description** | First two lines |
| **Action** | Edit, Delete |

**Create SEO entry** fields:

| Field | Notes |
|---|---|
| **Route key** | e.g. `home`. Hint: *"home, search, blog, jobs, packages…"* |
| **Meta title** | Max 191 characters |
| **Meta description** | Max 500 characters |
| **Keywords** | Comma-separated |
| **OG image URL** | Social share image |

The public endpoint `GET /seo?route=home` returns the entry for a route. `GET /seo?type=ad&slug=…` (types `ad`, `category`, `blog`) returns an item entry, falling back to the item's own title and description, then to the `home` entry. Titles are completed with the **Company Name**.

:::note Website metadata
The shipped website sets its page titles and descriptions at build time in Next.js (`web/src/app/layout.tsx` and each page's `metadata`) and does not call `GET /seo` yet. Use these entries if you add dynamic metadata, or edit the static metadata directly. See [SEO & Sitemap](doc:web/seo).
:::

**Next:** [Languages & Currency →](doc:admin/languages)
