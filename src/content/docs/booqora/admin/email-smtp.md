---
title: Email & SMTP
description: How Booqora sends email over SMTP from Cloud Functions, the MAIL_* secrets, the Settings → Emails options, manual templates and placeholders, and the automatic booking and payment emails.
---

Booqora sends every email from the server. The Rental Platform calls a Cloud Function, the function connects to your SMTP server with **nodemailer**, sends the message and writes a row to the email log. No mail password is ever stored in the browser or in Firestore.

## SMTP configuration

| Name | Kind | Purpose | Default |
|---|---|---|---|
| `MAIL_USERNAME` | Secret | SMTP login | none |
| `MAIL_PASSWORD` | Secret | SMTP password or app password | none |
| `MAIL_FROM_ADDRESS` | Secret | The address in the From header | none |
| `MAIL_HOST` | `functions/.env` | SMTP host | `smtp.gmail.com` |
| `MAIL_PORT` | `functions/.env` | SMTP port. `465` uses TLS from the start, anything else uses STARTTLS | `587` |

```bash title="Terminal"
firebase functions:secrets:set MAIL_USERNAME --project <your-project-id>
firebase functions:secrets:set MAIL_PASSWORD --project <your-project-id>
firebase functions:secrets:set MAIL_FROM_ADDRESS --project <your-project-id>
```

```bash title="functions/.env"
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
```

Redeploy the functions after changing either. See [Environment Configuration](doc:installation/environment-configuration).

:::tip Gmail
With Gmail or Google Workspace, turn on 2-step verification and create an **app password** for `MAIL_PASSWORD`. Your normal password will be rejected.
:::

## How a message is built

The function `sendMail` in `functions/index.js`:

- **From**: `"<From name>" <MAIL_FROM_ADDRESS>`. The from name is **Settings → Emails → From name**, or the company name.
- **Reply-To**: the reply-to email, or the email from [General settings](doc:admin/settings).
- **CC**: any addresses in *Send a copy of all outgoing emails to*, plus CCs from the caller.
- **Body**: plain text plus an HTML version with a header in the store's brand colour, the logo and company name, and a footer with your **Footer text** (or "Sent by <name> via Booqora").
- Every attempt is logged to `workspaces/<id>/emailLog` with status `sent` or `failed`.

## Settings → Emails

**Settings → Emails** (`/settings/emails`, saved as `settings.emails`).

![Email settings](/docs/booqora/images/platform-settings-emails.webp "Sending address, header and footer, system emails, templates and the email log")

| Section | Fields |
|---|---|
| General | **Send a copy of all outgoing emails to**: comma-separated addresses, each validated |
| Sending address | **From name**, **Reply-to email** (validated). A "Custom sending domain" box shows *Not verified*: emails go out from your SMTP account, and there is no domain verification flow in the panel |
| Header and footer | **Header text** and **Footer text**. The current HTML layout uses the footer text only |
| System emails | **Online order confirmation**, **Account confirmation**, **Password reset** |
| Manual email templates | Add, edit, enable or delete templates |
| Email log | The 50 most recent emails with recipient, subject, status and date |

:::note System email switches
Only **Online order confirmation** is read by the server: switching it off stops the customer email sent by `onOnlineOrder`. The other two switches are stored but no function sends those emails.
:::

## Manual templates

New workspaces start with seven templates: Order confirmation, Order cancellation, Send quote, Send contract, Send invoice, Invoice approaching due date and Invoice overdue.

Each template has a **Template name**, **Available when viewing** (Orders, Invoices, Quotes, Contracts, Customers), **Subject** and **Body**. Click a chip to insert a placeholder at the cursor:

| Placeholder | Replaced with |
|---|---|
| `{{customer.name}}` | Customer name |
| `{{order.number}}` | Order number |
| `{{document.number}}` | Document number |
| `{{company.name}}` | Your company name |

When a team member clicks **Email** on an order or document, the dialog loads the enabled templates for that context, fills the placeholders and lets them edit before sending. If sending fails, they can open the message in their own mail app instead.

## The email functions

| Function | Type | What it does |
|---|---|---|
| `sendEmail` | Callable | Sends a staff email. Requires a signed-in, non-anonymous workspace member, 1 to 20 valid recipients, a subject and a body. Used by order, document and payment-link dialogs |
| `onOnlineOrder` | Firestore trigger on `workspaces/{wid}/orders/{oid}` | Runs only for orders with `source: 'online'`. Emails the customer "We received your booking request — <store>" (unless the system email is off) and emails the store's General email "New online booking from <customer>" |
| `verifyPayment` | Callable | After a verified online payment, emails the customer "Payment received — <store>" with the amount and transaction reference |

Both booking emails list the items, the rental period (formatted in the workspace time zone) and the total. Email failures are logged and never block the booking or payment.

**Next:** [Taxes, Locations & Custom Fields →](doc:admin/taxes-locations)
