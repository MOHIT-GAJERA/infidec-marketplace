---
title: Ads & Moderation
description: Review, approve, reject, feature, deactivate and delete advertisements, bulk-update their status, open the ad detail view and post ads yourself from the Admin Panel.
---

**Admin → Ads Listing → All Ads** is the moderation desk. It lists every ad in the `ads` collection, newest first, with tabs, filters, bulk status changes and quick toggles. The page title is **Advertisements**.

![All advertisements](/docs/classiadshub/images/admin-ads.jpg "Admin → Ads Listing → All Ads")

Staff need the **ads** permission for this page (see [Roles, Staff & Permissions](doc:admin/roles-permissions)).

## Ad statuses

| Status | Label in the panel | Meaning |
|---|---|---|
| `draft` | Draft | Saved by the seller, not submitted |
| `pending` | Under Review | Waiting for admin approval |
| `approved` | Approved | Live on the website and the app (until it expires) |
| `rejected` | Rejected | Refused by an admin, with a reason the seller can see |
| `sold` | Sold | Marked sold by the seller (or after the seller confirmed a buyer) |
| `expired` | Expired | `expires_at` passed; set by the hourly `housekeeping` job |
| `inactive` | Inactive | Hidden by an admin (for example with the **Active** toggle) |

Only ads that are `approved` **and** not past `expires_at` appear in public listings, search, the home sections and the seller's public page.

### When does a new ad need approval?

When a user posts or edits an ad, the API decides the status:

- **Settings → Settings → Advertisement Settings → Require admin approval for new ads** (`ads.require_approval`, on by default) sends new ads to `pending`.
- A customer with **auto-approve** enabled (set on [Customers & User Queries](doc:admin/customers)) and every staff account skip the review: their ads go live as `approved`.
- Editing an approved ad puts it back to `pending` when approval is required (again except for auto-approve users and staff).
- **Renew** (by the seller) sets a new expiry date and, with approval on, sends the ad back to review.
- The expiry date is **today + Ad expiry (days)** (`ads.default_expiry_days`, default 30).

These settings are described on [General, Web & SEO](doc:admin/settings).

## Tabs

| Tab | Shows |
|---|---|
| **All Advertisements** | Every ad |
| **Active Advertisements** | Status `approved` |
| **Requested Advertisements** | Status `pending`: your review queue |
| **Admin Advertisements** | Ads posted by admin, super-admin or staff accounts |
| **Favorite Ads** | Ads that at least one user saved as a favourite |

## Filters

- **Category**: any category or subcategory.
- **Status**: *Under Review, Approved, Rejected, Sold, Expired, Inactive, Draft*.
- **More Filters** opens **Country** and **Featured** (*Featured only / Not featured*).
- **Reset** clears all filters and the search box.
- The search box (top right of the table) matches words in the title and the description.

Opening the page with `?user_id=<id>` (for example from the Customers page) lists only that user's ads.

## Table

| Column | Shows |
|---|---|
| Checkbox | Select rows for a bulk status change |
| **Name** | Ad title |
| **Description** | First lines of the description |
| **User** | Seller avatar and name |
| **Price** | Price without currency, or *Free* |
| **Category** | Category name |
| **Video Ad** | **Watch** link when the ad has a video URL |
| **Images** | Up to four image thumbnails |
| **Address** | Address, city, state, country |
| **Status** | Status badge |
| **Featured** | Toggle: feature or un-feature the ad |
| **Active** | Toggle: on = `approved`, off = `inactive` |
| **Action** | **View** (eye), **Edit** (pencil), **Delete** (bin) |

The table shows 10 rows per page by default (change it in the footer). The toolbar buttons refresh the list, choose visible columns and **Export CSV** (`advertisements.csv`, current page and visible columns).

### Bulk status change

Tick one or more rows. A bar appears: *"3 selected"*, a **Set status…** drop-down and **Apply**. Choosing **Rejected** asks for a **Reason** first. The call is `POST /api/v1/admin/ads/bulk-status` with the ids, the status and the reason (when you reject in bulk without one, the reason is *Rejected by admin*).

### What each status change does

Every status change goes through the same server function:

| Change | Side effects |
|---|---|
| To `approved` | Sets `approved_at`, and `published_at` if it was never published. The seller gets an **"Ad approved"** notification (*"<title>" is now live.*) when the ad was not approved before |
| To `rejected` | Stores `rejection_reason`. The seller gets **"Ad rejected"** with the reason |
| To `sold` | Sets `sold_at` |
| Any change | An audit log entry `ad.<status>` (visible in **Settings → Log Viewer**) and the public ad cache is cleared |

Notifications are saved in the user's in-app notification list and sent as a push when the user has a registered device (see [Push Notifications](doc:admin/push-notifications)).

### Featured toggle

