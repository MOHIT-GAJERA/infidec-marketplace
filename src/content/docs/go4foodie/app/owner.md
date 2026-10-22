---
title: Owner App
description: The owner's mode of the mobile app. Live dashboard, floor, sales and table reports, transactions, and full management of menu, staff, customers, gift cards, tables, outlets and settings.
---

The **Owner App** (*"Business insights and full control"*) gives the restaurant owner the Admin Panel's numbers and management screens on a phone. It reads the same data as the Admin Panel.

![Owner dashboard](/docs/go4foodie/images/app-owner-dashboard.webp "Dashboard")
![Owner floor](/docs/go4foodie/images/app-owner-floor.webp "Floor")
![Reports](/docs/go4foodie/images/app-owner-reports.webp "Reports")
![Manage](/docs/go4foodie/images/app-owner-manage.webp "Manage hub")

## Who can sign in

Only **admin users with the OWNER role** (the `users` collection, the same logins as the Admin Panel). Subtitle: *"Owner sign-in — full access to your restaurant."*

| Account | Result |
|---|---|
| Admin user, role **OWNER**, correct password | Signed in with all 13 permissions |
| Admin user, role MANAGER or STAFF | *"Owner access only. Use the Restaurant app."* |
| Employee or customer account, or wrong password | *"Invalid email or password"* |

The login screen notes *"Owner accounts are managed in the admin (Settings → Team)."* To create or reset an owner login, see [Admin Users](doc:installation/admin-users).

## Tabs

| Tab | Content |
|---|---|
| **Dashboard** | KPIs and charts, refreshed every **30 s**. The bell shows the **attention** count and opens **Activity** |
| **Floor** | The same live floor and POS as the [Restaurant App](doc:app/restaurant#floor) |
| **Reports** | **Sales · Tables · Transactions** |
| **Manage** | Grid of management modules |
| **Me** | Profile, change password, dark mode, server address, sign out |

## Dashboard

*"Hello, <first name>"*, then:

- **KPIs**: Total Orders, Total Delivered, Canceled Order, Total Revenue
- **POS**: total sales, number of bills, average bill value, **Peak hour**, and the payment mix (cash / card / online %)
- **Floor**: available, occupied, reserved and waiting-payment tables
- **Outlets**: sales vs cost per outlet
- **Trending item**: name, rating, orders and price
- **Sales types**: Dine-in / Delivery / Pick-up %
- **Employees**: team size with On Duty / On Break / Absent
- **Top categories** and **Recent orders**

The attention badge counts **requested reservations + low-stock items + tables that are Cleaning or Waiting payment**. All figures are all-time totals over every order, with no date filter. They are the same as on the Admin [Dashboard](doc:admin/dashboard). The trending item and top categories follow any override set there.

## Reports

| Tab | Content |
|---|---|
| **Sales** | Revenue (non-cancelled orders), orders, items sold, average order. Revenue by outlet, top items, category mix, order types, payment mix (Cash / Card / Online) |
| **Tables** | **Today · 7 days · 30 days**: revenue, sessions, average bill, average dining time, peak hour and peak day, busy hours chart (10:00–21:00), and per table *"N sessions · N guests · N% occ."* with revenue and favourite items |
| **Transactions** | Orders, gift cards and table payments in one feed: reference, customer, source, method, date, amount |

Reports need `view:reports`. For CSV, Excel or PDF exports use the Admin Panel ([Reports](doc:admin/reports), [Table Analytics](doc:admin/table-analytics)).

## Manage

Every module checks the user's permissions. The owner has all of them:

| Module | Subtitle | Permission |
|---|---|---|
| Orders | Kitchen & service board | `manage:orders` |
| Reservations | Bookings & events | `manage:reservations` |
| Menu | Dishes, prices, availability | `manage:menu` |
| Inventory | Stock & reorder levels | `manage:inventory` |
| Staff | Team & duty status | `manage:staff` |
| Customers | CRM & history | `manage:customers` |
| Gift cards | Cards & coupons | `manage:coupons` |
| Tables & QR | Table list & QR codes | `manage:tables` |
| Outlets | Locations & margins | `manage:outlets` |
| Activity | Alerts & audit log | `view:dashboard` (the Audit log tab needs `manage:settings`) |
| Settings | Restaurant profile & team | `manage:settings` |

The modules work like those of the Restaurant App ([details](doc:app/restaurant#other-modules)). **Floor & POS** and **Reports** are not in the grid because they have their own tabs.

### Activity

- **Alerts**: the latest orders, requested reservations, low-stock items (*"Low stock: <item>"*), tables that need cleaning or are waiting for payment, tables occupied for 2 h+, and large bills. They are computed live and are the same as Admin → [Notifications](doc:admin/notifications).
- **Audit log**: the last 150 POS and floor actions (`session.open`, `order.add`, `order.void`, `payment.add`, `session.merge`, `session.close`, `table.state`), with the user who did them.

### Outlets

Each outlet's location, manager, active flag and the latest week's revenue vs cost. Outlets are read-only in the app. Edit them in the Admin Panel ([Outlets](doc:admin/outlets)).

### Settings

**Restaurant settings**: name, currency, timezone, address, phone and email (the same restaurant profile as Admin → [Settings](doc:admin/settings)) → **Save settings**. Below it is the list of admin logins (*"Admin logins are managed in the web admin (Settings → Team)."*). The customer app's **Visit us** card shows this profile.

**Next:** [In-App Payments →](doc:app/payments)
