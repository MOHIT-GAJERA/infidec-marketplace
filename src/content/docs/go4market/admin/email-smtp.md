---
title: Email (SMTP) & Templates
description: Configure SMTP for transactional e-mail, choose which events send e-mail, edit the HTML templates and send e-mails to customers, sellers or riders from the panel.
---

Cloud Functions send e-mail with **nodemailer** over SMTP. Gmail and Google Workspace are the tested setup; any SMTP server works.

## 1. SMTP credentials (server-side)

Set the non-secret part in `functions/.env` and the password in Secret Manager:

```bash title="functions/.env"
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587          # 465 uses SSL
MAIL_USERNAME=orders@yourmarket.com
MAIL_FROM_ADDRESS=orders@yourmarket.com
```

```bash
firebase functions:secrets:set MAIL_PASSWORD --project <your-project-id>
firebase deploy --only functions --project <your-project-id>
```

For Gmail, `MAIL_PASSWORD` must be an **app password** (Google Account → Security → 2-Step Verification → App passwords), not your normal password.

:::note Gmail rewrites the From address
With Gmail, the From address is always the authenticated account. The **Sender name** and **Reply-to** from the panel are applied. Gmail also limits sending to about 500 recipients per day; use Workspace or a transactional SMTP service for higher volume.
:::

## 2. Communication settings (panel)

**Admin → Settings → Communication** (`/settings/communication`), stored in `settings/communication` (admin-only):

| Field | Effect |
|---|---|
| Send transactional emails | Master switch (`email.enabled`) |
| Sender name / From address / Reply-to | Applied to every e-mail |
| Send admin a copy of new orders to | BCC of every *order placed* e-mail (`email.adminCopy`) |
| Events matrix | For each event (placed, confirmed, packed, rider assigned, picked up, out for delivery, ready for pickup, delivered, cancelled, returned, refund, withdrawal), tick **Email**, **SMS** and **Push** |

![Communication settings in Arabic](/docs/go4market/images/admin-communication-ar.webp "Settings → Communication (Arabic, RTL): e-mail sender, SMS provider status and the events matrix")

## 3. Templates

**Content → Email templates** (`/content/email-templates`) edits `emailTemplates/{id}` (subject + HTML):

| Template | Sent when | Placeholders |
|---|---|---|
| `order_placed` | An order is placed | `{{name}}`, `{{orderNo}}`, `{{total}}`, `{{payable}}`, `{{paymentMethod}}`, `{{itemsHtml}}`, `{{address}}`, `{{orderUrl}}` |
| `order_status` | Status changes (e.g. delivered, cancelled) | `{{name}}`, `{{orderNo}}`, `{{status}}`, `{{note}}`, `{{orderUrl}}` |
| `welcome` | A new account with an e-mail is created | `{{name}}`, `{{referralCode}}`, `{{websiteUrl}}` |
| `otp` | Reserved for e-mail codes | `{{otp}}` |
| `withdrawal` | A withdrawal is processed | `{{name}}`, `{{amount}}`, `{{status}}`, `{{note}}` |

Phone-only customers receive the welcome e-mail once they add an e-mail address in *Complete your profile*.

## 4. Send an e-mail from the panel

**Content → Send email** (`/content/emails`) writes a document to the `mail` collection. The `onMailCreated` trigger sends it via SMTP and writes the result back (`delivery.state`: `SUCCESS` or `ERROR`, plus `status: sent|failed`).

- Send to specific addresses, or to an **audience**: all customers, all sellers, all delivery partners or everyone.
- Audience e-mails go out as BCC batches of 50, capped at **450 recipients per message** to stay within Gmail limits.

## Troubleshooting

| Symptom | Fix |
|---|---|
| No e-mails at all | Check *Send transactional emails* is on, `MAIL_USERNAME` is set and `MAIL_PASSWORD` is correct. Look at the `onOrderWritten` logs |
| `Invalid login` / `535` in logs | Use a Gmail **app password**; redeploy the functions after changing the secret |
| E-mails land in spam | Send from your own domain (Workspace), set SPF/DKIM, and keep a consistent Sender name |

**Next:** [SMS Gateway →](doc:admin/sms-gateway)