The **Featured** toggle calls `POST /api/v1/admin/ads/{id}/feature`. Turning it on sets `is_featured = true` and `featured_until` to **30 days** from now. Turning it off clears both. The hourly `housekeeping` job removes the featured flag when `featured_until` passes. No payment is created and the seller is not notified. Paid featuring by sellers is covered in [Featured Ad Plans](doc:admin/featured-plans).

## Ad detail

Click the eye icon to open **Admin → Ads Listing → All Ads → View**.

![Ad detail](/docs/classiadshub/images/admin-ad-detail.jpg "Ad detail with moderation actions")

| Area | Content |
|---|---|
| Header buttons | **Approve** (hidden when already approved), **Reject** (asks *"The seller will see this reason."*), **Make Featured** / **Remove Feature**, **Edit**, **Delete** |
| Gallery | All images with thumbnails, and **Watch video** when there is a video URL |
| **Description** | Full description text |
| **Details** | Custom field values (for example *Brand*, *Year*, *Fuel type*) |
| Price card | Price with currency, price type (*Fixed, Negotiable, Free, Contact*) and condition, status and *Featured* badges, the rejection reason, then **Category, Views, Favorites, Phone, Published, Expires, Created, Ad ID** |
| **Seller** | Name, email or phone, *Verified* badge, **Open in Customers** |
| **Location** | Address, city, state, country and **View on map** (OpenStreetMap) when coordinates exist |

### Delete an ad

**Delete** (list or detail page) asks *"Delete this advertisement permanently?"*. The server deletes the image files from Storage, removes all favourites of the ad, deletes the ad document and lowers the category's ad counter. Reports about the ad stay and show *Removed* in User Reports. There is no undo. To hide an ad temporarily, switch **Active** off instead.

## Create an advertisement

**Create Advertisement** opens **Select Ads Type**:

- **Regular Ad Listing**: *Standard classified advertisement*.
- **Video Ad Listing**: *Create engaging short video advertisements.* (adds the **Video URL** field).

Click **Next**. The form has five tabs.

![Create advertisement](/docs/classiadshub/images/admin-ad-create.jpg "Create Advertisement → Categories")

:::steps
### Categories
Click a category card. Cards with an arrow have subcategories; keep clicking until you reach a category without children. The breadcrumb (**All Category › …**) lets you go back up.

### Listing Details
**Title** and **Description** (required), **Price Type** (*Fixed, Negotiable, Free, Contact*), **Currency** and **Price** (hidden for Free and Contact), **Condition** (*New, Used, Refurbished* or *Not applicable*), **Phone**, **Video URL** (video ads). Below, **Category details** shows the custom fields of the chosen category and its parents (see [Custom Fields](doc:admin/custom-fields)). Required fields are marked.

### Media
**Upload images**: JPG, PNG or WebP, up to 5 MB each. The first image becomes the cover. The limit per ad is **Max images per ad** (`ads.max_images_per_ad`, default 10). When editing, you can delete existing images or click **Set primary**.

### Address
**Country**, **State**, **City**, **Address**, **Latitude** and **Longitude**, or click the map to set the coordinates.

### SEO
**Meta Title**, **Meta Description**, **Meta Keywords**. Click **Publish Advertisement** (or **Update Advertisement**).
:::

The ad is created with the normal posting endpoint `POST /api/v1/ads` under **your** admin account, so it appears in the **Admin Advertisements** tab and you become its seller. New admin ads are approved immediately. SEO values are saved in the `seo_meta` collection (`seoable_type: ad`) and used by the website's page titles (see [SEO & Sitemap](doc:web/seo)).

:::warning Paid posting applies to admins too
When **Require an active package to post** is on, or **Free Ad Listing** is off, the API needs an active subscription with free quota for the category, also for admin accounts. Otherwise saving fails with *"An active subscription with remaining quota is required to post in this category."* Assign yourself a package on the Customers page, or post with these settings off.
:::

:::note Who may edit other users' ads
The **Edit** button sends the change through `PUT /api/v1/ads/{id}`. That endpoint lets the owner or an **admin / super-admin** edit. Staff accounts with a custom role can approve, reject, feature and delete, but get *"You do not have permission"* when they save edits to another user's ad.
:::

## Common workflows

- **Daily review**: open **Requested Advertisements**, open each ad, check images, description and custom fields, then **Approve** or **Reject** with a clear reason.
- **Clean up spam**: filter by the seller (from Customers → their ads), tick all rows, **Set status… → Inactive** or **Rejected**, then suspend the user on the Customers page.
- **Promote an ad for a campaign**: switch **Featured** on. It shows in *Featured Ads* home sections (see [Feature Sections](doc:admin/featured-sections)) for 30 days.

**Next:** [Categories →](doc:admin/categories)
