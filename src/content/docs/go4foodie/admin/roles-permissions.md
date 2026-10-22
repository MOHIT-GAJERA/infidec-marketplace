---
title: Roles & Permissions
description: The three admin roles (Owner, Manager, Staff), the 13 permissions, the full role × permission matrix, the sidebar each role sees, and how employees map to roles in the Restaurant App.
---

Go4Foodie has **three fixed roles**. Each role has a set of **permissions**, and every screen, button and API call checks them on the server. The panel hides what you can't use, and the backend refuses it anyway (`403 You do not have permission for this action`).

![Settings → Roles & Permissions](/docs/go4foodie/images/admin-settings.jpg "Settings → Roles & Permissions card")

| Role | Label | Intended for |
|---|---|---|
| `OWNER` | Owner | The restaurant owner. Can do everything |
| `MANAGER` | Manager | Day-to-day operations. Everything except settings and the audit log |
| `STAFF` | Staff | Front-of-house. Dashboard, orders and reservations, and operating the floor |

The role is shown under your name in the top-right user menu.

## The 13 permissions

| Permission | Grants |
|---|---|
| `view:dashboard` | Overview dashboard (every role) |
| `manage:menu` | [Menu](doc:admin/menu), and the edit pencils on the [Dashboard](doc:admin/dashboard) |
| `manage:orders` | [Orders](doc:admin/orders) and [POS](doc:admin/pos) (add items, void, billing, split payments, merge) |
| `manage:reservations` | [Reservations](doc:admin/reservations) |
| `manage:tables` | [Tables & QR codes](doc:admin/tables) and the [Floor](doc:admin/floor) page |
| `operate:floor` | Open and close table sessions, change a table's live state |
| `manage:coupons` | [Gift Cards & Coupons](doc:admin/gift-cards) |
| `manage:outlets` | [Outlets](doc:admin/outlets) |
| `manage:staff` | [Staff](doc:admin/staff) |
| `manage:customers` | [Customers](doc:admin/customers) |
| `manage:inventory` | [Inventory](doc:admin/inventory) |
| `view:reports` | [Reports](doc:admin/reports), [Table Analytics & History](doc:admin/table-analytics), [Transactions](doc:admin/transactions) |
| `manage:settings` | [Settings](doc:admin/settings) (incl. change password) and the [Audit Log](doc:admin/audit-log) |

## Role × permission matrix

| Permission | OWNER | MANAGER | STAFF |
|---|---|---|---|
| `view:dashboard` | ✓ | ✓ | ✓ |
| `manage:menu` | ✓ | ✓ | — |
| `manage:orders` | ✓ | ✓ | ✓ |
| `manage:reservations` | ✓ | ✓ | ✓ |
| `manage:tables` | ✓ | ✓ | — |
| `operate:floor` | ✓ | ✓ | ✓ |
| `manage:coupons` | ✓ | ✓ | — |
| `manage:outlets` | ✓ | ✓ | — |
| `manage:staff` | ✓ | ✓ | — |
| `manage:customers` | ✓ | ✓ | — |
| `manage:inventory` | ✓ | ✓ | — |
| `view:reports` | ✓ | ✓ | — |
| `manage:settings` | ✓ | — | — |

The **Roles & Permissions** card in [Settings](doc:admin/settings) shows the same matrix for 10 modules. It leaves out `manage:tables`, `operate:floor` and `manage:coupons`.

## Sidebar by role

| # | Icon | Page | Permission | OWNER | MANAGER | STAFF |
|---|---|---|---|---|---|---|
| 1 | Grid | Overview | `view:dashboard` | ✓ | ✓ | ✓ |
| 2 | Cart | Orders | `manage:orders` | ✓ | ✓ | ✓ |
| 3 | Clipboard | Menu | `manage:menu` | ✓ | ✓ | — |
| 4 | Calendar | Reservations | `manage:reservations` | ✓ | ✓ | ✓ |
| 5 | QR code | Tables | `manage:tables` | ✓ | ✓ | — |
| 6 | Floor plan | Floor | `manage:tables` | ✓ | ✓ | — |
| 7 | Activity | Table Analytics | `view:reports` | ✓ | ✓ | — |
| 8 | People | Staff | `manage:staff` | ✓ | ✓ | — |
| 9 | Contact card | Customers | `manage:customers` | ✓ | ✓ | — |
| 10 | Gift | Gift Cards | `manage:coupons` | ✓ | ✓ | — |
| 11 | Credit card | Transactions | `view:reports` | ✓ | ✓ | — |
| 12 | Package | Inventory | `manage:inventory` | ✓ | ✓ | — |
| 13 | Bar chart | Reports | `view:reports` | ✓ | ✓ | — |
| bottom | Scroll | Audit Log | `manage:settings` | ✓ | — | — |
| | | **Icons shown** | | **14** | **13** | **3** |

