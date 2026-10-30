---
title: Admin Panel Overview
description: What the Go4Market Admin panel manages, how access works and how it relates to the Seller and Delivery panels.
---

The **Admin panel** is the control centre of Go4Market. It is a Flutter Web app (`apps/panel`, entrypoint `lib/main_admin.dart`) hosted on its own Firebase Hosting site, by default `https://<your-project-id>-admin.web.app`.

The same codebase also builds the **Seller panel** (`lib/main_seller.dart`) and the **Delivery panel** (`lib/main_delivery.dart`). Each panel is a separate site with its own login, menu and accent colour.

![Admin login](/docs/go4market/images/admin-login.webp "Admin sign-in: e-mail and password only")

## Who can sign in

| Panel | Who | Sign-in methods |
|---|---|---|
| **Admin** | Users with the custom claim `role = admin` (Super Admin and staff) | E-mail and password only |
| **Seller** | Sellers (claim `seller`); pending sellers see a waiting screen | E-mail/password, Google, phone OTP |
| **Delivery** | Delivery partners (claim `delivery`); pending partners see a waiting screen | E-mail/password, Google, phone OTP |

A **Super Admin** is an admin with no `staff/{uid}` document, or one with an empty `roleId`, and sees every menu. **Staff** are admins whose `staff/{uid}.roleId` points to a role in `adminRoles` with a list of permissions. See [Staff, Roles & Permissions](doc:admin/staff-roles).

:::note Claims are set only by Cloud Functions
Clients can never give themselves a role. The `role` claim is written only by `onUserCreated`, `registerSeller`, `registerDeliveryPartner`, `setUserRole`, `createStaffUser` and `createSellerRider`, plus the seed script for the demo accounts. After a claim changes, the client refreshes its ID token.
:::

## What the Admin panel manages

| Menu group | Routes | Docs |
|---|---|---|
| Overview | `/dashboard`, `/pos`, `/live-map` | [Dashboard](doc:admin/dashboard), [POS](doc:admin/pos), [Live Rider Map](doc:admin/live-map) |
| Orders | `/orders`, `/orders/pickup`, `/orders/pos`, `/orders/:id`, `/returns` | [Orders](doc:admin/orders), [Returns](doc:admin/returns) |
| Catalogue | `/catalog/products`, `approvals`, `categories`, `brands`, `attributes`, `custom-fields`, `taxes`, `stock`, `ratings`, `media`, `bulk`, `sort` | [Catalogue](doc:admin/catalog), [Products](doc:admin/products) |
| Sellers | `/sellers`, `/sellers/requests`, `/sellers/wallet`, `/sellers/policies` | [Sellers](doc:admin/sellers) |
| Delivery | `/delivery/partners`, `requests`, `cash`, `salary`, `settings`, `policies` | [Delivery Partners](doc:admin/delivery-partners), [Cash & Salary](doc:admin/cash-salary), [Delivery Settings](doc:admin/delivery-settings) |
| Customers | `/customers`, `/customers/wishlists`, `/customers/product-requests` | [Customers](doc:admin/customers) |
| Finance | `/finance/wallet`, `withdrawals`, `transfers`, `payouts`, `transactions` | [Finance](doc:admin/finance) |
| Marketing | `/marketing/sliders`, `offers`, `popups`, `featured`, `coupons`, `campaigns`, `membership`, `subscriptions`, `abandoned-carts` | [Homepage](doc:admin/homepage), [Coupons](doc:admin/coupons), [Push](doc:admin/push-notifications), [Wallet & Membership](doc:admin/wallet-membership) |
| Content | `/content/blogs`, `blog-categories`, `faqs`, `pages`, `email-templates`, `emails` | [Blogs, FAQs & Pages](doc:admin/content-pages), [Email](doc:admin/email-smtp) |
| Reports | `/reports/sales`, `products`, `categories`, `sellers`, `commission`, `pos` | [Reports](doc:admin/reports) |
| Settings | `/settings/platform`, `payments`, `modules`, `theme`, `seo`, `social`, `app-versions`, `languages`, `cities`, `countries`, `communication`, `system-mode` | The *Core Setup* and *Settings & Integrations* pages in this sidebar |
| Staff & system | `/staff`, `/staff/roles`, `/system`, `/account` | [Staff](doc:admin/staff-roles), [System](doc:admin/system) |

## Panel conveniences

- **Module switcher** in the top bar re-themes the panel in the module colour and scopes the dashboard and catalogue to Grocery, Food, Pharmacy or Shopping.
- **Global search** (<kbd>Ctrl</kbd> + <kbd>K</kbd>) across pages, orders, products and people.
- **Language picker** with English, हिन्दी, ગુજરાતી and العربية, including a full right-to-left layout for Arabic. See [Languages & Translations](doc:admin/languages).
- **Dark and light mode** toggle, saved per browser.
- **Card or table view** on every list, with filters and CSV export.
- **Bell inbox** and optional **browser push** ("Enable notifications" in the profile menu).

![Language picker](/docs/go4market/images/admin-language-menu.webp "The language picker in the top bar")

## Where the code lives

| What | Where |
|---|---|
| Panel screens | `apps/panel/lib/features/` (`admin`, `seller`, `delivery`, `shared`) |
| Menu definitions | `apps/panel/lib/panels/admin_spec.dart`, `seller_spec.dart`, `delivery_spec.dart` |
| Panel translations | `apps/panel/lib/l10n/` |
| Backend API | `functions/src/**`, listed in [Deploy Functions, Rules & Indexes](doc:installation/backend-deploy#what-gets-deployed) |

**Next:** [Demo Instructions →](doc:admin/demo-instructions)
