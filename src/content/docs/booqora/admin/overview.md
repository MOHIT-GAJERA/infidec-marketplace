---
title: Platform Overview
description: What the Booqora Rental Platform manages, who can sign in, how workspaces work and the full list of routes.
---

The **Rental Platform** is the back office of Booqora. It is a Flutter Web app (`booqora_platform/`) hosted on its own Firebase Hosting site, by default `https://<your-site-id>.web.app` (the author's demo runs at `https://booqora-platform.web.app`).

The same build also serves the public **Online Store** (`/s/<store-slug>`) and the **payment return page** (`/pay/return`). Those two routes are open to everyone; every other page needs a signed-in staff member.

![Booqora dashboard](/docs/booqora/images/platform-dashboard.webp "The dashboard after sign-in, with the sidebar menu on the left")

## Who signs in

| Who | How they get access | Sign-in method |
|---|---|---|
| **Owner** | Signs up at `/signup` and creates a workspace at `/welcome` | E-mail and password |
| **Admin** | Invited by an owner or admin from **Settings → Team**, then signs up with the invited e-mail | E-mail and password |
| **Member** | Invited the same way with the *member* role | E-mail and password |
| **Store customer** | Does not sign in; the Online Store starts an anonymous session in the background | None |

There is **no separate super-admin**. Every new sign-up without a pending invite becomes the **owner** of a brand-new workspace. Owners and admins can invite people, change roles and remove members; members work with orders, customers, inventory and the rest of the data. See [Team, Roles & Security](doc:admin/team-security).

## The workspace model

A **workspace** is one rental business. It is a document at `workspaces/{workspaceId}` with the company name, the store `slug`, the `ownerId`, the plan, the trial end date and all settings. Everything the business owns sits underneath it: `orders`, `customers`, `products`, `stockItems`, `documents`, `payments` and so on.

- A user belongs to **one workspace at a time**. The link is the `workspaceId` field on `users/{uid}` plus a membership document at `workspaces/{workspaceId}/members/{uid}`.
- The security rules allow access only when that membership document exists, so two businesses on the same installation can never see each other's data.
- Each workspace also gets a public entry at `publicStores/{slug}` so the Online Store can find it by its address.

See [Data Model](doc:api/data-model) for the full list of collections.

## What the platform manages

| Menu | Routes | Docs |
|---|---|---|
| Dashboard | `/`, `/setup`, `/help` | [Dashboard](doc:admin/dashboard), [Setup Guide](doc:installation/setup-guide) |
| Calendar | `/calendar` | [Rental Calendar](doc:admin/calendar) |
| Orders | `/orders`, `/orders/new`, `/orders/:id` | [Orders & Order Flow](doc:admin/orders) |
| Customers | `/customers`, `/customers/new`, `/customers/:id` | [Customers](doc:admin/customers) |
| Inventory | `/inventory?tab=products`, `bundles`, `collections`, `downtime`, `stock`; `/inventory/products/new`, `/inventory/products/:id`, `/inventory/bundles/new`, `/inventory/bundles/:id`, `/inventory/collections/new`, `/inventory/collections/:id` | [Products](doc:admin/products), [Stock Items](doc:admin/stock-items), [Bundles & Collections](doc:admin/bundles-collections), [Availability & Downtime](doc:admin/availability) |
| Coupons | `/coupons`, `/coupons/new`, `/coupons/:id` | [Coupons & Discounts](doc:admin/coupons) |
| Documents | `/documents?tab=invoice`, `quote`, `contract`, `packing`; `/documents/:id` | [Quotes, Contracts & Invoices](doc:admin/documents) |
| Online store | `/online-store`, `/online-store/:section` (`booking-page`, `website`, `integration`, `cross-sell`, `preferences`, `fulfillment`, `checkout`, `seo`) | [Online Store Overview](doc:store/overview) |
| Apps | `/apps`, `/apps/:id` | [App Store](doc:admin/apps) |
| Reports | `/reports`, `/reports/:type` (`performance`, `products`, `availability`, `fulfillment`, `customers`, `coupons`, `activity`) | [Reports & Analytics](doc:admin/reports) |
| Ask Bora | `/assistant` | [Bora Assistant](doc:admin/assistant) |
| Settings | `/settings/:section`: `general`, `pricing`, `taxes`, `rental-period`, `payments`, `custom-fields`, `locations`, `emails`, `documents`, `translations`, `security`, `team`, `billing` | The *Settings & Integrations* pages in this sidebar |
| Profile menu | `/profile` | – |

## Public and sign-in routes

| Route | Page | Who |
|---|---|---|
| `/login`, `/signup`, `/forgot` | Sign in, start a free trial, reset password | Signed-out visitors |
| `/welcome` | Workspace onboarding: accept an invite or create a workspace | Signed-in users without a workspace |
| `/loading` | Splash while the session loads | Everyone |
| `/s/:slug`, `/s/:slug/p/:pid` | Online Store home and product page | Public |
| `/pay/return` | Confirms Stripe and PayPal payments | Public |

The router (`lib/core/router.dart`) redirects automatically: signed-out users go to `/login?from=…` and return to the page they asked for after signing in; signed-in users without a workspace go to `/welcome`.

## Platform conveniences

- **Global search** (<kbd>Ctrl</kbd> + <kbd>K</kbd>, or <kbd>Cmd</kbd> + <kbd>K</kbd> on a Mac) across orders (by number or customer), customers (name, e-mail, phone) and products (name, SKU).
- **New order** button in the sidebar and the top bar, the fastest way to create a booking.
- **Scan a barcode** in the sidebar: use a USB or Bluetooth scanner, or type a stock identifier, SKU or order number to jump straight to it.
- **Setup progress** in the sidebar opens the [Setup Guide](doc:installation/setup-guide) checklist until all eight steps are done.
- **Ask Bora** in the top bar and the sidebar.
- **Trial banner** with the days left and a link to **Settings → Account and billing**.
- **CSV export** on the orders, customers, inventory, documents and report pages.

![Setup guide](/docs/booqora/images/platform-setup-guide.webp "The Setup Guide: eight steps from first product to logo")

## Where the code lives

| What | Where |
|---|---|
| Routes and redirects | `booqora_platform/lib/core/router.dart` |
| Sidebar menu, search and barcode lookup | `booqora_platform/lib/widgets/shell.dart` |
| Screens | `booqora_platform/lib/features/<module>/` |
| Session, workspace creation and invites | `booqora_platform/lib/data/session.dart` |
| Firestore field contract | `booqora_platform/lib/data/schema.dart` |
| Backend | `booqora_platform/functions/index.js`, see [Cloud Functions Reference](doc:api/cloud-functions) |

**Next:** [Demo Instructions →](doc:admin/demo-instructions)
