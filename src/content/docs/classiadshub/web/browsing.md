---
title: Browsing, Search & Nearby
description: The home page, header search, search results with filters and sort, category pages and the Ads near you page — what each shows and which API it calls.
---

Visitors do not need an account to browse. Only approved, unexpired ads (`status: approved`, `expires_at` in the future) appear in any list.

![Home page](/docs/classiadshub/images/web-home.jpg "Home — hero slider and Popular Categories")

## Home page

`/` (`src/app/page.tsx`) loads two requests: `GET /home` and `GET /ads?per_page=8&sort=newest`.

| Block | Content | Source |
|---|---|---|
| **Hero slider** | Two banners, cross-fade every 6 seconds, pause on hover, arrows and dots. Each banner links to `/search` | Fixed images `public/banner1.png`, `banner2.png` |
| **Popular Categories** | Up to 9 root categories as round icons. Click → `/category/<slug>` | `categories` from `/home` |
| **Feature sections** | One block per section that has ads, title from the section, first 4 ads, **View all** → `/search` | `featured_sections` from `/home` (**Content Management → Feature Section**) |
| **All Advertisements** | The 8 newest ads (featured first) and a **Load More** button → `/search` | `/ads` |
| **App banner** | *Experience the Magic of the ClassiAds_Hub App* with store badges | Fixed in code |

If `/home` fails, the page shows *Unable to load listings — Please check your connection and try again.*

### Ad cards

Every list uses the same card (`src/components/ad-card.tsx`): cover image (the image marked primary, else the first), amber **★ Featured** badge for featured ads, price (`price_display`, e.g. `USD 1,099.00`), title, city and the time since publishing (*3h ago*, *5d ago*, or a date after 30 days). The heart in the corner is decorative. Saving to favourites is done on the ad page.

## Header search

The search bar in the header has:

- **All Categories** — a drop-down of root categories with a *Search category…* box.
- **Search any advertisement…** — free text.
- The amber search button.

Submitting opens `/search?q=<text>&category_slug=<slug>`.

## Search results

![Search results](/docs/classiadshub/images/web-search.jpg "Search with the filter sidebar")

`/search` reads all filters from the URL, so every result page can be bookmarked and shared. It calls `GET /ads` with 20 ads per page.

| Filter (sidebar) | URL parameter | Server behaviour |
|---|---|---|
| **Categories** list (*All categories* + root categories) | `category_slug` | Includes all sub-categories of the chosen category |
| **Price range** Min – Max + **Apply** | `price_min`, `price_max` | Major units (e.g. `100`), compared with the stored minor-unit price |
| **Condition** — *Any condition, New, Used, Refurbished* | `condition` | Exact match |
| Header search text | `q` | Every word must appear in the title or description (case-insensitive) |
| — | `city_id` | Passed through if present in the URL. There is no city control in the sidebar |

The heading shows *Results for "phone"* (or *All Listings*) and *N listings found*. Changing a filter resets to page 1.

### Sort

| Option | `sort` value | Order |
|---|---|---|
| **Relevance** | *(none)* | Featured ads first, then newest |
| **Newest** | `newest` | Same as Relevance (featured first, then newest) |
| **Price: Low to High** | `price_asc` | Lowest price first |
| **Price: High to Low** | `price_desc` | Highest price first |
| **Most Viewed** | `most_viewed` | Highest `views_count` first |

The API also accepts `oldest` and `most_liked`, and custom-field filters (`cf[<code>]=<value>`) and `featured=1`. These are not in the website UI but you can link to them.

### Pagination

Links at the bottom: **‹ Prev**, up to five page numbers, **Next ›**. They keep all current filters. The API caps `per_page` at 50.

## Category pages

![Category page](/docs/classiadshub/images/web-category.jpg "Category landing")

`/category/<slug>` calls `GET /categories/<slug>` and `GET /ads?category_slug=<slug>&per_page=20`.

- Breadcrumb **Home / Category name**.
- Category emoji, name and listing count.
- Sub-category chips (when the category has children). Click one to open its own category page.
- Ad grid with pagination. Empty state: *No listings yet — Be the first to post in this category.*
- The browser tab title becomes *<Category> for sale · ClassiAds_Hub*.

The header's second row links to the first 7 root categories, and **Other** opens `/search`.

## Ads near you

![Nearby](/docs/classiadshub/images/web-nearby.jpg "Ads near you — radius chips and Update location")

`/nearby` (header link **Add Location**) asks the browser for the visitor's location, then calls `GET /ads/nearby?latitude=…&longitude=…&radius=…&per_page=40`.

| Control | Behaviour |
|---|---|
| Radius chips **5, 10, 25, 50, 100, 250 km** | Default 25 km. Changing the radius reloads the list |
| **📍 Update location** | Asks the browser for the position again |
| Subtitle | *Within 25 km of your location* once the position is known |

The server measures the straight-line (haversine) distance and sorts nearest first. Messages:

- *Location permission was denied. Allow location access to see ads near you.* — the visitor blocked location.
- *Your browser can't share its location.* — no Geolocation API.
- *Nothing nearby yet — Try a wider radius.*

:::warning Only ads with coordinates appear in Nearby
The nearby search only includes ads that have `latitude` and `longitude`. The website's **Post an Ad** form does not send coordinates (it uses country / state / city drop-downs), so ads posted on the website do not show up here until an admin adds a position in **Admin → Ads Listing → All Ads → edit** (Latitude / Longitude fields and map picker). The API accepts `latitude` and `longitude` on `POST /ads` if you add them to the form. Browsers only share location on HTTPS or `localhost`.
:::

**Next:** [Ad Details & Sellers →](doc:web/ad-detail)
