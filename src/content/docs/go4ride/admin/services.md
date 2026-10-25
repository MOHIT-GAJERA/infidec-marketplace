---
title: Services
description: Turn the bookable services (Cab, Intercity Sharing, Intercity Personal, Rental, Parcel) on or off, rename them, change their icon and order, and flag driver bidding.
---

**Admin → Catalogue → Services** (*"Turn ride services on/off and allow driver bidding per service"*) lists the services riders can book. Each one is a tile on the Customer App's home screen and opens the booking screen for that service.

![Services](/docs/go4ride/images/admin-services.jpg "Admin → Catalogue → Services")

The list is **fixed**: you can't add or delete services, because the apps and Cloud Functions know each one by its key. You edit their title, description, icon, order and on/off state. Data lives in the `services` collection, one document per key.

## Load the five services

On a new project the page is empty. Click **Load 5 defaults** to create them:

| Key (document id) | Title | Description | Driver bidding | Order |
|---|---|---|---|---|
| `city` | Cab | Book a cab within the city | Off | 1 |
| `intercity_sharing` | Intercity Sharing | Share an outstation ride | On | 2 |
| `intercity` | Intercity Personal | Private outstation ride | On | 3 |
| `rental` | Rental | Hire a car by the hour | Off | 4 |
| `parcel` | Parcel | Send packages across town | Off | 5 |

:::warning Don't change the keys
`city`, `intercity_sharing`, `intercity`, `rental` and `parcel` are fixed identifiers. The **Service key** field is read-only in the form. If you create service documents by hand in Firestore, use exactly these ids.
:::

## Table

| Column | Shows |
|---|---|
| **Title** | Icon thumbnail and the service title |
| **Driver bidding** | Inline switch |
| **Active** | Inline switch. Turn a service off to hide it from riders |
| **Display order** | Lower numbers show first |

The toolbar has **Search services** (by title) and **Export CSV**. Click a row or the pencil to edit.

## Edit a service

| Field | Type | Notes |
|---|---|---|
| **Title** | Text, required | The tile label in the Customer App, e.g. *Cab* or *Bike Taxi* |
| **Service key** | Read-only | *"Fixed identifier used by the apps."* |
| **Description** | Multi-line | Short line under the title |
| **Icon / image** | Image upload | Uploaded to Storage under `admin_uploads/services/`. PNG with a transparent background works best. Empty = a built-in icon for that service |
| **Driver bidding** | Switch | *"Drivers can bid a price instead of fixed fare."* See the note below |
| **Active** | Switch | Default on |
| **Display order** | Number | *"Lower numbers show first."* |

Click **Save changes**. The apps pick up the change immediately.

## How the apps use services

- **Customer App home**: one tile per active service, sorted by display order, with your title and icon.
- **Booking screen**: adapts to the service. Cab, Intercity and Parcel show vehicle types and a fare estimate. **Rental** shows your [rental packages](doc:admin/rental-packages). **Parcel** asks for the receiver's name, phone and a note. **Intercity Sharing** marks the ride as shared.
- **Vehicle types**: each type can be limited to some services with its **Services** tags (see [Vehicles](doc:admin/vehicles)). Use the keys above.
- **Bookings**: the four [Bookings](doc:admin/bookings) pages group rides by type: Cab (`city`), Intercity (both intercity services), Rental and Parcel.

:::note Driver bidding in v1.0
When **Driver bidding** is on, the booking screen tells the rider *"Drivers can bid on this ride — you pick the offer."* and the ride is saved with `biddingEnabled: true`. The bid data layer exists, but **the Driver App has no bid-submission screen in v1.0**, so rides are still accepted at the estimated fare. Leave bidding off if you don't want riders to expect offers.
:::

## Tips

- To launch with only city cabs, keep **Cab** active and switch the others off. You can turn them on later without an app update.
- Rename freely: *Cab* can become *Taxi*, *Parcel* can become *Courier*. Keys stay the same.

**Next:** [Zones, Fares & Surge →](doc:admin/zones)
