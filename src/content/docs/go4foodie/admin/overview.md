---
title: Admin Panel Overview
description: The Go4Foodie Admin Panel is the restaurant's control centre. Everything the website and the mobile app show is managed here.
---

The **Go4Foodie Admin Panel** is the control centre of your restaurant. The website, the Customer App, the Restaurant App and the Owner App all read the data managed here: menu, tables, orders, reservations, staff, gift cards, inventory and the live floor.

This section takes you from an empty Google account to a fully configured restaurant.

![Admin dashboard](/docs/go4foodie/images/admin-dashboard.jpg "Overview: KPIs, outlet cost vs revenue, top categories, employee status, recent orders and POS activity")

## What the Admin Panel manages

| Area | Screens | What you control |
|---|---|---|
| **Restaurant setup** | Settings, Outlets, Menu, Tables | Restaurant profile, menu items & categories (on/off, availability, images), tables with QR codes |
| **Front of house** | Floor, POS, Orders, Reservations | Live table states and sessions, billing & payments, online order status, bookings & private events |
| **Business** | Dashboard, Staff, Customers, Gift Cards, Inventory, Transactions, Reports, Table Analytics, Table History | Team directory & duty status, guest history & lifetime spend, gift cards & coupons, stock, payments, analytics and exports |
| **Activity** | Notifications, Audit Log | New orders, reservation requests, low stock and table alerts. Every POS and table action, with who did it and when |

The panel has **20 screens** (including the login screen). The sidebar only shows the ones your role may open.

## How the panel works

The panel is a **Flutter Web** app hosted on Firebase Hosting. It talks to your Firebase project in two ways:

- **REST API**: every screen loads and saves through `/api/admin/*` on the `api` Cloud Function. The function checks the permission for each action on the server.
- **Live listeners**: the Floor, POS, Orders and Reservations screens also listen to Firestore, so changes made from the Restaurant App or the website show up straight away. Security rules allow signed-in admin users to *read* only `tables`, `tableSessions`, `orders`, `payments`, `reservations` and `inventoryItems`. Clients can't write anything.

Sign-in works like this:

1. You enter your e-mail and password on the login screen.
2. `POST /api/admin/auth/login` checks the password against the bcrypt hash in the locked `credentials` collection.
3. The function returns a **Firebase custom token** with your role in its claims. The panel signs in to Firebase Authentication with it and stays signed in until you sign out.

![Admin login](/docs/go4foodie/images/admin-login.jpg "Sign in to your dashboard")

## Roles

| Role | Can do |
|---|---|
| **OWNER** | Everything, including Settings and the Audit Log (`manage:settings`) |
| **MANAGER** | Everything except Settings and the Audit Log |
| **STAFF** | Dashboard, orders, reservations, and running the floor (open / close table sessions) |

Admin users (OWNER / MANAGER / STAFF) are stored in the `users` collection. **The panel can't create them.** You create the first Owner with a small script. See [Admin Users](doc:installation/admin-users). Restaurant employees such as waiters, cashiers and kitchen staff are a separate list managed in [Staff](doc:admin/staff). They sign in to the **Restaurant App**. The full matrix is on [Roles & Permissions](doc:admin/roles-permissions).

## The recommended path

1. [Installation Overview](doc:installation/overview): what gets installed and in which order.
2. [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs).
3. [Create the Firebase project](doc:installation/firebase-project), then [deploy the backend](doc:installation/backend-deploy) and [configure the environment](doc:installation/environment-configuration).
4. [Install the admin panel](doc:installation/admin-panel), [import existing data](doc:installation/data-migration) (optional) and [create your Owner](doc:installation/admin-users).
5. [Connect your domains](doc:installation/hosting).
6. Work through the [Setup Guide](doc:installation/setup-guide), the first ten things to do in the panel.

:::tip Try it first
Want to click around before installing? See [Demo Instructions](doc:admin/demo-instructions) for the hosted demo.
:::

## Need help?

See [Support](doc:support) or write to us at [contact@infidec.com](mailto:contact@infidec.com).
