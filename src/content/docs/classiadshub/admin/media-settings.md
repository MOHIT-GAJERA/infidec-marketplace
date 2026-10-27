---
title: Watermark & File Manager
description: The Watermark Settings values, and the File Manager that browses and deletes files in Firebase Storage, including the private folders for KYC documents, receipts and résumés.
---

Two settings pages deal with uploaded media: **Watermark Settings** and **File Manager** (cards in **Admin → Settings**).

## How uploads are stored

All uploads go through the API (`functions/src/lib/media.ts`); clients never write to Storage directly (`storage.rules` has `allow write: if false`). Each file gets a random name: `{folder}/{uuid}.{ext}`. Images must be JPEG, PNG, WebP, GIF or SVG and at most 5 MB.

| Folder | Holds | Access |
|---|---|---|
| `ads/` | Ad photos | Public |
| `sliders/`, `banners/`, `categories/`, `custom-fields/`, `packages/` | Admin content images | Public |
| `avatars/` | Profile photos | Public |
| `blog/` | Blog covers | Public |
| `brand/` | Branding, push notification images (`brand/notifications/`) | Public |
| `kyc/` | Seller verification documents | **Private** |
| `receipts/` | Bank-transfer receipts | **Private** |
| `resumes/` | Job application résumés | **Private** |

Public files are served at `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media` with a one-year cache. Private files are only reachable through a tokenised URL that the API gives to the owner and to admins.

## Watermark Settings

*"Image watermark configuration"*. Group `media`.

![Watermark Settings](/docs/classiadshub/images/admin-settings-watermark.jpg "Settings → Watermark Settings")

| Field | Key | Values |
|---|---|---|
| **Enable watermark** | `watermark_enabled` | on / off |
| **Watermark text** | `watermark_text` | e.g. *yourcompany.com* |
| **Position** | `watermark_position` | `bottom-right`, `bottom-left`, `top-right`, `top-left`, `center` |
| **Opacity (%)** | `watermark_opacity` | 0–100 |

**Save** writes `settings/media` (*"Settings saved."*).

:::warning Not applied yet
The upload code stores images as they are; it does not read these settings. Turning the watermark on changes nothing in the shipped version. To watermark ad photos, add an image step (for example with the `sharp` package) before `storeFile()` in `functions/src/lib/media.ts`, applied to the `ads` folder, and read the four settings with `setting("media", …)`. Existing photos are not changed.
:::

## File Manager

*"Storage and file management"*. The page title is **File Manager** and the subtitle names the Storage bucket.

![File Manager](/docs/classiadshub/images/admin-settings-file-manager.jpg "Settings → File Manager")

- The breadcrumb starts at **storage**. Click a folder tile to open it; click a breadcrumb part to go back up.
- Folders are listed first, then files (up to 500 per folder, `GET /admin/files?prefix=…`).
- Image files show a thumbnail. Other files show a file icon. Files in `kyc/`, `receipts/` and `resumes/` show a **lock** icon and no preview, because the API does not create public URLs for them.
- Each tile shows the file name and size in KB.
- *"This folder is empty."* when there is nothing to show.

### Delete a file

Hover a file and click the red trash icon. Confirm *"Delete {path}? Anything referencing it will show a broken image."* The file is removed from Storage (`DELETE /admin/files?path=…`) and the deletion is logged as `file.deleted`.

:::danger Deleting is permanent
The File Manager does not know which ad, slider or user uses a file. Deleting a file that is still referenced breaks that image everywhere. Delete content (an ad, a slider, a blog post) from its own page instead; that removes its files for you.
:::

Normal deletes already clean up: replacing or deleting a slider, banner, category, package icon and similar records deletes the old file, and deleting an ad deletes its photos.

**Next:** [Gemini AI →](doc:admin/ai-settings)
