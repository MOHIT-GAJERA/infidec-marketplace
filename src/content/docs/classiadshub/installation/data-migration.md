---
title: Data Migration (MySQL → Firestore)
description: Optional one-time import from the earlier MySQL (Laravel) version of ClassiAds-Hub into Firestore and Firebase Auth with tools/migrate, which is also the way to load the sample data into a new project.
---

ClassiAds-Hub v1.0.0 runs on Firestore only. `tools/migrate/migrate.js` is a **one-time** import from the earlier MySQL (Laravel) version. Use it if:

- you ran the earlier MySQL version and want to keep its users, ads, chats and payments, **or**
- you want to start from the **sample data**: the package's MySQL dump (`archive/classiads-mysql-2026-10-27.sql`, if included in your download) contains a complete demo marketplace.

If you start from an empty marketplace, skip this page and follow the [Setup Guide](doc:installation/setup-guide).

:::note MySQL is only needed for the import
The script reads MySQL once on your computer and writes to Firebase. Nothing in the running platform uses MySQL. Uninstall it afterwards if you like.
:::

## What the script imports

| Source (MySQL) | Firestore collection / Auth | Notes |
|---|---|---|
| `users` + `model_has_roles` + `seller_profiles` + `social_accounts` | `users`, **Firebase Auth** | Roles become the `roles` array. Passwords are imported as their **bcrypt hashes**, so existing passwords keep working. Phone-only users get the synthetic e-mail `p<digits>@phone.classiadshub.app`. Accounts ending in `@example.com` and soft-deleted users are skipped |
| `countries`, `states`, `cities`, `areas`, `currencies`, `languages` | Same names | Currencies get the country name |
| `categories`, `custom_fields` + `custom_field_options` + `category_custom_field` | `categories`, `custom_fields` | Options and category links are stored inside each field (`options`, `category_ids`, `categories`) |
| `settings` | `settings/{group}` | Typed values (`bool`, `int`, `json`), secret keys listed in `_secret`. Adds the `home` group if missing and sets `general.frontend_url` |
| `translations` | `translations/{locale}` | One document per locale with a `strings` map |
| `ads` + `ad_images` + `ad_custom_field_values` | `ads` | Images and field values are stored inside the ad. Adds `parent_category_id` and search `keywords`. Soft-deleted ads are skipped |
| `favorites`, `saved_searches`, `follows` | Same names | Favourites and follows get composite ids (`{user}_{ad}`, `{follower}_{following}`) |
| `conversations`, `messages`, `offers`, `ad_sales`, `reviews`, `reports` | Same names | Adds `participant_uids` to chats (needed by the security rules) and the `key` fields used for de-duplication |
| `notifications`, `push_notifications`, `user_devices` | Same names | |
| `packages` + `package_category`, `featured_ad_plans`, `payment_gateways`, `transactions`, `subscriptions`, `invoices` | Same names | Packages get `type: "ad_listing"`, `status` and `category_ids` |
| `featured_sections`, `sliders`, `blog_categories`, `blog_posts`, `pages`, `seo_meta`, `faqs`, `email_templates`, `user_queries`, `verification_fields`, `verification_requests`, `job_listings`, `job_applications` | Same names | |
| `audit_logs` | `audit_logs` (ids `mysql_<id>`) | |
| — | `roles`, `tips`, `report_reasons` | Seeded: a `staff` role with *dashboard, ads, chat, sellers, customers, reports, notifications*; four offer tips; seven report reasons |

Every document is written with its **numeric MySQL id**, and `counters/{collection}.value` is set to the highest id, so new records created by the API continue the numbering. The script is **re-runnable**: a second run overwrites the same documents instead of duplicating them.

:::warning Files are not copied
The script copies the database only. Ad photos, avatars, sliders and other uploads keep their stored paths (for example `ads/12/photo.jpg`), and the API builds Storage URLs from those paths. Upload the files from the old `storage/app/public` folder to the root of your bucket with the same paths: `gcloud storage cp -r storage/app/public/* gs://your-project-id.firebasestorage.app/`.
:::

## Run the import

:::steps
### Prepare MySQL
Run a MySQL or MariaDB server on your computer with a database named `classiads`. To load the sample data:

```bash
mysql -u root -e "CREATE DATABASE classiads CHARACTER SET utf8mb4"
mysql -u root classiads < archive/classiads-mysql-2026-10-27.sql
```

### Install the script
```bash
cd tools/migrate
npm install          # firebase-admin + mysql2
```

### Point it at your project
Open `migrate.js` and change:

- `projectId: "classiadshub"` → `your-project-id`
- the MySQL connection (`host: "127.0.0.1", user: "root", password: "", database: "classiads"`) if yours differs
- `settings.general.frontend_url = "https://classiadshub.web.app"` → your website address

### Authenticate
Download a service-account key (Project settings → **Service accounts** → *Generate new private key*) and save it **outside** the repository, or into the git-ignored `secret/` folder.

### Run it
```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/your-project-key.json node migrate.js
```

The script prints one line per collection with the number of documents, the Auth import result (`auth users imported N (failures: M)`) and `Done.`
:::

## After the import

1. **Change the demo logins.** The sample data contains demo accounts, including a super-admin (user id `1`). Reset their passwords in **Authentication → Users**, or replace them as described in [Create the First Admin](doc:installation/super-admin#if-you-imported-the-sample-data).
2. **Clear old gateway credentials.** `payment_gateways.config` is copied as it was. Open **Settings → Payment Gateways → Configure** and remove any old keys. The live keys belong in Secret Manager ([Keys & Environment](doc:installation/environment-configuration)). The import also creates the `sandbox` row: delete that document before you go live ([why](doc:api/billing#sandbox-and-the-public-webhook)).
3. **Check `settings/general.frontend_url`** in the Firestore console.
4. **Optional helper scripts** in `tools/migrate/` (each has the demo project ID at the top; change it first):

| Script | What it does |
|---|---|
| `fix-data.js` | Sets `ads.free_ad_listing` and the notification toggles if missing, uploads `web/public/banner1.png` / `banner2.png` for sliders whose image file is missing, removes literal dotted keys from user documents |
| `renew-demo-ads.js` | Sets every approved or expired ad back to `approved` for 60 days and tags it `is_demo: true`, so **Settings → Dummy Data → Remove demo data** can delete them later |
| `demo-images.js`, `set-images.js`, `pick.js` | Fetch free-licence photos from Wikimedia Commons for the six demo ads and log credits to `docs/IMAGE_CREDITS.md` |
| `auth-config.js` | Enables the Email/Password and Phone providers and adds the demo Hosting domains to Authorized domains. Edit the domains before you use it |

5. **Remove the demo ads before launch** with **Settings → Dummy Data → Remove demo data** (deletes every ad with `is_demo: true`). See [System Status, Logs & Dummy Data](doc:admin/system-status).

:::danger Delete the key afterwards
Delete the service-account file and revoke the key in Project settings → Service accounts → Manage keys when you are done. It grants full access to the project.
:::

**Next:** [Backups & Monitoring →](doc:installation/backups)
