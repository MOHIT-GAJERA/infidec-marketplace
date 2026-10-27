---
title: Email Templates & SMTP
description: Manage the email templates (code, subject, HTML body, variables) and what you need to add to actually send email, since the backend has no SMTP or email provider built in.
---

**Admin → Settings → Email Templates** stores the text of the emails your platform sends. Data: the Firestore `email_templates` collection (`/admin/crud/email_templates`).

![Email Templates](/docs/classiadshub/images/admin-settings-email-templates.jpg "Settings → Email Templates")

:::warning No SMTP in this version
There is **no SMTP setting and no email-sending code** in the backend. The Firebase version sends notifications by push and in-app only. The templates are stored (the demo has `ad_approved`, `payment_receipt` and `welcome`, carried over from the earlier version) so you can wire them to an email service. Until you do, no email is sent, and **Email notifications** in [Notification Settings](doc:admin/otp-notifications#notification-settings) has no effect.
:::

## The list

| Column | Shows |
|---|---|
| **Code** | Template code, e.g. `welcome` (sortable) |
| **Subject** | Subject line, e.g. *Welcome to {{ app_name }}!* |
| **Active** | Toggle |
| **Action** | Edit, Delete |

**Search...** covers code and subject. **Export CSV** downloads `email_templates.csv`. Templates are sorted by code.

## Create or edit a template

Click **Create Template**:

| Field | Notes |
|---|---|
| **Code** | Required and unique, e.g. `welcome`. Your sending code looks the template up by this |
| **Subject** | Required. May contain placeholders |
| **Body** | Required. Rich-text editor; saved as HTML (`body_html`) |
| **Variables** | Tags. *"Placeholders available in this template, e.g. name, link"*. A note for editors; it does not change the template |

Placeholders use the `{{ name }}` style shown in the demo templates. Replacing them is up to your sending code.

## Add email sending

The simplest option on Firebase is the official **Trigger Email from Firestore** extension, or a small function that calls your provider (SMTP, SendGrid, Mailgun, Amazon SES…).

:::steps
### Pick a provider and keep its key secret
Store the SMTP password or API key in Secret Manager, for example `firebase functions:secrets:set SMTP_PASSWORD`. Do not put it in `functions/.env` or in the Admin Panel.

### Write a helper
Add a function such as `sendTemplate(code, to, vars)` in `functions/src/lib/`. It reads `email_templates` where `code == …` and `is_active != false`, replaces `{{ key }}` in `subject` and `body_html` with `vars`, and sends the email. Check `setting("notifications", "email_enabled")` first so the admin switch works.

### Call it where you need email
Good places are next to the existing `notify()` calls: ad approved (`functions/src/routes/admin/index.ts`), payment completed (`fulfil()` in `functions/src/routes/billing.ts`), and OTP delivery for the `email` channel (`sendOtp()` in `functions/src/lib/otp.ts`, see [OTP delivery](doc:admin/otp-notifications#real-delivery)).

### Deploy
Add the secret to the function's `secrets` list and redeploy the functions (see [Deploy the Backend](doc:installation/backend-deploy)).
:::

:::note Firebase Auth emails
Password-reset and verification codes in ClassiAds-Hub are OTP codes from the API, not Firebase Auth's own email links, so the Firebase console's email templates are not used.
:::

**Next:** [Firebase Settings →](doc:admin/firebase-settings)
