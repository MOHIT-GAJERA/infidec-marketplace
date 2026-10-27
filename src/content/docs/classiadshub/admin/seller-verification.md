---
title: Seller Verification
description: Define extra verification fields and review the identity documents sellers submit for the verified-seller badge, then approve or reject each request with a reason.
---

Sellers can ask for a **Verified** badge by uploading an identity document. Two pages under **Admin → Seller Management** handle this:

| Menu item | Page title | Firestore collection |
|---|---|---|
| **Verification Fields** | *Verification Fields* | `verification_fields` |
| **Seller Verification** | *Seller Verifications* | `verification_requests` |

Staff need the **sellers** permission.

## How a request is made

On the website (**Dashboard → Verification**) or in the app (**Profile → Get Verification Badge**), a signed-in user submits `POST /api/v1/verification` with:

| Input | Notes |
|---|---|
| `document_type` | `id_card`, `passport`, `driving_license` or `other` (the website offers *ID Card, Passport, Driving License*; the app sends `id_card`) |
| `document_number` | Optional |
| `front_image` | Required image |
| `back_image`, `selfie_image` | Optional images (the website asks for both, the app for the back image) |
| `field_<id>` | Optional values for your [verification fields](doc:admin/seller-verification#verification-fields) (text, or a file upload) |

The images are stored in the private Storage folder `kyc/<user id>/`. That folder is not publicly readable; the API stores a tokenised download URL that only appears in the user's own request and in the Admin Panel.

A user who is already verified gets *"Your account is already verified."*; a user with a pending request gets *"You already have a pending verification request."* After a rejection the user can submit again, and the website shows *Previous request rejected: <reason>*.

## Seller Verifications

*Review identity documents submitted for the verified-seller badge.*

![Seller verifications](/docs/classiadshub/images/admin-seller-verifications.jpg "Admin → Seller Management → Seller Verification")

Tabs: **Pending** (default), **Approved**, **Rejected**, **All**.

| Column | Shows |
|---|---|
| **Seller** | Avatar and name |
| **Document** | Document type, e.g. *id card* |
| **Number** | Document number or *-* |
| **Status** | *Pending*, *Approved* or *Rejected* |
| **Submitted** | Date and time |
| **Action** | Eye icon: opens the review dialog |

### Review a request

The **Verification request** dialog shows the seller, the status, **Document type**, **Document number**, every verification field value (file values show an **Open file** link), the rejection reason (if any) and the **Front**, **Back** and **Selfie** images. Click an image to open it full size in a new tab.

For pending requests the footer has two buttons:

| Button | What happens |
|---|---|
| **Approve & verify** | Request → `approved` (with reviewer and time). The user's `is_verified` is set to `true`, so the **Verified** badge appears on their ads, seller page and profile. The user gets **"You are verified!"** — *Your account has been verified. The verified badge is now on your profile.* |
| **Reject** | Asks for a **Reason** (*The seller will be notified with this reason.*). Request → `rejected` with `rejection_reason`. The user gets **"Verification rejected"** — *Your verification was rejected: <reason>* |

Both actions are written to the audit log (`verification.approved` / `verification.rejected`). The API endpoints are `POST /api/v1/admin/verifications/{id}/approve` and `/reject`.

:::note Removing a badge
The badge is the `is_verified` flag on the user document. Rejecting a later request does not remove it, and the Admin Panel has no button to take it away. To revoke a badge, set `is_verified` to `false` on the user in `users` with the Firestore console. Verified users have a ✓ next to their name on the Customers page (see [Customers & User Queries](doc:admin/customers)).
:::

## Verification Fields

*Extra fields sellers fill in when requesting the verified badge* — for example *Business name*, *Tax number* or *Proof of address*.

![Verification fields](/docs/classiadshub/images/admin-verification-fields.jpg "Admin → Seller Management → Verification Fields")

| Column | Shows |
|---|---|
| **Name** | Field name |
| **Type** | *Text Input*, *Number Input*, *Text Area*, *Dropdown*, *Radio*, *Checkboxes*, *File Input* |
| **Min Length** / **Max Length** | Character limits, or *-* |
| **Values** | Options for dropdown, radio and checkboxes |
| **Required** | *Yes* / *No* |
| **Active** | Toggle |
| **Action** | **Edit**, **Delete** |

**Create Verification Field** opens a dialog:

| Field | Notes |
|---|---|
| **Field Name** | Required, translatable. The value is stored on the request under this name |
| **Field Type** | Default *Text Input* |
| **Field Length (Min)** / **(Max)** | Shown for Number Input, Text Input and Text Area |
| **Field Values** | Shown for Dropdown, Radio and Checkboxes; one value per line |
| **Required** | Marks the field as required |
| **Active** | Only active fields are accepted and returned |

Active fields are public at `GET /api/v1/verification-fields`. When a request is submitted, the API reads `field_<id>` for each active field: uploaded files are stored in `kyc/<user id>/`, text values are checked against the min and max length.

:::warning Current limits
- The bundled website and app forms do not show your verification fields yet; they send only the document type, number and images. Add inputs named `field_<id>` (from `/verification-fields`) to collect them.
- **Required** is stored and returned, but the API does not reject a request with a missing required field. Enforce it in the form you build.
:::

**Next:** [Seller Reviews & Reports →](doc:admin/reviews)
