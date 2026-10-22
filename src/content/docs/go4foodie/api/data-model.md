---
title: Data Model
description: Every Cloud Firestore collection used by Go4Foodie, with its key fields, the server-only credentials collection, and how relations are enforced in code.
---

Go4Foodie stores everything in **Cloud Firestore** (database `(default)`, `asia-south1`). There is one collection per business entity. Document IDs are cuid strings. When you import from the previous MySQL version ([Data Migration](doc:installation/data-migration)), the original row IDs are kept, so every reference (`tableId`, `sessionId`, `customerId`, …) still resolves.

## Types

| Value | Stored as |
|---|---|
| Dates and times | Firestore `Timestamp` (UTC). The API returns ISO strings |
| Money, quantities, ratings | number |
| Flags | boolean |
| Enums | upper-case strings (`PENDING`, `DINE_IN`, …) |
| Empty values | `null` (fields are always present) |

## Collections

| Collection | Key fields |
|---|---|
| `orders` | `number` (`ORD-#####`, unique), `type` (`PICKUP` · `DINE_IN` · `DELIVERY`), `status` (`PENDING` · `PREPARING` · `READY` · `COMPLETED` · `CANCELED`), `channel` (`ONLINE` · `POS`), `total`, `paymentMethod`, `paymentProvider`, `razorpayPaymentId` (payment reference for every provider), `customerName`, `customerEmail`, `customerPhone`, `customerId`, `outletId`, `tableId`, `tableNumber`, `sessionId`, `scheduleType` (`NOW` · `LATER`), `scheduleDate`, `scheduleTime`, `notes`, **`items: [{id, menuItemId, name, qty, price}]`** (embedded), `createdAt`, `updatedAt` |
| `tables` | `number` (unique), `name`, `code` (QR token, unique), `status` (`ACTIVE` · `INACTIVE`, whether QR ordering is enabled), `state` (`AVAILABLE` · `RESERVED` · `OCCUPIED` · `WAITING_PAYMENT` · `CLEANING` · `OUT_OF_SERVICE`), `capacity` (default 4) |
| `tableSessions` | `tableId`, `status` (`OPEN` · `CLOSED`), `openedAt`, `closedAt`, `customerCount`, `customerName`, `customerId`, `waiterId`, `subtotal`, `discount`, `tax`, `serviceCharge`, `tip`, `total`, `paymentMethod` (single method or `Mixed`), `paymentStatus`, `notes` |
| `payments` | `sessionId`, `amount`, `method`, `createdAt` (POS part payments) |
| `reservations` | `reference` (`SV-######` / `EV-######`, unique), `kind` (`TABLE` · `PRIVATE_EVENT`), `status` (`REQUESTED` · `CONFIRMED` · `SEATED` · `COMPLETED` · `CANCELED` · `NO_SHOW`), `date` (UTC midnight of the day), `time`, `guests`, `occasion`, `requests`, `eventType`, `guestRange`, `space`, `company`, `message`, `name`, `email`, `phone`, `customerId`, `outletId` |
| `menuItems` | `name`, `description`, `price`, `rating`, `tag`, `imageUrl`, `available`, `categoryId` → `categories`, `outletId` |
| `categories` | `name` (unique), `active` (an inactive category hides its items from the website and the app) |
| `customers` | `name`, `email`, `emailLower`, `phone`, `address`, `status` (`ACTIVE` · `INACTIVE`) |
| `giftCards` | `code` (`GIFT-` / `COUPON-` + 6 characters, unique), `kind` (`GIFT_CARD` · `COUPON`), `amount`, `message`, `customerName`, `customerEmail`, `customerId`, `expiryDate` (coupons: +365 days), `status` (`PENDING_PAYMENT` · `PAID` · `ACTIVE` · `REDEEMED` · `EXPIRED` · `CANCELLED`), `paymentStatus` (`PENDING` · `PAID` · `FAILED`), `paymentProvider`, `razorpayPaymentId` |
| `employees` | `name`, `role` (Super Admin · Manager · Cashier · Kitchen Staff · Waiter), `email`, `emailLower`, `phone`, `status` (`ON_DUTY` · `ON_BREAK` · `ABSENT` · `OFF`), `active`, `outletId`, `avatarUrl`, `userId` |
| `users` | Admin logins: `name`, `email`, `emailLower`, `role` (`OWNER` · `MANAGER` · `STAFF`), `outletId` |
| `inventoryItems` | `name`, `category` (Produce · Meat & Fish · Dairy · Beverage · Dry Goods · Bakery), `unit`, `quantity`, `reorderLevel` (low stock when `quantity ≤ reorderLevel`), `costPerUnit`, `supplier`, `outletId` |
| `outlets` | `name` (unique), `location`, `address`, `phone`, `manager`, `isActive` |
| `outletMetrics` | `outletId`, `periodStart`, `revenue`, `operationalCost` (weekly revenue vs cost charts) |
| `auditLogs` | `action` (`session.open`, `order.add`, `order.void`, `payment.add`, `session.merge`, `session.close`, `table.state`, …), `entity`, `entityId`, `detail`, `userId`, `userName`, `createdAt` |
| `restaurantProfile/default` | Single document: `name`, `currency`, `timezone`, `address`, `phone`, `email` (defaults *Go4Foodie*, `USD`, `America/New_York`) |
| `dashboardConfig/default` | Single document: `trendingItemId`, `topCategories` (JSON string of up to 3 `{name, percent}`) |
| `credentials` | **Server-only.** Document ID `<kind>_<id>` (`user_…`, `employee_…`, `customer_…`): `kind`, `refId`, `email` (lower case), `passwordHash` (bcrypt) |

Most documents also have `createdAt` and `updatedAt`.

:::danger credentials is never readable by clients
Password hashes are kept **out of** `users`, `employees` and `customers`, in `credentials`. The Firestore rules deny every client read and write on it. Only the `api` function (Admin SDK) reads it to check logins. A customer or employee without a `credentials` hash (a website guest, or staff without an app password) cannot sign in.
:::

## Security rules

```js title="firebase/firestore.rules"
match /{coll}/{id} {
  allow read: if isAdmin() && coll in ['tables', 'tableSessions', 'orders', 'payments', 'reservations', 'inventoryItems'];
  allow write: if false;
}
match /{document=**} { allow read, write: if false; }
```

`isAdmin()` means a Firebase Auth user whose token claim `kind == "user"`, which the admin login sets. All writes go through the API. Cloud Storage rules deny all client access. Uploads are written and served by the function (`uploads/` folder).

## Relations (enforced in code)

Firestore has no foreign keys. The function applies the previous database's rules itself:

| Relation | Behaviour |
|---|---|
| `orders.items[].menuItemId` → `menuItems` | **Restrict**: deleting a menu item that was ever ordered returns `409`. Mark it unavailable instead |
| `menuItems.categoryId` → `categories` | Categories are never deleted. A new category name is created on first use |
| `customerId` on orders, reservations, gift cards and sessions | **Set null** when the customer is deleted (their `credentials` document is removed too) |
| `tableSessions.waiterId` → `employees` | **Set null** when the employee is deleted |
| `tableSessions.tableId` → `tables` | **Cascade**: deleting a table deletes its sessions and their payments. `orders.sessionId` and `orders.tableId` are set to null |
| Unique keys | Checked before insert: order number, reservation reference, gift code, table number, customer email, category name |

## Indexes

The queries need only single-field indexes, which Firestore creates automatically. Aggregates (dashboard, reports, analytics) are computed in the function on read.

**Next:** [Errors →](doc:api/errors)
