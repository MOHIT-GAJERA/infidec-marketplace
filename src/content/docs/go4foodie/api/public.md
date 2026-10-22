---
title: Public API
description: The unauthenticated /api endpoints used by the website and the mobile app. Menu, table lookup, availability, reservations, orders, gift cards, payments and uploads.
---

These endpoints need **no authentication**. The website calls them from its server through its `/api/*` proxies. The mobile app calls `menu`, `reservations/availability` and `payment` directly.

## Endpoints

| Method & path | Purpose | Success | Errors |
|---|---|---|---|
| `GET /api/menu` | Available items in active categories, sorted by category then name | `200` `{items, categories}` · no-store | `503` *Menu unavailable* |
| `GET /api/tables/:code` | Resolve a table QR code (Active tables only) | `200` `{table:{id, number, name, code}}` · no-store | `404` *Table not found or inactive*, `503` *Lookup failed* |
| `GET /api/reservations/availability?date=YYYY-MM-DD` | 24 slots 10:00–21:30 with remaining capacity | `200` `{date, slots:[{time, available, remaining}]}` | `400` *A valid date (YYYY-MM-DD) is required*, `503` *Availability unavailable* |
| `POST /api/reservations` | Table booking or private-event request | `201` `{reference, id}` | `400` *Invalid payload*, `422` slot reason, `409` slot full, `503` *Database unavailable* |
| `POST /api/orders` | Online order: `TAKE_AWAY` or `DINE_IN` (table QR) | `201` | `400` *Invalid order*, `402`, `422`, `503` *Could not place order* |
| `POST /api/gift-cards` | Buy a gift card or coupon | `201` `{code, id, amount, kind}` | `400` *Invalid purchase*, `402`, `503` |
| `GET /api/payment` | Which gateways are configured | `200` `{razorpay, stripe, paypal}` · no-store | — |
| `POST /api/payment` | Start a payment with a gateway | `200` (provider-specific) · no-store | `400` *Invalid amount*, `503` *<Provider> not configured*, `502` *Could not start payment* |
| `POST /api/payment/capture` | Capture an approved PayPal order | `200` `{status}` · no-store | `400` *Missing orderId*, `503` *PayPal not configured*, `502` *Could not capture payment* |
| `GET /api/uploads/:name` | Serve an uploaded image from Cloud Storage `uploads/` | `200` image, cached 1 year | `400` *Bad request* (invalid name), `404` *Not found* (text) |
| `POST /api/upload` | Upload an image (multipart field `file`) | `201` `{url}` | `401`, `400` *No file provided*, `415` *Only image files are allowed*, `413` *Image must be under 5MB*, `500` *Could not save image* |
| `GET /up` | Health check | `200` `ok` (text) | — |

`POST /api/upload` is not public. It requires an admin Firebase ID token, or a mobile staff token whose role has `manage:menu`. The returned URL is absolute and built from the request host: `https://<host>/api/uploads/<name>`.

## GET /api/menu

```json
{
  "items": [
    { "id": "c…", "name": "Truffle Risotto", "description": "…", "price": 26, "rating": 4.8,
      "tag": "Chef's pick", "category": "Main Meals", "imageUrl": "https://…" }
  ],
  "categories": ["Breakfast", "Desserts", "Main Meals"]
}
```

`tag` is `""` when empty. `categories` lists the distinct category names in item order.

## POST /api/reservations

| Field | TABLE | PRIVATE_EVENT |
|---|---|---|
| `kind` | `"TABLE"` | `"PRIVATE_EVENT"` |
| `date` | required (`YYYY-MM-DD`) | required |
| `time` | required (`HH:mm`) | — |
| `guests` | integer ≥ 1 | — |
| `eventType`, `guestRange`, `space` | — | required |
| `name` | min 2 | min 2 |
| `email` | valid email | valid email |
| `phone` | min 5 | min 5 |
| `occasion`, `requests` | optional | — |
| `company`, `message` | — | optional |

