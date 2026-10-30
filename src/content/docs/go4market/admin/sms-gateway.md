---
title: SMS Gateway
description: Optional transactional SMS via Twilio, MSG91 or Fast2SMS for order updates and the delivery OTP, with templates, DLT fields and the smsOutbox queue.
---

Go4Market can send **transactional SMS** for order events, such as the delivery OTP when an order goes out for delivery. This is optional; without a provider, everything else works and SMS are simply skipped.

:::note Two different OTPs
Phone **sign-in** codes are sent by **Firebase Authentication**, not by this gateway. This page covers order SMS only.
:::

## Events that send SMS

| Event | Recipient | Variables |
|---|---|---|
| `placed` | Customer | `name`, `orderNo`, `amount` |
| `out_for_delivery` | Customer | `orderNo`, `otp` |
| `ready_for_pickup` | Customer | `orderNo`, `otp` |
| `delivered` | Customer | `orderNo` |
| `cancelled` | Customer | `orderNo`, `reason` |
| `withdrawal` | Seller or rider | `amount`, `status` |

All events also get `link`, `rider` and `name` where known. Numbers are normalised to E.164; numbers without a country code get `+91` (`SMS_DEFAULT_COUNTRY_CODE`).

## How it works

1. Order and withdrawal functions write a document to **`smsOutbox`** (`to`, `event`, `text`, `vars`, `orderId`, …).
2. The `onSmsQueued` trigger sends it through the configured provider, with up to 3 attempts for network, 429 and 5xx errors.
3. The document ends with a `status`: `sent`, `failed`, `skipped_no_provider`, `skipped_disabled` or `invalid_number`, plus `provider`, `providerMessageId` and `error`.

SMS never blocks or fails an order.

## 1. Choose a provider (server-side)

| Provider | `SMS_PROVIDER` | Secrets | `functions/.env` |
|---|---|---|---|
| **Twilio** | `twilio` | `TWILIO_API_KEY_SID` (`SK…`) and `TWILIO_API_KEY_SECRET`, or `SMS_AUTH_TOKEN` (account auth token) | `TWILIO_ACCOUNT_SID` (`AC…`), and `TWILIO_MESSAGING_SERVICE_SID` (`MG…`) **or** `TWILIO_FROM` (number or alphanumeric sender) |
| **MSG91** | `msg91` | `SMS_API_KEY` (authkey) | `MSG91_TEMPLATE_ID` (default Flow template) |
| **Fast2SMS** | `fast2sms` | `SMS_API_KEY` | `FAST2SMS_ROUTE=q` (quick, no DLT) **or** `dlt` + `SMS_SENDER_ID` + `FAST2SMS_TEMPLATE_ID`. India (+91) only |
| None | `none` or empty | – | Everything is recorded as `skipped_no_provider` |

Set the secrets, edit `functions/.env`, then redeploy the two functions that bind them:

```bash
firebase functions:secrets:set TWILIO_API_KEY_SID --project <your-project-id>
firebase functions:secrets:set TWILIO_API_KEY_SECRET --project <your-project-id>
firebase deploy --only functions:onSmsQueued,functions:getSystemStatus --project <your-project-id>
```

Unused SMS secrets must still exist with the value `unset`.

## 2. Turn SMS on (panel)

**Admin → Settings → Communication**:

- **Send SMS** (`sms.enabled`) must be **on**; otherwise messages end as `skipped_disabled`.
- **Active provider** shows what the server is using. **Fallback provider** is used only when `SMS_PROVIDER` is empty.
- **Sender ID / from number** and **DLT entity ID (India)**.
- In the **events matrix**, untick SMS for any event you do not want. Unset means on.

## 3. Templates and DLT (India)

Per-event templates live in `settings/communication.sms.templates.{event}`:

```json title="settings/communication → sms.templates.out_for_delivery"
{
  "enabled": true,
  "text": "Your order {{orderNo}} is out for delivery. Share OTP {{otp}} with the rider.",
  "msg91TemplateId": "<msg91-flow-id>",
  "dltTemplateId": "<dlt-template-id>",
  "fast2smsRoute": "dlt",
  "vars": ["orderNo", "otp"]
}
```

On DLT routes, the text must match your approved template exactly. `vars` gives the positional order for providers that use `var1…varN`.

## 4. Test

The communication page has a **test SMS** action. It creates an `smsOutbox` document with `test: true`, which is sent even when *Send SMS* is off. Check the document's `status` and `error`.

| Status | Meaning |
|---|---|
| `skipped_no_provider` | No `SMS_PROVIDER` / fallback, or the provider's secrets are `unset` |
| `skipped_disabled` | *Send SMS* is off, or the event is unticked |
| `invalid_number` | The number could not be normalised |
| `failed` | The provider refused; read `error` (often sender ID or DLT template mismatch) |

**Next:** [Push Notifications & Campaigns →](doc:admin/push-notifications)
