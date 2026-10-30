---
title: Seller Registration & Approval
description: How a seller signs up from the Seller panel, the Partner app or the website, what the wizard asks for, and how approval and store settings work.
---

## Where sellers sign up

- **Seller panel** → *Become a seller* (`/register`)
- **Partner app** → *Create account* → choose **Seller**
- **Website** → *Sell on Go4Market*, which links to the Seller panel

## The registration wizard

After signing in (e-mail, Google or phone OTP), the wizard collects:

- **Store**: store name, owner name, phone, e-mail, description, the **modules** they sell in (Grocery, Food, Pharmacy, Shopping), logo and banner.
- **Location**: city, address, pincode, and the store pin on the map (latitude and longitude are used for distance, delivery fee and ETA).
- **Business & bank**: GSTIN (optional), bank account holder, account number, IFSC or UPI ID.
- **Policy**: read and accept the seller policy (`pages/seller-policy`).

Submitting calls `registerSeller` with `policiesAccepted: true`. The function creates `sellers/{uid}` with status **pending**, sets the `seller` claim and notifies the admins. The app then refreshes the ID token and shows the **pending** screen.

## Approval

An admin reviews the request under **Sellers → Seller requests**, sets the commission and approves or rejects it ([Sellers](doc:admin/sellers)). The seller gets a push and inbox notification, and the next time they open the panel or app they land on the dashboard.

## Store settings

Approved sellers manage their store at **Store** (`/store`) in the panel, or **More → Store settings** in the Partner app:

- store name, description, logo and banner;
- phone, address and map location;
- bank and UPI details for payouts;
- the seller policy they accepted.

Sellers cannot change their status, commission or balance; only admins can.

:::tip Set the map location carefully
Delivery fees, quick-delivery eligibility (15/30-minute radius) and ETAs are calculated from the store coordinates to the customer's address. A wrong pin makes every quote wrong.
:::

**Next:** [Orders, Pickup & Rider Assignment →](doc:seller/orders)
