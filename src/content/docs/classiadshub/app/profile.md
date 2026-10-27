---
title: Profile, Verification & Account Deletion
description: The app's Profile tab and menu, Edit Profile, the verified-badge (KYC) request, Settings and Language, My Reviews, My Job Applications and in-app account deletion.
---

![Profile](/docs/classiadshub/images/app-profile.webp "My Profile")
![Edit profile](/docs/classiadshub/images/app-edit-profile.webp "Edit Profile")
![Verification](/docs/classiadshub/images/app-verification.webp "User Verification")

## My Profile

The **Profile** tab (`/profile`, title **My Profile**, login required), file `lib/features/profile/profile_screen.dart`.

| Part | Behaviour |
|---|---|
| Sign out (app bar icon) | Confirm dialog **Sign out** → signs out of Firebase and opens the login screen |
| User card | Avatar, name and email (or phone). Tap → **Edit Profile** |
| **Get Verification Badge** banner | Shown while the user is not verified: *Verify your account to build trust and increase buyer confidence across your listings.* Opens the verification wizard |

### Menu

| Item | Opens |
|---|---|
| **My Reviews** | `/reviews`, reviews other users left for you |
| **My Job Applications** | `/applications`, jobs you applied to |
| **Language** | `/language` |
| **Favorites** | `/favorites` ([Ad Details, Favorites & Sharing](doc:app/ad-detail#favorites)) |
| **Notifications** | `/notifications` ([Push Notifications](doc:app/notifications)) |
| **Followers & Following** | `/connections` ([Chat, Offers & Reviews](doc:app/chat-offers#followers-following)) |
| **Saved Searches** | `/saved-searches` ([Search, Categories & Nearby](doc:app/search#saved-searches)) |
| **Jobs** | `/jobs`, job list with **Apply Now** |
| **Blog** | `/blog` |
| **Settings** | `/settings` |
| **FAQs** | CMS page `faq` |
| **Share this App** | Copies the website link to the clipboard (*App link copied to clipboard*). The URL is hard-coded in `_shareApp()`; change it to your Play Store or website link |
| **Rate us** | A dialog *Loved the app? Leave us a 5★ on the Play Store / App Store.* with **Later** / **Rate now**. Both only close the dialog; add your store link to **Rate now** |
| **Contact us**, **About us**, **Terms & Conditions**, **Privacy Policy**, **Refund Policy** | CMS pages `contact`, `about`, `terms`, `privacy`, `refund` ([CMS Pages](doc:admin/pages)) |
| **Delete Account** | See [Delete account](#delete-account) |

:::note No plans or payments in the app
There is no subscription, featured-ad or transaction screen in the app. Sellers buy packages and featured ads on the website under **Dashboard → Subscriptions** ([Plans, Featured Ads & Checkout](doc:web/checkout)). The app only sees the result: the posting quota and the featured tag.
:::

## Edit Profile

Route `/profile/edit`, file `lib/features/profile/edit_profile_screen.dart`.

| Field | Saved to |
|---|---|
| Avatar (tap the photo) | Picked from the gallery (max 1024 px, 85% quality), uploaded as `avatar` |
| **Full Name** | `name` |
| **Email Address** | `email` |
| **Phone Number** | Country picker + number, saved as `phone` (for example `+918123456789`) |
| **Address** | `address` (also kept on the phone for the header) |
| **Notification** (switch) | **Phone only** (`pref_notifications_enabled`) |
| **Show Contact Info** (switch) | **Phone only** (`pref_show_contact_info`) |

**Update Profile** sends `PUT /auth/profile`: JSON, or multipart when a new avatar was picked. The app shows *Profile updated*.

:::warning Two switches have no effect yet
**Notification** and **Show Contact Info** are only stored on the phone. They are not sent to the API and no code reads them, so pushes keep arriving and contact details are not hidden. Users control push with the Android / iOS notification permission.
:::

## Verification badge (KYC)

Route `/verification` (**User Verification**), file `lib/features/verification/verification_screen.dart`. It first calls `GET /verification`:

| State | Screen |
|---|---|
| Already verified | **You are verified** — *The verified badge is on your profile.* |
| Request pending | **Under review** — *Your documents are being reviewed.* |
| Otherwise | The wizard below |

:::steps
### Intro
*For your security and to meet regulatory standards, we need to verify your identity. It will only take 2 minutes.* **Start Verification** or **Skip for later**.

### Step 1 of 2: Personal Information
**Full Name**, **Phone Number** and **Email Address**, pre-filled from the profile. **Continue**. These values are shown for review only; they are not sent with the request.

### Step 2 of 2: ID Verification
**ID Proof (Front)** (required), **ID Proof (Back)** (optional), each *PNG or JPG image, up to 5 MB*, and the **ID document number**. **Continue** submits.
:::

The request is `POST /verification` (multipart) with `document_type=id_card`, `document_number`, `front_image` and `back_image`. The files go to the private `kyc/<user id>` folder in Storage. Then the screen switches to **Under review**.

An admin approves or rejects it under **Seller Verifications** ([Seller Verification](doc:admin/seller-verification)). The user gets *You are verified!* or *Verification rejected* with the reason. When approved, `is_verified` is set and the red **VERIFIED** badge appears on the seller card of the user's ads.

:::note Admin-defined verification fields are website-only
The API accepts extra fields you define under **Verification Fields** (`field_<id>`) and a selfie image. The app sends only the ID document; users who must fill the extra fields should use the website ([User Dashboard](doc:web/dashboard)).
:::

## Settings

Route `/settings`:

| Row | Source | Saved to |
|---|---|---|
| **App language** | `GET /languages` | Phone (`pref_language`) and the profile (`preferred_language`) |
| **Preferred currency** | `GET /currencies` | Phone (`pref_currency`) and the profile (`preferred_currency`) |
| **About** | Fixed text *ClassiAds Hub — Version 1.0.0* | — |

The version text is hard-coded; update it in `settings_screen.dart` with each release.

## Language

Route `/language`: the active languages from `GET /languages` (managed in [Languages & Currency](doc:admin/languages)) with a flag, the code and an **RTL** tag for right-to-left languages. Tapping one saves it and shows *Language set to …*.

:::warning The app UI is English only
The chosen language is stored and sent to the profile as `preferred_language`, but the app has no translation files, and the currency choice does not convert prices. All app texts are English strings in the Dart code, and RTL layout is not switched. To translate the app, add Flutter localization (`flutter_localizations` + ARB files) and replace the strings.
:::

## My Reviews

Route `/reviews`: the reviews you received (`GET /reviews/received`), with the reviewer name, star rating, text and age. Empty: **No Data Found**. To write a review for someone else, open their seller profile ([Chat, Offers & Reviews](doc:app/chat-offers#write-a-review)).

## My Job Applications

Route `/applications`: your job applications (`GET /my/applications`) with job title, company, age and a status chip:

| Status | Colour |
|---|---|
| `submitted` | Amber |
| `reviewed` | Navy |
| `shortlisted` | Secondary |
| `hired` | Green |
| `rejected` | Red |

The status changes when the employer updates it; the user gets *Application update*. Apply for jobs from **Profile → Jobs → job → Apply Now** (optional **Cover letter**, `POST /jobs/:id/apply`). Empty list: *Browse jobs and apply — you'll see the status of each application here.*

## Delete account

**Profile → Delete Account** opens **Delete account?**: *This permanently anonymises your personal data and revokes all sessions. You will not be able to recover it later.*

| Field | Rule |
|---|---|
| **Password** | Required for accounts with a password. *Leave empty if you signed in with Google* |

**Delete** calls `DELETE /auth/account`. The API:

1. checks the password (for password accounts): *Password is incorrect.* on a mismatch;
2. anonymises the user: name *Deleted User*, email replaced, phone, address, social links and avatar removed, status `banned`, `deleted_at` set;
3. deletes the avatar file and all registered devices (no more push);
4. deletes the Firebase Auth user.

The app signs out and shows *Your account has been deleted.* Ads and messages stay, linked to the anonymised user.

:::tip Google Play requirement
Google Play requires in-app account deletion plus a web link. Use this menu item for the in-app part and the website profile page for the web part when you fill the **Data safety** form ([Release & Play Store](doc:app/deployment#data-safety)).
:::

**Next:** [Push Notifications →](doc:app/notifications)
