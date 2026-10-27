---
title: Report Reasons & User Reports
description: Maintain the list of reasons users pick when they report an ad, and work through the reports queue by checking the ad, deactivating it and resolving or dismissing each report.
---

Two pages under **Admin → Reports**:

| Menu item | Page title | Firestore collection |
|---|---|---|
| **Report Reasons** | *Report Reasons* | `report_reasons` |
| **User Reports** | *User Reports* | `reports` |

Staff need the **reports** permission.

## How users report

On the website ad page, **⚑ Report this ad** (signed-in users only) opens a small form: a reason drop-down filled from your **Report Reasons** plus **Other**, and *Additional details (optional)*. It sends:

```json title="POST /api/v1/reports"
{ "type": "ad", "id": 42, "reason": "Fake Items", "details": "Same photos as another listing" }
```

- `type` can be `ad` or `user`; `reason` is the reason **text** (up to 150 characters), not an id.
- A user who already has an **open** report about the same item does not create a second one; the API returns the existing report.
- The answer is *"Report submitted. Thank you."*

The app has its own **Report this ad** dialog with fixed reasons: *Spam*, *Scam / fraud*, *Prohibited item*, *Offensive content*, *Other* (sent as `spam`, `scam`, `prohibited`, `offensive`, `other`). It does not load your Report Reasons list.

## Report Reasons

![Report reasons](/docs/classiadshub/images/admin-report-reasons.jpg "Admin → Reports → Report Reasons")

The **Add Reason** card is on the left, the list on the right.

| Field | Notes |
|---|---|
| Language tabs | Translate the reason into other active languages |
| **Reason (EN)** | Required. Keep it under 150 characters, the limit the report endpoint accepts |

Click **Submit**. To change a reason, click the edit icon: the card switches to **Edit Reason** with **Update** and **Cancel**. Delete asks *"Delete this reason? This cannot be undone."*

Reasons are public at `GET /api/v1/report-reasons` (active reasons in sort order). Existing reports keep the reason text they were sent with, so renaming or deleting a reason does not change old reports.

## User Reports

![User reports](/docs/classiadshub/images/admin-user-reports.jpg "Admin → Reports → User Reports")

Newest reports first. Two filters:

- **Status**: *Open*, *Reviewing*, *Resolved*, *Dismissed*.
- **Item**: *Advertisements* or *Users*.

| Column | Shows |
|---|---|
| **Reason** | The reason text |
| **User** | The user who reported |
| **Advertisement** | The ad title; *User #<id>* for a report about a user; *Removed* when the ad no longer exists |
| **Advertisement Image** | First ad image |
| **Advertisement Status** | Toggle: on = ad `approved`, off = ad `inactive` |
| **Report** | Report status badge |
| **Reported** | Date and time |
| **Action** | **View Ad** (eye), and for open reports **Mark resolved** (check) and **Dismiss** (cross) |

The *details* text the reporter typed is stored on the report and returned by the API, but it is not shown as a column.

### Actions

| Action | API | Result |
|---|---|---|
| **Advertisement Status** off | `POST /api/v1/admin/ads/{id}/status` with `inactive` | The ad is hidden from the website and the app (*"Ad deactivated."*) |
| **Advertisement Status** on | Same, with `approved` | The ad is live again (*"Ad re-activated."*); the seller gets the **"Ad approved"** notification |
| **Mark resolved** | `POST /api/v1/admin/reports/{id}/status` with `resolved` | Report closed, with your user id and time in `resolved_by` / `resolved_at` |
| **Dismiss** | Same, with `dismissed` | Report closed as not valid |

The reporter is not notified about the outcome. The `reviewing` status exists in the API (for example for a multi-step workflow in your own tools); the page offers resolve and dismiss only.

## Recommended workflow

:::steps
### Filter to open reports
Set **Status** to *Open*.

### Check the ad
Click **View Ad** to open the ad detail page with its images, description and seller.

### Act on the ad
If the report is valid, switch **Advertisement Status** off, or reject or delete the ad from the [ad detail page](doc:admin/ads#ad-detail). For repeat offenders, suspend the seller on the Customers page.

### Close the report
Click **Mark resolved**, or **Dismiss** when the report was not justified.
:::

The 10 newest reports also appear on the [Dashboard](doc:admin/dashboard) under **Recent Reports**.

**Next:** [Subscription Packages →](doc:admin/packages)
