---
title: Live Rider Map
description: See every online delivery partner on an OpenStreetMap map in real time, and how rider location reaches customers for live order tracking.
---

**Admin → Live rider map** (`/live-map`) shows all approved delivery partners who are **online**, on an OpenStreetMap map. Click a rider for their phone, vehicle, cash in hand and active order.

## How location flows

```text
Partner app / Delivery panel (online)
  └─ writes deliveryPartners/{uid}.lat, lng, heading, locationUpdatedAt   (≈ every 15 s or 30 m)
       └─ onDeliveryPartnerWritten (Cloud Function)
            └─ copies it to orders/{id}.riderLocation for the rider's active orders
                 └─ Customer app / website: live marker on the order map
```

- Riders may update **only** `online`, `lat`, `lng` and `locationUpdatedAt` on their own document (Firestore rules).
- Customers never read `deliveryPartners`. They only read `riderLocation` on their own order while it is `assigned`, `picked_up` or `out_for_delivery`.
- In the Partner app, tracking runs as an Android **foreground service** with a visible notification, so it continues when the app is in the background. See [Live Location](doc:app-partner/location-tracking).

![Customer live tracking](/docs/go4market/images/app-customer-tracking.webp "What the customer sees: rider on the map, countdown, call button and delivery OTP")

## Map tiles

All maps use OpenStreetMap tiles from `https://tile.openstreetmap.org/{z}/{x}/{y}.png` through `flutter_map`. For a busy production marketplace, use a commercial tile provider: change the `urlTemplate` in the map widgets (search the code for `tile.openstreetmap.org`). See [Maps & Location](doc:app-customer/maps-location).

**Next:** [Returns & Refunds →](doc:admin/returns)
