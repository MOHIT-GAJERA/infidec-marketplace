---
title: The Booking Flow
description: What a customer sees in the Online Store, from choosing rental dates and adding products to the cart to sending a booking request, and what Booqora does with the request afterwards.
---

This page follows a customer through the Online Store at `/s/<workspace-slug>` and then shows what lands in the Rental Platform. The code is in `lib/features/storefront/` (`storefront_page.dart`, `storefront_cart.dart`, `storefront_data.dart`).

## 1. The store home

![Store home](/docs/booqora/images/store-home.webp "Header with logo, search and cart; hero with the date pickers; collection chips and the product grid")

- **Header**: your logo (or a monogram of the name), the store name, a **Search products** box and the **Cart** button with a count.
- **Announcement bar**, if you set one.
- **Hero**: the hero title (default "Rent from <name>") and subtitle in your brand colour, with two date-and-time pickers: **Rent from** and **Rent until**. Dates before today cannot be picked. If the return is not after the pickup, the hero shows "The return date must be after the pickup date."
- **Collections**: chips to filter products by collection, next to the item count.
- **Product cards**: image, name, short excerpt and the price for the chosen period.
- **Footer**: contact details, © year and name, and "Powered by Booqora".

The browser tab shows the SEO title ([SEO & Sharing](doc:store/seo)). The default period is tomorrow 09:00 to the day after at 09:00.

## 2. Prices

Prices are worked out in the browser with the same engine as the back office (`Pricing.unitPrice` in `lib/data/pricing.dart`), based on each product's pricing method and the chosen period:

| Product setup | Label |
|---|---|
| Flat price per hour, day, week or month | e.g. `₹500 / day`, multiplied by the number of periods |
| Fixed price, sale item or service | One price |
| Pricing structure | `From ₹…` |
| Charging off | `Free` |
| Store has **Show prices** off | "Price on request" |

See [Pricing & Deposits](doc:admin/pricing).

## 3. The product page

Clicking a product opens `/s/<slug>/p/<product-id>`:

![Product page](/docs/booqora/images/store-product.webp "Images, price for the period, deposit, quantity and Add to cart")

- Images, name and price for the selected period.
- "Refundable security deposit ₹…" when the product has a deposit and prices are shown.
- A quantity stepper and **Add to cart · ₹…**.
- **Description** and, if cross-sell is on, the recommended products ([Website & Branding](doc:store/website#cross-sell)).
- **All products** to go back.

After **Add to cart**, the store either shows "<product> added to cart" with a **View cart** link, or opens the cart straight away, depending on the *After "Add to cart"* preference.

## 4. The cart

The cart slides in from the right:

- The **Rental period**.
- Each product with image, name, "₹… each", a quantity stepper, the line total and a delete button.
- **Subtotal**, **Security deposit** (if any) and "Taxes calculated at confirmation". In a quote-only store: "Pricing will be confirmed with your booking."
- The **Checkout** button.

The cart and dates are saved in the browser's `localStorage` (key `booqora_cart_<slug>`), so they survive a page reload. Saved dates in the past are ignored.

## 5. Request booking

**Checkout** opens the **Request booking** dialog: details, pickup or delivery, notes and the terms checkbox ([Checkout & Fulfillment](doc:store/checkout)). Submitting it:

:::steps
### Signs the visitor in anonymously
If nobody is signed in, the store calls Firebase Anonymous Authentication. **Anonymous sign-in must be enabled** in your Firebase project, or requests fail.

### Creates the order
A document is added to `workspaces/<id>/orders` with `source: 'online'`, `status: 'draft'`, `number: null`, `paymentStatus: 'payment_due'`, the customer's name, email and phone, the fulfillment and address, `startsAt` / `stopsAt`, the product lines (unit price, periods, total), `subtotal` and `total` (tax 0), the `deposit` and the note.

### Shows the success screen
"Booking request received. Thanks <first name>! We'll confirm by email at <email>." with the period, the method, the items and **Continue browsing**. The cart is emptied.

### Offers payment
If the checkout has a payment mode and a provider is available, a **Pay now** card appears under the summary ([Online Store Payments](doc:store/payments)). Customers can also pay later.
:::

:::warning No availability check in the store
The current store does not check stock or overlapping bookings when a request is sent, whatever the *Availability* preference says. That is why orders arrive as **requests**: your team checks availability in the platform before reserving ([Availability](doc:admin/availability)).
:::

## 6. Emails

The new order triggers the `onOnlineOrder` Cloud Function:

| To | Subject | Sent when |
|---|---|---|
| Customer | "We received your booking request — <store>" | The order has a valid customer email and **Online order confirmation** is on in Settings → Emails |
| Store | "New online booking from <customer>" | Settings → General has a valid email |

Both list the items, the rental period in your time zone and the total. See [Email & SMTP](doc:admin/email-smtp).

## 7. In the Rental Platform

The request shows in **Orders** as a draft without an order number (Bora calls it a "request"). Open it, check availability, adjust prices, taxes or delivery, then reserve it. Follow the workflow in [Orders](doc:admin/orders).

**Next:** [Online Store Payments →](doc:store/payments)