Pages without a sidebar icon:

| Page | Reached from | Permission |
|---|---|---|
| Outlets (`/outlets`) | Direct URL only | `manage:outlets` |
| POS (`/pos/<tableId>`) | Floor → **Open POS** | `manage:orders` |
| Table History (`/table-history/<tableId>`) | Table Analytics, Floor → **History** | `view:reports` |
| Notifications | Bell in the top bar | any signed-in user |
| Settings | User menu → **Settings** | `manage:settings` |

Opening a page without the permission (from a bookmark or a typed URL) sends you to the **Overview** with the toast *"You do not have permission for that page."*

## Gotchas

:::warning Staff can't open the Floor
The Floor page needs `manage:tables`, which **STAFF** lacks, even though Staff have `operate:floor`. Staff can open a POS by URL, but **Back to floor** and the redirect after **Close & Pay** bounce them to the dashboard. Give waiters and cashiers the **Restaurant App** instead (below).
:::

:::warning Only the Owner can change passwords in the panel
**Settings** (and its *Change Password* card) needs `manage:settings`. The user menu shows **Settings** to everyone, but Managers and Staff are redirected. The owner must set their passwords. See [Admin users](doc:installation/admin-users).
:::

- The Dashboard's **Trending** and **Top Categories** edit pencils need `manage:menu`, so Staff don't see them.
- Closing a table needs `operate:floor`. POS billing actions (add items, void, discount/tax/service/tip, split payment, merge) need `manage:orders`.

## Admin users vs employees

| | Admin users | Employees |
|---|---|---|
| Stored in | `users` | `employees` |
| Managed in | [Admin users](doc:installation/admin-users) (setup) · listed in Settings → **Team** | [Staff](doc:admin/staff) |
| Role field | `OWNER`, `MANAGER` or `STAFF` | Job title: Super Admin, Manager, Cashier, Kitchen Staff, Waiter |
| Signs in to | Admin panel, Restaurant App, Owner App (`OWNER` only) | Restaurant App |

When an **employee** signs in to the Restaurant App, their job title is mapped to a permission role:

| Employee role | Acts as |
|---|---|
| Super Admin, Manager | `MANAGER` |
| Cashier, Kitchen Staff, Waiter (any other title) | `STAFF` |

The **Owner App** accepts only `OWNER` admin users (*"Owner access only. Use the Restaurant app."*). See [Restaurant App](doc:app/restaurant) and [Owner App](doc:app/owner).

:::note When role changes take effect
An admin user's role is stored in their sign-in token, so a role change in Firestore takes effect at the user's **next sign-in**. Ask them to use **Sign out** in the user menu and sign in again.
:::

## Changing what a role can do

Roles aren't editable in the panel. They are defined in code:

```ts title="firebase/functions/src/lib/rbac.ts"
const PERMISSIONS = {
  OWNER: '*',
  MANAGER: ['view:dashboard', 'manage:menu', 'manage:orders', 'manage:reservations', 'manage:tables',
            'operate:floor', 'manage:coupons', 'manage:outlets', 'manage:staff', 'manage:customers',
            'manage:inventory', 'view:reports'],
  STAFF: ['view:dashboard', 'manage:orders', 'manage:reservations', 'operate:floor'],
};
```

For example, to let Staff use the Floor page, add `'manage:tables'` to `STAFF`. Note that this also lets them edit the table list and QR codes. Then:

- [x] Edit `rbac.ts` and redeploy the function (`firebase deploy --only functions`). The backend and the sidebar follow automatically, because the panel reads your permissions from `/api/admin/me`.
- [x] Update the read-only matrix in `admin-app/lib/pages/settings_page.dart` (`_rbac`) so the Settings card matches, then rebuild and deploy the admin panel ([Admin panel](doc:installation/admin-panel)).
- [x] Ask affected users to sign out and in again.

**Next:** [Payment gateways →](doc:admin/payment-gateways)
