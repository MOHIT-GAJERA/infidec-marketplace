---
title: Staff, Roles & Permissions
description: Create admin roles with permission sets and give staff limited access to the Admin panel.
---

Everyone who signs in to the Admin panel has the `admin` claim. What they can **see** depends on their staff role.

## Roles

**Admin → Staff → Roles & permissions** (`/staff/roles`) manages `adminRoles/{id}`: a name, a description and a list of permissions.

| Permission | Unlocks |
|---|---|
| `orders` | Orders, pickup and POS orders, returns, live rider map |
| `catalog` | Products, approvals, categories, brands, attributes, custom fields, taxes, stock, ratings, media, bulk, product order |
| `sellers` | Sellers, requests, seller wallet, seller policies |
| `delivery` | Delivery partners, requests, cash collection, salary, delivery settings, partner policies |
| `customers` | Customers, wishlists, product requests |
| `finance` | Wallet transactions, withdrawals, fund transfers, seller payouts, payment transactions |
| `marketing` | Sliders, offers, popups, featured sections, coupons, campaigns, membership, subscriptions, abandoned carts |
| `content` | Blogs, FAQs, pages, e-mail templates, send e-mail |
| `reports` | All reports |
| `pos` | Point of sale |
| `settings` | All settings pages |
| `staff` | Staff users and roles |
| `system` | System health |
| `*` | Everything (same as Super Admin) |

The seed creates a few example roles.

## Staff users

**Staff → Staff users** (`/staff`) → **Add**: full name, e-mail, temporary password and role. This calls `createStaffUser`, which creates the Auth user, sets the `admin` claim and writes `staff/{uid}` with the `roleId`. Ask the person to change the password in **My account** after their first login.

Change a staff member's role at any time; the menu updates on their next page load.

## Super Admin

An admin **without** a `staff/{uid}` document (or with an empty `roleId`) is a **Super Admin** and sees everything. Create the first one as described in [Create the Super Admin](doc:installation/super-admin).

:::warning Permissions hide menus; rules protect data
Staff permissions control the panel navigation. Firestore rules and Cloud Functions check the `admin` claim, so a staff member with technical skills could still read admin-readable data directly. Give the admin claim only to people you trust, and use roles to keep the panel focused.
:::

**Next:** [Finance: Withdrawals & Transfers →](doc:admin/finance)
