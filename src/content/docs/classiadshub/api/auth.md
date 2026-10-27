---
title: Auth Endpoints
description: Register, login, OTP, password reset, profile, device registration, logout and account deletion. How the API and Firebase Authentication share the login.
---

The auth routes live in `functions/src/routes/auth.ts`, under `/api/v1/auth`. Sessions are **Firebase Auth sessions**: the API checks or creates the account and returns the e-mail to sign in with; the client signs in with the Firebase SDK and sends the ID token on every request.

## The login flow

:::steps
### Call the API
`POST /auth/login` with `login` (e-mail or phone) and `password`, or `POST /auth/register`.

### Read `auth_email`
The answer contains `data.user` and `data.auth_email`. For phone-only accounts this is the synthetic e-mail `p<digits>@phone.classiadshub.app`. `data.token` is always `null`.

### Sign in to Firebase
`signInWithEmailAndPassword(auth, auth_email, password)`.

### Call the API with the ID token
`Authorization: Bearer <await user.getIdToken()>` on every request.
:::

**Google and Apple** sign-in run entirely in the Firebase SDK (`signInWithPopup` on the website, provider sign-in in the app). Afterwards the client calls `GET /auth/me`: the API links the account to an existing user with the same e-mail or phone, or creates a new `customer`. `POST /auth/social/{provider}` only answers `410` with that hint.

## Endpoints

| Method | Path | Auth | Body / query | Returns |
|---|---|---|---|---|
| `POST` | `/auth/register` | Public | `name` (required, max 150), `email` (email, max 191), `phone` (max 32), `password` (required, min 8), `password_confirmation`. Either `email` or `phone` is required | `201` `{ user, auth_email, token: null, otp }`. Creates `users/{id}` (role `customer`) and the Auth user with uid = id, then sends an OTP to the e-mail or phone (`purpose: register`) |
| `POST` | `/auth/login` | Public | `login` (required: e-mail or phone), `password` (required), `device` (optional) | `{ user, auth_email, token: null }`. Updates `last_login_at`. `422` *These credentials do not match our records.*, `403` *Your account is suspended.* |
| `POST` | `/auth/otp/send` | Public | `identifier` (required), `channel` (`sms` · `email`), `purpose` (`register` · `login` · `reset` · `verify`) | `{ otp_id, debug_code }` |
| `POST` | `/auth/otp/verify` | Public | `identifier`, `purpose`, `code` (all required) | `{ verified: true }`. For `register` / `verify` it sets `email_verified_at` or `phone_verified_at` (and `emailVerified` in Firebase Auth). `422` *Invalid or expired code.* |
| `POST` | `/auth/password/forgot` | Public | `login` (required) | Always *If the account exists, a reset code has been sent.* When it exists, `data` is the OTP block (`purpose: reset`) |
| `POST` | `/auth/password/reset` | Public | `login`, `code`, `password` (min 8), `password_confirmation` | Sets the new Firebase password and revokes refresh tokens: *Password reset. Please log in again.* |
| `POST` | `/auth/social/{provider}` | Public | — | `410` *Sign in with the Firebase Auth SDK for this provider, then call GET /auth/me.* |
| `GET` | `/auth/me` | Signed in | — | The user with `seller_profile`, `address` and `login_type`. Provisions provider sign-ins on first call |
| `PUT` | `/auth/profile` | Signed in | JSON or multipart: `name`, `email`, `phone`, `address` (max 500), `preferred_language` (max 8), `preferred_currency` (max 8), file `avatar` (image ≤ 5 MB) | The updated user. E-mail and phone must stay unique. A new avatar replaces the old file in `avatars/{id}/` |
| `POST` | `/auth/logout` | Signed in | — | `Logged out.` (the client signs out of Firebase) |
| `POST` | `/auth/devices` | Signed in | `fcm_token` (required), `platform` (`android` · `ios` · `web`), `device_name` | `{ device_id }`. Upserts `user_devices/{id}` for push |
| `DELETE` | `/auth/account` | Signed in | `password` (required for password accounts) | Anonymises the profile (`Deleted User`, e-mail `deleted_<id>@deleted.local`, phone and address cleared, `status: banned`, `deleted_at`), deletes the avatar and the devices, deletes the Firebase Auth user. `422` *Password is incorrect.* |

## The user object

```json title="data.user"
{
  "id": 12,
  "name": "Asha Mehta",
  "email": "asha@example.org",
  "phone": "+919000000001",
  "avatar_path": "https://firebasestorage.googleapis.com/v0/b/your-project-id.firebasestorage.app/o/avatars%2F12%2F…?alt=media",
  "status": "active",
  "is_verified": false,
  "email_verified": true,
  "phone_verified": false,
  "preferred_language": "en",
  "preferred_currency": "USD",
  "roles": ["customer", "seller"],
  "seller_profile": { "id": 12, "display_name": null, "bio": null, "business_name": null, "website": null, "rating_avg": 4.5, "rating_count": 2, "member_since": "2026-10-01T10:00:00.000Z" },
  "created_at": "2026-10-01T09:58:12.000Z"
}
```

Public views of other users (ad sellers, reviewers, followers) hide `email` and `phone`.

## OTP codes

`functions/src/lib/otp.ts` creates a numeric code of *Code length* digits (4–8, default 6) that expires after *Expiry (minutes)* (default 10). Only the SHA-256 hash is stored in `otp_verifications`. Sending a new code for the same identifier and purpose closes the old one. A code allows **5 attempts**.

:::warning No SMS or e-mail is sent in v1.0.0
The code is only delivered when the OTP provider is **Test mode** (`otp.provider = log`): the API returns it as `debug_code`, and the website and the app show it. Every other provider choice (Firebase Phone Auth, Twilio, MSG91) stores the setting but sends nothing, and `debug_code` becomes `null`. Registration and login still work without a verified code, but **password reset needs the code**. Add an SMS / e-mail sender in `sendOtp()` before you switch off Test mode. See [Login, OTP & Notification Settings](doc:admin/otp-notifications).
:::

## Examples

```bash title="Register"
curl -X POST https://us-central1-your-project-id.cloudfunctions.net/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@example.org","password":"Secret123","password_confirmation":"Secret123"}'
```

```ts title="Login from a web client"
const r = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ login, password }),
}).then((x) => x.json());
await signInWithEmailAndPassword(auth, r.data.auth_email, password);
const token = await auth.currentUser!.getIdToken();   // send as Authorization: Bearer <token>
```

**Next:** [Catalogue & Content Endpoints →](doc:api/catalog)
