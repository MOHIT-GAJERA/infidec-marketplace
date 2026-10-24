---
title: Help & Support Tickets
description: The rider help centre: admin-managed help topics, tickets with a photo, live chat with your support team, contact options and the content pages.
---

![Help](/docs/go4ride/images/app-customer-help.webp "How can we help?")
![New ticket](/docs/go4ride/images/app-customer-ticket.webp "Raise a ticket")
![Chat](/docs/go4ride/images/app-customer-chat.webp "Chat with support")

## Help centre

Riders open **Help & support** from the headset icon on Home or from Account. The screen *How can we help?* lists the **help topics** for the *customer* audience from the Admin Panel reason lists, with a **My tickets** button in the app bar and **Raise a ticket** at the bottom.

If no topic exists yet, the app offers one built-in topic, *General enquiry*.

## Raise a ticket

:::steps
### Topic
Pick a topic (pre-selected when the rider tapped one in the help centre).

### Describe the issue
Free text. Required.

### Attach a photo
Shown only when the topic allows images (*Allow image* on the help reason). The photo is picked from the gallery, scaled to max 1600 px and uploaded to Cloud Storage under `support/<uid>_<time>/<file>`.

### Submit ticket
Creates `support_tickets/{id}` with a short ticket number (`#123456`), the rider's name, topic, description and status **Pending**, plus the first chat message in `support_tickets/{id}/messages`.
:::

## Ticket chat

**My tickets** lists the rider's tickets with their status. Tap one to open the chat:

- Messages appear live, the rider's on the right and the support team's on the left.
- The rider can send text and photos.
- When staff mark the ticket **Resolved** or **Closed**, the input is replaced with *This ticket is resolved. Raise a new ticket if you need more help.*

| Status | Pill |
|---|---|
| `pending` | Pending (new, nobody replied yet) |
| `active` | In progress |
| `resolved` | Resolved |
| `closed` | Closed |

Your team answers from **Admin → Support tickets** and sees totals on the Support overview ([Support Tickets](doc:admin/support)).

## Contact us

Account → **Contact us** opens a sheet with the details from **Admin → Settings → Contact us**: availability (*Available 24 × 7* by default), **Call us**, **Email** (subject *Go4Ride support*), **WhatsApp** (opens `wa.me`) and the address. Only the filled-in channels are shown. With no phone, e-mail or WhatsApp set, the sheet says *Contact details will be available soon. Meanwhile, raise a ticket from Help & support.*

## Emergency

Account → **Emergency** dials the emergency number from App settings (112 by default). During a ride the red **SOS** button also alerts your team ([Live Tracking, OTP & SOS](doc:app-customer/ride-tracking)).

## About, Privacy and Terms

Account → **About Go4Ride**, **Privacy policy** and **Terms & conditions** show content pages written in the Admin Panel (Markdown) for the *customer* audience. If a page is empty the app shows *Nothing here yet*. Fill in all three before you publish. Google Play and the App Store review the privacy policy.

:::note Storage rules
Ticket photos are only accepted by `firebase/storage.rules` under `support/…`. If uploads fail with *permission denied*, deploy the Storage rules ([Deploy the Backend](doc:installation/backend-deploy)).
:::

**Next:** [Push Notifications →](doc:app-customer/notifications)
