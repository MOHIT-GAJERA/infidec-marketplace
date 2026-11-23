---
title: Bora Assistant
description: Bora, the built-in rental assistant at /assistant, a rule-based engine that answers questions about orders, revenue, pickups, returns, stock, customers and coupons from live workspace data and gives setup how-tos.
---

**Bora** is the assistant in the Rental Platform (**Ask Bora**, route `/assistant`). It answers questions in plain English using your own workspace data and links you straight to the right page.

![Bora assistant](/docs/booqora/images/platform-assistant.webp "Bora's welcome screen with suggested questions and the chat input")

:::note Rule-based, no AI service
Bora is a **rule-based intent engine** (`lib/features/assistant/bora_engine.dart`). It matches keywords in your question and runs a fixed calculation on your Firestore data. It does not call an external AI or language model, needs no API key and sends nothing outside your Firebase project. Questions it does not recognise get the help list.
:::

## Using Bora

- The welcome screen greets you by first name and shows **Try asking** suggestions. Click one to send it.
- Type in the box ("Ask about orders, revenue, stock or setup…") and press Enter.
- Each answer can carry **action buttons** that open a page, such as *Open order #12*, *Open calendar* or *Open tax settings*.
- **Clear conversation** deletes the chat history (see [Chat history](#chat-history)).

### Suggested questions

- How many orders this month?
- What's going out today?
- Which products earn the most?
- Who owes me money?
- Help me add my first product
- Set up taxes

## What Bora can answer

Bora reads the workspace's orders, products, customers and coupons and keeps them for 45 seconds before reading again.

| Topic | Example questions | Answer |
|---|---|---|
| Revenue | "What was revenue last month?", "Sales this year" | Total, collected, still due and average order for the period, excluding cancelled and draft orders. For "this month" it compares with last month in % |
| Order counts | "How many orders this week?", "How many reserved orders?" | Count for the period with a breakdown by status, and how many came from the online store. Naming a status lists up to five orders |
| Online requests | "How many online requests?" | Total online bookings and how many are still waiting for review (draft) |
| Going out | "What's going out today?", "Pickups tomorrow" | Reserved orders starting today or tomorrow |
| Coming back | "What's coming back tomorrow?" | Orders due back today or tomorrow |
| Late | "Any late orders?" | Overdue returns and pickups |
| Top products | "Which products earn the most?", "Most rented" | Ranking by revenue, or by units when you ask about units or "most rented" |
| Who owes money | "Who owes me money?", "Unpaid balance" | Customers with an outstanding balance |
| Stock | "What's low on stock?" | Rental products with fewer than 3 units, and those with none |
| Coupons | "Which coupons are active?" | Active coupon codes |
| Customers and products | "How many customers?", "How many products?" | Counts with links |

### Time periods

Bora understands **today**, **yesterday**, **this week**, **last week**, **this month** (the default), **last month**, **this year**, **last year** and **all time** / **ever** / **total**.

## Setup how-tos

Questions starting with "how", "help me", "set up", "where do I" or verbs such as "add", "create", "enable", "connect" or "invite" get a short guide with buttons:

| Topic | Opens |
|---|---|
| Taxes, GST, VAT | Settings → Taxes |
| Coupons | New coupon, Store preferences |
| Invoices, quotes, contracts | Documents, Document settings |
| Online store, website, embed | Online store, Booking page, Embed on website |
| Team, invite | Settings → Team |
| Payments, Stripe, Razorpay, UPI | Settings → Payment providers, Online store → Checkout |
| Pricing, rates | Settings → Pricing, Inventory |
| Rental period, opening hours | Settings → Rental period |
| Customers | New customer, Customers |
| Orders, bookings | New order, Orders |
| Products, inventory, equipment | Add product, Inventory |

Greetings and thanks get a short friendly reply, and "help" or "what can you do" lists everything above.

## Chat history

Messages are saved in the workspace collection `workspaces/<id>/assistantChats` with the role, text, action buttons and the sender's uid (`createdBy`). The last 30 messages are loaded when you open the page.

:::warning One history per workspace
The history is not filtered by user, so everyone in the workspace sees the same conversation, and **Clear conversation** deletes it for everyone.
:::

## Extending Bora

To add a new question, add a keyword check in `BoraEngine.reply()` and a method that returns a `BoraReply(text, [BoraAction(label, route)])`. Text supports `**bold**` and bullet lines. Add new suggestions to `BoraEngine.suggestions`.

**Next:** [Reports →](doc:admin/reports)
