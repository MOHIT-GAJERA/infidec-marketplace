---
title: User Dashboard
description: Every page of the signed-in user dashboard — overview, ads, favourites, chat, notifications, subscriptions, transactions, reviews, job applications, verification and profile.
---

`/dashboard` is the private area for signed-in users. `src/app/dashboard/layout.tsx` guards every page: visitors without a session are sent to `/login?next=<current page>`. The left menu (on top on small screens) has:

**📊 Overview · 📦 My Ads · ❤️ Favorites · 💬 Chat · 🔔 Notifications · ⭐ Subscriptions · 🧾 Transactions · 🌟 Reviews · 💼 Job Applications · ✅ Verification · 👤 Profile**

The avatar menu in the header links to Dashboard, My Ads, Favorites, Chat and Subscriptions.

![Dashboard overview](/docs/classiadshub/images/web-dashboard.jpg "Dashboard → Overview")

## Overview

*Welcome back, <first name> 👋 — Manage your listings, messages and account.*

| Tile | Value | Opens |
|---|---|---|
| **My Ads** | Total of the user's ads (`GET /my/ads`, pagination total) | My Ads |
| **Unread Alerts** | `GET /notifications/unread-count` | Notifications |

Buttons: **+ Post a new Ad** and **View Subscription Plans**.

## My Ads

The list of the user's ads with **Edit**, **★ Boost**, **Mark sold**, **Renew** and **Delete**. Fully described in [Posting & Managing Ads](doc:web/post-ad#my-ads).

## Favorites

![Favorites](/docs/classiadshub/images/web-favorites.jpg "Dashboard → Favorites")

Ad cards from `GET /favorites`, most recently saved first. Empty: *No saved items — Tap the heart on any listing to save it.* To remove one, open the ad and press **♥ Saved**.

## Chat

![Chat](/docs/classiadshub/images/web-chat.jpg "Dashboard → Chat")

A two-pane inbox:

| Pane | Content |
|---|---|
| Conversation list (`GET /conversations`) | Avatar letter, other person's name, unread count badge, ad title, last message |
| Conversation (`GET /conversations/<id>`) | Header with the name, ad title and price. Messages: yours on the right in navy, theirs on the left in grey, system messages (offer accepted / rejected) in amber. Time ago under each |
| Composer | *Type a message…* and **Send** → `POST /conversations/<id>/messages` |

Opening a conversation reloads the list so the unread badge clears. The ad page's **Chat** button deep-links here with `?c=<conversationId>`.

Every message notifies the other person (*New message*, in-app and push on their devices).

:::note The chat refreshes on open, not live
The website loads messages when a conversation is opened and appends your own sent messages. It does not poll or stream new incoming messages. Click the conversation again to refresh. Offers appear as text messages; answering them is done in the Mobile App.
:::

## Notifications

![Notifications](/docs/classiadshub/images/web-notifications.jpg "Dashboard → Notifications")

`GET /notifications`, newest first. Unread items have a light navy background and a dot. **Mark all read** → `POST /notifications/read-all`.

Notifications are created by the backend, e.g. *New message*, *New offer*, *Offer accepted*, *New follower*, *New review*, *New job application*, *Payment successful*, *Payment refunded*, plus admin broadcasts from **Admin → Notification** ([Push Notifications](doc:admin/push-notifications)).

## Subscriptions

![Subscriptions](/docs/classiadshub/images/web-subscriptions.jpg "Dashboard → Subscriptions")

*Subscription Plans*. At the top, the current plan (from `GET /subscriptions/active`) with *Unlimited ads* or *N ads remaining*, the expiry date and a green **Active** badge. Below, one card per package from `GET /packages`: name, price, *✓ N ad listings* (or *Unlimited*), *✓ N days validity*, the description, and **Choose Plan**, which opens the checkout. See [Plans, Featured Ads & Checkout](doc:web/checkout).

## Transactions

![Transactions](/docs/classiadshub/images/web-transactions.jpg "Dashboard → Transactions")

*Transactions & Invoices* from `GET /transactions`. Each row: type (*subscription*, *featured ad*), invoice number (e.g. `INV-20261027-000042`) or `#<id>`, gateway code, time, total and a status badge — **completed** (green), **refunded** (red), **pending** / **failed** (amber).

Invoices are created automatically when a payment completes.

## Reviews

![Reviews](/docs/classiadshub/images/web-reviews.jpg "Dashboard → Reviews")

Two tabs: **received** (`GET /reviews/received`) and **given** (`GET /reviews/mine`, shown as *To: <name>*). Each review shows the stars, comment and time. Reviews are written on the seller profile ([Ad Details & Sellers](doc:web/ad-detail#write-a-review)).

## Job Applications

![Job applications](/docs/classiadshub/images/web-applications.jpg "Dashboard → Job Applications")

The jobs the user applied to (`GET /my/applications`): job title (links to the job), company, *applied 2d ago*, and the status badge — **submitted**, **hired** (green), **rejected** (red) or any other status the employer set.

## Verification

![Verification](/docs/classiadshub/images/web-verification.jpg "Dashboard → Verification")

Seller verification (KYC). `GET /verification` decides what is shown:

| State | Shown |
|---|---|
| Verified | *✔️ Your account is verified — You have the verified badge on your profile.* |
| Request pending | **Pending review** — *Your documents are under review…* |
| Not verified / rejected | The form. After a rejection, a red box *Previous request rejected: <reason>* |

| Form field | Required |
|---|---|
| **Document type** — *ID Card*, *Passport*, *Driving License* | Yes |
| **Document number (optional)** | No |
| **Front image** | Yes |
| **Back image (optional)** | No |
| **Selfie (optional)** | No |

**Submit for verification** → `POST /verification` (multipart). The files go to the private `kyc/<userId>/` Storage folder (not publicly readable). A `verification_requests` document is created with `status: pending`. Admins review it in **Admin → Seller Management → Seller Verification** ([Seller Verification](doc:admin/seller-verification)). Approval sets `is_verified` and the green check appears next to the user's name on ads and the seller profile.

:::note Extra verification fields
The API also accepts admin-defined fields from **Seller Management → Verification Fields** as `field_<id>`. The website form does not render them yet. Add inputs named `field_<id>` (text or file) to the form in `src/app/dashboard/verification/page.tsx` if you use them.
:::

## Profile and delete account

![Profile](/docs/classiadshub/images/web-profile.jpg "Dashboard → Profile")

*Edit Profile*:

| Field | Notes |
|---|---|
| Avatar — **Change photo** | Image file. Stored in `avatars/<userId>/`, the old one is deleted |
| **Full name** | — |
| **Email** | Must not belong to another user |
| **Phone** | Must not belong to another user |

**Save changes** → `PUT /auth/profile` (JSON), then a second multipart `PUT` for the avatar. Shows *Profile updated.*

:::warning Changing the e-mail here does not change the login e-mail
`PUT /auth/profile` updates the profile document only. The Firebase Auth e-mail used to sign in stays the same.
:::

### Danger zone — Delete account

**Delete account** asks *Delete your account permanently? This cannot be undone.*, then *Confirm your password to delete:*. `DELETE /auth/account`:

- checks the password (for password accounts);
- anonymises the profile (name *Deleted User*, e-mail `deleted_<id>@deleted.local`, phone, avatar and address removed, `status: banned`, `deleted_at` set);
- deletes the avatar file and the user's push devices;
- deletes the Firebase Auth user.

The user is signed out and sent to `/`. The user's ads are not deleted by this call.

**Next:** [Plans, Featured Ads & Checkout →](doc:web/checkout)
