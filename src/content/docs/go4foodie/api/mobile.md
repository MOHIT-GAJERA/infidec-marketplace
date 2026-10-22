---
title: Mobile API
description: Every /api/mobile endpoint of the Flutter app. Auth, customer routes and staff routes, with the token kinds and permissions each one requires.
---

Base path **`/api/mobile`**. All requests send `Authorization: Bearer <token>` except login and register. Paths below are relative to `/api/mobile`.

- **Kinds**: the token kinds a route admits. `customer` = Customer App, `user` = admin user (Restaurant or Owner App), `employee` = staff directory login (Restaurant App).
- **Permission**: checked against the token's role **before** the handler runs (`403` otherwise). Write actions check it again.
- Route params are URL-decoded. Unknown routes return `404` `{"error":"Not found"}`.

## Auth

| Method & path | Kinds | Body | Response |
|---|---|---|---|
| `POST auth/login` | public | `{email, password, app: "customer"\|"restaurant"\|"owner"}` | `200 {token, user}` |
| `POST auth/register` | public | `{name (min 2), email, phone (min 5), password (min 6)}` | `201 {token, user}` |
| `GET auth/me` | customer, user, employee | — | `{user}` |
| `PUT auth/me` | customer, user, employee | `{name (min 2), phone, address}` | `{user}` |
| `POST auth/password` | customer, user, employee | `{currentPassword, newPassword (min 6)}` | `{ok: true}` |

### Login rules

| `app` | Checks | Errors |
|---|---|---|
| `customer` | Customer by email with a password that matches. Status must be `ACTIVE` | `401` *Invalid email or password* · `403` *This account is inactive. Please contact the restaurant.* |
| `restaurant` | 1. Admin **user** with a matching password (any role). 2. Otherwise an **employee** with a matching app password, who must be `active`. Employee roles *Manager* and *Super Admin* → `MANAGER`, all others → `STAFF` | `401` *Invalid email or password* · `403` *Your staff account is inactive.* |
| `owner` | Admin **user** with a matching password **and** role `OWNER` | `403` *Owner access only. Use the Restaurant app.* · `401` *Invalid email or password* |

**Register**: if the email already has a customer password → `409` *An account with this email already exists. Please sign in.* A website guest (customer without a password) is claimed instead of duplicated.

**Profile** (`user`): `{id, name, email, kind, role, permissions[]}`, plus `phone` and `address` for customers, `phone`, `title` and `dutyStatus` for employees, and `phone: ""` and `title` (Owner / Manager / Staff) for users. `name`, `email` and `role` come from the token. A `PUT auth/me` change shows in its response, but the token keeps the old name until the next login.

**Password**: wrong current password → `400` *Current password is incorrect*. Existing tokens stay valid.

## Customer routes (`customer/*`, kind `customer`)

A customer owns orders, reservations and gift cards that carry their `customerId` **or** their email.

