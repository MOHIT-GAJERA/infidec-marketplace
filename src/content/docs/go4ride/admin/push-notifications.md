---
title: Push Notifications
description: Send a push broadcast to everyone, all riders or all drivers through Firebase Cloud Messaging topics, with a live preview and a history of what was sent. Also lists the automatic notifications.
---

**Admin → Growth → Push notifications** (*"Broadcast to riders and drivers"*) sends a message to every device of an audience at once, for example a festival offer or a service update.

![Push notifications](/docs/go4ride/images/admin-push-notifications.jpg "Admin → Growth → Push notifications: composer with phone preview, and the history")

## Send a broadcast

:::steps
### Pick the audience
| Audience | FCM topic | Who receives it |
|---|---|---|
| **Everyone** | `all` | Riders and drivers |
| **Customers** | `customers` | Customer App users |
| **Drivers** | `drivers` | Driver App users |

### Write the message
**Title** (up to 65 characters) and **Message** (up to 180 characters). The phone preview shows how it will look, branded *GO4RIDE*.

### Send
Click **Send to everyone** (or customers / drivers) and confirm *"Send to Everyone? This push notification goes out immediately and can't be recalled."* You see *"Notification sent."*
:::

The panel calls the `sendBroadcast` Cloud Function (admin only), which sends to the FCM topic, then saves a copy in `push_notifications` with the title, body, audience, who sent it and when.

## History

*"Latest 50 broadcasts"*: each row shows the **Notification** (title and message), the **Audience** and when it was **Sent**. When empty: *"No notifications sent yet."*

## How devices subscribe

| App | Topics | When |
|---|---|---|
| **Customer App** | `all`, `customers` | After sign-in, on Android and iOS, once the rider allows notifications |
| **Driver App** | `all`, `drivers` | After sign-in |

Push needs a working FCM setup in each app (Android `google-services.json`; for iOS an APNs key uploaded in Firebase Console → **Project settings → Cloud Messaging**). See [Customer App push notifications](doc:app-customer/notifications).

:::tip Test first
Send to **Drivers** while only your own test driver is signed in, or use a separate test project, before your first broadcast to all customers.
:::

## Automatic notifications

These are sent by Cloud Functions without any action from you. They go to the device token saved on the user (`fcmToken`):

| Trigger | Recipient | Message |
|---|---|---|
| New ride request | Up to 25 eligible drivers | *New ride request* · *city ride nearby* |
| No driver available | Rider | *No drivers available* · *All nearby drivers are busy right now…* |
| Ride accepted / driver on the way / arrived / started / completed / cancelled | Rider | *Ride update* · e.g. *Your driver has arrived.* |
| Cancellation fee charged | Rider | *Cancellation fee* · *A cancellation fee of 25 was charged.* |
| Online payment paid / failed | Rider | *Payment successful* · *₹250 added to your wallet.* |
| KYC approved / rejected | Driver | *KYC approved* · *You can now go online and accept rides.* |
| Withdrawal approved / rejected | Driver | *Withdrawal update* · *Your payout was approved.* |

The texts are in the Cloud Functions source (`functions/src/rides.ts`, `payments.ts`, `admin.ts`, `payouts.ts`). Change them there and redeploy if you want different wording or another language.

**Next:** [Email Templates →](doc:admin/email-templates)
