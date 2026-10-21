---
title: Chat & Contact Messages
description: Answer customers and riders in real time and handle messages from the website's Contact Us form.
---

## Support chat

Customers (app and website) and riders can start a chat from **Help & Support**, optionally linked to an order. **Admin → Chat** shows all conversations in real time with unread counts; reply directly. From an order you can also start a chat with the customer (**Message customer**).

![Chat](/docs/qwikmart/images/admin-chat.jpg "Admin → Chat")

Store owners see chats about their own store's orders in the Store panel.

## Contact messages (website)

The website footer's **Contact Us** opens a form (name, e-mail, phone, topic, order number, message). Each submission:

1. is saved in **Admin → Contact Messages** with a ticket number (e.g. `QM-LTHYUN`),
2. is e-mailed to your **Support Email** (System Settings → General),
3. sends the visitor an acknowledgement e-mail with the ticket number.

E-mails require [SMTP](doc:admin/smtp-settings); messages are saved even when SMTP is not set up. Visitors are limited to 5 messages per hour.


In **Contact Messages** you can filter by status and topic, search, open a message, **Reply by e-mail**, add an internal note and mark it **In progress** or **Resolved**.

Both screens need the `chat` permission (list to read, reply to answer / triage).
