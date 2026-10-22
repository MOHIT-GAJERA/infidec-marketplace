---
title: Table Analytics & History
description: Dine-in performance for today, the last 7 or the last 30 days. Sessions, revenue, occupancy, busy hours, best and worst tables, per-table history, and CSV, Excel and PDF exports.
---

**Admin → Table Analytics** (*"Sessions, occupancy & table performance."*) measures how your dining room performs, based on **table sessions**: every time guests are seated (from the Floor, the POS, the Restaurant App or a QR order) until the bill is closed.

![Table analytics](/docs/go4foodie/images/admin-table-analytics.jpg "Admin → Table Analytics")

**Permission:** `view:reports` (**OWNER** and **MANAGER**). The same permission opens [Table History](#table-history).

## Period

Use the tabs **Today**, **Last 7 Days** and **Last 30 Days** (address `?days=1`, `7` or `30`; the default is Today). A period starts at midnight of the first day, in the backend's `LOCAL_TZ` timezone (see [Environment configuration](doc:installation/environment-configuration)). Sessions are counted by the time they were **opened**. Open sessions count up to now.

## Live stats

A bar with the current table states, independent of the period: **Total**, **Available**, **Occupied**, **Reserved**, **Cleaning**, **Out of Service**.

## Summary

| Card | Value |
|---|---|
| **Table Sessions** | Sessions opened in the period |
| **Customers** | Sum of guests |
| **Orders** | Orders on those sessions |
| **Revenue** | Sum of session totals (after discount, tax, service, tip) |
| **Avg Bill** | Revenue ÷ sessions |
| **Avg Guests/Table** | Guests ÷ sessions (1 decimal) |
| **Avg Dining** | Average session length, e.g. `54 min` |

## Busy Hours

A bar chart of sessions opened per hour, **10AM** to **9PM** (operating hours 10:00–22:00). The header shows the **peak hour** (e.g. *Peak 7:00 PM*) and the **peak weekday** (e.g. *Fri*), or — with no data.

## Top Tables and Needs Attention

| Top Tables (only tables with sessions) | Needs Attention (all tables) |
|---|---|
| **Highest Revenue** · **Most Used** · **Most Customers** · **Highest Avg Bill** · **Longest Occupied** · **Fastest Turnover** (shortest average dining time) | **Least Used** · **Lowest Revenue** · **Lowest Occupancy** |

Each shows *"Table N · value"* (e.g. *Table 4 · $1,240*, *Table 9 · 0 sessions*) or —.

## Customers, favourite items and payment methods

- **Customers**: **Served** (guests) and **Avg Spend** (revenue ÷ guests).
- **Favourite Items**: the 5 dishes ordered most at tables (*"No data yet."* when empty).
- **Payment Methods**: number of table payments by method (Cash, UPI, Credit Card…), most used first (*"No payments yet."*).

## Per-table performance

| Column | Meaning |
|---|---|
| **Table** | *Table N · name*. Click it to open the table's history |
| **Sessions**, **Customers**, **Orders**, **Revenue**, **Avg Bill** | As above, per table |
| **Avg Dining** | Average minutes per session |
| **Occupancy** | Bar + %: occupied minutes ÷ operating minutes (12 h × days), max 100 % |
| **Utilization** | % of seats used: average of guests ÷ capacity (each session capped at 100 %) |

Utilization uses each table's capacity, which is **4 seats** for tables created in the admin panel. See [Tables](doc:admin/tables).

## Export the table report

:::steps
### Pick the period
Click **Today**, **Last 7 Days** or **Last 30 Days**.

### Choose a format
Next to **Export**, click:

- **CSV**: downloads `table-performance.csv`
- **Excel**: downloads `table-performance.xls` (opens directly in Excel)
- **PDF**: opens a print-ready page titled **Go4Foodie — Table Performance** with *"N sessions · N customers · $X revenue"*. Choose **Save as PDF** in the print dialog.
:::

All three contain the per-table rows with these columns:

```text title="table-performance.csv"
"Table","Name","Sessions","Customers","Orders","Revenue","AvgBill","AvgDiningMin","OccupancyPct","UtilizationPct"
"4","Window","12","38","27","1240","103","61","42","79"
```

## Table History

![Table history](/docs/go4foodie/images/admin-table-history.jpg "Table Analytics → Table History")

**Table History** (*"Complete session timeline for a table."*, `/table-history/<tableId>`) lists every session of one table. Open it from the table link in the per-table list, or with **History** in the table's modal on the [Floor](doc:admin/floor). The default period is **Last 30 Days**. Switch with **Today / Last 7 Days / Last 30 Days**, and use **← Analytics** to go back.

- The header shows **Table N · name**, *N sessions*, *N guests*, *$X revenue* and *N min total occupied*.
- The timeline (newest first) shows, for each session:
  - date and time span, e.g. *Thu, Oct 22 · 7:05 PM – 8:12 PM*, or *(open)* with a red dot,
  - total,
  - guests, duration in minutes, waiter, *Paid · Mixed*,
  - items (`2× Truffle Risotto`),
  - an adjustments line *"Subtotal $120 · −$10 disc · +$9 tax · +$12 svc · +$5 tip"* when any adjustment was used.
- With no sessions in the period you see *"No sessions in this period."* An unknown table shows *"Table not found."*

**Export CSV** downloads `table-4-history.csv`:

```text title="table-N-history.csv"
"Date","Opened","Closed","Duration(min)","Guests","Waiter","Items","Subtotal","Discount","Tax","Service","Tip","Total","Payment","Status"
```

The **Items** column lists the dishes as `2x Truffle Risotto; 1x Tiramisu`.

:::tip Find slow tables
Sort your exported Excel file by **OccupancyPct**. Tables that stay low for 30 days are candidates for merging, moving or using as a waiting area.
:::

**Next:** [Notifications →](doc:admin/notifications)
