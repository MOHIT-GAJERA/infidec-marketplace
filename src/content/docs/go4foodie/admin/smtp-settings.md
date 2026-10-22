---
title: SMTP / Email Settings
description: Connect an SMTP account so Go4Foodie can send order, reservation and gift card e-mails. Covers the MAIL_* variables, Gmail app passwords, ports and what happens when e-mail isn't configured.
---

The `api` function sends every e-mail through **your SMTP server** with nodemailer. As with the payment keys, SMTP is set on the backend: the password goes in **Secret Manager** and everything else in `firebase/functions/.env.<project-id>`. Redeploy the function after any change.

## Variables

| Variable | Where | Gmail / Google Workspace | Typical hosting mailbox / provider |
|---|---|---|---|
| `MAIL_HOST` | `.env` | `smtp.gmail.com` | `mail.yourrestaurant.com`, `smtp-relay.brevo.com`, `email-smtp.<region>.amazonaws.com`… |
| `MAIL_PORT` | `.env` | `587` | `587` or `465` (the default is `2525` when empty) |
| `MAIL_SCHEME` | `.env` | *(empty)* | *(empty)* or `smtps` |
| `MAIL_USERNAME` | `.env` | Your full Gmail address | Your mailbox address or the provider's SMTP user |
| `MAIL_FROM_ADDRESS` | `.env` | Same as the username, or an alias you verified in Gmail | An address your provider lets you send from. Defaults to `MAIL_USERNAME` |
| `MAIL_PASSWORD` | **Secret** | A 16-character **app password** | Mailbox password or SMTP key |

```env title="firebase/functions/.env.yourrestaurant-1a2b3"
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SCHEME=
MAIL_USERNAME=orders@yourrestaurant.com
MAIL_FROM_ADDRESS=orders@yourrestaurant.com
```

```bash
cd firebase
firebase functions:secrets:set MAIL_PASSWORD
FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions
```

## Ports and encryption

| Port | `MAIL_SCHEME` | Connection |
|---|---|---|
| `587` | empty | Plain connection that upgrades to TLS (**STARTTLS**) when the server offers it. The usual choice |
| `465` | empty or `smtps` | **SSL/TLS from the first byte** (implicit TLS) |
| any other | `smtps` | Forces implicit TLS on that port |
| `25` / `2525` | empty | STARTTLS when offered. Many clouds block port 25, so avoid it |

The value `null` in `MAIL_SCHEME` counts as empty, which helps if you copied a Laravel `.env`.

## Sender name

Every e-mail goes out as **Go4Foodie** `<MAIL_FROM_ADDRESS>`. The sender name is fixed in `firebase/functions/src/services/mailer.ts` (`from: { name: 'Go4Foodie', … }`). There is no `MAIL_FROM_NAME` setting, so to show your restaurant's name, change it there and redeploy. The e-mail designs also carry the Go4Foodie name, a sample address and links. See [Emails → Branding](doc:admin/emails#branding-the-e-mails).

## Gmail: use an App Password

Gmail rejects your normal password with *"535 Username and Password not accepted"* or *"530 Authentication Required"*.

1. Turn on **2-Step Verification** for the Google account.
2. Open [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) and create an app password named *Go4Foodie*.
3. Paste the 16 characters as `MAIL_PASSWORD`. You can paste them with or without spaces, because Go4Foodie removes the spaces.

:::tip Use a transactional provider for volume
A Gmail account can send roughly 500 messages a day (Workspace about 2,000). For a busy restaurant, use Amazon SES, Brevo, SendGrid, Mailgun or Zoho. They all provide SMTP credentials and better deliverability. Set up SPF and DKIM for your domain with the provider so e-mails don't land in spam.
:::

## When SMTP isn't configured

If `MAIL_HOST`, `MAIL_USERNAME` or `MAIL_PASSWORD` is empty, **sending is skipped**. That's why an unused `MAIL_PASSWORD` placeholder is harmless as long as `MAIL_HOST` stays empty. The order, reservation or gift card is still saved, and the log shows:

```text
SMTP not configured — skipping email to guest@example.com
```

A failed send (wrong password, blocked port) **never blocks** the action either. The error is logged and the guest just doesn't get the e-mail.

## Checking the logs

Every send is logged by the function:

```text
Mail sent to guest@example.com: "Order ORD-12345 confirmed · Go4Foodie" (<message-id>)
```

```bash
cd firebase
firebase functions:log            # or Firebase console → Functions → Logs
```

Search for `Mail sent`, `SMTP not configured` or `email failed`. For testing, an [Ethereal](https://ethereal.email) account (`smtp.ethereal.email`, port `587`) catches every message, and the log line ends with a `preview:` link to read it.

:::note Test locally first
Put the same `MAIL_*` values (including `MAIL_PASSWORD`) in `firebase/functions/.env.local` and run the API locally ([Localhost Setup](doc:installation/localhost-setup)). Then you can try your SMTP settings without redeploying.
:::

**Next:** [Emails →](doc:admin/emails)
