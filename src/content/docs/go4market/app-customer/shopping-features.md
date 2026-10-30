---
title: Shopping Features Tour
description: A screen-by-screen tour of the Customer app, from modules, search and voice search through the single-screen checkout to live tracking, returns, wallet and subscriptions.
---

This page shows what your customers get, and which Admin settings drive each screen.

## Home, modules and search

![Home](/docs/go4market/images/app-customer-home.webp "Home: module tabs, search, banners and categories")
![Offers and bestsellers](/docs/go4market/images/app-customer-home-offers.webp "Offers for you and a Bestsellers section")
![Search results](/docs/go4market/images/app-customer-search.webp "Search with ETA badges, sort and quick add")
![Voice search](/docs/go4market/images/app-customer-voice-search.webp "Shop by voice: say several items at once; recent and trending searches")

- **Module tabs**: Grocery, Food, Pharmacy, Shopping ([Modules](doc:admin/modules)).
- **Smart search** with prefix matching, filters and sorting (relevance, price, top rated, biggest discount).
- **Voice search for several products**: say "milk, bread and 2 eggs". On-device speech-to-text turns it into text, the app splits it into terms and shows one result row per item, with a one-tap "add best match". (The backend also offers `searchProducts` with `multi: true` for the same purpose.)
- **Recently viewed** and **similar products** (same category first, then same module).
- **Grid and list** product views.

## Product and food

![Product](/docs/go4market/images/app-customer-product.webp "Product: variants, stock, delivery estimate and Add to cart")
![Food item](/docs/go4market/images/app-customer-food-product.webp "Food: variants such as Regular or Family pack, add-ons and the restaurant")

Variants, MRP and discount, stock, the delivery estimate, seller with rating, reviews, **Subscribe & never run out**, and the veg/non-veg mark for food. **Add-ons** (extra raita, boiled egg…) change the unit price.

## Single-screen cart and checkout

![Cart](/docs/go4market/images/app-customer-cart.webp "Cart: free-delivery progress, home delivery or self pickup, address and speed")
![Cart with add-ons](/docs/go4market/images/app-customer-cart-addons.webp "Add-ons listed under the item and in the bill")

Everything happens on one screen, refreshed by a single `getCheckoutQuote` call:

- items, quantity, unavailable items with **replacement suggestions**;
- **Home delivery** or **Self pickup**; address;
- speed: **Standard**, **15 min**, **30 min** or **Schedule** (date and slot);
- **coupon**, **Use wallet balance**, membership discount;
- payment method and the bill (item total, delivery, discount, tax, to pay);
- a free-delivery progress bar ("Add ₹147 more for FREE delivery").

## After ordering

![Order placed](/docs/go4market/images/app-customer-order-placed.webp "Order placed, with status, payment, total and arrival time")
![Arrival countdown](/docs/go4market/images/app-customer-countdown.webp "Quick delivery countdown and the delivery OTP")
![Live tracking](/docs/go4market/images/app-customer-tracking.webp "Out for delivery: rider on the OpenStreetMap map, call rider, OTP")
![Delivered](/docs/go4market/images/app-customer-delivered.webp "The full order journey timeline")

- **Arrival countdown** for quick deliveries (from `etaAt`).
- **Live tracking** of the rider and the **delivery OTP** to share at the door.
- After delivery: **rate the product**, **request a return**, **order again**, and get help.

![Rate, return or reorder](/docs/go4market/images/app-customer-order-actions.webp "Rate each product, request a return or order again")

## Account

![Account](/docs/go4market/images/app-customer-account.webp "Orders, wallet, wishlist, addresses, notifications, refer & earn, membership, subscriptions, request a product, theme, language, FAQs")

Orders, **wallet** (top-up and history), wishlist, saved addresses, notification inbox, **Refer & earn**, **Membership**, **Subscriptions** (pause, resume, cancel), **Request a product**, theme (light/dark/system), language (English/Hindi), FAQs and policy pages.

**Next:** [Release Build & Keystore →](doc:app-customer/deployment)
