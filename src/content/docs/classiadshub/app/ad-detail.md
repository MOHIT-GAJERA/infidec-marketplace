---
title: Ad Details, Favorites & Sharing
description: Everything on the app's ad detail screen (gallery, price, specifications, seller card, map, report) and the favourite, share, chat and make-offer actions, plus the Favorites list and seller profile.
---

![Ad detail](/docs/classiadshub/images/app-ad-detail.webp "Ad detail")
![Seller](/docs/classiadshub/images/app-seller.webp "Seller profile")
![Favorites](/docs/classiadshub/images/app-favorites.webp "Favorites")

Route `/ad/:slug`, file `lib/features/ads/screens/ad_detail_screen.dart`. The screen loads `GET /ads/:slug`; each open increases the ad's `views_count` on the server. Guests can view everything; actions that need an account send them to the login screen and back.

## Screen layout

From top to bottom:

| Part | Content |
|---|---|
| App bar | Back, and **Share** (top right) |
| Image gallery | Swipe through the ad photos with a page indicator. The heart button toggles the favourite. Tap a photo to open the full-screen gallery |
| Title and price | `title` and `price_display` (for example `$1,200`, or the label for *Free* / *Contact* price types) |
| Location and date | *City, Country* and the publish date |
| Specifications | One tile per **custom field** value of the ad (`custom_fields`: name + value). Icons are chosen from the field name (brand, model, year, mileage, fuel, transmission, bedrooms, area …) |
| **About this advertisement** | The description |
| Seller card | Avatar, name, a red **VERIFIED** badge for verified sellers, rating (`New` when there are no ratings) and *N Ratings*. Tap → seller profile |
| **Location** | Google Map with a pin on the ad's coordinates, or the city / *Location not provided* when the ad has none ([Google Maps & Location](doc:app/maps-location)) |
| Report card | *Did you find any problem with this ad?*, the ad **ID #**, and **Report this ad** |
| Bottom bar | **Make an offer** and **Chat** for other people's ads; **Edit ad** on your own ad |

### Full-screen gallery

Route `/gallery`. Pinch to zoom (`InteractiveViewer`), swipe between photos; the title shows `2 / 5`.

## Actions

| Action | Login | API | Result |
|---|---|---|---|
| Favourite (heart) | Yes | `POST /ads/:id/favorite` | Toggles; the API returns `favorited`. The ad appears in **Profile → Favorites** |
| **Share** | No | — | Copies `https://classiadshub.web.app/ad/<slug>` to the clipboard: *Link copied to clipboard*. Change the domain in `_share()` to your website ([App Name, Logo & Splash](doc:app/branding)) |
| **Chat** | Yes | `POST /conversations` with `ad_id` | Opens the existing conversation for this ad and buyer, or creates it, then opens the chat |
| **Make an offer** | Yes | `POST /offers` with `ad_id`, `amount` | See below |
| **Report this ad** | Yes | `POST /reports` with `type=ad`, `id`, `reason`, `details` | See below |
| **Edit ad** (own ad) | Yes | — | Opens the edit screen ([Post & Manage Ads](doc:app/post-ad#edit-an-ad)) |

### Make an offer

A dialog **Make an offer** with one field, **Your offer**, and the helper `Asking: <price>`. Enter the amount in normal currency units (commas are removed); the API stores it in minor units in the ad's currency.

On **Send** the API:

1. creates (or reuses) the conversation for this ad and buyer;
2. saves an offer with status `pending`;
3. posts an offer message into the chat (*"$900 offered"*);
4. notifies the seller (*New offer*, push + in-app).

The app shows *Offer sent!*. The seller accepts or rejects it in the chat ([Chat, Offers & Reviews](doc:app/chat-offers#offers)). You cannot make an offer on your own ad.

### Report this ad

A dialog **Report this ad** with a **Reason** dropdown and an optional details field:

| Reason value | Label |
|---|---|
| `spam` | Spam |
| `scam` | Scam / fraud |
| `prohibited` | Prohibited item |
| `offensive` | Offensive content |
| `other` | Other |

**Submit** creates a report with status `open`. A user can have one open report per ad; reporting the same ad again does not create a duplicate. Admins handle reports under **User Reports** ([Report Reasons & User Reports](doc:admin/reports)).

:::note Report reasons are fixed in the app
The app does not load the report reasons you manage in the Admin Panel. The five reasons above are hard-coded in `_report()` in `ad_detail_screen.dart`. Edit that list if you want other reasons.
:::

## Seller profile

Route `/seller/:id`, file `lib/features/seller/seller_screen.dart`. Opened from the seller card.

| Part | Content / API |
|---|---|
| Header | Avatar (or initial), name, rating or *No reviews yet* |
| **Follow / Following** | `POST /sellers/:id/follow` toggles. Login required. The seller gets a *New follower* notification |
| Stats | **Ads** (`live_ads`), **Followers**, **Following** |
| **Write a review** | Opens the review form ([Chat, Offers & Reviews](doc:app/chat-offers#write-a-review)) |
| **Live Ads** | The seller's approved ads (`GET /sellers/:id/ads`). Empty: *No active listings* |

The profile itself comes from `GET /sellers/:id`.

## Favorites

**Profile → Favorites** (`/favorites`, login required) lists the user's favourite ads from `GET /favorites`. Tap a card to open the ad; remove a favourite with the heart on the ad detail screen.

**Next:** [Post & Manage Ads →](doc:app/post-ad)
