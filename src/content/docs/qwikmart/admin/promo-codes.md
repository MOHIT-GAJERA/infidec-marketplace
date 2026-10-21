---
title: Promo Codes
description: Create percentage, fixed, free-delivery and cashback coupons with limits, validity and targeting.
---

**Promo Code → Add Promo Code**

![Promo codes](/docs/qwikmart/images/admin-promo-codes.jpg "Promo Code → Manage Promo Codes")

| Field | Notes |
|---|---|
| Code | What customers type, e.g. `WELCOME50` (a random code is suggested) |
| Title, Description, Image | Shown on the coupon card in the app's **Coupons** list (per language) |
| Discount type | **Percent** off, **Fixed** amount off, or **Free delivery** |
| Discount value / Max discount | e.g. 20 % with a maximum of ₹100 |
| Benefit | **Instant** (discount at checkout) or **Cashback** (credited to the wallet after the order is delivered) |
| Minimum order value | Cart value required |
| Total usage limit / Usage limit per user | Leave empty for unlimited |
| Starts at / Ends at, or Permanent | Validity window |
| Countries, Zones, Stores, Categories, Products | Optional targeting — the code only applies to matching carts |
| Active | Switch the code on or off |

Store owners can create codes for their own store in the [Store Panel](doc:admin/store-panel).

The discount is validated and applied on the server (`cartSummary`), so customers get clear messages such as *"Add ₹120 more to use this coupon"*. Usage is counted when the order is placed.
