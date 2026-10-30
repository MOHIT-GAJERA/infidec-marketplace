---
title: Orders, Pickup & Rider Assignment
description: How sellers accept, pack and hand over orders, assign riders, complete self-pickup orders with the OTP, and handle returns.
---

Sellers see every order that contains at least one of their items (`orders.sellerIds` contains their UID). The flow is the same in the Seller panel and the Partner app.

![Seller order tabs in the Partner app](/docs/go4market/images/app-partner-seller-orders.webp "Orders by status: New, Confirmed, Packed, Ready / Out, Delivered")

## Home-delivery orders

:::steps
### Accept or reject
A new order arrives with a push notification and appears under **New**. Open it and tap **Accept order** (`confirmed`) or **Reject**, which cancels it with a reason and refunds the customer to the wallet.

### Pack
Pick the items and tap **Mark as packed** (`packed`). If the admin turned on **auto-assign**, the nearest online rider is assigned now.

### Assign a delivery partner
If no rider was assigned automatically, tap **Assign delivery partner**:
- **Assign my rider**: one of your own fleet (if enabled);
- or let Go4Market pick the **nearest online rider** (`assignDeliveryPartner` with no partner), trying your fleet first.

Riders can also accept the order themselves from the delivery pool.

### Hand over
The rider picks up the parcel and the order moves on to *picked up*, *out for delivery* and *delivered*. You can follow it on the order timeline.
:::

![Accept or reject a new order](/docs/go4market/images/app-partner-seller-order-accept.webp "A new order: delivery due countdown, customer, items and Accept / Reject")
![Mark as packed](/docs/go4market/images/app-partner-seller-order-pack.webp "Accepted order: timeline and Mark as packed")
![Assign delivery partner](/docs/go4market/images/app-partner-seller-assign-rider.webp "Packed order: Assign delivery partner")

## Self-pickup orders

For orders with **Self pickup** (`/orders/pickup`):

1. Accept and pack as above.
2. Tap **Ready for pickup**. The customer is notified, and gets the OTP by SMS if enabled.
3. When the customer arrives, enter the **OTP** they show you and mark the order **delivered**.

## Quick-delivery orders

Orders with speed **15 min** or **30 min** show a countdown (*Delivery due in 22:56*). Accept and pack them first.

## Returns

**Returns** (`/returns`) lists return requests for your items. You can approve, reject, mark picked and refund. Sellers may only **lower** the suggested refund amount. See [Returns & Refunds](doc:admin/returns).

## Invoices

Open an order → **Invoice** to print an invoice (`/print/invoice/:id`) from the web panel.

**Next:** [Products, Stock & Reviews →](doc:seller/products)
