---
title: Admin API
description: Every /api/admin endpoint used by the Flutter Web Admin Panel, with the permission each route checks.
---

Base path **`/api/admin`**. Every route except `auth/login` needs `Authorization: Bearer <Firebase ID token>` from an admin login. A missing or invalid token returns `401` `{"error":"Unauthorized"}`. The **Route permission** is checked first (`403`). Some actions check another permission inside the action ("Action also needs").

Validation errors return `400` `{error, issues, errors}`. `errors` is a `{field: [messages]}` map for the forms. A missing id returns `404` `{"error":"Not found"}`.

## Auth & layout

| Method & path | Route permission | Body | Response |
|---|---|---|---|
| `POST auth/login` | public | `{email, password}` | `{token (Firebase custom token), user {id, name, email, role, permissions}}` · `401` *Invalid email or password.* |
| `GET me` | signed in | — | `{user, attentionCount}` |

## Dashboard

| Method & path | Route permission | Action also needs | Body / response |
|---|---|---|---|
| `GET dashboard` | signed in | — | `{data, editable, menuOptions, categoryOptions, currentItemId}` (`editable` = has `manage:menu`) |
| `POST dashboard/trending` | signed in | `manage:menu` | `{itemId \| null}`. `null` returns to the automatic trending item |
| `POST dashboard/top-categories` | signed in | `manage:menu` | `{categories: [{name, percent}] \| null}` (first 3 kept) |

## Orders & menu

| Method & path | Route permission | Body / response |
|---|---|---|
| `GET orders` | `manage:orders` | `{orders}` |
| `PATCH orders/:id/status` | `manage:orders` | `{status: PENDING\|PREPARING\|READY\|COMPLETED\|CANCELED}` |
| `GET menu` | `manage:menu` | `{items, categories, menuCategories}` |
| `POST menu/items` | `manage:menu` | `{name, description, price, rating?, tag?, category, imageUrl, available?}` → `{ok, items, categories}` |
| `PUT menu/items/:id` | `manage:menu` | same → `{ok}` |
| `DELETE menu/items/:id` | `manage:menu` | `409` *This item has been ordered before and cannot be deleted. Mark it unavailable instead.* |
| `PATCH menu/items/:id/availability` | `manage:menu` | `{available: boolean}` |
| `PATCH menu/categories/:id/active` | `manage:menu` | `{active: boolean}` |

## Reservations & tables

| Method & path | Route permission | Body / response |
|---|---|---|
| `GET reservations` | `manage:reservations` | `{reservations}` |
| `PATCH reservations/:id/status` | `manage:reservations` | `{status: REQUESTED\|CONFIRMED\|SEATED\|COMPLETED\|CANCELED\|NO_SHOW}` |
| `PATCH reservations/:id` | `manage:reservations` | Partial `{date (YYYY-MM-DD), time, guests ≥ 1, occasion, requests}`. Only the keys sent are changed |
| `GET tables` | `manage:tables` | `{tables, websiteUrl}` (`WEBSITE_URL`, used to build the QR URLs) |
| `POST tables` | `manage:tables` | `{number, name?, status?}` → `{ok, table}` · `409` *Table number N already exists* |
| `PUT tables/:id` | `manage:tables` | same → `{ok}` |
| `PATCH tables/:id/status` | `manage:tables` | `{status: ACTIVE\|INACTIVE}` |
| `DELETE tables/:id` | `manage:tables` | Deletes its sessions and their payments, and unlinks its orders |

## Live floor

| Method & path | Route permission | Action also needs | Body / response |
|---|---|---|---|
| `GET floor` | `manage:tables` | — | `{tables, waiters, paymentMethods, states}` |
| `GET floor/data` | `manage:tables` | — | `{tables}` |
| `POST floor/tables/:tableId/open` | `manage:tables` | `operate:floor` | `{customerCount ≥ 1, waiterId?, customerName? (max 120)}` → `{ok, tables}` |
| `POST floor/sessions/:sessionId/close` | `manage:tables` | `operate:floor` | `{paymentMethod?}` (default `Cash`) → `{ok, tables}` |
| `PATCH floor/tables/:tableId/state` | `manage:tables` | `operate:floor` | `{state}` |

Live updates do not use these endpoints. The admin listens to Firestore (`tables`, `tableSessions`, `orders`, `payments`) directly.

## POS

