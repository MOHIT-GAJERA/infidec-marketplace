---
title: Drivers & KYC
description: The driver roster, document review with front / back images and expiry dates, per-document approve or reject, the overall KYC decision, and block / unblock.
---

**Admin → People → Drivers** has three pages. The **Drivers** group and **Pending approval** show a live badge with the number of drivers waiting for KYC review.

| Page | Shows | Subtitle |
|---|---|---|
| **All drivers** | Every registered driver | *"12 online · 3 awaiting KYC review"* |
| **Approved** | KYC status *approved* | *"12 online now"* |
| **Pending approval** | KYC status *pending* | *"Review uploaded documents, then approve or reject"* |

Drivers are added **automatically** when they finish the vehicle step in the Driver App. That creates `drivers/{uid}` and the `onDriverProfileCreated` function gives the account the `driver` role. Lists are sorted with pending KYC first, then the newest sign-ups.

![All drivers](/docs/go4ride/images/admin-drivers.jpg "Admin → People → Drivers → All drivers")

## Filters and toolbar

- **Search name, phone or plate**.
- On **All drivers**: KYC tabs **All / Pending / Approved / Rejected / Not submitted**.
- **Any status / Online / Offline**.
- **Export CSV**: Driver ID, Name, Phone, Vehicle, Plate, Status, Wallet, Rating, KYC, Joined.

## Driver table

| Column | Shows |
|---|---|
| **Driver** | Photo or initial, name and phone |
| **Vehicle** | Make, model and plate |
| **Status** | **Online** / **Offline** |
| **Wallet** | Wallet balance (can be negative for cash drivers who owe commission) |
| **Rating** | Average rating |
| **KYC** | *Approved*, *Pending*, *Rejected*, *Not submitted* (on Pending approval: *Unverified*) |
| **Joined** | Sign-up date |
| **Action** | **Review documents** on Pending approval, otherwise **View driver** |

## Review a driver

![Pending approval](/docs/go4ride/images/admin-drivers-pending.jpg "Pending approval: open Review documents")

The driver dialog has four parts:

**Profile**: Online / Offline, Name, Phone, Joined, Rating (or *No ratings yet*), Earnings, Wallet.

**Vehicle**: Make & model, Plate, Class, Year · colour and the Vehicle type the driver chose (or *"No vehicle added yet."*).

**Documents** (*"5 uploaded"*): one card per uploaded document, ordered like [Driver Documents](doc:admin/driver-documents):

- the document title and expiry: *Expires 12 Mar 2028*, *Expired 1 Jan 2026*, *No expiry*,
- a status pill (*Pending*, *Approved*, *Rejected*),
- thumbnails of the **Front** and **Back** (or the single photo). Click one to see it large. *"Preview unavailable"* means the file is missing or is a PDF,
- the rejection reason, when rejected,
- **Reject** and **Approve** buttons for that document.

**KYC decision**: the current status, a **Blocked** pill if blocked, and **Block / Unblock**, **Reject KYC** and **Approve KYC**.

:::steps
### Check each document
Open the images, compare names and numbers with the profile, check expiry dates.

### Approve or reject each document
**Approve** sets that document to `approved`. **Reject** asks for a **Reason** (*"Shared with the driver so they can resubmit"*) and sets it to `rejected` with the reason. The driver sees it on that document's card and can re-upload only that one.

### Make the KYC decision
**Approve KYC** calls the `reviewKyc` function: the driver's KYC becomes **approved** and they get a push *"KYC approved — You can now go online and accept rides."* **Reject KYC** asks for a reason, sets KYC to **rejected** and sends the reason in a push.
:::

![Driver waiting for review](/docs/go4ride/images/app-driver-review.webp "Driver App while KYC is pending")

:::warning Approve the documents and the driver
Document decisions and the KYC decision are separate. A driver can only go online when their **KYC status** is approved, so always finish with **Approve KYC**. Rejecting individual documents is the clearest way to tell a driver what to fix.
:::

:::note Rejection reason on the KYC decision
The reason you type for **Reject KYC** is sent in the push notification and saved as `kycRejectReason`. The v1.0 Driver App's documents screen shows a generic *"Your previous submission was rejected. Please re-upload and submit again."* plus any **per-document** reasons, so reject the specific documents as well.
:::

Approving KYC, rejecting KYC and approving payouts are **admin-only** Cloud Functions. A staff account gets *"Admin privileges required."*

## Block a driver

**Block** asks *"Block {name}? They will be signed out and unable to go online or accept rides until unblocked."* It sets `drivers.isBlocked: true`:

- the Driver App takes the driver **offline** and shows a blocked screen,
- `onRideCreated` never sends them ride requests.

**Unblock** reverses it.

## What a driver needs to receive rides

| Requirement | Where it is set |
|---|---|
| KYC **approved** | This page |
| Not **blocked** | This page |
| **Online** with location permission | The Driver App's online switch |
| Wallet ≥ **Minimum driver wallet to accept rides** | Settings → Driver & ride |
| Inside the **Search radius** of the pickup (for the push) | Settings → Driver & ride |

See [Dispatch](doc:admin/dispatch#how-ride-requests-reach-drivers) for the full matching rules and [Commission, Wallet & Settlement](doc:admin/commission-wallet) for how the driver wallet moves.

:::note Auto-approve
**Settings → Driver & ride** has *Require document verification* and *Auto-approve drivers*. They are stored, but no function acts on them in v1.0: every driver is approved by hand on this page.
:::

**Next:** [Online Drivers Map →](doc:admin/online-drivers)
