---
title: Admin Panel Overview
description: The QwikMart Admin Panel is the control centre of your business — everything the apps and the website show is managed here.
---

The **QwikMart Admin Panel** is the control centre for your entire business. Everything the Customer App, the Delivery Boy App and the Web Portal display is driven from here — products, stores, delivery zones, orders, riders, payments, notifications and every configuration switch.

This section takes you from an empty Google account to a fully configured, live store.

![Admin Panel dashboard](/docs/qwikmart/images/admin-dashboard.jpg "Super Admin dashboard: sales, orders, top products and live order status")

## What the Admin Panel manages

| Area | What you control |
|---|---|
| **Catalogue** | Categories (and their order), brands, attributes, taxes, products with variants, stock per store, bulk upload / bulk update, media library |
| **Selling area** | Countries & currency, delivery zones drawn on a map, stores and their opening hours |
| **Orders** | Order lifecycle, rider assignment, self-pickup orders, return requests, invoices |
| **Customers** | Accounts, wallet balance and transactions, withdrawal requests, referrals |
| **Delivery boys** | Registration approval, documents, commission, cash collection, earnings & payouts |
| **Storefront** | Home Builder layouts (Quick and eCommerce), banners, CMS pages, blog, FAQs |
| **Marketing** | Promo codes, push notifications, bulk e-mail |
| **Communication** | Support chat with customers and riders, website Contact Us messages |
| **Configuration** | General settings, payment gateways, SMTP, SMS, Firebase push, Google Gemini AI, wallet, referral, delivery, maintenance |
| **Team** | Staff users, roles & permissions, store users and store roles |

## How QwikMart is put together

The panel is a **Next.js** web application that talks **only** to your Firebase project:

- **Firebase Authentication** — panel users sign in with e-mail and password. Each user carries a *role* claim: `admin`, `staff`, `store` or `delivery_boy`.
- **Cloud Firestore** — the panel reads data directly (with live updates for orders, chat and notifications) and edits catalogue / configuration data directly. Security rules decide what each role may read or write.
- **Cloud Functions** — every sensitive action (changing order status, assigning riders, refunds, wallet adjustments, payouts, publishing the home layout, sending notifications, AI) goes through a callable function, so it is validated on the server.
- **Cloud Storage** — product images, banners, rider documents, withdrawal receipts and imports.

There is **no PHP, no MySQL and no cron job** to maintain — Firebase scales automatically.

## Three panels in one installation

| Panel | URL | Who uses it |
|---|---|---|
| **Super Admin** | `https://admin.yourstore.com/admin/login` | You and your staff (with role-based permissions) |
| **Store panel** | `https://admin.yourstore.com/store/login` | Store owners and store staff — see only their own store's orders, products and stock |
| **Delivery Boy panel** | `https://admin.yourstore.com/delivery/login` | Riders who prefer a browser to the app |

## The recommended path

1. [Installation Overview](doc:installation/overview) — what gets installed and in which order.
2. [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs).
3. [Create the Firebase project](doc:installation/firebase-project) and [deploy the backend](doc:installation/backend-deploy).
4. [Install the Admin Panel](doc:installation/admin-panel), [configure the environment](doc:installation/environment-configuration) and [create your Super Admin](doc:installation/super-admin).
5. [Host it on your domain](doc:installation/hosting).
6. Work through the [Setup Guide](doc:installation/setup-guide) — the first ten things to configure in the panel.

## Access and permissions

- The first **Super Admin** has every permission. Create additional **staff** users and give them a **role** (for example *Order Manager* or *Catalogue Editor*) in [Staff, Roles & Permissions](doc:admin/roles-permissions).
- Secret settings (payment keys, SMTP password, SMS and AI keys) can be viewed and changed **only by the Super Admin** role — staff see those tabs locked.
- Store owners get their own login to the [Store Panel](doc:admin/store-panel).

:::tip Demo first
Want to click around before installing? Follow [Demo Instructions](doc:admin/demo-instructions) to run QwikMart locally with sample data in about 10 minutes.
:::

## Need help?

See [Support](doc:support) or write to us at [contact@infidec.com](mailto:contact@infidec.com).
