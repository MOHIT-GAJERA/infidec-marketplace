---
title: Customer App
description: What guests can do in the Customer App, from registration and sign-in to take-away and table-QR ordering, table bookings, private events, gift cards and order tracking.
---

The **Customer App** is the guest side of the mobile app. The guest taps **Customer App** (*"Order, book a table and track your visit"*) on the first screen. It uses the same menu, orders, reservations and gift cards as the website and the Admin Panel.

![Customer home](/docs/go4foodie/images/app-customer-home.webp "Home")
![Menu](/docs/go4foodie/images/app-customer-menu.webp "Menu")
![Cart](/docs/go4foodie/images/app-customer-cart.webp "Your order")
![Payment](/docs/go4foodie/images/app-customer-payment.webp "Payment options")
![Booking](/docs/go4foodie/images/app-customer-booking.webp "Reserve a table")
![My bookings](/docs/go4foodie/images/app-customer-bookings.webp "My Bookings")
![My orders](/docs/go4foodie/images/app-customer-orders.webp "My Orders")

## Account

### Create an account

On the Customer login screen tap **Create account** (*"New to Go4Foodie?"*). The **Create your account** form asks for:

| Field | Rule (server message) |
|---|---|
| Full name | At least 2 characters: *"Name is required"* |
| Email | Valid email (stored in lower case): *"Enter a valid email"* |
| Phone | At least 5 characters: *"Enter a valid phone number"* |
| Password | At least 6 characters: *"Password must be at least 6 characters"* |

Registration calls `POST /api/mobile/auth/register` and signs the guest in straight away.

- If a customer with that email **already has a password**, the app shows *"An account with this email already exists. Please sign in."*
- If the email belongs to a **website guest** (someone who ordered or booked on the website without an account), registration claims that customer record. Their earlier orders, bookings and gift cards then appear in the app.

### Sign in

**Email + password**, with app `customer`. The rules:

| Situation | Message |
|---|---|
| Unknown email, wrong password, or a customer without a password (website guest) | *Invalid email or password* |
| Customer status is **INACTIVE** in Admin → Customers | *This account is inactive. Please contact the restaurant.* |

Customers sign in only with a customer account. Admin and staff logins do not work in the Customer App. Customer records are managed in [Customers](doc:admin/customers). The app session lasts **30 days**. After that the customer signs in again.

:::note A phone number is required to order and book
Take-away orders and reservations need a phone number of at least 5 characters on the customer record. Customers who register in the app always have one. A customer created by staff without a phone gets a validation error at checkout. Add the phone in **Profile → Edit profile**.
:::

## Tabs

| Tab | Content |
|---|---|
| **Home** | Greeting and hero, quick actions (**Take away**, **Order at table**, **Book a table**, **Gift cards**), **Live orders** (pending, preparing, ready), **Upcoming bookings**, **Chef's picks** from the menu, and the **Visit us** card (restaurant name, address and phone from Admin → Settings) |
| **Menu** | **Our Menu**: live menu with category chips and *"Search dishes, drinks…"*. Tap an item for details, **Add** to the cart. A cart bar opens the checkout |
| **Orders** | **My Orders**: every order placed in the app, plus website orders made with the same email |
| **Bookings** | **My Bookings**: table bookings and private-event requests, with **Cancel** while they are Requested or Confirmed |
| **Profile** | Edit profile (name, phone, address), Change password, **Gift cards & coupons**, Dark mode, Server address, Sign out |

The menu shows only **available** items in **active** categories (see [Menu](doc:admin/menu)). Prices always come from the server. The cart never decides the price.

## Take-away order

:::steps
### Add dishes
Menu → **Add**, then open the cart bar → **Your order**.

### Pickup time
- **As soon as possible**: *"Ready in about 25 minutes"* with the estimated time.
- **Schedule**: pick a day and a 30-minute slot between **10:00 and 21:30**. A slot must be at least **30 minutes** from now. If nothing is left today the app says *"No pickup slots left today — choose another day."*

### Notes and payment
Add optional notes (*"Allergies, special requests…"*, max 500 characters). Then pick **Pay at restaurant**, **Razorpay** or **Card (Stripe)**. See [In-App Payments](doc:app/payments).

