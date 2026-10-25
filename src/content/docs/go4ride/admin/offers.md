---
title: Offers & Coupons
description: Discount coupons riders type on the booking screen, percentage or flat, with a maximum discount, a minimum ride amount, a usage limit and an expiry date.
---

**Admin → Growth → Offers** (*"Discount coupons riders apply at checkout"*) is where you create promo codes such as `WELCOME20` or `FLAT50`. Riders type the code on the booking screen and see the discount in the fare before they confirm.

![Offers](/docs/go4ride/images/admin-offers.jpg "Admin → Growth → Offers")

Coupons are stored in `promo_codes`. The **code is the document id**, saved in capitals, so codes are unique and not case-sensitive for riders.

## Filters and table

Tabs **All / Active / Inactive**, **Search offers** (by title or code), **Export CSV** and **Add coupon**.

| Column | Shows |
|---|---|
| **Title** | Internal name, e.g. *Welcome offer* |
| **Code** | `WELCOME20` |
| **Amount** | The discount number (percent or ₹) |
| **Min. ride amount** | e.g. `₹100.00` |
| **Used** | Usage counter |
| **Expires** | Expiry date |
| **Active** | Inline switch |

## Add a coupon

| Field | Type | Notes |
|---|---|---|
| **Title** | Text, required | For you, e.g. *Diwali 2026* |
| **Code** | Text, required | e.g. `WELCOME20`. Stored in capitals. *"Can't be changed after creation."* |
| **Percentage discount** | Switch, default on | On: **Amount** is a percent. Off: a flat amount |
| **Amount** | Number, required | *"Percent when "Percentage discount" is on, otherwise a flat ₹ amount."* |
| **Max discount** | Money | *"Cap for percentage coupons."* e.g. 20 % up to ₹100 |
| **Min. ride amount** | Money, default 0 | The fare must be at least this |
| **Usage limit** | Number | *"Leave empty for unlimited."* |
| **Visibility** | Public / Private | Stored for your own use |
| **Expires** | Date | The code stops working at 00:00 on this date |
| **Active** | Switch, default on | Turn off to pause the code |

### Example

| Coupon | Settings | Fare ₹250 | Fare ₹800 |
|---|---|---|---|
| `WELCOME20` | 20 %, max ₹100, min ₹100 | −₹50 | −₹100 (capped) |
| `FLAT50` | Flat ₹50, min ₹200 | −₹50 | −₹50 |

## How riders use a coupon

1. On the booking screen the rider types the code and taps apply.
2. The app looks the code up and checks it:

| Message | Cause |
|---|---|
| *Enter a promo code.* | Empty field |
| *That code doesn't exist.* | No document with that code |
| *This code is not active right now.* | Switched off, or past the expiry date |
| *This code has reached its usage limit.* | **Used** ≥ **Usage limit** |
| *Valid on rides above ₹200.* | The estimated fare is below the minimum |

3. The discount is shown in the fare breakdown and the ride is saved with the `promoCode` and the discounted total. The booking detail in [Bookings](doc:admin/bookings) shows **Discount (CODE)**.

:::warning Usage counting in v1.0
The **Used** counter is not increased automatically when a rider books with a code, so **Usage limit** only takes effect if you update `usedCount` yourself. Use **Expires** and the **Active** switch to end a campaign, and don't rely on one-per-user limits.
:::

:::note Who pays for the discount
The discount lowers the fare the rider pays. [Settlement](doc:admin/commission-wallet) then splits that **discounted** total into commission and driver earning, so the driver and the platform share the cost of the coupon.
:::

## Tips

- Show your codes on a [banner](doc:admin/banners-onboarding) (*Offer text*: *Use WELCOME20*) or in a [push notification](doc:admin/push-notifications). Riders can't browse a list of codes in the app.
- Always set **Max discount** on percentage coupons.

**Next:** [Banners & Onboarding →](doc:admin/banners-onboarding)
