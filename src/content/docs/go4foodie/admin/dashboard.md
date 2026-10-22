---
title: Dashboard
description: The Overview screen. KPIs, outlet cost vs revenue, top categories, employee status, recent orders, sales by order type, trending dish and POS activity, plus the editable Trending and Top Categories widgets.
---

**Admin → Overview** (`/dashboard`, *"Manage your restaurant & team members from here."*) is the first screen after sign-in. It sums up the whole restaurant on one page.

![Dashboard](/docs/go4foodie/images/admin-dashboard.jpg "Admin → Overview")

**Permission:** every signed-in admin role (**OWNER**, **MANAGER**, **STAFF**) can open it. It is also where users land when they open a page they are not allowed to see. The **edit** pencils on *Top Categories Item* and *Trending Menu Item* are shown only to users with `manage:menu` (Owner and Manager).

The dashboard loads its data when you open it. The numbers count up and the cards cascade in. To see new orders, open the page again. With **reduce motion** turned on in the operating system, the animations are skipped.

## Layout

On wide screens (1280 px and up) there is a main column and a 336 px right column:

| Main column | Right column |
|---|---|
| KPI row · Outlets Operational Cost Vs Revenue · Top Categories Item · Employee Status · Recent Orders · Sales & Order Types | Trending Menu Item · POS Activities |

Narrower screens stack the cards in one column.

## KPI row

| Card | Value | Icon |
|---|---|---|
| **Total Orders** (orange card) | Count of all orders | package |
| **Total Delivered** | Orders with status *Completed* | package-check |
| **Canceled Order** | Orders with status *Canceled* | package-x |
| **Total Revenue** | Sum of completed orders' totals | coins |

Each card has a trend pill with the caption *"Since last month"*.

## Outlets Operational Cost Vs Revenue

A line chart with one point per **outlet** (x-axis = outlet names):

- **Sells** (dark line) is the outlet's latest weekly revenue, and **Operational Cost** (orange line) is its latest operational cost, both from [Outlets](doc:admin/outlets) metrics.
- The big number above the chart is the **Revenue** total of all outlets.
- A shaded band highlights the outlets up to the one with the **highest cost**. Hovering shows a dashed guide line and `$12K`-style values.

## Top Categories Item

Three photo tiles with the category name and a big percentage.

- **Automatic:** the top 3 categories by quantity ordered, as a % of all items ordered, with a photo of a dish from that category.
- **Override:** you choose the three categories and percentages yourself (see below).

## Employee Status

A semicircle gauge of your [Staff](doc:admin/staff) duty status: **Total Employees → N** in the centre and a legend **On Duty** (green), **On Break** (amber) and **Absent** (red) with two-digit counts. Employees *Off Shift* count in the total but have no segment.

## Recent Orders

The three latest orders as cards: dish photo (or *"No image"*), customer name, **Order ID**, **Type** (Dine-in / Delivery / Pick-up), status badge and total. **View all** opens [Orders](doc:admin/orders). With no orders you see *"No orders yet."*

## Sales & Order Types

The share of orders by type: **Dine-in**, **Delivery**, **Pick-up** as percentages, with a three-colour bar.

## Trending Menu Item

A large photo of one dish with its name, subtitle, price (orange), star rating and the number ordered.

- **Automatic:** the dish ordered most (by quantity). The subtitle is the dish's tag, or *Popular*.
- **Override:** a dish you pick (subtitle = tag, or *Featured*).

## POS Activities

| Element | Value |
|---|---|
| **Total Sales →** | Revenue of completed orders, with a trend pill *"Since Yesterday"* |
| **Total Bills** | Number of orders |
| **AVG Value** | Average order total |
| **Peak Hour** | Hour with the most orders, e.g. `7.00 PM` (backend `LOCAL_TZ`) |
| **Payment Method** | Ticked gauge with the **Cash Payment** % in the centre and a legend **Card x%**, **Online x%** |

The payment split uses the payment method recorded on orders (cash / card / online). Table payments taken in the POS are counted in [Transactions](doc:admin/transactions) and [Table Analytics](doc:admin/table-analytics) instead.

:::note Display-only elements
These elements come from the original design and are **not interactive**: the **Weekly** and **Today's** filter pills, the arrow buttons on *Employee Status* and *Sales & Order Types*, the **eg: search here…** box in *Recent Orders* and **View Details** in *POS Activities*. All dashboard figures are **all-time**, and the trend pills are fixed sample values (+10 %, +7.5 %, −3.5 %, +7.5 %, +12 %), not calculated. For date-based numbers use [Table Analytics](doc:admin/table-analytics). To hide or change the pills, edit `admin-app/lib/pages/dashboard_page.dart` and `functions/src/services/queries.ts` (`getDashboardData`).
:::

## Feature a trending dish

:::steps
### Open the editor
Click the pencil on **Trending Menu Item** (*"Edit trending item"*). The modal is titled **Trending menu item**.

### Choose the dish
In **Featured item**, pick a dish from the list, or **Auto — most ordered**. *"Choose a dish to feature, or Auto to use the best-seller."*

### Save
Click **Save** (**Saving…**). The modal closes and the dashboard reloads with your choice.
:::

## Set the top categories

:::steps
### Open the editor
Click the pencil on **Top Categories Item** (*"Edit top categories"*). The modal is titled **Top categories**.

### Fill the three rows
Each row has a category drop-down (**— None —** + all your menu categories) and a percentage box **0–100 %**. The rows start with the current values.

### Save or reset
- **Save**: stores the rows that have a category (up to 3). Rows set to *— None —* are skipped.
- **Reset to auto**: removes the override and goes back to the calculated top 3.
- **Cancel**: closes without changes.
:::

Both overrides are stored in the Firestore document `dashboardConfig/default` (`trendingItemId`, `topCategories`). They apply to everyone who opens the dashboard and to the Owner App. Tile photos come from the first dish of each category. If saving fails (for example you lack `manage:menu`), the modal still closes and the dashboard simply shows the previous values.

## Dark mode

![Dashboard, dark theme](/docs/go4foodie/images/admin-dashboard-dark.jpg "Overview in the dark theme")

The moon / sun button in the top bar (*"Toggle theme"*) switches between light and dark themes for the whole panel. Charts redraw in the new colours, and the choice is remembered in the browser.

**Next:** [Staff →](doc:admin/staff)
