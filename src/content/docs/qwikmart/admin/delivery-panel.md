---
title: Delivery Boy Panel
description: The browser panel for riders — go online, accept and deliver orders, return pickups, cash, earnings and withdrawals.
---

Riders who prefer a laptop or tablet to the phone app can work from the **Delivery Boy panel** at **`/delivery/login`** (for example `https://admin.yourstore.com/delivery/login`). It is part of the Admin Panel application — nothing extra to install or deploy.

Riders sign in with the **same e-mail and password** as the [Delivery Boy App](doc:app-delivery/prerequisites). A rider must be **approved** by an admin before receiving orders; new riders register in the app first (see [Rider Registration & Approval](doc:app-delivery/registration)). **Forgot password** is available on the login page.

## Menu

| Page | What the rider can do |
|---|---|
| **Dashboard** | Switch **Online / Offline**, see *Active Orders*, *Delivered Today*, *Today Earnings* and *Cash in Hand*, and accept available orders from the list |
| **My Orders** | Available, active and completed orders with filters |
| **Order details** | Pickup and drop addresses, items, amount to collect, and the delivery steps below |
| **Return Pickups** | Return requests assigned to the rider — mark them picked up |
| **Cash Collection** | Cash in hand from COD orders, *Collected Today* and *Submitted to Admin* |
| **Earnings** | Earnings for *Today*, *This Week*, *This Month* and *All Time*, per order |
| **Wallet & Withdrawals** | Wallet balance, **request a withdrawal**, *Pending Withdrawals* and *Total Withdrawn* |
| **Chat** | Support chat with the admin team |
| **Profile** | Name, photo and password |

## Delivering an order

:::steps
### Go online
On the **Dashboard**, switch to **Online**. Only online riders are offered orders in their zone.

### Accept
Open an available order → **Accept Order**. **Reject** hides it from the rider (or, for an order already assigned to the rider, releases it to other riders).

### Pick up
While the store is preparing the order the panel shows *Waiting for the store*. Once it is ready, click **Mark as Picked Up** at the store, then **Out for Delivery** when you leave.

### Deliver with OTP
At the customer's door, ask for the **6-digit delivery OTP**, collect the cash for COD orders, click **Enter OTP & Deliver**, type the OTP and **Mark as Delivered**. The OTP is checked on the server (`deliverOrder`) — the rider never sees it.
:::

The steps and statuses are the same as in the app — see [Delivery Workflow & OTP](doc:app-delivery/workflow). Earnings and cash work as described in [Earnings, Cash & Wallet](doc:app-delivery/earnings).

:::note Live location
The browser panel does not send the rider's live GPS position. For live tracking on the customer's map, riders should use the Delivery Boy App while delivering — see [Live Location](doc:app-delivery/location-tracking).
:::

## What riders cannot see

Riders only see their own orders, returns, cash, earnings and wallet. Other riders, customers' details beyond the delivery address, store data and settings are blocked by Firestore security rules on the server, not only hidden in the menu.

**Next:** [Customer App →](doc:app-customer/prerequisites)
