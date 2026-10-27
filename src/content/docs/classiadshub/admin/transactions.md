---
title: Subscriptions & Transactions
description: Follow every package subscription and payment, cancel subscriptions, refund completed payments and approve or reject bank transfers.
---

Three pages under **Admin → Package Management** show what users bought and paid:

| Page | Shows | Data |
|---|---|---|
| **User Subscriptions** | Every package subscription and its quota use | `subscriptions` |
| **Payment Transactions** | Every payment, any gateway | `transactions` (+ `invoices`) |
| **Bank Transfer** | Only transactions paid by bank transfer, with the receipt | `transactions` where `gateway = bank_transfer` |

**User Subscriptions** needs the **Packages** permission. **Payment Transactions** and **Bank Transfer** need the **Transactions** permission (see [Roles, Staff & Permissions](doc:admin/roles-permissions)).

## User Subscriptions

![User Subscriptions](/docs/classiadshub/images/admin-user-subscriptions.jpg "Package Management → User Subscriptions")

**Status** filter: *All*, *Active*, *Pending*, *Expired*, *Cancelled*. The toolbar has **Refresh**, **Columns** and **Export CSV** (`user-subscriptions.csv`).

| Column | Shows |
|---|---|
| **User Name** | Avatar, name and email |
| **Package Name** | The package bought |
| **Start Date** / **End Date** | Activation date and end date, or *Unlimited* |
| **Status** | `active`, `pending`, `expired`, `cancelled` |
| **Total Limit** | Ad limit, or *Unlimited* |
| **Used Limit** | Ads posted with this subscription (`ads_used`) |
| **Action** | **Cancel subscription** (only for active ones) |

An active subscription whose end date has passed is shown as **Expired** even before the hourly `housekeeping` job updates it.

| Status | Meaning |
|---|---|
| `pending` | Checkout started, payment not confirmed yet |
| `active` | Paid (or free / assigned). Gives posting quota |
| `expired` | End date passed |
| `cancelled` | Cancelled by an admin, refunded, or its bank transfer was rejected |

**Cancel subscription** asks *"Cancel {name}'s {package} subscription?"* and sets it to `cancelled`. The transaction is not refunded. Ads already posted stay live.

## Payment Transactions

![Payment Transactions](/docs/classiadshub/images/admin-transactions.jpg "Package Management → Payment Transactions")

Filters: **Status** (*Succeed*, *Pending*, *Failed*, *Refunded*) and **Gateway** (every gateway in [Payment Gateways](doc:admin/payment-gateways)). Export: `transactions.csv`.

| Column | Shows |
|---|---|
| **User Name** | Buyer |
| **Amount** | Total including tax, formatted (`total_display`) |
| **Type** | **Subscription** or **Featured Ad** |
| **Payment Gateway** | Gateway name (`admin` for packages assigned by an admin) |
| **Payment Status** | **Succeed** (`completed`), **Pending**, **Failed**, **Refunded**, or **Under review** (bank transfer with an uploaded receipt) |
| **Created At** | Date and time |
| **Action** | Receipt icon: opens the details |

### Transaction details

The dialog **Transaction #id** shows: User, Status, Type, Gateway, Reference, Amount, Tax, Package, Ad, Invoice (number), Paid at, Created. If the buyer uploaded a bank-transfer receipt, the image is shown (click to open full size).

### Refund a transaction

Completed transactions have a **Refund** button. Confirm *"Refund this transaction? The purchased package/feature will be revoked."* (`POST /admin/transactions/{id}/refund`). The API:

- sets the transaction and its invoice to `refunded`;
- cancels the linked subscription (type Subscription), or removes the Featured flag from the ad (type Featured Ad);
- sends the user a *"Payment refunded"* notification.

:::warning Refund does not move money
The refund only changes records inside ClassiAds-Hub. It does **not** call Stripe, Razorpay or PayPal. Refund the money in the gateway's own dashboard first, then click **Refund** here.
:::

### Transaction statuses

| Status | Set when |
|---|---|
| `pending` | Checkout started (all gateways) |
| `completed` | The gateway confirmed the payment, an admin approved a bank transfer, a sandbox payment was confirmed, or the total was `0` |
| `failed` | The gateway reported failure or expiry, the buyer cancelled, the bank transfer was rejected, or the gateway call failed |
| `refunded` | An admin clicked **Refund** |

For Stripe, Razorpay and PayPal the server checks the paid **amount and currency** against the transaction before it sets `completed`. If they do not match, the transaction fails. Pending hosted payments from the last 2 days are re-checked by the hourly `housekeeping` job, so a buyer who closed the tab is still activated.

## Bank Transfer

![Bank Transfers](/docs/classiadshub/images/admin-bank-transfers.jpg "Package Management → Bank Transfer")

When a buyer chooses **Bank Transfer** on the website, the API creates a pending transaction with a reference like `bt_7K2M9QX4PA`. The checkout response carries your instructions and bank details (set them under [Payment Gateways](doc:admin/payment-gateways#bank-transfer)), and the website shows *"Awaiting confirmation — Complete the bank transfer; an admin will confirm it shortly."* The API also accepts a receipt photo (`POST /payments/{id}/receipt`, stored in the private `receipts/{user_id}/` Storage folder), which then shows here as **Under review**.

:::note What the shipped website shows
The website does not display the gateway instructions, the bank details or the `bt_…` reference, and has no receipt upload form. Publish your bank details on a [CMS page](doc:admin/pages) (for example Contact Us), or extend `web/src/app/checkout/result/page.tsx` to show `payment.instructions` and upload a receipt. Without a receipt you can still approve the transfer after checking your bank statement for the buyer's name and amount.
:::

| Column | Shows |
|---|---|
| **User Name** | Buyer |
| **Amount** | Total |
| **Payment Status** | **Pending** (no receipt yet), **Under review** (receipt uploaded), **Approved**, **Failed** |
| **Payment Receipt** | Thumbnail. Click to open |
| **Reference** | The `bt_…` reference the buyer was asked to quote |
| **Created At** | Date and time |
| **Action** | Edit icon: **Review bank transfer** |

:::steps
### Open the transfer
Click the edit icon. The dialog shows the user, the amount and what was bought (package name or *Feature "ad title"*), the reference, status and the receipt. If there is no receipt: *"The customer hasn't uploaded a receipt yet."*

### Check your bank account
Match the amount, the buyer and (if they quoted it) the `bt_…` reference against your bank statement.

### Approve or reject
- **Approve payment** (`POST /admin/transactions/{id}/confirm`): the purchase is activated exactly like an online payment (subscription active or ad featured, invoice created, *"Payment successful"* notification). Toast: *"Payment approved — purchase activated."*
- **Reject** (`POST /admin/transactions/{id}/reject`): the transaction becomes `failed`, a linked subscription is cancelled and the user gets *"Payment rejected — Your bank transfer could not be verified."*
:::

The buttons only appear while the transaction is `pending`. Approvals are written to the [Log Viewer](doc:admin/system-status#log-viewer) as `transaction.confirmed`.

**Next:** [Payment Gateways →](doc:admin/payment-gateways)
