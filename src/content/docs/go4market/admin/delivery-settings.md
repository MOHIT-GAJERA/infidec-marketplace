---
title: Delivery Settings & Slots
description: Configure quick 15/30-minute delivery, standard and scheduled delivery, self-pickup, distance-based fees, auto-assignment and default rider pay.
---

**Admin → Delivery → Delivery settings** (`/delivery/settings`) controls how orders reach customers. Values are stored in `settings/platform` and enforced server-side by `getCheckoutQuote` and `placeOrder`.

## Delivery speeds

| Speed | Setting | Rules |
|---|---|---|
| **Standard** | always on | Normal home delivery |
| **Quick · 15 min** | `quick15Enabled`, `quick15MaxKm` (default 4 km) | Only within the radius; not for Shopping (`ecommerce`) items |
| **Quick · 30 min** | `quick30Enabled`, `quick30MaxKm` (default 8 km) | Same as above |
| **Scheduled** | `scheduledEnabled`, `slots` | Customer picks a date and slot; must be at least 30 minutes ahead |
| **Self pickup** | `pickupEnabled` | No delivery fee; order goes `ready_for_pickup` and the seller hands it over with the OTP |

If a speed is not allowed, the quote returns a `speedError` such as *"Quick delivery is available within 4 km only."* and the app explains it to the customer.

## How the delivery fee is calculated

```text
distanceKm   = farthest seller store → delivery address (straight line)
fee          = deliveryFee + ceil(max(0, distanceKm − baseKm)) × perKmFee
quick speeds : fee + quickDeliveryFee
free         : fee = 0 when subtotal ≥ freeDeliveryAbove, or the customer has a membership with free delivery
out of range : distanceKm > maxDeliveryKm → home delivery refused
```

| Key | Demo value |
|---|---|
| `deliveryFee` | ₹30 |
| `baseKm` | 3 km |
| `perKmFee` | ₹6 per km beyond `baseKm` |
| `quickDeliveryFee` | ₹25 |
| `freeDeliveryAbove` | ₹499 |
| `maxDeliveryKm` | 25 km |

The quote also returns `distanceKm` and `etaMinutes`. The order stores `etaAt`, which drives the **arrival countdown** in the app and website.

## Time slots

Add slots as `from`–`to` pairs (for example `07:00–09:00`). The demo has seven two-hour slots from 07:00 to 21:00. The checkout only offers slots that start at least 30 minutes from now.

## Riders

| Setting | Key | Effect |
|---|---|---|
| Auto-assign nearest online rider | `autoAssign` | When a home order becomes **packed**, the nearest approved, online rider serving that city is assigned. If none is online, the sellers are notified |
| Allow sellers' own delivery partners | `sellerRidersEnabled` | Sellers can run their own fleet ([Own Riders](doc:seller/riders)) |
| Max delivery distance | `maxDeliveryKm` | As above |
| Default salary type / amount / per-km bonus / bonus % | `riderPay` | Default pay for new riders, see [Cash Collection & Salary](doc:admin/cash-salary) |

![Order with auto-assign and choose rider](/docs/go4market/images/admin-order-detail.webp "A packed order: auto-assign the nearest online rider or choose one manually")

:::note Fields stored for future use
The page also stores *Standard estimate (days)*, *Days customers can book ahead*, *Last order (minutes before slot)* and *Require OTP on delivery*. In v1.0 the backend does not read them yet: the delivery OTP is always required for sellers and riders (admins may override), and slot rules are as described above.
:::

**Next:** [Cities, Countries & Taxes →](doc:admin/cities-countries)
