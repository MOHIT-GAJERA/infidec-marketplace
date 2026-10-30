---
title: Delivery Panel Overview
description: The web panel for Go4Market delivery partners, covering sign-in, registration, approval, going online, and every menu.
---

The **Delivery panel** is a browser version of the rider tools, built from `apps/panel` with the entrypoint `lib/main_delivery.dart` and hosted at `https://<your-project-id>-delivery.web.app` (blue accent). Most riders use the **Partner app** on their phone ([Delivery Mode](doc:app-partner/delivery-mode)). The web panel is useful for riders on a tablet or laptop, for registration links, and for checking earnings.

## Sign in and register

- Sign in with **e-mail and password**, **Google** or **phone OTP** (+91 by default).
- New riders go to **`/register`**. They enter name, phone, photo, vehicle type (bike, scooter, bicycle, car, van, EV), vehicle number, licence number and the **cities** they serve, and accept the partner policy. This calls `registerDeliveryPartner`, which creates a **pending** profile and the `delivery` claim.
- Until an admin (or the owning seller) approves them, riders see **`/pending`**.

The `/register` link is also what sellers share to recruit riders for their own fleet ([Own Riders](doc:seller/riders)).

## Menu

| Group | Route | What it does |
|---|---|---|
| Work | `/dashboard` | Online/offline toggle, today's earnings and deliveries, cash in hand, active delivery |
| | `/orders/available` | The **delivery pool**: packed or confirmed home orders with no rider, in your cities |
| | `/orders`, `/orders/:id` | Your assigned and past deliveries, with pickup and drop details |
| | `/map` | OpenStreetMap map with your position, pickups and drops |
| Money | `/finance/earnings` | Balance, per-order earnings, salary credits |
| | `/finance/cash` | COD cash collected and settlements |
| | `/finance/withdrawals` | Request payouts |
| Account | `/profile` | Photo, vehicle, cities, documents, password |

## Going online

Toggle **Online** on the dashboard. While online, the panel shares the browser's location (with permission) to `deliveryPartners/{uid}`, so you appear on the admin's live map and can be auto-assigned. Only approved, **online** riders can read the delivery pool.

:::warning Keep the tab open
A browser cannot track location in the background like the Android app's foreground service. For real deliveries, riders should use the Partner app.
:::

**Next:** [Deliveries, OTP & Cash →](doc:delivery/deliveries)
