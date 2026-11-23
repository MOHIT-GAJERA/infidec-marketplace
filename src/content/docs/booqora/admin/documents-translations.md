---
title: Documents & Translations
description: Document settings for invoices, quotes, contracts and packing slips (accent colour, layout, numbering, due dates, default text) and the Translations section for customer-facing wording.
---

Two settings sections control the wording and look of what your customers receive: **Documents** for printable documents and **Translations** for the text on documents and in the Online Store.

## Documents

**Settings → Documents** (`/settings/documents`, saved as `settings.documents`). The four document types are created from orders and managed under **Documents** ([Orders](doc:admin/orders)).

![Document settings](/docs/booqora/images/platform-settings-documents.webp "Accent colour with previews of the four document types, layout, numbering and default text")

### Templates

A preview card is shown for each type:

| Type | Prefix |
|---|---|
| Invoice | `INV` |
| Quote | `QUO` |
| Contract | `CON` |
| Packing slip | `PCK` |

Pick an **Accent colour** from ten swatches or type a hex value (default `#6431DD`). An invalid hex value is refused when you save.

### Layout

| Setting | Options | Default |
|---|---|---|
| Dates on documents | Date only, or date and time | Date only |
| Page size | **A4** (210 × 297 mm) or **Letter** (8.5 × 11 in) | A4 |

### Numbering

| Option | Example |
|---|---|
| **Global** | `#1`, `#2`, `#3` |
| **Prefix per document type** | `INV-0001`, `QUO-0001`, `CON-0001` |

### Invoice due dates

**Set a due date on invoices** (on by default) with **Days until due** (default 14). When an invoice is generated from an order, its due date is the invoice date plus this number of days.

### Default text

- **Default contract terms**: the terms of your rental agreement.
- **Invoice footer**: payment instructions or a thank-you note.

:::warning What the document renderer uses today
The printable HTML (`lib/features/documents/doc_html.dart`) takes the company name, address, extra lines, email, phone and logo from [General settings](doc:admin/settings) and its colour from the **store brand colour** ([Website & Branding](doc:store/website)). In the current code, **Days until due** is the only Documents setting applied when documents are created. The accent colour, layout, numbering style and default text are saved and previewed here but not yet read when documents are generated.
:::

## Translations

**Settings → Translations** (`/settings/translations`, saved as `settings.translations`).

Every string has an English default shown as the placeholder. Type your own wording to override it, or leave the field empty to keep the default. Use the **Search translations…** box to find a key, and **Reset to default** to clear all overrides (then save).

| Group | Keys (default text) |
|---|---|
| Documents | `invoice` (Invoice), `quote`, `contract`, `packingSlip`, `dueDate`, `total` |
| Cart | `title` (Your cart), `empty`, `subtotal`, `remove`, `continue`, `checkout` |
| Checkout | `title`, `contact` (Contact details), `billing`, `delivery`, `placeOrder`, `terms` |
| Payments | `payNow`, `payLater`, `deposit`, `amountDue`, `paid`, `failed` |
| Online bookings | `pickup`, `return`, `selectDates`, `available`, `unavailable`, `addToCart` |
| Customer accounts | `signIn`, `signUp`, `signOut`, `myOrders`, `forgot`, `profile` |
| Errors | `required`, `invalidEmail`, `generic`, `notFound`, `minimum`, `closed` |

Each row shows the full key, such as `cart.title` or `errors.invalidEmail`.

:::note Stored overrides
The overrides are saved with the workspace under `settings.translations`. The current Online Store and document templates still use their built-in English text, so the overrides are not yet displayed to customers. To change storefront wording today, edit the strings in `lib/features/storefront/` and redeploy.
:::

## Where the company details come from

| Shown on documents | Set in |
|---|---|
| Company name, logo | Settings → General → Company info |
| Address | General → Address (line 1, line 2, pincode, city, state, country) |
| Extra lines (GSTIN, bank details) | General → Extra details for documents |
| Email and phone | General → Company info |
| Colour | Online store → Preferences → Brand colour |

**Next:** [Team & Security →](doc:admin/team-security)
