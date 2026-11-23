---
title: Website & Branding
description: Brand colour and themes, store preferences, the website builder tabs, embedding the booking page on WordPress, Shopify, Squarespace or any site, and cross-sell recommendations.
---

This page covers the Online Store sections that shape how the store looks and where it appears: **Preferences**, **Website**, **Website integration** and **Cross-sell**. Each section has its own **Save** button, and saving mirrors the public values to `publicStores/<slug>` ([Online Store Overview](doc:store/overview)).

## Preferences

**Online store → Preferences** (`/online-store/preferences`, saved as `settings.store`). A live store preview sits next to the form.

![Store preferences](/docs/booqora/images/platform-store-preferences.webp "Store status, brand colour, availability, lead time, accounts, cart and price options")

### Status and branding

| Setting | Notes |
|---|---|
| **Enable online bookings** | Same switch as on the Booking page. Off = offline page |
| **Brand colour** | Ten swatches or a hex value (default `#6431DD`). Used for buttons, links, the hero banner and the announcement bar in the store, the header of emails, the Razorpay checkout colour and the colour of printed documents |
| **Checkout background** | White, Light grey or Brand tint |
| **Show "Powered by Booqora" link** | Footer link preference |

### Store behaviour

| Setting | Options |
|---|---|
| **Availability** | *Enable availability* (customers only see and book available products) or *Disable availability* (you confirm manually). With it enabled: *Show availability calendar*, *Hide available quantities* |
| **Prevent last-minute bookings** | *Require a minimum lead time* in hours (default 24) |
| **Customer accounts** | *Enable customer accounts*, then **Optional** (guests can check out) or **Required** |
| **After "Add to cart"** | **Add to cart** (stay on the page) or **Go to checkout** (open the cart right away) |
| **Coupons** | *Enable coupon codes in checkout* |
| **Product sorting** | Relevance, Name, Price |
| **Show prices** | Off = quote-only store: prices are hidden and "Price on request" is shown |
| **Display prices as** | Charge period (e.g. ₹500 / day) or Base price |

:::warning Which preferences the store applies today
The public store currently applies **Enable online bookings**, **Brand colour**, **After "Add to cart"** and **Show prices**. The other preferences (availability checks and calendar, hidden quantities, lead time, customer accounts, coupons, sorting, price display, checkout background and the Powered-by switch) are saved with the workspace but not yet read by `lib/features/storefront/`. The store always sorts products by name and always shows the "Powered by Booqora" footer link.
:::

## Website

**Online store → Website** (`/online-store/website`) has five tabs.

![Website builder](/docs/booqora/images/platform-store-website.webp "Theme gallery filtered by industry")

### Themes

Eight themes, filterable by industry. **Apply theme** sets the store's brand colour and remembers the theme as *Active*.

| Theme | Industry | Brand colour |
|---|---|---|
| Bliss | Event | `#C2417C` |
| Radical | AV & Camera | `#1F2937` |
| Daredevil | Bikes | `#DC2626` |
| Construct | Tools | `#D97706` |
| Explore | Outdoor | `#15803D` |
| Romance | Weddings | `#BE7C8F` |
| Utility | Vehicles | `#2563EB` |
| Moment | Photo booths | `#6431DD` |

### Pages, Menus, Blog posts, URL redirects

| Tab | Fields | Collection |
|---|---|---|
| Pages | Title, URL slug, Content, Published | `pages` |
| Menus | Menu name, items (label + URL, e.g. `/about`) | `menus` |
| Blog posts | Title, Body, Status (Draft, Published, Scheduled) and *Publish at* for scheduled posts | `blogPosts` |
| URL redirects | Redirect from (`/old-page`), Redirect to (`/new-page` or `https://…`) | `redirects` |

:::note Content is stored, not yet rendered
Pages, menus, blog posts and redirects are saved in the workspace, but the public store at `/s/<slug>` does not render them in the current code. Only the theme's brand colour takes effect. For a full marketing site, use the [Marketing Website](doc:web/overview) or your own site with the embed below.
:::

## Website integration

**Online store → Website integration** (`/online-store/integration`) gives you two snippets built from your store URL:

```html title="Embed code"
<iframe src="https://<your-platform-domain>/s/<slug>" style="width:100%;height:900px;border:0" title="Book online"></iframe>
```

```html title="Book now button"
<a href="https://<your-platform-domain>/s/<slug>" target="_blank" rel="noopener"
   style="display:inline-block;padding:12px 22px;background:#6431DD;color:#fff;border-radius:10px;font-family:sans-serif;font-weight:600;text-decoration:none">Book now</a>
```

The button uses your brand colour. Step-by-step instructions are shown for each platform:

| Platform | Steps |
|---|---|
| WordPress | Edit the page, add a **Custom HTML** block and paste the embed code. Put the button in your header or menu with a Custom HTML widget. Update and test |
| Shopify | Online Store → Pages, create a page such as "Rent", click **Show HTML** (`<>`) and paste. Add the page under Online Store → Navigation |
| Squarespace | Add a **Code** block, paste the embed code and turn off **Display source**. Use another Code block for the button |
| Custom website | Paste the embed code where the booking page should appear |

:::tip Payments inside an iframe
Stripe and PayPal redirect the whole page. If you embed the store, test a payment end to end, or link to the store with the button instead.
:::

## Cross-sell

**Online store → Cross-sell** (`/online-store/cross-sell`, saved as `settings.crossSell`):

| Setting | Default |
|---|---|
| Show cross-sell on product pages | Off |
| Section title | Recommended products |
| Subtitle | e.g. "Customers often rent these together" |
| Layout | List or Carousel |
| Only show available products, up to *N* | 4 (1 to 12) |

Choose the recommended products for each product on its **Cross-sell** tab under Inventory ([Products](doc:admin/products)). The store shows up to *N* of them on the product page.

**Next:** [Checkout & Fulfillment →](doc:store/checkout)
