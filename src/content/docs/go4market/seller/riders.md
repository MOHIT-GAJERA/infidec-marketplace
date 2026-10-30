---
title: Own Riders (Store Fleet)
description: Let a seller run their own delivery partners, from invitation and approval to assignment and cash settlement.
---

Besides the platform's riders, a seller can have **their own fleet**: riders with `ownerType: 'seller'` and `sellerId` set to the store. This needs **Allow sellers' own delivery partners** to be on (Admin → Delivery → Delivery settings).

## Add a rider to your fleet

**Riders** (`/riders`) in the Seller panel, or **More → Delivery boys** in the Partner app → **Add**. The panel shows the steps and a link to copy:

1. Share the partner registration link (the Delivery panel's `/register` page) with your rider. They sign up with their own e-mail and phone.
2. They fill in vehicle details and the cities they serve, and submit the application.
3. The rider is approved as a seller-owned rider linked to your store, by the admin or by you (`reviewDeliveryPartner` may be called by the owning seller).
4. They appear on the Riders page with their online status.

:::note Creating riders directly
The backend also provides `createSellerRider` (name, e-mail, password, phone, vehicle, cities). It creates an approved rider in the caller's fleet in one step. The shipped panels use the invitation flow above; you can wire this callable to a form if you prefer.
:::

The invitation link is set in `_registerUrl` in `apps/panel/lib/features/seller/seller_pages.dart`. Change it to your Delivery panel domain.

## Assign your rider

On a confirmed or packed order, choose **Assign my rider** and pick one of your online riders. Auto-assign also tries your fleet before platform riders.

## Pay and settle

- Riders in your fleet collect COD cash like any rider. You can **settle** their cash from the Riders page (`settleCash` accepts the owning seller).
- Their salary type and amount are set when they are approved (per order or monthly).

**Next:** [Earnings, Coupons & Reports →](doc:seller/finance-reports)
