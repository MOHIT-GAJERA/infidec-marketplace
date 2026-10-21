---
title: SMTP / Email Settings
description: Connect an e-mail account so QwikMart can send order e-mails, contact-form notifications, bulk e-mails and test messages.
---

**Admin → System Settings → SMTP** (Super Admin only). Cloud Functions send every e-mail through this server.

![SMTP settings](/docs/qwikmart/images/admin-settings-smtp.jpg "System Settings → SMTP")

| Field | Gmail / Google Workspace | Typical hosting mailbox |
|---|---|---|
| SMTP Host | `smtp.gmail.com` | `mail.yourstore.com` |
| SMTP Port | `587` | `587` (TLS) or `465` (SSL) |
| Username | your full Gmail address | your full mailbox address |
| Password | a 16-character **App Password** | mailbox password |
| Encryption | TLS | TLS / SSL |
| From Address | `support@yourstore.com` | `support@yourstore.com` |
| From Name | `YourStore` | `YourStore` |

Click **Send test e-mail** after saving. Every sent or failed e-mail is logged in **Email → Mail Log**.

## Gmail: use an App Password

Gmail rejects your normal password with *"530 Authentication Required"*.

1. Turn on **2-Step Verification** for the Google account.
2. Open [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), create an app password named *QwikMart*.
3. Paste the 16 characters (without spaces) as the SMTP password.

:::tip Use a transactional provider for volume
Gmail allows about 500 messages a day. For order e-mails at scale use Amazon SES, SendGrid, Brevo, Zoho or Mailgun — they all provide SMTP credentials.
:::

## What QwikMart e-mails

- Website **Contact Us** messages → your support address, plus an acknowledgement with a ticket number to the sender
- Bulk e-mails from **Email → Compose Email**
- Templates in **Email → Templates** (with `{{placeholders}}`) for transactional messages

Password-reset e-mails are sent by **Firebase Authentication**, not SMTP — customise them in Firebase console → Authentication → **Templates**.
