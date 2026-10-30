---
title: Delivery Partners
description: Approve rider applications, add riders, assign cities and salary, run platform and seller-owned fleets, and write the partner policy.
---

Delivery partners (riders) are stored in `deliveryPartners/{uid}` with the `delivery` claim. They work from the **Partner app** (Delivery role) or the **Delivery panel** on the web.

## Partner requests

Riders register from the Partner app or the Delivery panel (`/register`) with name, phone, vehicle type (bike, scooter, bicycle, car, van, EV), vehicle number, licence number, photo and the **cities** they serve. `registerDeliveryPartner` creates the profile with status **pending**.

**Admin → Delivery → Partner requests** (`/delivery/requests`): review the details and documents, set the cities and salary, then **Approve**. This calls `reviewDeliveryPartner`; the rider is notified and can go online.

## Add a partner yourself

**Delivery → Delivery partners → Add partner**: e-mail, password, name, mobile, vehicle, vehicle number, photo, cities, **Managed by** (admin or a seller) and salary type and amount.

## Manage partners

`/delivery/partners` shows every rider with online status, city, rating, completed deliveries, cash in hand and balance. Open `/delivery/partners/:id` for details, documents, history, and **Suspend** or reactivate.

| Field | Key | Purpose |
|---|---|---|
| Cities | `cities[]` | Auto-assign and the delivery pool only offer orders from these cities. Empty = any city |
| Managed by | `ownerType`: `admin` or `seller` (+ `sellerId`) | Platform rider or a seller's own fleet |
| Salary | `salary {type, amount}` | Per-order or monthly pay, see [Cash Collection & Salary](doc:admin/cash-salary) |
| Status | `pending`, `approved`, `suspended`, `rejected` | Only approved riders can go online and accept orders |

## Platform fleet and seller fleets

- **Platform riders** (`ownerType: admin`) can be assigned to any order in their cities.
- **Seller riders** (`ownerType: seller`) belong to one store. When **Allow sellers' own delivery partners** is on ([Delivery Settings](doc:admin/delivery-settings#riders)), sellers see and assign their own riders, approve their applications and settle their cash. Auto-assign tries the seller's fleet first.

The **Seller fleets** tab in `/delivery/partners` lists seller-owned riders. The backend also has a `createSellerRider` callable that creates an approved rider in a seller's fleet directly.

## Partner policies

**Delivery → Partner policies** edits `pages/delivery-policy`, shown to riders when they register.

:::warning Keep city names consistent
Matching is done on the city **name**. If a rider serves "Ahmedabad" and the customer's address says "Amdavad", the rider will not be offered the order. Use the names from **Settings → Cities & zones** everywhere.
:::

**Next:** [Cash Collection & Salary →](doc:admin/cash-salary)
