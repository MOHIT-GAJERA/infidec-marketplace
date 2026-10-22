---
title: Outlets
description: Your restaurant locations with manager, contact details and weekly revenue vs operational cost.
---

**Admin → Outlets** (`/outlets`) shows each of your locations with its manager, contact details and weekly revenue against operational cost. The page is **read-only**, and it has **no sidebar icon**. Open it by going to `https://admin.yourrestaurant.com/outlets` directly.

![Outlets](/docs/go4foodie/images/admin-outlets.jpg "Admin → Outlets")

**Permission:** `manage:outlets` (**OWNER** and **MANAGER**). Staff users who open the URL go back to the dashboard and see *"You do not have permission for that page."*

## Stats

| Tile | Value |
|---|---|
| **Total Outlets** | Number of outlets |
| **Active** | Outlets marked active |
| **Weekly Revenue** | Sum of every outlet's *current* week revenue |
| **Avg Margin** | `(revenue − cost) ÷ revenue` across all outlets, in % |

"Current week" means the **latest weekly entry** of each outlet's metrics.

## Outlet cards

Each card shows:

- **Name** and **location** (map-pin icon)
- Badge **Active** (green) or **Closed** (grey)
- **Revenue** and **Op. Cost** for the current week
- **Manager** name
- Margin pill, e.g. **+32% margin**. The pill is green at 0 % or more and red when the margin is negative. Margin = `round((revenue − cost) ÷ revenue × 100)`, or 0 when revenue is 0.

Click a card to open its detail.

## Outlet detail

The modal (titled with the outlet name) shows:

- the location and margin pill,
- **Address**, **Phone** and **Manager** rows,
- a **Revenue vs Operational Cost** line chart with one point per week (`W1`, `W2`, …). Revenue is the dark line, Cost is the orange line, and hovering shows *"Revenue : $x"* / *"Cost : $x"*.

## Where outlet data comes from

| Data | Firestore collection |
|---|---|
| Name, location, address, phone, manager, active flag | `outlets` |
| Weekly revenue and operational cost (`periodStart`, `revenue`, `operationalCost`) | `outletMetrics` |

You can't create or edit outlets in the admin panel or through the API. Outlets and their metrics come from your data import ([Data migration](doc:installation/data-migration)). To change them later, edit the documents in **Firebase console → Firestore Database** (field names as above; see [Data model](doc:api/data-model)). The Owner App reads the same list (`GET /api/mobile/staff/outlets`, `manage:outlets`). Several screens read the same data:

- the dashboard's **Outlets Operational Cost Vs Revenue** chart (latest metric per outlet). See [Dashboard](doc:admin/dashboard).
- [Reports](doc:admin/reports) → **Revenue by Outlet** (order revenue per outlet).
- new POS orders and new staff members are attached to the **first outlet**.

:::tip Single-location restaurant
With one outlet you can skip this page. Keep one active outlet so POS orders and staff have an outlet to attach to.
:::

**Next:** [Menu →](doc:admin/menu)