### Place order
**Place order** → **Order placed** with the order number (`ORD-#####`). **Track order** opens the order detail. **Back to menu** returns to the menu.
:::

The server checks the slot again. If the time is no longer valid the app shows *"That time is too soon — please pick a later slot"* or *"Outside business hours"*. An item that was switched off in the meantime gives *"Item unavailable: <name>"*. A confirmation email is sent to the customer when SMTP is configured ([Emails](doc:admin/emails)).

## Order at the table (QR)

:::steps
### Scan
Home → **Order at table** → **Scan table QR** (*"Point your camera at the QR code on your table"*). The app reads the code from a table QR URL (`…/order?table=<code>`, the same QR the website uses) or from a plain code. **Enter code manually** opens *"Enter table code"*.

### Order
The app checks the code (`GET /api/mobile/customer/tables/:code`). It then shows *"Welcome to table N — add dishes to send to the kitchen"*, and the menu shows **Dine-in · Table N** with a **Leave** button.

### Send to kitchen
The checkout says *"Your order goes straight to the kitchen and is added to your table bill."* Pay now online or **Pay at restaurant**, then **Send to kitchen** → **Sent to the kitchen**.
:::

The order opens a table session if none is open, so the table turns **Occupied** on the staff floor. Inactive or unknown tables show *"Table not found or not accepting orders"*. The cart keeps the table after an order, so guests can order another round.

:::warning iOS needs the camera permission text
Add `NSCameraUsageDescription` to `ios/Runner/Info.plist` before you build for iOS. Without it the scanner crashes on iPhone ([details](doc:app/deployment#ios-camera-permission)). If the camera is unavailable, the scanner shows *"Camera unavailable (…). Enter the table code instead."*
:::

## Order tracking

**Order details** refreshes every **10 seconds** until the order is **Completed** or **Cancelled**:

- Status timeline: Pending → Preparing → Ready → Completed (or *"This order was cancelled by the restaurant."*)
- Pickup line: *"Pickup <date> at <time>"* or *"Estimated pickup around <time>"*
- Items, total and payment (*Paid online (Razorpay/Stripe)* or *Pay at restaurant*)
- Dine-in orders show a **Table bill** card with the bill total, paid and remaining amounts, plus *"Your server will settle the bill at your table."* or, once closed, *"Your table has been settled. Thank you!"*

## Book a table or a private event

Bookings → **Book** (or Home → **Book a table**) opens **Reserve**:

| Type | Fields |
|---|---|
| **Table booking** | Date, time (live availability), guests, occasion (Casual Dining, Birthday, Anniversary, Business, Date Night, Celebration), special requests |
| **Private event** | Event type (Birthday, Corporate Dinner, Wedding / Engagement, Cocktail Party, Holiday Party, Other), date, guest range (10–20, 20–40, 40–70, 70–120, 120+), space (Main Dining, Private Room, Bar Area, Full Buyout), company, message |

Time slots come from `GET /api/reservations/availability`: 24 slots from **10:00 to 21:30**, with up to **6 table bookings per slot**. Full or too-soon slots are disabled. If availability cannot be loaded, the app shows the standard times instead. The server then still rejects a full slot with *"That time slot is fully booked — please choose another."*

The booking is made in the customer's name (*"Booking as <name> · <email>"*). The confirmation dialog shows the **reference** (`SV-######` for a table, `EV-######` for an event) and *"We’ll confirm by email shortly."* New bookings start as **Requested**. Staff confirm them in [Reservations](doc:admin/reservations) or in the Restaurant App.

## Gift cards & coupons

**Profile → Gift cards & coupons** (or Home → **Gift cards**) lists the customer's cards with code (tap to copy), amount, status and expiry. **Buy** opens **Buy a gift card**:

1. **Gift card** or **Coupon**
2. Amount: 10, 50, 100, 200, 250, 500, 750 or 1000
3. Personal message (optional, max 500 characters)
4. **Pay** with Razorpay or Stripe (gift cards cannot be paid at the restaurant)

The new code (`GIFT-XXXXXX` or `COUPON-XXXXXX`) is shown in a toast and emailed to the customer. Coupons expire after **365 days**. Gift cards do not expire. See [Gift Cards & Coupons](doc:admin/gift-cards).

**Next:** [Restaurant App →](doc:app/restaurant)
