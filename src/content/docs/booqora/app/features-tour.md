---
title: App Features Tour
description: A screen-by-screen tour of the Booqora Mobile App, from the Home dashboard and order editor to inventory, calendar, documents, Online Store settings, reports and Bora.
---

The Mobile App covers the daily work of a rental business: taking bookings, handing items out, taking them back and getting paid. It reads and writes the same Firestore data as the [Rental Platform](doc:admin/overview), so anything done on the phone shows up on the web straight away, and the other way round. Firestore offline persistence is on, so recently viewed data stays available with a poor connection.

## Navigation

The app uses a bottom tab bar with four tabs and a centre **+** button (`lib/widgets/shell.dart`):

| Tab | Route | What it shows |
|---|---|---|
| **Home** | `/home` | Dashboard |
| **Orders** | `/orders` | All orders with tabs and filters |
| **+** | — | Quick-create sheet |
| **Inventory** | `/inventory` | Products, bundles, collections, downtime, stock items |
| **More** | `/more` | Every other module, settings, store link, sign out |

Each tab keeps its own navigation stack (go_router `StatefulShellRoute`). Detail screens such as an order or a product open full screen above the tab bar.

## Home

![Home](/docs/booqora/images/app-home.webp "Home dashboard")
![Quick create](/docs/booqora/images/app-quick-create.webp "The centre + button")
![More](/docs/booqora/images/app-more.webp "More: modules and workspace")

Home shows this month's **Revenue**, **Orders**, **Active rentals** and **Outstanding** balance, a 14-day revenue chart, today's **pickups and returns** with a warning when any are running late, recent orders, top products and recent notes. New workspaces see a welcome card with a Bora prompt, *Add your first product* and a **setup checklist** that links to the guided setup (`/setup`).

The **+** button opens six shortcuts: *New order*, *Add product*, *Add customer*, *Scan barcode*, *New coupon* and *Ask Bora*.

## Orders

![Orders](/docs/booqora/images/app-orders.webp "Orders list")
![Order](/docs/booqora/images/app-order.webp "Order editor")

- Tabs: **All**, **Upcoming**, **Late**, **With shortage**, with totals for orders, items, revenue and amount due.
- Filters for status (`draft`, `reserved`, `started`, `returned`, `archived`, `canceled`), payment status and source (*Manual* or *Online store*). Filtered orders can be exported as CSV.
- Swipe an order right to archive it or left to cancel it (cancelling releases the reserved items).

The **order editor** (`/orders/new`, `/orders/:id`) handles the full rental: pick the customer, set the pickup and return times, add products with live availability and automatic rental pricing, apply coupons, and move the order through reserve → pick up → return. The **Payments** section records manual payments and starts online payments ([Payments in the App](doc:app/payments)). The **Documents** section creates a *Quote*, *Contract*, *Packing slip* or *Invoice* from the order. The pricing and availability rules are the same as on the web ([Orders & Order Flow](doc:admin/orders)).

## Inventory

![Inventory](/docs/booqora/images/app-inventory.webp "Inventory")
![Scan](/docs/booqora/images/app-scan.webp "Barcode scanner")

Five sections: **Products**, **Bundles**, **Collections**, **Downtime** (maintenance and repair periods) and **Stock items** (individually tracked units with identifiers). Product detail shows pricing, stock and live availability. The scan icon opens the [barcode scanner](doc:app/barcode-scanning). Product photos can be taken with the camera or picked from the gallery.

## Calendar

![Calendar](/docs/booqora/images/app-calendar.webp "Calendar agenda")

`/calendar` (from More) has two views, **Agenda** and **Timeline**. The share button exports the orders as an `.ics` file that can be imported into Google Calendar or Apple Calendar.

## Customers, coupons and documents

![Documents](/docs/booqora/images/app-documents.webp "Documents")
![Invoice](/docs/booqora/images/app-invoice.webp "Invoice")

- **Customers**: list, search, create and edit, with order history and balances. Export the list as CSV.
- **Coupons**: create and edit discount codes.
- **Documents**: invoices, quotes, contracts and packing slips. Finalise, sign, request a signature, share as PDF or print ([PDF Documents, Share & Print](doc:app/documents-pdf)).

## Online Store

`/online-store` manages the customer booking page in eight sections: **Booking page**, **Website**, **Website integration**, **Cross-sell**, **Preferences**, **Fulfillment**, **Checkout** and **SEO**. On More, *View online store* opens the live store and *Share store link* sends `https://<platform>/s/<workspace-slug>` through the share sheet. See [Online Store Overview](doc:store/overview).

## Reports

Seven reports, each with a CSV export: **Company performance**, **Product performance**, **Availability**, **Product fulfillment**, **Customers**, **Coupons** and **Activity log**. See [Reports & Analytics](doc:admin/reports).

## Settings

`/settings` mirrors the platform: **General**, **Pricing**, **Taxes**, **Rental period**, **Payments**, **Custom fields**, **Locations**, **Emails**, **Documents**, **Translations**, **Security**, **Team** and **Account and billing**. More also links to **Apps** (the integration catalogue), the **Setup guide**, **Help** and the user **Profile**.

## Bora

**Ask Bora** (`/assistant`) is the built-in assistant. It is a rule-based engine (`lib/features/assistant/bora_engine.dart`) that answers questions with live workspace data and attaches shortcuts to the right screen. The conversation is stored in the workspace, so it is shared with Bora on the web ([Bora Assistant](doc:admin/assistant)).

**Next:** [Payments in the App →](doc:app/payments)
