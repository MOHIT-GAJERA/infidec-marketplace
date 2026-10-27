---
title: Chats & Chat Templates
description: Read buyer–seller conversations per product for moderation, delete abusive conversations, and manage the pre-defined quick messages and replies stored as chat templates.
---

**Admin → Chat Management** has two pages:

| Menu item | Page title | Data |
|---|---|---|
| **Chats** | *Message* | Firestore collections `conversations` and `messages` (offers in `offers`) |
| **Chat Templates** | *Chat Template* | Firestore collection `chat_templates` |

Staff need the **chat** permission.

## Chats

A conversation is always about one ad: the buyer opens it from the ad page on the website or in the app, and the seller answers. Messages can be plain text, **offers** (price proposals) or system messages. The **Chats** page is a read-only moderation view of all of them.

![Chats](/docs/classiadshub/images/admin-chat.jpg "Admin → Chat Management → Chats")

The page has three columns.

### Products

Every ad that has at least one conversation, ordered by the latest message (`GET /api/v1/admin/chat/products`). Each row shows the ad image, title, price and the number of chats (*3 chats*), plus the date of the last message. Ads that were deleted show *Deleted ad*. The search box filters by title; the refresh button reloads the list.

### Chats

Click a product to list its conversations (`GET /api/v1/admin/conversations?ad_id=<id>`). The header shows *N Conversations, N Unread*. Each row shows the buyer's avatar and name, the last message and the time since it was sent. Search by buyer or seller name. Before you pick a product the column shows *Select an item to chat*.

### Conversation

Click a conversation to open it (`GET /api/v1/admin/conversations/{id}`). Before that the column shows *No conversation selected yet!*

| Part | Content |
|---|---|
| Header | Ad image and title, *Buyer ↔ Seller* names, and the **Delete conversation** button |
| Messages | Oldest first. Seller messages on the right (navy), buyer messages on the left (white), system messages highlighted. Offer messages carry a **💰 Offer** label. Each bubble shows the sender name and date/time |
| Footer | *Read-only moderation view · messages sync in real time on the apps via Firestore* |

Admins cannot send messages from this page. Opening a conversation does not mark it as read for the buyer or the seller.

### Delete a conversation

The bin icon asks *"Delete this conversation and all its messages?"*. The server deletes every message of the conversation and the conversation itself in one batch (`DELETE /api/v1/admin/conversations/{id}`). Offers linked to the messages are kept in `offers`. The conversation disappears from both users' inboxes. There is no undo.

:::tip Deep links
The **Recent Chats** card on the [Dashboard](doc:admin/dashboard) opens this page as `/chat?ad=<ad id>&c=<conversation id>`, with the product and the conversation already selected.
:::

How users chat and make offers on the website and in the app is described in [Chat, Offers & Reviews](doc:app/chat-offers) and in [Chat, Offers & Social Endpoints](doc:api/social).

## Chat Templates

*Manage and create pre-defined chat templates.* A template is a named set of **buyer quick messages** (for example *Is this still available?*) and **seller quick replies** (for example *Yes, it is available.*), either global or limited to some categories.

![Chat templates](/docs/classiadshub/images/admin-chat-templates.jpg "Admin → Chat Management → Chat Templates")

### The list

| Column | Shows |
|---|---|
| **Name** | Template name |
| **Categories** | *Global* when no category is chosen, otherwise *N categories* |
| **Messages and Replies** | e.g. *4 Messages • 3 Replies* |
| **Active** | Toggle |
| **Action** | **Edit**, **Delete** |

Search by name; newest templates first.

### Create or edit a template

Click **Create Chat Template**. The dialog has:

| Field | Notes |
|---|---|
| **Name** | Required, up to 150 characters |
| **Buyer quick messages** | A list: one line per message, **Add** for another line |
| **Seller quick replies** | A list, same as above |
| **Categories (empty = global)** | Tick categories in the tree. Leave everything unticked for a template that applies to all categories |

Click **Save** (or **Update**). The API is `POST` / `PUT /api/v1/admin/crud/chat_templates`.

### Where templates are served

```http title="Quick messages for an ad in category 14"
GET /api/v1/chat-templates?category_id=14
```

The response contains every active template that is global or includes that category: `id`, `name`, `messages` and `replies`. Note that the match is on the exact category id, so pass the ad's own category, and tick subcategories (not only the parent) when you scope a template.

:::note Not shown by the bundled clients yet
The website and the Flutter app in this package do not call `/chat-templates` yet, so the quick messages do not appear in their chat screens. Add them as tappable chips above the message box in your own build.
:::

**Next:** [Seller Verification →](doc:admin/seller-verification)
