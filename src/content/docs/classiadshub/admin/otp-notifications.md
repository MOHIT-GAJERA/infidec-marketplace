---
title: Login, OTP & Notification Settings
description: How one-time codes work for registration and password reset, the OTP Provider Settings (and why test mode must be replaced before launch), and the Notification Settings switches.
---

Two settings pages control codes and notifications: **OTP Provider Settings** and **Notification Settings** (cards in **Admin → Settings**). The login itself (email/password, phone, Google) is described in [Login, Register & OTP](doc:app/auth) and [Accounts & Login](doc:web/accounts).

## Where OTP codes are used

The API issues a code (`functions/src/lib/otp.ts`) in three places:

| Flow | Endpoint | Channel |
|---|---|---|
| Registration | `POST /auth/register` | `email` if the user registered with an email, else `sms` |
| Forgot password | `POST /auth/password/forgot`, then `POST /auth/password/reset` | Email or SMS, depending on what the user typed |
| Any verification | `POST /auth/otp/send`, `POST /auth/otp/verify` | `sms` or `email` (purposes `register`, `login`, `reset`, `verify`) |

How codes behave:

- The code is random, **Code length** digits (4–8, default 6).
- Only a SHA-256 hash is stored, in the `otp_verifications` collection, with the expiry.
- Asking for a new code cancels the previous open code for the same identifier and purpose.
- A code is valid for **Expiry (minutes)** (default 10) and at most **5 attempts**.
- Verifying a registration code sets `email_verified_at` (and marks the Firebase Auth email as verified) or `phone_verified_at`.
- A successful password reset signs the user out on every device.

## OTP Provider Settings

*"Login and OTP providers"*. Group `otp`.

![OTP Provider Settings](/docs/classiadshub/images/admin-settings-otp.jpg "Settings → OTP Provider Settings")

| Field | Key | Notes |
|---|---|---|
| **Provider** | `provider` | **Test mode (show code in app)** (`log`), **Firebase Phone Auth** (`firebase`), **Twilio** (`twilio`), **MSG91** (`msg91`). Hint: *"Test mode returns the code to the app — switch off for production"* |
| **Code length** | `code_length` | 4–8 |
| **Expiry (minutes)** | `expiry_minutes` | Default 10 |
| **Twilio account SID** | `twilio_sid` | Saved as secret |
| **Twilio auth token** | `twilio_token` | Password field, saved as secret |
| **Twilio sender number** | `twilio_from` | Your Twilio number in E.164 format, e.g. `+10000000000` |

### Test mode (`log`)

The code is written to the Cloud Functions log (`[OTP:log] sms to … (register)`) **and returned in the API response** as `debug_code`. The website and the app fill the code in for the user, so registration and password reset work without any SMS or email service. This is the default.

:::danger Do not launch in test mode
In test mode **anyone** can ask `POST /auth/password/forgot` for a user's email or phone and receive the reset code in the response, then set a new password. Use test mode only on a demo or staging project.
:::

### Real delivery

For any provider other than `log`, the API stops returning the code, but **the shipped code does not send it anywhere yet**: `sendOtp()` stores the code and logs `[OTP:twilio] sms to …`, and there is no Twilio, MSG91, Firebase Phone Auth or email-sending call in the backend. If you switch the provider without adding delivery, users can no longer verify or reset their password.

To go live, add the delivery call in `sendOtp()`:

```ts title="functions/src/lib/otp.ts"
// after batch.commit():
if (provider === "twilio" && channel === "sms") {
  const sid = await setting("otp", "twilio_sid");
  const token = await setting("otp", "twilio_token");
  const from = await setting("otp", "twilio_from");
  // POST https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json
  // with To=identifier, From=from, Body=`Your code is ${code}` (Basic auth sid:token)
}
// for channel === "email", send the code with your email provider
```

Then redeploy the functions (see [Deploy the Backend](doc:installation/backend-deploy)). Store the provider secrets in this page (they are marked secret and never returned by `GET /config`) or in Secret Manager. MSG91 has no fields on this page; add its keys the same way if you use it.

:::tip Login without OTP
Login with email/phone and password, and Google sign-in, do not use OTP codes. Only registration verification and password reset depend on delivery.
:::

## Notification Settings

*"Push and email notifications"*. Groups `notifications` and `firebase`.

![Notification Settings](/docs/classiadshub/images/admin-settings-notification.jpg "Settings → Notification Settings")

| Field | Key | Effect |
|---|---|---|
| **Push notifications (FCM)** | `notifications.push_enabled` | Master switch. Off = no push is sent (broadcasts and automatic events). In-app notifications are still saved |
| **Email notifications** | `notifications.email_enabled` | Stored only. The backend sends no emails (see [Email Templates & SMTP](doc:admin/email-templates)) |
| **Notify on new chat messages** | `notifications.notify_new_message` | Stored only. Chat notifications are always sent |
| **Notify on offers** | `notifications.notify_offers` | Stored only. Offer notifications are always sent |
| **Web push VAPID key** | `firebase.vapid_key` | *"Firebase console → Project settings → Cloud Messaging → Web Push certificates"*. Same value as on [Firebase Settings](doc:admin/firebase-settings) |

If **Push notifications (FCM)** has never been saved, it counts as **on**.

:::note Web push
The shipped website does not register for web push, so the VAPID key is only needed if you add Firebase Messaging to the website. Push today goes to the Android/iOS app (see [Push Notifications (app)](doc:app/notifications)).
:::

To send a message yourself, use [Push Notifications](doc:admin/push-notifications).

**Next:** [Email Templates & SMTP →](doc:admin/email-templates)
