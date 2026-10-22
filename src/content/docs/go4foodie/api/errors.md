---
title: Errors
description: HTTP status codes and JSON error bodies returned by the Go4Foodie API, with the exact messages clients show.
---

Every error is JSON with a human-readable **`error`** string. The website, the mobile app and the Admin Panel show that string to the user as it is, so you can read the cause straight from the screen. Validation errors add **`issues`**.

## Error body

```json
{ "error": "Enter a valid email" }
```

```json title="400 — validation"
{
  "error": "Enter a valid email",
  "issues": [
    { "validation": "email", "code": "invalid_string", "message": "Enter a valid email", "path": ["email"] }
  ]
}
```

- `issues` uses the zod issue format (`code`, `path`, `message`, plus fields such as `expected`, `received` or `minimum`). Clients only read `error`, the first issue's message.
- Some endpoints use a fixed `error` instead of the first issue: *Invalid order* (`POST /api/orders`), *Invalid payload* (reservations), *Invalid purchase* (gift cards).
- Admin routes also return `errors`: `{ "field": ["message", …] }` for form fields.

## Status codes

| Status | Meaning | Typical messages |
|---|---|---|
| **400** Bad Request | Validation failed or the input is unusable | `{error, issues}` · *Invalid order* · *Invalid payload* · *Invalid purchase* · *Add at least one item* · *A valid date (YYYY-MM-DD) is required* · *Invalid amount* · *Missing orderId* · *Enter an amount* · *Current password is incorrect* · *No file provided* |
| **401** Unauthorized | No token, invalid or expired token, wrong token kind, or failed login | *Unauthorized* · *Invalid email or password* (mobile) · *Invalid email or password.* (admin) · *Account not found* |
| **402** Payment Required | A gateway is configured but payment is missing or not verified | *Payment required* · *Payment verification failed* · *Unknown payment provider* |
| **403** Forbidden | The role lacks the permission, or the account is blocked | *You do not have permission for this action* · *Owner access only. Use the Restaurant app.* · *This account is inactive. Please contact the restaurant.* · *Your staff account is inactive.* |
| **404** Not Found | Unknown route or record | *Not found* · *Order not found* · *Reservation not found* · *Table not found* · *Table not found or inactive* (public) · *Table not found or not accepting orders* (mobile) |
| **409** Conflict | Duplicate or blocked by a relation | *That time slot is fully booked — please choose another.* · *An account with this email already exists. Please sign in.* · *This item has been ordered before and cannot be deleted. Mark it unavailable instead.* · *Table number N already exists* · *A customer with this email already exists* |
| **413** / **415** | Upload too large / not an image | *Image must be under 5MB* · *Only image files are allowed* |
| **422** Unprocessable | Valid input that breaks a business rule | *Outside business hours* · *Invalid date or time* · *That time is too soon — please pick a later slot* · *Item not found: <name>* · *Item unavailable: <name>* · *Table not found or inactive* (dine-in order) · *This booking can no longer be cancelled* · *Duty status applies to staff accounts* |
| **500** Server Error | Unexpected failure. The message is passed through | *Session is closed* · *Item not found* (POS) · *Could not save image* · *Server error* |
| **502** Bad Gateway | A payment provider failed, or the website could not reach the API | *Could not start payment* · *Could not capture payment* · *Ordering is temporarily unavailable. Please try again shortly.* (website proxy) · *Payment is temporarily unavailable.* |
| **503** Service Unavailable | Firestore unavailable, a feature not configured, or a write failed | *The restaurant database is unavailable. Please try again shortly.* · *Menu unavailable* · *Availability unavailable* · *Lookup failed* · *Database unavailable* · *Could not place order* · *Could not complete purchase* · *Could not generate a code, please retry* · *Razorpay not configured* / *Stripe not configured* / *PayPal not configured* |

:::note Mobile: missing ids return 503
On `/api/mobile/*`, updating or deleting an id that does not exist returns **503** *The restaurant database is unavailable. Please try again shortly.* instead of 404. This keeps the previous version's behaviour, and the app only shows the message. Admin routes return `404` *Not found*.
:::

## What clients do with errors

| Client | Behaviour |
|---|---|
| Website | Shows `error` in a red banner. If the proxy cannot reach the API, it shows its own 502 message |
| Mobile app | Shows `error` as a toast or inline. Any **401** while signed in signs the user out. Without a JSON body it shows *Request failed (<status>)* |
| Admin Panel | Shows `error` as a toast. Field `errors` appear under the form inputs |

## Debugging

- **Functions logs**: `firebase functions:log` or Firebase console → Functions → `api` → Logs. Unexpected errors are logged with a stack trace, and Firestore failures are logged before the 503 is returned.
- **Mail errors** never fail a request. Check the log for SMTP problems ([Emails](doc:admin/emails)).
- Test an endpoint directly: `curl -i https://yourrestaurant-1a2b3.web.app/api/menu`.

**Next:** [Changelog →](doc:changelog)
