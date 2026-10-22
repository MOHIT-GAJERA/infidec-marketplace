---
title: Emails
description: Every e-mail Go4Foodie sends (order, reservation and gift card messages), with what triggers it, who receives it, its subject, and how to rebrand the templates.
---

Go4Foodie sends **branded HTML e-mails** (with a plain-text version) to guests over your [SMTP server](doc:admin/smtp-settings). They are sent automatically. There's no compose screen and no admin copy. An e-mail goes out only when the guest gave an e-mail address, and a failed send never blocks the order, booking or status change.

## The e-mails

| # | E-mail | When it's sent | Trigger | Subject |
|---|---|---|---|---|
| 1 | **Order confirmed** (take-away) | A take-away order is placed on the website or in the Customer App | `POST /api/orders`, `POST /api/mobile/customer/orders` | `Order ORD-12345 confirmed · Go4Foodie` |
| 2 | **Order confirmed** (dine-in) | A table QR order is placed and the guest entered an e-mail (optional for table orders) | Same as above, type `DINE_IN` | `Order ORD-12345 confirmed · Go4Foodie` |
| 3 | **Order completed** | An order with a guest e-mail is set to **Completed** | [Orders](doc:admin/orders) stepper, or the Restaurant / Owner App | `Thanks for dining with us, {first name}! · Go4Foodie` |
| 4 | **Table reserved** | A table booking is made | `POST /api/reservations` (website), Customer App booking | `Table reserved SV-123456 · Go4Foodie` |
| 5 | **Event request received** | A private-event request is sent | Same endpoints, kind `PRIVATE_EVENT` | `Event request EV-123456 · Go4Foodie` |
| 6 | **Reservation completed** | A table booking or event is set to **Completed** | [Reservations](doc:admin/reservations) stepper, or the mobile app | `Thank you for visiting, {first name}! · Go4Foodie` |
| 7 | **Gift card purchased** | A gift card is bought (and paid, when a gateway is configured) | `POST /api/gift-cards`, Customer App | `Your Gift Card GIFT-AB12CD · Go4Foodie` |
| 8 | **Coupon purchased** | A coupon is bought | Same, kind `COUPON` | `Your Coupon COUPON-AB12CD · Go4Foodie` |
| 9 | **Gift card / coupon redeemed** | A gift card or coupon with a customer e-mail is set to **Redeemed** | [Gift Cards](doc:admin/gift-cards), or the mobile app | `Your gift card was redeemed — thank you! · Go4Foodie` (or `Your coupon was redeemed…`) |

Every e-mail goes to the **guest**: the order's customer e-mail, the reservation e-mail, or the gift card buyer's e-mail.

## What each e-mail contains

| E-mail | Content |
|---|---|
| Order confirmed | Order number, pickup time (*As soon as possible (around 7:45 PM)* or the scheduled slot; *Dine-in · Table 5* for table orders), item lines with quantity and price, total, notes |
| Order completed | Thank-you message, items and total, an **Order again** button |
| Table reserved | Confirmation reference, date, time (12-hour), guests, occasion, special requests |
| Event request received | Inquiry reference, event type, preferred date, estimated guests, space, details. It says the events team will reply within 24 hours |
| Reservation completed | Thank-you message with the reference and a **Book again** button |
| Gift card / coupon purchased | The code on a gold card, value, expiry (*Valid until …* for coupons, which expire after one year, or *No expiry* for gift cards), and the buyer's message |
| Redeemed | Code and value, with a **Visit again** button |

## Branding the e-mails

The templates live in `firebase/functions/src/services/emailTemplates.ts`, and the sender in `services/mailer.ts`. Before going live, change these:

| What | Where |
|---|---|
| Sender name **Go4Foodie** | `mailer.ts` → `from: { name: 'Go4Foodie', … }` |
| Brand name in the header, subjects and text | `emailTemplates.ts`: search for `Go4Foodie` |
| Tagline under the header and the **footer address, phone and e-mail** (sample values) | `shell()` in `emailTemplates.ts`, plus the last line of the plain-text versions |
| Button links (*Order again*, *Book again*, *Visit again*) | The `href="https://…/order"` and `…/table-reservation` links. Point them at your website |
| Currency sign `$` | `money()` at the top of `emailTemplates.ts` |
| Colours (dark background, orange accent) | The `C` colour object at the top |

Then redeploy: `cd firebase && FUNCTIONS_DISCOVERY_TIMEOUT=90 firebase deploy --only functions`.

:::warning Values are inserted as-is
Guest-entered text (name, notes, requests, gift message) goes into the HTML without escaping, exactly as in the original design. Keep that in mind if you add new fields to the templates.
:::

## Not sent by Go4Foodie

- No e-mail to the restaurant for new orders or bookings. The panel shows those in [Notifications](doc:admin/notifications) (bell badge).
- No password-reset e-mails. Admin passwords are changed in Settings or with the [admin user script](doc:installation/admin-users).
- No status e-mails other than *completed* and *redeemed*.

## Troubleshooting

| Symptom | Check |
|---|---|
| No e-mails at all | Logs say `SMTP not configured — skipping email…`, so `MAIL_HOST`, `MAIL_USERNAME` or `MAIL_PASSWORD` is empty. Redeploy after setting them |
| Some e-mails missing | The order, booking or gift card has no e-mail (table orders often don't) |
| `Invalid login` / `535` in the logs | Wrong password. For Gmail, use an app password |
| Timeout / `ECONNREFUSED` | Wrong port or scheme. Try `587` + empty scheme, or `465` + `smtps` |
| Lands in spam | Send from your own domain and set up SPF/DKIM with your provider |

**Next:** [Mobile App →](doc:app/prerequisites)
