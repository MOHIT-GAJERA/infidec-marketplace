---
title: Data Migration
description: Import an existing Go4Foodie MySQL database into Firestore with migrate.mjs, which can dry-run, merge or reset, and moves passwords into the locked credentials collection.
---

If you already run Go4Foodie on a MySQL server (the older Laravel version), `firebase/migration/migrate.mjs` copies the whole database into Firestore. That includes menu, tables, orders, reservations, staff, customers, gift cards, inventory and logins. Afterwards everyone signs in with their existing password.

:::note Starting fresh?
Skip this page. A new installation starts with an empty database. Create your Owner on [Admin Users](doc:installation/admin-users), then build the restaurant in the panel ([Setup Guide](doc:installation/setup-guide)).
:::

## What the script does

- Reads a **`mysqldump`** file. It parses the `CREATE TABLE` and `INSERT INTO` statements, so no MySQL server is needed on your computer.
- Writes **one collection per table**, and **keeps every row id as the document id**, so all references (`outletId`, `tableId`, `sessionId`…) still resolve.
- Converts types: `datetime` → Firestore `Timestamp` (UTC), numbers → number, `tinyint(1)` → boolean, `NULL` → `null`.
- **Embeds order items** into each order (`orders/{id}.items[]`) instead of a separate collection.
- Adds `emailLower` to customers, employees and users, for case-insensitive login.
- **Moves every password hash** out of `User`, `Employee` and `Customer` into `credentials/{kind}_{id}` (`kind` = `user`, `employee` or `customer`). Clients can never read that collection.

| MySQL table | Firestore collection |
|---|---|
| `AuditLog` | `auditLogs` |
| `Category` | `categories` |
| `Customer` | `customers` (+ `credentials/customer_<id>`) |
| `DashboardConfig` | `dashboardConfig` |
| `Employee` | `employees` (+ `credentials/employee_<id>`) |
| `GiftCard` | `giftCards` |
| `InventoryItem` | `inventoryItems` |
| `MenuItem` | `menuItems` |
| `Order` + `OrderItem` | `orders` (items embedded) |
| `Outlet` | `outlets` |
| `OutletMetric` | `outletMetrics` |
| `Payment` | `payments` |
| `Reservation` | `reservations` |
| `RestaurantProfile` | `restaurantProfile` |
| `Table` | `tables` |
| `TableSession` | `tableSessions` |
| `User` | `users` (+ `credentials/user_<id>`) |

The full field list is in [API Reference → Data Model](doc:api/data-model).

## 1. Export the MySQL database

On the old server:

```bash
mysqldump -u root -p restaurant_db > restaurant_db.sql
```

Copy the file to your computer and keep it **outside** any folder you commit to Git. By default the script looks for `secrets/restaurant_db.sql` at the package root.

## 2. Get a service-account key

The script writes with the Firebase Admin SDK and needs a key for **your** project:

1. Firebase console → ⚙ **Project settings → Service accounts → Generate new private key**.
2. Save the JSON file outside the project, or in `secrets/` at the package root (keep that folder out of Git).

:::danger Treat the key like a password
The key grants full access to your project. Delete it (and revoke it under Service accounts → *Manage keys*) once the migration is done.
:::

## 3. Install and dry-run

```bash
cd firebase/migration
npm install
node migrate.mjs --dry-run --dump /secure/path/restaurant_db.sql
```

A dry run parses the dump and writes **nothing**. It prints the row count per MySQL table, the number of Firestore documents per collection, and one sample order. It also warns about order items whose order is missing. Check the counts against your old database before going on.

## 4. Import

```bash
node migrate.mjs --dump /secure/path/restaurant_db.sql --key /secure/path/yourrestaurant-admin-key.json
```

| Option | Effect |
|---|---|
| *(none)* | Writes every document by id. Re-running is safe: the same document is overwritten with the same data and nothing is duplicated |
| `--reset` | First **deletes every document** in all the managed collections (including `credentials`), then writes. Firestore becomes an exact copy of the dump |
| `--dry-run` | Parse and report only |
| `--dump <file>` | Path to the `.sql` file (default `secrets/restaurant_db.sql`) |
| `--key <file>` | Service-account JSON for your project. The default is a fixed file name in `secrets/`, so always pass `--key` |

The script ends with *"Wrote N documents (0 failed)."*

:::warning `--reset` deletes everything in those collections
Use it for the **final cut-over**, or to undo test data. Anything created in Firestore since the dump is lost, including orders, logins and admin users you created by hand. Take a Firestore export first ([Backups](doc:installation/backups)).
:::

## Cut-over from a live server

1. Pick a quiet hour and stop taking orders on the old server (maintenance page).
2. Take a fresh `mysqldump`.
3. Copy any locally uploaded images from the old upload folder to Storage `uploads/` with the same file names. `/api/uploads/<name>` URLs keep working. Images stored as external URLs need nothing.
4. `node migrate.mjs --reset --dump … --key …`
5. Point the website and the mobile app at the new API ([Hosting, Domain & SSL](doc:installation/hosting)).
6. Watch `firebase functions:log` for a day, then shut the old server down.

:::tip Keep app logins working
Mobile app tokens are signed with `AUTH_SECRET`. If you set the **same** value as on the old server ([Deploy the Backend → secrets](doc:installation/backend-deploy#4-create-the-secrets)), staff and customers stay signed in through the switch.
:::

## After the import

- Sign in to the admin panel with an existing **OWNER** user. Passwords are unchanged (bcrypt `$2y$` / `$2b$` hashes are both accepted).
- Open **Floor**, **Orders** and **Reports** and compare a few numbers with the old system.
- Delete the service-account key.

**Next:** [Admin Users →](doc:installation/admin-users)
