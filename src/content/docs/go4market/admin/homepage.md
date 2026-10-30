---
title: "Homepage: Sliders, Offers & Popups"
description: Design the website and app home screens per module with home sliders, offer banners, featured product sections and scheduled popups.
---

The home screen of the website and the Customer app is **dynamic**: everything below the search bar comes from Firestore and is managed under **Admin → Marketing**. Every item can be limited to one module, so the Grocery, Food, Pharmacy and Shopping tabs each get their own home.

![Customer app home](/docs/go4market/images/app-customer-home-offers.webp "Home: categories, offer cards and a Bestsellers section, all managed in Marketing")

## Home sliders

**Marketing → Home sliders** (`/marketing/sliders`), stored in `sliders`:

| Field | Notes |
|---|---|
| Banner image | 1600 × 640 recommended |
| Title, Subtitle, Button text | Text over the image |
| Link | Where the slide leads (see *Link formats* below) |
| Module | Show only on that module's home, or on all |
| Background colour, Order, Active | Appearance and order |

## Offer banners

**Marketing → Offer banners** (`/marketing/offers`), stored in `offers`: image (1200 × 500), title, link, module, **position** (`home_top`, `home_mid`, `category`), order, and a **schedule** (`startAt`, `endAt`). Offers outside their dates are hidden automatically.

## Featured sections

**Marketing → Featured sections** (`/marketing/featured`), stored in `featuredSections`. Each section is a titled row of products:

| Products from (`type`) | What appears |
|---|---|
| `manual` | Products you pick with the product picker |
| `category` | Products from one category |
| `bestsellers` | Highest `soldCount` |
| `newest` | Most recently added |
| `top_rated` | Highest rating |
| `deals` | Biggest MRP discount |

Layout style: `carousel`, `grid` or `banner_left` (with a side banner image). Set a background colour and an order.

## Popups

**Marketing → Popups** (`/marketing/popups`), stored in `popups`: image, title, link, **Show on** (`web`, `app` or `both`) and a schedule. The demo popup offers ₹50 off the first order.

![Website home with popup, in Arabic](/docs/go4market/images/web-home-ar.webp "The website home in Arabic (RTL) with the welcome popup")

## Link formats

Links are relative routes that work on both the website and the app:

| Link | Opens |
|---|---|
| `/m/grocery` | A module home |
| `/c/<category-slug>` | A category |
| `/p/<product-slug>` | A product |
| `/store/<seller-slug>` | A seller's store page |
| `/search?q=milk` | Search results |
| `/page/<slug>`, `/blog/<slug>` | Content pages |
| `https://…` | An external page (opens in a browser) |

:::tip Module home pages
Content without a module appears on the combined home. To make each module tab feel distinct, give each module at least one slider and two featured sections.
:::

**Next:** [Blogs, FAQs & Pages →](doc:admin/content-pages)
