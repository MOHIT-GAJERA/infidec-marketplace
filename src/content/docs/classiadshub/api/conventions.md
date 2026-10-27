---
title: Conventions & Errors
description: The response envelope, pagination, validation rules, money and date formats, uploads and the HTTP status codes every ClassiAds-Hub API endpoint uses.
---

Every endpoint follows the same conventions. They mirror the earlier Laravel API, so the website, the Admin Panel and the app parse every response the same way.

## Base URL and headers

| Caller | Base URL |
|---|---|
| Website, Admin Panel (on Hosting) | `/api/v1` on their own domain |
| Mobile app, scripts, local development | `https://us-central1-your-project-id.cloudfunctions.net/api/v1` |

| Header | When |
|---|---|
| `Authorization: Bearer <Firebase ID token>` | Signed-in requests. Get it from the Firebase SDK (`currentUser.getIdToken()`). Tokens last one hour; the SDK refreshes them |
| `Content-Type: application/json` | JSON bodies (up to 10 MB) |
| `Content-Type: multipart/form-data` | Uploads (ads with images, avatar, receipts, KYC, résumés, admin content with images) |
| `Accept: application/json` | Recommended |

## The envelope

Every response, success or failure, has the same five keys:

```json title="Success"
{
  "success": true,
  "data": { "id": 42, "title": "Toyota Corolla 2019" },
  "message": "Ad.",
  "meta": null,
  "errors": null
}
```

```json title="Validation failure (HTTP 422)"
{
  "success": false,
  "data": null,
  "message": "The title field is required.",
  "meta": null,
  "errors": { "title": ["The title field is required."], "price": ["The price field must be a number."] }
}
```

`message` on a failure is the first error, ready to show to the user. `errors` maps each field to its messages. Custom fields of an ad use the key `custom_fields.<code>`.

## Pagination

List endpoints accept `page` (from 1) and `per_page`, and return the page in `meta.pagination`:

```json title="meta"
{
  "pagination": { "current_page": 2, "per_page": 20, "total": 134, "last_page": 7, "from": 21, "to": 40 }
}
```

The default `per_page` is 20 and the maximum 50 for public and user lists. Some lists use other limits: blog 12, conversation messages 30 (max 100), admin lists up to 100–500. `GET /notifications` adds `meta.unread_count`. Admin CRUD lists accept `all=1` to return every row without pagination.

## Validation rules

Inputs are checked with Laravel-style rules (`functions/src/lib/validate.ts`). Only the declared keys are kept; unknown keys are dropped.

| Rule | Meaning |
|---|---|
| `required` | Must be present and not empty (`null`, `""` and `[]` count as empty) |
| `nullable` | May be empty. An empty value present in the body is stored as `null` |
| `sometimes` | Checked only when present (all update endpoints use this) |
| `string`, `integer`, `numeric`, `boolean`, `array` | Type. Numbers sent as strings are converted. Booleans accept `true/false`, `1/0`, `"on"/"off"`, `"yes"/"no"` |
| `email`, `url`, `date` | Format. `url` needs `http://` or `https://` |
| `in:a,b,c` | One of the listed values |
| `min:n`, `max:n`, `size:n` | For numbers the value, for strings the length, for arrays (`max`) the count |
| `confirmed` | Needs `<field>_confirmation` with the same value (passwords) |
| `required_if:field,value` | Required when another field has that value |
| `raw` | Not trimmed (passwords, HTML bodies). Every other string is trimmed |

In multipart requests, arrays and objects may be sent as JSON strings (`custom_fields={"brand":"Toyota"}`), as `name[]` repeated fields, or as `name[key]` fields.

## Money

- Amounts are stored and returned in **minor units** (cents, paise): `125000` = 1,250.00. Requests take **major units** (`"price": 1250`) and the API converts them.
- Every money object also has a `*_display` string built as `<currency code> <amount>`, for example `price_display: "USD 1,250.00"`, `total_display`, `salary_display`.
- Ad prices also depend on `price_type`: `free` shows `Free`; `contact` (or no price) shows `Contact for price`.
- `currency_code` is a 3-letter code. New ads default to `settings/general.default_currency` (fallback `USD`).

## Dates, ids and booleans

| Type | Format |
|---|---|
| Dates and times | ISO 8601 strings in UTC (`"2026-10-27T09:30:00.000Z"`), or `null` |
| Ids | Numbers (`42`). Exceptions: notification ids are UUID strings |
| Slugs | Ads `toyota-corolla-2019-k3x9qa` (title + 6 random characters), categories and blog posts from their name or title |
| Booleans | `true` / `false` |
| Images | Full URLs (`https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<path>?alt=media`) |

## Uploads

- Image fields accept **JPEG, PNG, WebP, GIF and SVG** up to **5 MB** each (`The images field must not be greater than 5120 kilobytes.`).
- A request may carry up to 20 files of up to 20 MB each (résumés are not limited to images).
- Ads take at most *Max images per ad* images (default 10): `Maximum 10 images per ad.`

## Status codes

| Code | Meaning |
|---|---|
| `200` | OK |
| `201` | Created (register, new ad, message, offer, review, report, checkout started…) |
| `400` | `Malformed JSON body.` |
| `401` | `Unauthenticated.`: no token, bad or expired token, or a removed account |
| `403` | `Your account is suspended.` / `banned`, `This action is unauthorized.`, `You do not have permission to perform this action.`, `Not a participant.` |
| `404` | `Ad not found.`, `Resource not found.`, `Not found.` |
| `405` | `This resource is read-only.` (admin CRUD on User Queries) |
| `410` | `POST /auth/social/{provider}`: use the Firebase SDK instead |
| `422` | Validation errors and business rules (`This offer is no longer pending.`, `Payment gateway [x] is not available.`, gateway errors such as `Stripe: …`) |
| `500` | `Server error.` (logged as `Unhandled API error`) |
| `503` | `GET /health/ready` when Firestore is unreachable |

**Next:** [Auth Endpoints →](doc:api/auth)
