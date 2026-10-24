---
title: Rental Packages
description: Hourly rental bundles such as "4 Hours / 40 KM" with a package price, included hours and kilometres, and extra charges per km and per hour.
---

A **rental package** is a fixed bundle a rider books with the **Rental** service: a car for a number of hours with a number of kilometres included, for one price. Typical packages are *2 Hours / 20 KM*, *4 Hours / 40 KM* and *8 Hours / 80 KM*.

**Admin → Catalogue → Rental packages** (*"Hourly bundles: included hours/km plus extra charges"*).

![Rental packages](/docs/go4ride/images/admin-rental-packages.jpg "Admin → Catalogue → Rental packages")

Packages are stored in the `rental_packages` collection and listed by price, cheapest first. There are no default packages: click **Add rental package** to create the first one.

## Table

| Column | Shows |
|---|---|
| **Title** | Package name |
| **Vehicle type** | The linked vehicle type, or — |
| **Base fare** | Package price, e.g. `₹799.00` |
| **Included hours** | e.g. `4` |
| **Included km** | e.g. `40` |
| **Extra per km** | Rate after the included km |
| **Extra per hour** | Rate after the included hours |
| **Active** | Inline switch |

The toolbar has **Search rental packages** (by title), **Export CSV** and **Add rental package**.

## Add or edit a package

| Field | Type | Rule / example |
|---|---|---|
| **Title** | Text, required | *e.g. 4 Hours / 40 KM* |
| **Vehicle type** | Select | Active types from [Vehicle types](doc:admin/vehicles). Optional |
| **Base fare** | Money, required | `799`, the price the rider pays for the package |
| **Included hours** | Number, required | `4` |
| **Included km** | Number, required | `40` |
| **Extra per km** | Money | `12` |
| **Extra per hour** | Money | `150` |
| **Active** | Switch | Default on. Only active packages are offered |

Click **Create** or **Save changes**. Delete a package with the trash icon (*"Delete rental package?"*).

## How the Customer App uses packages

1. The rider taps **Rental** on the home screen.
2. The booking screen lists every **active** package with its hours, kilometres, price and, when set, *"then ₹12/km"*.
3. The rider picks one (*"Choose a rental package."* if they don't) and confirms. The ride is saved as type `rental` with the `rentalPackageId`, and its fare is the **package price**.
4. The ride shows up under [Bookings → Rental](doc:admin/bookings).

![Rental bookings](/docs/go4ride/images/admin-bookings-rental.jpg "Rental rides in Admin → Bookings → Rental")

:::note Extra charges in v1.0
The package card shows **Extra per km** (*"then ₹12/km"*). **Extra per hour** is stored but not shown in the app. The v1.0 trip flow doesn't add either charge to the fare when a rental runs over: the rider is charged the package price. Agree any overage with the rider directly, or keep packages generous.
:::

:::note Vehicle type on a package
The **Vehicle type** is saved on the package (`vehicleTypeId`) for your reference and reporting. The v1.0 booking screen lists **all** active packages, whichever vehicle type they name.
:::

## Tips

- Put the hours and kilometres in the title (*4 Hours / 40 KM*). If the title is empty the app shows *"4 hr / 40 km"*.
- If you price a Sedan rental differently from an SUV rental, say so in the title (*SUV · 4 Hours / 40 KM*), because the rider sees every active package.

**Next:** [Vehicle Types, Brands & Models →](doc:admin/vehicles)
