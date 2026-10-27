---
title: Chat, Offers & Reviews
description: The app's chat list with Selling and Buying tabs, the conversation screen with offer cards and accept / reject, writing a seller review, and followers and following.
---

![Chat list](/docs/classiadshub/images/app-chat-list.webp "Chats: Selling and Buying")
![Conversation](/docs/classiadshub/images/app-chat.webp "Conversation with an offer")

Every conversation belongs to **one ad and one buyer**. The seller is the ad owner. A buyer starts it with **Chat** or **Make an offer** on the ad detail screen ([Ad Details, Favorites & Sharing](doc:app/ad-detail)). Starting again on the same ad reopens the same conversation.

## Chat list

The **Chat** tab (`/chat`, title **Chats**, login required), file `lib/features/chat/screens/chat_list_screen.dart`.

| Element | Behaviour |
|---|---|
| **Selling** tab | Conversations about **your** ads (`GET /conversations?tab=selling`) |
| **Buying** tab | Conversations you started on other people's ads (`GET /conversations?tab=buying`) |
| **Search** | Filters the loaded list by the other person's name, the ad title or the last message (on the phone, no API call) |
| Row | Ad thumbnail, ad title (or the other person's name), the other person's name and the last message, time (`5m ago`), and an unread badge |
| Empty | **No Data Found** with the empty-state image |

Tap a row to open the conversation.

## Conversation

Route `/conversations/:id`, file `lib/features/chat/screens/chat_conversation_screen.dart`.

| Part | Content |
|---|---|
| App bar | The other person's name, and a **View ad** button that opens the ad |
| Ad header | Ad image, title and `price_display` |
| Messages | Your messages on the right, theirs on the left, with date pills between days. An empty chat shows *Say hello 👋* |
| Composer | **Message** field and a send button. `POST /conversations/:id/messages` with `body` |

Opening a conversation (`GET /conversations/:id`) marks the other person's messages as read and resets your unread counter. The screen loads the latest **30** messages.

:::note Updates every 8 seconds
The app has no realtime listener. While a conversation is open it polls `GET /conversations/:id` every **8 seconds**, so a reply can take a few seconds to appear. The other side also gets a **New message** push notification ([Push Notifications](doc:app/notifications)).
:::

Admins can read all conversations under **Chat** in the Admin Panel ([Chats & Chat Templates](doc:admin/chat)). Chat templates (quick replies) are not used by the app.

## Offers

An offer made on the ad detail screen appears in the conversation as an **offer card**:

| Card title | Shown to |
|---|---|
| **Your Offer** | The buyer who sent it |
| **Offer** | The seller |
| **Offer update** | A system message after the offer was accepted or rejected |

The card shows the amount and the current status. When the offer is still **pending**, the **seller** sees two buttons on the card:

| Button | API | Result |
|---|---|---|
| **Accept** | `POST /offers/:id/accept` | Status `accepted`; the buyer gets *Offer accepted* |
| **Reject** | `POST /offers/:id/reject` | Status `rejected`; the buyer gets *Offer rejected* |

An offer that is no longer pending cannot be answered again (*This offer is no longer pending.*).

:::note What the app does not do
The API also supports counter offers (`POST /offers/:id/counter`), but the app has no button for it. Accepting an offer does not mark the ad as sold. The seller does that in **My Ads → Mark sold → Who bought?** ([Post & Manage Ads](doc:app/post-ad#who-bought)).
:::

## Write a review

The **Write a review** button on a seller profile (`/seller/:id`) opens **Write a Review** (`/seller/:id/review`):

| Field | Rule |
|---|---|
| **Rate this seller** | 1–5 stars, default 5 |
| **Your review** | Optional text, up to 2000 characters |

**Submit Review** sends `POST /reviews` with `reviewee_id`, `rating`, `comment` and `type: seller_review`. The API only accepts the review when the buyer has **interacted** with the seller (a conversation about one of the seller's ads, or a confirmed purchase). Otherwise: *You can only review sellers you have interacted with.* Users cannot review themselves.

Reviews are published immediately (`is_approved: true`). Reviewing the same seller again updates the earlier review instead of adding a second one (the app sends no `ad_id`). The seller gets *New review — … left you a 5★ review.* and the seller's rating average and count are recalculated. Sellers see their reviews in **Profile → My Reviews**, admins in **Seller Reviews** ([Seller Reviews & Reports](doc:admin/reviews)).

## Followers & Following

| Where | What |
|---|---|
| Seller profile → **Follow / Following** | `POST /sellers/:id/follow` toggles. The seller gets *New follower* |
| **Profile → Followers & Following** (`/connections`, title **Connections**) | Two tabs, **Followers** (`GET /followers`) and **Following** (`GET /following`) |

**Next:** [Profile, Verification & Account Deletion →](doc:app/profile)
