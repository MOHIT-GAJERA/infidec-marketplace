---
title: Customers
description: The customer list, filters, CSV import and export, the new customer form, deposit overrides and the customer detail page with orders and balances.
---

**Customers** (`/customers`) holds everyone who rents from you, with their contact details, addresses, discounts and order history. Records are stored in `workspaces/{wid}/customers` and each one gets a sequential number. The code is in `booqora_platform/lib/features/customers/`.

## Customer list

![Customers](/docs/booqora/images/platform-customers.webp "Customer list with metrics, filters and balances")

- **Metrics**: Customers, New this month, Total revenue and Balance due.
- **Search** by name, email or phone.
- **Filters**: Customer type (*individual* / *company*), Marketing emails (*Subscribed* / *Not subscribed*), Customer created (date range), Latest order (date range) and Tags.
- **Columns**: number, name (with *Company* or the phone number underneath), Email, Created at, Latest order, Orders and Balance due.
- **Bulk actions**: **Subscribe**, **Unsubscribe** (marketing emails) and **Delete**. Deleting a customer keeps their name on existing orders and documents.

### Import and export

**Import** reads a `.csv` file. The first row must contain a `name` column; `email`, `phone` and `type` are optional. A `type` of `company` creates a company, anything else an individual. Rows without a name are skipped.

```text title="customers.csv"
name,email,phone,type
Priya Sharma,priya@example.com,+91 98765 43210,individual
Acme Events,bookings@acme.example,,company
```

**Export** downloads the filtered list with: Number, Name, Email, Phone, Type, Marketing, Created at, Latest order, Orders, Revenue, Balance due and Tags.

## New customer

**Add customer** opens `/customers/new`. Creating the first customer also ticks the *Add your first customer* setup step.

![New customer](/docs/booqora/images/platform-customer-new.webp "New customer form: general, information, settings, addresses and deposit")

| Section | Fields |
|---|---|
| **General** | Customer name (required) |
| **Information** | Email, Phone, **Subscribed to marketing emails**, Customer type (*Individual* or *Company*) |
| **Settings** | **Discount percentage** (0–100) and a customer **Tax profile** (created in [Taxes & Locations](doc:admin/taxes-locations)) |
| **Custom fields** | Extra customer fields defined in *Settings → Custom fields* |
| **Addresses** | Any number of addresses: Country, First name, Last name, Address line 1 and 2, City, State, Pincode, and a **Main address** tick |
| **Security deposit** | Override the workspace deposit rule |

:::note Marketing opt-in
Only tick **Subscribed to marketing emails** when the customer agreed to receive promotions. The list filter and bulk actions use the same `marketing` flag.
:::

### What the settings do on orders

- The **discount percentage** is pre-filled as the order discount when you pick the customer.
- The **main address** fills the order's billing address.
- The **security deposit** choice decides the order deposit:

| Option | Deposit on each order |
|---|---|
| Default setting | Uses the workspace rule from *Settings → Pricing* (the form shows which rule that is) |
| No deposit | None |
| Percentage of order total | The given percentage of the order total |
| Use product-specific security deposits | Each product's deposit × quantity |
| Fixed amount | The same amount on every order |

See [Pricing](doc:admin/pricing) for how deposits are calculated.

## Customer detail

Opening a customer (`/customers/:id`) shows a summary at the top with **Orders**, **Revenue**, **Balance due** and **Latest order**, followed by the ten most recent orders with their dates, status and totals. **New order** starts an order for this customer.

![Customer detail](/docs/booqora/images/platform-customer-detail.webp "Customer detail: totals, recent orders, the editable form and the side panel")

Below the orders is the same form as above, so you can edit details and **Save**. The side panel has **Tags**, **Notes** and the **Activity** log. **Delete customer** is in the save bar.

### How balances are kept up to date

The order count, revenue, balance due and latest order date are stored on the customer document (`orderCount`, `revenue`, `balanceDue`, `latestOrderAt`). Booqora recalculates them every time an order of that customer is saved, changes status, receives a payment or is deleted:

- canceled orders are ignored;
- draft orders count as orders, but not towards revenue or balance;
- balance due is the sum of `due` on the remaining orders.

**Next:** [Documents →](doc:admin/documents)
