---
title: Restaurant App
description: The staff side of the mobile app. Live floor, POS with KOTs, voids, discounts and split payments, kitchen order board, reservations and menu, all controlled by role permissions.
---

The **Restaurant App** (*"Run the floor, kitchen orders and POS"*) is a phone POS for waiters, cashiers, kitchen staff and managers. It works on the same tables, sessions and orders as the Admin Panel's [Live Floor](doc:admin/floor) and [POS](doc:admin/pos).

![Floor](/docs/go4foodie/images/app-restaurant-floor.webp "Live floor")
![Table session](/docs/go4foodie/images/app-restaurant-session.webp "POS: table session")
![Menu picker](/docs/go4foodie/images/app-restaurant-picker.webp "Add items (KOT)")
![Payment](/docs/go4foodie/images/app-restaurant-payment.webp "Add payment")
![Close table](/docs/go4foodie/images/app-restaurant-close.webp "Close & settle")
![Orders board](/docs/go4foodie/images/app-restaurant-orders.webp "Kitchen & service orders board")

## Who can sign in

Login screen subtitle: *"Staff sign-in — use your admin or staff account."* The server checks, in this order:

1. **Admin user** (`users` collection, any role OWNER / MANAGER / STAFF) with a matching password → signed in with that role.
2. Otherwise an **employee** (`employees` collection) whose app password matches:
   - **inactive** employee → *"Your staff account is inactive."*
   - employee role **Manager** or **Super Admin** → **MANAGER** permissions. **Cashier**, **Kitchen Staff** and **Waiter** → **STAFF** permissions.
3. No match → *"Invalid email or password"*.

Employees get an app password when a manager sets **Password** in Admin → [Staff](doc:admin/staff), or in the app's **Staff** module. An employee without a password cannot sign in. The login screen says *"Accounts are created by your manager in the admin (Staff)."*

:::note Role changes apply at the next sign-in
Name, email and role are saved in the 30-day session token. If you change an employee's role or deactivate them, the change takes effect when they sign in again. The **inactive** check runs at sign-in.
:::

## Tabs

| Tab | Content | Permission |
|---|---|---|
| **Floor** | Live table grid with state filters, refreshed every **8 s** (*Live*) | `manage:orders` |
| **Orders** | Kitchen and service board: **Active · Pending · Preparing · Ready · Done**, refreshed every **10 s**, with a pending-count badge on the tab | `manage:orders` |
| **Bookings** | Reservations: **Today · Upcoming · Requests · All** | `manage:reservations` |
| **Menu** | Items with availability switches and categories | `manage:orders` to view, `manage:menu` to edit |
| **Me** | Profile, **Duty status** (employees), plus the modules below | — |

Modules under **Me**, shown only if the user has the permission: **Inventory** (`manage:inventory`), **Customers** (`manage:customers`), **Gift cards** (`manage:coupons`), **Staff** (`manage:staff`), **Tables & QR** (`manage:tables`), **Reports** (`view:reports`), **Activity** (`view:dashboard`).

Which role has which permission is listed in [Roles & Permissions](doc:admin/roles-permissions). A STAFF user, for example, sees Floor, Orders, Bookings, Menu (read-only) and Activity.

## Floor

Each card shows **T<number>**, the seats, the state colour, and for an open session the current bill, guests, open time and waiter. The filter chips start with **All** and show a count per state.

- **Tap** a table to open its POS.
- **Long-press** a table (needs `operate:floor`) → **Table N state**: Available, Reserved, Occupied, Waiting payment, Cleaning, Out of service. Each change is written to the [Audit Log](doc:admin/audit-log) as `table.state`.

Orders that guests send from the table QR (website or Customer App) open a session automatically. The table then shows as occupied with that bill.

## POS (table session)

:::steps
### Open the table
On an available table: **Guests** stepper, **Waiter (optional)**, **Guest name (optional)** → **Open table**. Opening needs `operate:floor`. Without it the screen says *"Your role cannot open tables."*

