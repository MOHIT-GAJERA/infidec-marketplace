---
title: Onboarding & Home
description: The first-run flow of the app (splash, onboarding slides, location prompt) and every section of the Home screen, with the Admin Panel content that feeds it.
---

![Onboarding](/docs/classiadshub/images/app-onboarding.webp "Onboarding")
![Home](/docs/classiadshub/images/app-home.webp "Home")

## First-run flow

The router (`lib/core/router/app_router.dart`) starts at `/splash` and redirects:

:::steps
### Splash
`/splash` shows the app icon on white while the Firebase session is restored. Nothing else happens here.

### Onboarding (first launch only)
Until the user finishes or skips the slides, every route redirects to `/onboarding`. The flag `onboarding_seen` is stored on the phone.

### Login or guest
After onboarding the user lands on `/login`. **Skip** on the login screen continues as a guest.

### Location prompt (first login only)
When a signed-in user reaches Home for the first time, the router opens `/location` (**What's your location?**).

### Home
`/home`, the first tab of the bottom bar.
:::

## Onboarding

Three slides with an image, a title and a text: **Snap & List**, **Discover Nearby**, **Chat & Close Deals** (texts and images: [App Name, Logo & Splash](doc:app/branding#onboarding-slides)).

| Element | Behaviour |
|---|---|
| Language pill (top left) | Menu with English, العربية, हिन्दी, Español. It is a visual selector only; it does not translate the app |
| **Skip** (top right) | Marks onboarding as seen and opens the login screen |
| Round arrow button (bottom) | Next slide; on the last slide it shows a check mark and finishes onboarding |

## Location prompt

| Button | Result |
|---|---|
| **Find My Location** | Asks for location permission, reverse-geocodes the position and saves *"City, Country"* as the location label |
| **Other Location** | Skips detection |

Both mark the prompt as answered so it never shows again. The label is only stored on the phone. Details: [Google Maps & Location](doc:app/maps-location#location-prompt).

## Bottom navigation

`lib/features/shell/app_shell.dart` wraps the four main tabs:

| Item | Route | Login needed |
|---|---|---|
| **Home** | `/home` | No |
| **Chat** | `/chat` | Yes |
| **+** (centre button) | `/post-ad` | Yes |
| **My Ads** | `/myads` | Yes |
| **Profile** | `/profile` | Yes |

Guests who tap a protected tab are sent to the login screen and come back after signing in.

## Home screen

Home loads everything with one call, `GET /home`, which returns `sliders`, `categories` and `featured_sections`. Pull down to refresh. If the call fails, the screen shows sample data ([API Configuration](doc:app/api-configuration#sample-data-fallback)).

From top to bottom:

| Section | What it shows | Managed in |
|---|---|---|
| Location card | The saved location label (or **Add Location** / *Tap to set your delivery location*). Subtitle *Tap to see ads near you*. Tapping opens **Nearby Ads** | The phone (location prompt) |
| Notification bell | Badge with the unread count from `GET /notifications/unread-count` (signed-in users only, `99+` above 99). Opens **Notifications** | — |
| Search bar | *Search any advertisement…*. Opens the search screen | — |
| Category chips | Horizontal list of root categories. Tap → category page | **Ads Listing → Categories** |
| Hero slider | Slider images with their title. A slider with link type `ad` opens that ad; link type `category` opens that category; `none` does nothing. When there are no sliders, a fixed **Buy & Sell — Anything in One Click** banner is shown | [Sliders & Home Screen](doc:admin/home-content) |
| **Popular Categories** | Grid of categories with icons, **View all** opens the full category list | **Categories** |
| Banner slot | `AdBannerPlaceholder`, currently renders nothing (see below) | — |
| **All Advertisements** | One horizontal row per feature section, with the section title and its ads. Sections without ads are hidden. If no section has ads: an empty notice | [Feature Sections](doc:admin/featured-sections) |

Each ad card shows the primary image, a **★ Featured** tag for featured ads, `price_display`, title, city and age (for example `3d ago`), and opens the ad detail screen.

:::note No ad network in the app
`lib/shared/widgets/ad_banner.dart` is a placeholder for an AdMob banner. It renders nothing, and the app has no `google_mobile_ads` dependency. The AdMob settings in the Admin Panel ([AdMob, AdSense & Video Ads](doc:admin/ad-networks)) are therefore not used by this app until you add the SDK and replace the placeholder with a `BannerAd`.
:::

## Other content screens

These are reachable from the Profile menu ([Profile, Verification & Account Deletion](doc:app/profile)):

| Screen | Route | API |
|---|---|---|
| Jobs list and job detail with **Apply Now** | `/jobs`, `/jobs/:slug` | `GET /jobs`, `GET /jobs/:slug`, `POST /jobs/:id/apply` (optional cover letter) |
| Blog list and article | `/blog`, `/blog/:slug` | `GET /blog`, `GET /blog/:slug` |
| CMS pages (FAQs, Contact us, About us, Terms, Privacy, Refund) | `/page/:key` | `GET /pages/:key` |

The page bodies are the HTML you write in the Admin Panel ([CMS Pages](doc:admin/pages), [Blogs & FAQs](doc:admin/blogs)).

**Next:** [Search, Categories & Nearby →](doc:app/search)