TABLE bookings must use a valid slot (`422` *Outside business hours*, *Invalid date or time* or *That time is too soon — please pick a later slot*). A slot holds 6 bookings that are not cancelled or no-show (`409` *That time slot is fully booked — please choose another.*). The customer is upserted by email, the reservation is created as **REQUESTED**, and the confirmation email is sent (mail failures never fail the request).

## POST /api/orders

```json title="TAKE_AWAY"
{ "type": "TAKE_AWAY", "scheduleType": "LATER", "scheduleDate": "2026-10-23", "scheduleTime": "19:30",
  "items": [{ "menuItemId": "c…", "name": "Truffle Risotto", "qty": 2 }],
  "name": "Asha Guest", "email": "guest@example.com", "phone": "00000 00000",
  "notes": "No onions", "payment": { "provider": "stripe", "paymentIntentId": "pi_…" } }
```

```json title="DINE_IN (table QR)"
{ "type": "DINE_IN", "tableCode": "c…", "items": [{ "menuItemId": "c…", "qty": 1 }],
  "name": "Asha", "email": "", "phone": "" }
```

| Field | TAKE_AWAY | DINE_IN |
|---|---|---|
| `items` | 1+ lines of `{menuItemId, name?, qty 1–50}` (*Add at least one item*) | same |
| `scheduleType` | `NOW` or `LATER` (`scheduleDate` + `scheduleTime` for LATER) | — |
| `tableCode` | — | required |
| `name` | min 2 | min 1 |
| `email` | valid email, required | optional or `""` |
| `phone` | min 5 | optional or `""` |
| `notes` | optional, max 500 | same |
| `payment` | see below | same |

Processing:

1. Payment gate → `402` (see below).
2. LATER slot validation → `422`.
3. Prices from the live menu (matched by id, then by name): `422` *Item not found: <name>* or *Item unavailable: <name>*. The total is computed on the server.
4. The customer is upserted by email, when one is given.
5. **DINE_IN**: the table must be Active (`422` *Table not found or inactive*). The order is attached to the table's open session, or a new session is opened and the table set to `OCCUPIED`.
6. Order created with status `PENDING`, channel `ONLINE` (type `PICKUP` for take-away), and the confirmation email is sent.

Responses: TAKE_AWAY `201 {number, id, total, estimatedPickup}` · DINE_IN `201 {number, id, total, tableNumber}`.

## POST /api/gift-cards

`{kind: "GIFT_CARD"|"COUPON" (default GIFT_CARD), amount (> 0, ≤ 100000, *Choose an amount*), name (min 2, *Name is required*), email?, message? (max 500), payment?}`.

The card is created with `status: ACTIVE` and `paymentStatus: PAID`. Coupons expire after 365 days. The code is retried on collision (`503` *Could not generate a code, please retry*).

## Payments

### POST /api/payment

Request `{provider: "razorpay"|"stripe"|"paypal", amount: number (major units), description?: string}`. An unknown provider is treated as `razorpay`.

| Provider | Response |
|---|---|
| razorpay | `{provider, keyId, orderId, amount (minor units), currency}` |
| stripe | `{provider, publishableKey, clientSecret}` |
| paypal | `{provider, clientId, orderId, currency}` |

### The `payment` field

```ts
| { provider: 'razorpay'; orderId: string; paymentId: string; signature: string }
| { provider: 'stripe';   paymentIntentId: string }
| { provider: 'paypal';   orderId: string }
```

Verification on orders and gift cards:

- No gateway configured → accepted **without payment**.
- Gateway configured and `payment` missing → `402` *Payment required*. On `/api/mobile/customer/orders`, `payAtRestaurant: true` skips this check.
- Razorpay HMAC signature, Stripe intent `succeeded` or PayPal order `COMPLETED` fails → `402` *Payment verification failed*.
- Another provider → `402` *Unknown payment provider*.

## Not exposed

The old VPS version had unauthenticated directory endpoints (`GET/POST /api/customers`, `/api/staff`, `/api/outlets`, `GET /api/reservations`) and a floor SSE stream. They are **not** part of the Firebase API. The admin uses its own authenticated routes and Firestore listeners instead.

**Next:** [Mobile API →](doc:api/mobile)
