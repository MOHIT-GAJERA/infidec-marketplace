---
title: API Overview
description: The Go4Foodie REST API. One Cloud Function behind a Firebase Hosting rewrite, with three surfaces (public, mobile, admin), their authentication, CORS and JSON conventions.
---

The whole backend is **one HTTPS Cloud Function** named `api` (Node.js 22, TypeScript, Express, region `asia-south1`). It serves every endpoint the website, the mobile app and the Admin Panel use, and keeps all data in Cloud Firestore.

## Base URL

Firebase Hosting rewrites `/api/**` (and `/up`) to the function on **both** Hosting sites:

| Host | Example | Notes |
|---|---|---|
| API site | `https://yourrestaurant-1a2b3.web.app` | Use it as `ADMIN_API_URL` (website) and `API_BASE_URL` (mobile app). `/` redirects to the admin site |
| Admin site | `https://yourrestaurant-admin.web.app` | The Flutter admin calls `/api/admin/*` on its own origin |
| Local | `http://localhost:8787` | `npm run dev` in `firebase/functions` |

Every path starts with `/api`. Health check: `GET /up` → `ok`.

```bash
curl https://yourrestaurant-1a2b3.web.app/up
curl https://yourrestaurant-1a2b3.web.app/api/menu
```

## Three surfaces

| Prefix | Used by | Auth | Reference |
|---|---|---|---|
| `/api/*` | Website (server-side, through its proxies), the mobile app's menu, availability and payment calls | **None** (public) | [Public API](doc:api/public) |
| `/api/mobile/*` | Flutter mobile app (Customer, Restaurant, Owner) | `Authorization: Bearer <JWT>`. HS256, signed with the `AUTH_SECRET` secret, 30-day lifetime, `aud: "mobile"` | [Mobile API](doc:api/mobile) |
| `/api/admin/*` | Flutter Web Admin Panel | `Authorization: Bearer <Firebase ID token>`, from a custom token minted by `POST /api/admin/auth/login` | [Admin API](doc:api/admin) |

### Mobile tokens

`POST /api/mobile/auth/login` and `/auth/register` return `{token, user}`. The JWT payload carries `sub`/`id`, `name`, `email`, `role` (`OWNER`, `MANAGER`, `STAFF` or `null` for customers), `outletId`, `kind` (`customer`, `user` or `employee`), `aud`, `iat` and `exp`. There is no refresh and no server-side revocation. Signing out only deletes the token on the phone. Every route group admits certain token **kinds**: `customer/*` admits customers, `staff/*` admits users and employees. A wrong kind or a missing, invalid or expired token returns **401** `{"error":"Unauthorized"}`.

:::warning Keep AUTH_SECRET stable
Changing `AUTH_SECRET` invalidates every mobile session at once. If you move from the previous VPS version, set the **same** value so that existing app logins keep working.
:::

### Admin tokens

`POST /api/admin/auth/login {email, password}` checks the admin user and returns a **Firebase custom token** (uid `user:<id>`, claims `kind: "user"`, `refId`, `role`, `outletId`, `name`, `mail`) plus the profile. The admin signs in to Firebase Auth with it and sends the resulting **ID token** (valid 1 hour, refreshed automatically). Minting custom tokens needs the IAM Credentials API and the *Service Account Token Creator* role ([Deploy the Backend](doc:installation/backend-deploy)).

### Permissions

Staff and admin routes check one of 13 permissions for the token's role:

| Role | Permissions |
|---|---|
| OWNER | all: `view:dashboard`, `manage:menu`, `manage:orders`, `manage:reservations`, `manage:tables`, `operate:floor`, `manage:coupons`, `manage:outlets`, `manage:staff`, `manage:customers`, `manage:inventory`, `view:reports`, `manage:settings` |
| MANAGER | all except `manage:settings` |
| STAFF | `view:dashboard`, `manage:orders`, `manage:reservations`, `operate:floor` |
| customer (`null`) | none |

A missing permission returns **403** `{"error":"You do not have permission for this action"}`. See [Roles & Permissions](doc:admin/roles-permissions).

## CORS

Every response carries:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
```

`OPTIONS` preflights are answered with `204`. The website never needs CORS because it calls the API from its server.

## JSON conventions

- Requests and responses are `application/json` (body limit 1 MB). A missing or unparseable body is treated as empty, and validation then fails with `400`.
- Unknown keys in request bodies are ignored.
- **Errors** are always JSON with a human-readable `error` string, and `issues` for validation errors. See [Errors](doc:api/errors).
- Dates are ISO-8601 UTC strings with milliseconds (`2026-10-22T18:30:00.000Z`). A few staff fields are date-only (`YYYY-MM-DD`).
- Whole numbers are sent as integers (`12`, not `12.0`). Money is a plain number in major units.
- IDs are cuid strings (`c` + 24 characters). Order numbers are `ORD-#####`, reservation references `SV-######` (table) or `EV-######` (event), gift codes `GIFT-XXXXXX` / `COUPON-XXXXXX`.
- Mobile view objects usually **omit** keys whose value is null.
- Create endpoints return `201`. Actions without a result return `{"ok": true}`.
- Slot and "today" calculations use the restaurant timezone `LOCAL_TZ` (default `Asia/Kolkata`).

## Caching

API responses are not cached by Hosting. `Cache-Control: no-store` is set on the public menu, table, and payment responses, and on every successful authenticated mobile response (`/api/mobile/auth/me`, `/auth/password` and all `customer/*` and `staff/*` results). Uploaded images (`GET /api/uploads/:name`) are served with `public, max-age=31536000, immutable`.

## Firestore access

The function uses the Admin SDK, which bypasses security rules. Clients cannot write to Firestore directly. Signed-in admins (claim `kind == "user"`) may only **read** (listen to) `tables`, `tableSessions`, `orders`, `payments`, `reservations` and `inventoryItems`, for live screens. See [Data Model](doc:api/data-model).

**Next:** [Public API →](doc:api/public)
