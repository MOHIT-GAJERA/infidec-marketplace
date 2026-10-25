---
title: Achievement Badges
description: Milestone badges for drivers and riders, such as First Ride Hero or Five-Star Pro, with a level, what earns them and a threshold.
---

**Admin → Growth → Badges** (*"Achievement badges"*) is a list of milestones drivers and riders can unlock: a number of completed rides, a star rating, an earnings total or a low cancellation rate.

![Badges](/docs/go4ride/images/admin-badges.jpg "Admin → Growth → Badges")

Badges are stored in `achievement_badges`, sorted by threshold.

## Load the defaults

Filter tabs: **All / Performance / Achievement**. On an empty page click **Load 5 defaults**:

| Name | Level | Earned by | Threshold (≥) | For |
|---|---|---|---|---|
| First Ride Hero | Achievement | Completed rides | 1 | Driver |
| Ride Champion | Achievement | Completed rides | 100 | Driver |
| Earnings Expert | Achievement | Earnings milestone | 10000 | Driver |
| Five-Star Pro | Performance | Star rating | 4.8 | Driver |
| Always There | Performance | Low cancellation rate | 95 | Driver |

## Fields

| Field | Type | Options / notes |
|---|---|---|
| **Name** | Text, required | e.g. *Night Owl* |
| **Badge image** | Image | A square icon, PNG with transparency |
| **Level** | Select, required | **Performance** or **Achievement** |
| **Earned by** | Select, required | **Completed rides**, **Star rating**, **Earnings milestone**, **Low cancellation rate** |
| **Threshold (≥)** | Number, required | The value to reach: rides, stars (e.g. `4.8`), amount in ₹, or percent |
| **For** | Select | **Driver**, **Customer** or **Both** |
| **Active** | Switch | Hide a badge without deleting it |

:::note Badges in v1.0
v1.0 stores the badge catalogue only. No Cloud Function awards badges yet, and neither app displays them. The driver document has a protected `badges` field (drivers can't write it) ready for an awarding function. Set up your list now if you plan to add it.
:::

**Next:** [Commission, Wallet & Settlement →](doc:admin/commission-wallet)
