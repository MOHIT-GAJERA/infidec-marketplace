---
title: Delivery Mode
description: The rider experience in the Partner app, from going online and the order pool through the active-delivery screen with swipe actions, OTP and cash, to history, earnings and profile.
---

Riders sign in on the **Delivery** tab. The bottom bar has **Home, Orders, History, Earnings and Profile**.

![Delivery home](/docs/go4market/images/app-partner-delivery-home.webp "Home: the Online ring, location status, active delivery and today's numbers")
![Active delivery](/docs/go4market/images/app-partner-delivery-active.webp "Active delivery: map, progress steps, pickup and drop cards, swipe to confirm pickup")
![Out for delivery](/docs/go4market/images/app-partner-delivery-out.webp "On the way, with the order notification at the top")
![Complete delivery](/docs/go4market/images/app-partner-delivery-otp.webp "Complete delivery: customer OTP and cash collected")

## Home

- The big **Online / Offline** ring. Going online starts the location service ([Live Location](doc:app-partner/location-tracking)) and makes you eligible for auto-assignment and the delivery pool.
- *Location shared · just now* confirms that updates reach the server.
- **Active delivery** card, and today's earnings, deliveries, **cash in hand** and rating.
- **Find orders near you** opens the pool.

## Orders

The **delivery pool** lists confirmed or packed home orders with no rider in your cities, with distance and the speed badge. Tap **Accept** to take one (`acceptDelivery`). Assigned orders appear here too.

## Active delivery

A full-screen map with your position, the store and the customer, plus a progress bar: **Assigned → Picked up → On the way → Delivered**.

1. **Pickup** card: store name, address, call and navigate. **Swipe to confirm pickup** when you have the parcel.
2. **Drop** card: customer name, address, call and navigate. The order is now *on the way* and the customer can see you live.
3. **Swipe to complete delivery** → enter the customer's **OTP** → tick **Cash collected** for COD → **Mark delivered**.

The app never shows the OTP; the customer must read it out. See [Deliveries, OTP & Cash](doc:delivery/deliveries).

![Delivery done](/docs/go4market/images/app-partner-delivery-done.webp "Back on Home after a delivery: today's earnings and deliveries updated")

## History, earnings and profile

- **History**: past deliveries by day with amount, distance and speed, filtered by delivered, cancelled or returned.
- **Earnings**: balance, today / 7 days / all time, a chart, your pay structure, **Withdrawals** and **Cash** ([Earnings & Withdrawals](doc:delivery/earnings)).
- **Profile**: photo, vehicle, service cities, fleet (store delivery team or the platform network) and **documents** (driving licence, ID proof, vehicle RC), stored privately in Storage under `deliveryPartners/{uid}/docs/`. Riders ask support to change vehicle or cities.

**Next:** [Live Location (Foreground Service) →](doc:app-partner/location-tracking)
