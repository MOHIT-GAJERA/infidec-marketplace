---
title: Vehicle Types, Brands & Models
description: The vehicle categories riders choose from (with their own fare rates), and the brand and model lists drivers pick from when they register their vehicle.
---

**Admin → Catalogue → Vehicles** has three pages:

| Page | Collection | Used by |
|---|---|---|
| **Vehicle types** (*"Categories riders choose from"*) | `vehicle_types` | Riders pick one on the booking screen; drivers pick one when they register |
| **Brands** (*"Vehicle manufacturers"*) | `vehicle_brands` | The brand list in the Driver App's vehicle step |
| **Models** (*"Models drivers can register"*) | `vehicle_models` | The model list for the chosen brand |

All three pages have **search**, **All / Active / Inactive** filter tabs, **Export CSV**, inline **Active** switches, edit and delete.

## Vehicle types

*"Categories riders choose from, with their own fare rates."*

![Vehicle types](/docs/go4ride/images/admin-vehicle-types.jpg "Admin → Catalogue → Vehicles → Vehicle types")

### Load the defaults

On an empty page click **Load 5 defaults**:

| Title | Persons | Base fare | Per km | Per minute | Minimum fare | Order |
|---|---|---|---|---|---|---|
| Bike | 1 | ₹20 | ₹6 | ₹1 | ₹30 | 1 |
| Auto | 3 | ₹30 | ₹10 | ₹1.5 | ₹40 | 2 |
| Mini | 4 | ₹50 | ₹12 | ₹2 | ₹80 | 3 |
| Sedan | 4 | ₹60 | ₹14 | ₹2 | ₹100 | 4 |
| SUV | 6 | ₹80 | ₹18 | ₹2.5 | ₹150 | 5 |

The defaults are examples in rupees. Change them to your market. The currency symbol follows your app branding.

### Fields

| Field | Type | Notes |
|---|---|---|
| **Title** | Text, required | Shown to riders and drivers, e.g. *Sedan* |
| **Image** | Image upload | The car picture on the rider's vehicle picker |
| **Persons** | Number, required | Seats, default `4`. Shown as *"4 seats"* |
| **Base fare** | Money | *"Overrides global pricing for this type."* |
| **Per km** | Money | Per kilometre of the route |
| **Per minute** | Money | Per minute of the route duration (form only) |
| **Minimum fare** | Money | Floor for short trips (form only) |
| **Services** | Tags | *"Service keys this type is offered for. Empty = all."* Use `city`, `intercity`, `intercity_sharing`, `rental`, `parcel` |
| **Display order** | Number | Lower numbers show first |
| **Active** | Switch | Inactive types are hidden from both apps |

### How the apps use vehicle types

**Customer App**: once pickup and drop are set, the app gets the route from Google (distance and duration) and shows every active type offered for that service, with its image, seats and its **own estimated fare**:

```text
fare = base fare + km × per km + minutes × per minute   (at least the minimum fare)
```

Any rate you leave empty falls back to a small built-in default, so fill in all four. The chosen type is saved on the ride as `vehicleTypeId`, and the estimated fare (minus any promo) is the ride's fare. See [Zones, Fares & Surge](doc:admin/zones) for how this relates to `calculateFare`.

**Driver App**: the vehicle step asks the driver to **Select vehicle type**. It is saved on the driver profile and shown in the driver's details in the admin panel.

:::note Requests are not filtered by vehicle type in v1.0
A new ride request goes to every eligible online driver near the pickup ([how matching works](doc:admin/dispatch#how-ride-requests-reach-drivers)), whatever vehicle type they registered. Drivers should check the requested service before accepting.
:::

## Brands

![Brands](/docs/go4ride/images/admin-vehicle-brands.jpg "Admin → Catalogue → Vehicles → Brands")

| Field | Type | Notes |
|---|---|---|
| **Title** | Text, required | e.g. *Maruti Suzuki* |
| **Logo** | Image upload | Optional, shown as the row thumbnail |
| **Active** | Switch | Inactive brands are hidden from drivers |

**Load 10 defaults** adds Maruti Suzuki, Hyundai, Tata, Mahindra, Toyota, Honda, Kia, Bajaj, TVS and Hero.

## Models

![Models](/docs/go4ride/images/admin-vehicle-models.jpg "Admin → Catalogue → Vehicles → Models")

| Field | Type | Notes |
|---|---|---|
| **Vehicle model** | Text, required | e.g. *Dzire*, *Activa*, *Innova Crysta* |
| **Brand** | Select, required | Active brands |
| **Vehicle type** | Select | Optional. Limits the model to drivers who picked this type |
| **Active** | Switch | Inactive models are hidden |

There are no default models. Add the ones common in your city.

## How the Driver App uses brands and models

In the vehicle step (*"Step 1 of 2 — tell us about you and your vehicle."*) the driver:

1. picks a **Vehicle type**,
2. picks a **Brand** from your list, or **Other** to type the make by hand,
3. picks a **Model** of that brand (only models with no vehicle type, or with the type they chose), or **Other** to type it,
4. enters the plate number, year and colour.

If the Brands list is empty, the driver simply types the make and model.

![Driver vehicle step](/docs/go4ride/images/app-driver-vehicle.webp "Driver App: vehicle type, brand and model come from this catalogue")

## Tips

- Don't delete a vehicle type that riders and drivers already use: switch it to **Inactive** instead, so old rides and driver profiles keep their link.
- Use the **Services** tags to keep, for example, *Bike* out of **Rental** and **Intercity** (`city, parcel`).

**Next:** [Driver Documents →](doc:admin/driver-documents)