### Add items (KOT)
**Add items** → pick dishes and quantities → each send creates one kitchen ticket (KOT, a POS order `ORD-#####`). The header counts the KOTs. *"No items yet — tap “Add items” to send a KOT to the kitchen."*

### Void
**−** on a line removes one unit of the newest matching item. An empty ticket is deleted. Logged as `order.void`.

### Adjust bill
**Adjust bill** → Discount, Tax, Service charge, Tip as amounts, with quick **5 / 10 / 12 / 15 / 18 %** of the subtotal → **Apply**. Total = subtotal − discount + tax + service charge + tip.

### Payments
**Payment** → *"Split bills or take part payments — remaining $…"*. Enter an amount and pick Cash, Credit Card, Debit Card, UPI or Wallet → **Record payment**.

### Merge
**Merge** → *"Merge this table into…"* another open table. Orders and payments move across, guest counts are added together, and this table goes to **Cleaning**.

### Close & pay
**Close & pay** → *"Collect the remaining $… by:"* (pick a method) → **Close & settle**. Any remaining amount is recorded with that method. If more than one method was used, the session is stored as **Mixed**. The table moves to **Cleaning** (*"Table closed — set to cleaning"*). Closing needs `operate:floor`.
:::

The **History** icon in the POS opens **Table history**: sessions of the last 30 days with guests, duration, waiter, payment method, items and total. It needs `view:reports`.

## Orders board

Cards show the order number, an **ONLINE** badge for website and app orders, items, pickup schedule or table, customer notes and total. Buttons move an order **Pending → Preparing → Ready → Completed**. **Cancel** asks *"Cancel ORD-…?"*. When an order becomes **Completed** and has an email, the customer receives the *order completed* email.

## Bookings

Filters **Today**, **Upcoming**, **Requests** and **All**. Each card shows reference, phone, guests or event details. Status buttons follow the flow:

- Table: Requested → Confirmed → Seated → Completed, plus Cancelled and No-show
- Private event: Requested → Confirmed → Completed, plus Cancelled

**Completed** sends the thank-you email.

## Menu

The list shows *"N items · M unavailable"*. The **Available** switch hides an item from the website and the Customer App immediately. **Categories** turns whole categories on or off (*"Disabled categories are hidden from the website and customer app."*). With `manage:menu` you can add and edit items: Name, Description, Price, Rating (0–5), Category, Tag (e.g. Chef’s pick), **Image URL** and Available.

:::tip Images in the app form are URLs
The app form takes an image **URL**. It must be a full `https://…` address. To upload a photo from your computer, use Admin → [Menu](doc:admin/menu) (max 5 MB), which stores it in Cloud Storage.
:::

An item that was ever ordered cannot be deleted (*"This item has been ordered before and cannot be deleted. Mark it unavailable instead."*).

## Other modules

| Module | What you can do |
|---|---|
| **Inventory** | Items with stock status, **Low stock only** filter, add / edit / delete, quick +/− adjust |
| **Customers** | List with order count and spend. Detail with orders and reservations. Add, edit (Active switch), delete |
| **Gift cards** | All cards and coupons, change status (marking one **Redeemed** emails the customer) |
| **Staff** | Team with role and duty status. Add or edit name, email, phone, **password** (min 6, empty keeps the old one), role (Super Admin, Manager, Cashier, Kitchen Staff, Waiter), Active. Remove |
| **Tables & QR** | Tables with their QR (`<WEBSITE_URL>/order?table=<code>`). Add or edit number, name and **QR ordering enabled** |
| **Reports** | Sales, Tables and Transactions tabs ([Owner App](doc:app/owner#reports)) |
| **Activity** | Alerts, plus the Audit log tab for `manage:settings` |

## Duty status

Employees set their own status under **Me → Duty status**: **On duty**, **Break** or **Off**. Admin users (from the `users` collection) do not have a duty status. The dashboard's employee chart counts these statuses.

**Next:** [Owner App →](doc:app/owner)
