---
title: Chat, Offers & Social Endpoints
description: Buyer–seller chat, offers and counter-offers, follows, public seller pages, reviews, confirming the buyer, reports and in-app notifications.
---

These routes live in `functions/src/routes/social.ts`. Every one except the public seller pages needs a signed-in user. Most actions also create an **in-app notification** and a **push** for the other person (see the last section).

## Chat

There is one conversation per **ad and buyer** (`key = "{adId}_{buyerId}"`). The seller is the ad owner.

| Method | Path | Body / query | Returns |
|---|---|---|---|
| `GET` | `/conversations` | `tab` (`buying` · `selling`, default both), `page`, `per_page` | Your conversations, last activity first, each with the ad, the other person, the last message and your unread count |
| `POST` | `/conversations` | `ad_id` (required), `message` (max 5000) | `201` the conversation (found or created). With `message`, sends it and notifies the seller. `422` *You cannot start a conversation on your own ad.* |
| `GET` | `/conversations/{id}` | `page`, `per_page` (default 30, max 100) | `{ conversation, messages }`, newest message first, and marks the thread read for you. `403` *Not a participant.* |
| `POST` | `/conversations/{id}/messages` | `body` (required, max 5000) | `201` the message. Notifies the other participant |
| `POST` | `/conversations/{id}/read` | — | Resets your unread counter and sets `read_at` on the other side's messages |

Messages have a `type`: `text`, `offer` (linked to an offer, with the offer attached) or `system` (offer accepted / rejected). Conversations keep `last_message`, `last_message_at`, `buyer_unread` and `seller_unread`.

:::tip Live updates
Each conversation and message stores `participant_uids` (the two Firebase uids). The Firestore rules let a participant **read** those documents directly, so a client can open a realtime listener on its own threads (`where("conversation_id", "==", id).where("participant_uids", "array-contains", uid)`). Sending still goes through the API. See [Security Rules & Storage](doc:api/security-rules).
:::

## Offers

| Method | Path | Who | Body | Result |
|---|---|---|---|---|
| `GET` | `/offers` | Buyer or seller | Query `role` (`buyer` · `seller`), `ad_id`, `page` | Your offers with the ad |
| `POST` | `/offers` | Buyer | `ad_id` (required), `amount` (required, 0–999,999,999, major units), `message` (max 500) | `201` *Offer sent.* Opens the conversation if needed and posts an `offer` message (*USD 9,000.00 offered*). Notifies the seller (`offer.received`) |
| `POST` | `/offers/{id}/accept` | Seller | — | `accepted`, system message, buyer notified |
| `POST` | `/offers/{id}/reject` | Seller | — | `rejected`, system message, buyer notified |
| `POST` | `/offers/{id}/counter` | Buyer or seller | `amount` (required), `message` | `201` a new `pending` offer with `parent_offer_id` and `countered_by`; the old one becomes `countered`. Notifies the other side |
| `POST` | `/offers/{id}/withdraw` | Buyer | — | `withdrawn` |

Only a `pending` offer can be accepted, rejected, countered or withdrawn: otherwise `422` *This offer is no longer pending.* The offer keeps the ad's currency. Accepting an offer does **not** mark the ad sold; the seller does that with *confirm buyer* or *sold*.

## Sellers and follows

| Method | Path | Auth | Returns |
|---|---|---|---|
| `GET` | `/sellers/{id}` | Optional | `{ seller, followers, following, live_ads, rating_avg, rating_count, is_following }`. Contact details hidden |
| `GET` | `/sellers/{id}/ads` | Public | The seller's published ads, newest first |
| `GET` | `/sellers/{id}/reviews` | Public | Approved seller reviews |
| `POST` | `/sellers/{id}/follow` | Signed in | **Toggles**: `{ user_id, following }`. A new follow notifies the seller. `422` *You cannot follow yourself.* |
| `GET` | `/following` | Signed in | Users you follow |
| `GET` | `/followers` | Signed in | Users who follow you |

## Selling to a buyer and reviews

| Method | Path | Who | Body | Result |
|---|---|---|---|---|
| `GET` | `/ads/{id}/potential-buyers` | Ad owner | — | Everyone who chatted about or made an offer on the ad |
| `POST` | `/ads/{id}/confirm-buyer` | Ad owner | `buyer_id` (required) | Writes `ad_sales/{adId}`, sets the ad `sold` with `buyer_id`, notifies the buyer (*Purchase confirmed … Leave a review!*) |
| `POST` | `/reviews` | Signed in | `reviewee_id` (required), `ad_id`, `rating` (1–5, required), `comment` (max 2000), `type` (`seller_review` · `buyer_review`, required) | `201` the review |
| `GET` | `/reviews/mine` | Signed in | — | Reviews you wrote |
| `GET` | `/reviews/received` | Signed in | — | Approved reviews about you |
| `POST` | `/reviews/{id}/report` | The reviewee | `reason` (required, max 500) | Sets `report_status: reported`. Appears in **Seller Review Report** in the panel |

Who may review whom:

- A **seller review** needs a conversation with that seller (for that ad, if `ad_id` is given) or a confirmed sale. Otherwise *You can only review sellers you have interacted with.*
- A **buyer review** needs a confirmed sale where you were the seller. Otherwise *You can only review confirmed buyers.*
- One review per reviewer, reviewee and ad (`key`). Posting again updates it.
- Every seller review change recalculates `seller_profile.rating_avg` and `rating_count` from the approved seller reviews.

## Reports

| Method | Path | Body | Result |
|---|---|---|---|
| `POST` | `/reports` | `type` (`ad` · `user`, required), `id` (required), `reason` (required, max 150), `details` (max 2000) | `201` `{ report_id }` *Report submitted. Thank you.* A second report on the same item by the same user while the first is still `open` returns the open one |

## Notifications

| Method | Path | Query | Returns |
|---|---|---|---|
| `GET` | `/notifications` | `unread=1`, `page`, `per_page` | Your notifications, newest first, `meta.unread_count` |
| `GET` | `/notifications/unread-count` | — | `{ unread_count }` |
| `POST` | `/notifications/read-all` | — | Marks all read |
| `POST` | `/notifications/{id}/read` | — | Marks one read (the id is a UUID) |

Each notification: `{ id, type, title, body, data, read, read_at, created_at }`. `data` carries the ids to open (`ad_id`, `conversation_id`, `offer_id`, `transaction_id`…).

| `type` | Sent when |
|---|---|
| `chat.message` | A new chat message |
| `offer.received`, `offer.accepted`, `offer.rejected`, `offer.countered` | Offer events |
| `follow.new` | Someone follows you |
| `review.received` | Someone reviews you |
| `sale.confirmed` | The seller confirms you as the buyer |
| `ad.approved`, `ad.rejected`, `ad.expired` | Moderation and expiry |
| `payment.completed`, `payment.failed`, `payment.refunded` | Billing |
| `job.application`, `job.application_status` | Jobs board |
| `verification.approved`, `verification.rejected` | Seller verification |
| `admin.broadcast` | A push from **Notification** in the panel |

Every notification is also pushed to the user's devices from `user_devices` (FCM, Android channel `classiads_default`), unless **Settings → Notification Settings → Push notifications (FCM)** is off. Tokens that FCM reports as unregistered are deleted.

**Next:** [Billing & Payments →](doc:api/billing)
