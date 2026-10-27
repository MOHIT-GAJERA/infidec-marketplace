---
title: Overview
description: The ClassiAds-Hub Admin Panel is the control centre of your marketplace. Everything the website and the app show is managed here.
---

The **ClassiAds-Hub Admin Panel** is the control centre of your marketplace. The website and the mobile app both read what you manage here: categories and their custom fields, locations, currencies, sliders, home-screen sections, banner ads, packages, featured-ad plans, payment gateways, CMS pages and every setting. You also run the day-to-day work from it: ad moderation, seller verification, reviews and reports, bank-transfer confirmations, chats and push notifications.

This section takes you from an empty Google account to a fully configured marketplace.

![Admin dashboard](/docs/classiadshub/images/admin-dashboard.jpg "Dashboard: ad, user, subscription and revenue totals, monthly revenue, ads by status, top categories, recent ads, reports and chats")

## What the Admin Panel manages

The sidebar is split into groups. Each group is one **module** that you can grant to staff roles.

| Group (module) | Pages | What you control |
|---|---|---|
| **Dashboard** (`dashboard`) | [Dashboard](doc:admin/dashboard) | KPIs, monthly revenue, ads by status, top categories, recent ads, most viewed, recent reports and chats, top customers |
| **Ads Listing** (`ads`, `categories`, `custom_fields`) | [All Ads](doc:admin/ads), [Categories](doc:admin/categories), [Custom Fields](doc:admin/custom-fields), [Jobs](doc:admin/jobs) | Moderation, the category tree, category-specific fields, job listings |
| **Content Management** (`content`) | Slider, Home Screen, Feature Section, Offer Item Tips, Banner Ads | Everything on the home pages of the website and the app. See [Sliders & Home Screen](doc:admin/home-content) |
| **Chat Management** (`chat`) | Chats, Chat Templates | Read and delete buyer–seller conversations, quick replies per category. See [Chats & Chat Templates](doc:admin/chat) |
| **Package Management** (`packages`, `transactions`) | Subscription Packages, Featured Ad Plans, User Subscriptions, Payment Transactions, Bank Transfer | What you sell, who bought it, payment confirmation and refunds. See [Subscription Packages](doc:admin/packages) |
| **Seller Management** (`sellers`) | Verification Fields, Seller Verification, Seller Review, Seller Review Report | KYC review and the verified badge, seller ratings. See [Seller Verification](doc:admin/seller-verification) |
| **Forms & Blogs** (`blogs`) | Blogs, Blog Category, FAQs | Blog posts with cover image and SEO fields, FAQs. See [Blogs & FAQs](doc:admin/blogs) |
| **Customers & Roles** (`customers`, `roles`, `staff`) | Customers, Role, Staff Management, User Queries | User accounts, staff logins and their roles, contact-form messages. See [Customers & User Queries](doc:admin/customers) |
| **Location** (`locations`) | Currencies, Countries, States, Cities, Areas | Location pickers and currencies. See [Locations](doc:admin/locations) |
| **Reports** (`reports`) | Report Reasons, User Reports | Reasons users pick, and the reports they file. See [Report Reasons & User Reports](doc:admin/reports) |
| **Notification** (`notifications`) | Notification | Push broadcasts and their history. See [Push Notifications](doc:admin/push-notifications) |
| **Settings** (`settings`) | Settings, System Status | 24 settings pages: general, web, SEO, currency, languages, payment gateways, OTP, e-mail templates, Firebase, AdMob, AdSense, Gemini AI, file manager, logs, CMS pages. See [Settings](doc:admin/settings) |

Sidebar groups you have no permission for are hidden.

## Look and feel

- **ClassiAds-Hub brand**: navy `#272757` with amber `#FFBF00` and the secondary `#505081`, Nunito font, the logo at the top of the sidebar (`admin/public/logo.png`).
- A **collapsible sidebar**: on small screens it slides in from the left with the menu button.
- Most list pages have **search**, **filters**, **pagination** and bulk actions. Catalogue pages also have drag-and-drop **ordering**.
- The top bar has a link to the public website.

## How the panel works

The panel is a **Next.js 16 static site** (`output: "export"`). It holds no secrets and has no server code. It talks to your backend in two ways:

- **Firebase Authentication** (Firebase JS SDK) for the login session only.
- **The REST API** (`/api/v1/admin/*` and a few public endpoints) for every list, form and action. On Firebase Hosting the panel calls `/api/v1` on its own domain. Hosting forwards it to the `api` Cloud Function. The function checks the role and the module permission of the signed-in user before it reads or writes Firestore.

Sign-in works like this:

1. You enter your e-mail (or phone) and password on the login screen (*"Welcome back — Sign in to the admin panel."*).
2. The panel calls `POST /api/v1/auth/login`. The API checks the password and returns the user with its `roles` and the `auth_email`.
3. If the roles include `super-admin`, `admin` or `staff`, the panel signs in to Firebase with `auth_email`. Any other account gets **This account does not have admin access.**
4. The panel loads `GET /api/v1/admin/me`, which returns your permissions (the modules you may open).

![Admin login](/docs/classiadshub/images/admin-login.jpg "Sign in to the admin panel")

## Roles

| Role (stored in `users.roles`) | Who | Can open |
|---|---|---|
| **super-admin** | You, the owner | Every page and every action. Can't be suspended or removed from the panel |
| **admin** | Partners or managers | Every page and every action. Only an admin can create another admin |
| **staff** + a custom role | Employees you create in **Customers & Roles → Staff Management** | The Dashboard plus the modules ticked in their role. Some pages also read lookups from other modules (for example Slider reads categories and ads) |
| **seller**, **customer** | Website and app users | No access. A customer becomes a seller automatically when they post the first ad |

The first super-admin can't be created from the panel. See [Create the First Admin](doc:installation/super-admin). Staff roles are explained in [Roles, Staff & Permissions](doc:admin/roles-permissions).

:::warning Permissions are checked on the server
The sidebar hides modules a staff member can't use, and the API refuses the request as well (`403 You do not have permission to perform this action.`). Removing a module from a role takes effect on the next request (role definitions are cached for about 30 seconds per function instance).
:::

## The recommended path

1. [Installation Overview](doc:installation/overview): what gets installed and in which order.
2. [Requirements](doc:installation/requirements) and [Third-Party Service Costs](doc:admin/third-party-costs).
3. [Create the Firebase project](doc:installation/firebase-project), then [deploy the backend](doc:installation/backend-deploy) and [add your keys](doc:installation/environment-configuration).
4. [Install the Admin Panel](doc:installation/admin-panel) and [create the first admin](doc:installation/super-admin).
5. [Connect your domains](doc:installation/hosting).
6. Work through the [Setup Guide](doc:installation/setup-guide): categories, custom fields, locations, currencies, packages, payment gateways and the home page.

:::tip Try it first
Want to click around before installing? See [Demo Instructions](doc:admin/demo-instructions).
:::

## Need help?

See [Support](doc:support) or use the [Infidec contact page](/contact-us?product=classiadshub).

**Next:** [Demo Instructions →](doc:admin/demo-instructions)
