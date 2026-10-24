---
title: Payout Requests
description: Drivers request a withdrawal of their wallet balance; you approve or reject it, transfer the money, then mark it paid.
---

Drivers earn into their **wallet** (see [Commission, Wallet & Settlement](doc:admin/commission-wallet)). To get money out, they request a **withdrawal** in the Driver App and you handle it in **Admin → Finance → Payout requests** (*"Driver withdrawals"*). The sidebar badge counts requests waiting for review.

![Payout requests](/docs/go4ride/images/admin-payouts.jpg "Admin → Finance → Payout requests")

Requests are stored in `withdrawals`.

## How a driver requests a payout

1. Driver App → **Earnings** shows the **Wallet balance**, **Lifetime earnings** and **Rating**.
2. **Request withdrawal**: the sheet shows *"Available: ₹…"* and the minimum. The driver enters an **Amount**. Below **Settings → App settings → Minimum driver withdrawal** (default ₹100) they see *"Minimum is ₹100."*; above the wallet balance, *"Amount exceeds your balance."*
3. **Submit request** creates a withdrawal with status **requested**. The driver sees it under **Payout requests** in the app with its status.

Requesting doesn't move money yet. The wallet is only debited when you approve.

## Summary cards

| Card | Value |
|---|---|
| **Pending amount** | Total of requests with status *requested*, e.g. *3 requests awaiting review* |
| **Paid this month** | Total marked paid this month, e.g. *5 payouts in October* |
| **Rejected** | Number of rejected requests, plus *N approved, awaiting transfer* |

## Filters and table

Status tabs **All / Requested / Approved / Paid / Rejected**, **Search driver, phone or account** and **Export CSV** (ID, Amount, Driver, Phone, Driver ID, Method, Account, Note, Status, Requested, Processed, Paid).

| Column | Shows |
|---|---|
| **Amount** | e.g. `₹1,500.00` |
| **Driver** | Name and phone (*No phone on file* if missing) |
| **Method** | Payout method and account, when present |
| **Note** | Note on the request |
| **Requested** | Date and time |
| **Processed** | When you approved or rejected |
| **Status** | Requested, Approved, Paid, Rejected |
| **Actions** | **Reject**, **Approve** (requested) or **Mark paid** (approved) |

## Process a request

:::steps
### Approve or reject
**Approve** asks *"Approve ₹1,500.00 payout? {Driver}'s wallet will be debited by ₹1,500.00 and the driver notified. Mark it paid once the transfer is made."* The `approveWithdrawal` function checks the request is still *requested* and that the wallet still has enough (*"Insufficient driver balance."*), then debits the wallet, sets **approved** and writes a `payout` ledger row. **Reject** sets **rejected**; the wallet doesn't change. Either way the driver gets a *Withdrawal update* push.

### Transfer the money
Pay the driver outside Go4Ride: bank transfer, UPI or your payout provider.

### Mark paid
Click **Mark paid** and confirm *"Mark ₹1,500.00 as paid?"*. The status becomes **paid** with the date. Your payout is complete.
:::

:::note Bank details in v1.0
The v1.0 Driver App asks only for the **amount**. The *Method*, *Account* and *Note* columns stay empty unless you fill them in yourself. Collect each driver's bank or UPI details during onboarding (for example as a [document type](doc:admin/driver-documents) such as *Cancelled cheque*) or ask them through [support](doc:admin/support).
:::

:::warning Admin only
Approving and rejecting call the `approveWithdrawal` function, which requires the **admin** claim. A request can be processed once: a second attempt returns *"Already processed."*
:::

**Next:** [Payment Gateways →](doc:admin/payment-gateways)
