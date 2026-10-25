---
title: Cancellation & Fees
description: How riders cancel a ride with an admin-managed reason, when a cancellation fee is charged to their wallet, and how the fee reaches the driver.
---

![Cancel sheet](/docs/go4ride/images/app-customer-cancel.webp "Why are you cancelling?")
![Cancelled](/docs/go4ride/images/app-customer-cancelled.webp "Ride cancelled")

## Cancel from the ride screen

**Cancel ride** (red outline button) is shown on the live ride screen until the ride is completed, cancelled or closed as *No drivers available*.

:::steps
### Pick a reason
The sheet *Why are you cancelling?* lists the **customer** cancel reasons from the Admin Panel, plus **Other** with a free-text field. Below the title: *A cancellation fee may apply once your driver is on the way.*

### Confirm
**Cancel ride** is enabled once a reason is chosen. **Keep ride** closes the sheet.

### Saved
The app writes `status: cancelled`, `cancelReason`, `cancelledBy: customer` and `cancelledAt` in one update. The screen shows *Ride cancelled* and *Reason: …*.
:::

Cancel reasons are managed in the Admin Panel reason lists (audience *customer*, *driver* or *both*). **Load defaults** seeds a starter list.

## When a fee is charged

The `onRideStatusChanged` Cloud Function decides, once per ride:

| Situation | Fee |
|---|---|
| Cancelled **before** a driver accepted | None |
| Cancelled by the **driver** or an admin | None |
| Cancelled by the rider **within** the free window after acceptance | None |
| Cancelled by the rider **after** the free window | The cancellation charge |

The free window runs from the moment the driver accepted (`acceptedAt`). The settings are in **Admin → Settings → Business model → Ride cancellation charge** ([Commission, Wallet & Settlement](doc:admin/commission-wallet)):

| Setting | Key | Default |
|---|---|---|
| Charge on cancellation | `cancellationEnabled` | On |
| Charge type | `cancellationType` | Fixed amount (or Percentage of fare) |
| Cancellation charge | `cancellationCharge` | 25 |
| Free cancellation window (seconds) | `freeCancelSeconds` | 120 |

:::warning Save the Business model page once
The defaults above are the form's defaults. Until you press **Save** on Business model, `settings/business` does not exist and the function charges **no** fee (the charge counts as 0). Open the page and save it on a new project.
:::

## Where the money goes

In one transaction the function:

1. stores `cancellationFee` on the ride (so it is never charged twice),
2. **debits** the rider's wallet by the fee. The wallet may go below zero,
3. **credits** the driver's wallet and lifetime earnings with the same amount,
4. writes two `cancellationFee` rows in `transactions` (rider −₹25, driver +₹25),
5. sends the rider a push *A cancellation fee of 25 was charged.*

Example (tested): a rider cancels 3 minutes after acceptance with the defaults. The rider's wallet goes from ₹0 to **−₹25**, and the driver's wallet rises by **₹25**.

The rider sees the fee in **Wallet → Transactions** as *Cancellation fee*. A negative balance is shown in the wallet. A top-up is added to the balance, so it covers the negative amount first.

:::note Negative balance limit
**Maximum negative wallet balance** (`maxNegativeWallet`, default 100) is stored with the business settings. The booking screen does not check it today, so riders with a negative balance can still book. Check their balance in [Customers & Wallet](doc:admin/customers) if needed.
:::

## Driver cancellations

Drivers can cancel while the ride is *accepted*, *driver on the way* or *driver arrived* (before the trip starts), with the **driver** reason list. No fee is charged to anyone. The rider sees *Ride cancelled* with the driver's reason and can book again.

## Requests nobody accepts

| Case | Result |
|---|---|
| No eligible driver at booking time | `noDriversFound` immediately, push *No drivers available* |
| No driver accepts within **Auto-cancel unaccepted ride** (Admin → Settings → Driver & ride, default 180 s) | `expireRideRequests` (runs every minute) sets `noDriversFound` |

Neither case charges a fee. The rider sees *No drivers available* and books again from Home.

**Next:** [Wallet & Payments →](doc:app-customer/payments)
