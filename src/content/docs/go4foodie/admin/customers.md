---
title: Customers
description: Guest profiles built from orders, reservations and gift-card purchases, with order and booking history, lifetime spend and repeat-guest count.
---

**Admin → Customers** (*"Guest profiles, history, and lifetime value."*) is your guest list. Guests are added **automatically**: the first time someone places an online order, books a table or buys a gift card with an email address, a customer profile is created (or updated, matched by email). You can also add guests by hand.

![Customers](/docs/go4foodie/images/admin-customers.jpg "Admin → Customers")

**Permission:** `manage:customers` (**OWNER** and **MANAGER**).

## Stats

| Tile | Value |
|---|---|
| **Total Customers** | All customer profiles |
| **Lifetime Value** | Sum of every customer's spend (non-canceled orders) |
| **Avg Spend** | Lifetime value ÷ number of customers |
| **Repeat Guests** | Customers with more than one visit (orders + reservations) |

## Filters

- Status pills **All / Active / Inactive**
- **Search customers…**: name, email or phone
- **Add Customer**

## Customer table

| Column | Shows |
|---|---|
| **Customer** | Avatar, name, email |
| **Phone** | Phone or — |
| **Address** | One line, or — |
| **Status** | **Active** (green) / **Inactive** (grey) |
| **Created** | `Oct 22, 2026` |
| **Actions** | View (eye), Edit, Delete |

If nothing matches you see *"No customers match your filters."*

## Customer profile

Click the eye to open **Customer**:

- avatar, name and status, email (click to write a mail), phone (click to call), address,
- tiles **Lifetime** (total spend), **Orders** (count) and **Visits** (orders + reservations),
- **ORDER HISTORY**: order number, date and total for each order,
- **RESERVATIONS**: reference, date and *Table* / *Event*.

## Add or edit a customer

:::steps
### Open the form
Click **Add Customer**, or the pencil on a row.

### Fill in the details
| Field | Rule |
|---|---|
| **Name** | At least 2 characters: *"Name is required"* |
| **Email** | Valid email: *"Enter a valid email"*. Must be unique: *"A customer with this email already exists"* |
| **Phone** | Optional |
| **Address** | Optional, e.g. *Street, City, State* |
| **Status** | Active / Inactive |

### Save
Click **Add customer** or **Save changes**.
:::

:::note Inactive customers
Setting a customer to **Inactive** blocks their sign-in to the Customer App (*"This account is inactive. Please contact the restaurant."*). It doesn't delete their history. See [Customer App](doc:app/customer).
:::

## Delete a customer

Click the trash icon and confirm *"Delete customer "Name"?"*. The profile and its app login are removed. Their orders, reservations, gift cards and table sessions **stay** in the system, but they are no longer linked to a customer. If the same email orders again, a new profile is created.

**Next:** [Gift Cards & Coupons →](doc:admin/gift-cards)
