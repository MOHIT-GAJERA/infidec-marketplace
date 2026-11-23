---
title: Documents
description: Invoices, quotes, contracts and packing slips — how they are created from orders, numbered, finalized, sent, paid, signed, printed and exported.
---

**Documents** (`/documents`) collects the paperwork generated from your orders: **invoices**, **quotes**, **contracts** and **packing slips**. Each one is a snapshot of an order stored in `workspaces/{wid}/documents`. The code is in `booqora_platform/lib/features/documents/`.

## Creating a document

Documents are always created from an order. Open the order and use the **Documents** card:

| Button | Creates | Number prefix |
|---|---|---|
| **New quote** | Quote | `QUO-` |
| **New contract** | Contract | `CON-` |
| **Packing slip** | Packing slip | `PS-` |
| **Create invoice** | Invoice | `INV-` |

Unsaved order changes are saved first. The new document copies the order's customer, lines, subtotal, discount, tax, total, deposit and amount paid, and opens straight away. An invoice also gets a **due date**: today plus *Days until due* from *Settings → Documents* (14 days by default).

Each type has its own counter on the workspace, so numbers run `INV-0001`, `INV-0002` … independently of quotes and contracts.

## Documents list

![Documents](/docs/booqora/images/platform-documents.webp "Documents list with one tab per type, metrics and filters")

- **Tabs**: Invoices, Quotes, Contracts, Packing slips (`/documents?tab=invoice|quote|contract|packing`).
- **Metrics**: Nr. of documents, Paid amount, Revenue and Due.
- **Search** by number or customer.
- **Filters**: Finalized (All / Yes / No), Sent (All / Yes / No), Payment status (not for packing slips) and Date.
- **Columns**: Number (with *Finalized* or *Draft* underneath), Order #, Customer, Date, Due date (invoices), Total, Payment and Sent.
- **Bulk actions**: **Mark as sent** and **Delete**. Deleting documents never affects the order.
- **Export CSV** downloads Number, Order, Customer, Date, Due date, Subtotal, Tax, Total, Paid, Due, Payment status, Finalized and Sent for the current tab.

## The document page

Opening a document (`/documents/:id`) shows it as a paper preview with your logo, company details, the customer (**Bill to**), the rental period, the lines and the totals. Next to it are the **Order** card (with **Open order**) and, for invoices, a **Payment** card.

Click to edit the **Reference**, the **Notes** text (terms, instructions or a personal message) and the **Footer** (bank details, registration number and so on).

### Header actions

| Action | What it does |
|---|---|
| **Finalize** | Locks the document. For invoices, lines and totals are locked but payments can still be recorded |
| **Record payment** | Invoices only. Adds a payment to the linked order and the invoice |
| **Print** | Opens the browser print dialog with a clean HTML layout. Choose *Save as PDF* to get a PDF |
| **Send** | Emails the document to the customer and marks it as sent |
| **More → Download HTML** | Saves the document as an `.html` file |
| **More → Mark as sent / not sent** | Toggles the sent flag manually |
| **More → Update from order** | Re-copies lines and totals from the order (only before finalizing) |
| **More → Delete** | Removes the document |

:::warning Finalize before you send invoices
Once a document is finalized, **Update from order** is no longer offered. Finalize invoices when the order is complete so later order edits do not change a document the customer already has.
:::

## Payment status

Invoices carry their own `paid`, `due` and `paymentStatus` (`payment_due`, `partially_paid`, `paid`, `overpaid`). **Record payment** opens the same dialog as on orders (amount, method, type, note) and updates both the invoice and the order. Packing slips have no totals or payment status.

## Signatures

Quotes and contracts have a **Signature** block:

- **Sign now** asks for a full name and stores it with the date and time; the name is shown in a handwritten-style font. Use **Sign again** to replace it.
- **Request signature** emails the customer asking them to review the document and reply to confirm. It needs an email address on the customer.

The block shows *Signed by … on …* or *Awaiting signature*.

## Packing slips

A packing slip lists quantities and items without prices. Each line has a tick box so your warehouse team can mark lines as packed; the ticks are saved on the document (`packed`).

## Emails

**Send** opens the email dialog with the matching template context (invoices, quotes, contracts, or orders for packing slips). Emails go out through the `sendEmail` Cloud Function over your SMTP account. If sending fails you can open the message in your own mail app instead. See [Email & SMTP](doc:admin/email-smtp).

Layout options such as paper size and the due-date term are in [Documents & Translations](doc:admin/documents-translations).

**Next:** [Coupons →](doc:admin/coupons)
