---
title: Coupons & Abandoned Carts
description: Create platform and seller coupons and promo codes with limits and schedules, free-delivery codes, and recover abandoned carts with reminders.
---

## Coupons & promo codes

**Admin → Marketing → Coupons & promo codes** (`/marketing/coupons`). Each coupon is a document `coupons/{CODE}`, where the ID is the uppercase code.

| Field | Key | Notes |
|---|---|---|
| Code | ID | Uppercase letters and digits, e.g. `WELCOME50` |
| Description shown to customers | `message` | Shown in the coupon list at checkout |
| Discount type / value | `discountType` (`percent` or `flat`), `value` | 20 % or ₹50 |
| Max discount | `maxDiscount` | Cap for percent coupons |
| Minimum order | `minOrder` | Subtotal needed |
| Starts / Expires | `startAt`, `endAt` | Schedule |
| Total uses / Uses per customer | `usageLimit`, `perUserLimit` | Tracked in `usedCount` and `coupons/{CODE}/usages/{uid}` |
| Seller | `sellerId` | Empty = platform coupon; a seller = applies only to that seller's items |
| Free delivery | `freeDelivery` | The discount equals the delivery fee, capped at `value` / `maxDiscount` |
| Coupon image, Active | | Display and on/off |

![Coupons at checkout](/docs/go4market/images/app-customer-coupons.webp "Coupons in the Customer app; codes the cart does not qualify for show how much more to add")

### How coupons are applied

Coupons are evaluated **only on the server** (`validateCoupon`, `getCheckoutQuote`, `placeOrder`). The minimum order, dates, usage limits and seller scope are checked every time, and usage is counted when the order is placed. Cancelling an order gives the use back.

:::note Who pays for a seller coupon
A coupon with a `sellerId` is funded by that seller: at delivery its discount is deducted from the seller's settlement (`couponShare`). Platform coupons are funded by you.
:::

Sellers can create their own coupons in the Seller panel (**Marketing → Coupons**) and the Partner app; they are automatically scoped to the seller.

## Abandoned carts

**Admin → Marketing → Abandoned carts** (`/marketing/abandoned-carts`) lists signed-in customers whose cart items were added more than **6 hours** ago and who have not ordered. It shows the customer, phone, e-mail, items, cart value and last activity, from the `abandonedCarts` callable. Contact them, or create a coupon for them.

Every day at **18:00 IST**, `remindAbandonedCarts` sends a push reminder ("Your cart is waiting") to these customers automatically.

Sellers have the same page for carts that contain **their** products.

**Next:** [Wallet, Refer & Earn, Membership →](doc:admin/wallet-membership)
