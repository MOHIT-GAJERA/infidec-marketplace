---
title: Seller Reviews & Reports
description: Moderate buyer and seller reviews, hide or delete them with automatic rating recalculation, and resolve reports that sellers file against reviews they received.
---

Two pages under **Admin → Seller Management** moderate reviews:

| Menu item | Page title | Shows |
|---|---|---|
| **Seller Review** | *Seller Reviews* | All reviews, filtered by direction |
| **Seller Review Report** | *Seller Review Reports* | Reviews that the reviewed user reported |

Both read the Firestore collection `reviews` (`GET /api/v1/admin/reviews`). Staff need the **sellers** permission.

## How reviews are created

Users leave a review from the website or the app with `POST /api/v1/reviews` (rating 1–5 and an optional comment up to 2000 characters). There are two directions:

| Type | Who reviews whom | Allowed when |
|---|---|---|
| `seller_review` | A buyer reviews a seller | The buyer has a conversation with the seller (for that ad) or the seller confirmed them as the buyer |
| `buyer_review` | A seller reviews a buyer | The seller confirmed this buyer for a sale (**confirm buyer** on a sold ad) |

- One review per reviewer, reviewee and ad. Sending again **updates** the existing review.
- Reviews are visible immediately (`is_approved: true`); there is no approval queue.
- The reviewed user gets a **"New review"** notification: *<name> left you a 4★ review.*
- After every change to a seller review, the seller's `seller_profile.rating_avg` and `rating_count` are recalculated from their **visible** seller reviews. These numbers show on the seller's public page.

The seller's public page lists visible seller reviews (`GET /api/v1/sellers/{id}/reviews`). Users see reviews they received on the website **Dashboard → Reviews** and in the app **Profile → Reviews**.

## Seller Reviews

![Seller reviews](/docs/classiadshub/images/admin-seller-reviews.jpg "Admin → Seller Management → Seller Review")

The **Review type** filter starts on **Buyer → Seller** (`seller_review`). Switch it to **Seller → Buyer** (`buyer_review`) or *All*.

| Column | Shows |
|---|---|
| **Seller Name** | The seller in the deal (for buyer reviews, the reviewer) |
| **Buyer Name** | The buyer in the deal |
| **Advertisement** | Ad title, or *-* |
| **Ratings** | Stars |
| **Review** | The comment. Long comments end with **View More**, which opens the full text |
| **Visible** | Toggle: show or hide the review |
| **Action** | Delete |

### Hide or delete a review

- **Visible** off calls `POST /api/v1/admin/reviews/{id}/approval` with `is_approved: false`. The review disappears from the seller page and from the reviewed user's list, and the seller rating is recalculated without it. The toast says *"Review hidden."*; switching it back on says *"Review published."*
- **Delete** asks *"Delete this review? The seller's rating is recalculated."* and removes the document for good.

Hiding is reversible; use it rather than deleting when you are unsure.

## Seller Review Reports

![Seller review reports](/docs/classiadshub/images/admin-review-reports.jpg "Admin → Seller Management → Seller Review Report")

This page lists every review that has a report status (`reported=1`).

| Column | Shows |
|---|---|
| **Seller Name** / **Buyer Name** | Reviewee and reviewer |
| **Advertisement** | Ad title |
| **Ratings** | Stars |
| **Review** | Comment |
| **Report Status** | *Reported* (open), *Approved* or *Rejected* |
| **Report Reason** | The reason given by the reporter |
| **Report Rejection Reason** | Your reason when you rejected the report |
| **Action** | Shown only for open reports: **Approve report** (check) and **Reject report** (cross) |

### Resolve a report

| Action | Dialog | Result |
|---|---|---|
| **Approve report (hide review)** | *"Approve the report? The review will be hidden."* | `report_status: approved` and the review is hidden (`is_approved: false`); the seller rating is recalculated |
| **Reject report** | *"Explain why the review stays published."* with a required **Rejection reason** | `report_status: rejected` with your reason; the review stays visible |

The endpoint is `POST /api/v1/admin/reviews/{id}/report` with `decision` (`approved` or `rejected`) and `reason`. The users are not notified of the decision.

### Who can report a review

Only the **reviewed** user can report a review about them, with `POST /api/v1/reviews/{id}/report` and a `reason` (up to 500 characters). This marks the review `report_status: reported`.

:::note Report button in the clients
The report endpoint is part of the API, but the bundled website and app have no **Report review** button yet. Reports come from your own integrations (or data migrated from the earlier version). See [Chat, Offers & Social Endpoints](doc:api/social).
:::

**Next:** [Report Reasons & User Reports →](doc:admin/reports)
