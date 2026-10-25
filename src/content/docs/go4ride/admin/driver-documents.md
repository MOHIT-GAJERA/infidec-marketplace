---
title: Driver Documents
description: Decide which documents drivers must upload for verification, whether each one needs a front and back photo, and whether it needs an expiry date.
---

**Admin → Catalogue → Driver documents** (*"Documents drivers must upload for verification"*) is the list of documents a new driver uploads in the Driver App before you can approve them. You add, edit and remove document types here, and you review each driver's uploads in [Drivers & KYC](doc:admin/drivers).

![Document types](/docs/go4ride/images/admin-document-types.jpg "Admin → Catalogue → Driver documents")

Data lives in the `document_types` collection, sorted by display order.

## Load the defaults

On an empty page click **Load 5 defaults**:

| Title | Sides | Required | Needs expiry date | Order |
|---|---|---|---|---|
| Driving Licence | Front & back | Yes | Yes | 1 |
| Vehicle RC | Front & back | Yes | No | 2 |
| Vehicle Insurance | One side | Yes | Yes | 3 |
| Aadhaar Card | Front & back | Yes | No | 4 |
| PAN Card | One side | No | No | 5 |

These match common Indian requirements. Replace them with what your city or country requires.

## Table

| Column | Shows |
|---|---|
| **Title** | Document name |
| **Sides** | *One side* / *Front & back* |
| **Required** | Inline switch |
| **Needs expiry date** | Inline switch |
| **Display order** | Order in the Driver App |
| **Active** | Inline switch |

## Add or edit a document type

| Field | Type | Notes |
|---|---|---|
| **Title** | Text, required | e.g. *Police Clearance Certificate* |
| **Sides** | Select, required | **One side** (one photo, labelled *Photo*) or **Front & back** (two photos) |
| **Required** | Switch | Default on. The driver can't submit for review until every required document is complete |
| **Needs expiry date** | Switch | The driver must pick an expiry date (*"Set expiry date"*) |
| **Display order** | Number | *"Lower numbers show first."* |
| **Active** | Switch | Inactive types are not asked for |

## How the Driver App uses it

After the vehicle step, the driver sees **Verify your documents** (*"Step 2 of 2 — upload clear photos of each document."*). For every active document type:

1. A card shows the title, **Required** or **Optional**, and a status: *Not uploaded*, *Incomplete*, *Pending*, *Approved* or *Rejected*.
2. The driver takes or picks a photo for each side and sets the expiry date when needed. Photos go to Storage at `kyc/{driverId}/{documentId}_front.jpg` (and `_back`). Images and PDFs up to 10 MB are allowed.
3. **Submit for review** becomes available once every required document is complete (*"Submit becomes available once every required document is uploaded."*). Submitting sets the driver's KYC status to **pending** and adds them to **Drivers → Pending approval**.
4. If you **reject** a document, the driver sees your reason, re-uploads only that document and taps **Resubmit for review**. Approved documents are locked.

![Driver documents step](/docs/go4ride/images/app-driver-documents.webp "Driver App: one card per document type, with front / back and expiry")
![Under review](/docs/go4ride/images/app-driver-review.webp "After submitting, the driver waits for your decision")
![Rejected](/docs/go4ride/images/app-driver-rejected.webp "A rejected document shows your reason so the driver can fix it")

:::note Drivers can't approve themselves
Security rules let a driver change only **one** document per write and only as a *pending* upload. They can't set a document or their KYC to *approved*, and they can't touch money, rating, block or subscription fields. Only an admin can.
:::

:::tip A fresh project still works
If `document_types` is empty, the Driver App falls back to three built-in documents (*Driver's license*, *Vehicle photo* and an optional *Insurance*). Load or create your own list before you invite drivers.
:::

## Tips

- Adding a new required type doesn't revoke existing approvals: approved drivers keep their **approved** KYC status. Reject their KYC if you need them to upload the new document.
- Keep the list short. Every extra required document is another reason a driver gives up during sign-up.
- Use **Needs expiry date** for licences and insurance so you can see expired documents (they show *Expired* on the driver's review page).

**Next:** [Dashboard →](doc:admin/dashboard)
