---
title: Notifications & Email
description: Send push notification campaigns and bulk e-mails, and manage e-mail templates.
---

## Push notifications

**Admin → Notifications**: write a title and message, optionally add an image, choose the audience (*Everyone*, *All Customers*, *All Delivery Boys* or a *Specific User*) and send. Past campaigns are listed with their audience and date.

![Notifications](/docs/qwikmart/images/admin-notifications.jpg "Admin → Notifications")

Order, delivery, return and chat notifications are sent automatically — see [Push Notifications (FCM)](doc:admin/push-notifications).

## E-mail

**Admin → Email** has three parts:

| Part | What it does |
|---|---|
| **Compose Email** | Send a message to selected customers, riders or a list of addresses (queued and sent in the background) |
| **Email Templates** | Edit subject and body of transactional e-mails; use `{{placeholders}}` such as `{{name}}` |
| **Mail Log** | Every e-mail with its status (sent / failed) and error message |

E-mail needs working SMTP settings — see [SMTP / Email](doc:admin/smtp-settings).
