---
title: Ordering Flows
description: Every guest flow on the website. Take-away (Schedule Now / Later), table QR ordering, Dine-In table booking, private events and gift cards, with the rules the backend enforces.
---

All flows are guest checkouts. There is no login: guests enter their name, email and phone. The backend saves a **customer record by email** (it creates one, or updates the name and phone of an existing one). The same customer later sees these orders and bookings in the Customer App if they register with that email.

## Take Away

`/order` → *"How would you like to order?"* → **Take Away**. Steps: **Menu → Pickup → Details**.

![Order mode](/docs/go4foodie/images/web-order-mode.jpg "Take Away or Dine-In")
![Order menu](/docs/go4foodie/images/web-order-menu.jpg "Menu step")
![Schedule](/docs/go4foodie/images/web-order-schedule.jpg "Schedule Now / Later")
![Details](/docs/go4foodie/images/web-order-details.jpg "Your details")

:::steps
### Menu
Add dishes to the cart (quantity 1–50 per line). The live menu shows available items in active categories.

### Pickup: *"When would you like it?"*
- **Schedule Now**: ready as soon as possible, about **25 minutes** (prep time).
- **Schedule Later**: choose a **pickup date** (today plus the next 13 days) and a 30-minute slot between **10:00 and 21:30**. Slots closer than **30 minutes** are hidden. When none are left today: *"No more pickup slots today — please pick another date."*

### Details
**Your details**: full name (min 2), email (required), phone (min 5), **Order notes** (optional, max 500). The **Order summary** shows *Take Away · ASAP* or *Scheduled*, the pickup time and the subtotal.

### Pay and place
**Place Order** → payment (if a gateway is configured) → **Order placed** with the **order number** and the pickup time. Without a pickup estimate the page says *"We will text you when it is ready."*
:::

The backend prices the cart from the live menu. Client prices are never trusted. It stores a **PICKUP** order (`channel: ONLINE`, status **Pending**) and emails *Order ORD-… confirmed* to the guest. Errors appear in a red banner, for example *"Item unavailable: <name>"*, *"That time is too soon — please pick a later slot"* or *"Payment required"*.

## Table QR ordering

Each table has a QR code (Admin → [Tables](doc:admin/tables)) that opens:

```text
https://www.yourrestaurant.com/order?table=<code>
```

![Table order](/docs/go4foodie/images/web-table-order.jpg "Table banner and menu")
![Table order details](/docs/go4foodie/images/web-table-order-details.jpg "Almost there")

:::steps
### Scan
The server page resolves the code with `GET /api/tables/<code>`, which only accepts **Active** tables. The page shows the table banner: *"Your order goes straight to the kitchen for this table."*

### Menu
Pick dishes.

### Almost there
**Your name** (required), **Phone**, **Email** and **Notes** (all optional).

### Send to Kitchen
Pay (if a gateway is configured) → **Order sent!** with the order number.
:::

The backend stores a **DINE_IN** order on that table. If the table has no open session, it **opens one automatically** in the guest's name and sets the table to **Occupied**. The order then appears on the Admin Live Floor, in the POS and in the Restaurant App. If the guest gave an email, they receive a confirmation (*Dine-in · Table N*).

:::note Unknown or inactive code
If the code is unknown or the table is **Inactive**, the page does not show an error. It quietly shows the normal `/order` flow instead. Switch tables on or off in Admin → Tables.
:::

## Dine-In (book a table from /order)

`/order` → **Dine-In** books a table instead of ordering food. Steps: **Reservation → Details**.

- *"Reserve your table"*: **Party size**, date, and a time from the **live availability** for that date (*"Pick a date and time — we hold tables in 30-minute slots."*).
- Times come from `GET /api/availability?date=YYYY-MM-DD`: 24 slots, **10:00–21:30**, each holding up to **6** table bookings. Full slots are disabled (*"Fully booked"*), and so are slots less than 30 minutes ahead. When every slot of a day is gone: *"No tables left on this date — please try another day."*
- If availability cannot be loaded, the site shows the standard times with cut-off only: *"Showing standard times — live availability is offline."*
- **Confirm Reservation** → **Table reserved** with the confirmation reference `SV-######`.

![Reservation kind](/docs/go4foodie/images/web-reservation-kind.jpg "How can we host you?")
![Reservation slots](/docs/go4foodie/images/web-reservation-slots.jpg "Date, time and party size")

## Table booking & private events

`/table-reservation` → *"How can we host you?"*

| Flow | Steps | Fields |
|---|---|---|
| **Table Booking** | Date & Guests → Your Details → Confirm | Date, time (evening times **17:00–21:30**), party size 1–8, full name, email, phone, **Occasion** (Casual Dining, Birthday, Anniversary, Business, Date Night, Celebration), **Special requests** |
| **Private Event** | Event → Your Details → Confirm | Event type (Birthday, Corporate Dinner, Wedding / Engagement, Cocktail Party, Holiday Party, Other), preferred date, preferred space (Main Dining, Private Room, Bar Area, Full Buyout), estimated guests (10–20 … 120+), full name, company, email, phone, *What are you planning?* |

This page offers a fixed list of evening times. It does not ask for live availability. The backend still enforces the same rules: a slot with 6 bookings returns *"That time slot is fully booked — please choose another."*, and a slot less than 30 minutes ahead is rejected.

Both kinds are saved with status **Requested**. References are `SV-######` for tables and `EV-######` for events. The guest receives *Table reserved SV-… · Go4Foodie* or *Event request EV-… · Go4Foodie* by email. Staff handle them in [Reservations](doc:admin/reservations).

## Gift cards & coupons

The home page gift-card section (also opened from the header and the hero) runs **Amount → Details → Delivery → Review**:

![Gift card](/docs/go4foodie/images/web-gift-card.jpg "Gift card dialog")

- **Gift Card** or **Coupon**. Amounts 10, 50, 100, 200, 250, 500, 750, 1000.
- Your name (required), email, recipient, personal message (max 500), delivery **By email** or **Print**, timing (*Send instantly* / *Send on a future date*), quantity.
- Pay → success screen with the **code** (`GIFT-XXXXXX` / `COUPON-XXXXXX`).

The backend stores **one** card with the chosen amount, `paymentStatus: PAID` and `status: ACTIVE`, and emails the code to the buyer when an email is given. Coupons expire after 365 days.

:::warning What the backend receives
Only kind, amount, buyer name, email and message are sent. Quantity, recipient, delivery method and send date are shown in the dialog but **not stored**, and the charge is the single amount (not amount × quantity). Remove those fields, or extend `components/GiftCard.tsx` and the backend, if you need them.
:::

## Business rules

| Rule | Value | Defined in |
|---|---|---|
| Opening hours for slots | 10:00 – 22:00 → slots 10:00 … 21:30, every 30 min | `lib/order.ts` `BUSINESS_HOURS` and backend `services/scheduling.ts` |
| Order / booking cut-off | 30 minutes ahead (`LEAD_MINUTES`) | both |
| ASAP pickup estimate | now + 25 minutes (`PREP_MINUTES`) | both |
| Days ahead for take-away | 14 (`SCHEDULE_DAYS`) | website only |
| Table bookings per slot | 6 | backend only |
| Timezone for "today" and slots | `LOCAL_TZ` | backend |

If you change opening hours, change them in **both** `website/lib/order.ts` and `firebase/functions/src/services/scheduling.ts`, then redeploy both.

**Next:** [Payments →](doc:web/payments)
