---
title: Zones, Fares & Surge
description: Draw service areas on a map and give each one local rates and a surge multiplier. Also covers the global Fare & pricing page and the Surge pricing settings.
---

A **zone** is an area drawn on the map, usually a city or a part of a city, with its own **base fare**, **per km**, **per minute** and **surge multiplier**. Zones sit on top of the global rates in **Settings → Fare & pricing**.

**Admin → Catalogue → Zones** (*"Service areas, local fares and surge"*).

![Zones](/docs/go4ride/images/admin-zones.jpg "Admin → Catalogue → Zones: the overview map with every zone, and a card per zone with its rates")

The page shows an **overview map** with every zone's outline, then one card per zone with its name, an **Active / Inactive** pill and its four rates (**Base**, **Per km**, **Per min**, **Surge**). A zone whose surge is above ×1 is highlighted. Data lives in the `zones` collection.

## Create a zone

:::steps
### Open the editor
Click **New zone** (or **Create first zone** on an empty page). The dialog subtitle reads *"Local rates applied by calculateFare"*.

### Name it
**Name**, e.g. *Downtown* or *Surat City*. Required: *"Give the zone a name."*

### Draw the area
Click the map to place the corners of the zone, in order. The hint shows how many corners you have: *"3 corners"*. **Undo** removes the last corner, **Clear** starts over. A zone needs **at least 3 corners**: *"A zone area needs at least 3 corners."* The map uses OpenStreetMap tiles, so no API key is needed.

### Set the local rates
| Field | Example | Meaning |
|---|---|---|
| **Base fare** | `40` | Flat amount at the start of every trip |
| **Surge multiplier** | `1.2` | Multiplies the metered fare. `1` = no surge |
| **Per km** | `12` | Charged per kilometre of the route |
| **Per minute** | `1.5` | Charged per minute of the trip |

### Activate and save
**Active** (*"Inactive zones are ignored when pricing"*), then **Save zone**.
:::

Edit a zone with the pencil on its card. Delete it with the trash icon and confirm.

:::warning Fill in all four rates
A zone always saves all four numbers. If you leave **Base fare**, **Per km** or **Per minute** at `0`, the zone prices those parts at zero instead of falling back to the global rate. Enter real values in every field.
:::

## How fares are worked out

The `calculateFare` Cloud Function is the platform's pricing formula:

```text
metered  = (base fare + km × per km + minutes × per minute + waiting minutes × per minute) × surge
total    = max(minimum fare, metered + platform fee + tax − promo discount)
```

Rates are resolved in this order: **zone** (when the call names a zone) → **Settings → Fare & pricing** (`config/pricing`) → built-in defaults. Note that `calculateFare` applies a named zone's rates even when the zone is switched to **Inactive**, so delete a zone you no longer want priced.

:::note What the v1.0 apps use
In v1.0 the Customer App prices a booking **on the device** from the selected [vehicle type's](doc:admin/vehicles) base fare, per km, per minute and minimum fare and the Google route distance and duration, then applies the promo code. That fare is saved on the ride and is what the rider pays and what [settlement](doc:admin/commission-wallet) splits. The booking screen does **not** call `calculateFare` yet, so **zone rates and surge don't change the price of a booking in v1.0**. Zones are still useful for the overview map and are ready for when `calculateFare` is wired into booking (see [Backend Reference](doc:api/callable-functions)).
:::

## Fare & pricing (global rates)

**Settings → Business rules → Fare & pricing** edits the `config/pricing` document. A live **Fare preview** card on the right recalculates as you type (*"Updates as you type · before promos"*) for a sample trip, with sliders for distance and duration, and shows **Platform commission** and **Driver earns**.

| Section | Field | Stored as |
|---|---|---|
| **Base rates** (*"Metered fare before fees. Zones can override these."*) | Base fare, Minimum fare, Per km, Per minute, Surge multiplier, Currency code | Numbers, currency text |
| **Fees & commission** (*"Percentages."*) | Platform fee %, Tax %, Commission % | Saved as fractions (10 % → `0.10`) |

Click **Save pricing**: *"Pricing saved — applies to new fares immediately."*

:::tip Commission is set elsewhere
**Commission %** on this page is only a fallback. When **Settings → Business model** has a commission value, settlement uses that instead. See [Commission, Wallet & Settlement](doc:admin/commission-wallet).
:::

## Surge pricing settings

**Settings → Business rules → Surge pricing** (`settings/surge`) stores the rules for demand-based surge:

| Field | Default |
|---|---|
| Enable surge pricing | Off |
| Minimum open requests to trigger | 3 |
| Requests ÷ drivers ratio | 1.5 |
| Minimum multiplier | 1.1 |
| Maximum multiplier | 2.5 |
| Detection radius (km) | 3 |
| Cool-down (minutes) | 15 |
| Driver share of surge | 70 (slider, 0–100 %) |

:::warning Automatic surge is not active in v1.0
No Cloud Function reads `settings/surge` yet, so turning it on doesn't change any fare. The only surge in v1.0 is the fixed **Surge multiplier** on a zone or on the Fare & pricing page, used by `calculateFare`.
:::

## Tips

- Draw zones that match where you actually operate. They make the overview map a quick sanity check of your coverage.
- Keep vehicle type rates and zone rates in step, so riders see similar prices whichever path calculates them.

**Next:** [Rental Packages →](doc:admin/rental-packages)
