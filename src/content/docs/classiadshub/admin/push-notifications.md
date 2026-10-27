---
title: Push Notifications
description: Send a broadcast notification with an optional image and linked ad to all users or to selected users, and review the send history.
---

**Admin → Notification** (page title **Send Notification**) sends a message to users' devices through Firebase Cloud Messaging (FCM) and also saves it in each user's in-app notification list.

![Send Notification](/docs/classiadshub/images/admin-notifications.jpg "Admin → Notification")

The page has three parts: the form (left), the user list (right) and the history (bottom).

## Send a notification

| Field | Notes |
|---|---|
| **Select User** | **All**, or **Selected users** (tick users in the list on the right) |
| **Title** | Required, max 191 characters |
| **Message** | Required, max 2000 characters |
| **Include Image** | Tick to upload an image. It is stored in Storage under `brand/notifications/` and shown in the push and the in-app list |
| **Advertisement** | Optional. *"Tapping the notification opens this ad"*. Lists approved ads (up to 100) |

With **Selected users**, a line shows *"3 user(s) selected in the list."* and **Submit** stays disabled until at least one user is ticked. The user list has **Search...** (name, email or phone) and shows **Name** and **Number**, 10 per page.

Click **Submit**. The toast shows the result, e.g. *"Sent to 128 recipient(s)."*

:::tip Image from the ad
If you pick an **Advertisement** but no image, the ad's first photo is used as the notification image.
:::

## What happens on send

`POST /admin/push-notifications` (multipart) does this:

1. Picks the recipients:
   - **All**: every non-deleted account with status `active` (this includes staff accounts);
   - **Selected users**: the ticked user ids.
2. Writes one document per user to the `notifications` collection with type `admin.broadcast`, the title, body, image and `item_type: ad` / `item_id` when an ad is linked. Users see it in **Notifications** on the website and in the app.
3. Sends one FCM multicast to every registered device of those users (`user_devices` collection, one FCM token per device). Android uses the channel `classiads_default` with high priority and the default sound.
4. Deletes device tokens that FCM reports as no longer registered.
5. Saves a history row in `push_notifications` with the sender and the recipient count.

The API also accepts `target: "role"` (with `target_role`) and `target: "user"` (with `target_user_id`) for scripts, but the page only offers **All** and **Selected users**.

:::note Recipients vs. devices
**Recipients** is the number of users who got the in-app notification. A user with no app installed, or who denied notification permission, has no device token and gets no push, but still sees the message in their in-app list.
:::

:::warning Push master switch
If **Push notifications (FCM)** is off in [Notification Settings](doc:admin/otp-notifications#notification-settings), no push is sent at all (broadcasts and automatic notifications). In-app notifications are still written.
:::

## History

The bottom table lists sent notifications, newest first.

| Column | Shows |
|---|---|
| **Title** | Title |
| **Message** | First two lines |
| **Image** | Thumbnail, if any |
| **Send To** | `all` or `selected` |
| **Recipients** | Number of users |
| **Action** | Delete (removes the history row only, not the users' notifications) |

**Export CSV** downloads `notifications.csv`.

## Automatic notifications

Besides broadcasts, the API notifies users on events, using the same `notify()` function (`functions/src/lib/notify.ts`):

| Type | When |
|---|---|
| `ad.approved` / `ad.rejected` | An admin approves or rejects an ad |
| `ad.expired` | The hourly job expires an ad |
| `verification.approved` / `verification.rejected` | Seller verification decided |
| `payment.completed` / `payment.failed` / `payment.refunded` | Payment confirmed, bank transfer rejected, refund |
| `chat.message` | New chat message |
| `offer.received`, `offer.accepted` / `offer.rejected`, `offer.countered` | Offers on an ad (see [Chat, Offers & Reviews](doc:app/chat-offers)) |
| `follow.new`, `review.received`, `sale.confirmed` | New follower, new review, buyer confirmed for a sale |
| `job.application`, `job.application_status` | Job applications |

 How the app registers its token and opens a notification is described in [Push Notifications (app)](doc:app/notifications).

**Next:** [Countries, States, Cities, Areas & Currencies →](doc:admin/locations)
