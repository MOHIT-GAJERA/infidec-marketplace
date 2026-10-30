---
title: Deliveries, OTP & Cash
description: The delivery workflow for riders on the web panel and the Partner app, from accepting an order through pickup and the delivery OTP to cash collection.
---

The workflow is the same in the Delivery panel and the Partner app (Delivery role).

![Active delivery in the Partner app](/docs/go4market/images/app-partner-delivery-active.webp "Active delivery: map, progress (Assigned → Picked up → On the way → Delivered), pickup and drop with call and navigate buttons")

:::steps
### Get an order
Either an admin or seller assigns you (you get a push notification), auto-assign picks you when an order is packed, or you open **Available orders** and tap **Accept**. Accepting calls `acceptDelivery`, which checks you are approved, online and serve that city.

### Go to the store
Open the order: the **pickup** card shows the store, address, phone and a navigate button. The status is `assigned`.

### Confirm pickup
Collect the parcel and **swipe to confirm pickup** (`picked_up`). The order then moves to **on the way** (`out_for_delivery`). The customer is notified and receives the delivery OTP in their app (and by SMS if enabled).

### Deliver with the OTP
At the door, ask the customer for the **4-digit delivery OTP** shown in their app. Tap **Complete delivery**, enter the OTP and mark it delivered. A wrong OTP is refused by the server.

### Collect cash (COD)
For Cash on Delivery orders, tick **Cash collected ₹…** before marking delivered. The amount is added to your **cash in hand**.
:::

![Complete delivery with OTP and cash](/docs/go4market/images/app-partner-delivery-otp.webp "Complete delivery: enter the customer's OTP and confirm the cash collected")

:::note The rider never sees the OTP
The OTP exists on the order document so the server can check it, but the Partner app and Delivery panel never display it. The customer must give it to you; this proves the hand-over.
:::

## What happens after delivery

- Your earnings for the order are credited to your balance (per-order riders).
- For COD, a `cashCollections` record is created; settle the cash with the admin or your store ([Cash Collection](doc:admin/cash-salary)).
- The seller's balance is credited, and the customer can rate the products.

## History

**History** (Partner app) or **Orders** (web) lists past deliveries with order number, items, customer area, amount, distance and status, filtered by delivered, cancelled or returned.

![Delivery history](/docs/go4market/images/app-partner-delivery-history.webp "History: deliveries per day with amount, distance and speed")

**Next:** [Earnings & Withdrawals →](doc:delivery/earnings)
