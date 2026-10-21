---
title: SMS Gateway & OTP
description: How phone OTP login works with Firebase Phone Authentication, and how to add an SMS provider for transactional SMS.
---

## Phone OTP login (Firebase)

Customers log in with their mobile number and a 6-digit OTP. QwikMart uses **Firebase Phone Authentication**, so there is no SMS provider to configure for login:

1. Firebase console → Authentication → Sign-in method → enable **Phone**.
2. Authentication → Settings → **SMS region policy** → allow the countries you sell in.
3. Register the **SHA-1 and SHA-256** fingerprints of every Android signing key (debug, upload and Play app-signing) — see [Login Methods & Phone OTP](doc:app-customer/auth-methods).

:::note Test numbers
Add fictional numbers with fixed codes (e.g. `+91 9876543210` → `123456`) under Sign-in method → Phone → *Phone numbers for testing*. No SMS is sent and no cost is charged. Remove them before launch — anyone who knows the number can log in to that account.
:::

## SMS gateway (optional)

**Admin → System Settings → SMS Gateway** (Super Admin only) sets the provider used for **transactional SMS** sent by Cloud Functions.

| Driver | Keys |
|---|---|
| Firebase Phone Auth | — (default; OTP only) |
| Twilio | Account SID, Auth Token, From Number |
| MSG91 | Auth Key, Template ID, Sender ID |
| Fast2SMS | API Key |
| 2Factor | API Key, OTP Template Name |
| Log only (testing) | — messages are written to the function log |

:::warning India: DLT registration
Indian operators deliver SMS only from **DLT-registered** sender IDs and templates. Register on your operator's DLT portal and use the approved template IDs, or messages are silently dropped.
:::
