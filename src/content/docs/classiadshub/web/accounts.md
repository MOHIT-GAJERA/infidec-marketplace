---
title: Accounts & Login
description: How login, registration, OTP verification, password reset and Google sign-in work on the website, and how they map to the API and Firebase Authentication.
---

Website sessions are Firebase Authentication sessions. The API checks the credentials, then the browser signs in to Firebase. After that every API request carries the Firebase ID token. The session is kept in browser local storage, so users stay logged in across tabs and restarts until they sign out.

![Login](/docs/classiadshub/images/web-login.jpg "Login")
![Register](/docs/classiadshub/images/web-register.jpg "Register")
![Forgot password](/docs/classiadshub/images/web-forgot-password.jpg "Reset password")

## Login

`/login` — *Welcome back · Log in to your ClassiAds_Hub account*.

| Field | Notes |
|---|---|
| **Email or phone** | The e-mail address, or the phone number exactly as it was registered |
| **Password** | — |

Links: **Forgot password?** and **Create account**. Button: **Continue**.

:::steps
### The API checks the credentials

`POST /auth/login` with `{ login, password }`. The API finds the user by e-mail or phone and checks the password against Firebase Auth. Wrong details: *These credentials do not match our records.* A blocked account: *Your account is banned* (or the current status).

### The browser signs in to Firebase

The API returns `user` and `auth_email`. The website calls `signInWithEmailAndPassword(auth_email, password)`. For phone-only accounts `auth_email` is a synthetic e-mail generated from the phone number, so phone + password login works without SMS.

### The user is redirected

To the `next` URL (e.g. `/login?next=/post-ad`) or to `/`.
:::

On every page load `AuthProvider` (`src/context/auth-context.tsx`) calls `GET /auth/me` to load the profile. Only a 401 or 403 answer signs the user out. Network errors or 5xx are retried up to 3 times and do not end the session.

## Register

`/register` — *Create your account · Join ClassiAds_Hub to buy and sell*.

| Field | Required | Rules |
|---|---|---|
| **Full name** | Yes | Up to 150 characters |
| **Email** | One of email / phone | Must be unique (*The email has already been taken.*) |
| **Phone (optional)** | One of email / phone | Must be unique. Use one format consistently, e.g. `+15551234567` |
| **Password** | Yes | At least 8 characters |

Hint under the form: *Provide an email or phone — we'll send a verification code.* Field errors from the API show under each field.

What `POST /auth/register` does:

1. Creates the `users/<id>` document (`roles: ["customer"]`, `status: active`, `is_verified: false`, `login_type: email` or `phone`).
2. Creates the Firebase Auth user with the same uid and the e-mail (or the synthetic phone e-mail).
3. Sends a registration OTP to the e-mail (`email`) or phone (`sms`).
4. Returns `auth_email`. The website signs in immediately and opens `/verify-otp?identifier=…&purpose=register`.

## Verify OTP

`/verify-otp` — *Verify your account · Enter the code sent to …*.

- **Verification code** (*6-digit code*) and **Verify** → `POST /auth/otp/verify` with `{ identifier, purpose, code }`. On success the user's `email_verified_at` or `phone_verified_at` is set and the user goes to `/`.
- **Resend code** → `POST /auth/otp/send` (channel `email` when the identifier contains `@`, otherwise `sms`). The link changes to **Code resent**.
- Wrong or old code: *Invalid or expired code.*

The account is already signed in at this point. Verification marks the contact as verified; skipping it does not block login.

:::warning Test mode shows the code on screen
When **Admin → Settings → OTP Provider Settings → Provider** is *Test mode (show code in app)* (`log`), the API returns the code as `debug_code`. The website fills it in and shows a yellow *Dev mode — code: 123456* box on the verify and reset pages. Switch to a real provider (Firebase Phone Auth, Twilio or MSG91) before launch. See [Login, OTP & Notification Settings](doc:admin/otp-notifications).
:::

## Forgot password

`/forgot-password` — *Reset password*. Two steps on one page:

| Step | Fields | API |
|---|---|---|
| 1. *We'll send a reset code to your email or phone* | **Email or phone**, **Send reset code** | `POST /auth/password/forgot` — sends a `reset` OTP. The answer is the same whether or not the account exists |
| 2. *Enter the code and your new password* | **Reset code**, **New password** (8+), **Reset password** | `POST /auth/password/reset` — checks the code, sets the new Firebase password and revokes existing sessions |

After a successful reset the user is sent to `/login`. **Back to login** is available on both steps.

## Google sign-in

`AuthProvider` contains a `loginWithGoogle()` function (Firebase `signInWithPopup` with `GoogleAuthProvider`, then `GET /auth/me`, which creates the profile on first sign-in). **The login and register pages do not show a Google button yet.** To add one:

```tsx title="web/src/app/login/page.tsx (example)"
const { login, loginWithGoogle } = useAuth();
// …
<Button type="button" variant="outline" fullWidth
  onClick={async () => { await loginWithGoogle(); router.push(params.get("next") || "/"); }}>
  Continue with Google
</Button>
```

Enable **Google** in Firebase **Authentication → Sign-in method**, and add your website domain to **Authorized domains**, otherwise the popup fails.

## Sign out and account deletion

- **Sign out** in the avatar menu calls Firebase `signOut`. (`POST /auth/logout` exists but the website does not need it.)
- **Delete account** is on **Dashboard → Profile**. See [User Dashboard](doc:web/dashboard#profile-and-delete-account).

## Where users are managed

All website accounts appear in **Admin → Customers & Roles → Customers** ([Customers & User Queries](doc:admin/customers)). Blocking a user there makes `/auth/me` return 403, which signs the user out of the website on the next page load.

**Next:** [User Dashboard →](doc:web/dashboard)