| Method & path | Body / query | Response | Notes |
|---|---|---|---|
| `GET customer/home` | — | `{profile, activeOrders, upcomingReservations}` | Up to 5 orders that are Pending, Preparing or Ready. Up to 3 Requested or Confirmed bookings from today onwards. `profile` = restaurant profile |
| `GET customer/orders` | — | `{orders}` | Newest first, max 100 |
| `GET customer/orders/:id` | — | `{order}` | `404` *Order not found*. Includes `session {total, paid, remaining, status}` for table orders |
| `POST customer/orders` | `{items, notes?, payment? \| payAtRestaurant: true, type: "TAKE_AWAY", scheduleType, scheduleDate?, scheduleTime?}` or `{…, type: "DINE_IN", tableCode}` | `201` | Name, email and phone come from the account. Same rules as [`POST /api/orders`](doc:api/public#post-apiorders) |
| `GET customer/reservations` | — | `{reservations}` | By date, newest first |
| `POST customer/reservations` | TABLE `{kind, date, time, guests, occasion, requests?}` or PRIVATE_EVENT `{kind, eventType, date, guestRange, space, company?, message?}` | `201 {reference, id}` | Same rules as [`POST /api/reservations`](doc:api/public#post-apireservations) |
| `POST customer/reservations/:id/cancel` | — | `{reservation}` | `404` *Reservation not found* · `422` *This booking can no longer be cancelled* (only REQUESTED or CONFIRMED can be cancelled) |
| `GET customer/gift-cards` | — | `{giftCards}` | Newest first |
| `POST customer/gift-cards` | `{kind, amount, message?, payment?}` | `201 {code, id, amount, kind}` | `402` when a gateway is configured and payment is missing or invalid |
| `GET customer/tables/:code` | — | `{table: {id, number, name?, code}}` | `404` *Table not found or not accepting orders* |

A customer token whose customer record was deleted gets `401` *Account not found* on the POST routes.

## Staff routes (`staff/*`, kinds `user`, `employee`)

| Method & path | Permission | Body / query | Response |
|---|---|---|---|
| `GET staff/dashboard` | `view:dashboard` | — | KPIs, POS, outlets, trending, categories, employees, recent orders, sales types, `attention`, `floor` counts |
| `GET staff/notifications` | `view:dashboard` | — | `{notifications:[{id, type, title, detail, time}]}` |
| `PATCH staff/me/duty` | — (employees only) | `{status: ON_DUTY\|ON_BREAK\|ABSENT\|OFF}` | `{status}` · `422` *Duty status applies to staff accounts* |
| `GET staff/orders` | `manage:orders` | — | `{orders}` (newest 300) |
| `PATCH staff/orders/:id/status` | `manage:orders` | `{status: PENDING\|PREPARING\|READY\|COMPLETED\|CANCELED}` | `{ok}`. COMPLETED emails the customer |
| `GET staff/floor` | `manage:orders` | — | `{tables, waiters}` |
| `PATCH staff/tables/:id/state` | `operate:floor` | `{state: AVAILABLE\|RESERVED\|OCCUPIED\|WAITING_PAYMENT\|CLEANING\|OUT_OF_SERVICE}` | `{ok}` |
| `GET staff/pos/:tableId` | `manage:orders` | — | POS view `{table, session, menu, mergeTargets, waiters}` · `404` *Table not found* |
| `POST staff/pos/:tableId/open` | `operate:floor` | `{customerCount, waiterId?, customerName?}` | POS view |
| `POST staff/sessions/:id/items` | `manage:orders` | `{items:[{menuItemId, qty 1–50}]}` | POS view (one KOT) |
| `POST staff/sessions/:id/void` | `manage:orders` | `{menuItemId}` | POS view |
| `PUT staff/sessions/:id/billing` | `manage:orders` | `{discount, tax, serviceCharge, tip}` | POS view |
| `POST staff/sessions/:id/payments` | `manage:orders` | `{amount, method}` | POS view · `400` *Enter an amount* |
| `POST staff/sessions/:id/close` | `operate:floor` | `{paymentMethod?}` | POS view (`session: null`). The table goes to CLEANING |
| `POST staff/sessions/:id/merge` | `manage:orders` | `{intoSessionId}` | POS view of the source table |
| `GET staff/tables` | `manage:tables` | — | `{tables, websiteUrl}` |
| `POST staff/tables` | `manage:tables` | `{number, name?, status: ACTIVE\|INACTIVE}` | `{table}` |
| `PUT staff/tables/:id` | `manage:tables` | same | `{ok}` |
| `DELETE staff/tables/:id` | `manage:tables` | — | `{ok}` |
| `GET staff/table-analytics?days=` | `view:reports` | `days` 1–365 (default 1) | `{analytics}` |
| `GET staff/table-history/:tableId?days=` | `view:reports` | `days` (default 30) | `{history: {table, sessions}}` |
| `GET staff/reservations` | `manage:reservations` | — | `{reservations}` |
| `PATCH staff/reservations/:id/status` | `manage:reservations` | `{status: REQUESTED\|CONFIRMED\|SEATED\|COMPLETED\|CANCELED\|NO_SHOW}` | `{ok}`. COMPLETED sends the thank-you email |
| `PUT staff/reservations/:id` | `manage:reservations` | any of `{date, time, guests, occasion, requests}` | `{ok}` |
| `GET staff/menu` | `manage:orders` | — | `{items (incl. unavailable), categories:[{id, name, active, itemCount}]}` |
| `POST staff/menu` | `manage:menu` | `{name, description, price, rating, tag, category, imageUrl, available}` | `{ok}` |
| `PUT staff/menu/:id` | `manage:menu` | same | `{ok}` |
| `DELETE staff/menu/:id` | `manage:menu` | — | `{ok}` · `409` if the item was ever ordered |
| `PATCH staff/menu/:id/availability` | `manage:menu` | `{available}` | `{ok}` |
| `PATCH staff/categories/:id` | `manage:menu` | `{active}` | `{ok}` |
| `GET staff/inventory` | `manage:inventory` | — | `{items}` |
| `POST staff/inventory` | `manage:inventory` | `{name, category, unit, quantity, reorderLevel, costPerUnit, supplier?}` | `{ok}` |
| `PUT staff/inventory/:id` | `manage:inventory` | same | `{ok}` |
| `POST staff/inventory/:id/adjust` | `manage:inventory` | `{delta}` | `{ok}` (never below 0) |
| `DELETE staff/inventory/:id` | `manage:inventory` | — | `{ok}` |
| `GET staff/staff` | `manage:staff` | — | `{employees, roles}` |
| `POST staff/staff` | `manage:staff` | `{name, email, phone?, password?, role, active}` | `{ok}` |
| `PUT staff/staff/:id` | `manage:staff` | same (empty password keeps the old one) | `{ok}` |
| `PATCH staff/staff/:id/status` | `manage:staff` | `{status}` | `{ok}` |
| `PATCH staff/staff/:id/active` | `manage:staff` | `{active}` | `{ok}` |
| `DELETE staff/staff/:id` | `manage:staff` | — | `{ok}` |
| `GET staff/customers` | `manage:customers` | — | `{customers}` with orders, reservations, `totalSpend`, `lastActivity` |
| `POST staff/customers` | `manage:customers` | `{name, email, phone?, address?, status: ACTIVE\|INACTIVE}` | `{ok}` |
| `PUT staff/customers/:id` | `manage:customers` | same | `{ok}` |
| `DELETE staff/customers/:id` | `manage:customers` | — | `{ok}` |
| `GET staff/gift-cards` | `manage:coupons` | — | `{giftCards}` |
| `PATCH staff/gift-cards/:id/status` | `manage:coupons` | `{status: PENDING_PAYMENT\|PAID\|ACTIVE\|REDEEMED\|EXPIRED\|CANCELLED}` | `{ok}`. REDEEMED emails the customer |
| `DELETE staff/gift-cards/:id` | `manage:coupons` | — | `{ok}` |
| `GET staff/reports` | `view:reports` | — | `{reports: {summary, revenueByOutlet, topItems, categoryMix, orderTypes, paymentMix}}` |
| `GET staff/transactions` | `view:reports` | — | `{transactions}` (orders, gift cards and table payments, newest 300) |
| `GET staff/outlets` | `manage:outlets` | — | `{outlets}` with weekly revenue and cost |
| `GET staff/settings` | `manage:settings` | — | `{profile, team}` |
| `PUT staff/settings` | `manage:settings` | `{name, currency, timezone, address, phone, email}` | `{profile}` |
| `GET staff/audit?limit=` | `manage:settings` | `limit` (default 150, max 500) | `{logs}` |

### Validation values

| Field | Allowed values |
|---|---|
| Menu `category` | Breakfast, Starters, Main Meals, Fish, Pasta & Salads, Desserts, Drinks |
| Menu `imageUrl` | A full URL (*Enter a valid image URL*) |
| Inventory `category` | Produce, Meat & Fish, Dairy, Beverage, Dry Goods, Bakery |
| Staff `role` | Super Admin, Manager, Cashier, Kitchen Staff, Waiter |
| POS payment `method` | Any string. The app sends Cash, Credit Card, Debit Card, UPI or Wallet. A close with several methods is stored as `Mixed` |

### Audit entries

Only POS and floor actions write to `auditLogs`: `session.open`, `order.add`, `order.void`, `payment.add`, `session.merge`, `session.close`, `table.state`. Each entry stores the user name from the token.

### Error mapping

Staff and customer routes return `503` *The restaurant database is unavailable. Please try again shortly.* when an update or delete targets an id that does not exist. This matches the previous version. See [Errors](doc:api/errors).

**Next:** [Admin API →](doc:api/admin)
