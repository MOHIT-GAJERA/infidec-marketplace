---
title: Admin Panel Overview
description: The Go4Ride Admin Panel is the control centre of your ride-hailing business. Everything the Customer and Driver apps show is managed here.
---

The **Go4Ride Admin Panel** is the control centre of your platform. The Customer App and the Driver App both read what you manage here: services, vehicle types, rental packages, required driver documents, banners, onboarding slides, offers, subscription plans, payment methods and every business rule. You also run the day-to-day operation from it: bookings, KYC approvals, SOS alerts, support tickets and driver payouts.

This section takes you from an empty Google account to a fully configured platform.

![Admin dashboard](/docs/go4ride/images/admin-dashboard.jpg "Dashboard: total revenue with a 7-day chart, completed and active rides, online drivers, customers, ride mix and fleet & KYC")

## What the Admin Panel manages

The sidebar is split into groups. Each page below has its own guide.

| Group | Pages | What you control |
|---|---|---|
| **Overview** | [Dashboard](doc:admin/dashboard) | Revenue, rides, online drivers, customers, ride mix, fleet & KYC, active rides |
| **Operations** | [Bookings](doc:admin/bookings) (Cab, Intercity, Rental, Parcel), [Dispatch](doc:admin/dispatch) (Monitor, Dispatch users), [SOS alerts](doc:admin/sos-alerts) | Every ride with its fare breakdown and timeline, admin cancellation, dispatcher bookings, emergency alerts |
| **People** | [Customers](doc:admin/customers), [Drivers](doc:admin/drivers) (All, Approved, Pending approval), [Online drivers](doc:admin/online-drivers) | Rider accounts and wallets, driver KYC review, blocking, the live driver map |
| **Support** | [Support overview, Tickets](doc:admin/support) | Ticket volume, assignment and live chat with riders and drivers |
| **Catalogue** | [Services](doc:admin/services), [Zones](doc:admin/zones), [Rental packages](doc:admin/rental-packages), [Vehicles](doc:admin/vehicles) (Types, Brands, Models), [Driver documents](doc:admin/driver-documents) | What riders can book, what it costs, what drivers must upload |
| **Growth** | [Offers](doc:admin/offers), [Banners, Onboarding](doc:admin/banners-onboarding), [Push notifications](doc:admin/push-notifications), [Email templates](doc:admin/email-templates), [Badges](doc:admin/badges) | Coupons, home-screen promotions, first-launch slides, broadcasts |
| **Finance** | [Subscriptions](doc:admin/subscriptions) (Plans, History), [Payout requests](doc:admin/payouts) | Driver plans and driver withdrawals |
| **Access** | [Roles, Employees](doc:admin/roles-permissions) | Staff accounts and what each role may open |
| **System** | [Settings](doc:admin/settings) | 22 settings pages: general, app versions, maps, maintenance, business model, fares, driver & ride rules, surge, payments, SMTP, content pages, reasons |

The sidebar has **34 pages**. Four entries show a **live badge**: *Drivers / Pending approval* (KYC waiting), *Tickets* (pending tickets), *SOS alerts* (active alerts) and *Payout requests* (requested withdrawals).

## Look and feel

- **Black & white UI** with the Go4Ride logo, in **light or dark mode** (toggle in the top bar or the sidebar footer).
- **Collapsible sidebar**: it collapses to icons automatically on windows narrower than 1100 px. Use the toggle in the top bar to expand or collapse it yourself. **Search menu** at the top of the sidebar finds any page by name.
- The panel remembers the last page you opened in this browser.
- Most list pages have **search**, **filter tabs with counts**, **pagination** and **Export CSV**.

![Dashboard in dark mode](/docs/go4ride/images/admin-dashboard-dark.jpg "The same dashboard in dark mode")

## How the panel works

The panel is a **Flutter Web** app. It talks to your Firebase project in two ways:

- **Directly to Firestore and Storage**: lists and forms read live data (changes made in the apps appear without reloading) and write catalogue items and settings. Security rules only let the `admin` role write the catalogue and settings.
- **Through Cloud Functions** for anything privileged: approving KYC (`reviewKyc`), approving payouts (`approveWithdrawal`), creating staff (`createStaffUser`, `updateStaff`, `deleteStaff`) and sending push broadcasts (`sendBroadcast`). These callables check the `admin` claim on the server.

Sign-in works like this:

1. You enter your e-mail and password on the login screen (*"Sign in to the Go4Ride admin console."*).
2. Firebase Authentication signs you in. The panel then reads your account's custom claim.
3. If the claim is `admin`, `staff` or `dispatcher`, the console opens. Anything else shows **Admin access required**.

![Admin login](/docs/go4ride/images/admin-login.jpg "Sign in to the Go4Ride admin console")

## Roles

| Role (claim) | Who | Can open |
|---|---|---|
| **admin** | You, the owner | Every page and every action |
| **staff** | Employees you create in [Employees](doc:admin/roles-permissions) | The dashboard plus the pages their role grants with **View** |
| **dispatcher** | Dispatch users you create in [Dispatch users](doc:admin/dispatch) | The dashboard plus the pages their role grants (by default: dispatch monitor, the four bookings pages and online drivers) |

The first admin can't be created from the panel. See [Create the First Admin](doc:installation/super-admin).

:::warning Some actions are admin-only on the server
Security rules and Cloud Functions only let the **admin** claim write the catalogue and settings, decide KYC, approve payouts and send broadcasts. A staff role can *open* those pages if you grant it, but saving will fail with a permission error. Staff and dispatchers **can** work support tickets and resolve SOS alerts. See [Roles & Permissions](doc:admin/roles-permissions).
:::

## The recommended path

1. [Installation Overview](doc:installation/overview): what gets installed and in which order.
2. [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs).
3. [Create the Firebase project](doc:installation/firebase-project), then [deploy the backend](doc:installation/backend-deploy) and [add your keys](doc:installation/environment-configuration).
4. [Install the admin panel](doc:installation/admin-panel) and [create the first admin](doc:installation/super-admin).
5. [Connect your domain](doc:installation/hosting).
6. Work through the [Setup Guide](doc:installation/setup-guide): load the default catalogue, set your fares, commission and payment methods.

:::tip Load the defaults
Most catalogue pages start empty. When a page has no rows yet, it shows a **Load N defaults** button that fills in a ready-made list (5 services, 5 vehicle types, 10 brands, 5 document types, onboarding slides, badges, plans, reasons…). Edit them to fit your business. [Roles](doc:admin/roles-permissions) has a **Create default roles** button.
:::

:::tip Try it first
Want to click around before installing? See [Demo Instructions](doc:admin/demo-instructions).
:::

## Need help?

See [Support](doc:support) or write to us at [contact@infidec.com](mailto:contact@infidec.com).
