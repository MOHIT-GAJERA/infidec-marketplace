---
title: Coupons
description: Create percentage or fixed discount codes with validity dates, eligible products, minimum spend and usage limits, and apply them to orders.
---

**Coupons** (`/coupons`) are discount codes you apply to orders. Each coupon is stored in `workspaces/{wid}/coupons` with its code in upper case. The code is in `booqora_platform/lib/features/coupons/`.

## Coupon list

![Coupons](/docs/booqora/images/platform-coupons.webp "Coupon list with metrics, status and usage")

- **Metrics**: Coupons, Active now, Total redemptions and Expired.
- **Search** by code.
- **Filters**: Status (*active* / *inactive*) and Validity (date range).
- **Columns**: Code, Discount (e.g. `10%` or `₹500`), Eligible, Validity (*Always valid*, *From …*, *Until …*), Uses (`3 / 50` or `3 / ∞`), Status and an **Active** switch.
- **Bulk actions**: **Activate**, **Deactivate** and **Delete**. Deleting a coupon does not change past orders.

### Coupon status

| Status | When |
|---|---|
| **Active** | Switched on, within its dates, usage limit not reached |
| **Scheduled** | Switched on, but the start date is in the future |
| **Expired** | The end date has passed |
| **Limit reached** | Uses have reached *Maximum uses* |
| **Inactive** | The **Active** switch is off |

## Creating a coupon

Click **Add coupon** to open `/coupons/new`.

![New coupon](/docs/booqora/images/platform-coupon-new.webp "Coupon form with the live preview on the right")

| Section | Fields |
|---|---|
| **Coupon code** | Code (letters, numbers, dashes and underscores; not case-sensitive) and **Active** |
| **Discount** | **Percentage** (1–100, off eligible items) or **Fixed value** (an amount off the order) and the **Value** |
| **Usage & limitations** | **Specific dates** with *Valid from* / *Valid until*; **Eligible items**: *All products*, *Specific products* or *Specific collections*; **Minimum spend** |
| **Redemption limits** | **Limit total number of uses** with *Maximum uses*; **Limit to one redemption per customer**; **Stack with customer discount** |

### Live preview

The right-hand column shows a **Live preview** card of the coupon as you type: the code, the discount and a summary such as *Valid 1 Dec – 31 Dec*, *On 3 selected products*, *Minimum spend ₹2,000*, *Limited to 50 uses* and *Not combined with customer discounts*. When you edit an existing coupon, a second card shows **Times redeemed** and **Remaining** uses.

## Applying a coupon to an order

In the order editor's **Summary**, click **Add a coupon** and enter the code. Booqora checks, in this order:

1. the code exists;
2. the coupon is active;
3. today is inside the valid dates;
4. the usage limit has not been reached;
5. the order subtotal meets the minimum spend;
6. at least one line is eligible.

Each failure shows a clear message, for example *This coupon expired on …* or *A minimum spend of … is required*.

### How the discount is calculated

- The discount is based on the **eligible subtotal**: the whole subtotal for *All products*, otherwise only lines whose product is selected or belongs to a selected collection.
- **Percentage**: eligible subtotal × value %.
- **Fixed value**: the value, capped at the eligible subtotal.
- When **Stack with customer discount** is off, the order's manual discount is set to zero while the coupon is applied.
- Coupon and manual discount together can never exceed the subtotal. Tax is calculated after the discount.

The coupon's **uses** counter goes up by one when an order is saved with a newly applied code.

:::note Where coupons can be redeemed
In this version, coupons are applied to orders in the Rental Platform. The Online Store checkout does not show a coupon field, so add the code when you review an online booking. The *Limit to one redemption per customer* option is saved with the coupon and shown in the preview, but the order editor does not enforce it.
:::

## Coupon report

**Reports → Coupons** shows each code with total uses, orders in the selected period, discount given and revenue. See [Reports](doc:admin/reports).

**Next:** [Products →](doc:admin/products)
