---
title: Pricing
description: How Booqora prices a rental — charge periods, flat fees, fixed prices, tiered pricing structures, bundles, discounts, taxes and security deposits, as implemented in pricing.dart.
---

All rental pricing runs through one shared class, `Pricing`, in `booqora_platform/lib/data/pricing.dart`. The order editor, the Online Store and the product previews all call it. This page explains the rules in plain terms.

## Charge periods

A rental is charged in whole periods. Booqora takes the time between pickup and return, divides it by the length of the unit and **rounds up**, with a minimum of one period.

| Unit | Length |
|---|---|
| `hour` | 1 hour |
| `day` | 24 hours |
| `week` | 168 hours |
| `month` | 720 hours (30 days) |

```text title="Example"
Pickup  Mon 09:00   Return  Tue 17:00   = 32 hours
Per day: ceil(32 / 24) = 2 periods
```

:::tip Watch the default times
New orders default to a 09:00 pickup and a 17:00 return the next day (*Settings → Rental period*). That is 32 hours, which a **per day** product charges as **2 days**. Set return times at or before pickup time if you want a one-day booking to cost one day.
:::

## Pricing methods

Each product has a pricing method on its **Pricing** tab.

![Product pricing](/docs/booqora/images/platform-product-pricing.webp "Product Pricing tab: method, preview, taxes and deposit")

| Method | Label | Price for one unit |
|---|---|---|
| `flat` | **Flat fee** | Rental: price × periods (using the product's *Per* unit). Sales item or service: the price, once |
| `fixed` | **Fixed price** | The price, once per order, regardless of duration |
| `structure` | **Pricing structure** | Calculated from a tiered template (rental products only) |
| `none` | **No pricing** | Free of charge |

If **Charge for this product** is unticked, the product is always free on orders. The **Preview pricing** card shows the price of one unit for 1 hour, 1 day, 3 days, 1 week and 1 month.

On an order you can still **Override price** for a single line; overridden lines are not recalculated when the period changes.

## Pricing structures (tiered pricing)

Structures are reusable templates under **Settings → Pricing → Pricing structure templates**. Each has a name, **Charge per** (*Hour*, *Day* or *Week*), a **Minimum** number of periods, a description and a list of **tiers**. A tier is *"up to N periods → total price"*.

![Pricing settings](/docs/booqora/images/platform-settings-pricing.webp "Pricing settings with structure templates and deposit defaults")

`structurePrice` works like this:

1. Count the periods in the structure's interval and raise them to the **minimum** if needed.
2. Sort the tiers by *up to* and return the price of the first tier that covers the period count.
3. Beyond the last tier, charge the last tier's price plus each extra period at the last tier's **average rate** (price ÷ up to).

```text title="Charge per hour (3 hours minimum) — tier: up to 3 h = ₹300"
2 hours  → raised to minimum 3 → ₹300
5 hours  → beyond last tier    → ₹300 + 2 × (₹300 ÷ 3) = ₹500
```

**Add suggested templates** adds four starting points: *Charge per hour (3 hours minimum)*, *Charge per day (50% off extra days after 3)*, *Charge per day (1 week minimum)* and *Charge per week (20% off extra weeks after 4)*. Their prices are examples; edit them to your own rates. **Preview** shows the price for a range of durations. Deleting a template makes products that used it fall back to their flat price × periods.

:::note Structures in the Online Store
The Online Store does not load pricing structures. For a product on a structure it shows the price prefixed with *From* and estimates the cart with the product's flat price × periods. Check such bookings in the order editor: lines are recalculated with the structure as soon as you change the period or a quantity, or you can use **Override price**.
:::

## Order totals

`Pricing.totals` builds the order summary from the lines:

1. **Subtotal** = sum of line totals (unit price × quantity).
2. **Discount** = subtotal × manual discount % + coupon discount, capped at the subtotal.
3. **Tax** is calculated per line from the product's tax rate, after spreading the discount proportionally over the lines. If *prices include tax* is on, the tax is extracted from the price instead of added on top. See [Taxes & Locations](doc:admin/taxes-locations).
4. **Total** = subtotal − discount (+ tax when prices exclude tax).

Bundle lines are priced as described in [Bundles & Collections](doc:admin/bundles-collections).

## Security deposits

The deposit is shown under the total and is not part of it. The rule comes from the customer (if set) or the workspace default under **Settings → Pricing → Security deposits**:

| Mode | Deposit |
|---|---|
| **No deposit** | 0 |
| **Percentage of order total** | Total × percentage |
| **Product-specific** | Sum of each product's *Security deposit value* × quantity × *percentage of product deposit* |
| **Fixed amount** | The amount |

Collected deposits are recorded as **Security deposit** payments on the order; they do not reduce the amount due.

## Payment status

After every change, `Pricing.paymentStatus(total, paid)` returns `paid` (nothing to pay, or paid in full), `payment_due` (nothing paid), `partially_paid` or `overpaid`.

**Next:** [Availability →](doc:admin/availability)