| Method & path | Route permission | Action also needs | Body / response |
|---|---|---|---|
| `GET pos/:tableId` | `manage:orders` | — | `{table, session, menu, waiters, mergeTargets, paymentMethods}` · `404` |
| `GET pos/:tableId/data` | `manage:orders` | — | `{ok, table, session, mergeTargets}` |
| `POST pos/:tableId/open` | `manage:orders` | `operate:floor` | `{customerCount, waiterId?, customerName?}` |
| `POST pos/sessions/:sessionId/orders` | `manage:orders` | — | `{tableId, items:[{menuItemId, qty ≥ 1}]}`: sends one KOT |
| `POST pos/sessions/:sessionId/decrement` | `manage:orders` | — | `{tableId, menuItemId}`: removes one unit (void) |
| `PATCH pos/sessions/:sessionId/billing` | `manage:orders` | — | `{tableId?, discount, tax, serviceCharge, tip}` |
| `POST pos/sessions/:sessionId/merge` | `manage:orders` | — | `{tableId, fromSessionId}`: merges `fromSessionId` into `:sessionId` |
| `POST pos/sessions/:sessionId/payments` | `manage:orders` | — | `{tableId, amount > 0, method (max 50)}` |
| `POST pos/sessions/:sessionId/close` | `manage:orders` | `operate:floor` | `{discount, tax, serviceCharge, tip, paymentMethod?}` → `{ok, redirect: "/floor"}` |

POS mutations return `{ok, table, session, mergeTargets}`. Payment methods: Cash, Credit Card, Debit Card, UPI, Wallet, Mixed.

## Analytics & reports

| Method & path | Route permission | Query / response |
|---|---|---|
| `GET table-analytics` | `view:reports` | `days` = 1, 7 or 30 (default 1) → `{data}` |
| `GET table-history/:tableId` | `view:reports` | `days` = 1, 7 or 30 (default 30) → `{data, days}` |
| `GET transactions` | `view:reports` | `{transactions}` |
| `GET reports` | `view:reports` | `{data}` |
| `GET outlets` | `manage:outlets` | `{outlets}` |
| `GET notifications` | signed in | `{notifications}` |
| `GET audit` | `manage:settings` | `{logs}` (latest 200) |

## Staff, customers, gift cards, inventory

| Method & path | Route permission | Body / response |
|---|---|---|
| `GET staff` | `manage:staff` | `{employees, roles}` |
| `POST staff` | `manage:staff` | `{name, email, phone?, password?, role, active?}` → `{ok, employees}` |
| `PUT staff/:id` | `manage:staff` | same. An empty password keeps the old one |
| `PATCH staff/:id/status` | `manage:staff` | `{status: ON_DUTY\|ON_BREAK\|ABSENT\|OFF}` |
| `PATCH staff/:id/active` | `manage:staff` | `{active: boolean}` |
| `DELETE staff/:id` | `manage:staff` | Also removes the employee's credentials and unassigns them from sessions |
| `GET customers` | `manage:customers` | `{customers}` |
| `POST customers` | `manage:customers` | `{name, email, phone?, address?, status?}` → `{ok, customers}` · `409` *A customer with this email already exists* |
| `PUT customers/:id` | `manage:customers` | same |
| `DELETE customers/:id` | `manage:customers` | Unlinks their orders, reservations, gift cards and sessions |
| `GET gift-cards` | `manage:coupons` | `{cards}` |
| `PUT gift-cards/:id` | `manage:coupons` | `{customerName (min 2), customerEmail?, kind: GIFT_CARD\|COUPON, amount > 0, status, paymentStatus: PENDING\|PAID\|FAILED, expiryDate? (YYYY-MM-DD)}` |
| `PATCH gift-cards/:id/status` | `manage:coupons` | `{status: PENDING_PAYMENT\|PAID\|ACTIVE\|REDEEMED\|EXPIRED\|CANCELLED}` |
| `DELETE gift-cards/:id` | `manage:coupons` | — |
| `GET inventory` | `manage:inventory` | `{items, categories}` |
| `POST inventory` | `manage:inventory` | `{name, category, unit, quantity, reorderLevel, costPerUnit, supplier?}` → `{ok, items}` |
| `PUT inventory/:id` | `manage:inventory` | same |
| `PATCH inventory/:id/adjust` | `manage:inventory` | `{delta}` (never below 0) |
| `DELETE inventory/:id` | `manage:inventory` | — |

## Settings

| Method & path | Route permission | Body / response |
|---|---|---|
| `GET settings` | `manage:settings` | `{profile, team, account}` |
| `PUT settings/profile` | `manage:settings` | `{name, currency, timezone, address?, phone?, email?}` |
| `POST settings/password` | `manage:settings` | `{currentPassword, newPassword (min 6)}` → `{ok: true}` or `{ok: false, error: "Current password is incorrect"}` |

Image uploads from the menu form use [`POST /api/upload`](doc:api/public) with the same ID token.

**Next:** [Data Model →](doc:api/data-model)
